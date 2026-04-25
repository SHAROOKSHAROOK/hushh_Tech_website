import React, { useState } from "react";
import hushhLogo from "../images/Hushhogo.png";
import HushhTechNavDrawer from "../hushh-tech-nav-drawer/HushhTechNavDrawer";
import { StockQuote, useStockQuotes } from "../../hooks/useStockQuotes";

const TickerChip = ({
  quote,
  isLoading,
}: {
  quote: StockQuote;
  isLoading?: boolean;
}) => (
  <div className="group flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white border border-gray-200 shadow-sm pl-1.5 pr-3 hover:shadow-md transition-all">
    <div className="flex w-6 h-6 items-center justify-center rounded-full bg-gray-100 shrink-0 overflow-hidden">
      {quote.logo ? (
        <img
          src={quote.logo}
          alt={`${quote.displaySymbol} logo`}
          className="w-3.5 h-3.5 object-contain"
          loading="lazy"
          onError={(event) => {
            (event.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span className="text-[9px] font-bold text-gray-600">
          {quote.displaySymbol.charAt(0)}
        </span>
      )}
    </div>

    <span className="text-[11px] font-bold text-gray-800 leading-none">
      {quote.displaySymbol}
    </span>

    <div
      className={`ml-0.5 flex items-center gap-0.5 ${
        quote.isUp ? "text-green-600" : "text-red-500"
      }`}
    >
      <span className="text-[9px]">{quote.isUp ? "\u25B2" : "\u25BC"}</span>
      <span
        className={`text-[10px] font-semibold ${isLoading ? "animate-pulse" : ""}`}
      >
        {Math.abs(quote.percentChange).toFixed(1)}%
      </span>
    </div>
  </div>
);

const TickerPlaceholder = () => (
  <div className="flex h-9 w-[92px] shrink-0 items-center gap-1.5 rounded-full bg-white border border-gray-200 shadow-sm pl-1.5 pr-3 animate-pulse">
    <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
    <div className="h-2.5 w-10 rounded bg-gray-200" />
    <div className="h-2.5 w-8 rounded bg-gray-200" />
  </div>
);

interface HushhTechHeaderProps {
  showTicker?: boolean;
  className?: string;
}

const HushhTechHeader: React.FC<HushhTechHeaderProps> = ({
  showTicker = true,
  className = "",
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { quotes, loading, lastUpdated, error, isFallback } = useStockQuotes(120000);
  const showPlaceholders = loading && quotes.length === 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm ${className}`}
      >
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={hushhLogo}
                alt="Hushh Logo"
                className="w-11 h-11 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold tracking-tight text-gray-900">
                hushh
              </span>
              <span className="text-[11px] font-medium tracking-[0.08em] text-gray-400 uppercase">
                Technologies
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Open menu"
            tabIndex={0}
          >
            <span className="material-symbols-outlined text-white !text-[1.2rem]">
              menu
            </span>
          </button>
        </div>

        {showTicker && (
          <section className="relative w-full bg-[#F8F9FA] py-2 border-t border-b border-gray-200">
            <div className="hushh-ticker-mask relative flex w-full overflow-hidden">
              <div className="hushh-ticker-track flex items-center gap-2.5 px-3">
                {showPlaceholders
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <TickerPlaceholder key={`placeholder-${index}`} />
                    ))
                  : (
                    <>
                      {quotes.map((quote, index) => (
                        <TickerChip
                          key={`a-${quote.symbol}-${index}`}
                          quote={quote}
                          isLoading={loading || isFallback}
                        />
                      ))}
                      {quotes.map((quote, index) => (
                        <TickerChip
                          key={`b-${quote.symbol}-${index}`}
                          quote={quote}
                          isLoading={loading || isFallback}
                        />
                      ))}
                    </>
                  )}
              </div>
            </div>

            {lastUpdated && !error && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-medium text-gray-400">
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}

            {error && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white">
                Live data unavailable
              </div>
            )}
          </section>
        )}
      </header>

      <div className={showTicker ? "h-[121px]" : "h-[72px]"} />

      <HushhTechNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <style>{`
        .hushh-ticker-mask {
          mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
        }
        .hushh-ticker-track {
          display: flex;
          animation: hushh-ticker-scroll 45s linear infinite;
          width: max-content;
        }
        @keyframes hushh-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hushh-ticker-mask:hover .hushh-ticker-track {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
};

export default HushhTechHeader;
