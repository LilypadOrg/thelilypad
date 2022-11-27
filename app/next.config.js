const shouldAnalyzeBundles = process.env.ANALYZE === 'true';

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', '**.ipfs.nftstorage.link'],
  },
};

if (shouldAnalyzeBundles) {
  console.log('shouldAnalyzeBundles');
  console.log(shouldAnalyzeBundles);
  const withNextBundleAnalyzer =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('next-bundle-analyzer')();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
