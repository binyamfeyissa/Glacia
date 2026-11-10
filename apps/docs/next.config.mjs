/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["glacia", "glacia-tokens"],
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

