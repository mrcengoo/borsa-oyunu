import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Factory,
  TrendingUp,
  Coins,
  Play,
  Pause,
  Sparkles,
  Users,
  ShoppingCart,
  Clock,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameNavTab } from '../../types/production';

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function GameNavigation() {
  const {
    activeTab,
    setActiveTab,
    playerTotalCash,
    currency,
    setCurrency,
    currencySymbol,
    selectedCompany,
    isTimeRunning,
    toggleTimeRunning,
    elapsedSeconds,
  } = useGame();

  const navItems: { id: GameNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'GENEL BAKIŞ', icon: LayoutDashboard },
    { id: 'companies', label: '4 ÜRETİM ŞİRKETİ', icon: Building2, badge: '4' },
    {
      id: 'company_detail',
      label: `ŞİRKET DETAYI (${selectedCompany.code})`,
      icon: Factory,
    },
    { id: 'ceos', label: 'CEO KARTLARI & ATAMA', icon: Users, badge: '6' },
    { id: 'buyers', label: 'ALICI ŞİRKETLER', icon: ShoppingCart, badge: 'Sektörel' },
    { id: 'market', label: 'PİYASA', icon: TrendingUp, badge: 'Canlı' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Utility & Status Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-slate-800/80 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-inner border border-amber-300/40">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide text-white uppercase">
                  SANAYİ & PİYASA
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GERÇEK ZAMANLI SİMÜLASYON
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Zamana Göre Akan Endüstriyel Üretim ve Emtia Pazarı
              </p>
            </div>
          </div>

          {/* Real-time Time Engine Control & Treasury */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Continuous Real-Time Flow Controller */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700">
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-black text-white">{formatElapsed(elapsedSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={toggleTimeRunning}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  isTimeRunning
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                }`}
                title={isTimeRunning ? 'Sistemi duraklat' : 'Zaman akışını devam ettir'}
              >
                {isTimeRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <Pause className="w-3 h-3" />
                    <span className="hidden sm:inline">Durdur</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <Play className="w-3 h-3" />
                    <span className="hidden sm:inline">Devam Et</span>
                  </>
                )}
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setCurrency('TRY')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  currency === 'TRY'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ₺ TRY
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  currency === 'USD'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Total Treasury Widget */}
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Coins className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <span className="text-[10px] text-amber-300/80 uppercase font-mono block leading-none">
                  Toplam Kasa
                </span>
                <span className="font-mono font-black text-sm text-amber-300">
                  {currencySymbol}{playerTotalCash.toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Multi-Page Navigation Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-900'
                        : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
