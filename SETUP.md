# KAP Home Booking Site — Setup Guide

## 5-Step Deploy Checklist

---

### STEP 1 — Supabase Database

1. Go to **supabase.com** → Open your project → Click **SQL Editor** → **New query**
2. Copy the entire contents of `supabase-schema.sql` and paste it in
3. Click **Run** (the green button)
4. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

### STEP 2 — Stripe Webhook

1. Go to **dashboard.stripe.com → Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://kaphomechios.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed` and `checkout.session.expired`
4. After saving, click the endpoint and copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

### STEP 3 — Generate Session Secret

Run this in any terminal (or use Node.js online):
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output → `ADMIN_SESSION_SECRET`

---

### STEP 4 — Deploy to Vercel

1. Upload this folder to a **GitHub repository** (free account works)
2. Go to **vercel.com → Add New Project → Import** your GitHub repo
3. Vercel auto-detects Next.js — just click **Deploy**
4. After deploy, go to **Project → Settings → Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Step 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | From Step 1 |
| `STRIPE_SECRET_KEY` | From dashboard.stripe.com → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From dashboard.stripe.com → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | From Step 2 |
| `ADMIN_PASSWORD` | `Pavlakis129` |
| `ADMIN_SESSION_SECRET` | From Step 3 |
| `NEXT_PUBLIC_SITE_URL` | `https://kaphomechios.com` |

5. Click **Redeploy** after adding env vars

---

### STEP 5 — Point Your Domain

1. In Vercel → Project → Settings → Domains → Add `kaphomechios.com`
2. Follow Vercel's DNS instructions (usually just changing 2 DNS records with your registrar)

---

## After Deploy

- **Admin panel:** `https://kaphomechios.com/admin` → passcode: `Pavlakis129`
- **Connect Airbnb iCal:** Admin → iCal Sync tab → paste your Airbnb iCal export URL
- **Connect Booking.com iCal:** Admin → iCal Sync tab → paste your Booking.com iCal export URL
- **Change nightly rate:** Admin → Pricing tab → enter new amount → Save

## Finding Your iCal URLs

**Airbnb:**
Airbnb → Listings → Your listing → Availability → Availability Settings → scroll to "Export Calendar" → Copy link

**Booking.com:**
Extranet → Property → Calendar → scroll to "iCal" or "Sync Calendar" → Export → Copy URL
