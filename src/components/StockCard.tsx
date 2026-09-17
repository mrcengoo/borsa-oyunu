import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Edit3,
  Flame,
  Sparkles,
  Award,
  Layers,
  Shield,
  Activity,
  Zap,
} from 'lucide-react';
import { StockData, Timeframe } from '../types';
import { Sparkline } from './Sparkline';
import { MtgManaSymbol } from './MtgManaSymbol';
import { MtgSetSymbol } from './MtgSetSymbol';
import { MtgCardArt } from './MtgCardArt';

interface StockCardProps {
  key?: string;
  stock: StockData;
  currency: 'USD' | 'TRY';
  usdRate: number;
  onRefresh?: (symbol: string) => void;
  onEdit?: (stock: StockData) => void;
  isAutoStreaming?: boolean;
}

const getMtgFrameStyles = (color?: string) => {
  switch (color) {
    case 'artifact':
      return {
        cardBorder: 'border-[#71717a]',
        cardBg: 'bg-gradient-to-b from-[#3f3f46] via-[#27272a] to-[#18181b]',
        headerBg: 'bg-gradient-to-r from-[#52525b] via-[#3f3f46] to-[#27272a] text-[#f4f4f5] border-[#71717a]',
        typeBg: 'bg-gradient-to-r from-[#52525b] via-[#3f3f46] to-[#27272a] text-[#f4f4f5] border-[#71717a]',
        ptBox: 'bg-[#27272a] text-[#f4f4f5] border-[#71717a]',
        badgeText: 'text-[#e4e4e7]',
      };
    case 'blue':
      return {
        cardBorder: 'border-[#38bdf8]',
        cardBg: 'bg-gradient-to-b from-[#0c4a6e] via-[#082f49] to-[#031d30]',
        headerBg: 'bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#075985] text-[#f0f9ff] border-[#38bdf8]',
        typeBg: 'bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#075985] text-[#f0f9ff] border-[#38bdf8]',
        ptBox: 'bg-[#082f49] text-[#e0f2fe] border-[#38bdf8]',
        badgeText: 'text-[#bae6fd]',
      };
    case 'green':
      return {
        cardBorder: 'border-[#34d399]',
        cardBg: 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#011a14]',
        headerBg: 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#065f46] text-[#ecfdf5] border-[#34d399]',
        typeBg: 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#065f46] text-[#ecfdf5] border-[#34d399]',
        ptBox: 'bg-[#064e3b] text-[#d1fae5] border-[#34d399]',
        badgeText: 'text-[#a7f3d0]',
      };
    case 'white':
      return {
        cardBorder: 'border-[#fef08a]',
        cardBg: 'bg-gradient-to-b from-[#453d32] via-[#2d2821] to-[#1c1917]',
        headerBg: 'bg-gradient-to-r from-[#786b58] via-[#8c7e68] to-[#5e5344] text-[#fffbeb] border-[#fef08a]',
        typeBg: 'bg-gradient-to-r from-[#786b58] via-[#8c7e68] to-[#5e5344] text-[#fffbeb] border-[#fef08a]',
        ptBox: 'bg-[#383228] text-[#fef9c3] border-[#fef08a]',
        badgeText: 'text-[#fef08a]',
      };
    case 'red':
      return {
        cardBorder: 'border-[#f87171]',
        cardBg: 'bg-gradient-to-b from-[#7f1d1d] via-[#450a0a] to-[#280505]',
        headerBg: 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#991b1b] text-[#fef2f2] border-[#f87171]',
        typeBg: 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#991b1b] text-[#fef2f2] border-[#f87171]',
        ptBox: 'bg-[#450a0a] text-[#fee2e2] border-[#f87171]',
        badgeText: 'text-[#fca5a5]',
      };
    case 'black':
      return {
        cardBorder: 'border-[#a1a1aa]',
        cardBg: 'bg-gradient-to-b from-[#3f3f46] via-[#27272a] to-[#111113]',
        headerBg: 'bg-gradient-to-r from-[#3f3f46] via-[#52525b] to-[#27272a] text-[#fafafa] border-[#a1a1aa]',
        typeBg: 'bg-gradient-to-r from-[#3f3f46] via-[#52525b] to-[#27272a] text-[#fafafa] border-[#a1a1aa]',
        ptBox: 'bg-[#18181b] text-[#f4f4f5] border-[#a1a1aa]',
        badgeText: 'text-[#d4d4d8]',
      };
    case 'gold':
    default:
      return {
        cardBorder: 'border-[#f59e0b]',
        cardBg: 'bg-gradient-to-b from-[#452e0a] via-[#2b1c06] to-[#170e02]',
        headerBg: 'bg-gradient-to-r from-[#855314] via-[#a16207] to-[#713f12] text-[#fffbeb] border-[#f59e0b]',
        typeBg: 'bg-gradient-to-r from-[#855314] via-[#a16207] to-[#713f12] text-[#fffbeb] border-[#f59e0b]',
        ptBox: 'bg-[#362106] text-[#fef3c7] border-[#f59e0b]',
        badgeText: 'text-[#fde68a]',
      };
  }
};

