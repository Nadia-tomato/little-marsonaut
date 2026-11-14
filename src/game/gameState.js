import {
  BALANCE_CONFIG,
  CRITICAL_RESOURCES,
  INITIAL_RESOURCES,
  RESOURCE_MAX,
  SAMPLE_DEFINITIONS,
  SAMPLE_SCORE_TITLES,
  SOL_CONFIG,
} from '../config/gameConfig.js'

const clamp = (value, min = 0, max = RESOURCE_MAX) => Math.min(max, Math.max(min, value))

const cloneResources = (resources) => ({ ...resources })

const updateResources = (state, changes) => {
  const resources = cloneResources(state.resources)
  for (const [resource, change] of Object.entries(changes)) {
    resources[resource] = clamp((resources[resource] ?? 0) + change)
  }
  return { ...state, resources }
}

const hasCriticalResourceFailure = (resources) =>
  CRITICAL_RESOURCES.some((resource) => resources[resource] <= 0)

const resultWithEvent = (state, event) => ({
  state,
  event,
})

export function createInitialGameState() {
  return {
    currentSol: SOL_CONFIG.firstSol,
    resources: cloneResources(INITIAL_RESOURCES),
    rover: {
      battery: 0,
      expeditionSol: null,
      disabledUntilSol: null,
    },
    tomato: {
      planted: false,
      growth: 0,
      wateredThisSol: false,
    },
    samples: {
      counts: Object.fromEntries(SAMPLE_DEFINITIONS.map(({ type }) => [type, 0])),
      score: 0,
    },
    ending: null,
    history: [],
    lastSettledSol: null,
  }
}

export function addPower(state, amount) {
  return updateResources(state, { power: amount })
}

export function generateSolarPower(state, amount = BALANCE_CONFIG.solarPowerGeneration) {
  return addPower(state, amount)
}

export function electrolyzeWater(state) {
  const { waterCost, powerCost, oxygenGain } = BALANCE_CONFIG.electrolysis
  if (state.resources.water < waterCost || state.resources.power < powerCost) {
    return resultWithEvent(state, { type: 'electrolysis-failed', reason: 'insufficient-resources' })
  }

  const nextState = updateResources(state, {
    water: -waterCost,
    power: -powerCost,
    oxygen: oxygenGain,
  })
  return resultWithEvent(nextState, { type: 'electrolysis-complete' })
}

export function plantTomato(state) {
  if (state.tomato.planted) {
    return resultWithEvent(state, { type: 'tomato-plant-failed', reason: 'already-planted' })
  }

  return resultWithEvent({
    ...state,
    tomato: { planted: true, growth: 0, wateredThisSol: false },
  }, { type: 'tomato-planted' })
}

export function waterTomato(state) {
  const { waterCost } = BALANCE_CONFIG.tomato
  if (!state.tomato.planted || state.tomato.growth >= BALANCE_CONFIG.tomato.maxGrowth) {
    return resultWithEvent(state, { type: 'tomato-water-failed', reason: 'not-growing' })
  }
  if (state.tomato.wateredThisSol) {
    return resultWithEvent(state, { type: 'tomato-water-failed', reason: 'already-watered-this-sol' })
  }
  if (state.resources.water < waterCost) {
    return resultWithEvent(state, { type: 'tomato-water-failed', reason: 'insufficient-water' })
  }

  const nextState = updateResources(state, { water: -waterCost })
  return resultWithEvent({
    ...nextState,
    tomato: { ...nextState.tomato, wateredThisSol: true },
  }, { type: 'tomato-watered' })
}

export function harvestTomato(state) {
  const { maxGrowth, foodYield } = BALANCE_CONFIG.tomato
  if (!state.tomato.planted || state.tomato.growth < maxGrowth) {
    return resultWithEvent(state, { type: 'tomato-harvest-failed', reason: 'not-ready' })
  }

  const nextState = updateResources(state, { food: foodYield })
  return resultWithEvent({
    ...nextState,
    tomato: { planted: false, growth: 0, wateredThisSol: false },
  }, { type: 'tomato-harvested', foodGained: foodYield })
}

export function chargeRover(state, batteryCells) {
  const maxBattery = BALANCE_CONFIG.rover.maxBattery
  const targetBattery = clamp(Math.floor(batteryCells), 0, maxBattery)
  const cellsToCharge = targetBattery - state.rover.battery
  if (cellsToCharge <= 0) {
    return resultWithEvent(state, { type: 'rover-charge-failed', reason: 'invalid-target' })
  }

  const powerCost = cellsToCharge * BALANCE_CONFIG.rover.powerPerBatteryCell
  if (state.resources.power < powerCost) {
    return resultWithEvent(state, { type: 'rover-charge-failed', reason: 'insufficient-power' })
  }

  const nextState = updateResources(state, { power: -powerCost })
  return resultWithEvent({
    ...nextState,
    rover: { ...nextState.rover, battery: targetBattery },
  }, { type: 'rover-charged', battery: targetBattery, powerCost })
}

