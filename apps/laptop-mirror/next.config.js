/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@techgeo/ui', '@techgeo/common'],
  env: {
    NEXT_PUBLIC_GATEWAY_URL:
      process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_TRANSACTIONS_DISABLED:
      process.env.NEXT_PUBLIC_TRANSACTIONS_DISABLED ?? 'true',
  },
};

module.exports = nextConfig;
