import { useEffect, useMemo, useState } from 'react'
import { BALANCE_CONFIG, SOL_CONFIG, TIME_CONFIG } from './config/gameConfig.js'
import { addPower, advanceGameTime, chargeRover, createInitialGameState, electrolyzeWater, getScoreTitle, harvestTomato, launchRover, plantTomato, waterTomato } from './game/gameState.js'
import { MOCK_MARS_FACTS, SAMPLE_EDUCATION } from './data/mockMissionData.js'
import { fetchMissionContent, getRadiationRisk, selectScienceForSol } from './services/nasaService.js'

const RESOURCE_META = { water: ['水', '💧', 'water'], food: ['番茄食物', '🍅', 'food'], power: ['電力', '⚡', 'power'], oxygen: ['氧氣', '🫧', 'oxygen'] }
const SAMPLE_LABELS = { none: '無發現', basalt: '玄武岩', ironMineral: '含鐵礦物', waterMineral: '含水礦物', specialGeology: '特殊地質樣本', majorDiscovery: '重大特殊發現' }
const stationInfo = { farm: ['農場區', '番茄溫室', '🌱'], science: ['科研區', '探測車與樣本', '🔬'], energy: ['能源區', '太陽能與生命支援', '☀️'], center: ['中心區', '任務控制中心', '🛰️'] }

function useMissionClock(gameState, setGameState, paused, duration) {
  const hasMission = Boolean(gameState)
  const ending = gameState?.ending
  useEffect(() => {
    if (!hasMission || ending || paused) return undefined
    const tick = window.setInterval(() => {
      if (document.hidden) return
      setGameState((previous) => advanceGameTime(previous, TIME_CONFIG.tickMilliseconds / 1000, { solDurationSeconds: duration }).state)
    }, TIME_CONFIG.tickMilliseconds)
    return () => window.clearInterval(tick)
  }, [hasMission, ending, setGameState, paused, duration])
}

function App() {
  const [gameState, setGameState] = useState(null)
  const [station, setStation] = useState('overview')
  const [notice, setNotice] = useState('準備好成為火星基地指揮官了嗎？')
  const [scienceContent, setScienceContent] = useState(null)
  const [batteryChoice, setBatteryChoice] = useState(3)
  const [solarGameOpen, setSolarGameOpen] = useState(false)
  const [solarAngle, setSolarAngle] = useState(50)
  const [showReturnAnimation, setShowReturnAnimation] = useState(false)
  const duration = useMemo(() => {
    const queryValue = Number(new URLSearchParams(window.location.search).get('testClock'))
    return Number.isFinite(queryValue) && queryValue > 0 ? queryValue : TIME_CONFIG.solDurationSeconds
  }, [])

  useEffect(() => {
    if (!gameState || scienceContent) return undefined
    let active = true
    fetchMissionContent().then((content) => { if (active) setScienceContent(content) })
    return () => { active = false }
  }, [gameState, scienceContent])

  useEffect(() => {
    if (gameState?.ending !== 'emergency-abort') return undefined
    setShowReturnAnimation(true)
    const timer = window.setTimeout(() => setShowReturnAnimation(false), 2400)
    return () => window.clearTimeout(timer)
  }, [gameState?.ending])

  useMissionClock(gameState, setGameState, solarGameOpen || showReturnAnimation, duration)

  const startMission = () => {
    setGameState(createInitialGameState()); setStation('overview'); setNotice(`任務開始！Sol 1 有 ${duration} 秒，先探索一下基地。`); setBatteryChoice(3); setScienceContent(null); setShowReturnAnimation(false)
  }
  const act = (operation, success, failureText = '這個操作目前無法執行。') => {
    if (!gameState || gameState.ending) return
    const result = operation(gameState); setGameState(result.state); setNotice(result.event.reason ? explainFailure(result.event.reason) : success || failureText)
  }
  const openStation = (next) => { setStation(next); setNotice(`已進入${stationInfo[next][0]}，看看可以幫基地做什麼。`) }
  const completeSolarGame = () => {
    if (!gameState || gameState.environment.phase === 'night') return
    const alignment = 1 - Math.abs(solarAngle - 70) / 70
    const weatherFactor = gameState.environment.dustStorm ? BALANCE_CONFIG.solar.dustStormEfficiency : 1
    const gain = Math.round((BALANCE_CONFIG.solar.miniGameBaseGain + alignment * (BALANCE_CONFIG.solar.miniGameMaxGain - BALANCE_CONFIG.solar.miniGameBaseGain)) * weatherFactor)
    setGameState(addPower(gameState, gain)); setSolarGameOpen(false); setNotice(`太陽能板對準成功，獲得 ${gain} 電力！${gameState.environment.dustStorm ? '沙塵暴讓效率降低了。' : ''}`)
  }

  if (!gameState) return <StartScreen onStart={startMission} duration={duration} />
  if (gameState.ending && showReturnAnimation) return <EvacuationScreen />
  if (gameState.ending) return <EndingScreen state={gameState} content={scienceContent} notice={notice} onRestart={startMission} />

  return <main className={`mission-app phase-${gameState.environment.phase} ${gameState.environment.dustStorm ? 'dust-storm' : ''}`}>
    <TopBar state={gameState} duration={duration} />
    <AlertStrip state={gameState} notice={notice} />
    {station === 'overview' ? <BaseOverview state={gameState} onOpen={openStation} /> : <RoomView state={gameState} station={station} onBack={() => setStation('overview')} onNotice={setNotice} batteryChoice={batteryChoice} setBatteryChoice={setBatteryChoice} scienceContent={scienceContent} onAct={act} solarGameOpen={solarGameOpen} setSolarGameOpen={setSolarGameOpen} solarAngle={solarAngle} setSolarAngle={setSolarAngle} onSolarComplete={completeSolarGame} />}
    <footer className="mission-footer"><button className="home-button" type="button" onClick={() => setStation('overview')}>⌂ 基地總覽</button><span>{gameState.currentSol < SOL_CONFIG.finalSol ? `時間會自動前進，Sol ${gameState.currentSol + 1} 即將到來` : '任務即將結算'}</span><button className="help-button" type="button" onClick={() => setNotice('小提示：先維持氧氣，再用剩下的電力探索。每個 Sol 只能派車一次。')}>需要提示？</button></footer>
  </main>
}

