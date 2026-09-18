import React from 'react';
import {
  ShoppingCart,
  ChevronRight,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Boxes,
  Award,
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
    refreshAllMarketPrices,
    currencySymbol,
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

  // Helper to sell all available stock for all demands of a buyer
  const handleSellAllAvailableForBuyer = (buyerId: string) => {
    const buyer = buyerCompanies.find((b) => b.id === buyerId);
    if (!buyer || !buyer.isProcurementActive) return;

    buyer.demands.forEach((demand) => {
      const stock = getProductTotalStock(demand.productId);
      if (stock > 0) {
        sellAllToBuyer(buyerId, demand.productId);
      }
    });
  };

  const activeProcurementBuyers = buyerCompanies.filter(
    (b) => b.isProcurementActive && (b.priceChange ?? 0) >= 0
  );
  const haltedProcurementBuyers = buyerCompanies.filter(
    (b) => !b.isProcurementActive || (b.priceChange ?? 0) < 0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - Sleek & Modern, matching CompaniesPage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 mb-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
            <span>ALICI ŞİRKETLER ({buyerCompanies.length} KURUMSAL ŞİRKET)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Alıcı Şirketler & Kurumsal İleri Üretim Depoları
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Alıcı şirketlerin borsa hisse fiyatları <strong>bağımsız ve canlı</strong> olarak güncellenir. Hissesi yükselen alıcılar fabrikalardan hammadde alımı yapar; hissesi ekside olanlar (örn. <strong>CNQ</strong>) alımı durdurur, hammaddeler üretici fabrikada bekleyerek hisse değerine <strong>+0.3 ₺/adet prim</strong> kazandırır.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={refreshAllMarketPrices}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Tüm alıcı şirketlerin borsa fiyatlarını anlık güncelle"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Fiyatları Anlık Güncelle</span>
          </button>
        </div>
      </div>

      {/* Summary Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600">Alım Yapanlar (Hisse Artıda):</span>
          </div>
          <span className="font-mono font-black text-sm text-emerald-700">
            {activeProcurementBuyers.length} Şirket
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-slate-600">Alımı Durduranlar (Hisse Ekside):</span>
          </div>
          <span className="font-mono font-black text-sm text-rose-700">
            {haltedProcurementBuyers.length} Şirket
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-600">Bekleyen Stok Değeri:</span>
          </div>
          <span className="font-mono font-black text-xs text-amber-700">
            +0.3 ₺ / adet hisseye yansır
          </span>
        </div>
      </div>

      {/* Buyer Cards Grid - Formatted identically to CompaniesPage cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {buyerCompanies.map((buyer: BuyerCompany) => {
          const isUp = (buyer.priceChange || 0) >= 0;
          const isHalted = !buyer.isProcurementActive || (buyer.priceChange ?? 0) < 0;
          const crafted = buyer.craftedProduct;

          // Calculate total contract quotas fulfilled vs target
          const totalTarget = buyer.demands.reduce((acc, d) => acc + d.targetContractQty, 0);
          const totalFulfilled = buyer.demands.reduce((acc, d) => acc + d.fulfilledQty, 0);
          const contractPct = totalTarget > 0 ? Math.min(100, Math.round((totalFulfilled / totalTarget) * 100)) : 0;

          // Check if player has any stock that matches this buyer's demands
          const hasAvailableStock = buyer.demands.some(
            (d) => getProductTotalStock(d.productId) > 0
          );

          return (
            <div
              key={buyer.id}
              className="rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-black font-mono bg-slate-950 text-amber-400">
                      {buyer.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {buyer.ticker}
                    </span>
                  </div>

                  {/* Procurement Status Pill */}
                  {isHalted ? (
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-300 inline-flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Alım Durduruldu (Hisse -)
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 inline-flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Alım Açık (Hisse +)
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-950 leading-tight">
                  {buyer.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {buyer.industry}
                </p>

                {/* Real Stock Price Banner matching CompaniesPage's dark box */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      GERÇEK BORSA HİSSE FİYATI
                    </span>
                    <span className="text-base font-black font-mono text-amber-300">
                      ${buyer.stockPrice ? buyer.stockPrice.toFixed(2) : '100.00'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      Piyasa Değeri: {buyer.marketCap} &bull; {buyer.rating}
                    </span>
                  </div>

                  <div className="text-right font-mono text-[10px]">
                    <span
                      className={`font-bold block text-xs ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? '+' : ''}${buyer.priceChange ? buyer.priceChange.toFixed(2) : '0.00'} (
                      {isUp ? '+' : ''}
                      {buyer.priceChangePercent ? buyer.priceChangePercent.toFixed(1) : '0.0'}%)
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Canlı Borsa {buyer.lastUpdatedTime ? `• ${buyer.lastUpdatedTime}` : ''}
                    </span>
                  </div>
                </div>

                {/* Warehouse / Sektörel İleri Üretim Deposu Capacity Meter */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Kurumsal İleri Üretim Deposu:</span>
                    <strong className="text-slate-800">
                      {crafted?.producedCount || 0} {crafted?.unit || 'Ünite'} (%{contractPct})
                    </strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHalted ? 'bg-rose-500' : contractPct >= 80 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.max(5, contractPct)}%` }}
                    />
                  </div>

                  {isHalted ? (
                    <span className="text-[10px] text-rose-600 font-bold block mt-1">
                      ⚠️ Hisse negatif olduğu için malzeme alımı durduruldu. Hammaddeler üretici fabrikada bekleyip +0.3 ₺/adet prim kazandırır.
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Ürün: {crafted?.name} &bull; Sözleşme Kotası: {totalFulfilled} / {totalTarget}
                    </span>
                  )}
                </div>
              </div>

              {/* Demands List matching CompaniesPage products format */}
              <div className="p-4 space-y-2 flex-1 bg-white">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                  Talep Edilen Hammaddeler & Teklifler:
                </span>

                <div className="space-y-1.5">
                  {buyer.demands.map((demand) => {
                    const totalAvailableStock = getProductTotalStock(demand.productId);
                    const producer = getProducerCompany(demand.productId);

                    return (
                      <div
                        key={demand.productId}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                            <ProductIcon type={demand.productId} className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <strong className="text-slate-900 block font-bold text-xs">
                              {demand.productName}
                            </strong>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              Teklif: <strong className="text-emerald-700 font-bold">{currencySymbol}{demand.offeredPrice}</strong>
                              &bull; Üretici: {producer ? producer.code : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                            Stok: {totalAvailableStock} {demand.unit}
                          </span>

                          {!isHalted ? (
                            <button
                              type="button"
                              disabled={totalAvailableStock < 1}
                              onClick={() => sellToBuyer(buyer.id, demand.productId, 1)}
                              className="py-1 px-2 rounded-lg text-[11px] font-mono font-bold bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                              title="1 adet sat"
                            >
                              Sat
                            </button>
                          ) : (
                            <span className="text-[10px] text-rose-600 font-bold px-1 py-0.5 rounded bg-rose-50 border border-rose-200">
                              Durduruldu
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Corporate Summary matching CEO summary in CompaniesPage */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sözleşme Bonusu: +{currencySymbol}{buyer.contractBonusReward}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    Toplam Alım: {currencySymbol}{buyer.totalPurchasedValue}
                  </span>
                </div>
              </div>

              {/* Action Button matching CompaniesPage */}
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                {!isHalted ? (
                  <button
                    type="button"
                    disabled={!hasAvailableStock}
                    onClick={() => handleSellAllAvailableForBuyer(buyer.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Tüm Uygun Fabrika Stoklarını Sat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Alım Durduruldu (Hisse Ekside &bull; Stok Değer Kazanıyor)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
