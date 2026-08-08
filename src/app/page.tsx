import Link from "next/link";
import { CHAINS, CHAIN_ORDER } from "@/lib/chains";
import { ChainCard } from "@/components/ChainCard";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Hero />

      {/* 主鏈選擇區 */}
      <section className="mt-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            選擇一條鏈
          </h2>
          <span className="text-sm text-white/40">
            每一條都能讓你的文章「永遠不會消失」
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CHAIN_ORDER.map((id) => (
            <ChainCard key={id} chain={CHAINS[id]} />
          ))}
        </div>
      </section>

      {/* 為什麼需要這個網站? */}
      <section className="mt-24 grid md:grid-cols-3 gap-8 text-sm">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="text-2xl mb-2">⛓️</div>
          <h3 className="font-semibold mb-2">真正的「永久」</h3>
          <p className="text-white/60 leading-relaxed">
            不是放在別人的伺服器上,而是寫進區塊鏈 ——
            由全球上千個節點共同備份,任何人都無法刪除。
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="text-2xl mb-2">🔑</div>
          <h3 className="font-semibold mb-2">你控制你的文字</h3>
          <p className="text-white/60 leading-relaxed">
            沒有審核、沒有平台倒站風險、沒有言論審查。
            只要鏈還在,你的文章就在。
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="text-2xl mb-2">🔗</div>
          <h3 className="font-semibold mb-2">可驗證的時間戳</h3>
          <p className="text-white/60 leading-relaxed">
            區塊鏈上有明確的「你何時發表」紀錄。
            拿來當作品集、智慧財產權證明、報導出處都好用。
          </p>
        </div>
      </section>

      <footer className="mt-32 border-t border-white/5 pt-8 text-xs text-white/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          Eternal Article · 把你的字寫在時間軸上。
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-white/60">關於</Link>
          <a
            href="https://github.com/openclawsean024-create/eternal-article"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
