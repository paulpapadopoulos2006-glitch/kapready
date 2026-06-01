export interface DateRange {
  from: Date | undefined
  to:   Date | undefined
}

export interface PricingConfig {
  nightly_rate: number
  max_guests:   number
}

export interface PriceSummary {
  nightlyRate: number
  numNights:   number
  total:       number
}

export interface ReservationInsert {
  guest_name:       string
  guest_email:      string
  guest_phone?:     string | null
  check_in:         string
  check_out:        string
  num_guests:       number
  nightly_rate:     number
  total_amount:     number
  currency:         string
  status:           'pending'
  payment_status:   'pending'
  booking_source:   'direct'
  special_requests?: string | null
}

export interface ReservationRow extends Omit<ReservationInsert, 'status' | 'payment_status'> {
  id:                        string
  num_nights:                number
  status:                    string
  payment_status:            string
  stripe_session_id?:        string
  stripe_payment_intent_id?: string
  internal_notes?:           string
  ical_uid?:                 string
  created_at:                string
  updated_at:                string
}

export interface BlockedRange {
  check_in:  string
  check_out: string
  source:    string
}

export interface ICalSource {
  id:          string
  name:        string
  feed_url:    string
  is_active:   boolean
  last_synced: string | null
  last_error:  string | null
  created_at:  string
}
