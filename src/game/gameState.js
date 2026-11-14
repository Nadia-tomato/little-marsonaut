import {
  BALANCE_CONFIG,
  CRITICAL_RESOURCES,
  INITIAL_RESOURCES,
  RESOURCE_MAX,
  SAMPLE_DEFINITIONS,
  SAMPLE_SCORE_TITLES,
  SOL_CONFIG,
  TIME_CONFIG,
} from '../config/gameConfig.js'

const clamp = (value, min = 0, max = RESOURCE_MAX) => Math.min(max, Math.max(min, value))
const resultWithEvent = (state, event) => ({ state, event })
const resourceFailure = (resources) => CRITICAL_RESOURCES.find((resource) => resources[resource] <= 0) ?? null

function changeResources(state, changes) {
  const resources = { ...state.resources }
  for (const [resource, change] of Object.entries(changes)) resources[resource] = clamp((resources[resource] ?? 0) + change)
  return { ...state, resources }
}

export function createInitialGameState() {
  return {
    status: 'running', currentSol: SOL_CONFIG.firstSol, resources: { ...INITIAL_RESOURCES },
    clock: { elapsedSeconds: 0, solElapsedSeconds: 0 },
    environment: { phase: 'dawn', dustStorm: false, radiationLevel: 1, eventLabel: null },
    rover: { battery: 0, expeditionSol: null, disabledUntilSol: null, pending: null, lastReturn: null },
    tomato: { planted: false, growth: 0, ageSeconds: 0, wateredThisSol: false, spoiled: false },
    samples: { counts: Object.fromEntries(SAMPLE_DEFINITIONS.map(({ type }) => [type, 0])), score: 0, discoveries: [] },
    photoAlbum: [], ending: null, history: [], lastSettledSol: null, supplyDelivered: false, lastEvent: null, alerts: [],
  }
}

export function addPower(state, amount) { return changeResources(state, { power: amount }) }
export function generateSolarPower(state, amount = BALANCE_CONFIG.solarPowerGeneration) { return addPower(state, amount) }

export function electrolyzeWater(state) {
  const { waterCost, powerCost, oxygenGain } = BALANCE_CONFIG.electrolysis
  if (state.resources.water < waterCost || state.resources.power < powerCost) return resultWithEvent(state, { type: 'electrolysis-failed', reason: 'insufficient-resources' })
  return resultWithEvent(changeResources(state, { water: -waterCost, power: -powerCost, oxygen: oxygenGain }), { type: 'electrolysis-complete' })
}

export function plantTomato(state) {
  if (state.tomato.planted) return resultWithEvent(state, { type: 'tomato-plant-failed', reason: 'already-planted' })
  return resultWithEvent({ ...state, tomato: { planted: true, growth: 0, ageSeconds: 0, wateredThisSol: false, spoiled: false } }, { type: 'tomato-planted' })
}

export function waterTomato(state) {
  const { waterCost } = BALANCE_CONFIG.tomato
  if (!state.tomato.planted || state.tomato.growth >= BALANCE_CONFIG.tomato.maxGrowth || state.tomato.spoiled) return resultWithEvent(state, { type: 'tomato-water-failed', reason: 'not-growing' })
  if (state.tomato.wateredThisSol) return resultWithEvent(state, { type: 'tomato-water-failed', reason: 'already-watered-this-sol' })
  if (state.resources.water < waterCost) return resultWithEvent(state, { type: 'tomato-water-failed', reason: 'insufficient-water' })
  return resultWithEvent({ ...changeResources(state, { water: -waterCost }), tomato: { ...state.tomato, wateredThisSol: true } }, { type: 'tomato-watered' })
}

