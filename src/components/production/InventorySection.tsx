import { useState } from 'react';
import { Package, TrendingUp, DollarSign, CheckCircle2, AlertCircle, Sparkles, ShoppingCart, ShieldCheck } from 'lucide-react';
import { CompanyConfig, CompanyInventoryState, RawMaterialProduct } from '../../types/production';
import { ProductIcon } from './ProductIcon';

interface InventorySectionProps {
  company: CompanyConfig;
  inventoryState: CompanyInventoryState;
  onSellProduct: (product: RawMaterialProduct, quantity: number) => void;
  currency: 'USD' | 'TRY';
}

export function InventorySection({
  company,
  inventoryState,
  onSellProduct,
  currency,
}: InventorySectionProps) {
  const currencySymbol = currency === 'TRY' ? '₺' : '$';
  const [sellingProductId, setSellingProductId] = useState<string | null>(null);

  // Calculate sell revenue per unit:
  // 1. Taban Satış Fiyatı (Maliyet Fiyatı): örn. Çimento 4, Petrol 2, Çelik 6, Bakır 7
  // 2. (+) Gelir Bonusları: Satış +5, İhracat +4, Pazarlama +3, Ar-Ge +1 (+13), Petrolde +2 (+15)
  // 3. (-) Gider Bonusları: İşçilik -4, Finansman -3, Bakım -2, Lojistik -2 (-11)
  // 4. (=) Tam Satış Fiyatı (Maliyet + Gelir Bonusları - Gider Bonusları)
  const getSaleRevenueBreakdown = (product: RawMaterialProduct) => {
    const base = product.baseSellPrice || product.productionCost; // Taban Maliyet
    const incomeSkills = company.ceo.skills.filter((s) => s.category === 'income');
    let generalIncomeBonus = 0;
    let oilBonus = 0;
    incomeSkills.forEach((s) => {
      if (s.type === 'oil_bonus') {
        if (product.isSpecialOil) oilBonus += s.value;
      } else {
        generalIncomeBonus += s.value;
      }
    });
    const totalIncomeBonus = generalIncomeBonus + oilBonus;
    const grossPrice = base + totalIncomeBonus;

    const expenseSkills = company.ceo.skills.filter((s) => s.category === 'expense');
    const totalExpenseBonus = Math.abs(expenseSkills.reduce((sum, s) => sum + s.value, 0)) || 11;
    const finalPrice = Math.max(1, grossPrice - totalExpenseBonus);

    return {
      base,
      salesBonus: 5,
      exportBonus: 4,
      marketingBonus: 3,
      rdBonus: 1,
      generalIncomeBonus,
      oilBonus,
      totalIncomeBonus,
      grossPrice,
      totalExpenseBonus,
      finalPrice,
      total: finalPrice,
    };
  };

  const handleSell = (product: RawMaterialProduct, quantity: number = 1) => {
    const currentStock = inventoryState.stock[product.id] || 0;
    if (currentStock < quantity) return;

    setSellingProductId(product.id);
    onSellProduct(product, quantity);
    setTimeout(() => setSellingProductId(null), 500);
  };

  const totalUnitsInWarehouse = Object.values(inventoryState.stock).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Şirket Deposu & Ürün Satış Paneli
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {totalUnitsInWarehouse} Adet Stokta
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Üretilen hammaddeler burada güvenle depolanır; satılmayan hiçbir ürün kaybolmaz ve birikir.
            </p>
          </div>
        </div>

        {/* Security & Isolation Notice (Rule 13) */}
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Doğrudan Şirket İçi Satış Kanalı (İzole Piyasa)</span>
        </div>
      </div>

      {/* Product Stock Cards Grid (Rule 7, 9, 10, 11, 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {company.products.map((prod) => {
          const currentStock = inventoryState.stock[prod.id] || 0;
          const { base, totalIncomeBonus, grossPrice, totalExpenseBonus, finalPrice } =
            getSaleRevenueBreakdown(prod);
          const hasStock = currentStock > 0;
          const isSelling = sellingProductId === prod.id;

          return (
            <div
              key={prod.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                hasStock
                  ? 'bg-gradient-to-b from-white to-emerald-50/20 border-emerald-300 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/80'
              } ${isSelling ? 'scale-98 ring-2 ring-emerald-400' : ''}`}
            >
              <div>
                {/* Header: Product Icon & Current Stock Pill (Rule 7) */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <ProductIcon type={prod.icon} size="md" />
                  </div>

                  {/* Prominent Current Stock Amount */}
                  <div
                    className={`px-3 py-1 rounded-xl font-mono text-center font-bold border shadow-2xs ${
                      hasStock
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase block tracking-wider opacity-90">
                      Mevcut Stok
                    </span>
                    <span className="text-sm font-black">
                      {currentStock} {prod.unit}
                    </span>
                  </div>
                </div>

                {/* Title & Category */}
                <h4 className="text-base font-bold text-slate-900">
                  {prod.name}
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  {prod.category}
                </p>

                {/* Step-by-Step Price Calculation Breakdown Card */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-mono mb-4 space-y-1.5">
                  {/* 1. Taban Satış (Maliyet) */}
                  <div className="flex items-center justify-between text-slate-700 text-[11px]">
                    <span className="font-semibold">Taban Satış (Maliyet):</span>
                    <strong className="text-slate-900">{currencySymbol}{base}</strong>
                  </div>

                  {/* 2. Gelir Bonusları */}
                  <div className="flex items-center justify-between text-emerald-700 text-[11px] font-bold">
                    <span>+ Gelir Bonusları:</span>
                    <span>+{currencySymbol}{totalIncomeBonus}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-2 space-y-0.5 border-l-2 border-emerald-300 my-0.5">
                    <div className="flex justify-between">
                      <span>Satış (+5), İhracat (+4), Pazarlama (+3), Ar-Ge (+1)</span>
                      <span>+13</span>
                    </div>
                    {prod.isSpecialOil && (
                      <div className="flex justify-between text-orange-700 font-semibold">
                        <span>Petrol Satış Bonusu (+2)</span>
                        <span>+2</span>
                      </div>
                    )}
                  </div>

                  {/* Ara Satış Fiyatı (Gelir Ekli) */}
                  <div className="flex items-center justify-between text-slate-700 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-200/60 text-[11px] font-semibold">
                    <span>Gelir Ekli Ara Fiyat:</span>
                    <span className="text-emerald-800 font-bold">{currencySymbol}{grossPrice}</span>
                  </div>

                  {/* 3. Gider Bonusları */}
                  <div className="flex items-center justify-between text-rose-700 text-[11px] font-bold pt-0.5">
                    <span>- Gider Bonusları (Tasarruf):</span>
                    <span>-{currencySymbol}{totalExpenseBonus}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-2 space-y-0.5 border-l-2 border-rose-300 my-0.5">
                    <div className="flex justify-between">
                      <span>İşçilik (-4), Finansman (-3)</span>
                      <span>-7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bakım (-2), Lojistik (-2)</span>
                      <span>-4</span>
                    </div>
                  </div>

                  {/* 4. Tam Satış Fiyatı */}
                  <div className="flex items-center justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-300 text-xs bg-white -mx-1 px-1.5 py-1 rounded shadow-2xs">
                    <span className="text-slate-900 font-black">Tam Satış Fiyatı:</span>
                    <span className="text-emerald-700 font-black text-sm">
                      +{currencySymbol}{finalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Sell 1 and Sell All */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSell(prod, 1)}
                  disabled={!hasStock}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    hasStock
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title={hasStock ? '1 adet sat ve kasaya gelir ekle' : 'Stokta ürün yok'}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Sat (1 {prod.unit})</span>
                  <span className="text-[11px] font-mono bg-black/15 px-1.5 py-0.5 rounded">
                    +{currencySymbol}{finalPrice}
                  </span>
                </button>

                {currentStock > 1 && (
                  <button
                    type="button"
                    onClick={() => handleSell(prod, currentStock)}
                    className="w-full py-1.5 px-2 rounded-lg font-bold text-[11px] text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Tümünü Sat ({currentStock} Adet)</span>
                    <span className="font-mono font-black">
                      +{currencySymbol}{currentStock * finalPrice}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Persistence & Rule Explanation Banner */}
      <div className="mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Kural 6 Garantisi:</strong> Satılmayan ürünler kesinlikle kaybolmaz, tur geçişlerinde birikir ve dilediğiniz an satılabilir.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span>Toplam Satılan: {Object.values(inventoryState.totalSold).reduce((a, b) => a + b, 0)} Adet</span>
          <span>&bull;</span>
          <span className="text-emerald-600 font-bold">Kasa Katkısı: +{currencySymbol}{inventoryState.totalRevenue}</span>
        </div>
      </div>
    </div>
  );
}
