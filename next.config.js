/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: 'loose',  serverActions: true, },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
