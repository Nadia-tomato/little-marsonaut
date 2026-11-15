// Module 5A: Kid-Friendly Science Guide Modal
function ScienceExplanationModal({ topicKey, onClose }) {
      if (!topicKey || !SCIENCE_EXPLANATIONS[topicKey]) return null;
      const info = SCIENCE_EXPLANATIONS[topicKey];

      return (
        <div
          className="fixed inset-0 bg-[#2d1e12]/75 flex items-center justify-center p-4 z-[65] overflow-y-auto"
          onClick={onClose}
        >
          <div
            className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-md w-full p-5 space-y-3.5 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b-2 border-[#eadbc5] pb-2.5">
              <span className="text-4xl">{info.icon}</span>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                  MARS SCIENCE KID GUIDE • REAL SPACE PHOTO
                </div>
                <h3 className="text-lg font-black text-[#4a3525] leading-snug">{info.title}</h3>
              </div>
            </div>

            {info.photoUrl && (
              <div className="bg-white border-2 border-[#eadbc5] rounded-2xl p-2.5 space-y-1.5 shadow-sm">
                <img
                  src={info.photoUrl}
                  alt={info.title}
                  onError={(e) => {
                    if (info.fallbackPhotoUrl && e.currentTarget.src !== info.fallbackPhotoUrl) {
                      e.currentTarget.src = info.fallbackPhotoUrl;
                    }
                  }}
                  className="w-full max-h-60 object-contain rounded-xl bg-slate-900"
                />
                {info.photoCaption && (
                  <p className="text-[11px] font-extrabold text-amber-900 leading-snug">
                    📸 {info.photoCaption}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-[#4a3525] leading-relaxed font-semibold bg-white p-3.5 rounded-2xl border-2 border-[#eadbc5]">
              {info.body}
            </p>

            {info.linkUrl && (
              <a
                href={info.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 px-3 rounded-2xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 text-sky-900 font-black text-xs transition shadow-sm"
              >
                {info.linkLabel || '🔗 Learn More on NASA.gov'}
              </a>
            )}

            {info.funTip && (
              <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl px-3.5 py-2.5 text-xs font-black text-amber-950">
                💡 {info.funTip}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-sm shadow-md active:scale-95 transition"
            >
              Got It! ✓
            </button>
          </div>
        </div>
      );
    }
