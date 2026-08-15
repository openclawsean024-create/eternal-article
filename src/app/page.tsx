import Link from "next/link";
import { CHAINS, CHAIN_ORDER } from "@/lib/chains";
import { ChainCard } from "@/components/ChainCard";
import { Hero } from "@/components/Hero";
import { DemoButton } from "@/components/DemoButton";
import {
  ArrowRightIcon,
  DatabaseIcon,
  LockIcon,
  ClockIcon,
  SparklesIcon,
} from "@/components/icons";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Hero />

      {/* 主鏈選擇區 */}
      <section className="mt-24" aria-labelledby="choose-chain">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2
              id="choose-chain"
              className="text-2xl md:text-3xl font-bold tracking-tight"
            >
              選擇一條鏈
            </h2>
            <p className="mt-2 text-sm text-white/45">
              每一條都能讓你的文章「永遠不會消失」
            </p>
          </div>
          <DemoButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CHAIN_ORDER.map((id, idx) => (
            <ChainCard key={id} chain={CHAINS[id]} index={idx} />
          ))}
        </div>
      </section>

      {/* 為什麼需要這個網站 — 3 pillars */}
      <section className="mt-24" aria-labelledby="why-section">
        <h2 id="why-section" className="sr-only">
          為什麼選擇 Eternal Article
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          <Pillar
            icon={<LockIcon className="w-6 h-6" />}
            title="真正的「永久」"
            color="text-sui"
            description="不是放在別人的伺服器上,而是寫進區塊鏈 — 由全球上千個節點共同備份,任何人都無法刪除。"
          />
          <Pillar
            icon={<DatabaseIcon className="w-6 h-6" />}
            title="你控制你的文字"
            color="text-arweave"
            description="沒有審核、沒有平台倒站風險、沒有言論審查。只要鏈還在,你的文章就在。"
          />
          <Pillar
            icon={<ClockIcon className="w-6 h-6" />}
            title="可驗證的時間戳"
            color="text-base"
            description="區塊鏈上有明確的「你何時發表」紀錄。拿來當作品集、智慧財產權證明、報導出處都好用。"
          />
        </div>
      </section>

      {/* Proof / Trust 區塊 — 數字 + 資訊 */}
      <section
        className="mt-24 rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12"
        aria-labelledby="proof-section"
      >
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-4 h-4 text-white/40" />
          <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
            為什麼選這個
          </span>
        </div>
        <h2 id="proof-section" className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
          比任何網站都難消失
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat
            number="3"
            label="條主鏈支援"
            sub="Sui · Arweave · Base"
          />
          <Stat
            number="200 KB"
            label="單篇上限"
            sub="足夠一篇長文"
          />
          <Stat
            number="$0.001"
            label="平均費用"
            sub="Arweave 100KB 內免費"
          />
          <Stat
            number="~30s"
            label="上傳時間"
            sub="錢包確認後"
          />
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 grid md:grid-cols-3 gap-4 text-sm">
          <Trust
            title="開源前端"
            detail="Next.js 14 + TypeScript,程式碼公開在 GitHub,可審核、可自架。"
          />
          <Trust
            title="錢包自主"
            detail="你的文章用你的錢包簽章,平台倒了文章也還在。"
          />
          <Trust
            title="零登入"
            detail="不用註冊帳號、不用 email,錢包就是身份。"
          />
        </div>
      </section>

      {/* 上手三步驟 */}
      <section className="mt-24" aria-labelledby="how-section">
        <h2
          id="how-section"
          className="text-2xl md:text-3xl font-bold tracking-tight mb-8"
        >
          三步開始
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          <Step
            num="01"
            title="選一條鏈"
            desc="看上方三張卡,選一條你喜歡的(Sui/Arweave/Base)。"
          />
          <Step
            num="02"
            title="貼上你的文章"
            desc="標題、作者(選填)、內容(Markdown)。不用裝錢包也能用 Demo 模式試。"
          />
          <Step
            num="03"
            title="拿到永久連結"
            desc="上傳後跳到一個 /r/[id] 頁面,任何人未來都能從這個網址讀到。"
          />
        </div>

        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            了解更多運作原理
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <footer className="mt-32 border-t border-white/5 pt-8 text-xs text-white/30 flex flex-wrap items-center justify-between gap-4">
        <div>Eternal Article · 把你的字寫在時間軸上。</div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-white/60 transition-colors">
            關於
          </Link>
          <a
            href="https://github.com/openclawsean024-create/eternal-article"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors inline-flex items-center gap-1"
          >
            GitHub
            <ArrowRightIcon className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </main>
  );
}

// =============================================================================
// Sub-components for the home page sections
// =============================================================================

function Pillar({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04] hover:border-white/10">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <h3 className="font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-white/55 leading-relaxed">{description}</p>
    </div>
  );
}

function Stat({
  number,
  label,
  sub,
}: {
  number: string;
  label: string;
  sub: string;
}) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold tracking-tight text-white font-mono tabular-nums">
        {number}
      </div>
      <div className="mt-2 text-sm font-medium text-white/80">{label}</div>
      <div className="mt-0.5 text-xs text-white/40">{sub}</div>
    </div>
  );
}

function Trust({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div>
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-white/55 leading-relaxed">{detail}</div>
    </div>
  );
}

function Step({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <div className="absolute -top-px left-6 inline-flex items-center px-2 py-0.5 rounded-b-md bg-white/5 text-xs font-mono text-white/40 tracking-wider">
        {num}
      </div>
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/55 leading-relaxed">{desc}</p>
    </div>
  );
}
