import { useState } from 'react'
import {
  chargeRover,
  createInitialGameState,
  dispatchRover,
  electrolyzeWater,
  getScoreTitle,
  harvestTomato,
  plantTomato,
  settleSol,
  waterTomato,
} from './game/gameState.js'
import { BALANCE_CONFIG, SOL_CONFIG } from './config/gameConfig.js'
import { MOCK_MARS_FACTS } from './data/mockMissionData.js'

const RESOURCE_META = {
  oxygen: { label: '氧氣', icon: '◌', color: 'cyan' },
  power: { label: '電力', icon: 'ϟ', color: 'yellow' },
  water: { label: '水', icon: '◆', color: 'blue' },
  food: { label: '食物', icon: '✦', color: 'green' },
}

const SAMPLE_LABELS = {
  none: '無發現', basalt: '玄武岩', ironMineral: '含鐵礦物', waterMineral: '含水礦物', specialGeology: '其他特殊地質樣本', majorDiscovery: '重大特殊發現',
}

function App() {
  const [gameState, setGameState] = useState(null)
  const [activeStation, setActiveStation] = useState('energy')
  const [batteryChoice, setBatteryChoice] = useState(3)
  const [lastSample, setLastSample] = useState(null)
  const [notice, setNotice] = useState('準備好管理火星基地了嗎？')

  const startMission = () => {
    setGameState(createInitialGameState())
    setActiveStation('energy')
    setLastSample(null)
    setNotice('任務開始！先看看能源站，維持氧氣與電力。')
  }

  const applyAction = (operation, successMessage) => {
    const result = operation(gameState)
    setGameState(result.state)
    setNotice(result.event.reason ? explainFailure(result.event.reason) : successMessage)
    if (result.event.sample) setLastSample(result.event.sample)
  }

  const useOperation = (operation, successMessage) => {
    if (!gameState || gameState.ending) return
    applyAction(operation, successMessage)
  }

  const endSol = () => {
    if (!gameState || gameState.ending) return
    const result = settleSol(gameState)
    setGameState(result.state)
    setNotice(result.event.type.includes('supply-arrived')
      ? 'Sol 10 補給艙抵達！水與食物已恢復到 100。'
      : result.event.type.includes('emergency-abort')
        ? '警報！關鍵生存資源耗盡，任務緊急中止。'
        : `Sol ${result.event.settledSol} 結算完成，基地迎來新的一天。`)
  }

  if (!gameState) return <StartScreen onStart={startMission} />
  if (gameState.ending) return <EndingScreen state={gameState} notice={notice} onRestart={startMission} />

  return (
    <main className="game-shell">
      <header className="top-bar">
        <div className="brand-lockup"><span className="brand-mark">✦</span><div><p className="brand-name">MARS CREW</p><p className="brand-subtitle">火星基地任務控制台</p></div></div>
        <div className="sol-counter" aria-label={`目前 Sol ${gameState.currentSol}`}><span className="sol-label">SOL</span><strong>{String(gameState.currentSol).padStart(2, '0')}</strong><span className="sol-total">/ {SOL_CONFIG.finalSol}</span></div>
      </header>

      <section className="resource-grid" aria-label="基地資源">
        {Object.entries(RESOURCE_META).map(([resource, meta]) => <ResourceMeter key={resource} value={gameState.resources[resource]} meta={meta} />)}
      </section>

      <section className="mission-layout">
        <div className="base-panel">
          <div className="section-heading"><div><p className="kicker">MISSION VIEW</p><h1>火星基地</h1></div><span className="status-chip"><span className="status-dot" />基地運作中</span></div>
          <BaseIllustration activeStation={activeStation} />
          <div className="station-grid" aria-label="工作站">
            <StationButton id="energy" icon="ϟ" title="能源站" description="電力與氧氣" active={activeStation === 'energy'} onClick={setActiveStation} />
            <StationButton id="greenhouse" icon="♧" title="番茄溫室" description="種植與收成" active={activeStation === 'greenhouse'} onClick={setActiveStation} />
            <StationButton id="exploration" icon="◈" title="探勘站" description="探測車與樣本" active={activeStation === 'exploration'} onClick={setActiveStation} />
          </div>
        </div>

        <aside className="control-panel">
          <div className="panel-heading"><p className="kicker">STATION CONTROL</p><h2>{activeStation === 'energy' ? '能源站' : activeStation === 'greenhouse' ? '番茄溫室' : '探勘站'}</h2></div>
          {activeStation === 'energy' && <EnergyStation state={gameState} onElectrolyze={() => useOperation(electrolyzeWater, '製氧完成！氧氣上升，水與電力已消耗。')} />}
          {activeStation === 'greenhouse' && <GreenhouseStation state={gameState} onPlant={() => useOperation(plantTomato, '番茄種子已種下。')} onWater={() => useOperation(waterTomato, '番茄澆水完成，等它長大吧！')} onHarvest={() => useOperation(harvestTomato, '番茄收成完成，食物增加了！')} />}
          {activeStation === 'exploration' && <ExplorationStation state={gameState} batteryChoice={batteryChoice} setBatteryChoice={setBatteryChoice} onCharge={() => useOperation((state) => chargeRover(state, batteryChoice), `探測車已充電到 ${batteryChoice} 格。`)} onDispatch={() => useOperation((state) => dispatchRover(state), '探測車回報完成！')} lastSample={lastSample} />}
        </aside>
      </section>

      <section className="mission-footer"><div className="notice-box"><span className="notice-icon">!</span><p>{notice}</p></div><button className="next-sol-button" type="button" onClick={endSol}><span>結束 Sol {gameState.currentSol}</span><span className="button-arrow">→</span></button></section>
    </main>
  )
}

