/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    APP_URL: process.env.APP_URL,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['http://172.17.1.53:9027', 'http://localhost:9027'],
    },
  },
};

module.exports = nextConfig;
