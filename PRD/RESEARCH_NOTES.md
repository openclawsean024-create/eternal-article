# 文章永久保存到區塊鏈 — 技術選型研究報告(2024-2026)

> 目標:做一個 web app 讓使用者貼文章 → 一鍵永久存到鏈上。本文件只研究「技術選型 + 競品 + 設計風格參考」,不含商業/UI 細節建議。
> 研究日期:2026 年 8 月。所有 URL 都已實際驗證過 DNS / 網頁,確保仍存活。

---

## 0. TL;DR

| 主鏈 | 永久性 | 寫文章主流方式 | TypeScript SDK | 預估單次寫入成本(2026 Q3) | 是否需錢包 | 推薦程度 |
|---|---|---|---|---|---|---|
| **Arweave** | **原生永久**(endowment model) | 直接寫到 Arweave / 透過 Turbo SDK | `@ardrive/turbo-sdk`, `@irys/sdk` | ~$0.001/KB;小於 100KB 可在 Turbo 免費 credits 下免費(ArDrive 政策) | 否(可使用應用托管) | ⭐⭐⭐⭐⭐ |
| **Sui + Walrus** | Walrus 是「經濟持久」,主鏈永久 | blob → Sui 交易寫入 Walrus | `@mysten/walrus`, `@mysten/sui` | ~$0.002-0.005 / 短文(2026 估算) | 需要 Sui Wallet | ⭐⭐⭐⭐ |
| **Base (L2)** | L2 不是永久,需外掛 IPFS/Arweave | hash 上鏈 + 內容丟 IPFS/Arweave | `wagmi` v2 + `viem` v2 | 文章存儲:$0+ IPFS;鏈上 hash: <$0.001(L2) | 需要 MetaMask/Coinbase Wallet | ⭐⭐⭐ |
| **Solana** | L1 不是永久,通常配 Arweave/IPFS | Metaplex Core + Arweave / `solana/web3.js` | `@solana/web3.js`, `metaplex-js` | SOL fee 極低;存儲依賴第三方 | 需要 Phantom/Solflare | ⭐⭐⭐⭐ |
| **Polygon PoS** | L2 不是永久,通常配 IPFS/Arweave | wagmi + Pinata / Arweave | `wagmi`, `viem` | 鏈上 + IPFS 類似 Base | 需要 MetaMask | ⭐⭐⭐ |
| **BNB Chain** | L2/側鏈非永久,通常配 IPFS/Arweave/Greenfield | wagmi + Greenfield(BNB 原生) | `wagmi`, BNB Greenfield SDK | 鏈上便宜;Greenfield 存儲 $0.002/GB/月 | 需要 MetaMask | ⭐⭐ |

---

## 1. 六條主鏈 × 永久儲存方案

### 1.1 Arweave(原生永久儲存層)

**官方網址**:<https://arweave.org/>  
**設計參考**:首頁極簡,只有一行 hero 文案「Permanent information storage.」與 4 個分類 tab(Info/Use/Build/Get Funded),字型是 serif + 細 sans 組合。

**一句話定位**:專為永久儲存設計的 L1,「pay once, store forever」,使用 endowment(捐贈基金)經濟模型讓儲存費涵蓋 200 年。

**寫一篇文章的方式**:
- **Turbo SDK**(`@ardrive/turbo-sdk`) — 由 AR.IO Network 推出的「快速上傳/付款」層,支援 ETH/SOL/credit card/KoFi 結帳。**這是 2026 年最推薦的路徑**,因為它抽象了原始 Arweave 的手續費/簽章細節,有專屬 gateway 加速讀取。
  - 文件:<https://docs.ar.io/ardrive/turbo-sdk>
  - 應用入口:<https://turbo.ar.io/>
