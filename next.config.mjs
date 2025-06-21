/** @type {import('next').NextConfig} */
const nextConfig = {
     basePath: "/nabu-web",
     assetPrefix: "/nabu-web",
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    images: {
        unoptimized: true, // Disable default image optimization
    },
    webpack(config, { isServer }) {
        if (!isServer) {
          // Add polyfills if needed for browser-side code
          config.resolve.fallback = { fs: false };
        }
        return config;
      },
    // experimental: {
        
    //     esmExternals: false,
    //   },

};

export default nextConfig;