function StartScreen({ onStart, duration }) {
  return <main className="start-screen"><div className="start-stars" /><section className="start-card"><div className="mars-orbit"><div className="mars-planet" /><span>✦</span></div><p className="eyebrow">JUNIOR ASTRONAUT MISSION TRAINER</p><h1>MARS <em>CREW</em></h1><p className="start-copy">歡迎來到火星基地！管理水、番茄食物、電力和氧氣，派出探測車，完成 20 Sol 的科學任務。</p><div className="start-resources">{Object.entries(RESOURCE_META).map(([key, [label, icon]]) => <span key={key}>{icon} {label}</span>)}</div><div className="how-to"><div><b>1</b><strong>探索基地</strong><small>點擊農場、科研、能源或中心區</small></div><div><b>2</b><strong>照顧太空人</strong><small>資源低於 25% 時要趕快處理</small></div><div><b>3</b><strong>完成任務</strong><small>在 Sol 20 前帶回珍貴發現</small></div></div><button className="start-button" type="button" onClick={onStart}>Start Mission <span>→</span></button><p className="start-note">每個 Sol 約 {duration} 秒（正式遊戲 120 秒） · NASA 照片與歷史天氣為教育素材</p></section></main>
}

function TopBar({ state, duration }) {
  const progress = (state.clock.solElapsedSeconds / duration) * 100
  return <header className="topbar"><div className="logo"><span>✦</span><div><b>MARS CREW</b><small>火星基地任務控制台</small></div></div><div className="time-panel"><small>SOL</small><strong>{String(state.currentSol).padStart(2, '0')}</strong><span>/ {SOL_CONFIG.finalSol}</span><div className="sol-progress"><i style={{ width: `${progress}%` }} /></div></div><div className="mission-badge">{state.environment.phase === 'night' ? '🌙 夜晚' : state.environment.phase === 'dawn' ? '🌅 日出' : state.environment.phase === 'dusk' ? '🌇 黃昏' : '☀️ 白天'}</div></header>
}

function ResourceStrip({ state }) {
  return <section className="resource-strip">{Object.entries(RESOURCE_META).map(([key, [label, icon, color]]) => <div className={`resource-card ${color}`} key={key}><div><span>{icon}</span><b>{label}</b><strong>{Math.round(state.resources[key])}<small>/100</small></strong></div><div className="resource-bar"><i style={{ width: `${state.resources[key]}%` }} /></div></div>)}</section>
}

