import { useCallback, useEffect, useState } from "react";
import config from "../resources/config/config";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const STOCK_QUOTES_CACHE_KEY = "hushh.stockQuotes.latest";

const STOCK_SYMBOLS = [
  "2222.SR",
  "GOOG",
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "BRK.B",
  "META",
  "JPM",
  "1398.HK",
  "601939.SS",
  "XOM",
  "601288.SS",
  "TSM",
  "601988.SS",
  "TM",
  "0857.HK",
  "WMT",
  "TCEHY",
  "BAC",
  "EQNR",
  "JNJ",
  "DTE.DE",
  "CMCSA",
  "UNH",
  "HSBC",
  "SHEL",
];

const STOCK_NAMES: Record<string, string> = {
  "2222.SR": "Saudi Aramco",
  GOOG: "Alphabet",
  AAPL: "Apple",
  MSFT: "Microsoft",
  NVDA: "NVIDIA",
  AMZN: "Amazon",
  "BRK.B": "Berkshire",
  META: "Meta",
  JPM: "JPMorgan",
  "1398.HK": "ICBC",
  "601939.SS": "CCB",
  XOM: "Exxon",
  "601288.SS": "ABC",
  TSM: "TSMC",
  "601988.SS": "BOC",
  TM: "Toyota",
  "0857.HK": "PetroChina",
  WMT: "Walmart",
  TCEHY: "Tencent",
  BAC: "BofA",
  EQNR: "Equinor",
  JNJ: "J&J",
  "DTE.DE": "DT Telekom",
  CMCSA: "Comcast",
  UNH: "UnitedHealth",
  HSBC: "HSBC",
  SHEL: "Shell",
};

const STOCK_SHORT_SYMBOLS: Record<string, string> = {
  "2222.SR": "ARAMCO",
  GOOG: "GOOG",
  AAPL: "AAPL",
  MSFT: "MSFT",
  NVDA: "NVDA",
  AMZN: "AMZN",
  "BRK.B": "BRK.B",
  META: "META",
  JPM: "JPM",
  "1398.HK": "ICBC",
  "601939.SS": "CCB",
  XOM: "XOM",
  "601288.SS": "ABC",
  TSM: "TSM",
  "601988.SS": "BOC",
  TM: "TM",
  "0857.HK": "PTRCN",
  WMT: "WMT",
  TCEHY: "TCEHY",
  BAC: "BAC",
  EQNR: "EQNR",
  JNJ: "JNJ",
  "DTE.DE": "DTE",
  CMCSA: "CMCSA",
  UNH: "UNH",
  HSBC: "HSBC",
  SHEL: "SHEL",
};

const STOCK_LOGOS: Record<string, string> = {
  "2222.SR": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Saudi_Aramco_logo.svg/1200px-Saudi_Aramco_logo.svg.png",
  GOOG: "https://thumbs.dreamstime.com/b/google-logo-vector-format-white-background-illustration-407571048.jpg",
  AAPL: "https://fabrikbrands.com/wp-content/uploads/Apple-Logo-History-1-1155x770.png",
  MSFT: "https://static.vecteezy.com/system/resources/previews/027/127/473/non_2x/microsoft-logo-microsoft-icon-transparent-free-png.png",
  NVDA: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVEu8tfOJpA-vMjPqyI2gEyaDjTaI7tSJFzQ&s",
  AMZN: "https://static.vecteezy.com/system/resources/previews/014/018/561/non_2x/amazon-logo-on-transparent-background-free-vector.jpg",
  "BRK.B": "https://www.shutterstock.com/shutterstock/photos/2378735305/display_1500/stock-vector-brk-letter-logo-design-on-a-white-background-or-monogram-logo-design-for-entrepreneur-and-business-2378735305.jpg",
  META: "https://img.freepik.com/premium-vector/meta-company-logo_265339-667.jpg",
  JPM: "https://e7.pngegg.com/pngimages/225/668/png-clipart-jpmorgan-chase-logo-bank-business-morgan-stanley-bank-text-logo.png",
  "1398.HK": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Industrial_and_Commercial_Bank_of_China_logo.svg/2560px-Industrial_and_Commercial_Bank_of_China_logo.svg.png",
  "601939.SS": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/China_Construction_Bank_logo.svg/1200px-China_Construction_Bank_logo.svg.png",
  XOM: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/ExxonMobil.svg/2560px-ExxonMobil.svg.png",
  "601288.SS": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Agricultural_Bank_of_China_logo.svg/1200px-Agricultural_Bank_of_China_logo.svg.png",
  TSM: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Tsmc.svg/1200px-Tsmc.svg.png",
  "601988.SS": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Bank_of_China_%28logo%29.svg/1200px-Bank_of_China_%28logo%29.svg.png",
  TM: "https://global.toyota/pages/global_toyota/mobility/toyota-brand/emblem_001.jpg",
  "0857.HK": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/PetroChina_logo.svg/1200px-PetroChina_logo.svg.png",
  WMT: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwPUD4NGc7WTQVqDstT5ZPRQXm6ka0KTsmTsKfiY&usqp=CAE&s",
  TCEHY: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tencent_Logo.svg/2560px-Tencent_Logo.svg.png",
  BAC: "https://www.bankofamerica.com/content/images/ContextualSiteGraphics/Logos/en_US/logos/bac-logo-v2.png",
  EQNR: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Equinor_Logo.svg/2560px-Equinor_Logo.svg.png",
  JNJ: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/JohnsonandJohnsonLogo.svg/2560px-JohnsonandJohnsonLogo.svg.png",
  "DTE.DE": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Deutsche_Telekom-Logo.svg/2560px-Deutsche_Telekom-Logo.svg.png",
  CMCSA: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Comcast_Logo.svg/2560px-Comcast_Logo.svg.png",
  UNH: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/UnitedHealth_Group_logo.svg/2560px-UnitedHealth_Group_logo.svg.png",
  HSBC: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo.svg.png",
  SHEL: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png",
};

