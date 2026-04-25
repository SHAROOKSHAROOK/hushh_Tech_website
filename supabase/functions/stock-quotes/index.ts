import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const DEFAULT_STOCK_SYMBOLS = [
  "AAPL", "GOOGL", "MSFT", "NVDA", "AMZN", "META", "BRK.B", "JPM",
  "XOM", "TSM", "TM", "WMT", "BAC", "V", "JNJ", "PG", "MA", "HD",
  "CVX", "MRK", "PFE", "ABBV", "KO", "PEP", "COST", "AVGO", "ORCL",
];

interface StockQuote {
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

interface FinnhubQuoteResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

interface QuoteResponse {
  success: boolean;
  quotes: StockQuote[];
  fetchedAt: string;
  count: number;
  error?: string;
  message?: string;
}

function jsonResponse(payload: QuoteResponse, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeSymbols(rawSymbols: unknown): string[] {
  if (!Array.isArray(rawSymbols)) {
    return DEFAULT_STOCK_SYMBOLS;
  }

  const normalized = rawSymbols
    .map((value) => (typeof value === "string" ? value.trim().toUpperCase() : ""))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : DEFAULT_STOCK_SYMBOLS;
}

async function fetchStockQuote(symbol: string, apiKey: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${symbol}: ${response.status}`);
      return null;
    }

    const data: FinnhubQuoteResponse = await response.json();

    if (data.c === 0 && data.d === 0 && data.dp === 0) {
      console.warn(`No data for symbol: ${symbol}`);
      return null;
    }

    return {
      symbol,
      currentPrice: data.c,
      change: data.d,
      percentChange: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

async function fetchAllQuotes(apiKey: string, symbols: string[]): Promise<StockQuote[]> {
  const quotes: StockQuote[] = [];
  const batchSize = 10;

  for (let index = 0; index < symbols.length; index += batchSize) {
    const batch = symbols.slice(index, index + batchSize);
    const batchResults = await Promise.all(
      batch.map((symbol) => fetchStockQuote(symbol, apiKey))
    );

    for (const quote of batchResults) {
      if (quote) {
        quotes.push(quote);
      }
    }

    if (index + batchSize < symbols.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return quotes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const finnhubApiKey = Deno.env.get("FINNHUB_API_KEY");

    if (!finnhubApiKey) {
      console.error("FINNHUB_API_KEY not configured");
      return jsonResponse(
        {
          success: false,
          error: "Stock API not configured",
          message: "FINNHUB_API_KEY is missing.",
          quotes: [],
          fetchedAt: new Date().toISOString(),
          count: 0,
        },
        500
      );
    }

    let symbolsToFetch = DEFAULT_STOCK_SYMBOLS;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        symbolsToFetch = normalizeSymbols(body.symbols);
      } catch {
        symbolsToFetch = DEFAULT_STOCK_SYMBOLS;
      }
    }

    const quotes = await fetchAllQuotes(finnhubApiKey, symbolsToFetch);

    return jsonResponse({
      success: true,
      quotes,
      fetchedAt: new Date().toISOString(),
      count: quotes.length,
    });
  } catch (error) {
    console.error("Error in stock-quotes function:", error);

    return jsonResponse(
      {
        success: false,
        error: "Failed to fetch stock quotes",
        message: error instanceof Error ? error.message : "Unknown error",
        quotes: [],
        fetchedAt: new Date().toISOString(),
        count: 0,
      },
      500
    );
  }
});
