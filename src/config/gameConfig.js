/**
 * MARS CREW 的集中遊戲參數。
 *
 * GDD 沒有指定的數值先以「待平衡測試」的暫定值實作，後續只需在這裡調整。
 */
export const RESOURCE_MAX = 100

export const SOL_CONFIG = Object.freeze({
  firstSol: 1,
  finalSol: 20,
  supplySol: 10,
})

export const TIME_CONFIG = Object.freeze({
  solDurationSeconds: 120,
  testSolDurationSeconds: 4,
  halfSolRatio: 0.5,
  tickMilliseconds: 250,
})

export const INITIAL_RESOURCES = Object.freeze({
  oxygen: 70,
  power: 70,
  water: 100,
  food: 60,
})

// 待平衡測試：GDD 尚未指定每日生存消耗與能源數值。
export const BALANCE_CONFIG = Object.freeze({
  dailyConsumption: Object.freeze({
    oxygen: 5,
    water: 2,
    food: 4,
    power: 3,
  }),
  solarPowerGeneration: 10,
  electrolysis: Object.freeze({
    waterCost: 5,
    powerCost: 5,
    oxygenGain: 8,
  }),
  tomato: Object.freeze({
    maxGrowth: 3,
    waterCost: 4,
    growthPerWateredSol: 1,
    foodYield: 12,
  }),
  rover: Object.freeze({
    maxBattery: 5,
    powerPerBatteryCell: 4,
    maxSamplesByBattery: Object.freeze({ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }),
    returnAfterSols: 1,
    repairSolsMin: 1,
    repairSolsMax: 2,
  }),
  solar: Object.freeze({
    miniGameBaseGain: 8,
    miniGameMaxGain: 18,
    dustStormEfficiency: 0.45,
    nightEfficiency: 0,
  }),
  events: Object.freeze({
    dustStormChancePerSol: 0.12,
    solarParticleChancePerSol: 0.08,
    highRadiationDamageChance: 0.35,
    dustStormLabel: '沙塵暴',
    solarParticleLabel: '太陽高能粒子事件',
  }),
})

export const SAMPLE_DEFINITIONS = Object.freeze([
  { type: 'none', label: '無發現', probability: 0.30, score: 0 },
  { type: 'basalt', label: '玄武岩', probability: 0.30, score: 10 },
  { type: 'ironMineral', label: '含鐵礦物', probability: 0.15, score: 15 },
  { type: 'waterMineral', label: '含水礦物', probability: 0.09, score: 30 },
  { type: 'specialGeology', label: '其他特殊地質樣本', probability: 0.15, score: 25 },
  { type: 'majorDiscovery', label: '重大特殊發現', probability: 0.01, score: 0, specialEnding: true },
])

export const SAMPLE_SCORE_TITLES = Object.freeze([
  { minimum: 180, title: '火星科學大師' },
  { minimum: 120, title: '超級小小太空人' },
  { minimum: 70, title: '火星探險家' },
  { minimum: 30, title: '小小太空人' },
  { minimum: 0, title: '太空新手' },
])

export const CRITICAL_RESOURCES = Object.freeze(['oxygen', 'power', 'water', 'food'])
