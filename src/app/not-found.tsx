import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="text-5xl mb-4">🧭</div>
      <h1 className="text-3xl font-bold mb-2">找不到這個頁面</h1>
      <p className="text-white/60 mb-8">
        你要找的文章不存在,或連結可能打錯了。
      </p>
      <Link
        href="/"
        className="inline-block px-5 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90"
      >
        回首頁
      </Link>
    </main>
  );
}
