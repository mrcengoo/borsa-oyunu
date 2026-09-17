import { Play, Pause, RotateCcw, Clock, Building2, Coins, TrendingUp, PackageCheck, FastForward, Activity } from 'lucide-react';
import { CompanyConfig, CompanyInventoryState } from '../../types/production';

interface CompanyOverviewCardProps {
  company: CompanyConfig;
  inventoryState: CompanyInventoryState;
  isFactoryRunning: boolean;
  onToggleFactory: () => void;
  onFastForward: (seconds: number) => void;
  onResetGame: () => void;
  currency: 'USD' | 'TRY';
}

export function CompanyOverviewCard({
  company,
  inventoryState,
  isFactoryRunning,
  onToggleFactory,
  onFastForward,
  onResetGame,
  currency,
}: CompanyOverviewCardProps) {
  const currencySymbol = currency === 'TRY' ? '₺' : '$';
  const totalStockCount = Object.values(inventoryState.stock).reduce((a, b) => a + b, 0);
  const activeLinesCount = Object.values(inventoryState.lines).filter(
    (line) => line.isActive
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Company Identity */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md border-2 border-white shrink-0 font-black text-xl tracking-wider">
            {company.code}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {company.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                {company.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span className={`w-2 h-2 rounded-full ${isFactoryRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {isFactoryRunning ? 'Gerçek Zamanlı Otomatik Üretim' : 'Üretim Duraklatıldı'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {company.tagline}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
              <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Çimento: 60s &bull; Petrol: 60s &bull; Çelik: 120s &bull; Bakır: 180s
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Real-Time Controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* ARZ Cash Balance Box */}
          <div className="px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xs border border-slate-800 min-w-[170px]">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {company.code} Şirket Parası
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-amber-300">
              {currencySymbol}
              {inventoryState.cash.toLocaleString('tr-TR')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
              <span>Gelir: +{currencySymbol}{inventoryState.totalRevenue}</span>
              <span>Gider: -{currencySymbol}{inventoryState.totalExpenses}</span>
            </div>
          </div>

          {/* Control Actions */}
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center gap-2 shadow-2xs">
            {/* Pause / Resume Factory Button */}
            <button
              type="button"
              onClick={onToggleFactory}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                isFactoryRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={isFactoryRunning ? 'Tüm zamanlayıcıları duraklat' : 'Otomatik üretimi başlat'}
            >
              {isFactoryRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Üretime Devam Et</span>
                </>
              )}
            </button>

            {/* Fast Forward 15s for quick testing */}
            <button
              type="button"
              onClick={() => onFastForward(15)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-amber-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Zamanı 15 saniye ileri sar (hızlı test)"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-600" />
              <span>+15s Sar</span>
            </button>

            {/* Reset Simulation Button */}
            <button
              type="button"
              onClick={onResetGame}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              title="Fabrika Simülasyonunu Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini Stat Ribbon */}
      <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Toplam Stokta</span>
            <strong className="text-slate-900 text-sm font-bold font-mono">
              {totalStockCount} Adet
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Çalışan Üretim Hattı</span>
            <strong className="text-slate-900 text-sm font-bold font-mono">
              {activeLinesCount} / 4 Hat Aktif
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Toplam Satış Geliri</span>
            <strong className="text-slate-900 text-sm font-bold font-mono">
              +{currencySymbol}{inventoryState.totalRevenue}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Net Kâr / Kasa</span>
            <strong className="text-slate-900 text-sm font-bold font-mono text-emerald-600">
              +{currencySymbol}{inventoryState.totalRevenue - inventoryState.totalExpenses}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
