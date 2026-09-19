import React from 'react';
import {
  Factory,
  ChevronRight,
  Package,
  UserCheck,
  TrendingUp,
  Clock,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CompanyConfig } from '../../types/production';
import { ProductIcon } from '../production/ProductIcon';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} dk${s > 0 ? ` ${s} sn` : ''}`;
}

export function CompaniesPage() {
  const {
    companies,
    inventories,
    navigateToCompany,
    currencySymbol,
    getProductPriceBreakdown,
    getCompanyStock,
  } = useGame();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - Sleek & Modern */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 mb-1.5">
            <Factory className="w-3.5 h-3.5 text-amber-600" />
            <span>5 ÜRETİM ŞİRKETİ &bull; STRATEJİK SANAYİ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Holding Üretim Şirketleri & Bağımsız Kasalar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Her şirketin <strong>100 Adetlik Depo Kapasitesi</strong> bulunur. Depo dolduğunda üretim durur ve taşan partilerden ceza kesilir. Üretim süreleri 3 ila 9 dakika arasında akar.
          </p>
        </div>
      </div>

      {/* 5 Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {companies.map((company: CompanyConfig) => {
          const inv = inventories[company.id] || {
            cash: company.initialCash,
            stock: {},
            totalRevenue: 0,
            totalExpenses: 0,
          };
          const totalStock = (Object.values(inv.stock || {}) as number[]).reduce((s: number, c: number) => s + c, 0);
          const capacityPct = Math.min(100, Math.round((totalStock / 100) * 100));
          const stockInfo = getCompanyStock(company.id);

          return (
            <div
              key={company.id}
              className="rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-black font-mono bg-slate-950 text-amber-400">
                    {company.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {company.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-950 leading-tight">
                  {company.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {company.industry}
                </p>

                {/* Stock Price & Cash Banner */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Hisse Fiyatı
                    </span>
                    <span className="text-base font-black font-mono text-amber-300">
                      {currencySymbol}{stockInfo.stockPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[10px]">
                    <span className="text-slate-400 block">
                      Fabrika Kasası
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {currencySymbol}{inv.cash.toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>

                {/* Warehouse Capacity Meter (100 Limit) */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Depo Kapasitesi:</span>
                    <strong className={totalStock >= 100 ? 'text-rose-600 font-black' : 'text-slate-800'}>
                      {totalStock} / 100 Adet (%{capacityPct})
                    </strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        totalStock >= 100
                          ? 'bg-rose-500'
                          : totalStock >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                  {totalStock >= 100 && (
                    <span className="text-[10px] text-rose-600 font-bold block">
                      ⚠️ Depo dolu! Üretim duraklatıldı. Satış yapınız.
                    </span>
                  )}
                </div>
              </div>

              {/* Products List with Durations */}
              <div className="p-4 space-y-2 flex-1 bg-white">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                  Üretilen Ürünler & Süreler:
                </span>

                <div className="space-y-1.5">
                  {company.products.map((prod) => {
                    const stockCount = inv.stock[prod.id] || 0;
                    const { finalPrice } = getProductPriceBreakdown(company, prod);

                    return (
                      <div
                        key={prod.id}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                            <ProductIcon type={prod.icon} className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <strong className="text-slate-900 block font-bold text-xs">
                              {prod.name}
                            </strong>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDuration(prod.durationSeconds)} &bull; {currencySymbol}{finalPrice}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 shrink-0">
                          {stockCount} {prod.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CEO summary */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{company.ceo.name}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Kasa: {currencySymbol}{inv.cash.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigateToCompany(company.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Fabrikayı Yönet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
