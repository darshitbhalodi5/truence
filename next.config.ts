import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all hosts for now - you should restrict this in production
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow larger file uploads
        source: '/api/upload',
        headers: [
          {
            key: 'Content-Type',
            value: 'multipart/form-data',
          },
        ],
      },
    ];
  },
  // experimental: {
  //   serverActions: true,
  // },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(pdf|doc|docx|txt)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;