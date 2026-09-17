import React from 'react';

export interface ManaSymbolProps {
  key?: React.Key;
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MtgManaSymbol({ symbol, size = 'md', className = '' }: ManaSymbolProps) {
  const sym = symbol.toUpperCase().replace(/[{}]/g, '');

  const sizeClasses = {
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-5 h-5 text-[11px]',
    lg: 'w-6 h-6 text-[13px]',
  }[size];

  // White (Plains / Sun)
  if (sym === 'W') {
    return (
      <span
        title="White Mana {W}"
        className={`inline-flex items-center justify-center rounded-full bg-[#f8f5df] border border-[#d6cb9a] shadow-xs text-amber-900 font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-amber-700">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  // Blue (Island / Water Droplet)
  if (sym === 'U') {
    return (
      <span
        title="Blue Mana {U}"
        className={`inline-flex items-center justify-center rounded-full bg-[#c2ddef] border border-[#8ebdd8] shadow-xs text-sky-950 font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-sky-800">
          <path d="M12 2.5C12 2.5 5 12 5 16.5C5 20.1 8.1 23 12 23C15.9 23 19 20.1 19 16.5C19 12 12 2.5 12 2.5Z" />
        </svg>
      </span>
    );
  }

  // Black (Swamp / Skull)
  if (sym === 'B') {
    return (
      <span
        title="Black Mana {B}"
        className={`inline-flex items-center justify-center rounded-full bg-[#bab2af] border border-[#7d7370] shadow-xs text-stone-950 font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-stone-900">
          <path d="M12 3C7.5 3 4.5 6.5 4.5 11.5C4.5 14.5 6.2 16.5 8 18V21H16V18C17.8 16.5 19.5 14.5 19.5 11.5C19.5 6.5 16.5 3 12 3ZM9 12C8.2 12 7.5 11.3 7.5 10.5C7.5 9.7 8.2 9 9 9C9.8 9 10.5 9.7 10.5 10.5C10.5 11.3 9.8 12 9 12ZM15 12C14.2 12 13.5 11.3 13.5 10.5C13.5 9.7 14.2 9 15 9C15.8 9 16.5 9.7 16.5 10.5C16.5 11.3 15.8 12 15 12Z" />
        </svg>
      </span>
    );
  }

  // Red (Mountain / Fire)
  if (sym === 'R') {
    return (
      <span
        title="Red Mana {R}"
        className={`inline-flex items-center justify-center rounded-full bg-[#f7b79d] border border-[#d67b58] shadow-xs text-red-950 font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-red-800">
          <path d="M12 2C10 5.5 14 8 11 12C9 9 8 11 8 13C8 16.5 10.5 22 14.5 22C18.5 22 20 18 20 14.5C20 9 14 5 12 2Z" />
          <path d="M9 16C9 18 10.5 20.5 12.5 20.5C14.5 20.5 15 19 15 17.5C15 15 11 13 9 16Z" fill="#ffedd5" />
        </svg>
      </span>
    );
  }

  // Green (Forest / Tree)
  if (sym === 'G') {
    return (
      <span
        title="Green Mana {G}"
        className={`inline-flex items-center justify-center rounded-full bg-[#b8dbb3] border border-[#78ab71] shadow-xs text-emerald-950 font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-emerald-800">
          <path d="M12 2C9 6 6 8 6 12C6 15 8 17 10 18V22H14V18C16 17 18 15 18 12C18 8 15 6 12 2Z" />
          <circle cx="12" cy="11" r="2" fill="#ecfdf5" />
        </svg>
      </span>
    );
  }

  // Colorless / Eldrazi (Diamond)
  if (sym === 'C') {
    return (
      <span
        title="Colorless Mana {C}"
        className={`inline-flex items-center justify-center rounded-full bg-[#d0cbbf] border border-[#9b9385] shadow-xs text-stone-900 font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-stone-800">
          <path d="M12 2L18.5 12L12 22L5.5 12L12 2Z" />
        </svg>
      </span>
    );
  }

  // Tap Symbol {T}
  if (sym === 'T') {
    return (
      <span
        title="Tap Symbol {T}"
        className={`inline-flex items-center justify-center rounded-full bg-stone-300 border border-stone-400 shadow-xs text-stone-900 font-black shrink-0 ${sizeClasses} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 fill-none stroke-stone-900 stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16V9a4 4 0 0 1 8 0v7" />
          <path d="M11 13l4 3 4-3" />
        </svg>
      </span>
    );
  }

  // Generic Mana / Numbers (e.g. 1, 2, 3, 4, 5, X)
  return (
    <span
      title={`Mana {${sym}}`}
      className={`inline-flex items-center justify-center rounded-full bg-[#ccc2b3] border border-[#a39886] shadow-xs text-stone-900 font-black font-serif shrink-0 select-none ${sizeClasses} ${className}`}
    >
      {sym}
    </span>
  );
}
