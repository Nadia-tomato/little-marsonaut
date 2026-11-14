# MARS CREW 開發進度

## 目前階段

Phase 4：NASA 真實資料與科學教育內容整合。

## 已完成

- 建立 React + Vite + JavaScript 專案骨架。
- 建立手機優先的 MARS CREW 首頁與 `Start Mission` 按鈕。
- 建立 `src/components/`、`src/game/`、`src/config/`、`src/data/`、`src/services/`。
- 建立 [GDD.md](./GDD.md)，作為後續主要需求來源。
- 建立 `.gitignore`、`README.md` 與本進度文件。
- `npm install` 成功，依賴無安全性漏洞報告。
- `npm run build` 成功。
- `npm run dev` 成功啟動，首頁已在瀏覽器確認可載入。
- Git 初始化與第一次 commit 已完成；GitHub Private Repository 已建立並 push 完成。
- 建立集中遊戲參數設定檔 `src/config/gameConfig.js`。
- 建立獨立且可測試的遊戲狀態與規則模組 `src/game/gameState.js`。
- 實作氧氣、電力、水、食物的 0–100 資源管理。
- 實作 Sol 1–20 結算、每日消耗、太陽能發電與 Sol 10 水/食物補給。
- 實作水電解製氧、電力與水的操作成本。
- 實作番茄種植、每 Sol 澆水限制、成長與收成。
- 實作探測車 0–5 格離散電池、充電成本、每 Sol 一次探勘與樣本統計。
- 實作依電池格數套用 GDD 探勘機率修正，降低的機率歸入無發現。
- 實作科研分數、分數稱號與重大特殊發現結局。
- 實作正常完成、緊急中止與重大特殊發現三種結局。
- 建立 12 項 Node.js 核心邏輯測試。
- 建立開始任務、基地操作與遊戲結算三種介面狀態。
- 建立手機優先、桌機可用的 2D 火星基地視覺介面。
- 加入四項資源血條、Sol 計數與基地運作狀態。
- 加入可點擊的能源站、番茄溫室與探勘站工作站面板。
- 將所有工作站按鈕連接至 Phase 2 `gameState.js` 的既有函式。
- 加入番茄成長進度、探測車 0–5 格電池、樣本回報與科研分數展示。
- 加入下一個 Sol／結束 Sol 操作與正常、緊急、重大發現結算畫面。
- Phase 3 曾加入明確標示的 Mock Mars 科普資料，Phase 4 已加入 NASA live／fallback 資料層。
- 建立 NASA 科學資料設定與快取服務，保留 Phase 3 介面及 Phase 2 遊戲邏輯。
- 整合 NASA Images and Video Library 搜尋 API，顯示 Curiosity／MSL 真實火星照片、拍攝日期、任務、credit 與來源連結。
- 整合 NASA MSL 歷史天氣 JSON feed，顯示歷史 Sol、日期、最低／最高溫與氣壓；缺少風速等欄位時顯示「無資料」。
- 整合 NASA CCMC DONKI SEP 查詢，轉換成可調整的五級「遊戲風險警戒」提示。
- 加入玄武岩、含鐵礦物、含水礦物、特殊樣本的兒童科普文字；重大發現明確標示為虛構遊戲情節。
- 加入模組快取，避免每次 Sol 切換重新呼叫 NASA API。
- 建立圖片、天氣、DONKI API 成功／失敗與欄位缺失測試。

## 尚未完成

- 尚未加入完整教學流程與成就勳章。
- 尚未實作沙塵暴與太陽高能粒子事件的完整流程。
- 尚未加入完整教學流程與成就勳章。
- GDD 中標記為「待平衡測試」的數值尚未定案，詳見下方。

## Phase 4 NASA 資料來源與狀態

- **NASA Images and Video Library**：`https://images-api.nasa.gov/search`；已於 2026-11-14 實際取得 HTTP 200，回應含 `access-control-allow-origin: *`，本次查詢不需要 API key。遊戲查詢 Curiosity/Mars surface，圖片 metadata 與 asset 來源連結保留在介面。
- **NASA MSL weather feed**：`https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json`；已於 2026-11-14 實際取得 HTTP 200，支援 CORS。資料是 Curiosity 的歷史觀測；欄位缺失不補猜，直接顯示「無資料」。
- **NASA CCMC DONKI SEP**：`https://api.nasa.gov/DONKI/SEP`；已於 2026-11-14 以 NASA 公開 `DEMO_KEY` 實際取得 HTTP 200，支援 CORS。`DEMO_KEY` 只作低流量示範，沒有私密 API key 寫入前端或 Git；未來若需要更高流量，應改用後端 proxy 或部署環境的安全方案。
- **NASA Mars Rover Photos API**：官方 NASA Open APIs 目前標示為 archived，因此沒有採用已封存 API。
- **本地備援**：`src/data/mockMissionData.js` 包含有 NASA source URL 的 Curiosity 圖片與 MSL weather snapshot（snapshot date：2026-11-14）。API 失敗時介面標示「NASA 備援資料」或「本地備援」。

## 真實資料與遊戲模擬的界線

- 顯示的 NASA 照片與 MSL weather 欄位是來源資料；它們不會改寫資源或探測車機率。
- DONKI SEP 事件只產生遊戲用五級提示（很低、低、中等、高、極高），不等同於火星表面輻射測量，也不直接改變 Phase 2 資源規則。
- 沙塵暴、探測車樣本機率、科研分數與重大特殊發現仍是遊戲規則；重大生命跡象發現明確是虛構情節，不是 NASA 證實結果。

## Phase 2 暫定平衡參數

以下數值因 GDD 尚未正式定義，目前集中在 `src/config/gameConfig.js`，都必須經過遊戲測試後再調整：

- 每日氧氣、水、食物與電力消耗。
- 太陽能每日發電量。
- 水電解的水成本、電力成本與氧氣產量。
- 番茄澆水成本、成長 Sol 數、收成食物量。
- 探測車每格充電所需電力。
- 資源耗盡後的緊急中止判定，目前任一關鍵資源歸零即中止。
- 事件觸發、沙塵暴效果與太陽高能粒子事件停用機制尚未接入。

## 測試結果

- `npm install`：通過。
- `npm run build`：通過（Vite production build）。
- `npm run dev`：通過（`http://127.0.0.1:5173/`，首頁顯示 MARS CREW 與 Start Mission）。
- `npm test`：通過（12/12 核心邏輯測試）。
- Phase 3 瀏覽器驗證：通過；已確認開始任務、工作站切換、番茄種植／澆水／Sol 結算、能源站製氧、探測車充電／派遣與樣本回報。
- `npm test`：通過（18/18，含 12 項核心邏輯與 6 項 NASA service／fallback 測試）。
- `npm run build`：通過（Phase 4 NASA 整合後重新驗證）。
- Phase 4 瀏覽器驗證：通過；已顯示 NASA LIVE Curiosity 圖片、MSL 歷史天氣與 DONKI 五級遊戲風險提示。
- GitHub：通過；Private `mars-crew` 已建立，`main` 已推送，GitHub 頁面已確認 `docs/`、`src/`、`.gitignore`、`README.md`、`package.json` 等專案檔案存在。
