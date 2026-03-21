import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://159.194.196.47:8000/:path*'
      }
    ]
  }
};

export default nextConfig;
