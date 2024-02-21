/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    APP_URL: process.env.APP_URL,
  }
};

module.exports = nextConfig;
