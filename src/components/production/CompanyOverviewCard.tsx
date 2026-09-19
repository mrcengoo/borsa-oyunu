import { Play, Pause, Clock, Building2, Coins, TrendingUp, PackageCheck, FastForward, Activity, Sparkles, AlertTriangle } from 'lucide-react';
import { CompanyConfig, CompanyInventoryState, MAX_STOCK_CAPACITY } from '../../types/production';

interface CompanyOverviewCardProps {
  company: CompanyConfig;
  inventoryState: CompanyInventoryState;
  isFactoryRunning: boolean;
  onToggleFactory: () => void;
  onFastForward: (seconds: number) => void;
  onResetGame: () => void;
  currency: 'USD' | 'TRY';
}

function formatDurationShort(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}dk${s > 0 ? ` ${s}s` : ''}`;
}

export function CompanyOverviewCard({
  company,
  inventoryState,
  isFactoryRunning,
  onToggleFactory,
  onFastForward,
  currency,
}: CompanyOverviewCardProps) {
  const currencySymbol = currency === 'TRY' ? '₺' : '$';
  const totalStockCount = Object.values(inventoryState.stock).reduce((a, b) => a + b, 0);
  const isWarehouseFull = totalStockCount >= MAX_STOCK_CAPACITY;
  const capacityPercent = Math.min(100, Math.round((totalStockCount / MAX_STOCK_CAPACITY) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        {/* Company Identity */}
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-slate-900 text-amber-300 flex items-center justify-center font-black text-xl shadow-xs border border-slate-800 shrink-0">
            {company.code}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                {company.name}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {company.badge}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isFactoryRunning
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isFactoryRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isFactoryRunning ? 'Otomatik Zaman Akışı: Aktif' : 'Zaman Duraklatıldı'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {company.tagline} &bull; CEO: <strong className="text-slate-800">{company.ceo.name}</strong>
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Üretim Döngüleri:{' '}
                {company.products.map((p) => `${p.name} (${formatDurationShort(p.durationSeconds)})`).join(' • ')}
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Real-Time Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Cash Box */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[160px]">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">
              {company.code} Fabrika Kasası
            </span>
            <div className="text-xl font-black font-mono text-slate-900">
              {currencySymbol}{inventoryState.cash.toLocaleString('tr-TR')}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex justify-between">
              <span>Gelir: +{currencySymbol}{inventoryState.totalRevenue}</span>
              <span>Gider: -{currencySymbol}{inventoryState.totalExpenses}</span>
            </div>
          </div>

          {/* Time Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleFactory}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                isFactoryRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isFactoryRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Başlat</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onFastForward(30)}
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-all cursor-pointer"
              title="Zamanı 30 saniye ileri sar"
            >
              <FastForward className="w-3.5 h-3.5 text-slate-600" />
              <span>+30s</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warehouse Capacity Progress Bar (100 Units Limit) */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <PackageCheck className="w-4 h-4 text-slate-500" />
            Fabrika Depo Kapasitesi (Limit 100 Adet):
          </span>
          <span className={isWarehouseFull ? 'text-rose-600 font-black' : 'text-slate-800 font-bold'}>
            {totalStockCount} / {MAX_STOCK_CAPACITY} Adet (%{capacityPercent} Doluluk)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isWarehouseFull
                ? 'bg-rose-500'
                : totalStockCount >= 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>
        {isWarehouseFull && (
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Depo Kapasitesi Dolu (100/100)!</strong> Yeni ürün üretimi duraklatıldı. Lütfen Alıcı Şirketler veya Piyasa sayfalarından satış yapınız.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
