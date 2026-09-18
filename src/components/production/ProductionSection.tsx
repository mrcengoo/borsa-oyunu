import { Factory, Play, Pause, Clock, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { CompanyConfig, CompanyInventoryState, RawMaterialProduct, ProductLineStatus, MAX_STOCK_CAPACITY } from '../../types/production';
import { ProductIcon } from './ProductIcon';

interface ProductionSectionProps {
  company: CompanyConfig;
  inventoryState: CompanyInventoryState;
  onToggleLineAuto: (productId: string) => void;
  onRestartLine: (product: RawMaterialProduct) => void;
  currency: 'USD' | 'TRY';
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatDurationText(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} dk${secs > 0 ? ` ${secs} sn` : ''}`;
}

export function ProductionSection({
  company,
  inventoryState,
  onToggleLineAuto,
  onRestartLine,
  currency,
}: ProductionSectionProps) {
  const currencySymbol = currency === 'TRY' ? '₺' : '$';
  const totalStock = Object.values(inventoryState.stock).reduce((a, b) => a + b, 0);
  const isWarehouseFull = totalStock >= MAX_STOCK_CAPACITY;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                Gerçek Zamanlı Üretim Hatları & Geri Sayım Sayaçları
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                3 - 9 Dakika Döngü
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Her ürünün üretim süresi 3 ila 9 dakika arasındadır. Geri sayım tamamlandığında ürün depoya eklenir.
            </p>
          </div>
        </div>

        {isWarehouseFull && (
          <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
            ⚠️ Depo Dolu (100/100) &bull; Üretim Beklemede
          </span>
        )}
      </div>

      {/* 3 Real-time Production Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          const isBlockedByCapacity = isWarehouseFull && line.isAutoProducing;

          return (
            <div
              key={prod.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all bg-white ${
                line.isActive
                  ? 'border-slate-200 hover:border-amber-300 shadow-xs'
                  : 'border-slate-200 bg-slate-50/70 opacity-85'
              }`}
            >
              <div>
                {/* Card Header: Product Icon, Name & Cycle Duration */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                      <ProductIcon type={prod.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        {prod.category} &bull; {prod.unit}
                      </span>
                    </div>
                  </div>

                  {/* Cycle duration pill */}
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                    {formatDurationText(prod.durationSeconds)}
                  </span>
                </div>

                {/* Real-time Visual Countdown & Progress Bar */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 my-2.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Kalan Süre:
                    </span>
                    <strong className="text-base font-black text-slate-950">
                      {formatCountdown(line.remainingSeconds)}
                    </strong>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isBlockedByCapacity
                          ? 'bg-rose-500'
                          : progressPct >= 95
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>İlerleme: %{progressPct}</span>
                    <span>Üretilen: {inventoryState.totalProduced?.[prod.id] || 0} {prod.unit}</span>
                  </div>
                </div>

                {/* Production Cost & Capacity Warning */}
                <div className="space-y-1 text-xs font-mono mb-3 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Birim Maliyet:</span>
                    <strong className="text-slate-900">-{currencySymbol}{prod.productionCost}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Satış Fiyatı:</span>
                    <strong className="text-emerald-700">+{currencySymbol}{prod.baseSellPrice}</strong>
                  </div>
                </div>

                {isBlockedByCapacity && (
                  <div className="mb-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Depo dolu (100/100). Üretim depoya giremiyor!</span>
                  </div>
                )}

                {isLowFunds && (
                  <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Maliyet için fabrika kasası yetersiz!</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onToggleLineAuto(prod.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    line.isAutoProducing
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {line.isAutoProducing ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Hattı Durdur</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Hattı Başlat</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onRestartLine(prod)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                  title="Döngüyü sıfırla ve yeniden başlat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
