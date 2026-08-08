# Eternal Article — 永久上鏈文章網站 PRD

> 版本：v0.2 (MVP + 研究輸入對齊)
> 作者：Sean + Hermes Agent
> 建立日期：2026-08-09
> 更新日期：2026-08-09
> 目標：3 週內上線、可被任何人使用、無需註冊、無需下載錢包以外的東西。

> **2026-08-09 研究備註**：見 `RESEARCH_NOTES.md`(或 `/Users/sean/Hermes_Permanent_Article_Storage_Research_2026.md`,30KB / 469 行)。研究推薦的 3 條鏈為 **Arweave (Turbo SDK) + Base + Solana**;本研究 MVP 已實作的 **Sui + Walrus + Arweave + Base** 略不同,但都在「永久儲存」核心 OK,且 build 通過。差異寫進 §10 Roadmap。

---

## 0. 一句話定位

**「貼文章、按一個鍵、永久上鏈」**。一個讓不想搞懂區塊鏈的人也能把自己的文字、筆記、文章永久保存在主鏈上的入口網站。

---

## 1. 目標使用者 (Persona)

| Persona | 描述 | 主要需求 |
|---|---|---|
| **部落客/作家** | 想要 backup 自己的文章,怕平台倒站消失 | 「我貼一篇 → 拿到永久連結 → 之後誰都能讀」 |
| **研究者/記者** | 想把敏感的採訪記錄永久保存 | 「內容真的不會被刪,而且我可以證明 timestamp」 |
| **內容創作者** | 想有自己的 onchain 履歷,證明自己先發表了什麼 | 「這是我的作品集,任何人都能從鏈上驗證」 |
| **加密小白** | 從沒碰過鏈,但想試試看 | 「不要叫我裝錢包,裝了之後也不要叫我付 gas」 |

**共通點**:他們要的是「存東西 + 拿到一個永久網址」,而不是「成為幣圈專家」。

---

## 2. 三向同步摘要

| 項目 | 值 |
|---|---|
| 目錄 | `/Volumes/MyDsik(APFS)/Hermes Agent/Hermes Project/eternal-article/` |
| 預計 GitHub | `openclawsean024-create/eternal-article` |
| 預計 Vercel | `eternal-article-<hash>.vercel.app` |
| 主鏈(暫定,研究中) | Arweave + Sui/Walrus + Base + IPFS(實際敲定見 §5) |

---

## 3. 核心使用者流程 (P0, 必須完成)

### Happy Path — 一篇文章上鏈 7 步

```
[1] 進入首頁
    ↓
[2] 看到「三條主鏈」卡片(Sui / Arweave / Base, 每張卡有 logo + 一句話)
    ↓
[3] 點選其中一張卡
    ↓
[4] 進入該鏈的「上傳頁」,看到:
    - Title (必填)
    - Content (必填, markdown 純文字, max 200KB)
    - Author (選填)
    - 「Connect Wallet」按鈕(尚未連接時) 或「Connected: 0x12...abc」(已連接時)
    ↓
[5] 點選「Upload to <Chain>」按鈕
    - 第一次按: 跳出錢包簽章確認(MetaMask / Sui Wallet / Phantom)
    ↓
[6] 上傳中,頁面顯示狀態:
    - ⏳ Uploading to storage layer (IPFS / Walrus / Arweave)
    - ⏳ Anchoring on chain
    - ⏳ Waiting for confirmation
    ↓
[7] 完成 → 進入「成功頁」,顯示:
    - 「Your article is permanent!」標題
    - 永久連結(例如 `eternal-article.vercel.app/r/<id>`)
    - 交易 hash(可點擊到該鏈的 explorer)
    - 「分享」按鈕(複製連結 / Twitter / 直接 URL)
    - 「再做一篇」按鈕
```

### Non-Happy Path — 失敗也要能完成

| 情境 | 處理 |
|---|---|
| 沒裝錢包 | 顯示「請安裝 XXX Wallet」+ 安裝連結(每條鏈對應錢包) |
| 錢包餘額不足 | 顯示「需要 0.001 ETH / SUI / SOL」+ 連到該鏈 faucet |
| 上傳到儲存層失敗 | 自動 retry 一次,再失敗顯示「請重試」按鈕,文章保留在 textarea 不清空 |
| 鏈上交易失敗 | 同上 |
| Content 太大 | 上傳前 client-side 驗證 > 200KB 直接擋,顯示「目前上限 200KB」 |

---

## 4. 風格設計原則

### 4.1 整體

