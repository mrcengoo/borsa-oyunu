import { Factory, Play, Pause, Clock, Sparkles, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { CompanyConfig, CompanyInventoryState, RawMaterialProduct, ProductLineStatus } from '../../types/production';
import { ProductIcon } from './ProductIcon';

interface ProductionSectionProps {
  company: CompanyConfig;
  inventoryState: CompanyInventoryState;
  onToggleLineAuto: (productId: string) => void;
  onRestartLine: (product: RawMaterialProduct) => void;
  currency: 'USD' | 'TRY';
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sn`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} dk ${secs > 0 ? `${secs} sn` : ''}`;
}

export function ProductionSection({
  company,
  inventoryState,
  onToggleLineAuto,
  onRestartLine,
  currency,
}: ProductionSectionProps) {
  const currencySymbol = currency === 'TRY' ? '₺' : '$';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Gerçek Zamanlı Otomatik Üretim Hatları
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300">
                Saniye Sayacı Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Çimento (60s), Petrol (60s), Çelik (120s) ve Bakır (180s) otomatik olarak üretilip stoğa eklenir.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
          <span>ARZ Kasası:</span>
          <strong className="text-slate-950 font-bold">
            {currencySymbol}{inventoryState.cash}
          </strong>
        </div>
      </div>

      {/* 4 Real-time Production Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {company.products.map((prod) => {
          const line: ProductLineStatus = inventoryState.lines[prod.id] || {
            productId: prod.id,
            productName: prod.name,
            totalDurationSeconds: prod.durationSeconds,
            remainingSeconds: prod.durationSeconds,
            isAutoProducing: true,
            isActive: true,
            completedBatches: 0,
          };

          const elapsedSeconds = line.totalDurationSeconds - line.remainingSeconds;
          const progressPct = Math.min(
            100,
            Math.max(0, Math.round((elapsedSeconds / line.totalDurationSeconds) * 100))
          );
          const canAfford = inventoryState.cash >= prod.productionCost;
          const isLowFunds = !canAfford && line.isAutoProducing;

          return (
            <div
              key={prod.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all relative overflow-hidden ${
                line.isActive
                  ? 'bg-gradient-to-b from-white to-slate-50/60 border-slate-200 hover:border-amber-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div>
                {/* Header: Icon, Category & Auto Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <ProductIcon type={prod.icon} size="md" />
                  </div>

                  {/* Auto Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => onToggleLineAuto(prod.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      line.isAutoProducing
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                    title="Otomatik üretimi aç / kapat"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        line.isAutoProducing && line.isActive
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span>{line.isAutoProducing ? 'Oto Üretim: AÇIK' : 'Oto Üretim: KAPALI'}</span>
                  </button>
                </div>

                {/* Title & Category */}
                <h4 className="text-base font-bold text-slate-900 mb-0.5 flex items-center justify-between">
                  <span>{prod.name}</span>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {prod.durationSeconds} sn
                  </span>
                </h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">
                  {prod.description}
                </p>

                {/* Real-time Visual Countdown & Progress Bar */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs mb-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Kalan Süre:
                    </span>
                    <strong className="text-sm font-black text-slate-900">
                      {formatDuration(line.remainingSeconds)}
                    </strong>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 relative ${
                        progressPct >= 95
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-amber-500 to-emerald-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:12px_12px] opacity-60" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>İlerleme: %{progressPct}</span>
                    <span>Üretilen: {inventoryState.totalProduced[prod.id] || 0} {prod.unit}</span>
                  </div>
                </div>

                {/* Costs & Batch Info */}
                <div className="space-y-1 text-xs font-mono mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Maliyet:</span>
                    <strong className="text-slate-900 font-bold">
                      -{currencySymbol}{prod.productionCost}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Döngü Süresi:</span>
                    <span className="font-bold text-slate-800">
                      Tam {prod.durationSeconds} saniye
                    </span>
                  </div>
                </div>

                {/* Low funds warning if applicable */}
                {isLowFunds && (
                  <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Döngü için bakiye yetersiz! Ürün satınız.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleLineAuto(prod.id)}
                  className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    line.isAutoProducing
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {line.isAutoProducing ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Oto Durdur</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Oto Başlat</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onRestartLine(prod)}
                  className="py-2 px-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Sayacı sıfırlayıp anında döngüyü yeniden başlat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Yeniden</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
