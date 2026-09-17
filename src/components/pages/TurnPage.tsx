import React from 'react';
import {
  RotateCw,
  Coins,
  TrendingUp,
  Factory,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  History,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export function TurnPage() {
  const {
    turn,
    advanceTurn,
    playerTotalCash,
    activeEvent,
    turnSummaries,
    currencySymbol,
    companies,
    inventories,
    marketItems,
    buyerCompanies,
  } = useGame();

  // Calculate current turn metrics across all companies
  const totalProducedAcrossEmpire = Object.values(inventories).reduce((acc, inv) => {
    const sum = Object.values(inv.totalProduced || {}).reduce((s, n) => s + n, 0);
    return acc + sum;
  }, 0);

  const totalSoldAcrossEmpire = Object.values(inventories).reduce((acc, inv) => {
    const sum = Object.values(inv.totalSold || {}).reduce((s, n) => s + n, 0);
    return acc + sum;
  }, 0);

  const latestSummary = turnSummaries[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Primary Turn Advancement Center */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              STRATEJİ TUR DÖNGÜSÜ &bull; SEZON 1
            </div>
            <div className="flex items-baseline gap-4">
              <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white">
                TUR #{turn}
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-slate-400">
                Aktif Oyun Tesisleri Çalışıyor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Turu ilerlettiğinizde; fabrikalarda 1 parti tam üretim tamamlanır, piyasa arz-talep katsayıları yeniden hesaplanır, yeni makroekonomik olaylar gerçekleşir ve holding kasası güncellenir.
            </p>
          </div>

          {/* Big Interactive "Turu İlerlet" Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={advanceTurn}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3"
            >
              <RotateCw className="w-5 h-5 animate-spin-slow" />
              <span>Turu İlerlet (Tur #{turn + 1})</span>
            </button>
          </div>
        </div>

        {/* Turn Quick Metrics Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Oyuncu Toplam Parası</span>
            <span className="text-lg font-black text-amber-400 font-mono">
              {currencySymbol}{playerTotalCash.toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Toplam Üretim</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {totalProducedAcrossEmpire} Adet
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Toplam Satış</span>
            <span className="text-lg font-black text-sky-400 font-mono">
              {totalSoldAcrossEmpire} Adet
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Piyasa Emtia Sayısı</span>
            <span className="text-lg font-black text-white font-mono">
              {marketItems.length} Kalem
            </span>
          </div>
        </div>
      </div>

      {/* 2. Active Turn Results & Events Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Macroeconomic Event Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                MEVCUT TUR OLAYI & KART ETKİSİ
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Piyasaya Yansıdı
              </span>
            </div>

            <div className="flex items-start gap-4 my-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {activeEvent.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Etkilenen Emtia: <strong className="text-slate-800 font-bold uppercase">{activeEvent.affectedCommodity || 'Genel Piyasa'}</strong></span>
            <span>Çarpan: <strong className="text-emerald-700 font-bold">x{activeEvent.priceDeltaMultiplier || 1}</strong></span>
          </div>
        </div>

        {/* Latest Turn Financial & Production Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                SON TUR İŞLEM VE ÜRETİM SONUÇLARI
              </span>
              <span className="font-mono text-xs text-slate-400">
                {latestSummary ? latestSummary.timestamp : 'İlk Tur'}
              </span>
            </div>

            {latestSummary ? (
              <div className="space-y-3 my-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
                  <span className="text-slate-600">Tur İçi Üretilen Ürün:</span>
                  <strong className="text-slate-900 font-bold">+{latestSummary.producedCount} Adet</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
                  <span className="text-slate-600">Kasa Başlangıcı / Bitişi:</span>
                  <span className="text-slate-800">
                    {currencySymbol}{latestSummary.cashBefore} &rarr; <strong className="text-slate-900 font-black">{currencySymbol}{latestSummary.cashAfter}</strong>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono">
                  <span className="text-emerald-800 font-bold">Net Nakit Akışı Değişimi:</span>
                  <strong className={`font-black ${latestSummary.cashDelta >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {latestSummary.cashDelta >= 0 ? `+${currencySymbol}${latestSummary.cashDelta}` : `-${currencySymbol}${Math.abs(latestSummary.cashDelta)}`}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs">
                İlk turdasınız. &ldquo;Turu İlerlet&rdquo; butonuna basarak ilk tur sonuçlarını hesaplayabilirsiniz.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aktif Tesisler: Tüm şirket hatları</span>
            <span className="font-bold text-emerald-700">✓ Sistem Senkronize</span>
          </div>
        </div>
      </div>

      {/* 3. Market Changes Table from Last Turn (Piyasa Değişimleri) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Piyasa Değişimleri (Eski Fiyat vs Yeni Fiyat)
            </h3>
            <p className="text-xs text-slate-500">
              Bu turdaki talep ve olaylar doğrultusunda emtia fiyatlarındaki güncel hareketler
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-700">
            {marketItems.length} Kalem
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketItems.map((item) => {
            const isUp = item.priceChange > 0;
            const isDown = item.priceChange < 0;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900">{item.name}</span>
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

                <div className="flex items-baseline justify-between font-mono my-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Eski Fiyat</span>
                    <span className="text-sm font-bold text-slate-500 line-through">
                      {currencySymbol}{item.previousPrice}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-bold">Yeni Fiyat</span>
                    <span className="text-2xl font-black text-slate-900">
                      {currencySymbol}{item.currentPrice}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 flex justify-between">
                  <span>Talep: <strong className="text-slate-800">{item.demand}</strong></span>
                  <span>Arz: <strong className="text-slate-800">{item.supply}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3.5. Buyer Companies Stock Prices & Procurement Behavior */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Alıcı Şirketlerin Borsa Fiyatları & Otomatik Tedarik Durumu
            </h3>
            <p className="text-xs text-slate-500">
              Borsa kuralı: Hissesi yükselen şirketler (↗) fabrikalarınızdan malzeme satın alır, hissesi düşenler (↘) tasarruf kararıyla alımı dondurur.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
            {buyerCompanies.length} Alıcı Şirket
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {buyerCompanies.map((b) => {
            const isUp = (b.priceChange || 0) >= 0;
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  b.isProcurementActive
                    ? 'border-emerald-200/90 bg-emerald-50/40'
                    : 'border-rose-200/90 bg-rose-50/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-slate-900">{b.code}</span>
                  <span
                    className={`inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isUp ? '+' : ''}{b.priceChangePercent ? b.priceChangePercent.toFixed(1) : '0.0'}%
                  </span>
                </div>

                <div className="my-2.5">
                  <span className="text-[10px] text-slate-400 font-mono block">Canlı Borsa Fiyatı</span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    ${b.stockPrice ? b.stockPrice.toFixed(2) : '100.00'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    Önceki: ${b.previousStockPrice ? b.previousStockPrice.toFixed(2) : '100.00'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[10px] font-bold">
                  {b.isProcurementActive ? (
                    <span className="text-emerald-700 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      ALIM AÇIK (↗)
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      ALIM DURDURULDU (↘)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Past Turns History Log (Turların Geçmişi) */}
      {turnSummaries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="text-base font-black text-slate-900">
              Tur Geçmişi ve Arşiv ({turnSummaries.length} Tur Kaydedildi)
            </h3>
          </div>

          <div className="space-y-3">
            {turnSummaries.map((summary) => (
              <div
                key={summary.turnNumber}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-mono font-black flex items-center justify-center text-sm shrink-0">
                    #{summary.turnNumber}
                  </span>
                  <div>
                    <strong className="text-slate-900 font-bold block">
                      Olay: {summary.event.title}
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      {summary.event.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-[11px] text-slate-600">
                  <span>Üretim: <strong className="text-slate-900 font-bold">+{summary.producedCount}</strong></span>
                  <span>Kasa: <strong className="text-slate-900 font-bold">{currencySymbol}{summary.cashAfter}</strong></span>
                  <span className="text-slate-400">{summary.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
