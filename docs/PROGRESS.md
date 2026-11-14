# MARS CREW 開發進度

## 目前階段

Phase 6：MARS CREW v2 改版分支整合與連續時間遊戲。

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
- 建立可重現的 400 局平衡模擬（生存、科研、均衡、新手四種策略各 100 局）。
- 補充資源耗盡、重複結算、Sol 10 補給、Sol 20 完成、番茄重複收成等邊界測試。
- 首頁加入給 7–12 歲玩家的三步驟新手引導，並修正文案清楚區分 NASA 資料與遊戲模擬。
- 以 390×844 手機與 1440×900 桌機尺寸進行瀏覽器驗證，確認無水平溢出；開始任務、工作站切換、番茄操作與 Sol 推進可操作。
- 監測瀏覽器互動期間未發現 JavaScript page error 或 console error。
- 從遠端最新 `origin/main` fetch 並檢查組員 commit `d03027b`、`661781a`；確認根目錄 `index.html` 是 standalone React/Babel/Tailwind 版本，不是 Vite 入口。
- 建立獨立 `v2-rework` 分支，保留 `main` 不變；未 force push、未合併、未部署。
- 將組員版本的暖色手繪視覺、四區基地熱區、能源小遊戲、番茄生長畫面、探測車車庫、教學提示與照片回顧移植為 React UI。
- 將根目錄恢復為乾淨 Vite 入口，避免 CDN React/Babel 與本地 React 重複載入。
- 實作 `advanceGameTime` 連續時鐘：正式 Sol 120 秒，`?testClock=2` 可加速測試；背景分頁不推進。
- 實作日出／白天／黃昏／夜晚視覺、夜間零太陽能、低於 25% 警告與低資源改善提示。
- 實作番茄半 Sol 成熟、成熟後半 Sol 腐爛、親自採收與重新播種。
- 實作探測車下一 Sol 返航、返航前禁止重派、樣本數量依電池配置、事件維修 1–2 Sol。
- 實作沙塵暴、太陽高能粒子事件的可調機率與遊戲模擬效果；保留 NASA DONKI 與遊戲事件的界線。
- 實作緊急遣返動畫、Sol 20／重大發現結算與探測照片／科普卡片牆。

## 尚未完成

- 尚未加入完整教學流程與成就勳章。
- V2 的事件流程已接入；事件機率、太陽能小遊戲收益、連續消耗與維修效果仍需真人試玩平衡。
- 尚未完成 Vercel／Netlify 正式部署：目前 Vercel 頁面要求登入或建立帳號，需要專案擁有者授權。
- GDD 中標記為「待平衡測試」的數值仍是暫定值，詳見下方。
- `v2-rework` 尚未合併至 main，需使用者確認後才可合併。

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

## Phase 5 平衡模擬結果

測試使用固定 LCG 亂數種子，共 400 局，每種策略 100 局；未修改 GDD 明確規則，也未為了提高勝率直接增加資源。

| 策略 | Sol 20 存活 | 平均失敗 Sol | 最常耗盡 | 平均科研分數 | 平均番茄收成 | 平均探勘次數 |
| --- | ---: | ---: | --- | ---: | ---: | ---: |
| 優先生存 | 100/100 | 無 | 無 | 0.00 | 10.00 | 0.00 |
| 優先科研 | 0/100 | 13.00 | 氧氣 | 97.00 | 6.24 | 7.42 |
| 均衡管理 | 94/100 | 無（其餘 6 局未存活） | 氧氣（失敗局） | 54.85 | 9.64 | 7.75 |
| 新手不熟悉操作 | 0/100 | 13.00 | 氧氣 | 0.00 | 0.00 | 0.00 |

判讀：番茄投資能提供食物緩衝，探測車能帶來科研分數，但兩者都會與製氧／基地生存爭用水、電力與操作時機，因此存在有意義的取捨。依目前結果，優先科研策略在不製氧時會有可預期的氧氣失敗；這不是無法避免的程式錯誤，而是目前暫定參數下需要真人試玩確認的平衡問題。下一輪如要調整，應只修改 `src/config/gameConfig.js` 並重新跑同一組種子。

