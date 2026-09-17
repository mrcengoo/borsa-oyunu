import { RefreshCw, TrendingUp, Radio, Award, Factory, Sparkles } from 'lucide-react';
import { StockData } from '../types';
import { MiniSparkline } from './Sparkline';

interface HeaderProps {
  stocks: StockData[];
  onRefreshAll: () => void;
  isRefreshing: boolean;
  currency: 'USD' | 'TRY';
  setCurrency: (currency: 'USD' | 'TRY') => void;
  usdRate: number;
  isAutoStream: boolean;
  setIsAutoStream: (active: boolean) => void;
  activeTab: 'stocks' | 'production';
  setActiveTab: (tab: 'stocks' | 'production') => void;
}

export function Header({
  stocks,
  onRefreshAll,
  isRefreshing,
  currency,
  setCurrency,
  usdRate,
  isAutoStream,
  setIsAutoStream,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      {/* Top Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Market status */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md border border-white shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                  Kişisel Borsa & Fabrika Paneli
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sistem Aktif
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Borsa Kartları Koleksiyonu &bull; ARZ Hammadde Üretim ve Stok Simülasyonu
              </p>
            </div>
          </div>

          {/* Controls Bar & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* View Mode Navigation Tabs */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('stocks')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'stocks'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                <span>Borsa & MTG ({stocks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('production')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'production'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Factory className="w-3.5 h-3.5" />
                <span>ARZ Üretim & Stok</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === 'production'
                      ? 'bg-white/25 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Otomatik (60s-180s)
                </span>
              </button>
            </div>

            {/* Real-time Dynamic Auto-Stream Toggle (when on stocks view) */}
            {activeTab === 'stocks' && (
              <button
                type="button"
                onClick={() => setIsAutoStream(!isAutoStream)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                  isAutoStream
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Her 3 saniyede bir canlı piyasa fiyat hareketleri ve anlık akış"
              >
                <Radio
                  className={`w-3.5 h-3.5 ${
                    isAutoStream ? 'animate-pulse text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <span>Canlı Akış: {isAutoStream ? 'Açık' : 'Kapalı'}</span>
              </button>
            )}

            {/* Currency Selector */}
            <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1 text-xs">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  currency === 'USD'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('TRY')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  currency === 'TRY'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`TCMB / Piyasa Kuru: 1 USD = ${usdRate} ₺`}
              >
                TRY (₺)
              </button>
            </div>

            {/* Refresh All Button (Stocks tab) */}
            {activeTab === 'stocks' && (
              <button
                type="button"
                id="refresh-all-btn"
                onClick={onRefreshAll}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-all text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-amber-400 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span>{isRefreshing ? 'Güncelleniyor...' : 'Tümünü Yenile'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mini Ticker Ribbon Bar */}
      <div className="bg-slate-50 border-t border-slate-200/90 py-2 px-4 overflow-x-auto text-xs font-mono-num scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Canlı Fiyat Bandı:
            </span>
            {stocks.map((stock) => {
              const mult = currency === 'TRY' ? usdRate : 1;
              const sym = currency === 'TRY' ? '₺' : '$';
              const isPos = stock.changePercent >= 0;
              return (
                <div key={stock.symbol} className="flex items-center gap-2 whitespace-nowrap bg-white px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
                  <span className="font-black text-slate-800">{stock.symbol}</span>
                  <span className="text-slate-900 font-bold">
                    {sym}{(stock.price * mult).toFixed(2)}
                  </span>
                  <MiniSparkline data={stock.timeframeData['1G']} isPositive={isPos} />
                  <span
                    className={`text-[11px] font-black ${
                      isPos ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-600 whitespace-nowrap hidden lg:flex items-center gap-2">
            <span>Döviz Kuru:</span>
            <span className="font-bold text-slate-900">1 USD = {usdRate} TRY</span>
          </div>
        </div>
      </div>
    </header>
  );
}