- **極簡 + 暗色為主**(參考 su.io / arweave.org / base.org)
- **英雄區塊大字 + 大留白**
- **無障礙友善**(鍵盤導航 + 對比度 AA + 螢幕閱讀器)
- **響應式**: mobile-first,桌面也好看

### 4.2 主鏈卡片設計

每張卡是個「主鏈的迷你肖像」,色彩採用主鏈官方配色:

| 鏈 | 配色 | 風格關鍵字 |
|---|---|---|
| Sui | 深海藍 + 青色光暈 | 流體、淺景深、星塵感 |
| Arweave | 黑底 + 橘紅點陣 | 永恆、像素、未來感 |
| Base | 深藍 + 藍色光暈 | 簡潔、開發者友善 |

### 4.3 字型

- 標題：`Inter Display` 或 `Satoshi`(幾何無襯線,現代感)
- 內文：`Inter`
- 等寬：`JetBrains Mono`(顯示 hash、地址)

### 4.4 互動元素

- 滑鼠 hover 時卡片有「微光掃過」效果
- 上傳中: 每個步驟用「脈衝 + 圖示」表示進行中
- 成功頁: 有簡單的「區塊鏈確認動畫」(小方塊一個一個落到鏈上)

---

## 5. 技術選型 (M1 上線版本)

### 5.1 主鏈選擇 — MVP 三條

| 鏈 | 永久性 | 摩擦 | 費用 | SDK 友善度 | 風格 |
|---|---|---|---|---|---|
| **Sui + Walrus** | Walrus epoch (可續約) | 低(Sui Wallet 友善) | $0.001 起 | ★★★★ | 超帥(深海藍+青色光暈) |
| **Arweave** | 200 年保證(endowment 機制) | **不需要錢包**(應用代付 Turbo credits) | $0.001-0.005/KB | ★★★★ | 帥(黑底+橘紅) |
| **Base + IPFS** | 靠 IPFS pinning + Base hash | 低(MetaMask 普及) | gas ~$0.01 + IPFS free | ★★★★ | 簡潔(深藍+藍光) |

**MVP 鎖定這三條**(每條涵蓋不同的「永久性光譜」):

1. **Sui + Walrus** — 最現代、視覺最強、適合「想試 Web3 新東西」的用戶
2. **Arweave** — 最穩定的「永久儲存」金字招牌,**應用代付**讓使用者無感
3. **Base + IPFS** — 最廣為人知(MetaMask + Coinbase Wallet),摩擦最低

### 5.2 SDK / 函式庫選用

| 鏈 | SDK | 文件 |
|---|---|---|
| Sui + Walrus | 直接呼叫 Walrus HTTP API(`PUT /v1/store`) | https://docs.wal.app/ |
| Arweave | MVP 用 `sha256` 模擬 tx hash;v0.2 接 `@ardrive/turbo-sdk`(瀏覽器 + 應用代付) | https://docs.ar.io/ardrive/turbo-sdk |
| Base + IPFS | IPFS 透過 Pinata REST API(若 `NEXT_PUBLIC_PINATA_JWT` 有設);Anchor 透過 viem + server-side signer | https://docs.pinata.cloud/, https://viem.sh/ |
| 錢包偵測 | Sui Wallet / ArConnect / MetaMask(window.sui / window.arweaveWallet / window.ethereum) | 原生 API |

### 5.3 前端

- **Next.js 14.2.35 (App Router)** + **TypeScript strict**
- **Tailwind CSS** + **framer-motion** 動畫
- **viem 2.x** (僅 server-side anchor tx 用,client 用原生 wallet API)
- **nodejs runtime** for API routes
- 字型:`Inter` (system font stack) + `JetBrains Mono` (hash/address)

---

## 6. 非目標 (Non-Goals, MVP 不做)

- ❌ 登入 / 帳號系統
- ❌ 付費 / 訂閱
- ❌ 編輯器(使用者自己用 Markdown 編輯,我們只接收純文字)
- ❌ 多人協作 / 版本控制
- ❌ NFT 鑄造(MVP 只存「文章」,不存「資產」)
- ❌ 自訂網域(MVP 統一 `eternal-article.vercel.app/r/<id>`)
- ❌ 文章編輯/刪除(鏈上不可變,介面也不提供)
- ❌ 全文搜尋引擎(MVP 用 `id` 直接訪問,不建索引)

---

## 7. 上線 DoD (Definition of Done) — M1

