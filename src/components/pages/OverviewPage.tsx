import React from 'react';
import {
  Coins,
  RotateCw,
  Building2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  ChevronRight,
  Factory,
  Sparkles,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProductIcon } from '../production/ProductIcon';

export function OverviewPage() {
  const {
    playerTotalCash,
    turn,
    advanceTurn,
    companies,
    inventories,
    marketItems,
    recentTransactions,
    navigateToCompany,
    setActiveTab,
    currencySymbol,
    activeEvent,
  } = useGame();

  // Calculate total stock items in empire
  const totalStockCount = (Object.values(inventories) as any[]).reduce((acc: number, inv) => {
    const sum = (Object.values(inv.stock || {}) as number[]).reduce((s: number, count: number) => s + count, 0);
    return acc + sum;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Executive Banner: Player Total Money & Current Turn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Player Cash Card */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-6 text-slate-950 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950/80">
              OYUNCUNUN TOPLAM PARASI
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950/15 flex items-center justify-center">
              <Coins className="w-5 h-5 text-slate-950" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
              {currencySymbol}{playerTotalCash.toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-950/80 pt-2 border-t border-amber-400/50">
            <span>Bağlı Şirket Sayısı: {companies.length} Şirket</span>
            <span className="font-mono font-bold">Kasa Güvencesi %100</span>
          </div>
        </div>

        {/* Current Turn & Fast Action Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              MEVCUT TUR GÖSTERGESİ
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
              Aktif Tur
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900 font-mono">
              TUR #{turn}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Emtia döngüsü aktif
            </span>
          </div>
          <button
            type="button"
            onClick={advanceTurn}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer shadow-xs"
          >
            <RotateCw className="w-4 h-4 text-amber-400" />
            <span>Turu İlerlet (Yeni Üretim & Piyasa Dalgalanması)</span>
          </button>
        </div>

        {/* Empire Summary & Active Event Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              GÜNCEL MAKRO OLAY
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="my-2">
            <h4 className="text-sm font-black text-slate-900 line-clamp-1">
              {activeEvent.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {activeEvent.description}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Toplam Depo Stoku:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {totalStockCount} Adet Ürün
            </span>
          </div>
        </div>
      </div>

      {/* 2. Market Summary Section (Piyasa Özeti) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Piyasa Özeti (Emtia Fiyatları & Talep)
              </h3>
              <p className="text-xs text-slate-500">
                Piyasadaki ham maddelerin güncel birim fiyatları ve talep koşulları
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            <span>Tüm Piyasayı İncele</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketItems.map((item) => {
            const isUp = item.priceChange > 0;
            const isDown = item.priceChange < 0;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isUp
                        ? 'bg-emerald-100 text-emerald-800'
                        : isDown
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isUp && <ArrowUpRight className="w-3 h-3" />}
                    {isDown && <ArrowDownRight className="w-3 h-3" />}
                    {item.priceChange > 0 ? `+${item.priceChange}` : item.priceChange}
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-1">
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {currencySymbol}{item.currentPrice}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    / 1 {item.unit}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Talep: <strong className="text-slate-800 font-bold">{item.demand}</strong></span>
                  <span>Arz: <strong className="text-slate-800 font-bold">{item.supply}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Player Companies Section (Oyuncunun Şirketleri) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Oyuncunun Şirketleri ({companies.length} Şirket)
              </h3>
              <p className="text-xs text-slate-500">
                Holding bünyesindeki üretim tesisleri, CEO yetenekleri ve kasa durumları
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('companies')}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            <span>Şirketler Listesi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((comp) => {
            const inv = inventories[comp.id] || {
              cash: comp.initialCash,
              stock: {},
              totalRevenue: 0,
              totalExpenses: 0,
            };
            const companyStockSum = (Object.values(inv.stock || {}) as number[]).reduce((s: number, n: number) => s + n, 0);

            return (
              <div
                key={comp.id}
                onClick={() => navigateToCompany(comp.id)}
                className="group relative p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-black bg-slate-950 text-amber-400">
                      {comp.code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {comp.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-950 group-hover:text-amber-700 transition-colors">
                    {comp.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {comp.industry}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Kasa:</span>
                      <strong className="font-mono font-black text-slate-900">
                        {currencySymbol}{inv.cash.toLocaleString('tr-TR')}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Stok:</span>
                      <strong className="font-mono font-bold text-emerald-700">
                        {companyStockSum} Adet
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">CEO:</span>
                      <strong className="text-slate-800 text-[10px] truncate max-w-[120px]">
                        {comp.ceo.name}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
                  <span>Üretimi Yönet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Hub: CEO Management & Corporate Buyer Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CEO Management Hub Card */}
        <div
          onClick={() => setActiveTab('ceos')}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white border border-indigo-800/60 shadow-md hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <Users className="w-3.5 h-3.5" />
                YÖNETİCİ KADROSU
              </span>
              <span className="text-xs font-mono text-indigo-300">6 CEO Kartı</span>
            </div>

            <h4 className="text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              CEO Kartları & Yönetici Atama
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Her CEO kartında 3 Gelir Bonusu ve 3 Gider Tasarrufu bulunur. Fabrikalara atama yaparak kâr marjlarını maksimize edin.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
            <span>CEO Kartlarını İncele & Ata</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Corporate Buyers Hub Card */}
        <div
          onClick={() => setActiveTab('buyers')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-800/60 shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShoppingCart className="w-3.5 h-3.5" />
                KURUMSAL MÜŞTERİLER
              </span>
              <span className="text-xs font-mono text-emerald-300">PWR, NVDA, CNQ...</span>
            </div>

            <h4 className="text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              Alıcı Şirket Kartları & Sözleşmeler
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Ürettiğiniz 12 ürünü yüksek tekliflerle kurumsal devlere satın. Sözleşme kotalarını tamamlayarak büyük nakit primler kazanın.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
            <span>Alıcı Şirketlere Satış Yap</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions Section (Son Gerçekleşen İşlemler) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Son Gerçekleşen İşlemler
              </h3>
              <p className="text-xs text-slate-500">
                Fabrikalar, satışlar ve tur olaylarına ait kronolojik işlem kütüğü
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {recentTransactions.length} Kayıt
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
          {recentTransactions.slice(0, 10).map((log) => (
            <div
              key={log.id}
              className="py-3 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                  {log.timestamp}
                </span>
                <span className="text-slate-800 font-medium leading-relaxed">
                  {log.message}
                </span>
              </div>
              {log.amountChange && (
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                  +{currencySymbol}{log.amountChange}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