function AlertStrip({ state, notice }) {
  const warning = state.alerts[0]
  return <><ResourceStrip state={state} />{(warning || state.lastEvent === 'supply-arrived') && <div className={`alert-strip ${state.lastEvent === 'supply-arrived' ? 'supply' : ''}`}><b>{state.lastEvent === 'supply-arrived' ? '📦 Sol 10 補給抵達！' : `⚠️ ${warning} 低於 25%`}</b><span>{state.lastEvent === 'supply-arrived' ? '水與番茄食物已恢復到 100。' : '請前往對應區域改善資源。'}</span></div>}<div className="notice-line">{notice}</div></>
}

function BaseOverview({ state, onOpen }) {
  return <section className="base-overview"><div className="scene-heading"><div><span className="label">MISSION BASE</span><h1>火星基地總覽</h1><p>點擊一個區域開始今天的任務。</p></div><div className="weather-pill">{state.environment.eventLabel ? `⚠️ ${state.environment.eventLabel}` : '✅ 基地穩定'}</div></div><div className="base-scene"><div className="sun" /><div className="mars-horizon" /><button className="zone zone-energy" onClick={() => onOpen('energy')}><span>☀️</span><b>能源區</b><small>收集陽光・製造氧氣</small></button><button className="zone zone-farm" onClick={() => onOpen('farm')}><span>🍅</span><b>農場區</b><small>種植番茄・取得食物</small></button><button className="zone zone-science" onClick={() => onOpen('science')}><span>🔬</span><b>科研區</b><small>探測車・地質樣本</small></button><button className="zone zone-center" onClick={() => onOpen('center')}><span>🛰️</span><b>中心區</b><small>任務控制・科學資料</small></button><div className="habitat">⌂<small>基地核心</small></div><div className="rover-track">{state.rover.pending ? '🚗 · · ·' : '· · · ◈'}</div></div><div className="base-tip">💡 小隊長提示：先看資源，再決定今天要把電力花在哪裡。</div></section>
}

function RoomView({ state, station, onBack, onNotice, batteryChoice, setBatteryChoice, scienceContent, onAct, solarGameOpen, setSolarGameOpen, solarAngle, setSolarAngle, onSolarComplete }) {
  const [, title, icon] = stationInfo[station]
  return <section className={`room room-${station}`}><div className="room-header"><button type="button" onClick={onBack}>← 回到基地</button><div><span className="label">{icon} {stationInfo[station][0]}</span><h1>{title}</h1></div><span className="room-light">{state.environment.phase === 'night' ? '🌙 夜間模式' : '☀️ 日間模式'}</span></div>{station === 'farm' && <FarmRoom state={state} onAct={onAct} />}{station === 'science' && <ScienceRoom state={state} onAct={onAct} batteryChoice={batteryChoice} setBatteryChoice={setBatteryChoice} scienceContent={scienceContent} />}{station === 'energy' && <EnergyRoom state={state} onAct={onAct} openMiniGame={() => setSolarGameOpen(true)} />}{station === 'center' && <CenterRoom state={state} content={scienceContent} onNotice={onNotice} />}{solarGameOpen && <SolarMiniGame state={state} angle={solarAngle} setAngle={setSolarAngle} onComplete={onSolarComplete} onClose={() => setSolarGameOpen(false)} />}</section>
}

