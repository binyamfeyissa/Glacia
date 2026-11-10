/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["glacia", "glacia-tokens"],
};

export default nextConfig;

