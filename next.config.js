/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "arweave.net" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "walrus.tusky.io" },
      { protocol: "https", hostname: "suiexplorer.com" },
    ],
  },
};

module.exports = nextConfig;