const FALLBACK_QUOTES: Record<
  string,
  { currentPrice: number; change: number; percentChange: number }
> = {
  "2222.SR": { currentPrice: 29.45, change: 0.18, percentChange: 0.61 },
  GOOG: { currentPrice: 178.42, change: 1.63, percentChange: 0.92 },
  AAPL: { currentPrice: 196.85, change: 2.14, percentChange: 1.1 },
  MSFT: { currentPrice: 428.73, change: 3.58, percentChange: 0.84 },
  NVDA: { currentPrice: 121.66, change: 2.91, percentChange: 2.45 },
  AMZN: { currentPrice: 184.31, change: -1.26, percentChange: -0.68 },
  "BRK.B": { currentPrice: 468.24, change: 1.34, percentChange: 0.29 },
  META: { currentPrice: 512.48, change: -3.87, percentChange: -0.75 },
  JPM: { currentPrice: 198.57, change: 1.05, percentChange: 0.53 },
  "1398.HK": { currentPrice: 4.76, change: 0.03, percentChange: 0.63 },
  "601939.SS": { currentPrice: 7.31, change: 0.04, percentChange: 0.55 },
  XOM: { currentPrice: 118.96, change: -0.42, percentChange: -0.35 },
  "601288.SS": { currentPrice: 5.29, change: 0.02, percentChange: 0.38 },
  TSM: { currentPrice: 146.83, change: 1.72, percentChange: 1.19 },
  "601988.SS": { currentPrice: 4.82, change: 0.01, percentChange: 0.21 },
  TM: { currentPrice: 245.91, change: -1.09, percentChange: -0.44 },
  "0857.HK": { currentPrice: 7.88, change: 0.06, percentChange: 0.77 },
  WMT: { currentPrice: 69.37, change: 0.41, percentChange: 0.59 },
  TCEHY: { currentPrice: 47.58, change: -0.21, percentChange: -0.44 },
  BAC: { currentPrice: 39.84, change: 0.22, percentChange: 0.56 },
  EQNR: { currentPrice: 27.63, change: -0.15, percentChange: -0.54 },
  JNJ: { currentPrice: 148.94, change: 0.67, percentChange: 0.45 },
  "DTE.DE": { currentPrice: 22.31, change: 0.09, percentChange: 0.41 },
  CMCSA: { currentPrice: 39.27, change: -0.18, percentChange: -0.46 },
  UNH: { currentPrice: 488.15, change: 2.23, percentChange: 0.46 },
  HSBC: { currentPrice: 43.62, change: 0.19, percentChange: 0.44 },
  SHEL: { currentPrice: 71.54, change: -0.33, percentChange: -0.46 },
};

export interface StockQuote {
  symbol: string;
  displaySymbol: string;
  name: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  isUp: boolean;
  logo: string;
}

interface EdgeFunctionQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface EdgeFunctionResponse {
  success: boolean;
  quotes?: EdgeFunctionQuote[] | null;
  fetchedAt?: string;
  count?: number;
  error?: string;
  message?: string;
}

function buildFallbackData(): StockQuote[] {
  return STOCK_SYMBOLS.map((symbol) => {
    const fallback = FALLBACK_QUOTES[symbol] || {
      currentPrice: 100,
      change: 0.5,
      percentChange: 0.5,
    };

    return {
      symbol,
      displaySymbol: STOCK_SHORT_SYMBOLS[symbol] || symbol,
      name: STOCK_NAMES[symbol] || symbol,
      currentPrice: fallback.currentPrice,
      change: fallback.change,
      percentChange: fallback.percentChange,
      isUp: fallback.percentChange >= 0,
      logo: STOCK_LOGOS[symbol] || "",
    };
  });
}

function buildEdgeFunctionUrl() {
  if (!SUPABASE_URL) {
    return "";
  }

  return new URL("/functions/v1/stock-quotes", SUPABASE_URL).toString();
}

function isValidNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function mapQuoteToViewModel(quote: EdgeFunctionQuote): StockQuote | null {
  if (!quote || typeof quote.symbol !== "string" || !quote.symbol.trim()) {
    return null;
  }

  const symbol = quote.symbol.trim().toUpperCase();
  const fallback = FALLBACK_QUOTES[symbol];
  const currentPrice = isValidNumber(quote.currentPrice)
    ? quote.currentPrice
    : fallback?.currentPrice;
  const change = isValidNumber(quote.change) ? quote.change : fallback?.change;
  const percentChange = isValidNumber(quote.percentChange)
    ? quote.percentChange
    : fallback?.percentChange;

  if (
    !isValidNumber(currentPrice) ||
    !isValidNumber(change) ||
    !isValidNumber(percentChange)
  ) {
    return null;
  }

  return {
    symbol,
    displaySymbol: STOCK_SHORT_SYMBOLS[symbol] || symbol,
    name: STOCK_NAMES[symbol] || symbol,
    currentPrice,
    change,
    percentChange,
    isUp: percentChange >= 0,
    logo: STOCK_LOGOS[symbol] || "",
  };
}

function readCachedQuotes(): StockQuote[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STOCK_QUOTES_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    const mapped = parsed
      .map((item) => mapQuoteToViewModel(item as EdgeFunctionQuote))
      .filter((item): item is StockQuote => item !== null);

    return mapped.length > 0 ? mapped : null;
  } catch (error) {
    console.error("[useStockQuotes] Failed to read cache:", error);
    return null;
  }
}

function writeCachedQuotes(quotes: StockQuote[]) {
  if (typeof window === "undefined" || quotes.length === 0) {
    return;
  }

  try {
    window.localStorage.setItem(STOCK_QUOTES_CACHE_KEY, JSON.stringify(quotes));
  } catch (error) {
    console.error("[useStockQuotes] Failed to write cache:", error);
  }
}

async function getAuthorizationToken() {
  const sessionResult = await config.supabaseClient?.auth.getSession();
  return sessionResult?.data?.session?.access_token || SUPABASE_ANON_KEY;
}

export function useStockQuotes(refreshInterval = 120000) {
  const initialQuotes = readCachedQuotes() || buildFallbackData();
  const [quotes, setQuotes] = useState<StockQuote[]>(initialQuotes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFallback, setIsFallback] = useState(initialQuotes.length > 0);

  const applyFallback = useCallback((reason: string) => {
    const cachedQuotes = readCachedQuotes();
    const fallbackQuotes = cachedQuotes || buildFallbackData();

    console.warn(
      `[useStockQuotes] Using ${cachedQuotes ? "cached" : "mock"} fallback quotes: ${reason}`
    );

    setQuotes(fallbackQuotes);
    setError(reason);
    setIsFallback(true);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  const fetchAllQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const edgeFunctionUrl = buildEdgeFunctionUrl();
    if (!edgeFunctionUrl || !SUPABASE_ANON_KEY) {
      applyFallback("Stock quote configuration is missing.");
      return;
    }

    try {
      const authorizationToken = await getAuthorizationToken();

      console.log("[useStockQuotes] API URL:", edgeFunctionUrl);

      const response = await fetch(edgeFunctionUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${authorizationToken}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ symbols: STOCK_SYMBOLS }),
      });

      console.log("[useStockQuotes] Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Stock quotes request failed with ${response.status}`);
      }

      const data = (await response.json()) as EdgeFunctionResponse;
      console.log("[useStockQuotes] Response data:", data);

      if (!data || data.success !== true || !Array.isArray(data.quotes)) {
        applyFallback("Stock quotes response was invalid.");
        return;
      }

      const mappedQuotes = data.quotes
        .map((quote) => mapQuoteToViewModel(quote))
        .filter((quote): quote is StockQuote => quote !== null);

      if (mappedQuotes.length === 0) {
        applyFallback("Stock quotes response was empty.");
        return;
      }

      setQuotes(mappedQuotes);
      writeCachedQuotes(mappedQuotes);
      setLastUpdated(data.fetchedAt ? new Date(data.fetchedAt) : new Date());
      setIsFallback(false);
      setLoading(false);
    } catch (fetchError) {
      console.error("[useStockQuotes] Fetch failed:", fetchError);
      applyFallback(
        fetchError instanceof Error
          ? fetchError.message
          : "Stock quotes request failed."
      );
    }
  }, [applyFallback]);

  useEffect(() => {
    void fetchAllQuotes();
  }, [fetchAllQuotes]);

  useEffect(() => {
    if (refreshInterval <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void fetchAllQuotes();
    }, refreshInterval);

    return () => window.clearInterval(intervalId);
  }, [fetchAllQuotes, refreshInterval]);

  return {
    quotes: quotes.length > 0 ? quotes : buildFallbackData(),
    loading,
    error,
    lastUpdated,
    isFallback,
    refetch: fetchAllQuotes,
  };
}

export { STOCK_LOGOS, STOCK_NAMES, STOCK_SHORT_SYMBOLS, STOCK_SYMBOLS };
