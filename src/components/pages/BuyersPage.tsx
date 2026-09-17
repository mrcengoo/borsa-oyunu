import React from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Package,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Zap,
  DollarSign,
  Activity,
  PauseCircle,
  PlayCircle,
  Building2,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BuyerCompany } from '../../types/production';
import { ProductIcon } from '../production/ProductIcon';

export function BuyersPage() {
  const {
    buyerCompanies,
    companies,
    inventories,
    sellToBuyer,
    sellAllToBuyer,
    updateBuyerPricesAndProcure,
    currencySymbol,
    navigateToCompany,
  } = useGame();

  // Helper to calculate total stock available in player's factories for a given product
  const getProductTotalStock = (productId: string) => {
    let total = 0;
    companies.forEach((comp) => {
      const s = inventories[comp.id]?.stock[productId] || 0;
      total += s;
    });
    return total;
  };

  // Helper to find which company produces this product
  const getProducerCompany = (productId: string) => {
    return companies.find((c) => c.products.some((p) => p.id === productId));
  };

  // Metrics across buyers
  const activeProcurementBuyers = buyerCompanies.filter((b) => b.isProcurementActive);
  const haltedProcurementBuyers = buyerCompanies.filter((b) => !b.isProcurementActive);
  const totalCorporateProcuredValue = buyerCompanies.reduce(
    (acc, b) => acc + (b.totalPurchasedValue || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 mb-2">
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
            KURUMSAL MÜŞTERİLER &bull; {buyerCompanies.length} ALICI ŞİRKET
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Alıcı Şirket Kartları & Canlı Borsa Alım Döngüsü
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Küresel devler (NVDA, PWR, CNQ, LLY, MSFT) fabrikalarınızdan endüstriyel malzeme tedarik eder. Borsa hisse fiyatları yükseldiğinde malzeme alımı yaparlar; hisse fiyatları düştüğünde ise tasarruf politikası gereği alımı durdururlar.
          </p>
        </div>

        {/* Live trigger button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => updateBuyerPricesAndProcure()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs font-mono shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2"
            title="Borsa fiyatlarını günceller ve yükselen şirketlerin malzeme alımını çalıştırır"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Piyasa Fiyatlarını Güncelle & Alım Döngüsünü Tetikle</span>
          </button>
        </div>
      </div>

      {/* Procurement Logic Rule & Status Strip */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-wide text-indigo-200 uppercase font-mono">
                Borsa & Tedarik Kuralı:
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                Alıcı şirketlerin <strong>gerçek borsa fiyatları yükselirse (↗)</strong> fabrikalarınızın depolarındaki malzemeleri satın alır ve holdinginize nakit öder. <strong>Fiyat aşağı düşerse (↘)</strong> şirketler alımı derhal durdurur!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase font-mono">
                Alım Yapanlar (Fiyat ↗)
              </span>
              <span className="text-lg font-mono font-black text-emerald-300">
                {activeProcurementBuyers.length} Şirket
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-[10px] text-rose-400 font-bold block uppercase font-mono">
                Alımı Durduranlar (Fiyat ↘)
              </span>
              <span className="text-lg font-mono font-black text-rose-300">
                {haltedProcurementBuyers.length} Şirket
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-[10px] text-amber-400 font-bold block uppercase font-mono">
                Toplam Alım Hacmi
              </span>
              <span className="text-lg font-mono font-black text-amber-300">
                {currencySymbol}{totalCorporateProcuredValue.toLocaleString('tr-TR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Buyer Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {buyerCompanies.map((buyer: BuyerCompany) => {
          const totalContractTarget = buyer.demands.reduce((s, d) => s + d.targetContractQty, 0);
          const totalFulfilled = buyer.demands.reduce((s, d) => s + d.fulfilledQty, 0);
          const completionPct = Math.min(100, Math.round((totalFulfilled / totalContractTarget) * 100));
          const isUp = (buyer.priceChange || 0) >= 0;

          return (
            <div
              key={buyer.id}
              className={`rounded-2xl border-2 bg-white transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${
                buyer.contractCompleted
                  ? 'border-emerald-300 ring-2 ring-emerald-100'
                  : buyer.isProcurementActive
                  ? 'border-slate-200 hover:border-indigo-300'
                  : 'border-rose-200/90 hover:border-rose-300'
              }`}
            >
              {/* Card Top Section */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Company & Rating Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-sm text-white shadow-md shrink-0"
                      style={{ backgroundColor: buyer.logoBg }}
                    >
                      {buyer.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-950">
                          {buyer.code}
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {buyer.rating} Kredi Notu
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {buyer.ticker || buyer.code}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        {buyer.name}
                      </p>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {buyer.industry}
                      </span>
                    </div>
                  </div>

                  {/* Contract status */}
                  {buyer.contractCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Sözleşme Tamamlandı
                    </span>
                  ) : buyer.isProcurementActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 animate-pulse">
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Alım Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      <PauseCircle className="w-3.5 h-3.5 text-rose-600" />
                      Alım Durduruldu
                    </span>
                  )}
                </div>

                {/* Live Stock Price & Financial Performance Banner */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 my-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                        Gerçek Borsa Fiyatı ({buyer.ticker || buyer.code})
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black font-mono tracking-tight text-white">
                          ${buyer.stockPrice ? buyer.stockPrice.toFixed(2) : '100.00'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          USD
                        </span>
                      </div>
                    </div>

                    {/* Price change badge */}
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                          isUp
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span>
                          {isUp ? '+' : ''}
                          {buyer.priceChange ? buyer.priceChange.toFixed(2) : '0.00'} (
                          {isUp ? '+' : ''}
                          {buyer.priceChangePercent ? buyer.priceChangePercent.toFixed(1) : '0.0'}%)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        Önceki: ${buyer.previousStockPrice ? buyer.previousStockPrice.toFixed(2) : '100.00'}
                      </span>
                    </div>
                  </div>

                  {/* Price history visual dots */}
                  {buyer.priceHistory && buyer.priceHistory.length > 1 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Borsa Trendi:</span>
                      <div className="flex items-center gap-1.5">
                        {buyer.priceHistory.map((val, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === buyer.priceHistory!.length - 1
                                ? isUp
                                  ? 'bg-emerald-400 ring-2 ring-emerald-500/50'
                                  : 'bg-rose-400 ring-2 ring-rose-500/50'
                                : 'bg-slate-700'
                            }`}
                            title={`Nokta ${idx + 1}: $${val}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Procurement Status Callout Box */}
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                    buyer.isProcurementActive
                      ? 'bg-emerald-50 border-emerald-200/90 text-emerald-950'
                      : 'bg-rose-50 border-rose-200/90 text-rose-950'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {buyer.isProcurementActive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="font-black block">
                        {buyer.isProcurementActive
                          ? 'ALIM AKTİF — Fiyat Yükselişte (↗)'
                          : 'ALIM DURDURULDU — Fiyat Düşüşte (↘)'}
                      </strong>
                      <p className="text-[11px] mt-0.5 opacity-90">
                        {buyer.procurementStatusReason ||
                          (buyer.isProcurementActive
                            ? 'Şirket hisse değeri arttığı için fabrikalarınızdan malzeme alımı yapmaktadır.'
                            : 'Şirket hisse değeri düştüğü için tasarruf kararı aldı ve alımları durdurdu.')}
                      </p>
                      {buyer.totalPurchasedValue && buyer.totalPurchasedValue > 0 ? (
                        <div className="mt-1 text-[11px] font-mono font-bold text-slate-700">
                          Şimdiye Kadar Yapılan Tedarik:{' '}
                          <span className="text-emerald-800">
                            {currencySymbol}{buyer.totalPurchasedValue.toLocaleString('tr-TR')}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Contract Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      Kurumsal Sözleşme İlerlemesi:
                    </span>
                    <span className="font-mono font-black text-slate-900">
                      {totalFulfilled} / {totalContractTarget} Adet (%{completionPct})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${completionPct}%`,
                        backgroundColor: buyer.contractCompleted ? '#059669' : buyer.logoBg,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Sözleşme Hedef Bonusu:</span>
                    <strong className="font-mono font-black text-amber-700">
                      +{currencySymbol}{buyer.contractBonusReward} Nakit Ödül
                    </strong>
                  </div>
                </div>
              </div>

              {/* Demands and Sales Actions */}
              <div className="p-5 space-y-3 flex-1 bg-slate-50/40">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Talep Edilen Ürünler & Satın Alma Teklifleri:
                </span>

                <div className="space-y-3">
                  {buyer.demands.map((demand) => {
                    const totalAvailableStock = getProductTotalStock(demand.productId);
                    const producer = getProducerCompany(demand.productId);
                    const isDemandFull = demand.fulfilledQty >= demand.targetContractQty;
                    const prodObj = producer?.products.find((p) => p.id === demand.productId);

                    return (
                      <div
                        key={demand.productId}
                        className={`p-3.5 rounded-xl bg-white border shadow-2xs space-y-2.5 transition-all ${
                          !buyer.isProcurementActive
                            ? 'border-slate-200 opacity-90'
                            : 'border-slate-200/90'
                        }`}
                      >
                        {/* Demand Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                              <ProductIcon type={prodObj?.icon || demand.productId} className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-xs font-black text-slate-900 block">
                                {demand.productName}
                              </strong>
                              <span className="text-[10px] text-slate-500 block">
                                Üretici:{' '}
                                {producer ? (
                                  <button
                                    type="button"
                                    onClick={() => navigateToCompany(producer.id)}
                                    className="text-indigo-600 hover:underline font-bold cursor-pointer"
                                  >
                                    {producer.code} ({producer.name})
                                  </button>
                                ) : (
                                  'Bilinmiyor'
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Offered Price Tag */}
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Özel Alım Fiyatı
                            </span>
                            <span className="font-mono font-black text-emerald-800 text-sm">
                              {currencySymbol}{demand.offeredPrice}
                            </span>
                            <span className="text-[10px] text-slate-500"> / {demand.unit}</span>
                          </div>
                        </div>

                        {/* Inventory & Target Status */}
                        <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-slate-400" />
                            Depolardaki Mevcut Stok:
                          </span>
                          <span
                            className={`font-mono font-black ${
                              totalAvailableStock > 0 ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {totalAvailableStock} {demand.unit}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Teslimat Durumu:</span>
                          <span className="font-mono font-bold">
                            {demand.fulfilledQty} / {demand.targetContractQty} {demand.unit}{' '}
                            {isDemandFull && <span className="text-emerald-600">✓ (Kota Doldu)</span>}
                          </span>
                        </div>

                        {/* Sale Action Buttons or Procurement Halted Warning */}
                        {buyer.isProcurementActive ? (
                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            <button
                              type="button"
                              disabled={totalAvailableStock < 1}
                              onClick={() => sellToBuyer(buyer.id, demand.productId, 1)}
                              className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                totalAvailableStock >= 1
                                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              }`}
                            >
                              1 {demand.unit} Sat (+{currencySymbol}{demand.offeredPrice})
                            </button>

                            <button
                              type="button"
                              disabled={totalAvailableStock < 5}
                              onClick={() => sellToBuyer(buyer.id, demand.productId, 5)}
                              className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                totalAvailableStock >= 5
                                  ? 'bg-indigo-900 hover:bg-indigo-800 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              }`}
                            >
                              5 {demand.unit} Sat (+{currencySymbol}{demand.offeredPrice * 5})
                            </button>

                            <button
                              type="button"
                              disabled={totalAvailableStock <= 0}
                              onClick={() => sellAllToBuyer(buyer.id, demand.productId)}
                              className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                totalAvailableStock > 0
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              }`}
                            >
                              Tümünü Sat ({totalAvailableStock})
                            </button>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-[11px] text-rose-800 font-semibold flex items-center gap-2">
                            <PauseCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              Hisse fiyatı düştüğü için alım durduruldu. Şirket hissesi yükseldiğinde satın alma tekrar açılacaktır.
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-4 bg-slate-100/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Kurumsal Sözleşme: {buyer.code} Global Procurement</span>
                <span className="font-mono font-bold text-slate-900">
                  {buyer.demands.length} Talep Kalemi &bull; {buyer.isProcurementActive ? '🟢 Alım Açık' : '⛔ Alım Donduruldu'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
