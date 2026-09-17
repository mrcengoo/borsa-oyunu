export type Timeframe = '1G' | '1H' | '1A' | '1Y';

export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  currency: string;
  price: number;
  changePercent: number;
  changeAmount: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  marketCap: string;
  marketCapTr: string;
  revenue: string;
  netIncome: string;
  debt: string;
  investment: string;
  sharesOutstanding: string;
  lastUpdated: string;
  timeframeData: Record<Timeframe, number[]>;
  cardNumber?: string;
  rarity?: 'MİTİK' | 'EFSANEVİ' | 'ULTRA NADİR' | 'DESTANSI';
  cardClass?: string;
  powerScore?: number;
  dataFeedStatus?: 'LIVE' | 'DELAYED';
  dataFeedLabel?: string;
  // MTG (Magic: The Gathering) Authentic Card Attributes
  mtgManaCost?: string[]; // e.g. ['4', 'U', 'U']
  mtgTypeLine?: string; // e.g. 'Efsanevi Eser Yaratık — Yapay Zekâ Hükümdarı'
  mtgKeywords?: string[]; // e.g. ['Acele (Haste)', 'Koruma (Ward {3})']
  mtgAbilities?: { cost?: string; trigger?: string; text: string }[];
  mtgFlavorText?: string;
  mtgPowerToughness?: string; // e.g. '9 / 9'
  mtgColorIdentity?: 'blue' | 'white' | 'green' | 'red' | 'black' | 'gold' | 'artifact';
  mtgRarity?: 'Mythic' | 'Rare';
  mtgCollectorNumber?: string;
  theme: {
    accentColor: string;
    borderGlow: string;
    gradientFrom: string;
    gradientTo: string;
    badgeBg: string;
    foilStyle?: string;
  };
}
