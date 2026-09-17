import { History, Play, ShoppingCart, CheckCircle2, Coins, Clock } from 'lucide-react';
import { ProductionLogEntry } from '../../types/production';

interface ProductionLogsCardProps {
  logs: ProductionLogEntry[];
  currency: 'USD' | 'TRY';
}

export function ProductionLogsCard({ logs, currency }: ProductionLogsCardProps) {
  const currencySymbol = currency === 'TRY' ? '₺' : '$';

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h4 className="text-sm font-bold text-slate-900">
            Fabrika & Finans İşlem Geçmişi ({logs.length})
          </h4>
        </div>
        <span className="text-xs text-slate-400 font-mono">Son işlemler</span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
        {logs.map((log) => {
          const isIncome = log.type === 'sell';
          const isCost = log.type === 'produce_start';
          const isComplete = log.type === 'produce_complete';

          return (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                isIncome
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                  : isCost
                  ? 'bg-amber-50/40 border-amber-200/70 text-amber-950'
                  : isComplete
                  ? 'bg-blue-50/50 border-blue-200/70 text-blue-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {log.timestamp}
                </span>
                <span className="truncate">{log.message}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                {log.amountChange !== undefined && (
                  <span
                    className={`font-bold ${
                      log.amountChange > 0
                        ? 'text-emerald-700'
                        : log.amountChange < 0
                        ? 'text-rose-700'
                        : 'text-slate-600'
                    }`}
                  >
                    {log.amountChange > 0 ? '+' : ''}
                    {currencySymbol}
                    {Math.abs(log.amountChange)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
