import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/uploads/**',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'api.rhhcinvoice.cloud',
        pathname: '/api/uploads/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },

   serverExternalPackages: [
    'puppeteer',
    '@sparticuz/chromium',
  ],
};

export default nextConfig;
