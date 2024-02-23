/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['http://172.17.1.53:9027', 'http://localhost:9027'],
    },
  },
};

module.exports = nextConfig;
