// Module 6D: Rover Garage & Curiosity Jr. Dispatch
// [Module 9: Rover Garage Interactive Scene Module]
    // - Shows dedicated Dust Storm Alert banner when a dust storm is happening!
    // - Trip durations: 10 ⚡ = 70s, 20 ⚡ = 100s, 30 ⚡ = 130s
    // =========================================================================
    function RoverRoomModule({
      weather,
      nightFactor,
      power,
      roverStatus,
      damageSolLeft,
      pendingExpedition,
      roverTripProgress,
      roverSecondsLeft,
      latestRoverResult,
      roverResultUnread,
      samples,
      seenTopics,
      onOpenTopic,
      onBack,
      onViewLatestResult,
      onRequestDispatchRover,
    }) {
      const [selectedPowerCost, setSelectedPowerCost] = useState(20); // 0, 10, 20, 30
      const [showReportModal, setShowReportModal] = useState(false);

      const palette = getDayNightPalette(nightFactor);
      const isDustStorm = Boolean(weather?.isDustStorm);
      const isHighRadiation = (weather?.radiationLevel || 1) >= 4;
      const isRoverOut = roverStatus === 'OUT_ON_MISSION';

      const barsCost = Math.max(1, Math.min(3, Math.round(selectedPowerCost / 10)));

      const handleConfirmReport = () => {
        setShowReportModal(false);
        if (onViewLatestResult) onViewLatestResult();
      };

      return (
        <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border-4 border-[#d9c2a3] shadow-xl bg-[#e3e8f0]">
          <svg viewBox="0 0 1000 625" className="w-full h-full object-cover block">
            <defs>
              <clipPath id="roverWindowClip">
                <rect x="254" y="79" width="492" height="222" rx="20" />
              </clipPath>
              <linearGradient id="roverWinSky" x1="0" y1="0" x2="0" y2="1" className="smooth-sky-grad">
                <stop offset="0%" stopColor={isDustStorm ? '#b45309' : palette.skyTop} />
                <stop offset="100%" stopColor={isDustStorm ? '#d97706' : palette.skyBot} />
              </linearGradient>
            </defs>

            <rect width="1000" height="465" fill="#d8e1ec" />
            <polygon points="0,465 1000,465 1000,625 0,625" fill="#a8b4c4" />
            <polygon points="120,480 880,480 940,610 60,610" fill="none" stroke="#facc15" strokeWidth="5" opacity="0.4" />

            {/* Window Observation Deck */}
            <g clipPath="url(#roverWindowClip)">
              <rect x="250" y="75" width="500" height="230" fill="url(#roverWinSky)" />
              {palette.starOpacity > 0.01 && !isDustStorm && (
                <g opacity={palette.starOpacity} fill="#fef9c3">
                  <circle cx="310" cy="120" r="2" />
                  <circle cx="420" cy="110" r="2.5" />
                  <circle cx="560" cy="122" r="2.5" />
                  <circle cx="680" cy="115" r="2" />
                </g>
              )}
              <polygon
                points="250,205 320,155 410,195 510,140 620,185 750,205 750,305 250,305"
                fill={palette.mountainFill}
                className="smooth-sky-fill"
              />
              <rect x="250" y="215" width="500" height="90" fill={palette.groundTop} className="smooth-sky-fill" />
              <ellipse cx="640" cy="250" rx="30" ry="8" fill={palette.craterFill} opacity="0.7" className="smooth-sky-fill" />

              {isDustStorm && (
                <rect x="250" y="75" width="500" height="230" fill="#ea580c" opacity="0.32" />
              )}

              {isRoverOut && (
                <g className="animate-rover-cruise">
                  <path d="M-80,58 Q-50,54 -20,58" fill="none" stroke="#5c2818" strokeWidth="4" strokeDasharray="6 4" />
                  <rect x="12" y="0" width="7" height="28" fill="#fff" stroke="#4a3525" strokeWidth="2.5" />
                  <rect x="1" y="-8" width="28" height="14" rx="5" fill="#fff" stroke="#4a3525" strokeWidth="2.5" />
                  <circle cx="20" cy="-1" r="4" fill="#38bdf8" />
                  <circle cx="20" cy="-8" r="3" fill="#ef4444" className="animate-ping" />
                  <circle cx="20" cy="-8" r="2" fill="#ef4444" />
                  <rect x="-38" y="24" width="76" height="28" rx="9" fill="#fffaf0" stroke="#4a3525" strokeWidth="3" />
                  <rect x="-26" y="32" width="50" height="10" rx="4" fill="#fb923c" />
                  {[-26, 0, 26].map((wx, i) => (
                    <g key={i} transform={`translate(${wx}, 56)`}>
                      <circle r="11" fill="#334155" stroke="#0f172a" strokeWidth="3" />
                      <circle r="4" fill="#cbd5e1" />
                    </g>
                  ))}
                </g>
              )}
            </g>

            <rect x="250" y="75" width="500" height="230" rx="24" fill="none" stroke="#5a4636" strokeWidth="8" />
            <rect x="256" y="81" width="488" height="218" rx="18" fill="none" stroke="#f5ede0" strokeWidth="3" />

            {/* Rover Garage Maintenance Pad */}
            <g transform="translate(300, 240)">
              <ellipse cx="165" cy="235" rx="150" ry="32" fill="#facc15" stroke="#a16207" strokeWidth="5" />
              <ellipse cx="165" cy="235" rx="115" ry="20" fill="#94a3b8" />

              {isRoverOut ? (
                <g>
                  <line x1="125" y1="210" x2="125" y2="255" stroke="#475569" strokeWidth="8" strokeDasharray="6 5" opacity="0.6" strokeLinecap="round" />
                  <line x1="205" y1="210" x2="205" y2="255" stroke="#475569" strokeWidth="8" strokeDasharray="6 5" opacity="0.6" strokeLinecap="round" />
                  <rect x="40" y="142" width="250" height="48" rx="18" fill="#0284c7" stroke="#fff" strokeWidth="2.5" />
                  <text x="165" y="163" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">
                    🛸 {OUR_ROVER_NAME} Exploring ({roverSecondsLeft}s left)
                  </text>
                  <rect x="75" y="173" width="180" height="8" rx="4" fill="#0369a1" />
                  <rect
                    x="75"
                    y="173"
                    width={Math.max(8, Math.round(180 * (roverTripProgress || 0)))}
                    height="8"
                    rx="4"
                    fill="#fde047"
                  />
                </g>
              ) : (
                <g
                  transform="translate(47.5, 57)"
                  onClick={() => setShowReportModal(true)}
                  style={{ cursor: 'pointer' }}
                  title={`Click Rover "${OUR_ROVER_NAME}" to inspect findings & status`}
                >
                  <rect x="175" y="0" width="14" height="75" fill="#fff" stroke="#5a4636" strokeWidth="4" />
                  <rect x="155" y="-12" width="54" height="30" rx="8" fill="#fff" stroke="#5a4636" strokeWidth="4" />
                  <circle cx="192" cy="3" r="8" fill="#38bdf8" />
                  <rect x="30" y="65" width="175" height="75" rx="22" fill="#fffaf0" stroke="#5a4636" strokeWidth="5" />
                  <rect x="50" y="82" width="135" height="25" rx="8" fill="#fb923c" />
                  <text x="118" y="99" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="900">
                    CURIOSITY JR.
                  </text>
                  {[55, 118, 180].map((wx, i) => (
                    <g key={i} transform={`translate(${wx}, 152)`}>
                      <circle r="26" fill="#475569" stroke="#1e293b" strokeWidth="5" />
                      <circle r="10" fill="#cbd5e1" />
                    </g>
                  ))}
                  {roverStatus !== 'READY' && (
                    <text x="118" y="55" textAnchor="middle" fill="#dc2626" fontSize="19" fontWeight="900">
                      🛠️ Fixing {OUR_ROVER_NAME}...
                    </text>
                  )}
                </g>
              )}
            </g>
          </svg>

          {/* Top Bar Navigation */}
          <div className="top-3 left-3 right-3 absolute flex justify-between items-center z-20">
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-full bg-[#fdf6e9]/95 hover:bg-sky-200 border-2 border-[#d9c2a3] font-black text-xs text-[#4a3525] shadow-md flex items-center gap-1 active:scale-95 transition"
            >
              <span className="text-base leading-none">‹</span>
              <span>Rover Garage | Back</span>
            </button>
            <div className="bg-white/95 border-2 border-[#d9c2a3] px-3 py-1 rounded-full text-xs font-black text-[#5a3e28] shadow">
              🛸 Rover &ldquo;{OUR_ROVER_NAME}&rdquo;
            </div>
          </div>

          {/* Dedicated Dust Storm Notice on the Rover Dispatch Page */}
          {isDustStorm && (
            <div className="top-12 left-6 right-6 absolute bg-amber-100/95 border-2 border-amber-500 text-amber-950 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 z-20 animate-storm-banner">
              <span className="text-base">🌪️</span>
              <span>
                DUST STORM ALERT: Swirling sand outside! Sending {OUR_ROVER_NAME} out during a dust storm risks wheel damage!
              </span>
            </div>
          )}

          {/* Radiation Warning if not dust storm */}
          {!isDustStorm && isHighRadiation && roverStatus === 'READY' && (
            <div className="top-12 left-6 right-6 absolute bg-red-100/95 border-2 border-red-400 text-red-900 px-3 py-1 rounded-full text-xs font-extrabold shadow text-center z-20 truncate">
              ⚠️ Warning: Strong solar radiation outside might damage {OUR_ROVER_NAME}!
            </div>
          )}

          {/* Big Question Mark (?) for About Curiosity & Our Rover */}
          <div style={{ left: '77%', top: '42%' }} className="absolute z-30 flex flex-col items-center gap-1">
            <QuestionMarkButton
              topicKey="CURIOSITY_ROVER"
              seenTopics={seenTopics}
              onOpenTopic={onOpenTopic}
            />
            <span className="px-2 py-0.5 rounded-full bg-white/95 border border-[#d9c2a3] text-[10px] font-black text-[#4a3525] shadow">
              About Curiosity
            </span>
          </div>

          {/* Clickable Rover Area */}
          {!isRoverOut && (
            <div
              onClick={() => setShowReportModal(true)}
              style={{ left: '26%', top: '35%', width: '48%', height: '42%' }}
              className="absolute rounded-3xl transition flex flex-col items-center justify-start pt-2 cursor-pointer hover:bg-amber-300/15 z-20"
              title={`Click Rover "${OUR_ROVER_NAME}" to inspect mission findings & status`}
            >
              {roverResultUnread && (
                <div className="flex flex-col items-center animate-alert-pulse">
                  <span className="flex h-11 w-11 items-center justify-center relative">
                    <span className="animate-ping absolute inline-flex h-11 w-11 rounded-full bg-red-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-10 w-10 bg-red-600 border-2 border-white shadow-xl text-white font-black text-2xl leading-none items-center justify-center">
                      !
                    </span>
                  </span>
                  <span className="mt-1 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow border border-white">
                    Tap {OUR_ROVER_NAME} for Findings!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Power Dispatch Slider */}
          {!isRoverOut && (
            <div
              style={{ left: '16%', bottom: '2%', width: '68%' }}
              className="absolute z-20 bg-white/95 border-2 border-[#d9c2a3] rounded-2xl p-2.5 shadow-xl flex flex-col gap-1.5"
            >
              {isDustStorm && (
                <div className="bg-amber-100 border border-amber-400 text-amber-950 rounded-xl px-2.5 py-1 text-[11px] font-black flex items-center justify-center gap-1.5">
                  <span>🌪️</span>
                  <span>Dust Storm Active Outside — High chance of sand getting stuck in {OUR_ROVER_NAME}&apos;s wheels!</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 w-full space-y-1">
                  <div className="flex justify-between items-center text-xs font-black text-sky-900">
                    <span className="tabular-nums">{OUR_ROVER_NAME}&apos;s Battery Power: {selectedPowerCost} ⚡</span>
                    <span className="text-[11px] text-amber-700 text-right truncate">
                      {selectedPowerCost === 0
                        ? 'Standby'
                        : selectedPowerCost === 10
                        ? 'Short Walk'
                        : selectedPowerCost === 20
                        ? 'Crater Trip'
                        : 'Far Riverbed Dig'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="10"
                    value={selectedPowerCost}
                    onChange={(e) => setSelectedPowerCost(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                    aria-label="Rover power slider"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-500 px-1">
                    <span>0 ⚡</span>
                    <span>10 ⚡</span>
                    <span>20 ⚡</span>
                    <span>30 ⚡</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedPowerCost > 0) {
                      onRequestDispatchRover(barsCost);
                    }
                  }}
                  disabled={
                    selectedPowerCost === 0 ||
                    Boolean(pendingExpedition) ||
                    roverStatus !== 'READY' ||
                    power < selectedPowerCost
                  }
                  className="w-full sm:w-52 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-black text-xs shadow-md active:scale-95 transition shrink-0 text-center"
                >
                  {selectedPowerCost === 0
                    ? 'Select Power'
                    : roverStatus !== 'READY'
                    ? `Fixing (${damageSolLeft}d)`
                    : power < selectedPowerCost
                    ? `Need ${selectedPowerCost} ⚡`
                    : `🚀 Send ${OUR_ROVER_NAME} (-${selectedPowerCost} ⚡)`}
                </button>
              </div>
            </div>
          )}

          {/* Rover Mission Findings Modal */}
          {showReportModal && (
            <div
              className="fixed inset-0 z-50 bg-[#2d1e12]/75 flex items-center justify-center p-4 overflow-y-auto"
              onClick={handleConfirmReport}
            >
              <div
                className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-sm w-full p-4 md:p-5 shadow-2xl space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b-2 border-[#eadbc5] pb-2">
                  <span className="text-2xl">🛸</span>
                  <h3 className="text-lg font-black text-[#4a3525]">
                    {latestRoverResult
                      ? `Rover "${OUR_ROVER_NAME}" Findings!`
                      : `Rover "${OUR_ROVER_NAME}" in Garage`}
                  </h3>
                </div>

                {latestRoverResult ? (
                  <>
                    {latestRoverResult.damagedSols > 0 ? (
                      <div className="bg-red-100 border-2 border-red-300 p-3 rounded-2xl text-xs text-red-900 font-bold">
                        ⚠️ Oh no! {OUR_ROVER_NAME} got hurt by {latestRoverResult.damageReason} and needs {latestRoverResult.damagedSols} day(s) of repair in the garage!
                      </div>
                    ) : latestRoverResult.sample && latestRoverResult.sample.id !== 'NONE' ? (
                      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
                        <RockSpecimenIcon rock={latestRoverResult.sample} size={46} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-1">
                            <h4 className="font-black text-xs sm:text-sm text-[#4a3525] truncate">{latestRoverResult.sample.name}</h4>
                          </div>
                          <p className="text-[11px] text-[#4a3525] font-semibold leading-snug mt-0.5">
                            {latestRoverResult.sample.chosenExplanation}
                          </p>
                          <p className="text-[10px] text-sky-800 mt-0.5">{latestRoverResult.sample.scientificNote}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-[#e6d5bc] rounded-xl p-2.5 text-xs text-[#7a5a40] text-center">
                        {latestRoverResult.sample?.chosenExplanation || 'No solid rock found on this trip.'}
                      </div>
                    )}

                    {latestRoverResult.photo && (
                      <div className="bg-white border-2 border-sky-200 rounded-2xl p-2.5 space-y-1 shadow-sm">
                        <img
                          src={latestRoverResult.photo.imageUrl}
                          alt={latestRoverResult.photo.title}
                          className="w-full max-h-48 object-contain rounded-xl bg-slate-900"
                        />
                        <div className="text-[10px] font-black text-amber-800">
                          📸 Real NASA Curiosity Photo: {latestRoverResult.photo.title}
                        </div>
                        <p className="text-[11px] text-[#5a4636] font-bold line-clamp-2">{latestRoverResult.photo.nasaCaption}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white border border-[#e6d5bc] rounded-2xl p-4 text-xs text-[#5a4636] text-center space-y-2">
                    <p className="font-black text-sm text-sky-900">
                      Our rover &ldquo;{OUR_ROVER_NAME}&rdquo; is parked in the garage!
                    </p>
                    <p>
                      Named just like NASA&apos;s real <b>Curiosity</b> rover, {OUR_ROVER_NAME} loves exploring Mars! Slide the battery power below and click &ldquo;Send {OUR_ROVER_NAME}&rdquo; to hunt for Mars rocks!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleConfirmReport}
                  className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow active:scale-95 transition"
                >
                  {latestRoverResult ? 'Collect Findings ✓' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // =========================================================================
