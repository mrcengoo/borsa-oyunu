import React from 'react';
import {
  Globe,
  Clock,
  Send,
  Award,
  Shuffle,
  Sparkles,
  PackageCheck,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CountryData } from '../../types/production';

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CountriesPage() {
  const {
    countries,
    currentCountry,
    countryTimeRemaining,
    buyerCompanies,
    sellToCountry,
    getExportPriceBreakdown,
    switchRandomCountry,
    currencySymbol,
    ceoCards,
  } = useGame();

  // Helper to find finished goods count from buyer companies' crafted products
  const getFinishedGoodCount = (goodName: string): number => {
    const foundBuyer = buyerCompanies.find(
      (b) => b.craftedProduct?.name.toLowerCase() === goodName.toLowerCase()
    );
    return foundBuyer?.craftedProduct?.producedCount || 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>KÜRESEL İHRACAT TERMİNALİ (5 ÜLKE)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-950 tracking-tight">
            30 Dakikada Bir Gelen Ülkeler & CEO İhracat Primleri
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Her 30 dakikada bir farklı bir ülke heyeti (ABD, Çin, Almanya, Japonya, G.Kore) fabrikalarınızı ziyaret eder.
            Alıcı şirketlerin ürettiği mamulleri ihraç edin; <strong>CEO Ülke Bonusu</strong> ile ürün başına ekstra gelir elde edin.
          </p>
        </div>

        {/* Global Countdown to Next Country & Random Switch Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-black text-xl">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                ÜLKE KALAN ZİYARET SÜRESİ
              </span>
              <div className="text-2xl font-black font-mono text-amber-300 tracking-wider">
                {formatSeconds(countryTimeRemaining)}
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                30 dakikalık döngü
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={switchRandomCountry}
            className="p-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
            title="Başka bir rastgele ülkeyi hemen çağır"
          >
            <Shuffle className="w-5 h-5" />
            <span className="text-[10px] whitespace-nowrap">Rastgele Ülke</span>
          </button>
        </div>
      </div>

      {/* ACTIVE COUNTRY SPOTLIGHT BANNER */}
      {currentCountry && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl filter drop-shadow-md">
                {currentCountry.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950">
                    ŞU AN ZİYARET EDEN ÜLKE
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {currentCountry.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {currentCountry.name} Ticaret Delegasyonu
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {currentCountry.name}, sanayinizden 3 kritik mamul talep ediyor. Sevkiyatları tamamlayarak gümrük ve lojistik masraflarını aşan yüksek ihracat karları elde edin.
                </p>
              </div>
            </div>

            {/* Tariffs and Bonuses Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Gümrük Vergisi:</span>
                <span className="font-bold text-rose-400 text-sm">{currentCountry.customsDuty} ₺</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Lojistik Masrafı:</span>
                <span className="font-bold text-amber-400 text-sm">{currentCountry.logisticsCost} ₺</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Özel Ürün Bonusu:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {currentCountry.productBonus ? `+${currentCountry.productBonus.bonus} ₺` : '0 ₺'}
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Eksik Teslimat:</span>
                <span className="font-bold text-rose-400 text-sm">{currentCountry.missingDeliveryPenalty} ₺</span>
              </div>
            </div>
          </div>

          {/* Demands & Export Actions Grid */}
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentCountry.demands.map((demandName: string, index: number) => {
              const availableQty = getFinishedGoodCount(demandName);
              const priceInfo = getExportPriceBreakdown(currentCountry.id, demandName);
              const isBonusItem = currentCountry.productBonus?.productName.toLowerCase() === demandName.toLowerCase();

              return (
                <div
                  key={index}
                  className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        TALEP #{index + 1}
                      </span>
                      {isBonusItem && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          +{currentCountry.productBonus?.bonus} ₺ Ülke Primi
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-white">
                      {demandName}
                    </h4>

                    {/* Breakdown Box */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Baz Değer:</span>
                        <span>{currencySymbol}{priceInfo.basePrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Gümrük + Lojistik:</span>
                        <span className="text-rose-400">
                          {priceInfo.customsDuty + priceInfo.logisticsCost} ₺
                        </span>
                      </div>
                      {priceInfo.ceoBonus > 0 && (
                        <div className="flex items-center justify-between text-indigo-300 font-bold bg-indigo-950/60 px-1.5 py-0.5 rounded">
                          <span className="truncate mr-1">🌟 CEO Bonusu ({priceInfo.ceoName}):</span>
                          <span className="text-amber-400 shrink-0">+{currencySymbol}{priceInfo.ceoBonus}</span>
                        </div>
                      )}
                      <div className="pt-1 border-t border-slate-800 flex items-center justify-between font-bold text-emerald-400">
                        <span>Net İhracat Fiyatı:</span>
                        <span className="text-sm font-black text-emerald-300">
                          {currencySymbol}{priceInfo.netPrice} / adet
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Alıcı Deposundaki Stok:</span>
                      </span>
                      <strong className="text-amber-300 font-bold">{availableQty} Adet</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={availableQty <= 0}
                      onClick={() => sellToCountry(currentCountry.id, demandName, 1)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                        availableQty > 0
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-md'
                          : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>İhraç Et (1 Adet)</span>
                    </button>
                    {availableQty > 1 && (
                      <button
                        type="button"
                        onClick={() => sellToCountry(currentCountry.id, demandName, availableQty)}
                        className="py-2 px-2.5 rounded-xl text-xs font-bold font-mono bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                        title="Tümünü İhraç Et"
                      >
                        Tümü ({availableQty})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL 5 COUNTRIES SCHEDULE & CEO BONUSES */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black text-slate-950">
              5 Ülkenin İhracat Şartnamesi, Talepleri & CEO Ülke Primleri
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {countries.map((country: CountryData) => {
            const isCurrent = currentCountry?.id === country.id;
            const matchingCeo = ceoCards.find((c) => c.bonuses?.countryBonus?.countryId === country.id);

            return (
              <div
                key={country.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{country.flag}</span>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white">
                        Şu An Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        30 dk periyot
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-900">
                    {country.name}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium block">
                    {country.badge}
                  </span>

                  {/* Matching CEO Country Bonus Tag */}
                  {matchingCeo && matchingCeo.bonuses?.countryBonus && (
                    <div className="mt-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-900 flex items-center justify-between">
                      <span className="truncate mr-1 font-bold">🌟 {matchingCeo.name}:</span>
                      <span className="font-black text-amber-700 shrink-0">+{currencySymbol}{matchingCeo.bonuses.countryBonus.bonus}</span>
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                      Talep Edilen 3 Ürün:
                    </span>
                    <ul className="space-y-1 text-slate-600">
                      {country.demands.map((d, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{d}</span>
                          {country.productBonus?.productName.toLowerCase() === d.toLowerCase() && (
                            <span className="text-[10px] font-mono text-emerald-600 font-bold">
                              (+{country.productBonus.bonus} ₺)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Gümrük:</span>
                    <strong className="text-rose-600">{country.customsDuty} ₺</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Lojistik:</span>
                    <strong className="text-amber-600">{country.logisticsCost} ₺</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Eksik Teslimat:</span>
                    <strong className="text-rose-600">{country.missingDeliveryPenalty} ₺</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
