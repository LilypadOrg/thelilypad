/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ytimg.com', 'i.imgur.com'],
  },
};

module.exports = nextConfig;
