import React from "react";



export default function EmptyCartFoody({
  onBrowse = () => (window.location.href = "/"),
  suggestion = {
    id: "s1",
    name: "Classic Zinger Box Meal",
    desc: "Signature burger + fries + drink",
    price: 244,
    img: "", // optional url for thumbnail
  },
  brand = "Foody",
  ctaText = "Start ordering",
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#071017] via-[#0e2630] to-[#12313a]">
      <section
        aria-labelledby="empty-cart-title"
        className="w-full max-w-4xl rounded-3xl overflow-hidden md:flex shadow-2xl ring-1 ring-white/6"
      >
        {/* Left / Accent illustration area */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center p-8"
             aria-hidden="true"
        >
          {/* red accent blob with subtle glass overlay */}
          <div
            className="absolute inset-0 -z-10 rounded-l-3xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,76,45,0.95), rgba(255,76,45,0.88))",
            }}
          />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent)]" />

          {/* Illustration (SVG) */}
          <figure className="w-56 h-56 md:w-64 md:h-64 drop-shadow-2xl animate-float">
            <svg viewBox="0 0 240 240" className="w-full h-full" role="img" aria-label={`${brand} empty cart`}>
              <defs>
                <linearGradient id="b" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff1e6" />
                  <stop offset="1" stopColor="#ffd9cc" />
                </linearGradient>
                <linearGradient id="a" x1="0" x2="1">
                  <stop offset="0" stopColor="#ffb703" />
                  <stop offset="1" stopColor="#ff4d2d" />
                </linearGradient>
              </defs>

              <rect x="10" y="20" rx="28" width="220" height="190" fill="url(#b)" />
              <g transform="translate(30,35)">
                <path d="M20 30 L170 30 L150 150 L40 150 Z" fill="url(#a)" stroke="#ff8a6b" strokeWidth="2"/>
                <circle cx="90" cy="88" r="18" fill="#fff" opacity="0.95"/>
                <g transform="translate(78,78)" fill="#ff4d2d">
                  <rect x="-5" y="-8" width="10" height="10" rx="2"/>
                  <rect x="5" y="-8" width="10" height="10" rx="2"/>
                </g>
              </g>
            </svg>
          </figure>
        </div>

        {/* Right / Glass panel */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between"
             style={{ background: "rgba(255,255,255,0.025)" }}
        >
          <div>
            <div className="flex items-start justify-between">
              <h1 id="empty-cart-title" className="text-2xl sm:text-3xl font-extrabold text-white">
                Cart is empty
              </h1>
            </div>

            <p className="mt-3 text-sm sm:text-base text-red-50/95 leading-relaxed">
              Our {brand} Friends are already smacking some finger-licking good food.
              Add items from nearby restaurants to your cart now.
            </p>
          </div>

          {/* Suggestion card */}
          {suggestion && (
            <div className="mt-6">
              <div className="rounded-2xl p-3 flex items-center gap-3 shadow-md ring-1 ring-white/8"
                   style={{
                     background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                   }}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                  {suggestion.img ? (
                    <img src={suggestion.img} alt={suggestion.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-red-600 font-semibold text-2xl">
                      🍗
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{suggestion.name}</div>
                  <div className="text-xs text-gray-300 mt-1">{suggestion.desc}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-bold text-white">₹{suggestion.price}</div>
                  <button
                    onClick={() => onBrowse()}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-medium shadow-sm hover:brightness-95 transition"
                    aria-label={`Add ${suggestion.name} to cart`}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6">
            <button
              onClick={onBrowse}
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-full font-semibold px-6 py-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer"
              aria-label={ctaText}
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92))",
                color: "#c11f00",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block" aria-hidden>
                <path fill="currentColor" d="M3 6h2l3.6 7.59-1.35 2.44A1 1 0 0 0 8.1 17H19v-2H8.42c.01 0 .02 0 0 0L8.1 15.57 9.45 13H17a1 1 0 0 0 .93-.63L21 7H6" />
              </svg>
              {ctaText}
            </button>

            <p className="mt-3 text-xs text-red-50/90">
              Fast delivery • Contactless • Top rated kitchens
            </p>
          </div>
        </div>
      </section>

      {/* lightweight styles */}
      <style>{`
        @keyframes float { 0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)} }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .active\\:scale-95:active { transform: scale(0.95); }
      `}</style>
    </main>
  );
}