function batteryProbabilityMultiplier(battery) {
  if (battery >= 4) return 1
  if (battery >= 2) return 0.75
  if (battery === 1) return 0.5
  return 0
}

export function getAdjustedSampleProbabilities(battery) {
  const multiplier = batteryProbabilityMultiplier(battery)
  const adjusted = SAMPLE_DEFINITIONS.map((sample) => ({
    ...sample,
    probability: sample.type === 'none'
      ? sample.probability + (1 - multiplier) * (1 - sample.probability)
      : sample.probability * multiplier,
  }))
  return adjusted
}

function pickSample(probabilities, randomValue) {
  const roll = clamp(randomValue, 0, 0.999999999)
  let cumulative = 0
  for (const sample of probabilities) {
    cumulative += sample.probability
    if (roll < cumulative) return sample
  }
  return probabilities[probabilities.length - 1]
}

export function dispatchRover(state, randomValue = Math.random()) {
  if (state.rover.expeditionSol === state.currentSol) {
    return resultWithEvent(state, { type: 'rover-dispatch-failed', reason: 'already-explored-this-sol' })
  }
  if (state.rover.battery <= 0) {
    return resultWithEvent(state, { type: 'rover-dispatch-failed', reason: 'empty-battery' })
  }
  if (state.rover.disabledUntilSol !== null && state.currentSol <= state.rover.disabledUntilSol) {
    return resultWithEvent(state, { type: 'rover-dispatch-failed', reason: 'rover-disabled' })
  }

  const sample = pickSample(getAdjustedSampleProbabilities(state.rover.battery), randomValue)
  const counts = { ...state.samples.counts, [sample.type]: state.samples.counts[sample.type] + 1 }
  const nextState = {
    ...state,
    rover: { ...state.rover, battery: 0, expeditionSol: state.currentSol },
    samples: { counts, score: state.samples.score + sample.score },
  }

  if (sample.specialEnding) {
    nextState.ending = 'major-discovery'
  }
  return resultWithEvent(nextState, { type: 'rover-dispatched', sample })
}

export function getScoreTitle(score) {
  return SAMPLE_SCORE_TITLES.find(({ minimum }) => score >= minimum).title
}

function growTomato(state) {
  if (!state.tomato.planted) return state
  const growth = state.tomato.wateredThisSol
    ? Math.min(BALANCE_CONFIG.tomato.maxGrowth, state.tomato.growth + BALANCE_CONFIG.tomato.growthPerWateredSol)
    : state.tomato.growth
  return {
    ...state,
    tomato: { ...state.tomato, growth, wateredThisSol: false },
  }
}

export function settleSol(state, actions = {}) {
  if (state.ending) return resultWithEvent(state, { type: 'settlement-failed', reason: 'game-ended' })
  if (state.lastSettledSol === state.currentSol || state.history.includes(state.currentSol)) {
    return resultWithEvent(state, { type: 'settlement-failed', reason: 'sol-already-settled' })
  }

  let nextState = state
  if (actions.electrolyze) nextState = electrolyzeWater(nextState).state
  nextState = generateSolarPower(nextState)
  nextState = updateResources(nextState, {
    oxygen: -BALANCE_CONFIG.dailyConsumption.oxygen,
    water: -BALANCE_CONFIG.dailyConsumption.water,
    food: -BALANCE_CONFIG.dailyConsumption.food,
    power: -BALANCE_CONFIG.dailyConsumption.power,
  })
  nextState = growTomato(nextState)

  const settledSol = state.currentSol
  const history = [...state.history, settledSol]
  const eventTypes = ['sol-settled']

  if (settledSol === SOL_CONFIG.supplySol) {
    nextState = updateResources(nextState, { water: RESOURCE_MAX, food: RESOURCE_MAX })
    eventTypes.push('supply-arrived')
  }

  if (hasCriticalResourceFailure(nextState.resources)) {
    nextState = { ...nextState, ending: 'emergency-abort' }
    eventTypes.push('emergency-abort')
  } else if (settledSol >= SOL_CONFIG.finalSol) {
    nextState = { ...nextState, ending: 'normal-completion' }
    eventTypes.push('normal-completion')
  } else {
    nextState = { ...nextState, currentSol: settledSol + 1 }
  }

  return resultWithEvent({ ...nextState, history, lastSettledSol: settledSol }, { type: eventTypes.join('+'), settledSol })
}
