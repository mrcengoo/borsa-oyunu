import React from 'react';
import {
  Briefcase,
  TrendingUp,
  Globe,
  Sparkles,
  Lightbulb,
  Fuel,
  Users,
  Wrench,
  Landmark,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { CompanyConfig, CeoSkill } from '../../types/production';
import { useGame } from '../../context/GameContext';

interface CeoSkillsCardProps {
  company: CompanyConfig;
}

export function CeoSkillsCard({ company }: CeoSkillsCardProps) {
  const { setActiveTab, currencySymbol } = useGame();

  const incomeSkills = company.ceo.skills.filter((s) => s.category === 'income');
  const expenseSkills = company.ceo.skills.filter((s) => s.category === 'expense');

  const incomeTotal = incomeSkills.reduce((sum, s) => sum + s.value, 0);
  const expenseTotal = expenseSkills.reduce((sum, s) => sum + Math.abs(s.value), 0);

  const getSkillIcon = (type: CeoSkill['type']) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'export':
        return <Globe className="w-4 h-4 text-indigo-600" />;
      case 'marketing':
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      case 'rd':
        return <Lightbulb className="w-4 h-4 text-cyan-600" />;
      case 'oil_bonus':
        return <Fuel className="w-4 h-4 text-orange-600" />;
      case 'labor':
        return <Users className="w-4 h-4 text-amber-600" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-rose-600" />;
      case 'finance':
        return <Landmark className="w-4 h-4 text-sky-600" />;
      case 'logistics':
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <Briefcase className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSkillBadgeColor = (skill: CeoSkill) => {
    if (skill.category === 'income') {
      if (skill.type === 'oil_bonus') {
        return 'bg-orange-50 text-orange-700 border-orange-300 ring-2 ring-orange-100/80';
      }
      return 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100/80';
    }
    // Expense reductions
    return 'bg-rose-50 text-rose-700 border-rose-200 ring-2 ring-rose-100/70';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col gap-6">
      {/* Header with CEO Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-amber-700 text-amber-300 flex items-center justify-center shadow-xs border border-slate-700 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {company.ceo.name}
              </h3>
              <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                Aktif CEO
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {company.ceo.title} &bull; {company.name} Yönetimi
            </p>
          </div>
        </div>

        {/* Aggregate Badges & CEO switch action */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-300 font-bold shadow-2xs">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>3 Gelir Bonusu: +{currencySymbol}{incomeTotal}</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 px-3 py-1 rounded-lg border border-rose-300 font-bold shadow-2xs">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
            <span>3 Gider Tasarrufu: -{currencySymbol}{expenseTotal}</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('ceos')}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold font-mono transition-colors cursor-pointer"
          >
            CEO Kartları & Atama &rarr;
          </button>
        </div>
      </div>

      {/* 1. GELİR BONUSLARI SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              3 Gelir Bonusu (Satış Fiyatına Eklenir)
            </h4>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {incomeSkills.map((s) => `${s.name} +${s.value}`).join(' • ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {incomeSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    {getSkillIcon(skill.type)}
                    <span>{skill.name}</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-black px-2 py-0.5 rounded-md border shadow-2xs ${getSkillBadgeColor(
                      skill
                    )}`}
                  >
                    +{skill.value}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {skill.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Ürün Satış Fiyatına Eklenir</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. GİDER BONUSLARI SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              3 Gider Bonusu (Maliyet & Operasyonel Tasarruf)
            </h4>
          </div>
          <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            {expenseSkills.map((s) => `${s.name} ${s.value}`).join(' • ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {expenseSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-3.5 rounded-xl border border-rose-200/80 bg-gradient-to-b from-white to-rose-50/20 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    {getSkillIcon(skill.type)}
                    <span>{skill.name}</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-black px-2 py-0.5 rounded-md border shadow-2xs ${getSkillBadgeColor(
                      skill
                    )}`}
                  >
                    {skill.value}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {skill.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-rose-100 flex items-center gap-1 text-[10px] font-bold text-rose-700">
                <Percent className="w-3 h-3 text-rose-500 shrink-0" />
                <span>Maliyet İndirimi & Tasarruf</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mechanics Explanation Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700">Tam Satış Fiyatı Formülü:</span>
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold border border-slate-300">
            Taban Maliyet
          </span>
          <span className="font-bold text-emerald-700">+ 3 Gelir Bonusu (+{incomeTotal})</span>
          <span className="font-bold text-rose-700">- 3 Gider Bonusu (-{expenseTotal})</span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-mono font-black border border-emerald-300">
            = Tam Satış Fiyatı
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          *Satış geliri doğrudan {company.code} şirket kasasına aktarılır
        </span>
      </div>
    </div>
  );
}

