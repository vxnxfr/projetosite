/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  experimental: {
    // msnodesqlv8 é um addon nativo C++ — precisa ficar fora do bundle webpack
    serverComponentsExternalPackages: ['msnodesqlv8'],
  },
}

module.exports = nextConfig
