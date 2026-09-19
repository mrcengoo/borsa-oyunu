import React from 'react';
import {
  ShoppingCart,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Globe2,
  PackageCheck,
  Hammer,
  Send,
  CheckCircle2,
  Shuffle,
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
    supplyBuyerRecipe,
    refreshAllMarketPrices,
    currencySymbol,
    currentCountry,
    countryTimeRemaining,
    sellToCountry,
    getExportPriceBreakdown,
    switchRandomCountry,
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

  // Format time remaining for visiting country
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeProcurementBuyers = buyerCompanies.filter(
    (b) => b.isProcurementActive && (b.priceChange ?? 0) >= 0
  );
  const haltedProcurementBuyers = buyerCompanies.filter(
    (b) => !b.isProcurementActive || (b.priceChange ?? 0) < 0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 mb-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
            <span>ALICI ŞİRKETLER ({buyerCompanies.length} KURUMSAL İMALATÇI)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Hammadde Alıcıları, Üretim & Ülke İhracatı
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Alıcı şirketler fabrikalardan gerekli hammaddeleri toplayarak nihai ürünleri üretir. Üretilen mamuller, 30 dakikada bir gelen rastgele ülkelere <strong>CEO Ülke Bonusu</strong> eklenerek ihraç edilir.
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
            <span>Borsa Fiyatlarını Güncelle</span>
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

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentCountry.flag}</span>
            <div>
              <span className="text-[10px] text-amber-900/70 uppercase font-mono font-bold block">
                Ziyaretteki Ülke ({formatTime(countryTimeRemaining)})
              </span>
              <span className="text-xs font-black text-amber-950">
                {currentCountry.name} Ticaret Heyeti
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={switchRandomCountry}
            className="px-2 py-1 rounded-lg bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Başka bir rastgele ülkeyi hemen çağır"
          >
            <Shuffle className="w-3 h-3 text-amber-700" />
            <span>Rastgele Ülke</span>
          </button>
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {buyerCompanies.map((buyer: BuyerCompany) => {
          const isUp = (buyer.priceChange || 0) >= 0;
          const isHalted = !buyer.isProcurementActive || (buyer.priceChange ?? 0) < 0;
          const crafted = buyer.craftedProduct;
          const currentMaterials = crafted?.currentMaterials || {};
          const requirements = crafted?.requirements || [];

          // Check export price breakdown for this product with visiting country
          const exportInfo = crafted ? getExportPriceBreakdown(currentCountry.id, crafted.name) : null;
          const isDemandedByCountry = currentCountry.demands.some(
            (d) => d.toLowerCase() === crafted?.name.toLowerCase()
          );

          // Calculate readiness of recipe
          let canProduceAnother = requirements.length > 0;
          let hasAnyMissing = false;
          let playerCanFulfillAll = true;

          requirements.forEach((req) => {
            const collected = currentMaterials[req.productId] || 0;
            const factoryStock = getProductTotalStock(req.productId);
            if (collected < req.requiredQty) {
              canProduceAnother = false;
              hasAnyMissing = true;
              if (collected + factoryStock < req.requiredQty) {
                playerCanFulfillAll = false;
              }
            }
          });

          return (
            <div
              key={buyer.id}
              className="rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* 1. Card Header: Company & Live Finviz Stock Price */}
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

                {/* Real Stock Price Banner */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      CANLI BORSA HİSSE FİYATI
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
                      Canlı Finviz {buyer.lastUpdatedTime ? `• ${buyer.lastUpdatedTime}` : ''}
                    </span>
                  </div>
                </div>

                {/* 2. Üreteceği Ürün & Hazır Stok Bilgisi */}
                {crafted && (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-indigo-900/70 block">
                        ÜRETECEĞİ NİHAİ MAMUL:
                      </span>
                      <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-indigo-600" />
                        <span>{crafted.name}</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Baz Birim Değer: {currencySymbol}{crafted.unitCost || 160}
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-500 block uppercase">
                        Depodaki Hazır Ürün:
                      </span>
                      <span
                        className={`text-base font-black px-2 py-0.5 rounded-lg inline-block ${
                          crafted.producedCount > 0
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {crafted.producedCount} Adet
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Reçete: Üreteceği Ürünün Hammadde İstek ve Adetleri */}
              <div className="p-4 space-y-2 flex-1 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hammadde İstekleri ve Adetleri (Reçete):</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {requirements.map((req) => {
                    const collected = currentMaterials[req.productId] || 0;
                    const isComplete = collected >= req.requiredQty;
                    const factoryStock = getProductTotalStock(req.productId);
                    const producer = getProducerCompany(req.productId);
                    const pct = Math.min(100, Math.round((collected / req.requiredQty) * 100));

                    // Check buyer demand offer price for this raw material
                    const demand = buyer.demands.find((d) => d.productId === req.productId);
                    const offeredPrice = demand?.offeredPrice || 30;

                    return (
                      <div
                        key={req.productId}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isComplete
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-slate-50 border-slate-200/90'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                              <ProductIcon type={req.productId} className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <strong className="text-xs font-bold text-slate-900 block">
                                {req.productName}
                              </strong>
                              <span className="text-[10px] text-slate-500 font-mono">
                                İstek: <strong className="text-slate-800">{req.requiredQty} {req.unit}</strong> &bull; Teklif: <strong className="text-emerald-700">{currencySymbol}{offeredPrice}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Material stock & supply actions */}
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                                isComplete
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              {collected} / {req.requiredQty} {req.unit}
                            </span>

                            {!isHalted && !isComplete && (
                              <button
                                type="button"
                                disabled={factoryStock < 1}
                                onClick={() => sellToBuyer(buyer.id, req.productId, 1)}
                                className="py-1 px-2 rounded-lg text-[10px] font-mono font-bold bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                title={`Fabrikadan 1 adet ${req.productName} aktar (+${currencySymbol}${offeredPrice})`}
                              >
                                +1 Ver
                              </button>
                            )}

                            {isComplete && (
                              <span className="text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mini Progress Bar & Factory Stock Info */}
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="shrink-0">
                            Fabrika Stoğu: <strong>{factoryStock} {req.unit}</strong> ({producer ? producer.code : '—'})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Recipe Supply Button */}
                {!isHalted && hasAnyMissing && (
                  <button
                    type="button"
                    onClick={() => supplyBuyerRecipe(buyer.id)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span>Eksik Hammaddeleri Fabrikalardan Tedarik Et</span>
                  </button>
                )}
              </div>

              {/* 4. Rastgele Gelen Ülkeye İhracat Satışı & CEO Ülke Bonusu */}
              {crafted && exportInfo && (
                <div className="p-4 bg-amber-50/50 border-t border-amber-200/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-black text-slate-900 uppercase">
                        Rastgele Gelen Ülkeye İhracat:
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                      {currentCountry.flag} {currentCountry.name}
                    </span>
                  </div>

                  {/* Export Price Calculation Breakdown with CEO Country Bonus */}
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200/90 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Baz Mamul Değeri:</span>
                      <span>{currencySymbol}{exportInfo.basePrice}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Gümrük & Lojistik:</span>
                      <span className="text-rose-600">
                        {exportInfo.customsDuty + exportInfo.logisticsCost} ₺
                      </span>
                    </div>
                    {exportInfo.countryProductBonus > 0 && (
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>{currentCountry.name} Ürün Primi:</span>
                        <span>+{currencySymbol}{exportInfo.countryProductBonus}</span>
                      </div>
                    )}
                    {exportInfo.ceoBonus > 0 ? (
                      <div className="flex items-center justify-between text-indigo-700 font-bold bg-indigo-50/70 px-1.5 py-0.5 rounded">
                        <span>🌟 CEO Bonusu ({exportInfo.ceoCountryName} - {exportInfo.ceoName}):</span>
                        <span className="text-indigo-900 font-black">+{currencySymbol}{exportInfo.ceoBonus}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>CEO Bonusu ({currentCountry.name}):</span>
                        <span>Bu ülkeye özel CEO atanmadı (+0 ₺)</span>
                      </div>
                    )}
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between font-black text-sm text-slate-900">
                      <span>Net İhracat Satış Fiyatı:</span>
                      <span className="text-emerald-700">
                        {currencySymbol}{exportInfo.netPrice} / adet
                      </span>
                    </div>
                  </div>

                  {/* Export Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={crafted.producedCount < 1}
                      onClick={() => sellToCountry(currentCountry.id, crafted.name, 1)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentCountry.name} Heyetine Sat (1 Adet)</span>
                    </button>

                    {crafted.producedCount > 1 && (
                      <button
                        type="button"
                        onClick={() => sellToCountry(currentCountry.id, crafted.name, crafted.producedCount)}
                        className="py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        title="Depodaki tüm mamulleri ihraç et"
                      >
                        Tümü ({crafted.producedCount})
                      </button>
                    )}
                  </div>

                  {crafted.producedCount === 0 && (
                    <p className="text-[10px] text-amber-800/80 font-mono text-center">
                      ℹ️ İhracat yapabilmek için yukarıdaki hammadde isteklerini tamamlayarak ürün üretin.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
