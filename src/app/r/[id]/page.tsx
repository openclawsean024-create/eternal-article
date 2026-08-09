// Reader page server-side: 抓 ref + 拉 storage,生成動態 OG meta
// 因為這頁沒有 DB,我們用 base64 ID 裡的 ref 來生成 meta

import { Metadata } from "next";
import { CHAINS, type ChainId } from "@/lib/chains";
import { decodeArticleRef, gatewayUrl } from "@/lib/article";
import { ArticleReader } from "@/components/ArticleReader";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://eternal-article.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const ref = decodeArticleRef(params.id);
  if (!ref) {
    return {
      title: "Article not found",
      robots: { index: false },
    };
  }

  const chain = CHAINS[ref.chain as ChainId];

  // 嘗試 fetch storage 拿 title
  let title = `(Demo Article on ${chain.name})`;
  let description = "一篇永久保存的區塊鏈文章。";
  let ogImage = `${BASE_URL}/opengraph-image`;

  try {
    const url = gatewayUrl(ref);
    if (url) {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = (await res.json()) as {
          title: string;
          content: string;
          author?: string;
        };
        title = data.title;
        const contentPreview = data.content.slice(0, 160).replace(/\s+/g, " ");
        description = data.author
          ? `by ${data.author} — ${contentPreview}`
          : contentPreview;
      }
    }
  } catch {
    // Mock or fetch failed — fallback to default title
    if (ref.storage.startsWith("walrus:") || ref.storage.startsWith("ar-demo-") || ref.storage.startsWith("mock-")) {
      title = `(Demo) — ${chain.name}`;
      description = "這是一篇 demo 模式儲存的文章,未真實上鏈。";
    }
  }

  return {
    title,
    description,
    alternates: { canonical: `/r/${params.id}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${BASE_URL}/r/${params.id}`,
      siteName: "Eternal Article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: ref.storage.startsWith("walrus:") || ref.storage.startsWith("ar-demo-") || ref.storage.startsWith("mock-") ? false : true,
    },
  };
}

export default function ReadPage({ params }: { params: { id: string } }) {
  return <ArticleReader id={params.id} />;
}
