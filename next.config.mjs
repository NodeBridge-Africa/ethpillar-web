/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        stream: "stream-browserify",
        crypto: "crypto-browserify",
        buffer: "buffer",
      };
    }

    // Handling native modules for SSH
    if (isServer) {
      // For server-side, we need to add these modules to the externals
      config.externals = [
        ...(config.externals || []),
        "ssh2",
        "pino-pretty",
        "lokijs",
        "encoding",
      ];
    }

    // Add rule to handle native modules
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
      exclude: /node_modules\/ssh2/,
    });

    return config;
  },
};

export default nextConfig;
