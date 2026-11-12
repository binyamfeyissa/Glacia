/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  ...(isProd ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
  // glacia-native resolves React Native at runtime and falls back to DOM
  // elements when it is absent, so the docs can render the real native
  // components in a browser. It still has to be transpiled, and its optional
  // RN imports have to resolve to nothing rather than break the build.
  transpilePackages: ["glacia", "glacia-tokens", "glacia-native"],
  // The workspace links packages by source, and Next 15.5's persistent webpack
  // cache can resolve a stale module graph across builds — which surfaces as
  // "Invariant: no direct app page entry found for /_not-found". Disabling the
  // cache for this app keeps every build resolving the real entry points.
  webpack: (config, { webpack }) => {
    config.cache = false;
    // React Native and react-native-svg are optional peers of glacia-native.
    // The docs deliberately do not install them: the components detect that and
    // render DOM equivalents, which is what makes a live preview possible.
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": false,
      "react-native-svg$": false,
    };
    return config;
  },
};

export default nextConfig;
