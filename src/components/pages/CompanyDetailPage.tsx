import React from 'react';
import {
  Building2,
  Factory,
  Package,
  TrendingUp,
  Coins,
  Clock,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  UserCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CompanyOverviewCard } from '../production/CompanyOverviewCard';
import { CeoSkillsCard } from '../production/CeoSkillsCard';
import { ProductionSection } from '../production/ProductionSection';
import { InventorySection } from '../production/InventorySection';
import { ProductionLogsCard } from '../production/ProductionLogsCard';
import { RawMaterialProduct } from '../../types/production';

export function CompanyDetailPage() {
  const {
    companies,
    selectedCompany,
    setSelectedCompanyId,
    getCompanyInventory,
    sellProduct,
    toggleProductionLine,
    fastForwardLine,
    isFactoryRunning,
    setIsFactoryRunning,
    currency,
    recentTransactions,
    setActiveTab,
  } = useGame();

  const inventoryState = getCompanyInventory(selectedCompany.id);

  const handleSellProduct = (product: RawMaterialProduct, quantity: number) => {
    sellProduct(selectedCompany.id, product.id, quantity);
  };

  const handleToggleLine = (productId: string) => {
    toggleProductionLine(selectedCompany.id, productId);
  };

  const handleFastForward = (seconds: number = 15) => {
    fastForwardLine(selectedCompany.id, seconds);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Company Selector Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('companies')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Tüm Şirketler</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
            {selectedCompany.name}
          </span>
        </div>

        {/* Company Quick-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-500 font-bold mr-1 hidden md:inline">
            Aktif Fabrika:
          </span>
          {companies.map((comp) => {
            const isSelected = comp.id === selectedCompany.id;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => setSelectedCompanyId(comp.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{comp.code}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Company Overview Header & Financial Balance */}
      <CompanyOverviewCard
        company={selectedCompany}
        inventoryState={inventoryState}
        isFactoryRunning={isFactoryRunning}
        onToggleFactory={() => setIsFactoryRunning((prev) => !prev)}
        onFastForward={handleFastForward}
        onResetGame={() => {}}
        currency={currency}
      />

      {/* 2. CEO Skills Matrix (4 Expense Savings + 4 Bonus Incomes + Special Skill) */}
      <CeoSkillsCard company={selectedCompany} />

      {/* 3. Real-Time Production Lines (Duration, Cost, Live Progress Bar) */}
      <ProductionSection
        company={selectedCompany}
        inventoryState={inventoryState}
        onToggleLineAuto={handleToggleLine}
        onRestartLine={() => {}}
        currency={currency}
      />

      {/* 4. Company Inventory & Selling Panel (Current Stock, Step-by-Step Price Breakdown, Sell Buttons) */}
      <InventorySection
        company={selectedCompany}
        inventoryState={inventoryState}
        onSellProduct={handleSellProduct}
        currency={currency}
      />

      {/* 5. Company Transaction Logs */}
      <ProductionLogsCard logs={recentTransactions} currency={currency} />
    </div>
  );
}