function StartScreen({ onStart }) {
  return <main className="start-screen"><div className="stars" aria-hidden="true" /><section className="start-card"><div className="planet-orbit" aria-hidden="true"><div className="planet" /><span className="orbit-dot" /></div><p className="eyebrow">JUNIOR ASTRONAUT MISSION TRAINER</p><h1>MARS <span>CREW</span></h1><p className="start-copy">成為火星基地任務指揮官，守護基地資源，派出探測車找尋珍貴的地質樣本！</p><div className="mission-facts"><span>20 SOL 任務</span><span>單人探索</span><span>科學任務</span></div><button type="button" className="start-button" onClick={onStart}>開始任務 <span>→</span></button><p className="mock-note">目前使用任務示範資料 · NASA 真實資料將於後續加入</p></section></main>
}

function ResourceMeter({ value, meta }) {
  return <article className={`resource-meter ${meta.color}`}><div className="meter-label"><span className="resource-icon">{meta.icon}</span><span>{meta.label}</span><strong>{value}<small>/100</small></strong></div><div className="meter-track"><div className="meter-fill" style={{ width: `${value}%` }} /></div></article>
}

function StationButton({ id, icon, title, description, active, onClick }) {
  return <button className={`station-button ${active ? 'active' : ''}`} type="button" onClick={() => onClick(id)} aria-pressed={active}><span className="station-icon">{icon}</span><span><strong>{title}</strong><small>{description}</small></span><span className="station-chevron">›</span></button>
}

function EnergyStation({ state, onElectrolyze }) {
  const canElectrolyze = state.resources.water >= BALANCE_CONFIG.electrolysis.waterCost && state.resources.power >= BALANCE_CONFIG.electrolysis.powerCost
  return <div className="station-content"><div className="station-art energy-art"><span>ϟ</span><i /><i /><i /></div><p className="panel-description">太陽能板會在每個 Sol 自動發電。也可以把水分解成基地需要的氧氣。</p><div className="action-card"><div><strong>水電解製氧</strong><small>消耗 {BALANCE_CONFIG.electrolysis.waterCost} 水 + {BALANCE_CONFIG.electrolysis.powerCost} 電力</small></div><button type="button" className="action-button" onClick={onElectrolyze} disabled={!canElectrolyze}>製造氧氣</button></div><div className="tip-card"><span>☀</span><p>每個 Sol 結算時，太陽能會自動產生電力。</p></div></div>
}

function GreenhouseStation({ state, onPlant, onWater, onHarvest }) {
  const { tomato } = state
  const growthPercent = tomato.planted ? (tomato.growth / BALANCE_CONFIG.tomato.maxGrowth) * 100 : 0
  return <div className="station-content"><div className="station-art greenhouse-art"><span>♧</span><span>♧</span><span>♧</span></div><p className="panel-description">溫室裡只種植番茄。每個 Sol 澆水一次，結算後番茄會長大一格。</p>{!tomato.planted ? <div className="empty-state"><span className="empty-icon">⊕</span><strong>還沒有番茄在生長</strong><button type="button" className="action-button wide" onClick={onPlant}>種下番茄</button></div> : <><div className="growth-card"><div className="growth-title"><strong>番茄成長進度</strong><span>{tomato.growth}/{BALANCE_CONFIG.tomato.maxGrowth} 格</span></div><div className="growth-track"><div className="growth-fill" style={{ width: `${growthPercent}%` }} /></div><div className="growth-status">{tomato.growth >= BALANCE_CONFIG.tomato.maxGrowth ? '番茄成熟了，可以採收！' : tomato.wateredThisSol ? '今天已澆水，等待下一個 Sol。' : '今天還需要澆水。'}</div></div><div className="button-row"><button type="button" className="action-button" onClick={onWater} disabled={tomato.wateredThisSol || tomato.growth >= BALANCE_CONFIG.tomato.maxGrowth}>澆水</button><button type="button" className="action-button secondary" onClick={onHarvest} disabled={tomato.growth < BALANCE_CONFIG.tomato.maxGrowth}>採收</button></div></>}<div className="tip-card"><span>💧</span><p>水不能透過採礦補充，請仔細管理庫存。</p></div></div>
}

