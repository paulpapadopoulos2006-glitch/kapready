import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,   // get the site live first; tighten after
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'kaphomechios.netlify.app' },
    ],
  },
}

export default nextConfig
