import Stripe from 'stripe'

// No apiVersion specified — uses the SDK's bundled latest (always valid)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession({
  reservationId, nightlyRate, numNights, totalAmount,
  checkIn, checkOut, guestName, guestEmail,
}: {
  reservationId: string
  nightlyRate:   number
  numNights:     number
  totalAmount:   number
  checkIn:       string
  checkOut:      string
  guestName:     string
  guestEmail:    string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kaphomechios.com'

  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode:                 'payment',
    customer_email:       guestEmail,
    line_items: [{
      price_data: {
        currency:     'eur',
        unit_amount:  Math.round(totalAmount * 100),
        product_data: {
          name:        `KAP Home Chios — ${numNights} night${numNights > 1 ? 's' : ''}`,
          description: `Check-in: ${checkIn} · Check-out: ${checkOut}`,
          images:      [`${siteUrl}/images/hero-main.jpg`],
        },
      },
      quantity: 1,
    }],
    metadata: {
      reservation_id: reservationId,
      check_in:       checkIn,
      check_out:      checkOut,
      guest_name:     guestName,
    },
    success_url: `${siteUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${siteUrl}/booking?cancelled=true`,
    expires_at:  Math.floor(Date.now() / 1000) + 30 * 60,
  })
}
