/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: (config) => {
    // Désactiver le HMR
    config.watchOptions = {
      poll: false, // Désactive le HMR
      aggregateTimeout: 300,
      ignored: /node_modules/,
    };
    return config;
  },
};

module.exports = nextConfig;
