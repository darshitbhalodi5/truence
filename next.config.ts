import type { NextConfig } from "next";

const nextConfig = {
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
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
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
} as NextConfig;

export default nextConfig;