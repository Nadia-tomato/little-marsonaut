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
            <div className="border-b-2 border-[#eadbc5] pb-3 space-y-1">
              <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wide">
                LITTLE MARSONAUT • SIMULATED MARS CONDITIONS
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#4a3525]">
                {`Sol ${sol} — Mars Environment Report`}
              </h2>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Mars conditions are simulated for gameplay. Space weather is inspired by NASA data.
              </p>
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

            {(sol === 6 || sol === 12 || sol === 16) && (
              <div className="bg-amber-200 border-2 border-amber-500 rounded-2xl p-3 text-xs font-black text-amber-950 flex items-center gap-2.5">
                <span className="text-2xl">🚀</span>
                <span>{`Sol ${sol} Supply Rocket Landed! ${sol === 16 ? '+30 Water & +20 Food' : '+40 Water & +30 Food'} waiting to be collected!`}</span>
              </div>
            )}

            {sol > 1 && yesterdayConsumption && (
              <div className="bg-amber-50 p-3.5 rounded-2xl border-2 border-amber-300 space-y-2">
                <div className="text-xs font-black text-amber-900">
                  {`📊 Sol ${sol - 1} Supplies Used`}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white px-3 py-2 rounded-xl border border-amber-200 flex items-center justify-center">
                    <span className="font-black text-amber-700">⚡ Power: -{yesterdayConsumption.powerCost}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-sky-200 flex items-center justify-center">
                    <span className="font-black text-sky-700">💧 Water: -{yesterdayConsumption.waterCost}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-red-200 flex items-center justify-center">
                    <span className="font-black text-red-700">🍅 Food: -{yesterdayConsumption.foodCost}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-xl border border-cyan-200 flex items-center justify-center">
                    <span className="font-black text-cyan-700">🫧 Air (O₂): -{yesterdayConsumption.oxygenCost}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-3.5 rounded-2xl border-2 border-[#eadbc5] space-y-2">
              <div className="text-xs font-black text-[#5a3e28]">{`🌡️ Sol ${sol} Mars Weather`}</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#fdf6e9] p-2 rounded-xl border border-[#eadbc5]">
                  <div className="text-[#7a5a40]">Day / Night</div>
                  <div className="font-black text-sm mt-0.5">{`${weather.tempMax}°C / ${weather.tempMin}°C`}</div>
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
              {sol === 1 ? 'Start Sol 1!' : `Start Sol ${sol}!`}
            </button>
          </div>
        </div>
      );
    }
