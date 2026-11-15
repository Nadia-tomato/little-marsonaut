// Module 5C: Daily Mars Weather & Resource Report Modal
function MorningBriefingModule({
      visible,
      sol,
      weather,
      yesterdayConsumption,
      onConfirm,
    }) {
      if (!visible || !weather) return null;
      const radInfo = RADIATION_LABELS[weather.radiationLevel || 1];

      return (
        <div className="fixed inset-0 bg-[#2d1e12]/75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] text-[#4a3525] rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
            <div className="flex items-center justify-between border-b-2 border-[#eadbc5] pb-3">
              <div>
                <span className="text-xs font-extrabold text-amber-700">LITTLE MARSONAUT • DAILY WEATHER</span>
                <h2 className="text-xl font-black text-[#4a3525]">
                  Day {sol} — Mars Weather Report
                </h2>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white ${radInfo.color}`}>
                Sun Rays: {radInfo.text}
              </span>
            </div>

            {weather.isDustStorm && (
              <div className="mx-2 my-1 bg-amber-100 border-2 border-amber-500 rounded-2xl p-3 text-xs md:text-sm font-black text-amber-950 flex items-center gap-3 shadow-md animate-storm-banner">
                <span className="text-3xl shrink-0">🌪️</span>
                <div>
                  <div className="text-amber-900 font-black text-sm">DUST STORM WARNING!</div>
                  <div className="text-amber-950 font-bold text-xs">
                    Strong winds and red dust outside! Solar panels will catch less sunlight today.
                  </div>
                </div>
              </div>
            )}

            {sol === 10 && (
              <div className="bg-amber-200 border-2 border-amber-500 rounded-2xl p-3 text-xs font-black text-amber-950 flex items-center gap-2.5">
                <span className="text-2xl">🚀</span>
                <span>Supply Rocket Landed Outside! Water and Food are refilled to 100!</span>
              </div>
            )}

            {sol > 1 && yesterdayConsumption && (
              <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 space-y-2">
                <div className="text-xs font-black text-amber-900">
                  📊 Day {sol - 1} Supplies Used
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 flex justify-between items-start gap-2">
                    <span className="font-black text-amber-700 shrink-0">⚡ Power: -{yesterdayConsumption.powerCost}</span>
                    <span className="text-[#5a3e28] text-right">{yesterdayConsumption.powerReasonText}</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-sky-200 flex justify-between items-start gap-2">
                    <span className="font-black text-sky-700 shrink-0">💧 Water: -{yesterdayConsumption.waterCost}</span>
                    <span className="text-[#5a3e28] text-right">{yesterdayConsumption.waterReasonText}</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-red-200 flex justify-between items-start gap-2">
                    <span className="font-black text-red-700 shrink-0">🍅 Food: -{yesterdayConsumption.foodCost}</span>
                    <span className="text-[#5a3e28] text-right">{yesterdayConsumption.foodReasonText}</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-cyan-200 flex justify-between items-start gap-2">
                    <span className="font-black text-cyan-700 shrink-0">🫧 Air (O₂): -{yesterdayConsumption.oxygenCost}</span>
                    <span className="text-[#5a3e28] text-right">{yesterdayConsumption.oxygenReasonText}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#eadbc5] space-y-2">
              <div className="text-xs font-black text-[#5a3e28]">🌡️ Day {sol} Mars Weather</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#fdf6e9] p-2 rounded-xl border border-[#eadbc5]">
                  <div className="text-[#7a5a40]">Day / Night</div>
                  <div className="font-black text-sm mt-0.5">{weather.tempMax}°C / {weather.tempMin}°C</div>
                </div>
                <div className="bg-[#fdf6e9] p-2 rounded-xl border border-[#eadbc5]">
                  <div className="text-[#7a5a40]">Wind</div>
                  <div className="font-black text-sm mt-0.5">{weather.windSpeedMs} m/s</div>
                </div>
                <div className="bg-[#fdf6e9] p-2 rounded-xl border border-[#eadbc5]">
                  <div className="text-[#7a5a40]">Sky</div>
                  <div className="font-black text-sm mt-0.5 text-amber-700">
                    {weather.isDustStorm ? '🌪️ Dust Storm' : '☀️ Clear Sky'}
                  </div>
                </div>
              </div>
              <div className="text-xs md:text-sm text-[#5a3e28] font-bold pt-1">
                Tip: <span className="text-amber-800">
                  {weather.isDustStorm ? 'Dust storms block sunlight and can hurt the rover!' : radInfo.advice}
                </span>
              </div>
            </div>

            <button
              onClick={onConfirm}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-base shadow-md"
            >
              {sol === 1 ? 'Start Day 1!' : `Start Day ${sol}!`}
            </button>
          </div>
        </div>
      );
    }
