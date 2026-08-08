import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eternal Article — 文章永久上鏈",
  description:
    "貼一篇文章、按一個鍵,把它永久保存在區塊鏈上。支援 Sui + Walrus、Arweave、Base + IPFS。",
  openGraph: {
    title: "Eternal Article",
    description: "貼文章,永久上鏈。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-ink-950 antialiased">
        <div className="bg-grid min-h-screen">{children}</div>
      </body>
    </html>
  );
}
