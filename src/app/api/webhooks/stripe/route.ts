import { NextRequest, NextResponse } from 'next/server'
import { stripe }                    from '@/lib/stripe'
import { createAdminClient }         from '@/lib/supabase/server'
import type Stripe                   from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? '',
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook verification failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const paymentIntent =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null

    await supabase
      .from('reservations')
      .update({
        status:                  'confirmed',
        payment_status:          'paid',
        stripe_payment_intent_id: paymentIntent,
      })
      .eq('stripe_session_id', session.id)
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    await supabase
      .from('reservations')
      .update({ status: 'cancelled', payment_status: 'cancelled' })
      .eq('stripe_session_id', session.id)
      .eq('status', 'pending')
  }

  return NextResponse.json({ received: true })
}
