import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumb.cloud.mail.ru',
        pathname: '/weblink/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://212.67.15.151:8000/:path*'
      }
    ]
  }
};

export default nextConfig;
