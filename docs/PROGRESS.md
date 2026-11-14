# MARS CREW 開發進度

## 目前階段

Phase 3：MARS CREW 遊戲介面與完整可玩流程。

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
- 加入明確標示的 Mock Mars 科普資料，未串接 NASA API。

## 尚未完成

- 尚未加入完整教學流程與成就勳章。
- 尚未實作沙塵暴與太陽高能粒子事件的完整流程。
- 尚未串接 NASA API 或匯入 NASA 真實資料。
- 尚未完成遊戲畫面、教學流程、結算與成就勳章。
- GDD 中標記為「待平衡測試」的數值尚未定案，詳見下方。

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
- `npm run build`：通過（Phase 2 完成後重新驗證）。
- Phase 3 瀏覽器驗證：通過；已確認開始任務、工作站切換、番茄種植／澆水／Sol 結算、能源站製氧、探測車充電／派遣與樣本回報。
- GitHub：通過；Private `mars-crew` 已建立，`main` 已推送，GitHub 頁面已確認 `docs/`、`src/`、`.gitignore`、`README.md`、`package.json` 等專案檔案存在。
