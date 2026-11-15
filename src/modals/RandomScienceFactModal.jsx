// Module 5E: Random Science Fact Modal (NASA & CSA Verified Resources)
// Simplified layout, elementary-friendly English (ages 7-10), single close button.

function RandomScienceFactModal({ fact, onNextRandomFact, onClose }) {
  if (!fact) return null;

  return (
    <div className="fixed inset-0 bg-[#2d1e12]/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] text-[#4a3525] rounded-3xl max-w-sm w-full p-4 sm:p-5 space-y-3 shadow-2xl relative">
        {/* Header: Category Badge + Single '×' Close Button */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs inline-flex items-center gap-1.5 border border-amber-300 shadow-sm">
            <span>✨</span>
            <span>{fact.category}</span>
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#ebd8c1] hover:bg-[#d9c2a3] text-[#4a3525] font-black flex items-center justify-center text-lg active:scale-95 transition cursor-pointer shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Short, Catchy Title */}
        <h3 className="text-lg sm:text-xl font-black text-[#4a3525] leading-snug">
          {fact.title}
        </h3>

        {/* Verified NASA/CSA Photo with Bulletproof Fallback */}
        <div className="space-y-1">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#e6d5bc] bg-stone-900/10 aspect-[16/10] flex items-center justify-center shadow-inner">
            <img
              src={fact.imageUrl}
              alt={fact.imageAlt || fact.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // If direct link fails, switch to backup Mars Curiosity photo
                if (e.target.src !== 'https://images-assets.nasa.gov/image/PIA19920/PIA19920~orig.jpg') {
                  e.target.src = 'https://images-assets.nasa.gov/image/PIA19920/PIA19920~orig.jpg';
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#78350f]/80 font-bold px-1">
            <span>Photo: {fact.imageCredit}</span>
            <span>{fact.sourceName}</span>
          </div>
        </div>

        {/* Elementary-Friendly Fact Body */}
        <div className="bg-white/85 border-2 border-[#ebd8c1] rounded-2xl p-3 shadow-sm">
          <p className="text-xs sm:text-sm font-bold text-[#4a3525] leading-relaxed">
            {fact.fact}
          </p>
        </div>

        {/* Action Buttons: Exactly TWO buttons (Another Fact + Source) */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={onNextRandomFact}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm text-center shadow active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Another Fact</span>
            <span>🎲</span>
          </button>

          {fact.sourceUrl && (
            <a
              href={fact.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm text-center shadow active:scale-95 transition flex items-center justify-center gap-1 shrink-0"
            >
              <span>Source</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