function FarmRoom({ state, onAct }) {
  const { tomato } = state; const percent = Math.min(100, (tomato.ageSeconds / (TIME_CONFIG.solDurationSeconds * 0.5)) * 100); const stage = tomato.spoiled ? 'spoiled' : tomato.growth >= 3 ? 'ripe' : tomato.ageSeconds > 0 ? 'growing' : 'seed'
  return <div className="room-grid farm-grid"><div className="illustration greenhouse-illustration"><div className={`tomato-plant ${stage}`}><span>🌿</span><i>🍅</i><small>{tomato.spoiled ? '腐爛了' : tomato.growth >= 3 ? '成熟！' : tomato.planted ? '成長中' : '等待播種'}</small></div><div className="grow-lights">☼　☼　☼</div></div><div className="room-card"><span className="label">GREENHOUSE LOG</span><h2>{tomato.spoiled ? '番茄已經腐爛' : tomato.growth >= 3 ? '可以採收囉！' : tomato.planted ? '番茄正在長大' : '今天種一株番茄吧'}</h2><p>{tomato.spoiled ? '成熟後超過半個 Sol 沒有採收，這株番茄不能增加食物。' : '播種後等待半個 Sol 就會成熟。成熟時請親自點擊採收。'}</p>{tomato.planted && <div className="growth-meter"><i style={{ width: `${percent}%` }} /></div>}<div className="tomato-stage-row"><span className={stage === 'seed' ? 'active' : ''}>🌰 種子</span><span className={stage === 'growing' ? 'active' : ''}>🌱 幼苗</span><span className={stage === 'ripe' ? 'active' : ''}>🍅 成熟</span></div><div className="action-row">{!tomato.planted && <button onClick={() => onAct(plantTomato, '番茄種子種下去了！')}>播種番茄</button>}{tomato.planted && !tomato.spoiled && tomato.growth < 3 && <button onClick={() => onAct(waterTomato, '澆水完成，番茄會繼續成長。')}>澆水（-{BALANCE_CONFIG.tomato.waterCost} 水）</button>}{tomato.growth >= 3 && !tomato.spoiled && <button onClick={() => onAct(harvestTomato, `收成成功！食物增加 ${BALANCE_CONFIG.tomato.foodYield}。`)}>🧺 親自採收</button>}</div></div></div>
}

function ScienceRoom({ state, onAct, batteryChoice, setBatteryChoice, scienceContent }) {
  const disabled = state.rover.disabledUntilSol !== null && state.currentSol <= state.rover.disabledUntilSol; const pending = state.rover.pending; const last = state.rover.lastReturn; const risk = getRadiationRisk(scienceContent?.spaceWeather?.events ?? [])
  return <div className="room-grid science-grid"><div className="illustration rover-illustration"><div className={`rover-large ${pending ? 'away' : ''}`}>🚗</div><div className="rover-road">· · · · · · ·</div><div className="sample-crates">{state.samples.discoveries.slice(-3).map((item, index) => <span key={`${item.sol}-${index}`}>🪨</span>)}</div></div><div className="room-card"><span className="label">ROVER GARAGE</span><h2>{pending ? `探測車正在 Sol ${pending.dispatchedSol} 外出` : disabled ? `維修中，還有 ${state.rover.disabledUntilSol - state.currentSol + 1} Sol` : '準備探索火星地表'}</h2><p>{pending ? `它會在 Sol ${pending.dispatchedSol + 1} 返航，返航前不能再次派遣。` : '配置電池格數越多，最多能帶回越多樣本；0 格不能出發。'}</p><div className="battery-selector"><b>基地電池：{state.rover.battery}/5 格</b><div>{[1, 2, 3, 4, 5].map((cell) => <button key={cell} className={cell <= batteryChoice ? 'picked' : ''} onClick={() => setBatteryChoice(cell)} aria-label={`選擇 ${cell} 格`}>{cell}</button>)}</div></div><div className="action-row"><button disabled={Boolean(pending || disabled || batteryChoice <= state.rover.battery)} onClick={() => onAct((current) => chargeRover(current, batteryChoice), `探測車已充電到 ${batteryChoice} 格。`)}>充電到 {batteryChoice} 格</button><button disabled={Boolean(pending || disabled || state.rover.battery <= 0)} onClick={() => onAct(launchRover, `探測車出發！明天 Sol ${state.currentSol + 1} 返航。`)}>派遣探測車</button></div>{last && <div className={`return-report ${last.damaged ? 'damaged' : ''}`}>{last.damaged ? `⚠️ 探測車遇到環境風險，需要維修 ${last.repairSols} Sol。` : `📦 探測車帶回 ${last.quantity} 個樣本！`}</div>}<div className="risk-mini">DONKI 真實紀錄：L{risk.level} {risk.label} <small>（不等同火星現場測量）</small></div></div><DiscoveryList state={state} content={scienceContent} /></div>
}