export function harvestTomato(state) {
  const { maxGrowth, foodYield } = BALANCE_CONFIG.tomato
  if (!state.tomato.planted || state.tomato.growth < maxGrowth || state.tomato.spoiled) return resultWithEvent(state, { type: 'tomato-harvest-failed', reason: state.tomato.spoiled ? 'spoiled' : 'not-ready' })
  return resultWithEvent({ ...changeResources(state, { food: foodYield }), tomato: { planted: false, growth: 0, ageSeconds: 0, wateredThisSol: false, spoiled: false } }, { type: 'tomato-harvested', foodGained: foodYield })
}

export function chargeRover(state, batteryCells) {
  const targetBattery = clamp(Math.floor(batteryCells), 0, BALANCE_CONFIG.rover.maxBattery)
  const cellsToCharge = targetBattery - state.rover.battery
  if (cellsToCharge <= 0) return resultWithEvent(state, { type: 'rover-charge-failed', reason: 'invalid-target' })
  if (state.rover.pending || (state.rover.disabledUntilSol !== null && state.currentSol <= state.rover.disabledUntilSol)) return resultWithEvent(state, { type: 'rover-charge-failed', reason: 'rover-unavailable' })
  const powerCost = cellsToCharge * BALANCE_CONFIG.rover.powerPerBatteryCell
  if (state.resources.power < powerCost) return resultWithEvent(state, { type: 'rover-charge-failed', reason: 'insufficient-power' })
  return resultWithEvent({ ...changeResources(state, { power: -powerCost }), rover: { ...state.rover, battery: targetBattery } }, { type: 'rover-charged', battery: targetBattery, powerCost })
}

function batteryProbabilityMultiplier(battery) { if (battery >= 4) return 1; if (battery >= 2) return 0.75; if (battery === 1) return 0.5; return 0 }
export function getAdjustedSampleProbabilities(battery) {
  const multiplier = batteryProbabilityMultiplier(battery)
  return SAMPLE_DEFINITIONS.map((sample) => ({ ...sample, probability: sample.type === 'none' ? sample.probability + (1 - multiplier) * (1 - sample.probability) : sample.probability * multiplier }))
}
function pickSample(probabilities, randomValue) {
  const roll = clamp(randomValue, 0, 0.999999999); let cumulative = 0
  for (const sample of probabilities) { cumulative += sample.probability; if (roll < cumulative) return sample }
  return probabilities[probabilities.length - 1]
}

// 保留 Phase 2 的立即結果 API，供既有測試與資料層使用；新介面使用 launchRover，於下一 Sol 返航。
export function dispatchRover(state, randomValue = Math.random()) {
  if (state.rover.expeditionSol === state.currentSol || state.rover.pending) return resultWithEvent(state, { type: 'rover-dispatch-failed', reason: 'already-explored-this-sol' })
  if (state.rover.battery <= 0) return resultWithEvent(state, { type: 'rover-dispatch-failed', reason: 'empty-battery' })
  if (state.rover.disabledUntilSol !== null && state.currentSol <= state.rover.disabledUntilSol) return resultWithEvent(state, { type: 'rover-dispatch-failed', reason: 'rover-disabled' })
  const sample = pickSample(getAdjustedSampleProbabilities(state.rover.battery), randomValue)
  const counts = { ...state.samples.counts, [sample.type]: state.samples.counts[sample.type] + 1 }
  const next = { ...state, rover: { ...state.rover, battery: 0, expeditionSol: state.currentSol }, samples: { ...state.samples, counts, score: state.samples.score + sample.score, discoveries: [...state.samples.discoveries, { sol: state.currentSol, sample, quantity: 1 }] } }
  if (sample.specialEnding) next.ending = 'major-discovery'
  return resultWithEvent(next, { type: 'rover-dispatched', sample })
}

