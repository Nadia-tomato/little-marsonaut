// Module 6E: Base Center, Telemetry & Rock/Photo Vaults
// [Module 9B: Base Center / Mission Control Scene Module]
    // =========================================================================
    function MissionControlModule({
      sol,
      weather,
      nightFactor = 0,
      samples = {},
      totalScore = 0,
      dailyPhotoAlbum = [],
      onBack,
    }) {
      const [activeModal, setActiveModal] = useState(null);
      const [selectedPhoto, setSelectedPhoto] = useState(null);

      const palette = getDayNightPalette(nightFactor);
      const radInfo = RADIATION_LABELS[weather?.radiationLevel || 1];
      const ownedRocks = SAMPLE_CATALOG.filter((item) => item.id !== 'NONE' && (samples[item.id] || 0) > 0);
      const coverPhotos = dailyPhotoAlbum.slice(-3);

      return (
        <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border-4 border-[#d9c2a3] shadow-xl bg-[#e8eef5]">
          <svg viewBox="0 0 1000 625" className="w-full h-full object-cover block">
            <defs>
              <clipPath id="controlWindowClip">
                <rect x="55" y="75" width="450" height="235" rx="22" />
              </clipPath>
              <linearGradient id="controlWinSky" x1="0" y1="0" x2="0" y2="1" className="smooth-sky-grad">
                <stop offset="0%" stopColor={palette.skyTop} />
                <stop offset="100%" stopColor={palette.skyBot} />
              </linearGradient>
            </defs>

            <rect width="1000" height="450" fill="#d8e3ef" />
            <polygon points="0,450 1000,450 1000,625 0,625" fill="#8f9eb2" />
            <polygon points="120,465 880,465 940,605 60,605" fill="none" stroke="#38bdf8" strokeWidth="5" opacity="0.35" />

            <g clipPath="url(#controlWindowClip)">
              <rect x="50" y="70" width="460" height="245" fill="url(#controlWinSky)" />
              {palette.starOpacity > 0.01 && (
                <g opacity={palette.starOpacity} fill="#fef9c3">
                  <circle cx="95" cy="105" r="2" />
                  <circle cx="180" cy="98" r="2.5" />
                  <circle cx="280" cy="112" r="1.8" />
                  <circle cx="390" cy="102" r="2.2" />
                  <circle cx="460" cy="118" r="1.8" />
                </g>
              )}
              <polygon
                points="50,205 120,165 210,190 310,155 410,195 510,170 510,320 50,320"
                fill={palette.mountainFill}
                className="smooth-sky-fill"
              />
              <rect x="50" y="215" width="460" height="105" fill={palette.groundTop} className="smooth-sky-fill" />
              <ellipse cx="230" cy="245" rx="36" ry="11" fill={palette.craterFill} opacity="0.65" className="smooth-sky-fill" />

              <g transform="translate(370, 140)">
                <line x1="40" y1="90" x2="40" y2="45" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="40" cy="35" rx="32" ry="18" fill="#f8fafc" stroke="#334155" strokeWidth="4" transform="rotate(-25 40 35)" />
                <line x1="40" y1="35" x2="60" y2="20" stroke="#ef4444" strokeWidth="3" />
                <circle cx="62" cy="19" r="4" fill="#ef4444" />
              </g>
            </g>

            <rect x="55" y="75" width="450" height="235" rx="22" fill="none" stroke="#5a4636" strokeWidth="8" />
            <rect x="61" y="81" width="438" height="223" rx="17" fill="none" stroke="#f5ede0" strokeWidth="3" />

            {/* Weather & Telemetry Wall Board */}
            <g transform="translate(535, 75)">
              <rect x="0" y="0" width="415" height="235" rx="20" fill="#0f172a" stroke="#5a4636" strokeWidth="7" />
              <rect x="10" y="10" width="395" height="215" rx="14" fill="#1e293b" />
              <circle cx="28" cy="27" r="5" fill="#22c55e" />
              <text x="40" y="31" fill="#38bdf8" fontSize="12" fontWeight="900" letterSpacing="1">
                📡 SIMULATED MARS CONDITIONS
              </text>
              <text x="40" y="43" fill="#94a3b8" fontSize="8.5" fontWeight="600">
                Mars conditions are simulated for gameplay. Space weather is inspired by NASA data.
              </text>

              <rect x="20" y="48" width="375" height="46" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <text x="35" y="77" fill="#ffffff" fontSize="17" fontWeight="900">
                {weather?.isDustStorm ? '🌪️ Dust Storm Active' : '☀️ Surface Conditions Clear'}
              </text>

              <g transform="translate(20, 104)">
                <rect x="0" y="0" width="180" height="58" rx="8" fill="#0f172a" />
                <text x="14" y="23" fill="#94a3b8" fontSize="10" fontWeight="800">TEMPERATURE</text>
                <text x="14" y="46" fill="#f8fafc" fontSize="15" fontWeight="900">
                  {weather?.tempMin ?? -75}°C / {weather?.tempMax ?? -15}°C
                </text>

                <rect x="195" y="0" width="180" height="58" rx="8" fill="#0f172a" />
                <text x="210" y="23" fill="#94a3b8" fontSize="10" fontWeight="800">SPACE RADIATION</text>
                <text x="210" y="46" fill="#facc15" fontSize="14" fontWeight="900">
                  {radInfo.text}
                </text>
              </g>

              <rect x="20" y="172" width="375" height="42" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="35" y="198" fill="#94a3b8" fontSize="11" fontWeight="bold">
                WIND: <tspan fill="#f8fafc" fontWeight="900">{weather?.windSpeedMs ?? 5.2} m/s</tspan>
              </text>
              <text x="215" y="198" fill="#94a3b8" fontSize="11" fontWeight="bold">
                PRESSURE: <tspan fill="#f8fafc" fontWeight="900">750 Pa</tspan>
              </text>
            </g>

            {/* Mineral / Rock Specimen Box */}
            <g transform="translate(65, 345)">
              <rect x="0" y="0" width="430" height="235" rx="20" fill="#fdf6e9" stroke="#5a4636" strokeWidth="6" />
              <rect x="15" y="14" width="400" height="36" rx="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
              <text x="215" y="38" textAnchor="middle" fill="#92400e" fontSize="15" fontWeight="900">
                MARS ROCKS
              </text>

              <rect x="15" y="58" width="400" height="110" rx="12" fill="#eff6ff" stroke="#cbd5e1" strokeWidth="2.5" />
              {ownedRocks.length === 0 ? (
                <text x="215" y="118" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="900">
                  Not yet collected!
                </text>
              ) : (
                <g>
                  {ownedRocks.map((r, i) => {
                    const slotWidth = 380 / ownedRocks.length;
                    const cx = 25 + slotWidth * i + slotWidth / 2;
                    const cy = 96;
                    return (
                      <g key={r.id} transform={`translate(${cx}, ${cy})`}>
                        {r.id === 'BASALT' && (
                          <g transform="translate(-16, -24) scale(0.55)">
                            <polygon points="14,48 10,28 24,14 44,16 54,32 48,50 26,53" fill="#475569" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
                            <polygon points="24,14 44,16 38,28 20,25" fill="#64748b" />
                            <circle cx="24" cy="36" r="3" fill="#1e293b" />
                            <circle cx="38" cy="34" r="3.5" fill="#1e293b" />
                          </g>
                        )}
                        {r.id === 'IRON_OXIDE' && (
                          <g transform="translate(-16, -24) scale(0.55)">
                            <path d="M14,44 C8,30 18,14 34,14 C48,14 56,26 52,42 C48,52 20,54 14,44 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="3" />
                            <path d="M20,22 C28,17 40,18 45,25" fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="25" cy="32" r="3.5" fill="#7c2d12" />
                            <circle cx="38" cy="30" r="3" fill="#9a3412" />
                          </g>
                        )}
                        {r.id === 'HYDRATED' && (
                          <g transform="translate(-16, -24) scale(0.55)">
                            <polygon points="12,48 16,24 32,14 48,22 52,46 32,52" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" strokeLinejoin="round" />
                            <polygon points="26,38 32,18 38,38 32,44" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                          </g>
                        )}
                        {r.id === 'SPECIAL_GEO' && (
                          <g transform="translate(-16, -24) scale(0.55)">
                            <rect x="13" y="18" width="38" height="32" rx="10" fill="#d97706" stroke="#78350f" strokeWidth="3" />
                            <line x1="15" y1="26" x2="49" y2="26" stroke="#fef3c7" strokeWidth="3" />
                            <line x1="14" y1="34" x2="50" y2="34" stroke="#92400e" strokeWidth="3.5" />
                          </g>
                        )}
                        {r.id === 'ANCIENT_BIOSIGNATURE' && (
                          <g transform="translate(-16, -24) scale(0.55)">
                            <polygon points="32,10 50,22 46,48 18,48 14,22" fill="#facc15" stroke="#a16207" strokeWidth="3" strokeLinejoin="round" />
                          </g>
                        )}

                        <rect x="-16" y="12" width="32" height="18" rx="9" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
                        <text x="0" y="25" textAnchor="middle" fill="#451a03" fontSize="11" fontWeight="900">
                          ×{samples[r.id]}
                        </text>
                        <text x="0" y="44" textAnchor="middle" fill="#5a3e28" fontSize="10" fontWeight="900">
                          {r.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              <rect x="15" y="178" width="400" height="42" rx="12" fill="#f59e0b" />
              <text x="215" y="204" textAnchor="middle" fill="#451a03" fontSize="14" fontWeight="900">
                🔍 Check
              </text>
            </g>

            {/* Mission Photo Dossier / Folder */}
            <g transform="translate(535, 345)">
              <rect x="0" y="0" width="415" height="235" rx="20" fill="#fdf6e9" stroke="#5a4636" strokeWidth="6" />
              <rect x="15" y="14" width="385" height="36" rx="10" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
              <text x="207" y="38" textAnchor="middle" fill="#0369a1" fontSize="15" fontWeight="900">
                MARS PHOTOS
              </text>

              <rect x="15" y="58" width="385" height="110" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
              {coverPhotos.length === 0 ? (
                <text x="207" y="118" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="900">
                  Not yet collected!
                </text>
              ) : (
                <g transform="translate(25, 68)">
                  {coverPhotos.map((item, idx) => {
                    const count = coverPhotos.length;
                    const slotWidth = count === 1 ? 180 : count === 2 ? 160 : 112;
                    const spacing = count === 1 ? 0 : count === 2 ? 175 : 125;
                    const sx = count === 1 ? 92 : idx * spacing;
                    return (
                      <g key={idx}>
                        <rect x={sx} y="0" width={slotWidth} height="90" rx="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                        <image href={item.photo.imageUrl} x={sx + 4} y="4" width={slotWidth - 8} height="64" preserveAspectRatio="xMidYMid meet" rx="4" />
                        <text x={sx + slotWidth / 2} y="82" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="900">
                          Day {item.sol}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              <rect x="15" y="178" width="385" height="42" rx="12" fill="#0284c7" />
              <text x="207" y="204" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">
                📷 Check
              </text>
            </g>
          </svg>

          {/* Top Bar Navigation */}
          <div className="top-3 left-3 right-3 absolute flex justify-between items-center z-20 gap-2">
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-full bg-[#fdf6e9]/95 hover:bg-amber-200 border-2 border-[#d9c2a3] font-black text-xs text-[#4a3525] shadow-md flex items-center gap-1 active:scale-95 transition"
            >
              <span className="text-base leading-none">‹</span>
              <span>Back</span>
            </button>
            <div className="bg-white/95 border-2 border-[#d9c2a3] px-3.5 py-1 rounded-full text-xs font-black text-[#5a3e28] shadow">
              📡 Base Center • Day {sol}
            </div>
          </div>

          <button
            onClick={() => setActiveModal('DISCOVERIES')}
            style={{ left: '6.5%', top: '55%', width: '43%', height: '38%' }}
            className="absolute rounded-2xl border-2 border-transparent hover:border-amber-400 hover:bg-amber-400/10 cursor-pointer transition active:scale-95"
            title="Open Rock Collection Vault"
          />

          <button
            onClick={() => setActiveModal('PHOTOS')}
            style={{ left: '53.5%', top: '55%', width: '41.5%', height: '38%' }}
            className="absolute rounded-2xl border-2 border-transparent hover:border-sky-400 hover:bg-sky-400/10 cursor-pointer transition active:scale-95"
            title="Open Photo Dossier Archive"
          />

          {/* Rock Specimen Vault Modal */}
          {activeModal === 'DISCOVERIES' && (
            <div
              className="fixed inset-0 z-50 bg-[#2d1e12]/75 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setActiveModal(null)}
            >
              <div
                className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b-2 border-[#eadbc5] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🪨</span>
                    <div>
                      <h3 className="font-black text-xl text-[#4a3525]">Mars Rocks</h3>
                      <p className="text-xs text-amber-800 font-extrabold">{totalScore} Total Science Points</p>
                    </div>
                  </div>

                </div>

                {ownedRocks.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <span className="text-4xl">🏜️</span>
                    <p className="text-base font-black text-[#7a5a40]">Not yet collected!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {ownedRocks.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white border-2 border-[#e6d5bc] p-3 rounded-2xl flex items-center gap-3 shadow-sm"
                      >
                        <RockSpecimenIcon rock={r} size={50} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-sm text-[#4a3525]">{r.name}</h4>
                          </div>
                          <p className="text-xs text-[#6b4c35] leading-snug mt-0.5">{r.scientificNote}</p>
                        </div>
                        <span className="font-black text-amber-700 text-base shrink-0">× {samples[r.id]}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Photo Dossier Modal */}
          {activeModal === 'PHOTOS' && (
            <div
              className="fixed inset-0 z-50 bg-[#2d1e12]/75 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setActiveModal(null)}
            >
              <div
                className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b-2 border-[#eadbc5] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">📷</span>
                    <div>
                      <h3 className="font-black text-xl text-[#4a3525]">Mars Photos</h3>
                      <p className="text-xs text-sky-800 font-extrabold">{dailyPhotoAlbum.length} Photos Captured</p>
                    </div>
                  </div>

                </div>

                {dailyPhotoAlbum.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <span className="text-4xl">📷</span>
                    <p className="text-base font-black text-[#7a5a40]">Not yet collected!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                    {dailyPhotoAlbum.map((entry, index) => (
                      <figure
                        key={`${entry.photo.id}-${index}`}
                        onClick={() => setSelectedPhoto(entry)}
                        className="rounded-xl overflow-hidden border-2 border-sky-200 bg-white cursor-pointer hover:shadow-lg transition"
                      >
                        <img
                          src={entry.photo.imageUrl}
                          alt={entry.photo.title}
                          className="w-full h-28 object-contain bg-slate-900"
                        />
                        <figcaption className="p-2 text-[10px] text-[#4a3525] leading-tight">
                          <b>Day {entry.sol}</b> · {entry.photo.title}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-sm shadow"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Photo Zoom Modal */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-[60] bg-[#2d1e12]/85 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <div
                className="max-w-2xl w-full bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl p-5 shadow-2xl space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.photo.imageUrl}
                  alt={selectedPhoto.photo.title}
                  className="w-full max-h-[60vh] object-contain rounded-2xl bg-slate-900"
                />
                <h3 className="font-black text-lg text-[#4a3525]">
                  Day {selectedPhoto.sol} · {selectedPhoto.photo.title}
                </h3>
                <p className="text-xs text-[#5a4636] leading-relaxed">{selectedPhoto.photo.nasaCaption}</p>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm"
                >
                  Close Photo
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    function SpecialDiscoveryModal({ record, onReturnToEarth }) {
      return (
        <div className="fixed inset-0 z-[70] bg-[#2d1e12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <ConfettiRibbonCelebration />
          <div className="relative max-w-sm w-full rounded-3xl border-4 border-amber-400 bg-[#fff9ef] p-6 text-center shadow-2xl space-y-3 z-[80]">
            <div className="text-5xl animate-bounce">🎉</div>
            <div className="space-y-0.5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-sm tracking-wide">
                🏆 MAJOR SCIENTIFIC DISCOVERY!
              </span>
              <p className="text-[11px] font-bold text-amber-900 mt-1">
                Congratulations! You found a historic Mars clue!
              </p>
            </div>
            <h2 className="text-2xl font-black text-[#4a3525]">
              {record?.sample?.name || 'Mystery Life-Clue Stone'}
            </h2>
            <p className="text-sm font-bold text-[#5a3e28] bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200">
              {record?.sample?.chosenExplanation || 'Potential biosignature sample collected by Curiosity Jr.!'}
            </p>
            <p className="text-[11px] text-amber-800 font-semibold">
              Game story inspired by NASA rovers exploring ancient Jezero and Gale craters.
            </p>
            <div className="pt-2">
              <button
                onClick={onReturnToEarth}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-sm border-2 border-amber-600 shadow-lg active:scale-95 transition cursor-pointer"
              >
                🚀 Return Findings to Earth (Win!)
              </button>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================================
