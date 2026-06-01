import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'react-day-picker/style.css'
import 'yet-another-react-lightbox/styles.css'
import { PROPERTY } from '@/constants/property'

const BASE_URL = 'https://kaphomechios.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: PROPERTY.seo.title, template: '%s | KAP Home Chios' },
  description: PROPERTY.seo.description,
  keywords:    PROPERTY.seo.keywords.join(', '),
  authors:     [{ name: 'KAP Home', url: BASE_URL }],
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website', locale: 'en_US', url: BASE_URL, siteName: 'KAP Home Chios',
    title: 'KAP Home — Modern Apartment in Chios, Greece',
    description: 'Book directly. No Airbnb fees. 48 m² apartment in Chios Town centre, beach under 1 km.',
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: 'KAP Home Chios living space' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAP Home — Modern Apartment in Chios, Greece',
    description: 'Book direct. No hidden fees. Best price guaranteed.',
    images: ['/images/og.jpg'],
  },
  alternates: { canonical: BASE_URL },
}

export const viewport: Viewport = { themeColor: '#0F2137' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'LodgingBusiness',
  '@id':      BASE_URL,
  name:        PROPERTY.name,
  description: PROPERTY.description,
  url:         BASE_URL,
  telephone:   PROPERTY.host.phone,
  address: {
    '@type':          'PostalAddress',
    streetAddress:    'Chios Town Centre',
    addressLocality:  'Chios',
    addressRegion:    'North Aegean',
    postalCode:       '82100',
    addressCountry:   'GR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 38.3667, longitude: 26.1333 },
  image: PROPERTY.gallery.map(g => `${BASE_URL}${g.src}`),
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Credit Card',
  numberOfRooms: 1,
  aggregateRating: {
    '@type':      'AggregateRating',
    ratingValue:   4.97,
    reviewCount:   28,
    bestRating:    5,
    worstRating:   1,
  },
  amenityFeature: PROPERTY.amenities.map(a => ({
    '@type': 'LocationFeatureSpecification',
    name:     a.label,
    value:    true,
  })),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-cream">{children}</body>
    </html>
  )
}
