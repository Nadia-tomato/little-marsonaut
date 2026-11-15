// Module 3: Core Game Rules, Probabilities & Resource Math
// [Module 3: Core Game Rules & Calculations]
    // =========================================================================
    const GameLogicModule = (() => {
      function rollRoverExplorationByCost(barsCost) {
        const mode = ROVER_DISPATCH_MODES[barsCost] || ROVER_DISPATCH_MODES[2];
        const roll = Math.random() * 100;
        let acc = 0;
        let chosenSpec = SAMPLE_CATALOG.find((s) => s.id === 'NONE');

        for (const sample of SAMPLE_CATALOG) {
          if (sample.id === 'NONE') continue;
          const weight = sample.isRare
            ? sample.baseProbability * mode.discoveryMultiplier * mode.rareBonus
            : sample.baseProbability * mode.discoveryMultiplier;

          acc += weight;
          if (roll < acc) {
            chosenSpec = sample;
            break;
          }
        }

        const randomStory =
          chosenSpec.variations[Math.floor(Math.random() * chosenSpec.variations.length)];

        return {
          ...chosenSpec,
          chosenExplanation: randomStory,
        };
      }

      function evaluateRoverReturnHazard(isDustStorm, radiationLevel) {
        let hazardChance = 0;
        const reasons = [];

        if (isDustStorm) {
          hazardChance += 0.50;
          reasons.push('dust storm sand stuck in the wheels');
        }
        if (radiationLevel === 4) {
          hazardChance += 0.30;
          reasons.push('strong sun rays (radiation)');
        } else if (radiationLevel === 5) {
          hazardChance += 0.55;
          reasons.push('a huge sun storm');
        }

        if (hazardChance > 0 && Math.random() < Math.min(0.85, hazardChance)) {
          const freezeSols = (isDustStorm && radiationLevel >= 4) || radiationLevel === 5 ? 2 : 1;
          return {
            isDamaged: true,
            damagedSols: freezeSols,
            reasonText: reasons.join(' and '),
          };
        }

        return {
          isDamaged: false,
          damagedSols: 0,
          reasonText: reasons.join(' and '),
          wasHazardous: hazardChance > 0,
        };
      }

      function getGreenhouseSeparateOptions(tempMin) {
        const isExtremeCold = tempMin <= -76;

        return {
          weatherTag: isExtremeCold
            ? `Freezing Night (${tempMin}°C)`
            : `Chilly Night (${tempMin}°C)`,
          tempOptions: isExtremeCold
            ? [
                {
                  id: 'TEMP_ECO',
                  title: 'Warm Blanket + Low Light',
                  powerCost: 4,
                  minGain: 1,
                  maxGain: 2,
                  desc: 'Keeps plants safe from freezing while saving power.',
                },
                {
                  id: 'TEMP_WARM',
                  title: 'Big Heater + Bright Sun Lamps',
                  powerCost: 10,
                  minGain: 2,
                  maxGain: 3,
                  desc: 'Super warm and bright—helps watered tomatoes grow twice as fast!',
                },
              ]
            : [
                {
                  id: 'TEMP_ECO',
                  title: 'Cozy Heat + Soft Lamps',
                  powerCost: 3,
                  minGain: 1,
                  maxGain: 2,
                  desc: 'Keeps a nice room temperature and saves power.',
                },
                {
                  id: 'TEMP_WARM',
                  title: 'Bright Sun Grow Lamps',
                  powerCost: 8,
                  minGain: 2,
                  maxGain: 3,
                  desc: 'Shines extra light on leaves so watered tomatoes grow much faster!',
                },
              ],
        };
      }

      function calculateDailyResourceConsumption(weather, roverStatus) {
        let powerCost = 8;
        if (weather.tempMin <= -80) {
          powerCost += 5;
        } else if (weather.tempMin <= -74) {
          powerCost += 3;
        } else {
          powerCost += 1;
        }
        if (weather.isDustStorm) {
          powerCost += 2;
        }

        let waterCost = 4;
        if (weather.windSpeedMs >= 8.0) {
          waterCost += 2;
        } else if (Math.random() < 0.4) {
          waterCost += 1;
        }

        let foodCost = 10;
        if (roverStatus === 'OUT_ON_MISSION' || weather.isDustStorm) {
          foodCost += 2;
        } else if (Math.random() < 0.5) {
          foodCost += 1;
        }

        let oxygenCost = 10;
        if (weather.radiationLevel >= 4) {
          oxygenCost += 2;
        }

        return { powerCost, waterCost, foodCost, oxygenCost };
      }

      function calculateSolarGameReward(caughtCount, isDustStorm, sol = 1, totalResolved = 0) {
        if (caughtCount <= 0) return 0;
        const baseMaxCap = isDustStorm ? 16 : 30;
        const dayFactor = Math.max(0.65, 1 - (Math.max(1, sol) - 1) * 0.018);
        const maxCap = Math.max(8, Math.round(baseMaxCap * dayFactor));
        const denominator = Math.max(caughtCount, totalResolved);
        const catchRatio = caughtCount / denominator;
        return Math.min(maxCap, Math.max(1, Math.round(maxCap * catchRatio)));
      }

      function getSolarEfficiencyGrade(caughtCount, isDustStorm) {
        if (caughtCount <= 0) return { label: 'No Sunlight Caught', color: 'text-red-500' };
        const highThreshold = isDustStorm ? 10 : 14;
        const midThreshold = isDustStorm ? 6 : 9;
        if (caughtCount >= highThreshold) return { label: 'Super Sun Catcher!', color: 'text-amber-600' };
        if (caughtCount >= midThreshold) return { label: 'Great Job!', color: 'text-emerald-600' };
        return { label: 'Some Power Saved', color: 'text-sky-600' };
      }

      function getAstronautRank(score) {
        if (score >= 180) return 'Mars Science Champion';
        if (score >= 120) return 'Super Mars Astronaut';
        if (score >= 70) return 'Red Planet Explorer';
        if (score >= 30) return 'Junior Astronaut';
        return 'Space Cadet';
      }

      return {
        rollRoverExplorationByCost,
        evaluateRoverReturnHazard,
        getGreenhouseSeparateOptions,
        calculateDailyResourceConsumption,
        calculateSolarGameReward,
        getSolarEfficiencyGrade,
        getAstronautRank,
      };
    })();

    // =========================================================================
