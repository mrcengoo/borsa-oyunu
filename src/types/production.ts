export const MAX_STOCK_CAPACITY = 100;
export const STOCK_VALUATION_PER_UNIT = 0.3;

export interface RawMaterialProduct {
  id: string;
  name: string;
  category: string;
  icon: string; // 'cement' | 'oil' | 'steel' | 'copper' | 'wafer' | 'chip' | 'memory' | 'api' | 'polymer' | 'bio' | 'carbon' | 'titanium' | 'battery'
  productionCost: number;
  durationSeconds: number;
  baseSellPrice: number;
  unit: string; // e.g. 'Ton', 'Varil', 'Plaka', 'Adet', 'Kg', 'Rulo', 'Paket'
  description: string;
  isSpecialOil?: boolean;
}

export type SkillCategory = 'income' | 'expense';

export interface CeoSkill {
  id: string;
  name: string;
  value: number;
  description: string;
  category: SkillCategory; // 'income' | 'expense'
  type: string;
}

export interface CeoCardData {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialty: string;
  bio: string;
  assignedCompanyId?: string | null;
  incomeSkills: CeoSkill[]; // Exactly 3 Gelir Bonusu
  expenseSkills: CeoSkill[]; // Exactly 3 Gider Bonusu
}

export interface CompanyConfig {
  id: string;
  code: string;
  name: string;
  fullName: string;
  industry: string;
  tagline: string;
  initialCash: number;
  badge: string;
  color: {
    primary: string;
    secondary: string;
    border: string;
    bgGradient: string;
  };
  ceo: {
    name: string;
    title: string;
    skills: CeoSkill[];
  };
  products: RawMaterialProduct[]; // Exactly 3 products per company
}

export interface BuyerDemand {
  productId: string;
  productName: string;
  unit: string;
  offeredPrice: number;
  targetContractQty: number;
  fulfilledQty: number;
}

export interface BuyerRecipeRequirement {
  productId: string;
  productName: string;
  unit: string;
  requiredQty: number;
}

export interface BuyerCraftedProduct {
  name: string;
  description: string;
  unit: string;
  producedCount: number;
  totalCost: number;
  unitCost: number;
  requirements: BuyerRecipeRequirement[];
  currentMaterials: Record<string, number>;
}

export interface BuyerCompany {
  id: string;
  code: string;
  ticker: string;
  name: string;
  fullName: string;
  industry: string;
  tagline: string;
  logoBg: string;
  rating: string;
  marketCap: string;
  // Gerçek ve Güncel Borsa / Piyasa Fiyatı
  stockPrice: number;
  previousStockPrice: number;
  priceChange: number;
  priceChangePercent: number;
  priceHistory: number[];
  dayHigh?: number;
  dayLow?: number;
  volume?: string;
  lastUpdatedTime?: string;
  isProcurementActive: boolean; // Fiyat yükselirse true (alım yapar), düşerse false (alım durdurulur)
  procurementStatus: 'active' | 'halted';
  procurementStatusReason: string;
  lastProcuredProduct?: string;
  lastProcuredQty?: number;
  totalPurchasedValue: number;
  contractBonusReward: number;
  contractCompleted: boolean;
  demands: BuyerDemand[];
  craftedProduct?: BuyerCraftedProduct;
}

export interface ProductLineStatus {
  productId: string;
  productName: string;
  totalDurationSeconds: number;
  remainingSeconds: number;
  isAutoProducing: boolean;
  isActive: boolean;
  completedBatches: number;
  statusReason?: string;
}

export interface CompanyStockInfo {
  companyId: string;
  code: string;
  name: string;
  stockPrice: number; // Hisse fiyatı (başlangıç 100 TL)
  previousStockPrice: number;
  priceChange: number;
  priceChangePercent: number;
  priceHistory: number[];
  totalSalesVolume: number;
  totalSalesRevenue: number;
  waitingStockCount?: number;
  waitingStockBonus?: number;
}

export interface CompanyInventoryState {
  cash: number;
  stock: Record<string, number>;
  lines: Record<string, ProductLineStatus>;
  totalProduced: Record<string, number>;
  totalSold: Record<string, number>;
  totalRevenue: number;
  totalExpenses: number;
}

export interface ProductionLogEntry {
  id: string;
  timestamp: string;
  type: 'produce_start' | 'produce_complete' | 'sell' | 'buyer_sell' | 'buyer_auto_procure' | 'buyer_halt' | 'ceo_assign' | 'system';
  message: string;
  amountChange?: number;
  companyId?: string;
}

export type GameNavTab =
  | 'overview'
  | 'companies'
  | 'company_detail'
  | 'ceos'
  | 'buyers'
  | 'market';

export interface MarketItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  baseCost: number;
  demand: 'Çok Yüksek' | 'Yüksek' | 'Normal' | 'Düşük';
  supply: 'Kısıtlı' | 'Dengeli' | 'Bol';
  priceChange: number;
  priceChangePercent: number;
  totalMarketSold: number;
  priceHistory: number[];
  totalProduced?: number;
  totalSold?: number;
  currentStock?: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  impactType: 'positive' | 'negative' | 'neutral';
  affectedCommodity?: string;
  priceDeltaMultiplier?: number;
}

export interface BuyerTurnProcurement {
  buyerId: string;
  buyerCode: string;
  ticker: string;
  oldStockPrice: number;
  newStockPrice: number;
  priceDelta: number;
  priceDeltaPercent: number;
  procurementStatus: 'active' | 'halted';
  statusReason: string;
  itemsBought: {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPaid: number;
    factoryCode: string;
  }[];
}

export interface TurnSummary {
  turnNumber: number;
  timestamp: string;
  cashBefore: number;
  cashAfter: number;
  cashDelta: number;
  producedCount: number;
  soldCount: number;
  marketUpdates: {
    commodity: string;
    oldPrice: number;
    newPrice: number;
    delta: number;
  }[];
  buyerUpdates?: BuyerTurnProcurement[];
  event: GameEvent;
}