## Phase 6 / V2 改版記錄

### 組員 index.html 移植內容

- 保留：暖色手繪／兒童友善視覺、基地總覽四個點擊區域、能源小遊戲概念、番茄不同階段、探測車車庫與返航提示、NASA 照片回顧、操作教學與徽章式提示風格。
- 未直接採用：Tailwind CDN、UMD React、Babel standalone、組員 HTML 內嵌的第二套資源狀態與手動結束 Sol 邏輯。
- 改為：本地 React 元件、`src/styles.css`、Phase 2/4 service 與單一 `gameState.js` 狀態來源。

### V2 新增與修改規則

- 時間從手動「結束 Sol」改為 `advanceGameTime` 連續消耗與自動跨 Sol。
- 番茄成長以秒數計算：半 Sol 成熟，再半 Sol 未採收則腐爛。
- 探測車使用 `launchRover` 延遲至下一 Sol 返航；返航時依電池格數抽取 1–5 個暫定樣本數量。
- 每個 Sol 以集中設定的低機率產生沙塵暴或太陽高能粒子事件；高風險可能造成探測車 1–2 Sol 維修。
- 能源區提供可拖曳角度的太陽能板小遊戲；收益、沙塵暴效率與夜間規則集中在 `src/config/gameConfig.js`。
- 緊急中止先顯示簡化遣返動畫，再進入科研結算；此動畫是教育遊戲敘事，不代表真實任務返航時間。

### V2 測試結果

- `npm test`：24/24 通過，包含舊核心／NASA service、400 局平衡模擬、連續時鐘、番茄腐爛、探測車延遲返航與維修測試。
- `npm run build`：通過，Vite production build 成功。
- 瀏覽器 `?testClock=2`：已實際確認開始任務、Sol 自動由 1 推進至 2、資源持續變化、四區切換、能源小遊戲、製氧、基地返回，以及科研區充電／派遣／延遲返航或特殊結局。
- 瀏覽器錯誤檢查：修正一次 React tick 回傳錯誤後，重新操作未再出現 page error；桌機 1440px 測試無水平溢出。

### 尚待平衡與真人試玩

- 連續消耗下優先科研策略可能在 Sol 13 左右因氧氣不足失敗；需兒童玩家確認提示是否足夠清楚。
- `maxSamplesByBattery`、能源小遊戲收益、事件機率、風險損壞機率、維修時間與低資源警戒值都是暫定參數。
- 需要真人確認：四區熱區是否容易找到、夜晚對比是否足夠、番茄腐爛時間是否公平、探測車返航等待是否有趣，以及照片卡片是否不會擋住主要操作。

## 測試結果

- `npm install`：通過。
- `npm run build`：通過（Vite production build）。
- `npm run dev`：通過（`http://127.0.0.1:5173/`，首頁顯示 MARS CREW 與 Start Mission）。
- `npm test`：通過（Phase 5 後 21/21，含核心、NASA service、邊界與 400 局平衡模擬）。
- Phase 3 瀏覽器驗證：通過；已確認開始任務、工作站切換、番茄種植／澆水／Sol 結算、能源站製氧、探測車充電／派遣與樣本回報。
- `npm test`：通過（18/18，含 12 項核心邏輯與 6 項 NASA service／fallback 測試）。
- `npm run build`：通過（Phase 4 NASA 整合後重新驗證）。
- Phase 4 瀏覽器驗證：通過；已顯示 NASA LIVE Curiosity 圖片、MSL 歷史天氣與 DONKI 五級遊戲風險提示。
- `npm run build`：通過（Phase 5 後 Vite production build）。
- Phase 5 瀏覽器驗證：390×844 與 1440×900 均無水平溢出；已實際操作開始任務、站點切換、番茄種植／澆水、Sol 結算，並確認 NASA 科學內容可顯示。
- 部署：尚未完成；Vercel 公開部署頁要求帳號授權，未在未授權狀態下建立外部部署。
- GitHub：通過；Private `mars-crew` 已建立，`main` 已推送，GitHub 頁面已確認 `docs/`、`src/`、`.gitignore`、`README.md`、`package.json` 等專案檔案存在。
