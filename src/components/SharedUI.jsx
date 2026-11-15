// Module 4A: Reusable UI Badges, Confirm Modal & Rock Icons
function QuestionMarkButton({ topicKey, seenTopics, onOpenTopic, className = '' }) {
      const isSeen = seenTopics.has(topicKey);
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenTopic(topicKey);
          }}
          title="Tap to learn the science!"
          className={`rounded-full font-black border-2 border-white shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
            isSeen
              ? 'w-8 h-8 text-sm bg-amber-300/95 hover:bg-amber-200 text-amber-950 scale-95'
              : 'w-14 h-14 text-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 animate-bounce ring-4 ring-amber-300/60'
          } ${className}`}
        >
          ?
        </button>
      );
    }

    
function TopResourcePill({ label, value, barColor, icon }) {
      const isLow = value <= 25;
      return (
        <div className="bg-white/95 border-2 border-[#e6d5bc] rounded-2xl px-3 py-1.5 shadow-sm flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0 leading-none">{icon}</span>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-1 text-xs font-extrabold text-[#5a3e28] leading-tight mb-1">
              <span className="truncate">{label}</span>
              <span className={`shrink-0 tabular-nums ${isLow ? 'text-red-600 animate-pulse' : ''}`}>{value}</span>
            </div>
            <div className="w-full h-2.5 bg-[#efe3d0] rounded-full overflow-hidden border border-[#dcc7a9]">
              <div className={`h-full transition-all duration-300 rounded-full ${barColor}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        </div>
      );
    }

    function ActionConfirmModal({ pendingAction, onConfirm, onCancel }) {
      if (!pendingAction) return null;

      return (
        <div className="fixed inset-0 bg-[#2d1e12]/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b-2 border-[#eadbc5] pb-2">
              <span className="text-3xl">{pendingAction.icon}</span>
              <h3 className="text-lg font-black text-[#4a3525]">{pendingAction.title}</h3>
            </div>

            <div className="space-y-2 text-sm">
              {pendingAction.costText && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="font-bold text-red-800 shrink-0">Uses</span>
                  <span className="font-black text-red-700 text-right">{pendingAction.costText}</span>
                </div>
              )}
              {pendingAction.gainText && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="font-bold text-emerald-800 shrink-0">Effect</span>
                  <span className="font-black text-emerald-700 text-right">{pendingAction.gainText}</span>
                </div>
              )}
              {pendingAction.note && (
                <p className="text-xs text-[#5a3e28] bg-amber-50 p-3 rounded-xl border border-amber-200 font-semibold leading-relaxed">
                  {pendingAction.note}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={onCancel}
                className="py-2.5 rounded-2xl bg-[#eadbc5] hover:bg-[#dec9ab] text-[#4a3525] font-black text-sm transition"
              >
                No, Cancel
              </button>
              <button
                onClick={onConfirm}
                className="py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-sm shadow-md transition"
              >
                Yes, Do It!
              </button>
            </div>
          </div>
        </div>
      );
    }

    function RockSpecimenIcon({ rock, size = 54 }) {
      const text = `${rock?.id || ''} ${rock?.name || ''} ${rock?.scientificNote || ''}`;

      if (text.includes('BASALT') || text.includes('Lava') || text.includes('lava')) {
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
            <polygon points="14,48 10,28 24,14 44,16 54,32 48,50 26,53" fill="#475569" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="24,14 44,16 38,28 20,25" fill="#64748b" />
            <circle cx="24" cy="36" r="3" fill="#1e293b" />
            <circle cx="38" cy="34" r="3.5" fill="#1e293b" />
            <circle cx="31" cy="43" r="2.5" fill="#1e293b" />
            <circle cx="43" cy="43" r="2" fill="#1e293b" />
          </svg>
        );
      }

      if (text.includes('IRON_OXIDE') || text.includes('Rusty') || text.includes('Iron')) {
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
            <path d="M14,44 C8,30 18,14 34,14 C48,14 56,26 52,42 C48,52 20,54 14,44 Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="3" />
            <path d="M20,22 C28,17 40,18 45,25" fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
            <circle cx="25" cy="32" r="3.5" fill="#7c2d12" />
            <circle cx="38" cy="30" r="3" fill="#9a3412" />
            <circle cx="32" cy="41" r="4" fill="#7c2d12" />
            <circle cx="43" cy="39" r="2.5" fill="#fed7aa" />
          </svg>
        );
      }

      if (text.includes('HYDRATED') || text.includes('Water')) {
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
            <polygon points="12,48 16,24 32,14 48,22 52,46 32,52" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="26,38 32,18 38,38 32,44" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <polygon points="18,42 22,28 27,42" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.5" />
            <polygon points="38,42 43,27 47,42" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="32" cy="11" r="2.5" fill="#38bdf8" />
          </svg>
        );
      }

      if (text.includes('SPECIAL_GEO') || text.includes('Layer') || text.includes('Magnet')) {
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
            <rect x="13" y="18" width="38" height="32" rx="10" fill="#d97706" stroke="#78350f" strokeWidth="3" />
            <line x1="15" y1="26" x2="49" y2="26" stroke="#fef3c7" strokeWidth="3" />
            <line x1="14" y1="34" x2="50" y2="34" stroke="#92400e" strokeWidth="3.5" />
            <line x1="15" y1="42" x2="49" y2="42" stroke="#fde68a" strokeWidth="3" />
            <path d="M20,13 C26,7 38,7 44,13" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
          </svg>
        );
      }

      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
          <polygon points="32,10 50,22 46,48 18,48 14,22" fill="#facc15" stroke="#a16207" strokeWidth="3" strokeLinejoin="round" />
          <path d="M32,33 m0,-9 a9,9 0 1,1 -6,15 a6,6 0 1,1 4,-10 a3,3 0 1,1 -2,5" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="14" r="3" fill="#fef08a" />
          <circle cx="15" cy="15" r="2.5" fill="#fef08a" />
        </svg>
      );
    }

    function ConfettiRibbonCelebration() {
      const pieces = [
        { left: '3%', delay: '0s', duration: '3.0s', color: '#f59e0b', width: '9px', height: '32px', rotate: '25deg' },
        { left: '8%', delay: '0.4s', duration: '3.6s', color: '#ef4444', width: '12px', height: '14px', rotate: '-45deg' },
        { left: '14%', delay: '0.9s', duration: '3.2s', color: '#38bdf8', width: '8px', height: '36px', rotate: '15deg' },
        { left: '19%', delay: '0.1s', duration: '4.0s', color: '#10b981', width: '14px', height: '14px', rotate: '60deg' },
        { left: '25%', delay: '1.2s', duration: '3.1s', color: '#ec4899', width: '9px', height: '28px', rotate: '-30deg' },
        { left: '31%', delay: '0.3s', duration: '3.5s', color: '#facc15', width: '16px', height: '16px', rotate: '40deg' },
        { left: '37%', delay: '1.5s', duration: '3.3s', color: '#8b5cf6', width: '8px', height: '34px', rotate: '-15deg' },
        { left: '43%', delay: '0.2s', duration: '4.1s', color: '#fb923c', width: '10px', height: '26px', rotate: '50deg' },
        { left: '50%', delay: '0.7s', duration: '3.4s', color: '#ef4444', width: '13px', height: '13px', rotate: '-55deg' },
        { left: '56%', delay: '1.1s', duration: '3.8s', color: '#06b6d4', width: '8px', height: '38px', rotate: '35deg' },
        { left: '62%', delay: '0.3s', duration: '3.2s', color: '#f59e0b', width: '11px', height: '22px', rotate: '-20deg' },
        { left: '69%', delay: '0.8s', duration: '3.9s', color: '#10b981', width: '8px', height: '30px', rotate: '45deg' },
        { left: '75%', delay: '0.5s', duration: '3.4s', color: '#ec4899', width: '13px', height: '13px', rotate: '-40deg' },
        { left: '81%', delay: '1.3s', duration: '4.0s', color: '#3b82f6', width: '9px', height: '34px', rotate: '25deg' },
        { left: '87%', delay: '0.6s', duration: '3.6s', color: '#facc15', width: '10px', height: '24px', rotate: '-35deg' },
        { left: '93%', delay: '1.0s', duration: '3.3s', color: '#8b5cf6', width: '14px', height: '14px', rotate: '70deg' },
        { left: '11%', delay: '1.8s', duration: '3.5s', color: '#fb923c', width: '9px', height: '34px', rotate: '10deg' },
        { left: '23%', delay: '2.1s', duration: '3.8s', color: '#ef4444', width: '12px', height: '16px', rotate: '-50deg' },
        { left: '46%', delay: '1.9s', duration: '3.4s', color: '#10b981', width: '8px', height: '28px', rotate: '30deg' },
        { left: '66%', delay: '2.3s', duration: '4.0s', color: '#f59e0b', width: '10px', height: '30px', rotate: '-25deg' },
        { left: '85%', delay: '2.0s', duration: '3.6s', color: '#38bdf8', width: '13px', height: '13px', rotate: '45deg' },
        { left: '96%', delay: '2.4s', duration: '3.5s', color: '#ec4899', width: '9px', height: '28px', rotate: '-20deg' },
      ];

      const sparkles = [
        { left: '10%', top: '15%', delay: '0.1s', size: '26px', icon: '✨' },
        { left: '82%', top: '18%', delay: '0.5s', size: '30px', icon: '⭐' },
        { left: '20%', top: '45%', delay: '0.8s', size: '28px', icon: '🌟' },
        { left: '78%', top: '50%', delay: '0.3s', size: '32px', icon: '✨' },
        { left: '14%', top: '75%', delay: '1.1s', size: '24px', icon: '🎉' },
        { left: '86%', top: '78%', delay: '0.7s', size: '28px', icon: '🌟' },
      ];

      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 99999,
          }}
        >
          <style>{`
            @keyframes confettiFallCustom {
              0% {
                transform: translateY(-50px) rotate(0deg) rotateX(0deg) translateX(0px);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              50% {
                transform: translateY(50vh) rotate(220deg) rotateX(360deg) translateX(35px);
              }
              90% {
                opacity: 0.95;
              }
              100% {
                transform: translateY(105vh) rotate(440deg) rotateX(720deg) translateX(-25px);
                opacity: 0;
              }
            }
            @keyframes sparkleShimmer {
              0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.2; }
              50% { transform: scale(1.3) rotate(20deg); opacity: 1; }
            }
            .confetti-custom-piece {
              animation: confettiFallCustom 3.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
              will-change: transform, opacity;
            }
            .sparkle-custom-piece {
              animation: sparkleShimmer 1.8s ease-in-out infinite;
              will-change: transform, opacity;
            }
          `}</style>

          {pieces.map((p, idx) => (
            <div
              key={`ribbon-${idx}`}
              className="confetti-custom-piece"
              style={{
                position: 'absolute',
                left: p.left,
                top: '-50px',
                width: p.width,
                height: p.height,
                backgroundColor: p.color,
                borderRadius: p.width === p.height ? '50%' : '3px',
                transform: `rotate(${p.rotate})`,
                animationDelay: p.delay,
                animationDuration: p.duration,
                boxShadow: `0 0 10px ${p.color}aa`,
              }}
            />
          ))}

          {sparkles.map((s, idx) => (
            <div
              key={`sparkle-${idx}`}
              className="sparkle-custom-piece"
              style={{
                position: 'absolute',
                left: s.left,
                top: s.top,
                fontSize: s.size,
                animationDelay: s.delay,
                textShadow: '0 0 16px rgba(250, 204, 21, 0.9)',
              }}
            >
              {s.icon}
            </div>
          ))}
        </div>
      );
    }

    function SupplyRocketModal({ sol, onClose }) {
      return (
        <div
          className="fixed inset-0 z-50 bg-[#2d1e12]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <div
            className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-sm">
              🚀
            </div>

            <div>
              <h3 className="text-xl font-black text-[#4a3525]">
                Day {sol} Supply Rocket
              </h3>
              <p className="text-xs font-bold text-amber-900 mt-0.5">
                Emergency supplies safely delivered from Earth!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-1">
              <div className="bg-white border-2 border-sky-300 rounded-2xl p-3 shadow-sm flex flex-col items-center">
                <span className="text-2xl">💧</span>
                <span className="text-base font-black text-sky-950 mt-1">+30 Water</span>
                <span className="text-[10px] font-bold text-sky-700">Drinking & Plants</span>
              </div>

              <div className="bg-white border-2 border-red-300 rounded-2xl p-3 shadow-sm flex flex-col items-center">
                <span className="text-2xl">🍅</span>
                <span className="text-base font-black text-red-950 mt-1">+30 Food</span>
                <span className="text-[10px] font-bold text-red-700">Crew Rations</span>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#6d5138]">
              Base life-support reserves have been replenished.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-black text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Collect Supplies
            </button>
          </div>
        </div>
      );
    }

    // =========================================================================
