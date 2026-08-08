import Link from "next/link";
import { CHAINS, CHAIN_ORDER } from "@/lib/chains";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link href="/" className="text-sm text-white/40 hover:text-white/70">
        ← 回首頁
      </Link>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mt-6">
        關於 Eternal Article
      </h1>

      <div className="mt-8 space-y-6 text-white/70 leading-relaxed">
        <p>
          一個讓你把文章<strong className="text-white">永久寫在區塊鏈</strong>上的網站。
        </p>
        <p>
          一般的網站可能被駭、被審查、被關站。
          但區塊鏈不一樣 ——
          一旦寫入,由全球上千個節點共同備份,任何人都無法刪除。
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">怎麼做到的?</h2>
        <p>
          每一篇文章實際上分成兩部分儲存:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong className="text-white">內容本體</strong> 寫到該鏈的儲存層(Walrus / Arweave / IPFS)
          </li>
          <li>
            <strong className="text-white">內容的雜湊(hash)</strong> 寫到主鏈上作為「時間戳證明」
          </li>
        </ol>
        <p>
          這代表即使儲存層有節點下線,只要任何一個節點還活著,你的文章就能被讀回來。
        </p>

        <h2 className="text-2xl font-bold text-white pt-6">支援的鏈</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {CHAIN_ORDER.map((id) => {
            const c = CHAINS[id];
            return (
              <div
                key={id}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
              >
                <div className={`font-bold ${c.gradientClass}`}>{c.name}</div>
                <div className="text-xs text-white/50 mt-1">{c.storage}</div>
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold text-white pt-6">常見問題</h2>
        <div className="space-y-4">
          <div>
            <div className="font-semibold text-white">需要付費嗎?</div>
            <div className="text-sm">
              視鏈而定。Sui/Arweave 大約 $0.001-$0.01;Base 需要 gas(約 $0.01)。
              MVP 階段我們先用 devnet/testnet 環境讓你免費試用。
            </div>
          </div>
          <div>
            <div className="font-semibold text-white">可以刪除嗎?</div>
            <div className="text-sm">不行。鏈上資料不可變,這也是「永久」的代價。</div>
          </div>
          <div>
            <div className="font-semibold text-white">會被審查嗎?</div>
            <div className="text-sm">
              本網站不審查內容,但會過濾明顯違法(兒少性影像、個資攻擊等)的內容。
              請自行承擔法律責任。
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90"
        >
          開始上傳
        </Link>
      </div>
    </main>
  );
}
