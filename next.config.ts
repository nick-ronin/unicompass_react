import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
