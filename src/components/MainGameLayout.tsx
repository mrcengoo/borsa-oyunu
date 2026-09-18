import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameNavigation } from './navigation/GameNavigation';
import { OverviewPage } from './pages/OverviewPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { CeosPage } from './pages/CeosPage';
import { BuyersPage } from './pages/BuyersPage';
import { MarketPage } from './pages/MarketPage';

export function MainGameLayout() {
  const { activeTab, toastMessage } = useGame();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-300 selection:text-slate-950">
      {/* Persistent Top Navigation Bar */}
      <GameNavigation />

      {/* Main Multi-Page Screen Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'companies' && <CompaniesPage />}
        {activeTab === 'company_detail' && <CompanyDetailPage />}
        {activeTab === 'ceos' && <CeosPage />}
        {activeTab === 'buyers' && <BuyersPage />}
        {activeTab === 'market' && <MarketPage />}

        {/* Global Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Sanayi & Piyasa Strateji Oyunu &bull; Çok Şirketli Endüstriyel Simülasyon
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>ARZ Hammadde</span>
            <span>&bull;</span>
            <span>MTRX Yüksek Teknoloji</span>
            <span>&bull;</span>
            <span>BIOX Biyofarma</span>
            <span>&bull;</span>
            <span>KRON Ağır Sanayi</span>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
            <div className="bg-slate-950/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 backdrop-blur-md text-xs font-medium">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-100">{toastMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
