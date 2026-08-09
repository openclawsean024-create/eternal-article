import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://eternal-article.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Eternal Article — 文章永久上鏈",
    template: "%s · Eternal Article",
  },
  description:
    "貼一篇文章、把它永久寫進區塊鏈。支援 Sui + Walrus、Arweave、Base + IPFS。",
  keywords: [
    "永久儲存",
    "區塊鏈",
    "Sui",
    "Walrus",
    "Arweave",
    "Base",
    "IPFS",
    "permanent storage",
    "blockchain writing",
  ],
  authors: [{ name: "Sean" }],
  creator: "Sean",
  publisher: "Eternal Article",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: BASE_URL,
    siteName: "Eternal Article",
    title: "Eternal Article — 文章永久上鏈",
    description:
      "貼一篇文章、把它永久寫進區塊鏈。支援 Sui + Walrus、Arweave、Base + IPFS。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal Article — 文章永久上鏈",
    description: "貼一篇文章,把它永久寫進區塊鏈。",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060709" },
    { media: "(prefers-color-scheme: light)", color: "#060709" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