function DiscoveryList({ state, content }) {
  return <div className="room-card discovery-list"><span className="label">MISSION DISCOVERIES</span><h2>發現紀錄 · {state.samples.score} 科研分數</h2><div className="discovery-cards">{state.samples.discoveries.length === 0 ? <p>探測車返航後，樣本會出現在這裡。</p> : state.samples.discoveries.map((item, index) => { const image = selectScienceForSol(content, item.sol).image; return <article key={`${item.sol}-${index}`}><img src={image?.imageUrl} alt="NASA 火星教育照片" /><div><b>{SAMPLE_LABELS[item.sample.type]}</b><span>Sol {item.sol} · +{item.sample.score} 分</span><p>{SAMPLE_EDUCATION[item.sample.type]}</p></div></article> })}</div></div>
}

function EnergyRoom({ state, onAct, openMiniGame }) {
  const night = state.environment.phase === 'night'; return <div className="room-grid energy-grid"><div className="illustration energy-illustration"><div className="sun-orb">☀</div><div className="solar-panels">▰ ▰ ▰</div><div className="power-lines">⌁　⌁　⌁</div></div><div className="room-card"><span className="label">POWER STATION</span><h2>{night ? '現在是夜晚' : state.environment.dustStorm ? '沙塵暴中的太陽能板' : '把陽光變成基地電力'}</h2><p>{night ? '夜間不會產生太陽能，等日出再調整面板。' : '拖曳角度，把面板對準太陽光線。對得越準，獲得的電力越多。'}</p><button className="big-action" disabled={night} onClick={openMiniGame}>☀️ 調整太陽能板（小遊戲）</button><div className="energy-actions"><div><b>水電解製氧</b><small>消耗 {BALANCE_CONFIG.electrolysis.waterCost} 水 + {BALANCE_CONFIG.electrolysis.powerCost} 電力</small><button onClick={() => onAct(electrolyzeWater, '製氧完成！氧氣增加了。')}>製造氧氣</button></div></div><div className="energy-note">電力會隨時間緩慢增加；氧氣、水、食物會持續消耗。</div></div></div>
}

function SolarMiniGame({ state, angle, setAngle, onComplete, onClose }) {
  return <div className="modal-backdrop"><div className="solar-modal"><button className="modal-close" onClick={onClose}>×</button><span className="label">SOLAR ALIGNMENT GAME</span><h2>把太陽能板對準太陽！</h2><div className="alignment-sky"><span className="game-sun">☀</span><span className="beam" style={{ transform: `rotate(${(angle - 70) / 2}deg)` }}>╱</span><div className="game-panel" style={{ transform: `rotate(${angle - 70}deg)` }}>▰ ▰</div></div><input type="range" min="0" max="140" value={angle} onChange={(event) => setAngle(Number(event.target.value))} aria-label="太陽能板角度" /><div className="alignment-label">{Math.abs(angle - 70) < 12 ? '✨ 對準了！' : '拖曳面板靠近太陽方向'}</div><button className="big-action" onClick={onComplete}>收集陽光</button>{state.environment.dustStorm && <small>沙塵暴會降低這次發電效率。</small>}</div></div>
}

function CenterRoom({ state, content, onNotice }) {
  const selected = selectScienceForSol(content, state.currentSol); const risk = getRadiationRisk(content?.spaceWeather?.events ?? [])
  return <div className="center-layout"><div className="room-card command-card"><span className="label">MISSION CONTROL</span><h2>小隊長控制台</h2><p>這裡的 NASA 資料是真實歷史觀測；沙塵暴與輻射事件是遊戲中的模擬規則。</p><div className="command-stats"><span><b>生存進度</b>Sol {state.currentSol} / {SOL_CONFIG.finalSol}</span><span><b>科研分數</b>{state.samples.score} · {getScoreTitle(state.samples.score)}</span><span><b>環境警報</b>{state.environment.eventLabel ?? '目前沒有'}</span><span><b>DONKI</b>L{risk.level} {risk.label}</span></div><button onClick={() => onNotice('提醒：NASA 歷史天氣不等於當下火星即時天氣。')}>查看資料說明</button></div><ScienceBriefing content={content} sol={state.currentSol} /><div className="room-card sample-board"><span className="label">SAMPLE BOARD</span><h2>樣本總覽</h2><div className="sample-counts">{Object.entries(state.samples.counts).filter(([, count]) => count > 0).map(([type, count]) => <span key={type}>🪨 {SAMPLE_LABELS[type]} × {count}</span>)}</div></div></div>
}

