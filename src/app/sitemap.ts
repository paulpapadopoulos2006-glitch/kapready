import type { MetadataRoute } from 'next'

const BASE = 'https://kaphomechios.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE}/booking`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  ]
}