| 項目 | 標準 |
|---|---|
| ✅ 三條鏈(Sui / Arweave / Base)各能成功上傳一篇測試文 | 上傳後能在對應 explorer 查到 tx |
| ✅ 文章大小驗證(<=200KB),超過擋下 | 錯誤訊息清楚 |
| ✅ 錢包連接 + 餘額不足提示 | 三大鏈各測一次 |
| ✅ 失敗重試 + 文章不消失 | 上傳失敗後 textarea 內容保留 |
| ✅ 永久連結可分享 | 任何裝置開啟都能讀取該文章內容 |
| ✅ `tsc --noEmit` + `next build` + `npm run lint` 全部 exit 0 | (Next 16 已知 warnings 可接受) |
| ✅ Vercel production deploy 成功 | URL HTTP 200,age 在秒級 |
| ✅ GitHub repo + commit history 整齊 | commit message 清楚 |
| ✅ Notion page `更新日期` + `進度` 同步 | sync-3way.sh 自動 |
| ✅ 桌面 1440px + 手機 390px 都可用 | 主流程 + 視覺 OK |

---

## 8. 時程

| Sprint | 時間 | 工作 |
|---|---|---|
| **M1 (本週)** | 8/9 - 8/15 | PRD + 骨架 + 三鏈 P0 + 上線 Vercel |
| M2 | 8/16 - 8/22 | 統計頁(每鏈總上傳數) + 簡易分享卡 |
| M3 | 8/23 - 8/31 | 自訂網域 + SEO + 聯盟錢包(WalletConnect v2) |

---

## 9. 已研究確認(2026-08-09)

### ✅ 已知可用

- **Walrus HTTP API** (`PUT https://publisher.walrus.mainnet.walrus.space/v1/store?epochs=1`):
  - 直接 PUT blob,回 blobId,免錢包可呼叫(若應用代付 SUI/WAL)
  - 文件:https://docs.wal.app/
- **Pinata Free Tier** 有 1 GB 容量,適合 MVP demo
- **ArDrive 文件明確說「Uploads under 100 KB are free」(Turbo credits 補貼)** — 對 MVP 短文很友善

### ✅ 主鏈官網設計已研究

- Sui:深海藍+幾何 sans+3D 動畫(借鏡:gradient 光暈+漸層字)
- Arweave:黑底+serif+極簡(借鏡:配色)
- Base:白底+大字 hero+單一 CTA(借鏡:hero 結構)
- 細節見 `RESEARCH_NOTES.md`

### 🔄 待 v0.2 解

- [ ] **真正 Arweave 上傳**(目前 MVP 是 sha256 模擬 tx;v0.2 接 Turbo SDK 應用代付)
- [ ] **Sui 真 anchor tx**(目前直接用 Walrus blob id 作為永久 reference;v0.2 部署一個簡單的 anchor Move contract)
- [ ] **Base 真 anchor tx**(目前 server-side 是 keccak256 mock;v0.2 加 ANCHOR_SIGNER_PRIVATE_KEY 真發交易)
- [ ] **自訂合約 deployment**(未來 Base / Sui 上放一個輕量 anchor contract)

---

## 10. Roadmap

### M1 — 本週 (8/9 - 8/15)
- ✅ PRD
- ✅ Next.js 14 + Tailwind + framer-motion 骨架
- ✅ 三鏈 P0 流程(可能含 mock)
- ✅ 部署到 Vercel
- ✅ GitHub repo
- ✅ Notion 同步

### M2 — 8/16 - 8/22
- 接 **Turbo SDK** 做真實 Arweave 上傳(應用代付,使用者零摩擦)
- 把 Sui Walrus 的 txHash 改成真實的 Sui anchor transaction id
- 把 Base anchor 改成真發交易
- 文章「分享卡」生成器(OG image)
- 「我的上傳紀錄」頁(localStorage 記錄)

### M3 — 8/23 - 8/31
- **加 Solana**(研究推薦的主推之一)— 用 Metaplex Core + Umi + Phantom
- 自訂網域(`eternal.article` 之類)
- SEO 優化
- 聯盟錢包(WalletConnect v2 + RainbowKit)
- 把 mock 模式從 reader 頁拿掉

### M4+ — 9 月
- 部署自己寫的 anchor contract(若 Base 上有意義的合約可以上線)
- 公開 API(讓第三方應用可以呼叫)
- 統計儀表板(每鏈上傳數、總計)

---

**版本記錄**

- v0.2 (2026-08-09) — 加入研究備註 + SDK 選型對齊 + Roadmap
- v0.1 (2026-08-09) — MVP 簡版初稿
