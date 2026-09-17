import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Award,
  ArrowUpRight,
  TrendingDown,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Briefcase,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CeoCardData } from '../../types/production';

export function CeosPage() {
  const {
    ceoCards,
    companies,
    assignCeoToCompany,
    currencySymbol,
    navigateToCompany,
  } = useGame();

  const [selectedCeoForAssign, setSelectedCeoForAssign] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-indigo-100 text-indigo-900 mb-2">
            <Users className="w-3.5 h-3.5 text-indigo-700" />
            YÖNETİM KURULU &bull; {ceoCards.length} LİDER KARTI
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            CEO Kartları & Yönetici Atama
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Her CEO kartında tam <strong>3 Gelir Bonusu</strong> ve <strong>3 Gider Tasarruf Bonusu</strong> bulunur. Bir CEO&apos;yu dilediğiniz üretim şirketine atayarak üretim maliyetlerini düşürebilir ve satış fiyatlarını yükseltebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs font-bold text-slate-700">
            {companies.length} Fabrika / {ceoCards.length} CEO
          </span>
        </div>
      </div>

      {/* Active Management Overview Grid */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h3 className="text-xs font-mono font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          Mevcut Şirket - CEO Eşleşmeleri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {companies.map((comp) => {
            const assignedCeo = ceoCards.find((c) => c.assignedCompanyId === comp.id);
            return (
              <div
                key={comp.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-slate-900 text-amber-300">
                      {comp.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {comp.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 mt-1 block font-semibold truncate">
                    👔 {assignedCeo ? assignedCeo.name : comp.ceo.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToCompany(comp.id)}
                  className="px-2 py-1 text-[10px] font-bold font-mono bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 cursor-pointer shrink-0 transition-colors"
                  title="Şirket Detayına Git"
                >
                  Fabrika &rarr;
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CEO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ceoCards.map((ceo: CeoCardData) => {
          const assignedCompany = companies.find((c) => c.id === ceo.assignedCompanyId);
          const isAssignMenuOpen = selectedCeoForAssign === ceo.id;

          // Compute total bonuses
          const totalIncomeBonus = ceo.incomeSkills.reduce((sum, s) => sum + s.value, 0);
          const totalExpenseBonus = ceo.expenseSkills.reduce((sum, s) => sum + Math.abs(s.value), 0);

          return (
            <div
              key={ceo.id}
              className={`rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                assignedCompany
                  ? 'border-slate-200 bg-white'
                  : 'border-indigo-300 bg-white ring-2 ring-indigo-100'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center font-black text-xl shadow-md border border-indigo-400/20">
                      {ceo.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-950 leading-tight">
                        {ceo.name}
                      </h3>
                      <p className="text-xs font-bold text-indigo-700 mt-0.5">
                        {ceo.title}
                      </p>
                      <span className="inline-block text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1">
                        {ceo.specialty}
                      </span>
                    </div>
                  </div>

                  {/* Assignment Status Badge */}
                  {assignedCompany ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {assignedCompany.code} CEO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Serbest Aday
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 italic line-clamp-2">
                  &ldquo;{ceo.bio}&rdquo;
                </p>

                {/* Quick Bonus Metric Ribbons */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      3 Gelir Bonusu Toplamı
                    </span>
                    <strong className="font-mono font-black text-emerald-900 text-sm">
                      +{currencySymbol}{totalIncomeBonus} / ürün
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-100">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block">
                      3 Gider İndirimi Toplamı
                    </span>
                    <strong className="font-mono font-black text-rose-900 text-sm">
                      -{currencySymbol}{totalExpenseBonus} / maliyet
                    </strong>
                  </div>
                </div>
              </div>

              {/* Card Body: The 3 Income and 3 Expense Skills */}
              <div className="p-5 space-y-4 flex-1">
                {/* 3 GELİR BONUSU BÖLÜMÜ */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                      3 Gelir Bonusu (Satış Artışı)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      3/3 Aktif
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {ceo.incomeSkills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs"
                      >
                        <div className="pr-2">
                          <strong className="text-slate-900 block font-bold text-[11px]">
                            {sIdx + 1}. {skill.name}
                          </strong>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {skill.description}
                          </span>
                        </div>
                        <span className="font-mono font-black text-emerald-800 text-xs px-1.5 py-0.5 rounded bg-emerald-100/90 shrink-0">
                          +{currencySymbol}{skill.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 GİDER BONUSU (TASARRUF) BÖLÜMÜ */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                      3 Gider Bonusu (Maliyet İndirimi)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                      3/3 Aktif
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {ceo.expenseSkills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-lg bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs"
                      >
                        <div className="pr-2">
                          <strong className="text-slate-900 block font-bold text-[11px]">
                            {sIdx + 1}. {skill.name}
                          </strong>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {skill.description}
                          </span>
                        </div>
                        <span className="font-mono font-black text-rose-800 text-xs px-1.5 py-0.5 rounded bg-rose-100/90 shrink-0">
                          -{currencySymbol}{Math.abs(skill.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Assignment Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Görevlendirme:</span>
                    <span className="font-semibold text-slate-800">
                      {assignedCompany ? `${assignedCompany.code} Fabrikası` : 'Boşta (Atama Bekliyor)'}
                    </span>
                  </div>

                  {/* Company Assignment Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {companies.map((comp) => {
                      const isCurrent = ceo.assignedCompanyId === comp.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => assignCeoToCompany(comp.id, ceo.id)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-900 text-amber-300 ring-2 ring-amber-400'
                              : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200'
                          }`}
                        >
                          <span>{comp.code}&apos;ye Ata</span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
