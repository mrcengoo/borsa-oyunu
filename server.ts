import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface CachedQuote {
  price: number;
  prevClose: number;
  changeAmount: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  lastUpdated: string;
  timestamp: number;
  dataFeedStatus: 'LIVE' | 'DELAYED';
  dataFeedLabel: string;
  sparkline1D: number[];
}

const quoteCache = new Map<string, { data: CachedQuote; fetchedAt: number }>();
const CACHE_TTL_MS = 5000; // 5 seconds cache

async function fetchRealMarketData(symbol: string): Promise<CachedQuote> {
  const cached = quoteCache.get(symbol);
  const now = Date.now();
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?interval=5m&range=1d`;

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    if (cached) return cached.data;
    throw new Error(`Failed to fetch ${symbol}: HTTP ${response.status}`);
  }

  const json = await response.json();
  const result = json?.chart?.result?.[0];
  if (!result || !result.meta) {
    if (cached) return cached.data;
    throw new Error(`Invalid data structure for ${symbol}`);
  }

  const meta = result.meta;
  const quotes: (number | null)[] = result.indicators?.quote?.[0]?.close || [];
  const validQuotes = quotes.filter(
    (val): val is number => typeof val === 'number' && !isNaN(val)
  );

  const price = Number(meta.regularMarketPrice.toFixed(2));
  const prevClose = Number(
    (meta.previousClose || meta.chartPreviousClose || price).toFixed(2)
  );
  const changeAmount = Number((price - prevClose).toFixed(2));
  const changePercent = Number(
    (((price - prevClose) / prevClose) * 100).toFixed(2)
  );
  const dayHigh = Number((meta.regularMarketDayHigh || price).toFixed(2));
  const dayLow = Number((meta.regularMarketDayLow || price).toFixed(2));

  // Free public financial APIs are typically 15-minute delayed
  const tradeTime = meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now();
  const timeDiffMinutes = (Date.now() - tradeTime) / (1000 * 60);

  // If trade happened within 3 minutes and market is active, mark LIVE, otherwise DELAYED (15m)
  const isDelayed = timeDiffMinutes > 3;
  const dataFeedStatus: 'LIVE' | 'DELAYED' = isDelayed ? 'DELAYED' : 'LIVE';
  const dataFeedLabel = isDelayed ? 'DELAYED (15 dk)' : 'LIVE (Anlık)';

  // Provide current sync time so frontend clock reflects the exact fresh check
  const nowTime = new Date();
  const lastUpdated = nowTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Downsample quotes for sparkline if too many points (keep 10-20 clean points)
  let sparkline1D: number[] = [];
  if (validQuotes.length > 0) {
    if (validQuotes.length <= 16) {
      sparkline1D = validQuotes.map((p) => Number(p.toFixed(2)));
    } else {
      const step = Math.floor(validQuotes.length / 14);
      for (let i = 0; i < validQuotes.length; i += step) {
        sparkline1D.push(Number(validQuotes[i].toFixed(2)));
      }
      if (sparkline1D[sparkline1D.length - 1] !== price) {
        sparkline1D.push(price);
      }
    }
  }

  const quoteData: CachedQuote = {
    price,
    prevClose,
    changeAmount,
    changePercent,
    dayHigh,
    dayLow,
    lastUpdated,
    timestamp: tradeTime,
    dataFeedStatus,
    dataFeedLabel,
    sparkline1D,
  };

  quoteCache.set(symbol, { data: quoteData, fetchedAt: now });
  return quoteData;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Bulk fetch stock quotes for multiple symbols
  app.get('/api/stocks', async (req, res) => {
    const rawSymbols = (req.query.symbols as string) || 'NVDA,MSFT,ASML,LLY,PWR,CNQ,GH,ENSG,POWL';
    const symbols = rawSymbols.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

    try {
      const results = await Promise.allSettled(
        symbols.map((sym) => fetchRealMarketData(sym))
      );

      const data: Record<string, CachedQuote | { error: string }> = {};
      symbols.forEach((sym, idx) => {
        const resItem = results[idx];
        if (resItem.status === 'fulfilled') {
          data[sym] = resItem.value;
        } else {
          data[sym] = { error: resItem.reason?.message || 'Borsa verisi alınamadı' };
        }
      });

      res.json({
        success: true,
        source: 'Yahoo Finance Real Market Data API',
        data,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Single stock quote endpoint
  app.get('/api/stocks/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
      const quote = await fetchRealMarketData(symbol);
      res.json({
        success: true,
        symbol,
        source: 'Yahoo Finance Real Market Data API',
        data: quote,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Multi-timeframe historical data endpoint
  app.get('/api/stocks/:symbol/history', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const range = (req.query.range as string) || '1mo'; // 1d, 5d, 1mo, 1y
    const interval = (req.query.interval as string) || '1d';

    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch history' });
      }

      const json = await response.json();
      const quotes: (number | null)[] = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
      const validPoints = quotes.filter((v): v is number => typeof v === 'number' && !isNaN(v));

      res.json({
        symbol,
        range,
        interval,
        points: validPoints.map((v) => Number(v.toFixed(2))),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
