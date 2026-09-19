import React from 'react';
import {
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Globe2,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CeoCardData } from '../../types/production';

export function CeosPage() {
  const {
    ceoCards,
    companies,
    assignCeoToCompany,
    currencySymbol,
    currentCountry,
  } = useGame();

  const getCountryFlag = (countryId?: string) => {
    switch (countryId) {
      case 'abd':
        return '🇺🇸';
      case 'cin':
        return '🇨🇳';
      case 'almanya':
        return '🇩🇪';
      case 'japonya':
        return '🇯🇵';
      case 'gkore':
        return '🇰🇷';
      default:
        return '🌍';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 mb-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>YÖNETİCİ KADROSU ({ceoCards.length} CEO KARTI)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            CEO Kartları, Ülke İhracat Bonusları & Atamalar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Her CEO, atandığı fabrikaya <strong>3 Gelir</strong> ve <strong>3 Gider Tasarruf Bonusu</strong> sağlar. Ayrıca küresel heyetler geldiğinde ihracat mamul fiyatına özel <strong>Ülke Bonusu</strong> (Örn: Amerika +8 ₺) ekler.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Ziyarette: {currentCountry.flag} {currentCountry.name}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold">
            {companies.length} Fabrika / {ceoCards.length} CEO Kartı
          </span>
        </div>
      </div>

      {/* CEO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {ceoCards.map((ceo: CeoCardData) => {
          const assignedCompany = companies.find((c) => c.id === ceo.assignedCompanyId);
          const totalIncomeBonus = ceo.incomeSkills.reduce((sum, s) => sum + s.value, 0);
          const totalExpenseBonus = ceo.expenseSkills.reduce((sum, s) => sum + Math.abs(s.value), 0);
          const countryBonus = ceo.bonuses?.countryBonus;
          const isCountryActive = countryBonus && currentCountry.id === countryBonus.countryId;

          return (
            <div
              key={ceo.id}
              className={`rounded-2xl border bg-white transition-all overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between ${
                isCountryActive
                  ? 'border-amber-400 ring-2 ring-amber-300'
                  : assignedCompany
                  ? 'border-slate-200/90'
                  : 'border-amber-300 ring-2 ring-amber-100/60'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                      {ceo.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-950 leading-tight">
                        {ceo.name}
                      </h3>
                      <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                        {ceo.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ceo.specialty}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {assignedCompany ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {assignedCompany.code} CEO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase font-mono bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Boşta
                    </span>
                  )}
                </div>

                {/* Country Bonus Card - NEW Feature Highlighted */}
                {countryBonus && (
                  <div
                    className={`mt-2.5 p-2.5 rounded-xl border transition-all ${
                      isCountryActive
                        ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCountryFlag(countryBonus.countryId)}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900">
                              {countryBonus.countryName} Ülke Bonusu
                            </span>
                            {isCountryActive && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-amber-500 text-slate-950 animate-pulse">
                                ŞU AN AKTİF!
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {countryBonus.countryName} ticaret heyeti geldiğinde ürün fiyatına eklenir
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-base font-black text-amber-600">
                          +{currencySymbol}{countryBonus.bonus}
                        </span>
                        <span className="text-[9px] text-slate-400 block">/ Ürün</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bonus Totals Bar */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      3 Gelir Bonusu
                    </span>
                    <strong className="text-emerald-900 font-black text-xs">
                      +{currencySymbol}{totalIncomeBonus} / ürün
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-100">
                    <span className="text-[10px] uppercase font-bold text-rose-800 block">
                      3 Gider İndirimi
                    </span>
                    <strong className="text-rose-900 font-black text-xs">
                      -{currencySymbol}{totalExpenseBonus} / maliyet
                    </strong>
                  </div>
                </div>
              </div>

              {/* Card Body: Sleek Skills Breakdown */}
              <div className="p-4 space-y-3 flex-1 bg-slate-50/30 text-xs">
                {/* 3 Gelir Bonusu */}
                <div>
                  <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                    3 Satış Fiyat Artışı (Gelir):
                  </span>
                  <div className="space-y-1">
                    {ceo.incomeSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between text-[11px]"
                      >
                        <span className="text-slate-700 truncate mr-2 font-medium">
                          {skill.name}
                        </span>
                        <span className="font-mono font-black text-emerald-700 shrink-0">
                          +{currencySymbol}{skill.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Gider Bonusu */}
                <div>
                  <span className="text-[11px] font-black text-rose-900 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                    <TrendingDown className="w-3 h-3 text-rose-600" />
                    3 Maliyet Tasarrufu (Gider):
                  </span>
                  <div className="space-y-1">
                    {ceo.expenseSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between text-[11px]"
                      >
                        <span className="text-slate-700 truncate mr-2 font-medium">
                          {skill.name}
                        </span>
                        <span className="font-mono font-black text-rose-700 shrink-0">
                          -{currencySymbol}{Math.abs(skill.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Quick Assignment Buttons */}
              <div className="p-3.5 bg-white border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                  Fabrikaya Görevlendir:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {companies.map((comp) => {
                    const isCurrent = ceo.assignedCompanyId === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => assignCeoToCompany(comp.id, ceo.id)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 text-amber-300 ring-2 ring-amber-400 shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title={`${comp.name} şirketine CEO olarak ata`}
                      >
                        {comp.code}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
