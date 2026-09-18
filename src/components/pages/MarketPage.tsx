import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Package,
  ShoppingCart,
  RefreshCw,
  Clock,
  Coins,
  Boxes,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Sparkline } from '../Sparkline';
import { ProductIcon } from '../production/ProductIcon';

export function MarketPage() {
  const {
    marketItems,
    companies,
    inventories,
    sellProduct,
    sellAllProduct,
    currencySymbol,
    refreshAllMarketPrices,
    activeEvent,
    isTimeRunning,
    toggleTimeRunning,
  } = useGame();

  // Find total holding stock for each commodity across all companies
  const getCommodityTotalStock = (commodityId: string) => {
    let count = 0;
    Object.values(inventories).forEach((inv) => {
      count += inv.stock[commodityId] || 0;
    });
    return count;
  };

  // Find total produced count across all companies
  const getCommodityTotalProduced = (commodityId: string) => {
    let count = 0;
    Object.values(inventories).forEach((inv) => {
      count += inv.totalProduced?.[commodityId] || 0;
    });
    return count;
  };

  // Find total sold count across all companies
  const getCommodityTotalSold = (commodityId: string) => {
    let count = 0;
    Object.values(inventories).forEach((inv) => {
      count += inv.totalSold?.[commodityId] || 0;
    });
    return count;
  };

  // Find which company produces this commodity
  const getProducerCompany = (commodityId: string) => {
    return companies.find((c) => c.products.some((p) => p.id === commodityId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner - Sleek & Modern */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>CANLI EMTİA & HAMMADDE BORSASI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Merkezi Piyasa & Hammadde Fiyat Oluşumu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Her hammadde için <strong>ne kadar üretildiği</strong>, <strong>ne kadar satıldığı</strong> ve fabrikalarınızdaki <strong>mevcut stok</strong> takip edilir. Fiyatlar arz-talep ve küresel piyasa koşullarına göre anlık olarak oluşur.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={refreshAllMarketPrices}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Piyasa fiyatlarını arz ve talebe göre yeniden hesapla"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Piyasa Fiyatlarını Güncelle</span>
          </button>
        </div>
      </div>

      {/* Active Macroeconomic Market Event Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                PİYASA GELİŞMESİ (MAKROEKONOMİK ETKİ)
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                Canlı
              </span>
            </div>
            <h4 className="text-sm font-black text-white">
              {activeEvent.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeEvent.description}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-300 shrink-0 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          Zaman Durumu: <strong className={isTimeRunning ? 'text-emerald-400' : 'text-amber-400'}>{isTimeRunning ? 'Akıyor (Canlı)' : 'Durduruldu'}</strong>
        </div>
      </div>

      {/* 4 Main Commodity Cards: Petrol, Çimento, Çelik, Bakır */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {marketItems.map((item) => {
          const isUp = item.priceChange > 0;
          const isDown = item.priceChange < 0;
          const totalStock = getCommodityTotalStock(item.id);
          const totalProduced = getCommodityTotalProduced(item.id);
          const totalSold = getCommodityTotalSold(item.id);
          const producerComp = getProducerCompany(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/90 bg-white shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                      <ProductIcon
                        type={
                          item.id === 'petrol'
                            ? 'oil'
                            : item.id === 'cimento'
                            ? 'cement'
                            : item.id === 'celik'
                            ? 'steel'
                            : 'copper'
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950 text-base leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {item.category} &bull; {producerComp ? producerComp.code : ''}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-mono font-black px-2 py-0.5 rounded-md ${
                      isUp
                        ? 'bg-emerald-100 text-emerald-800'
                        : isDown
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isUp && <ArrowUpRight className="w-3.5 h-3.5" />}
                    {isDown && <ArrowDownRight className="w-3.5 h-3.5" />}
                    {isUp ? `+${item.priceChange}` : item.priceChange} ({item.priceChangePercent}%)
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">
                        Oluşan Piyasa Fiyatı
                      </span>
                      <span className="text-2xl font-black font-mono text-slate-900">
                        {currencySymbol}{item.currentPrice}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Önceki Fiyat
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-500 line-through">
                        {currencySymbol}{item.previousPrice}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline mini chart */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                    <Sparkline
                      data={item.priceHistory}
                      isPositive={!isDown}
                      width={220}
                      height={28}
                    />
                  </div>
                </div>

                {/* User Requested Metrics: Ne Kadar Üretilmiş, Ne Kadar Satılmış, Kalan Stok */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/70 mb-3 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-bold flex items-center gap-1 text-slate-600">
                      <Boxes className="w-3.5 h-3.5 text-amber-700" />
                      Toplam Üretilen:
                    </span>
                    <strong className="text-slate-900 font-black">
                      {totalProduced} {item.unit}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-bold flex items-center gap-1 text-slate-600">
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
                      Toplam Satılan:
                    </span>
                    <strong className="text-emerald-700 font-black">
                      {totalSold} {item.unit}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-amber-200/50">
                    <span className="font-bold text-slate-600">Depoda Bekleyen:</span>
                    <strong className={totalStock > 0 ? 'text-indigo-900 font-black' : 'text-slate-500'}>
                      {totalStock} {item.unit}
                    </strong>
                  </div>
                </div>

                {/* Market Details Metrics */}
                <div className="space-y-1 text-xs font-mono mb-3">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Talep Düzeyi:</span>
                    <strong
                      className={`font-bold ${
                        item.demand === 'Çok Yüksek'
                          ? 'text-emerald-700'
                          : item.demand === 'Yüksek'
                          ? 'text-sky-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {item.demand}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Arz Durumu:</span>
                    <strong className="text-slate-800 font-bold">{item.supply}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Taban Maliyet:</span>
                    <strong className="text-slate-800">{currencySymbol}{item.baseCost}</strong>
                  </div>
                </div>
              </div>

              {/* Holding Warehouse Stock & Direct Sell Action */}
              <div className="pt-3 border-t border-slate-200">
                {producerComp && (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => sellProduct(producerComp.id, item.id, 1)}
                      disabled={totalStock <= 0}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                      title="1 adet ürünü merkezi spot piyasaya sat"
                    >
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>1 Sat (+{currencySymbol}{item.currentPrice})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => sellAllProduct(producerComp.id, item.id)}
                      disabled={totalStock <= 0}
                      className="py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                      title="Mevcut tüm stoğu spot piyasada nakde çevir"
                    >
                      Tümü
                    </button>
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
