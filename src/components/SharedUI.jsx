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

    // =========================================================================
