import React from 'react';

export interface MtgSetSymbolProps {
  key?: React.Key;
  rarity?: 'Mythic' | 'Rare' | 'Uncommon' | 'Common' | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function MtgSetSymbol({ rarity = 'Mythic', size = 'md', className = '' }: MtgSetSymbolProps) {
  const isMythic = rarity.toUpperCase().includes('MİT') || rarity.toUpperCase().includes('MYTH');

  const dims = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  if (isMythic) {
    // Mythic Rare: Orange / Red / Gold radiant metallic gradient
    return (
      <div
        title="Mythic Rare (BORS Genişleme Paketi)"
        className={`inline-flex items-center justify-center relative shrink-0 ${dims} ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
          <defs>
            <linearGradient id="mythicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L15 6L21 8L17 13L18 20L12 17L6 20L7 13L3 8L9 6L12 2Z"
            fill="url(#mythicGrad)"
            stroke="#451a03"
            strokeWidth="1.2"
          />
          <circle cx="12" cy="11" r="2.5" fill="#fef08a" />
        </svg>
      </div>
    );
  }

  // Rare: Gold / Yellow / Bronze
  return (
    <div
      title="Rare (BORS Genişleme Paketi)"
      className={`inline-flex items-center justify-center relative shrink-0 ${dims} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-xs">
        <defs>
          <linearGradient id="rareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <path
          d="M12 2L15 6L21 8L17 13L18 20L12 17L6 20L7 13L3 8L9 6L12 2Z"
          fill="url(#rareGrad)"
          stroke="#451a03"
          strokeWidth="1.2"
        />
        <circle cx="12" cy="11" r="2.5" fill="#fffbeb" />
      </svg>
    </div>
  );
}
