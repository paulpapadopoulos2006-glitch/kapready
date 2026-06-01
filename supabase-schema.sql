-- ═══════════════════════════════════════════════════════════════════
--  KAP HOME BOOKING — Supabase Database Schema
--  Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── TABLE 1: pricing_config ──────────────────────────────────────────
CREATE TABLE pricing_config (
  key         TEXT PRIMARY KEY,
  value       NUMERIC(10, 2) NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO pricing_config (key, value, description) VALUES
  ('nightly_rate', 90.00, 'Nightly rate in EUR — editable from admin panel'),
  ('max_guests',    3.00, 'Maximum guests allowed');

-- ── TABLE 2: ical_sources ─────────────────────────────────────────────
CREATE TABLE ical_sources (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL UNIQUE,
  feed_url     TEXT        NOT NULL,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  last_synced  TIMESTAMPTZ,
  last_error   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE 3: blocked_dates ────────────────────────────────────────────
CREATE TABLE blocked_dates (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  date        DATE        NOT NULL UNIQUE,
  reason      TEXT        NOT NULL DEFAULT 'owner'
                          CHECK (reason IN ('owner','maintenance','airbnb','booking_com','other_ical')),
  source_uid  TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blocked_dates_date ON blocked_dates (date);

-- ── TABLE 4: reservations ────────────────────────────────────────────
CREATE TABLE reservations (
  id                       UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name               TEXT        NOT NULL,
  guest_email              TEXT        NOT NULL,
  guest_phone              TEXT,
  num_guests               SMALLINT    NOT NULL DEFAULT 1 CHECK (num_guests BETWEEN 1 AND 3),
  check_in                 DATE        NOT NULL,
  check_out                DATE        NOT NULL,
  num_nights               INTEGER     NOT NULL GENERATED ALWAYS AS (check_out - check_in) STORED,
  nightly_rate             NUMERIC(10, 2) NOT NULL,
  total_amount             NUMERIC(10, 2) NOT NULL,
  currency                 TEXT        NOT NULL DEFAULT 'EUR',
  stripe_session_id        TEXT        UNIQUE,
  stripe_payment_intent_id TEXT        UNIQUE,
  payment_status           TEXT        NOT NULL DEFAULT 'pending'
                                       CHECK (payment_status IN ('pending','paid','refunded','failed','cancelled')),
  status                   TEXT        NOT NULL DEFAULT 'pending'
                                       CHECK (status IN ('pending','confirmed','cancelled','completed')),
  booking_source           TEXT        NOT NULL DEFAULT 'direct'
                                       CHECK (booking_source IN ('direct','airbnb','booking_com','ical_import')),
  ical_uid                 TEXT        UNIQUE,
  special_requests         TEXT,
  internal_notes           TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

CREATE INDEX idx_reservations_dates  ON reservations (check_in, check_out);
CREATE INDEX idx_reservations_status ON reservations (status, payment_status);
CREATE INDEX idx_reservations_stripe ON reservations (stripe_session_id);

-- ── Auto-update trigger ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reservations_updated_at
  BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_ical_sources_updated_at
  BEFORE UPDATE ON ical_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ical_sources   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_pricing"      ON pricing_config FOR SELECT USING (true);
CREATE POLICY "public_read_blocked"      ON blocked_dates  FOR SELECT USING (true);
CREATE POLICY "public_read_res_dates"    ON reservations   FOR SELECT
  USING (status IN ('confirmed','pending') AND payment_status IN ('paid','pending'));
CREATE POLICY "public_create_reservation" ON reservations  FOR INSERT WITH CHECK (true);

-- ── Availability view (used by the booking calendar) ─────────────────
CREATE VIEW booked_ranges AS
  SELECT check_in, check_out, booking_source AS source
  FROM   reservations
  WHERE  status        IN ('confirmed', 'pending')
  AND    payment_status IN ('paid', 'pending')
  UNION ALL
  SELECT date AS check_in, (date + INTERVAL '1 day')::DATE AS check_out, reason AS source
  FROM   blocked_dates;
