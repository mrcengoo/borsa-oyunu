import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameNavigation } from './navigation/GameNavigation';
import { OverviewPage } from './pages/OverviewPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { CeosPage } from './pages/CeosPage';
import { BuyersPage } from './pages/BuyersPage';
import { MarketPage } from './pages/MarketPage';
import { TurnPage } from './pages/TurnPage';
import { StockCard } from './StockCard';
import { EditModal } from './EditModal';
import { INITIAL_STOCKS } from '../data/stocks';
import { StockData } from '../types';

const getNowTimeStr = () =>
  new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

function calculateTickedStock(stock: StockData): StockData {
  const direction = Math.random() > 0.48 ? 1 : -1;
  const pctChange = (0.04 + Math.random() * 0.24) * direction;
  let delta = Number(((stock.price * pctChange) / 100).toFixed(2));

  if (Math.abs(delta) < 0.05) {
    delta = direction * Number((0.05 + Math.random() * 0.3).toFixed(2));
  }

  const newPrice = Number(Math.max(1, stock.price + delta).toFixed(2));
  const prevClose =
    Number((stock.price - stock.changeAmount).toFixed(2)) ||
    Number((stock.price * 0.99).toFixed(2));
  const newChangeAmount = Number((newPrice - prevClose).toFixed(2));
  const newChangePercent = Number((((newPrice - prevClose) / prevClose) * 100).toFixed(2));

  const current1D = stock.timeframeData['1G'] || [stock.price];
  const new1D =
    current1D.length > 20
      ? [...current1D.slice(1), newPrice]
      : [...current1D, newPrice];

  return {
    ...stock,
    price: newPrice,
    changeAmount: newChangeAmount,
    changePercent: newChangePercent,
    dayHigh: Math.max(stock.dayHigh, newPrice),
    dayLow: Math.min(stock.dayLow, newPrice),
    lastUpdated: getNowTimeStr(),
    timeframeData: {
      ...stock.timeframeData,
      '1G': new1D,
    },
  };
}

export function MainGameLayout() {
  const { activeTab, currency, toastMessage, showToast } = useGame();

  // Stock trading cards state
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);
  const [editingStock, setEditingStock] = useState<StockData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoStream, setIsAutoStream] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'loading' | 'error'>('loading');
  const [lastSyncTime, setLastSyncTime] = useState<string>(getNowTimeStr());
  const usdRate = 36.45;

  const syncOfficialMarketData = useCallback(
    async (notify = false) => {
      setIsRefreshing(true);
      try {
        const res = await fetch('/api/stocks');
        if (!res.ok) throw new Error(`API HTTP ${res.status}`);
        const json = await res.json();
        const nowStr = getNowTimeStr();

        if (json.success && json.data) {
          setStocks((prev) =>
            prev.map((item) => {
              const real = json.data[item.symbol];
              if (!real || real.error) return item;

              const updated1D =
                real.sparkline1D && real.sparkline1D.length >= 3
                  ? real.sparkline1D
                  : item.timeframeData['1G'];

              return {
                ...item,
                price: real.price,
                changeAmount: real.changeAmount,
                changePercent: real.changePercent,
                dayHigh: real.dayHigh || item.dayHigh,
                dayLow: real.dayLow || item.dayLow,
                lastUpdated: nowStr,
                dataFeedStatus: real.dataFeedStatus || 'DELAYED',
                dataFeedLabel: real.dataFeedLabel || 'DELAYED (15 dk)',
                timeframeData: {
                  ...item.timeframeData,
                  '1G': updated1D,
                },
              };
            })
          );
          setApiStatus('connected');
          setLastSyncTime(nowStr);
          if (notify) {
            showToast(`✓ Resmî borsa verileriyle eşitlendi • ${nowStr}`);
          }
        }
      } catch (err) {
        console.warn('Real market API fetch error:', err);
        setApiStatus('error');
      } finally {
        setIsRefreshing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    syncOfficialMarketData(false);
  }, [syncOfficialMarketData]);

  // Live Auto-Stream
  useEffect(() => {
    if (!isAutoStream) return;

    const interval = setInterval(() => {
      setStocks((prev) => {
        if (prev.length === 0) return prev;
        const countToUpdate = Math.floor(Math.random() * 2) + 1;
        const indicesToUpdate = new Set<number>();
        while (indicesToUpdate.size < countToUpdate) {
          indicesToUpdate.add(Math.floor(Math.random() * prev.length));
        }

        return prev.map((item, idx) => {
          if (indicesToUpdate.has(idx)) {
            return calculateTickedStock(item);
          }
          return item;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoStream]);

  const handleRefreshSingle = useCallback((symbol: string) => {
    setStocks((prev) =>
      prev.map((item) => (item.symbol === symbol ? calculateTickedStock(item) : item))
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-300 selection:text-slate-950">
      {/* Persistent Top Navigation Bar */}
      <GameNavigation />

      {/* Main Multi-Page Screen Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'companies' && <CompaniesPage />}
        {activeTab === 'company_detail' && <CompanyDetailPage />}
        {activeTab === 'ceos' && <CeosPage />}
        {activeTab === 'buyers' && <BuyersPage />}
        {activeTab === 'market' && <MarketPage />}
        {activeTab === 'turn' && <TurnPage />}

        {activeTab === 'stocks' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Section Title */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Koleksiyon Kart Serisi &bull; Finansal Deste
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Öne Çıkan Şirket Kartları & Metrikler
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  MSFT, LLY, PWR, ASML, GH, POWL, NVDA, ENSG ve CNQ şirketleri için oyun kartı formatında anlık borsa fiyatları.
                </p>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-mono">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs font-bold">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  {stocks.length} Oyun Kartı
                </span>
              </div>
            </div>

            {/* API Status */}
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Piyasa Veri Kaynağı:
                </span>
                <span className="text-slate-600">
                  Resmî Borsa API (Canlı & Güncel Piyasa Akışı)
                </span>
              </div>

              <div className="flex items-center gap-2.5 font-mono text-[11px] flex-wrap">
                <button
                  type="button"
                  onClick={() => syncOfficialMarketData(true)}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-bold border border-slate-200 transition-colors cursor-pointer text-[11px]"
                >
                  <RefreshCw
                    className={`w-3 h-3 text-sky-600 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  <span>Resmî Borsadan Güncelle</span>
                </button>
              </div>
            </div>

            {/* Stocks Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  currency={currency}
                  usdRate={usdRate}
                  onRefresh={handleRefreshSingle}
                  onEdit={(stk) => setEditingStock(stk)}
                  isAutoStreaming={isAutoStream}
                />
              ))}
            </div>

            <EditModal
              stock={editingStock}
              isOpen={editingStock !== null}
              onClose={() => setEditingStock(null)}
              onSave={(updated) => {
                setStocks((prev) =>
                  prev.map((item) => (item.symbol === updated.symbol ? updated : item))
                );
              }}
            />
          </div>
        )}

        {/* Global Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Sanayi & Piyasa Strateji Oyunu &bull; Çok Şirketli Endüstriyel Simülasyon
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>ARZ Hammadde</span>
            <span>&bull;</span>
            <span>PWR Altyapı</span>
            <span>&bull;</span>
            <span>ETN Akıllı Güç</span>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
            <div className="bg-slate-950/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 backdrop-blur-md text-xs font-medium">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-100">{toastMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