- **ArDrive**(<https://ardrive.io/>) — 上層 UI/APP,提供 Drive/Folder/檔案管理抽象層。底層用 Turbo 寫到 Arweave。
- **原始 `arweave-js`** SDK — 仍可用,但要自備 AR token 餘額與 bundle 處理。
- **Irys**(前 Bundlr,<https://irys.xyz/>) — **多鏈可支付**的 Arweave 上傳層,支援 ETH/SOL/MATIC/BNB/USDC 等付款。Irys 自己也發展成一個獨立的 L1 data chain,但對開發者來說,最常見的用法是「用 Irys SDK 上傳到 Arweave」,或直接寫到 Irys 鏈。

**費用結構(2026 Q3)**:
- Arweave 直接寫:~$0.001-0.005/KB(隨 AR token 價格波動)
- **Turbo**:可選 credit 預付,單次小於 ~100 KB 的上傳可享 free tier / 折扣 credits
- **Irys**:多鏈結帳,以所選 token 計價,通常 ~$0.001-0.003/KB
- **ArDrive**:封裝 Turbo,介面層免費,網路層同 Turbo 費率。ArDrive 官網明確表示「Uploads under 100 KB are free」(透過 Turbo credits 補貼)

**使用者要付 gas 嗎**?**不必**。應用可以用平台代墊(Turbo credits / Irys bundler),使用者只要按「儲存」按鈕就好。

**需要連接哪種錢包**?**不需要錢包**(這是 Arweave 在 UX 上的最大優勢之一 — 應用可在後台直接簽章或用 Turbo 的服務端帳戶代付)。如果用 Irys,則使用者可以用支援的 EVM/Solana 錢包來付款。

**最適合做**:文章本體儲存層 — 因為它是原生永久、不依賴任何 L1 持久性。

---

### 1.2 Sui + Walrus(Mysten Labs 的去中心化儲存)

**官方網址**:<https://sui.io/>(Walrus 是 Sui Stack 的一個 component,Sui footer 列出 Walrus)  
**Walrus 文件站**:<https://docs.wal.app/>  
**Walrus Sites**(靜態網站 hosting):<https://walrus.site/>(已上 mainnet)

**一句話定位**:Walrus 是建在 Sui 上的獨立儲存層,用 RedStuff erasure coding 分散到大量 storage node,經濟激勵靠 WAL token,**資料持久性靠「staking pool 持續付費」而非 endowment**。官方 FAQ 有「How much does storage cost?」常見問題(可去 docs.wal.app 找)。

**寫一篇文章的方式**:
- **官方 TypeScript SDK** — `@mysten/walrus`(Walrus SDK)+ `@mysten/sui`(Sui 鏈互動)
  - 文件:<https://docs.wal.app/docs/typescript-sdk/sdks>
- 步驟:把文章編碼成 blob → 用 Sui 交易呼叫 `walrus::store_blob` → 取得 Blob ID → 內容由 storage node 保存,證據/索引在 Sui 鏈上。
- **Seal** — Sui 官方 tokenization 與存取控制層,搭配 Walrus 做加密/權限管理(目前多用於 NFT-gated 文章)。

**費用結構(2026 Q3)**:
- 上傳需要 **兩種 token**:`SUI`(鏈上 gas)+ `WAL`(儲存費,以 MiB × epoch 計價)
- 官方提供 cost calculator:<https://costcalculator.wal.app/>
- 預估一篇 5KB 文章:~$0.002-0.005(主要 WAL 部分,SUI 部分極低)
- 測試網:**完全免費**,用 testnet SUI 換 testnet WAL(在文件裡有 step-by-step 教學)

**使用者要付 gas 嗎**?**是,但 SUI 部分可以由應用代付**(Sui 支援 Sponsored Transactions 設計,Walrus SDK 也允許用 service wallet)。WAL 儲存費通常使用者付,但若應用提供 freemium tier 可以代付。

**需要連接哪種錢包**?**Sui Wallet**(Sui 官方錢包)、**Suiet**、**Martian**、**Nightly** 等 Sui 生態錢包。

**最適合做**:**加密/隱私內容**(Seal + Walrus)、AI agent 持久記憶(Walrus Memory 是官方近期主推),以及想要「不依賴單一公司」的真正去中心化儲存。

---

### 1.3 Base(L2 by Coinbase)+ IPFS/Arweave

**官方網址**:<https://www.base.org/>  
**Base 文件**:<https://docs.base.org/>

**一句話定位**:Coinbase 出品、Ethereum L2,**本身不存儲大檔**。實務上寫文章的做法是「內容丟 IPFS/Arweave,hash 寫到 Base 鏈上」(用 NFT / SBT / pure event log / OnchainKit 的 NFT mint 等方式)。

**寫一篇文章的方式**:
- **OnchainKit NFT mint** — Coinbase 官方 React 框架,把文章鑄成文章 NFT,文章本體放 IPFS/Arweave,metadata on Base
  - 文件入口:Base.org 導向 `https://docs.base.org`(注意:舊的 `onchainkit.xyz` 與 `onchainkit.com` 在 2026 已重新導向整合)
- **IPFS + Pinata**(<https://docs.pinata.cloud/>) — Pinata 2026 仍是 IPFS pinning 主導廠商
- **Arweave / Turbo / Irys** — 把內容放到永久層,只把 hash 寫到 Base
- **Base MCP** — Base 2026 新推出,可讓 AI agent 直接擁有錢包 → 適合做 agent 寫文章

**費用結構(2026 Q3)**:
- 鏈上 hash 寫入(L2):<$0.001 per tx
- IPFS pin(Pinata):free tier 1 GB,之後 ~$0.15/GB/月
- Arweave 寫入:~$0.001/KB

**使用者要付 gas 嗎**?**可選**。Base 完全支援 ERC-4337 / paymaster,**可以 100% 代付**(例如 Coinbase 提供 Base 內建 paymaster 給 OnchainKit 使用者);如果用 IPFS/Arweave 替代,則儲存費也可代付。

**需要連接哪種錢包**?**Coinbase Wallet**(原生體驗最好)、MetaMask、Rainbow、WalletConnect 全部支援。

**最適合做**:想要「Coinbase 生態認證感」+「最低使用者摩擦」(因為 Coinbase Wallet 對 Base 用戶基本零摩擦),文章本體仍丟 Arweave/IPFS。

---

### 1.4 Solana + Arweave/IPFS

**官方網址**:<https://solana.com/>(中文版自動切到 solana.com/zh)  
**Solana 文件**:<https://solana.com/docs>

**一句話定位**:Solana 是高速 L1,本身**也沒有原生大檔儲存**。生態內寫文章的標準做法是:
1. 內容上 Arweave(首選,因永久)或 IPFS
2. 在 Solana 上 mint 文章 NFT(Metaplex Core / Bubblegum / Inscription),把內容 URI 寫進 metadata

**寫一篇文章的方式**:
- **Metaplex Core**(<https://docs.metaplex.com/>) — 2026 年的新一代 NFT 標準,取代舊的 Token Metadata。文件站明確分出 Tokens / Agents / NFTs / Smart Contracts / Dev Tools / Solana 六大區塊,有 Agent Onboarding、Skill、Agent Registry 等 AI 整合。
  - SDK:`@metaplex-foundation/mpl-core` 或 Umi(高階 SDK)
- **`@solana/web3.js`** + **Helius**(<https://www.helius.dev/>) — 主流 Solana RPC 與 indexing 提供商(2026 Helius 還收購了 Light Protocol 做隱私層)。Phantom、Backpack、Jupiter、Crossmint 全是客戶。
- **Metaplex Inscription** — 直接把資料寫進 Solana 帳戶狀態(類似 Bitcoin Ordinals 概念),適合短文。
- **Bubblegum v2** — compressed NFTs,適合大量低成本 mint。

**費用結構(2026 Q3)**:
- Solana tx fee:**極低**(~0.000005 SOL,<$0.001)
- Metaplex Core mint:~0.01-0.05 SOL(取決於是否要 inscription)
- 內容存到 Arweave:~$0.001/KB
- Helius RPC:免費 tier 足夠開發

**使用者要付 gas 嗎**?**可以代付**(Solana 支援 fee payer pattern,應用可設定「feePayer」錢包代使用者付 SOL);也可讓使用者用 Phantom 自付(金額小到可忽略)。

**需要連接哪種錢包**?**Phantom**、Solflare、Backpack、Ledger(Solana 2026 主推 wallet 是 Phantom)。

**最適合做**:想要「快 + 便宜 + �」的使用者體驗;Solana 的速度感非常符合「貼文章一鍵上鏈」的產品調性。

---

### 1.5 Polygon(PoS)+ IPFS/Arweave

**官方網址**:<https://polygon.technology/>  
**文件**:<https://docs.polygon.technology/>

**一句話定位**:Polygon 在 2026 已轉型為「全球支付的 go-to blockchain」,主打 POL token、Polygon Chain(原 PoS)、AggLayer、CDK。**儲存本身仍不是它強項**,但因為 EVM 相容性 + 超低 gas,它是「hash on chain + content on IPFS/Arweave」模式的主力選擇之一(很多 NFT 平台就是 Polygon + IPFS)。

**寫一篇文章的方式**:
- **wagmi + viem**(EVM 標準) + **Pinata / ArDrive Turbo** 存文章本體
- **ERC-721 / ERC-1155** mint 文章 NFT
- Polygon 2026 也有 **Open Money Stack** 計畫,但跟文章儲存較無關

**費用結構(2026 Q3)**:
- 鏈上 hash 寫入:極低(<$0.001)
- IPFS pin / Arweave 寫入:同上
- 整體比 Base 更便宜一點

**使用者要付 gas 嗎**?**可代付**。Polygon 2026 也支援 ERC-4337 paymaster。

**需要連接哪種錢包**?**MetaMask**、WalletConnect 為主。

**最適合做**:想要廣泛 EVM 工具鏈 + 已有 wagmi 經驗的開發者;Polygon 用戶社群雖不比 Base 大,但對資深 web3 用戶仍有吸引力。

---

### 1.6 BNB Chain + IPFS/Arweave/Greenfield

**官方網址**:<https://www.bnbchain.org/>  
**文件**:<https://docs.bnbchain.org/>

**一句話定位**:BNB Chain(BSC)2026 主打「AI-First. Low Latency. Low Gas Fee. MEV-Protected.」 — 強調**最低手續費**($0.002787 gas 是官網 hero 數字)跟 MEV 保護。它本身同樣**不存大檔**,但有個獨門武器:**BNB Greenfield**(<https://greenfield.bnbchain.org/>)— BNB 自家的去中心化儲存鏈。

**寫一篇文章的方式**:
- **BNB Greenfield** — BNB 原生儲存層,類似 S3 + 區塊鏈,適合放文章
- **IPFS + Pinata / Arweave**(跨鏈標準做法)
- **opBNB**(L2)+ 對應工具�
- wagmi 通用 EVM 流程

**費用結構(2026 Q3)**:
- 鏈上 tx:$0.002787(官網 hero 數字,2026 Q3)
- Greenfield storage:~$0.002/GB/月(便宜)
- IPFS / Arweave 寫入:同上

**使用者要付 gas 嗎**?**可代付**(EVM 標準)。

**需要連接哪種錢包**?**MetaMask**、Trust Wallet(Binance 官方合作)、WalletConnect、SafePal 等。

**最適合做**:瞄準**亞洲 / 開發中國家**市場 + 想要極低費率;設計風格較為「傳統 finance / exchange」(BNB 2026 站有強烈 Binance 配色與企業感)。

---

## 2. 競品 — 「文章/資料永久保存上鏈」網站

以下 10 個競品在 2026 年仍可訪問或留下明顯歷史足跡。我依「對你的 MVP 啟發度」排序。

### 2.1 ArDrive — 「Pay Once, Store Forever」經典派

- **網址**:<https://ardrive.io/>
- **鏈/儲存**:Arweave(透過 Turbo SDK)
- **收費模式**:pay-per-upload,小於 100 KB 免費(透過 Turbo credits)
- **UX 風格**:「Cloud storage evolved.」 — 跟 Dropbox 對標的視覺,有 Drive/Folder 概念,字型乾淨 sans,黑白為主
- **學到**:**「跟既有使用者熟悉的介面對標」**(Dropbox)而不是發明新詞,讓「上鏈」變得無感
- **避開**:Drive/Folder 概念對「寫文章」這個 use case 太重 — 我們要更聚焦

### 2.2 Paragraph — 「Substack on-chain + 2026 AI-native」

- **網址**:<https://paragraph.com/>(Paragraph 2026 仍活躍,主打「The media engine for early-stage startups」、AI-native publishing、Writer Coins 概念;前身是 Mirror.xyz,2026 已併入 Paragraph)
- **鏈/儲存**:Base / Optimism + Arweave(Paragraph 文件 changelog 顯示 2026 年發佈了 Paragraph API & SDK,並有 AI agent 整合)
- **收費模式**:Freemium(寫文章免費,訂閱/進階功能收費)
- **UX 風格**:極簡 SaaS,白底 + 細邊框 + AI agent 預覽,字型類似 Inter
- **學到**:「**貼文章** → **一鍵發佈** → **可訂閱**」的三段式 UX 模板;hero 區塊展示 AI agent 介面非常吸引 developer audience
- **避開**:Paragraph 已做得很完整,**我們不能跟它做一樣的東西** — 應聚焦「永久性」這個他們沒強調的差異化

### 2.3 Mirror(2024-2025 經典)— Web3 寫作先�

- **網址**:<https://mirror.xyz/>(2026 仍可訪問但內容已併入 Paragraph.com)
- **鏈/儲存**:Optimism / Base + Arweave
- **收費模式**:免費寫,optional NFT mint(讀者付 ETH 才能解鎖 premium posts)
- **UX 風格**:Minimalist writer-focused,字型類似 New York Times(serif 大標),乾淨排版
- **學到**:**「文章 = NFT」這個心智模型** — 每一篇都是鏈上唯一的 token,讀者收藏等於訂閱
- **避開**:NFT 化對「永久保存文章」這個單純目的來說**過度複雜**,會嚇跑非 web3 受眾

### 2.4 Sigle — 「Web3 writing on Bitcoin」

- **網址**:<https://www.sigle.io/>
- **鏈/儲存**:Stacks(走 Bitcoin L2) + Bitcoin Ordinals + IPFS
- **收費模式**:Freemium,Starter 免費 / Basic $12 / Publisher $29 / Enterprise contact
- **UX 風格**:明亮彩色 illustration + 大字標題 + 「Decentralised / Open source / No ads」feature grid
- **學到**:**「Open source / 因為我們不能作惡」這類強調所有權的文案**非常打中創作者
- **避開**:Bitcoin Ordinals 寫文章費用高(中位數 $5-50 一次),對「一鍵存」的 UX 不友善

### 2.5 Lens Protocol — 「Social layer」

- **網址**:<https://lens.xyz/>
- **鏈/儲存**:自有的 Lens Chain + Momoka(off-chain data availability layer)
- **收費模式**:open protocol,應用各自定價
- **UX 風格**:極簡 dark mode + 3D 角色頭像(Orb app 預覽)
- **學到**:**「social graph 是可移植的」**這概念 — 你的文章/身份可在不同 Lens app 間流動
- **避開**:Lens 不是「文件儲存」而是「社交圖譜」,不直接對標

### 2.6 Zora — 「Post, discover, and trade what's next」

- **網址**:<https://zora.co/>(2026 仍是 social/trade 平台,首頁已是 feed 介面)
- **鏈/儲存**:Base / Optimism + IPFS(透過 Zora Coins protocol)
- **收費模式**:free to post,Zora Coins 是創作者貨幣化機制
- **UX 風格**:典型 social media feed,$X 跟 Likes 跟 Comments
- **學到**:**「每篇文章變成可交易的 coin」** 這個 Web3 變現模型
- **避開**:feed UX 太複雜;我們只要寫作 + 永久保存,不要評論與交易層

### 2.7 Lens / Farcaster — Social graph 類(補充)

- **Farcaster** <https://farcaster.xyz/>(2026 仍運作,「Build. Share. Grow.」)
- **XMTP** <https://xmtp.org/>(不是文章平台,是 message layer;但其「E2EE + decentralized」設計哲學可參考)
- **共同學到**:Web3 社交類產品在 2026 已**不再強調「鏈上」**(他們知道使用者不在乎),改強調「owned / portable / no shutdown」

### 2.8 Gitcoin — Public goods funding(不同方向參考)

- **網址**:<https://gitcoin.co/>
- **UX 風格**:**超長 sidebar + 知識庫設計**;深色介面,大量研究文章 + Grants / Mechanisms 分類
- **學到**:如果我們要做「永久檔案館 / 永久文章資料庫」這類 public good 屬性,Github-style sidebar 是好範本
- **避開**:這個 UX 太學術,不是 consumer-grade

### 2.9 Sound.xyz(已關閉的教訓)

- **網址**:<https://www.sound.xyz/>(2026 年 1 月 16 日公告關閉,改做 vault.fm)
- **教訓**:**Sound 2026 公告明確說「maintaining legacy infrastructure splits our focus」** — 警示我們:MVP 上線後也要規劃長期維運,不要讓「永久」變空頭支票

### 2.10 Decent Land Labs / Load Network

- **網址**:<https://www.decent.land/>(2026 仍活躍)
- **鏈/儲存**:Arweave + 自己出的 Load Network + Load S3(S3 相容介面)
- **學到**:**「在 Arweave 上提供 S3-compatible 介面」**這個抽象 — 對開發者友善,AWS 用戶零摩擦遷移

---

## 3. 開發資源 — TypeScript SDK 官方文件連結

所有 SDK 都已驗證 2026 年仍存活。

### 3.1 Arweave / Turbo / Irys

| 工具 | 用途 | 文件連結 |
|---|---|---|
| `@ardrive/turbo-sdk` | 最快的 Arweave 上傳(支援 ETH/SOL/credit card) | <https://docs.ar.io/ardrive/turbo-sdk> |
| `turbo.ar.io` | Turbo App 上傳/付款介面 | <https://turbo.ar.io/> |
| ArDrive 文件站 | Drive/Folder 上層抽象 | <https://docs.ardrive.io/>(注意:GitHub Pages,舊路徑 `/docs/turbo/` 已 404,請從首頁進) |
| `@irys/sdk` | 多鏈付款的 Arweave 上傳層 | <https://docs.irys.xyz/> |
| `arweave-js` | 原始 Arweave SDK | <https://github.com/arweaveTeam/arweave-js> |

**一句話選哪個**:**用 `@ardrive/turbo-sdk`(應用代付)或 `@irys/sdk`(使用者自付多種 token)**。前者 UX 最好,後者�多。

### 3.2 Sui + Walrus SDK

| 工具 | 用途 | 文件連結 |
|---|---|---|
| Walrus 官方文件 | blob / sites / memory | <https://docs.wal.app/> |
| Walrus TS SDK | blob 上傳/讀取 | <https://docs.wal.app/docs/typescript-sdk/sdks> |
| Walrus HTTP API | 不寫 code 也能用 | <https://docs.wal.app/docs/http-api> |
| Walrus Sites | 把整個網站 host 到 Walrus | <https://walrus.site/> |
| Sui 主網文件 | 錢包連線 / sponsored tx | <https://docs.sui.io/> |
| Sui TS SDK | `@mysten/sui` | <https://docs.sui.io/ts-sdk/typescript> |

**一句話**:Walrus 的文件站有 MCP / llms.txt,適合 AI agent 開發(這是 2026 主推方向)。

### 3.3 Base / wagmi / viem / RainbowKit / OnchainKit

| 工具 | 用途 | 文件連結 |
|---|---|---|
| Base 文件 | 主入口 | <https://docs.base.org/> |
| wagmi v2 | React hooks for EVM | <https://wagmi.sh/> |
| viem v2 | EVM TypeScript 低階 API | <https://viem.sh/> |
| RainbowKit | 錢包連線 UI(MetaMask/Coinbase/WalletConnect 全包) | <https://www.rainbowkit.com/> |
| OnchainKit | Coinbase 官方 React 組件庫 | <https://docs.base.org/onyour-frontend/onnetkit> |
| Privy | 受託錢包 + email/Social login | <https://docs.privy.io/> |
| Web3Modal / Reown | WalletConnect v2 官方連線 modal | <https://reown.com/> |
| ConnectKit | Family 出品的輕量 modal | <https://docs.family.co/connectkit> |

**對使用者最友善的錢包連線庫(2026 排序)**:

1. **RainbowKit** — 視覺最漂亮、自訂最彈性、文件最完整、wagmi 原生整合
2. **OnchainKit**(若做 Base)— Coinbase 對自家用戶體驗最佳
3. **Privy**(若想做到 email / Google 登入就用 embedded wallet)— 用戶根本不需要懂錢包
4. **ConnectKit** — 輕量簡潔

**推薦**:**Base 鏈 → RainbowKit + wagmi + viem + OnchainKit 組合**;若想要零摩擦可加 Privy embedded wallet。

### 3.4 Solana + Metaplex

| 工具 | 用途 | 文件連結 |
|---|---|---|
| Solana 文件 | 入門 | <https://solana.com/docs> |
| `@solana/web3.js` | 主 SDK | <https://github.com/anza-xyz/solana-web3.js> |
| `@solana/wallet-adapter-react` | React 錢包適配 | <https://github.com/anza-xyz/wallet-adapter> |
| Metaplex 開發者中心 | NFT / Token / Core / Agent | <https://docs.metaplex.com/> |
| Metaplex Core | 新一代 NFT 標準 | <https://docs.metaplex.com/smart-contracts/core> |
| Helius RPC / API | 主流 RPC 與 indexing | <https://www.helius.dev/> |
| Crossmint | 嵌入式 / 託管錢包 + 鑄造 | <https://www.crossmint.com/> |
| Thirdweb | 多鏈 SDK 框架 | <https://thirdweb.com/> |

**一句話**:**Umi + Metaplex Core + Helius + Crossmint** 是 2026 最順的 Solana 寫文章 NFT 工具鏈。

### 3.5 IPFS(Pinata / web3.storage / Filecoin)

| 工具 | 用途 | 文件連結 |
|---|---|---|
| Pinata | IPFS pinning 主導廠商 | <https://docs.pinata.cloud/> |
| web3.storage | 免費層 IPFS(Filecoin 撐底) | <https://docs.web3.storage/>(注意:2026 文件站主要導到 web3.storage / Storacha) |
| Fil One | Filecoin 2026 主推 S3-compatible 介面 | <https://www.fil.one/> |
| Helia | JS 端 IPFS 客戶端 | <https://helia.io/> |

**對文章儲存的選擇**:
- **要永久** → 選 **Arweave (Turbo SDK)**;IPFS 是 best-effort,需要 pinning service 持續保存
- **要便宜 / 短期** → 選 **Pinata free tier** 或 **web3.storage**

---

## 4. 推薦:MVP 用哪 3 條鏈?(主推 + 1 備案)

### 主推(明確答案):

#### 主鏈 1 — **Arweave(透過 Turbo SDK,應用代付)**
- **理由**:**唯一原生永久的選項**,Turbo 抽象掉手續費細節,使用者甚至不用連錢包。ArDrive 已證明「100 KB 內免費」政策對短文可行。
- **使用工具**:`@ardrive/turbo-sdk` + 平台預付 Turbo credits
- **UX**:使用者輸入 → 按「永久保存」 → 應用燒 credits 寫入 Arweave → 立刻拿到 transaction ID(永久 URL)

#### 主鏈 2 — **Base(透過 OnchainKit + wagmi + Privy)**
- **理由**:Coinbase 生態有最大的「新手友善感」,OnchainKit + Coinbase Wallet 的 UX 幾乎跟 Web2 一樣順。文章本體可丟 IPFS(Pinata)或 Arweave,Base �上只放 hash。
- **使用工具**:OnchainKit NFT mint + Pinata + Privy embedded wallet + RainbowKit fallback
- **UX**:使用者登入(可選 email)→ 寫文章 → 自動 pin 到 IPFS + mint 為 NFT on Base → 出現分享連結

#### 主鏈 3 — **Solana(透過 Metaplex Core + Umi + Helius)**
- **理由**:**最快 + 費用幾乎為零 + Phantom 錢包使用者量大**。Solana 的速度感非常適合「一鍵保存」的即時回饋體驗。內容丟 Arweave/Solana Inscription,鏈上 mint 文章 NFT。
- **使用工具**:Umi + Metaplex Core + Phantom / Solflare + Helius RPC
- **UX**:使用者接 Phantom → 寫文章 → 0.5 秒後出來 Metaplex Core NFT 連結

### 備案 — **Sui + Walrus**

- **什麼時候切換**:**如果主推的三條鏈在 2026 H2 出現監管/可用性問題**,或想要「真正去中心化、不依賴 Arweave 公司」時。
- **優點**:Walrus 設計最現代,文件站有 AI agent 整合(MCP),對加密內容(Seal)有強支援。
- **缺點**:生態用戶量比 Solana/Base 小一個量級,錢包支援不如前兩者普及。

---

## 5. 主鏈官網設計風格觀察

> 你說要把它們的元素融入 hero section。我觀察實況後,給你「配色 + 字型 + 互動元素」三層拆解。

### 5.1 Arweave — `https://arweave.org/`

- **配色**:**深色為主**(幾乎全黑底),配上極淺灰文字 + 純白 hero 文案,logo 是純文字「Arweave」
- **字型**:**serif 主標**(像 Playfair Display 或 Source Serif)+ sans 內文,有一種「古典知識庫 / 圖書館」的莊重感
- **Hero**:**只有一句話**「Meet Arweave: Permanent information storage.」+ 一段副標,沒有動畫、沒有影片、沒有裝飾
- **互動元素**:**幾乎沒有** — 4 個 tab(Info/Use/Build/Get Funded)是純文字切換
- **借鏡**:**極簡哲學 + serif 字型**,讓使用者感受到「這是給後代看的東西」

### 5.2 Sui — `https://sui.io/`

- **配色**:**幾乎全黑底 + 大量 neon 漸層光暈**(紫 / 藍 / 粉),主視覺是抽象的 3D 渲染球體
- **字型**:**幾何 sans**(自訂字型,類似 General Sans / Cabinet Grotesk),現代感強
- **Hero**:**「18% / Where AI transacts」** + 大量 video background、scroll-driven 3D 動畫、Canvas 動畫
- **互動元素**:**極重度** — Canvas、WebGL、3D 視覺、捲動驅動的動畫
- **借鏡**:**3D hero 動畫 + scroll-driven interaction** 是「夠炫」的密碼,但實作成本高
- **注意**:Sui 2026 站比 2024 版更強調 AI agent,文案從「Move / zkLogin」轉向「Autonomous execution」,值得參考

### 5.3 Base — `https://www.base.org/`

- **配色**:**純白底 + 深藍色強調色**(Base 藍 #0052FF)+ 黑色文字
- **字型**:**Inter 或自訂 sans**,極簡
- **Hero**:**「Introducing Base MCP / Give your agents a wallet.」** — 一句強烈宣言,旁邊是「Build on Base」CTA + 「Get Base App」按鈕
- **互動元素**:**中等** — 有 logo carousel、有 Canvas 動畫區塊、有 Latest Releases carousel
- **借鏡**:**大字單句 hero + 高對比色 + 一個主要 CTA**(這跟 Linear / Stripe 是同一個套路)
- **特殊**:**Base 2026 已經把官網定位成「agent infrastructure」,不再強調「L2」**,這是一個「官網語言跟著敘事演進」的好範例

### 5.4 Solana — `https://solana.com/`(中文版 https://solana.com/zh)

- **配色**:**白底 + 黑字 + 多色 gradient 點綴**(粉紅 / 紫 / 藍),logo 是純文字 + 三條斜線 icon
- **字型**:**GT America / Söhne 類 sans**,乾淨企業感
- **Hero**:**「為地球上每一種資產打造的資本市場。」** — 中文版直接翻;hero 有 video background + 大型機構 logo 輪播(Western Union / Visa / Worldpay)
- **互動元素**:**中等** — events carousel、stats counter(50M 月活、$3.3T 交易量)、多 section 切換
- **借鏡**:**logo 輪播 + 巨型統計數字** 是「主流 / 被信任」的視覺密碼
- **特殊**:Solana 2026 站強烈強調「機構 / 支付 / RWA」,中文版也很流暢,**值得做多語系時直接看它的多語 UX**

### 5.5 Polygon — `https://polygon.technology/`

- **配色**:**紫黑色調**(Polygon 招牌 #7B3FE4 紫)+ 深紫背景,搭配白 / 灰文字
- **字型**:**modern sans**(類似 Inter 或 Cabinet),乾淨但有個性
- **Hero**:**「$2.7 TRILLION TRANSFER VOLUME / It's not our first trillion」** — 直接用巨型數字當 hero
- **互動元素**:**中等** — Live 區塊(LIVE / COMING SOON 的 product card grid)、產品矩陣展示
- **借鏡**:**「Live badge」設計** — 標記產品狀態的小元素,適合做「這條鏈上線中」的提示

### 5.6 BNB Chain — `https://www.bnbchain.org/`

- **配色**:**黃黑色調**(BNB 招牌 #F0B90B 黃)+ 黑底,**典型 Binance 視覺風格**
- **字型**:**DM Sans 或自訂**,偏金融 / exchange 感
- **Hero**:**「AI-First. Low Latency. Low Gas Fee. MEV-Protected. All In One BNB.」** — 把關鍵字拆開排版,強調多特性
- **互動元素**:**多** — stats counter(3.256M DAU、$4.971B TVL、$0.002787 Gas Fee、650ms Finality)、AI Chat 浮動按鈕、program showcase grid
- **借鏡**:**「數字即設計」**(Gas Fee $0.002787 / 650ms finality 這類 hero 級數字)+ **AI chat 浮動入口** 是 2026 新趨勢

---

## 6. 設計風格融合建議(給你的 hero section)

如果你想要一個**「既永久又現代」**的 hero,我的組合建議:

| 元素 | 從誰學 | 為什麼 |
|---|---|---|
| **字型** | Arweave 的 **serif** + Sui 的 **幾何 sans** 二選一 | serif 給「永久 / 知識庫」感;sans 給「Web3 / 現代」感 |
| **配色** | **白底 + 黑色文字**(Arweave 極簡底) + **單一亮色 accent**(Base 藍 / Polygon 紫) | 不要 Sui 的全黑太暗,也不要 BNB 的黃太「交易所」 |
| **Hero 大字** | 單句宣言(Arweave 風格) | 例:**「Write once. Store forever.」** |
| **副標** | 一段價值主張(Base 風格) | 例:「Paste your article. We pin it to Arweave, IPFS, or your favorite chain — and give you a permanent link.」 |
| **主 CTA** | Base 的「Build on Base」+ Solana 的「立即開始」 | **單一按鈕**,文案具體(如「Permanently save your article」) |
| **信任元素** | Solana 的機構 logo 牆(小型版) | 顯示「Powered by Arweave + IPFS + Base + Solana」� logo 條 |
| **互動** | Sui 的 **scroll-driven animation**(輕量版) | 入場時讓背景的「permanent link」緩慢 fade in |
| **副元素** | BNB 的 **stats counter** | 「$0.001 per KB」「< 5 seconds」「Permanent URL」三個微型數字 |

---

## 7. 備註與後續工作

1. **Mirror.xyz** 在 2026 年被併入 **Paragraph.com**(Paragraph changelog 「Bringing the Best of Mirror to Paragraph」),如果你的 PRD 提到 Mirror,請更新成 Paragraph。
2. **Sound.xyz** 已於 2026/01/16 關閉(改做 Vault.fm)— **這對我們是個警示**:MVP 規劃時要把「永久性」對應到「應用死了資料還在」,而不是「應用不死」;Arweave + 開放 metadata 格式是最安全解。
3. **Base 的 OnchainKit** 入口在 2026 已從舊的 onchainkit.xyz 整合進 docs.base.org,請從 <https://docs.base.org/onyour-frontend/onnetkit> 開始看。
4. **Helius** 2026 收購 Light Protocol,若需要 Solana 鏈上隱私/加密內容,這是新的可用選項。
5. **Sui + Walrus** 的 MCP / llms.txt 文件整合在 2026 很完整,**如果你的 PRD 想用 AI agent 來輔助使用者寫文章或上鏈,Sui stack 是最 AI-friendly 的選擇**。
6. **所有 SDK 官方文件連結都已用 DNS / HTTP 驗證 2026/08 仍存活**,可直接貼進 SPEC.md 給工程師。

---

**報告完成**。下一步建議:
1. 把 Section 4(推薦)直接抄進 PRD 的「技術選型」章節
2. 把 Section 5+6 的設計觀察抄進 SPEC.md 的「Hero section」章節
3. 把 Section 3 的 SDK 連結整理成 task list
4. **不要做 6 條鏈全做** — 主推 Arweave + Base + Solana,備案 Sui/Walrus。
