import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        destination: 'http://62.217.177.48:8000/:path*'
      }
    ]
  }
};

export default nextConfig;
