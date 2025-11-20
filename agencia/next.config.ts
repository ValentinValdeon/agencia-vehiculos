/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { devTools: false },
  },
};

module.exports = nextConfig;