export function StockCard({
  stock,
  currency,
  usdRate,
  onRefresh,
  onEdit,
}: StockCardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1G');
  const [isUpdating, setIsUpdating] = useState(false);
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);
  const [prevPrice, setPrevPrice] = useState(stock.price);
  const [historyCache, setHistoryCache] = useState<Partial<Record<Timeframe, number[]>>>({});

  // Trigger brief highlight flash when price changes
  useEffect(() => {
    if (stock.price !== prevPrice) {
      if (stock.price > prevPrice) {
        setFlashColor('green');
      } else {
        setFlashColor('red');
      }
      setPrevPrice(stock.price);
      const timer = setTimeout(() => setFlashColor(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [stock.price, prevPrice]);

  // Dynamically load historical market points for selected timeframe
  useEffect(() => {
    if (selectedTimeframe === '1G') return;
    if (historyCache[selectedTimeframe]) return;

    let range = '5d';
    let interval = '1h';
    if (selectedTimeframe === '1A') {
      range = '1mo';
      interval = '1d';
    } else if (selectedTimeframe === '1Y') {
      range = '1y';
      interval = '1wk';
    }

    fetch(`/api/stocks/${stock.symbol}/history?range=${range}&interval=${interval}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.points && data.points.length > 3) {
          setHistoryCache((prev) => ({ ...prev, [selectedTimeframe]: data.points }));
        }
      })
      .catch(() => {});
  }, [selectedTimeframe, stock.symbol, historyCache]);

  const mult = currency === 'TRY' ? usdRate : 1;
  const currencySym = currency === 'TRY' ? '₺' : '$';

  const formatMoney = (usdVal: number) => {
    const val = usdVal * mult;
    return val.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isPositive = stock.changePercent >= 0;
  const timeframeList: Timeframe[] = ['1G', '1H', '1A', '1Y'];
  const chartData =
    historyCache[selectedTimeframe] ||
    stock.timeframeData[selectedTimeframe] ||
    stock.timeframeData['1G'];

  const handleSingleRefresh = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    if (onRefresh) {
      onRefresh(stock.symbol);
    }
    setTimeout(() => setIsUpdating(false), 500);
  };

  const frameStyles = getMtgFrameStyles(stock.mtgColorIdentity);
  const manaCost = stock.mtgManaCost || ['3', 'C'];
  const typeLine = stock.mtgTypeLine || `Efsanevi Eser — ${stock.name}`;
  const keywords = stock.mtgKeywords || ['Piyasa Gücü (Haste)'];
  const abilities = stock.mtgAbilities || [
    {
      cost: '{T}, {2}',
      text: `${stock.name}: Wall Street derinliğinden sermaye topla ve ${stock.revenue} ciro üret.`,
    },
  ];
  const flavorText =
    stock.mtgFlavorText || `“${stock.sector} alanının öncü devi.”`;
  const powerToughness = stock.mtgPowerToughness || `${Math.floor(stock.powerScore ? stock.powerScore / 10 : 8)} / ${Math.floor(stock.powerScore ? stock.powerScore / 10 : 8)}`;
  const collectorNo = stock.mtgCollectorNumber || `${stock.cardNumber?.replace('#', '') || '001/009'} M`;

  return (
    <div
      className={`relative rounded-[20px] p-2 sm:p-2.5 bg-[#12100e] border-[3px] border-[#292524] shadow-2xl transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] flex flex-col font-serif select-none ${
        flashColor === 'green'
          ? 'ring-4 ring-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
          : flashColor === 'red'
          ? 'ring-4 ring-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.5)]'
          : 'hover:border-amber-500/60'
      }`}
    >
      {/* Inner Colored Beveled Card Frame */}
      <div
        className={`rounded-[14px] p-2 flex flex-col flex-1 border ${frameStyles.cardBorder} ${frameStyles.cardBg} shadow-inner`}
      >
        {/* TOP HEADER BAR: MTG Card Name & Mana Cost / Real Price */}
        <div
          className={`px-3 py-1.5 rounded-lg border flex items-center justify-between gap-2 shadow-xs mb-2 ${frameStyles.headerBg}`}
        >
          {/* Card Title & Symbol */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-black text-sm sm:text-[15px] tracking-tight truncate drop-shadow-xs text-white">
              {stock.symbol}
            </span>
            <span className="text-[11px] font-medium opacity-90 truncate hidden sm:inline text-amber-200/90">
              • {stock.name.split(' ')[0]}
            </span>
          </div>

          {/* Mana Cost & Current Live Price */}
          <div className="flex items-center gap-2 shrink-0">
            {/* MTG Mana Pips */}
            <div className="flex items-center gap-0.5">
              {manaCost.map((mana, i) => (
                <MtgManaSymbol key={i} symbol={mana} size="sm" />
              ))}
            </div>

            {/* Prominent Stock Price Badge */}
            <div
              className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold transition-colors duration-300 flex items-center gap-1 shadow-2xs ${
                flashColor === 'green'
                  ? 'bg-emerald-500 text-slate-950 font-black scale-105'
                  : flashColor === 'red'
                  ? 'bg-rose-500 text-white font-black scale-105'
                  : isPositive
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
              }`}
            >
              <span>
                {currencySym}
                {formatMoney(stock.price)}
              </span>
            </div>
          </div>
        </div>

        {/* ART FRAME WINDOW (Illustration) */}
        <div className="relative w-full h-44 sm:h-48 rounded-lg overflow-hidden border-2 border-[#1c1917] shadow-inner bg-black shrink-0">
          {/* Detailed Graphic Art for the Company */}
          <MtgCardArt
            symbol={stock.symbol}
            name={stock.name}
            colorIdentity={stock.mtgColorIdentity}
          />

          {/* Floating MTG Overlay: Live/Delayed Feed & Daily Change */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border ${
                stock.dataFeedStatus === 'LIVE'
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                  : 'bg-slate-950/90 text-amber-300 border-amber-500/60'
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />
              {stock.dataFeedStatus || 'DELAYED'}
            </span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-black backdrop-blur-md shadow-xs border flex items-center gap-0.5 ${
                isPositive
                  ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/60'
                  : 'bg-rose-950/90 text-rose-400 border-rose-500/60'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isPositive ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>

          {/* Bottom Art Overlay Bar: Sector & Last Updated */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2.5 py-1.5 flex items-center justify-between text-[10px] text-slate-300 z-20">
            <span className="truncate max-w-[200px] font-medium text-amber-200/90">
              {stock.sector}
            </span>
            <span className="font-mono text-slate-400">
              Saat: <strong className="text-white">{stock.lastUpdated}</strong>
            </span>
          </div>
        </div>

        {/* TYPE LINE BAR: Creature / Artifact Type & Expansion Symbol */}
        <div
          className={`px-3 py-1 mt-2 rounded-lg border flex items-center justify-between gap-2 shadow-xs ${frameStyles.typeBg}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-xs sm:text-[13px] tracking-tight truncate text-white drop-shadow-xs">
              {typeLine}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold hidden sm:inline">
              {stock.exchange}
            </span>
            <MtgSetSymbol rarity={stock.mtgRarity || 'Mythic'} size="sm" />
          </div>
        </div>

        {/* ORACLE RULES TEXT BOX (Authentic MTG Parchment) */}
        <div className="mt-2 rounded-lg p-3 bg-[#f5efe3] border-2 border-[#8a7559] text-[#1c1917] shadow-inner flex flex-col justify-between flex-1 relative overflow-hidden">
          {/* Subtle Mana Watermark in Background */}
          <div className="absolute right-2 bottom-2 pointer-events-none opacity-10 select-none">
            <Award className="w-28 h-28 text-[#78350f]" />
          </div>

          {/* Keywords Line */}
          <div className="text-[12px] font-black italic tracking-wide text-[#78350f] mb-1.5">
            {keywords.join(' • ')}
          </div>

          {/* MTG Abilities Rules Text */}
          <div className="space-y-1.5 text-[11px] leading-relaxed text-[#292524] relative z-10 font-sans">
            {abilities.map((ability, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                {ability.cost && (
                  <span className="inline-flex items-center gap-1 shrink-0 font-bold bg-[#e7dfcf] px-1.5 py-0.5 rounded border border-[#c4b59f] text-[10px] text-stone-900">
                    <MtgManaSymbol symbol="T" size="sm" />
                    {ability.cost.includes('2') && (
                      <MtgManaSymbol symbol="2" size="sm" />
                    )}
                    {ability.cost.includes('3') && (
                      <MtgManaSymbol symbol="3" size="sm" />
                    )}
                    {ability.cost.includes('4') && (
                      <MtgManaSymbol symbol="4" size="sm" />
                    )}
                    {ability.cost.includes('B') && (
                      <MtgManaSymbol symbol="B" size="sm" />
                    )}
                    {ability.cost.includes('W') && (
                      <MtgManaSymbol symbol="W" size="sm" />
                    )}
                    {ability.cost.includes('R') && (
                      <MtgManaSymbol symbol="R" size="sm" />
                    )}
                  </span>
                )}
                <span className="mt-0.5">
                  {ability.trigger && (
                    <strong className="font-bold text-[#78350f] mr-1">
                      {ability.trigger} —
                    </strong>
                  )}
                  {ability.text}
                </span>
              </div>
            ))}
          </div>

          {/* INTEGRATED MTG MANA CURVE (Sparkline Performance Chart) */}
          <div className="mt-2.5 pt-2 border-t border-[#d6c7b2] relative z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78350f] flex items-center gap-1 font-sans">
                <Zap className="w-3 h-3 text-amber-700" />
                Piyasa Dalgası ({selectedTimeframe})
              </span>
              <div className="flex items-center gap-1">
                {timeframeList.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTimeframe(tf);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-[#451a03] text-amber-100 shadow-2xs'
                        : 'text-[#78350f] hover:bg-[#e7dfcf]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-11 w-full bg-[#ebe3d3] rounded-md p-1 border border-[#c9baa4]">
              <Sparkline
                data={chartData}
                isPositive={isPositive}
                color={isPositive ? '#059669' : '#dc2626'}
                height={36}
              />
            </div>
          </div>

          {/* 6 ARTIFACT FINANCIAL RUNES MATRIX */}
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px] font-sans relative z-10 pt-1.5 border-t border-[#d6c7b2]">
            <div className="bg-[#ede4d4] p-1 rounded border border-[#d6c7b2]">
              <span className="block text-[9px] text-[#78350f] font-semibold">
                Piyasa Değeri
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {currency === 'TRY' ? stock.marketCapTr : stock.marketCap}
              </span>
            </div>
            <div className="bg-[#ede4d4] p-1 rounded border border-[#d6c7b2]">
              <span className="block text-[9px] text-[#78350f] font-semibold">
                Ciro (TTM)
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {stock.revenue}
              </span>
            </div>
            <div className="bg-[#ede4d4] p-1 rounded border border-[#d6c7b2]">
              <span className="block text-[9px] text-[#78350f] font-semibold">
                Net Kâr
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {stock.netIncome}
              </span>
            </div>
            <div className="bg-[#ede4d4] p-1 rounded border border-[#d6c7b2]">
              <span className="block text-[9px] text-[#78350f] font-semibold">
                Toplam Borç
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {stock.debt}
              </span>
            </div>
            <div className="bg-[#ede4d4] p-1 rounded border border-[#d6c7b2]">
              <span className="block text-[9px] text-[#78350f] font-semibold">
                Yatırım (Ar-Ge)
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {stock.investment}
              </span>
            </div>
            <div className="bg-[#ede4d4] p-1 rounded border border-[#d6c7b2]">
              <span className="block text-[9px] text-[#78350f] font-semibold">
                Tedavüldeki Hisse
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {stock.sharesOutstanding}
              </span>
            </div>
          </div>

          {/* FLAVOR TEXT (İtalik Hikaye Metni) */}
          <div className="mt-2 pt-1.5 border-t border-[#d6c7b2] text-[10px] italic text-[#57534e] leading-snug">
            {flavorText}
          </div>
        </div>

        {/* BOTTOM FRAME BAR: Collector Number, Holo Foil Stamp & Power/Toughness Plaque */}
        <div className="mt-2.5 flex items-center justify-between gap-2 relative">
          {/* Left: Collector Number & Artist / Copyright */}
          <div className="text-[9px] font-mono text-slate-400 truncate max-w-[180px]">
            <div className="text-white font-bold">{collectorNo}</div>
            <div className="text-slate-400 text-[8px] truncate">
              ™ & © 2026 Wizards of Wall Street
            </div>
          </div>

          {/* Center: Iconic MTG Holographic Oval Foil Stamp */}
          <div
            title="Holographic Security Stamp"
            className="w-5 h-3.5 rounded-full bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-300 border border-white/60 shadow-md transform hover:scale-125 transition-transform duration-300 shrink-0"
          />

          {/* Right: POWER / TOUGHNESS (P/T) EMBLEM */}
          <div
            className={`px-3 py-1 rounded-lg border-2 font-serif font-black text-sm tracking-wider shadow-md shrink-0 ${frameStyles.ptBox}`}
          >
            {powerToughness}
          </div>
        </div>

        {/* MTG ACTIONS: Tap to Refresh & Scribe / Edit */}
        <div className="mt-2.5 pt-2 border-t border-black/40 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSingleRefresh}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200 border border-stone-700 text-xs font-bold font-sans transition-all active:scale-95 disabled:opacity-50 shadow-xs"
            title="Dokunarak Fiyatı Güncelle (Tap to Refresh)"
          >
            <MtgManaSymbol symbol="T" size="sm" />
            <span>Fiyatı Yenile</span>
            <RefreshCw
              className={`w-3 h-3 ml-0.5 text-amber-400 ${
                isUpdating ? 'animate-spin' : ''
              }`}
            />
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(stock)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-slate-300 hover:text-white border border-stone-700 text-xs font-medium font-sans transition-all active:scale-95 shadow-xs"
              title="Kartı Düzenle (Scribe / Edit)"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Düzenle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