function ScienceBriefing({ content, sol }) {
  const selected = selectScienceForSol(content, sol); const live = content?.images?.source === 'live' || content?.images?.source === 'cache'; const weatherLive = content?.weather?.source === 'live' || content?.weather?.source === 'cache'
  return <div className="science-briefing"><article><img src={selected.image?.imageUrl} alt={`${selected.image?.title ?? '火星照片'} NASA ${selected.image?.mission ?? ''}`} /><b>{live ? 'NASA LIVE' : 'NASA 備援資料'} · {selected.image?.dateCreated ?? '無資料'}</b><h3>{selected.image?.title ?? '火星照片'}</h3><p>{selected.image?.education ?? '火星地表照片是教育素材，與遊戲樣本分開。'} <a href={selected.image?.sourceUrl} target="_blank" rel="noreferrer">查看 NASA 來源 ↗</a></p></article><article><span className="label">HISTORICAL WEATHER</span><h3>Curiosity Sol {selected.weather?.sol ?? '無資料'}</h3><p>{weatherLive ? 'NASA 歷史觀測' : '本地來源備援'} · {selected.weather?.terrestrialDate ?? '無資料'}</p><div className="weather-numbers"><span>溫度<strong>{selected.weather?.minTemp ?? '無資料'}～{selected.weather?.maxTemp ?? '無資料'} °C</strong></span><span>氣壓<strong>{selected.weather?.pressure && selected.weather.pressure !== '--' ? `${selected.weather.pressure} Pa` : '無資料'}</strong></span><span>風速<strong>{selected.weather?.windSpeed && selected.weather.windSpeed !== '--' ? selected.weather.windSpeed : '無資料'}</strong></span></div></article></div>
}

function EvacuationScreen() { return <main className="evacuation-screen"><div className="rocket">🚀</div><h1>緊急遣返中…</h1><p>這是教育遊戲中的簡化返航動畫，不代表真實火星任務可以立即返回地球。</p></main> }
function EndingScreen({ state, content, notice, onRestart }) { const success = state.ending !== 'emergency-abort'; return <main className={`ending-screen ${success ? 'success' : ''}`}><section className="ending-card"><div className="ending-symbol">{state.ending === 'major-discovery' ? '★' : success ? '✓' : '!'}</div><span className="label">MISSION REPORT · SOL {state.lastSettledSol ?? state.currentSol}</span><h1>{state.ending === 'major-discovery' ? '重大科研發現！' : success ? '任務成功！' : '任務緊急中止'}</h1><p>{state.ending === 'major-discovery' ? '這是虛構的遊戲情節，不是 NASA 已證實的外星生命。' : success ? '你讓火星基地平安度過 20 Sol！' : notice}</p><div className="final-score"><small>科研總分</small><strong>{state.samples.score}</strong><b>{getScoreTitle(state.samples.score)}</b></div><div className="album"><h2>探測車照片回顧</h2><div>{state.samples.discoveries.length === 0 ? <p>本次沒有照片紀錄。</p> : state.samples.discoveries.map((item, index) => { const image = selectScienceForSol(content, item.sol).image; return <figure key={`${item.sol}-${index}`}><img src={image?.imageUrl} alt="NASA 火星教育素材" /><figcaption>Sol {item.sol} · {SAMPLE_LABELS[item.sample.type]}<small>{SAMPLE_EDUCATION[item.sample.type]}</small></figcaption></figure> })}</div></div><button className="start-button" onClick={onRestart}>再執行一次任務 ↻</button></section></main> }

function explainFailure(reason) { return ({ 'insufficient-resources': '資源不足，請先管理好基地庫存。', 'already-planted': '農場已經有一株番茄。', 'already-watered-this-sol': '今天已經澆過水了。', 'insufficient-water': '水不夠了，請節省用水。', 'not-ready': '番茄還沒成熟，再等一下。', 'spoiled': '番茄已腐爛，這次不能增加食物。', 'invalid-target': '請選擇比目前更高的電池格數。', 'insufficient-power': '電力不足，請先收集陽光。', 'empty-battery': '探測車沒有電，先充電。', 'rover-out-on-mission': '探測車還在外面，等它返航。', 'rover-disabled': '探測車正在維修。' }[reason] ?? '這個操作目前無法執行。') }

export default App
