/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next 14 + framer-motion 的標準配置
  // framer-motion 有 sideEffects: false,Next 14 預設會 tree-shake
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "arweave.net" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "walrus.tusky.io" },
      { protocol: "https", hostname: "suiexplorer.com" },
    ],
  },
  // 壓縮回應 (Vercel 預設有,但顯式寫出更清楚)
  compress: true,
  // 生產環境拿掉 source maps(節省 edge function size)
  productionBrowserSourceMaps: false,
  // 強制 HTTPS (Vercel 預設會 redirect,但加上更穩)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