export function launchRover(state, randomValue = Math.random()) {
  if (state.rover.pending) return resultWithEvent(state, { type: 'rover-launch-failed', reason: 'rover-out-on-mission' })
  if (state.rover.battery <= 0) return resultWithEvent(state, { type: 'rover-launch-failed', reason: 'empty-battery' })
  if (state.rover.disabledUntilSol !== null && state.currentSol <= state.rover.disabledUntilSol) return resultWithEvent(state, { type: 'rover-launch-failed', reason: 'rover-disabled' })
  return resultWithEvent({ ...state, rover: { ...state.rover, pending: { dispatchedSol: state.currentSol, battery: state.rover.battery, randomValue }, battery: 0, expeditionSol: state.currentSol } }, { type: 'rover-launched', returnSol: state.currentSol + BALANCE_CONFIG.rover.returnAfterSols })
}

export function getScoreTitle(score) { return SAMPLE_SCORE_TITLES.find(({ minimum }) => score >= minimum).title }
function phaseForSeconds(seconds, duration) { const ratio = (seconds % duration) / duration; if (ratio < 0.2) return 'dawn'; if (ratio < 0.7) return 'day'; if (ratio < 0.85) return 'dusk'; return 'night' }
function makeEnvironment(random, previous) {
  const dustStorm = random() < BALANCE_CONFIG.events.dustStormChancePerSol
  const solarEvent = random() < BALANCE_CONFIG.events.solarParticleChancePerSol
  const radiationLevel = solarEvent ? 3 + Math.floor(random() * 3) : 1 + Math.floor(random() * 2)
  return { ...previous, dustStorm, radiationLevel, eventLabel: dustStorm ? BALANCE_CONFIG.events.dustStormLabel : solarEvent ? BALANCE_CONFIG.events.solarParticleLabel : null }
}
function resolveRoverAtBoundary(state, random) {
  if (!state.rover.pending || state.rover.pending.dispatchedSol >= state.currentSol) return state
  const pending = state.rover.pending; const damaged = state.environment.radiationLevel >= 3 && random() < BALANCE_CONFIG.events.highRadiationDamageChance
  if (damaged) {
    const repairSols = BALANCE_CONFIG.rover.repairSolsMin + Math.floor(random() * (BALANCE_CONFIG.rover.repairSolsMax - BALANCE_CONFIG.rover.repairSolsMin + 1))
    return { ...state, rover: { ...state.rover, pending: null, disabledUntilSol: state.currentSol + repairSols - 1, lastReturn: { damaged: true, repairSols } } }
  }
  const maxQuantity = BALANCE_CONFIG.rover.maxSamplesByBattery[pending.battery] ?? 1
  const quantity = Math.max(1, Math.min(maxQuantity, 1 + Math.floor(random() * maxQuantity)))
  let next = { ...state, rover: { ...state.rover, pending: null, lastReturn: { damaged: false, quantity } } }
  for (let index = 0; index < quantity; index += 1) {
    const sample = pickSample(getAdjustedSampleProbabilities(pending.battery), random())
    const counts = { ...next.samples.counts, [sample.type]: next.samples.counts[sample.type] + 1 }
    next = { ...next, samples: { ...next.samples, counts, score: next.samples.score + sample.score, discoveries: [...next.samples.discoveries, { sol: pending.dispatchedSol, sample, quantity: 1 }] } }
    if (sample.specialEnding) next.ending = 'major-discovery'
  }
  return next
}
function updateTomato(state, seconds, solDurationSeconds) {
  if (!state.tomato.planted || state.tomato.spoiled) return state
  const ageSeconds = state.tomato.ageSeconds + seconds; const matureAt = solDurationSeconds * TIME_CONFIG.halfSolRatio
  if (ageSeconds >= solDurationSeconds && state.tomato.growth >= BALANCE_CONFIG.tomato.maxGrowth) return { ...state, tomato: { ...state.tomato, ageSeconds, spoiled: true } }
  if (ageSeconds >= matureAt && state.tomato.growth < BALANCE_CONFIG.tomato.maxGrowth) return { ...state, tomato: { ...state.tomato, ageSeconds, growth: BALANCE_CONFIG.tomato.maxGrowth } }
  return { ...state, tomato: { ...state.tomato, ageSeconds } }
}
function settleBoundary(state, random) {
  const settledSol = state.currentSol; const history = [...state.history, settledSol]; const nextSol = settledSol + 1
  if (settledSol >= SOL_CONFIG.finalSol) return { ...state, history, lastSettledSol: settledSol, ending: state.ending ?? 'normal-completion', status: 'ended' }
  const supplied = (settledSol === SOL_CONFIG.supplySol || nextSol === SOL_CONFIG.supplySol) && !state.supplyDelivered
  let next = { ...state, currentSol: nextSol, clock: { ...state.clock, solElapsedSeconds: 0 }, history, lastSettledSol: settledSol, supplyDelivered: state.supplyDelivered || supplied, environment: makeEnvironment(random, state.environment), lastEvent: supplied ? 'supply-arrived' : null, alerts: [] }
  next = resolveRoverAtBoundary(next, random)
  return supplied ? changeResources(next, { water: RESOURCE_MAX, food: RESOURCE_MAX }) : next
}

