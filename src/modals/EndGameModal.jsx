// Module 5D: End-of-Mission Report Card & Badges
function EndGameModule({
      ending,
      abortReason,
      sol,
      totalScore,
      samples,
      expeditionLogs,
      dailyPhotoAlbum,
      unlockedBadges,
      onRestart,
    }) {
      if (!ending) return null;

      const collectedNonZeroSamples = SAMPLE_CATALOG.filter(
        (s) => s.id !== 'NONE' && samples[s.id] > 0
      );
      const successfulDrills = expeditionLogs.filter((log) => log.sample && log.sample.id !== 'NONE');

      return (
        <div className="min-h-screen bg-[#fdf6e9] text-[#4a3525] p-4 md:p-8 flex flex-col items-center relative">
          {(ending === 'SPECIAL_DISCOVERY' || ending === 'NORMAL_20_SOL') && <ConfettiRibbonCelebration />}
          <div className="max-w-4xl w-full bg-white border-4 border-[#d9c2a3] rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative z-10">
            <div className={`text-center space-y-2 ${ending === 'EMERGENCY_ABORT' ? 'bg-red-100 border-4 border-red-300 rounded-3xl p-4' : ''}`}>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-900">
                LITTLE MARSONAUT • REPORT CARD
              </span>
              <h1 className={`text-2xl md:text-3xl font-black ${ending === 'EMERGENCY_ABORT' ? 'text-red-900' : ''}`}>
                {ending === 'SPECIAL_DISCOVERY' && '🎉 Amazing Find! You Won the Mission!'}
                {ending === 'NORMAL_20_SOL' && 'Awesome Job! You Lived 20 Days on Mars!'}
                {ending === 'EMERGENCY_ABORT' && (
                  <div className="space-y-1.5">
                    <div>Mission Ended Early</div>
                    <div className="text-base md:text-lg font-bold text-red-700 bg-red-200/70 py-1 px-4 rounded-full inline-block">
                      {abortReason}
                    </div>
                  </div>
                )}
              </h1>
              {ending === 'SPECIAL_DISCOVERY' && (
                <p className="text-sm text-amber-900 bg-amber-100 p-3 rounded-2xl border-2 border-amber-300 font-bold">
                  &ldquo;Huge discovery! This special rock has clues about ancient life on Mars—flying back to Earth now!&rdquo;
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-[#fdf6e9] border-2 border-[#eadbc5] p-3 rounded-2xl">
                <div className="text-xs text-[#7a5a40] font-bold">Days on Mars</div>
                <div className="text-xl font-black">{sol} Days</div>
              </div>
              <div className="bg-[#fdf6e9] border-2 border-[#eadbc5] p-3 rounded-2xl">
                <div className="text-xs text-[#7a5a40] font-bold">Science Score</div>
                <div className="text-xl font-black text-sky-700">
                  {ending === 'SPECIAL_DISCOVERY' ? 'Amazing!' : `${totalScore} pts`}
                </div>
              </div>
              <div className="bg-[#fdf6e9] border-2 border-[#eadbc5] p-3 rounded-2xl col-span-2">
                <div className="text-xs text-[#7a5a40] font-bold">Astronaut Title</div>
                <div className="text-xl font-black text-amber-700">
                  {ending === 'SPECIAL_DISCOVERY' ? 'Legendary Mars Explorer' : GameLogicModule.getAstronautRank(totalScore)}
                </div>
              </div>
            </div>

            <div className="bg-[#fdf6e9] border-2 border-[#eadbc5] p-4 rounded-2xl space-y-3">
              <h2 className="font-black text-sm text-sky-900">
                Mars Rocks &amp; Discoveries ({collectedNonZeroSamples.length} Types, {successfulDrills.length} Finds)
              </h2>
              {collectedNonZeroSamples.length === 0 ? (
                <p className="text-xs text-[#7a5a40]">No rocks found this time—send {OUR_ROVER_NAME} out and try again!</p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {collectedNonZeroSamples.map((s) => (
                    <div key={s.id} className="bg-white border border-[#dcc7a9] rounded-xl p-3 flex items-start gap-3 shadow-sm">
                      <RockSpecimenIcon rock={s} size={42} />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center text-xs font-black">
                          <span className="text-sky-800">{s.name}</span>
                          <span className="text-amber-700">
                            × {samples[s.id]}
                          </span>
                        </div>
                        <p className="text-xs text-[#4a3525] leading-relaxed">{s.chosenExplanation || s.scientificNote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(() => {
              const earnedBadges = unlockedBadges.filter((b) => b.tier !== 'Locked');
              return (
                <div className="bg-[#fdf6e9] border-2 border-[#eadbc5] p-4 rounded-2xl space-y-3">
                  <h2 className="font-black text-sm text-amber-800">
                    Astronaut Badges Earned ({earnedBadges.length})
                  </h2>
                  {earnedBadges.length === 0 ? (
                    <p className="text-xs text-[#7a5a40]">
                      No badges earned on this mission yet. Keep exploring to unlock badges!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {earnedBadges.map((b, idx) => {
                        const tierColor =
                          b.tier === 'Gold'
                            ? 'bg-amber-300 text-amber-950 border-amber-500'
                            : b.tier === 'Silver'
                            ? 'bg-slate-200 text-slate-800 border-slate-400'
                            : 'bg-orange-200 text-orange-950 border-orange-400';
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 bg-white border-amber-300 shadow-sm"
                          >
                            <span className="text-3xl shrink-0">{b.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-black text-[#4a3525] truncate">
                                  {b.category}: {b.title}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${tierColor}`}>
                                  {b.tier}
                                </span>
                              </div>
                              <div className="text-[#6b4c35] mt-0.5">{b.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="bg-[#fdf6e9] border-2 border-[#eadbc5] p-4 rounded-2xl space-y-3">
              <h2 className="font-black text-sm text-[#4a3525]">
                Real Mars Rover Photo Album ({dailyPhotoAlbum.length} Photos)
              </h2>
              {dailyPhotoAlbum.length === 0 ? (
                <p className="text-xs text-[#7a5a40]">The rover did not take any photos this time.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {dailyPhotoAlbum.map((entry, idx) => (
                    <div key={idx} className="bg-white rounded-xl overflow-hidden border border-[#dcc7a9] flex flex-col">
                      <img
                        src={entry.photo.imageUrl}
                        alt={entry.photo.title}
                        className="w-full h-28 object-contain bg-slate-900"
                      />
                      <div className="p-2 space-y-1 flex-1">
                        <div className="text-[10px] font-black text-amber-700">Day {entry.sol} Photo</div>
                        <div className="text-[10px] font-bold text-[#4a3525] line-clamp-1">{entry.photo.title}</div>
                        <div className="text-[10px] text-[#7a5a40] line-clamp-2">{entry.photo.nasaCaption}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onRestart}
              className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 font-black text-white text-base transition shadow-md"
            >
              Play Again!
            </button>
          </div>
        </div>
      );
    }

    // =========================================================================
