// Module 3: Core Game Rules, Probabilities & Resource Math
// [Module 3: Core Game Rules & Calculations]
    // =========================================================================
    const GameLogicModule = (() => {
      function rollSingleMineral(excludeNone = false) {
        const pool = SAMPLE_CATALOG.filter((s) => s.id !== 'ANCIENT_BIOSIGNATURE' && (!excludeNone || s.id !== 'NONE'));
        const roll = Math.random() * 100;
        let acc = 0;
        let picked = pool[0];

        // Normalized distribution
        const weights = {
          BASALT: excludeNone ? 40 : 35,
          IRON_OXIDE: excludeNone ? 30 : 25,
          SPECIAL_GEO: excludeNone ? 18 : 15,
          HYDRATED: excludeNone ? 12 : 10,
          NONE: excludeNone ? 0 : 15,
        };

        for (const s of pool) {
          acc += weights[s.id] || 10;
          if (roll < acc) {
            picked = s;
            break;
          }
        }

        const randomStory = picked.variations[Math.floor(Math.random() * picked.variations.length)];
        return {
          ...picked,
          chosenExplanation: randomStory,
        };
      }

      function rollRoverExplorationByCost(barsCost) {
        const bioSample = SAMPLE_CATALOG.find((s) => s.id === 'ANCIENT_BIOSIGNATURE');
        const randomBioStory = bioSample?.variations[Math.floor(Math.random() * bioSample.variations.length)] || '';

        // Mode 3 (30 ⚡ Far Dig): 5% life-clue stone, 50% chance of 2 mineral rocks
        if (barsCost === 3) {
          if (Math.random() < 0.05 && bioSample) {
            const bioResult = { ...bioSample, chosenExplanation: randomBioStory };
            return {
              ...bioResult,
              samples: [bioResult],
              isDoubleDiscovery: false,
            };
          }

          // 50% chance to discover two minerals!
          if (Math.random() < 0.50) {
            const first = rollSingleMineral(true);
            const second = rollSingleMineral(true);
            return {
              ...first,
              samples: [first, second],
              isDoubleDiscovery: true,
            };
          }

          const single = rollSingleMineral(false);
          return {
            ...single,
            samples: [single],
            isDoubleDiscovery: false,
          };
        }

        // Mode 2 (20 ⚡ Crater Trip): 1% life-clue stone, standard rocks
        if (barsCost === 2) {
          if (Math.random() < 0.01 && bioSample) {
            const bioResult = { ...bioSample, chosenExplanation: randomBioStory };
            return {
              ...bioResult,
              samples: [bioResult],
              isDoubleDiscovery: false,
            };
          }

          const single = rollSingleMineral(false);
          return {
            ...single,
            samples: [single],
            isDoubleDiscovery: false,
          };
        }

        // Mode 1 (10 ⚡ Short Walk): 0% life-clue stone, quick standard rocks
        const single = rollSingleMineral(false);
        return {
          ...single,
          samples: [single],
          isDoubleDiscovery: false,
        };
      }

      function evaluateRoverReturnHazard(isDustStorm, radiationLevel) {
        let hazardChance = 0;
        const reasons = [];

        if (isDustStorm) {
          hazardChance += 0.50; // Changed from 0.60 to 0.50
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
          tempOptions: [
            {
              id: 'TEMP_ECO',
              title: 'Cozy Heat + Low Light (1 ⚡/plant)',
              powerCost: 4, // 1 power per plant * 4 plants = 4 power total
              minGain: 1,
              maxGain: 2,
              desc: 'Grows in 80 seconds (costs 1 ⚡ per plant, 4 ⚡ total). Keeps seedlings safe.',
            },
            {
              id: 'TEMP_WARM',
              title: 'Bright Sun Grow Lamps (2 ⚡/plant)',
              powerCost: 8, // 2 power per plant * 4 plants = 8 power total
              minGain: 2,
              maxGain: 3,
              desc: 'Grows in 60 seconds (costs 2 ⚡ per plant, 8 ⚡ total). Super bright light speeds growth!',
            },
          ],
        };
      }

      function calculateDailyResourceConsumption(weather, roverStatus) {
        let powerCost = 5; // Base power consumption changed from 8 to 5
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

        let foodCost = 15;
        if (roverStatus === 'OUT_ON_MISSION' || weather.isDustStorm) {
          foodCost += 3;
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
        const maxCap = isDustStorm ? 20 : 35;
        const denominator = Math.max(caughtCount, totalResolved);
        if (denominator <= 0) return maxCap;
        const catchRatio = Math.min(1, Math.max(0, caughtCount / denominator));

        // If performed exceptionally well (caught >= 92% of falling sunbeams), reward full cap!
        if (catchRatio >= 0.92) {
          return maxCap;
        }

        // Proportional integer conversion: ratio * maxCap
        return Math.max(1, Math.min(maxCap, Math.round(maxCap * catchRatio)));
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
