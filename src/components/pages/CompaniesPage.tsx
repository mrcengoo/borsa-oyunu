import React from 'react';
import {
  Building2,
  ChevronRight,
  Sparkles,
  Package,
  UserCheck,
  Factory,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Coins,
  ShieldCheck,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CompanyConfig } from '../../types/production';
import { ProductIcon } from '../production/ProductIcon';

export function CompaniesPage() {
  const {
    companies,
    inventories,
    navigateToCompany,
    setActiveTab,
    currencySymbol,
    getProductPriceBreakdown,
  } = useGame();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-amber-100 text-amber-900 mb-2">
            <Factory className="w-3.5 h-3.5 text-amber-700" />
            ÜRETİM HOLDİNGİ &bull; 4 FABRİKA &bull; 12 STRATEJİK ÜRÜN
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            4 Üretim Şirketi & 3&apos;er Ürün Portföyü
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Holding bünyesinde her biri 3 kritik sanayi ürünü üreten <strong>4 üretim şirketi</strong> yer alır. Her şirketin başında <strong>3 Gelir</strong> ve <strong>3 Gider Bonusu</strong> sağlayan bir CEO görev yapar. Üretilen malları kurumsal alıcılara (PWR, NVDA, CNQ vb.) satabilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('ceos')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            CEO Kartları & Atama
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('buyers')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
            Alıcı Şirketler (NVDA, PWR...)
          </button>
        </div>
      </div>

      {/* 4 Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {companies.map((company: CompanyConfig, index: number) => {
          const inv = inventories[company.id] || {
            cash: company.initialCash,
            stock: {},
            totalRevenue: 0,
            totalExpenses: 0,
          };
          const totalStock = (Object.values(inv.stock || {}) as number[]).reduce((s: number, c: number) => s + c, 0);

          // Get CEO skills separated
          const incomeSkills = company.ceo.skills.filter((s) => s.type === 'income');
          const expenseSkills = company.ceo.skills.filter((s) => s.type === 'expense');

          const isFirstCompany = index === 0;

          return (
            <div
              key={company.id}
              className="rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-sm"
            >
              {/* Card Header with Badges */}
              <div
                className={`p-5 bg-gradient-to-br ${
                  company.id === 'arz'
                    ? 'from-amber-900/15 via-orange-800/10 to-transparent'
                    : company.id === 'mtrx'
                    ? 'from-sky-900/15 via-blue-800/10 to-transparent'
                    : company.id === 'biox'
                    ? 'from-emerald-900/15 via-teal-800/10 to-transparent'
                    : 'from-violet-900/15 via-purple-800/10 to-transparent'
                } border-b border-slate-100`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-slate-950 text-amber-400 shadow-xs">
                    {company.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isFirstCompany && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                        İlk Şirket
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-600 bg-white border border-slate-200">
                      {company.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-950 group-hover:text-amber-700 transition-colors leading-tight">
                  {company.name}
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  {company.industry}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">
                  &ldquo;{company.tagline}&rdquo;
                </p>

                {/* Cash & Total Stock Badges */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Kasa</span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {currencySymbol}{inv.cash.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Depo Stoğu</span>
                    <span className="font-mono font-black text-emerald-700 text-sm">
                      {totalStock} Adet
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body: 3 Products & CEO Card Preview */}
              <div className="p-5 space-y-4 flex-1">
                {/* 3 Üretim Ürünü Listesi */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-amber-600" />
                      3 Üretim Ürünü:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      3/3 Aktif
                    </span>
                  </div>

                  <div className="space-y-2">
                    {company.products.map((prod) => {
                      const stockCount = inv.stock[prod.id] || 0;
                      const { baseCost, finalPrice } = getProductPriceBreakdown(company, prod);

                      return (
                        <div
                          key={prod.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                              <ProductIcon type={prod.icon} className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-slate-900 block font-bold text-xs">
                                {prod.name}
                              </strong>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Maliyet: {currencySymbol}{baseCost} &bull; Satış: {currencySymbol}{finalPrice}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 shadow-2xs block">
                              {stockCount} {prod.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned CEO Section (3 Gelir + 3 Gider Bonusu) */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Atanmış CEO
                        </span>
                        <strong className="text-xs font-black text-slate-900 block">
                          {company.ceo.name}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('ceos');
                      }}
                      className="px-2 py-1 rounded text-[10px] font-mono font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
                    >
                      CEO Değiştir &rarr;
                    </button>
                  </div>

                  {/* Skills Mini Summary */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                      <div className="flex items-center gap-1 font-bold mb-0.5">
                        <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        <span>3 Gelir Bonusu:</span>
                      </div>
                      <span className="font-mono font-black text-[11px] block">
                        +{currencySymbol}{incomeSkills.reduce((s, k) => s + k.value, 0)} Toplam
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-900">
                      <div className="flex items-center gap-1 font-bold mb-0.5">
                        <TrendingDown className="w-3 h-3 text-rose-600" />
                        <span>3 Gider Bonusu:</span>
                      </div>
                      <span className="font-mono font-black text-[11px] block">
                        -{currencySymbol}{expenseSkills.reduce((s, k) => s + Math.abs(k.value), 0)} Toplam
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Navigation Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigateToCompany(company.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Fabrikayı Yönet & Üretime Git</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
