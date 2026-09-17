import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  ShoppingCart,
  Activity,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
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
    turn,
    advanceTurn,
    activeEvent,
  } = useGame();

  // Find total holding stock for each commodity across all companies
  const getCommodityTotalStock = (commodityId: string) => {
    let count = 0;
    Object.values(inventories).forEach((inv) => {
      count += inv.stock[commodityId] || 0;
    });
    return count;
  };

  // Find which company produces this commodity
  const getProducerCompany = (commodityId: string) => {
    return companies.find((c) => c.products.some((p) => p.id === commodityId));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            CANLI EMTİA VE HAMMADDE PİYASASI
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Merkezi Piyasa & Emtia Fiyat Endeksi
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Petrol, Çimento, Çelik ve Bakır emtialarının arz-talep dengesi, fiyat değişimleri ve küresel satış hacimleri.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Piyasa Turu: #{turn}</span>
          </span>
          <button
            type="button"
            onClick={advanceTurn}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Piyasa Turunu İlerlet</span>
          </button>
        </div>
      </div>

      {/* Active Macroeconomic Market Event Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                PİYASA GELİŞMESİ
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                Aktif
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white">
              {activeEvent.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {activeEvent.description}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 shrink-0 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          Emtia Fiyat Etkisi: <strong className="text-amber-400">Aktif</strong>
        </div>
      </div>

      {/* 4 Main Commodity Cards: Petrol, Çimento, Çelik, Bakır */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketItems.map((item) => {
          const isUp = item.priceChange > 0;
          const isDown = item.priceChange < 0;
          const totalStock = getCommodityTotalStock(item.id);
          const producerComp = getProducerCompany(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
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
                      <h3 className="font-black text-slate-950 text-base">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 block">
                        {item.category}
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
                <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">
                        Güncel Piyasa Fiyatı
                      </span>
                      <span className="text-3xl font-black font-mono text-slate-900">
                        {currencySymbol}{item.currentPrice}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Önceki Fiyat
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-500 line-through">
                        {currencySymbol}{item.previousPrice}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline mini chart */}
                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <Sparkline
                      data={item.priceHistory}
                      isPositive={!isDown}
                      width={220}
                      height={32}
                    />
                  </div>
                </div>

                {/* Market Details Metrics */}
                <div className="space-y-1.5 text-xs font-mono mb-4">
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
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                    <span>Toplam Piyasa Satışı:</span>
                    <strong className="text-amber-800 font-bold">
                      {item.totalMarketSold} {item.unit}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Holding Warehouse Stock & Direct Sell Action */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-600 font-medium">Şirket Depolarınızda:</span>
                  <span
                    className={`font-mono font-black px-2 py-0.5 rounded ${
                      totalStock > 0
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {totalStock} {item.unit}
                  </span>
                </div>

                {producerComp && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => sellProduct(producerComp.id, item.id, 1)}
                      disabled={totalStock <= 0}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>1 {item.unit} Sat (+{currencySymbol}{item.currentPrice})</span>
                    </button>
                    {totalStock > 1 && (
                      <button
                        type="button"
                        onClick={() => sellAllProduct(producerComp.id, item.id)}
                        className="py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-xs"
                        title="Tüm depodaki miktarı sat"
                      >
                        Tümü
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Market Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-base font-black text-slate-900 mb-1">
          Emtia Fiyat ve Talep Tablosu
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tüm hammadde kalemlerinin güncel piyasa göstergeleri ve holding satış hacimleri
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-black uppercase text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Hammadde</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 font-mono text-right">Güncel Fiyat</th>
                <th className="py-3 px-4 font-mono text-right">Önceki Fiyat</th>
                <th className="py-3 px-4 text-center">Değişim</th>
                <th className="py-3 px-4 text-center">Talep</th>
                <th className="py-3 px-4 text-center">Arz</th>
                <th className="py-3 px-4 font-mono text-right">Holding Deposu</th>
                <th className="py-3 px-4 font-mono text-right">Piyasada Satılan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {marketItems.map((item) => {
                const isUp = item.priceChange > 0;
                const isDown = item.priceChange < 0;
                const stock = getCommodityTotalStock(item.id);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold flex items-center gap-2">
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
                        className="w-3.5 h-3.5"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3 px-4 font-mono font-black text-slate-900 text-right">
                      {currencySymbol}{item.currentPrice}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-right">
                      {currencySymbol}{item.previousPrice}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          isUp
                            ? 'bg-emerald-50 text-emerald-700'
                            : isDown
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isUp ? `+${item.priceChange}` : item.priceChange} ({item.priceChangePercent}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {item.demand}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {item.supply}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-emerald-800 text-right">
                      {stock} {item.unit}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-800 text-right">
                      {item.totalMarketSold} {item.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
