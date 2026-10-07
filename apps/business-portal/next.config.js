/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@techgeo/ui', '@techgeo/common', '@techgeo/ledger-sdk'],
  env: {
    NEXT_PUBLIC_GATEWAY_URL:
      process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000',
  },
};

module.exports = nextConfig;