export function advanceGameTime(state, deltaSeconds, options = {}) {
  if (state.ending || state.status !== 'running' || deltaSeconds <= 0) return resultWithEvent(state, { type: 'time-paused' })
  const duration = options.solDurationSeconds ?? TIME_CONFIG.solDurationSeconds; const random = options.random ?? Math.random
  let next = state; let remaining = deltaSeconds
  const rates = Object.fromEntries(Object.entries(BALANCE_CONFIG.dailyConsumption).map(([key, value]) => [key, value / duration]))
  while (remaining > 0 && !next.ending) {
    const toBoundary = duration - next.clock.solElapsedSeconds; const step = Math.min(remaining, toBoundary); const phase = phaseForSeconds(next.clock.solElapsedSeconds, duration)
    const solarEfficiency = phase === 'night' ? 0 : next.environment.dustStorm ? BALANCE_CONFIG.solar.dustStormEfficiency : 1
    next = changeResources(next, { oxygen: -rates.oxygen * step, water: -rates.water * step, food: -rates.food * step, power: (BALANCE_CONFIG.solarPowerGeneration / duration * solarEfficiency - rates.power) * step })
    next = updateTomato(next, step, duration)
    next = { ...next, clock: { elapsedSeconds: next.clock.elapsedSeconds + step, solElapsedSeconds: next.clock.solElapsedSeconds + step }, environment: { ...next.environment, phase } }
    const failed = resourceFailure(next.resources)
    if (failed) { next = { ...next, ending: 'emergency-abort', status: 'ended', alerts: [`${failed} 已耗盡`] }; break }
    remaining -= step
    if (step === toBoundary) next = settleBoundary(next, random)
  }
  const warnings = CRITICAL_RESOURCES.filter((resource) => next.resources[resource] < 25).map((resource) => resource)
  return resultWithEvent({ ...next, alerts: warnings }, { type: next.ending ?? 'time-advanced', seconds: deltaSeconds })
}

// 舊版測試與相容呼叫保留；實際介面使用 advanceGameTime 的連續時間。
export function settleSol(state, actions = {}) {
  if (state.ending) return resultWithEvent(state, { type: 'settlement-failed', reason: 'game-ended' })
  if (state.lastSettledSol === state.currentSol || state.history.includes(state.currentSol)) return resultWithEvent(state, { type: 'settlement-failed', reason: 'sol-already-settled' })
  let next = actions.electrolyze ? electrolyzeWater(state).state : state
  const result = advanceGameTime(next, TIME_CONFIG.solDurationSeconds, { random: actions.random ?? (() => 0.99) })
  const supplyEvent = result.state.supplyDelivered && !state.supplyDelivered ? '+supply-arrived' : ''
  return resultWithEvent(result.state, { type: `${result.state.ending === 'normal-completion' ? 'sol-settled+normal-completion' : 'sol-settled'}${supplyEvent}`, settledSol: state.currentSol })
}