function ExplorationStation({ state, batteryChoice, setBatteryChoice, onCharge, onDispatch, lastSample }) {
  const explored = state.rover.expeditionSol === state.currentSol
  return <div className="station-content"><div className="station-art rover-art"><span>◈</span><i>· · ·</i></div><p className="panel-description">選擇電池格數，派遣探測車尋找地質樣本。每個 Sol 最多探勘一次。</p><div className="battery-heading"><strong>探測車電池</strong><span>{state.rover.battery}/5 格</span></div><div className="battery-pips" aria-label={`目前電池 ${state.rover.battery} 格`}>{Array.from({ length: 5 }, (_, index) => <button type="button" key={index} className={`battery-pip ${index < batteryChoice ? 'selected' : ''} ${index < state.rover.battery ? 'charged' : ''}`} onClick={() => setBatteryChoice(index + 1)} aria-label={`選擇 ${index + 1} 格電池`}><span>{index + 1}</span></button>)}</div><div className="button-row"><button type="button" className="action-button" onClick={onCharge} disabled={batteryChoice <= state.rover.battery}>充電到 {batteryChoice} 格</button><button type="button" className="action-button secondary" onClick={onDispatch} disabled={explored || state.rover.battery <= 0}>派遣探測車</button></div>{lastSample && <div className={`sample-result ${lastSample.specialEnding ? 'special' : ''}`}><span className="sample-icon">{lastSample.specialEnding ? '★' : '⌁'}</span><div><small>最近回報</small><strong>{SAMPLE_LABELS[lastSample.type]}</strong>{lastSample.score > 0 && <span>+{lastSample.score} 科研分數</span>}</div></div>}<div className="science-score"><span>目前科研分數</span><strong>{state.samples.score}</strong></div><div className="tip-card"><span>ⓘ</span><p>{MOCK_MARS_FACTS[0]}</p></div></div>
}

function BaseIllustration({ activeStation }) {
  return <div className="base-map" aria-label="2D 俯視角火星基地示意圖"><div className="mars-grid" /><div className={`base-building energy-building ${activeStation === 'energy' ? 'selected-building' : ''}`}><span className="building-roof">ϟ</span><small>能源站</small></div><div className={`base-building greenhouse-building ${activeStation === 'greenhouse' ? 'selected-building' : ''}`}><span className="building-roof">♧</span><small>溫室</small></div><div className={`base-building exploration-building ${activeStation === 'exploration' ? 'selected-building' : ''}`}><span className="building-roof">◈</span><small>探勘站</small></div><div className="base-hab"><span>⌂</span><small>基地核心</small></div><div className="solar-array"><i /><i /><i /><i /></div><div className="rover-dot">◈</div><div className="signal-line" /></div>
}

function EndingScreen({ state, notice, onRestart }) {
  const isDiscovery = state.ending === 'major-discovery'
  const isSuccess = state.ending === 'normal-completion' || isDiscovery
  return <main className={`ending-screen ${isDiscovery ? 'discovery-ending' : ''}`}><section className="ending-card"><div className="ending-badge">{isDiscovery ? '★' : isSuccess ? '✓' : '!'}</div><p className="eyebrow">MISSION REPORT · SOL {state.lastSettledSol ?? state.currentSol}</p><h1>{isDiscovery ? '重大科研發現！' : isSuccess ? '任務成功！' : '任務緊急中止'}</h1><p className="ending-copy">{isDiscovery ? '探測車帶回了最高等級的特殊地質樣本。這是一次非凡的科學任務！' : isSuccess ? '你讓火星基地平安度過 20 Sol，完成了小小太空人的任務。' : notice}</p><div className="score-card"><span>科研總分</span><strong>{state.samples.score}</strong><b>{getScoreTitle(state.samples.score)}</b></div><div className="sample-summary"><strong>樣本紀錄</strong>{Object.entries(state.samples.counts).filter(([, count]) => count > 0).map(([type, count]) => <span key={type}>{SAMPLE_LABELS[type]} × {count}</span>)}</div><button type="button" className="start-button" onClick={onRestart}>再執行一次任務 <span>↻</span></button></section></main>
}

function explainFailure(reason) {
  const messages = { 'insufficient-resources': '資源不足，請先管理好基地庫存。', 'already-planted': '溫室裡已經有一株番茄了。', 'already-watered-this-sol': '今天已經澆過水了，等下一個 Sol 吧！', 'insufficient-water': '水不夠了，請節省用水。', 'not-ready': '番茄還沒成熟，再照顧它一下。', 'invalid-target': '請選擇比目前更高的電池格數。', 'insufficient-power': '電力不足，請等待太陽能發電。', 'empty-battery': '探測車沒有電，先為它充電。', 'already-explored-this-sol': '這個 Sol 已經探勘過了。', 'rover-disabled': '探測車目前暫停服務。' }
  return messages[reason] ?? '這個操作目前無法執行。'
}

export default App
