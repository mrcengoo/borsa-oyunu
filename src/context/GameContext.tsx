import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  CompanyConfig,
  CompanyInventoryState,
  GameNavTab,
  MarketItem,
  ProductionLogEntry,
  ProductLineStatus,
  RawMaterialProduct,
  TurnSummary,
  GameEvent,
  CeoCardData,
  BuyerCompany,
  BuyerTurnProcurement,
  CompanyStockInfo,
  CountryData,
  ExportPriceBreakdown,
} from '../types/production';
import {
  REGISTERED_COMPANIES,
  INITIAL_CEO_CARDS,
  INITIAL_BUYER_COMPANIES,
  INITIAL_MARKET_COMMODITIES,
  SAMPLE_GAME_EVENTS,
  INITIAL_COUNTRIES,
  ARZ_COMPANY,
} from '../data/productionCompanies';

interface GameContextType {
  // Navigation & View
  activeTab: GameNavTab;
  setActiveTab: (tab: GameNavTab) => void;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  navigateToCompany: (companyId: string) => void;

  // Currency
  currency: 'TRY' | 'USD';
  setCurrency: (c: 'TRY' | 'USD') => void;
  currencySymbol: string;

  // Game Engine & Turn
  turn: number;
  advanceTurn: () => void;
  activeEvent: GameEvent;
  turnSummaries: TurnSummary[];

  // Companies & Player
  companies: CompanyConfig[];
  selectedCompany: CompanyConfig;
  playerTotalCash: number;
  inventories: Record<string, CompanyInventoryState>;
  getCompanyInventory: (companyId: string) => CompanyInventoryState;

  // CEO Management (Atanabilir CEO Kartları)
  ceoCards: CeoCardData[];
  assignCeoToCompany: (companyId: string, ceoId: string) => void;

  // Buyer Corporate Companies (NVDA, LLY, PWR, MSFT, AVAV Alıcı Şirket Kartları)
  buyerCompanies: BuyerCompany[];
  sellToBuyer: (buyerId: string, productId: string, quantity?: number) => void;
  sellAllToBuyer: (buyerId: string, productId: string) => void;
  supplyBuyerRecipe: (buyerId: string) => void;
  updateBuyerPricesAndProcure: (customEvent?: GameEvent) => void;

  // 30 Dakikada Bir Gelen 5 Ülke
  countries: CountryData[];
  currentCountry: CountryData;
  countryTimeRemaining: number;
  sellToCountry: (countryId: string, productName: string, quantity?: number) => void;
  getExportPriceBreakdown: (countryId: string, productName: string) => ExportPriceBreakdown;
  switchRandomCountry: () => void;

  // Market
  marketItems: MarketItem[];
  getMarketItem: (commodityId: string) => MarketItem | undefined;

  // Production & Sales
  isFactoryRunning: boolean;
  setIsFactoryRunning: React.Dispatch<React.SetStateAction<boolean>>;
  sellProduct: (companyId: string, productId: string, quantity?: number) => void;
  sellAllProduct: (companyId: string, productId: string) => void;
  toggleProductionLine: (companyId: string, productId: string) => void;
  fastForwardLine: (companyId: string, seconds?: number) => void;
  getProductPriceBreakdown: (
    company: CompanyConfig,
    product: RawMaterialProduct
  ) => {
    baseCost: number;
    incomeBonus: number;
    expenseBonus: number;
    marketDiff: number;
    finalPrice: number;
  };

  // Production Companies Stock Info (100 TL Başlangıç Fiyatı & Satış Yansıması)
  companyStocks: Record<string, CompanyStockInfo>;
  getCompanyStock: (companyId: string) => CompanyStockInfo;
  recordCompanySale: (companyId: string, quantity: number, revenue: number) => void;

  // Auto-Refresh System (5 saniyede bir otomatik yenileme)
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  autoRefreshSeconds: number;
  refreshAllMarketPrices: () => void;

  // Real-Time Time Flow System
  isTimeRunning: boolean;
  toggleTimeRunning: () => void;
  setTimeRunning: (running: boolean) => void;
  elapsedSeconds: number;

  // Reset System (Üretimi, stokları ve satışları sıfırlama)
  resetProductionAndSales: () => void;

  // Logs & Toasts
  recentTransactions: ProductionLogEntry[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'sanayi_piyasa_v9';

const GameContext = createContext<GameContextType | undefined>(undefined);

// Helper to initialize company stocks (100 TL starting price)
function createInitialCompanyStocks(): Record<string, CompanyStockInfo> {
  const stocks: Record<string, CompanyStockInfo> = {};
  REGISTERED_COMPANIES.forEach((comp) => {
    stocks[comp.id] = {
      companyId: comp.id,
      code: comp.code,
      name: comp.name,
      stockPrice: 100.0,
      previousStockPrice: 100.0,
      priceChange: 0.0,
      priceChangePercent: 0.0,
      priceHistory: [100.0],
      totalSalesVolume: 0,
      totalSalesRevenue: 0,
      stockCapacity: comp.stockCapacity || 100,
      currentStockCount: 0,
    };
  });
  return stocks;
}

// Helper to initialize lines for a company
function createInitialLines(company: CompanyConfig): Record<string, ProductLineStatus> {
  const lines: Record<string, ProductLineStatus> = {};
  company.products.forEach((prod) => {
    lines[prod.id] = {
      productId: prod.id,
      productName: prod.name,
      totalDurationSeconds: prod.durationSeconds,
      remainingSeconds: prod.durationSeconds,
      isAutoProducing: true,
      isActive: true,
      completedBatches: 0,
    };
  });
  return lines;
}

// Helper to initialize inventory for a company
function createInitialInventory(company: CompanyConfig): CompanyInventoryState {
  const stock: Record<string, number> = {};
  const totalProduced: Record<string, number> = {};
  const totalSold: Record<string, number> = {};

  company.products.forEach((p) => {
    stock[p.id] = 0;
    totalProduced[p.id] = 0;
    totalSold[p.id] = 0;
  });

  return {
    cash: company.initialCash,
    stock,
    lines: createInitialLines(company),
    totalProduced,
    totalSold,
    totalRevenue: 0,
    totalExpenses: 0,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<GameNavTab>('overview');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('arz');
  const [currency, setCurrency] = useState<'TRY' | 'USD'>('TRY');
  const currencySymbol = currency === 'TRY' ? '₺' : '$';

  // Turn State
  const [turn, setTurn] = useState<number>(1);
  const [activeEvent, setActiveEvent] = useState<GameEvent>(SAMPLE_GAME_EVENTS[0]);
  const [turnSummaries, setTurnSummaries] = useState<TurnSummary[]>([]);

  // Companies List State
  const [companies, setCompanies] = useState<CompanyConfig[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return REGISTERED_COMPANIES;
  });

  const selectedCompany =
    companies.find((c) => c.id === selectedCompanyId) || companies[0] || ARZ_COMPANY;

  // CEO Cards Pool State
  const [ceoCards, setCeoCards] = useState<CeoCardData[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ceos`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CEO_CARDS;
  });

  // Buyer Corporate Companies State (NVDA, LLY, PWR, MSFT, AVAV)
  const [buyerCompanies, setBuyerCompanies] = useState<BuyerCompany[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_buyers_v9`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5 && parsed.some((b) => b.code === 'AVAV')) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_BUYER_COMPANIES;
  });

  // 30 Dakikada Bir Gelen 5 Ülke (ABD, Çin, Almanya, Japonya, G.Kore)
  const [countries] = useState<CountryData[]>(INITIAL_COUNTRIES);
  const [currentCountryIndex, setCurrentCountryIndex] = useState<number>(0);
  const [countryTimeRemaining, setCountryTimeRemaining] = useState<number>(1800); // 30 dakika = 1800 sn
  const currentCountry = countries[currentCountryIndex] || countries[0];

  // Multi-Company Inventories State
  const [inventories, setInventories] = useState<Record<string, CompanyInventoryState>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventories`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all registered companies exist
        REGISTERED_COMPANIES.forEach((comp) => {
          if (!parsed[comp.id]) {
            parsed[comp.id] = createInitialInventory(comp);
          }
        });
        return parsed;
      }
    } catch {}

    const initial: Record<string, CompanyInventoryState> = {};
    REGISTERED_COMPANIES.forEach((comp) => {
      initial[comp.id] = createInitialInventory(comp);
    });
    return initial;
  });

  // Market Commodities State
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_market`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MARKET_COMMODITIES;
  });

  // Logs & Transactions
  const [recentTransactions, setRecentTransactions] = useState<ProductionLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-1',
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type: 'system',
        message: 'Oyun başlatıldı. ARZ Sanayi A.Ş. ilk fabrika olarak devrede.',
      },
    ];
  });

  // Real-time production engine toggle
  const [isFactoryRunning, setIsFactoryRunning] = useState<boolean>(true);
  const [isTimeRunning, setIsTimeRunning] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const toggleTimeRunning = useCallback(() => {
    setIsTimeRunning((prev) => {
      const next = !prev;
      setIsFactoryRunning(next);
      return next;
    });
  }, []);

  const setTimeRunning = useCallback((running: boolean) => {
    setIsTimeRunning(running);
    setIsFactoryRunning(running);
  }, []);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const addLog = useCallback(
    (type: ProductionLogEntry['type'], message: string, amountChange?: number, companyId?: string) => {
      const newEntry: ProductionLogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        type,
        message,
        amountChange,
        companyId,
      };
      setRecentTransactions((prev) => [newEntry, ...prev.slice(0, 50)]);
    },
    []
  );

  // Production Company Stock Prices (100 TL Başlangıç Fiyatı & Satış Yansıması)
  const [companyStocks, setCompanyStocks] = useState<Record<string, CompanyStockInfo>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_company_stocks`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed['arz']?.stockPrice !== undefined) {
          return parsed;
        }
      }
    } catch {}
    return createInitialCompanyStocks();
  });

  // Auto-Refresh System (5 saniyede bir otomatik fiyat yenileme)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [autoRefreshSeconds, setAutoRefreshSeconds] = useState<number>(5);

  // Save State to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_inventories`, JSON.stringify(inventories));
      localStorage.setItem(`${STORAGE_KEY}_market`, JSON.stringify(marketItems));
      localStorage.setItem(`${STORAGE_KEY}_turn`, JSON.stringify(turn));
      localStorage.setItem(`${STORAGE_KEY}_summaries`, JSON.stringify(turnSummaries.slice(0, 15)));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(recentTransactions.slice(0, 40)));
      localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
      localStorage.setItem(`${STORAGE_KEY}_ceos`, JSON.stringify(ceoCards));
      localStorage.setItem(`${STORAGE_KEY}_buyers`, JSON.stringify(buyerCompanies));
      localStorage.setItem(`${STORAGE_KEY}_buyers_v5`, JSON.stringify(buyerCompanies));
      localStorage.setItem(`${STORAGE_KEY}_company_stocks`, JSON.stringify(companyStocks));
    } catch {}
  }, [inventories, marketItems, turn, turnSummaries, recentTransactions, companies, ceoCards, buyerCompanies, companyStocks]);

  // Total Player Treasury = sum of cash across all active companies owned
  const playerTotalCash: number = (Object.values(inventories) as CompanyInventoryState[]).reduce(
    (acc: number, inv: CompanyInventoryState) => acc + (inv.cash || 0),
    0
  );

  const getCompanyInventory = useCallback(
    (companyId: string) => {
      return inventories[companyId] || createInitialInventory(ARZ_COMPANY);
    },
    [inventories]
  );

  const getCompanyStock = useCallback(
    (companyId: string): CompanyStockInfo => {
      const comp = companies.find((c) => c.id === companyId);
      const baseInfo =
        companyStocks[companyId] || {
          companyId,
          code: companyId.toUpperCase(),
          name: companyId.toUpperCase(),
          stockPrice: 100.0,
          previousStockPrice: 100.0,
          priceChange: 0.0,
          priceChangePercent: 0.0,
          priceHistory: [100.0],
          totalSalesVolume: 0,
          totalSalesRevenue: 0,
          stockCapacity: comp?.stockCapacity || 100,
          currentStockCount: 0,
        };

      const compInv = inventories[companyId];
      let currentStockCount = 0;
      if (compInv && compInv.stock) {
        (Object.values(compInv.stock) as number[]).forEach((qty: number) => {
          currentStockCount += Math.max(0, qty || 0);
        });
      }

      return {
        ...baseInfo,
        stockCapacity: comp?.stockCapacity || 100,
        currentStockCount,
      };
    },
    [companyStocks, inventories, companies]
  );

  // Satışlar hisse fiyatıma yansısın: Her satış şirketin hisse fiyatını doğrudan artırır
  const recordCompanySale = useCallback(
    (companyId: string, quantity: number, revenue: number) => {
      setCompanyStocks((prev) => {
        const current = prev[companyId] || {
          companyId,
          code: companyId.toUpperCase(),
          name: companyId.toUpperCase(),
          stockPrice: 100.0,
          previousStockPrice: 100.0,
          priceChange: 0.0,
          priceChangePercent: 0.0,
          priceHistory: [100.0],
          totalSalesVolume: 0,
          totalSalesRevenue: 0,
        };

        // Satış hisse değerleme formülü: Adet başına +₺0.45 ve cironun %3.5'i oranında yükseliş
        const priceBoost = Number((quantity * 0.45 + revenue * 0.035).toFixed(2));
        const newStockPrice = Number((current.stockPrice + priceBoost).toFixed(2));
        const previousStockPrice = current.stockPrice;
        const priceChange = Number((newStockPrice - 100.0).toFixed(2));
        const priceChangePercent = Number((((newStockPrice - 100.0) / 100.0) * 100).toFixed(1));
        const newHistory = [...(current.priceHistory || [100.0]).slice(-8), newStockPrice];

        return {
          ...prev,
          [companyId]: {
            ...current,
            stockPrice: newStockPrice,
            previousStockPrice,
            priceChange,
            priceChangePercent,
            priceHistory: newHistory,
            totalSalesVolume: (current.totalSalesVolume || 0) + quantity,
            totalSalesRevenue: (current.totalSalesRevenue || 0) + revenue,
          },
        };
      });
    },
    []
  );

  const getMarketItem = useCallback(
    (commodityId: string) => {
      return marketItems.find((m) => m.id === commodityId);
    },
    [marketItems]
  );

  // Price Calculation Breakdown Formula:
  // Base Cost + CEO Income Bonuses - CEO Expense Bonuses
  const getProductPriceBreakdown = useCallback(
    (company: CompanyConfig, product: RawMaterialProduct) => {
      const baseCost = product.baseSellPrice || product.productionCost;
      // Income skills sum
      const incomeSkills = company.ceo.skills.filter((s) => s.category === 'income');
      let incomeBonus = 0;
      incomeSkills.forEach((s) => {
        if (s.type === 'oil_bonus') {
          if (product.isSpecialOil) incomeBonus += s.value;
        } else {
          incomeBonus += s.value;
        }
      });

      // Expense skills sum (values are negative, so we take absolute for deduction)
      const expenseSkills = company.ceo.skills.filter((s) => s.category === 'expense');
      const expenseBonus = Math.abs(expenseSkills.reduce((sum, s) => sum + s.value, 0));

      // Market demand/supply dynamic difference if available
      const marketItem = marketItems.find((m) => m.id === product.id);
      let marketDiff = 0;
      if (marketItem) {
        // Dynamic price variation relative to base calculation
        const standardPrice = baseCost + incomeBonus - expenseBonus;
        marketDiff = marketItem.currentPrice - standardPrice;
      }

      const finalPrice = Math.max(1, baseCost + incomeBonus - expenseBonus + marketDiff);

      return {
        baseCost,
        incomeBonus,
        expenseBonus,
        marketDiff,
        finalPrice,
      };
    },
    [marketItems]
  );

  // REAL-TIME PRODUCTION TICKER (Runs every 1s for all registered companies)
  useEffect(() => {
    if (!isFactoryRunning || !isTimeRunning) return;

    const interval = setInterval(() => {
      setElapsedSeconds((sec) => sec + 1);

      setInventories((prev) => {
        const updated: Record<string, CompanyInventoryState> = { ...prev };
        let hasChanges = false;

        companies.forEach((comp) => {
          const compInv = prev[comp.id];
          if (!compInv) return;

          let newCash = compInv.cash;
          let newExpenses = compInv.totalExpenses;
          const newStock = { ...compInv.stock };
          const newTotalProduced = { ...compInv.totalProduced };
          const newLines: Record<string, ProductLineStatus> = {};
          const completedNames: string[] = [];

          // Total stock currently in company warehouse (Capacity per company: comp.stockCapacity)
          const currentTotalStock = (Object.values(newStock) as number[]).reduce(
            (sum: number, qty: number) => sum + Math.max(0, qty || 0),
            0
          );
          const capacity = comp.stockCapacity || 100;
          const isWarehouseFull = currentTotalStock >= capacity;

          comp.products.forEach((prod) => {
            const line = compInv.lines[prod.id] || {
              productId: prod.id,
              productName: prod.name,
              totalDurationSeconds: prod.durationSeconds,
              remainingSeconds: prod.durationSeconds,
              isAutoProducing: true,
              isActive: true,
              completedBatches: 0,
            };

            if (!line.isActive || !line.isAutoProducing) {
              newLines[prod.id] = line;
              return;
            }

            if (line.remainingSeconds > 1) {
              newLines[prod.id] = {
                ...line,
                remainingSeconds: line.remainingSeconds - 1,
                statusReason: isWarehouseFull
                  ? `Depo Dolu (${currentTotalStock}/${capacity})! Tamamlanan üretim boşa gidecek (-1 ₺).`
                  : undefined,
              };
              hasChanges = true;
            } else {
              // Batch finished!
              if (isWarehouseFull) {
                // Depo dolarsa üretim boşa gider ve kasadan 1 ₺ düşer
                newCash = Math.max(0, newCash - 1);
                newExpenses += 1;
                newTotalProduced[prod.id] = (newTotalProduced[prod.id] || 0) + 1;
                hasChanges = true;

                setTimeout(() => {
                  addLog(
                    'produce_complete',
                    `⚠️ ${comp.code}: Depo kapasitesi dolu (${capacity}/${capacity})! ${prod.name} üretimi boşa gitti, kasadan -1 ₺ ceza düştü.`,
                    -1,
                    comp.id
                  );
                }, 0);
              } else {
                newStock[prod.id] = (newStock[prod.id] || 0) + 1;
                newTotalProduced[prod.id] = (newTotalProduced[prod.id] || 0) + 1;
                completedNames.push(prod.name);
                hasChanges = true;
              }

              // Cost of next batch
              if (newCash >= prod.productionCost) {
                newCash -= prod.productionCost;
                newExpenses += prod.productionCost;
                newLines[prod.id] = {
                  ...line,
                  remainingSeconds: prod.durationSeconds,
                  completedBatches: line.completedBatches + 1,
                  isActive: true,
                  statusReason: isWarehouseFull
                    ? `Depo Dolu (${currentTotalStock}/${capacity})! Üretim boşa gidiyor.`
                    : undefined,
                };
              } else {
                newLines[prod.id] = {
                  ...line,
                  remainingSeconds: prod.durationSeconds,
                  completedBatches: line.completedBatches + 1,
                  isActive: false, // pause when out of cash
                  statusReason: 'Yetersiz Nakit! Üretim askıya alındı.',
                };
              }
            }
          });

          if (completedNames.length > 0) {
            setTimeout(() => {
              const str = completedNames.join(', ');
              addLog(
                'produce_complete',
                `🏭 ${comp.code}: ${str} üretildi ve depoya eklendi!`,
                undefined,
                comp.id
              );
            }, 10);
          }

          updated[comp.id] = {
            ...compInv,
            cash: newCash,
            totalExpenses: newExpenses,
            stock: newStock,
            totalProduced: newTotalProduced,
            lines: newLines,
          };
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFactoryRunning, isTimeRunning, companies, addLog]);

  // REAL-TIME FINVIZ BUYER STOCKS FETCHER
  // Alıcı şirketlerin hisse fiyatları Finviz'den gerçek borsa fiyatları olarak çekilir ve bağımsız güncellenir.
  const fetchBuyerStocksFromFinviz = useCallback(async () => {
    try {
      const symbols = 'NVDA,PWR,LLY,MSFT,AVAV';
      const res = await fetch(`/api/stocks?symbols=${symbols}`);
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success || !json.data) return;

      const data = json.data;
      setBuyerCompanies((prevBuyers) => {
        return prevBuyers.map((buyer) => {
          const symbolKey = buyer.code.toUpperCase();
          const quote = data[symbolKey];
          if (!quote || 'error' in quote) return buyer;

          const price = typeof quote.price === 'number' ? quote.price : buyer.stockPrice;
          const prevClose = typeof quote.prevClose === 'number' ? quote.prevClose : buyer.previousStockPrice;
          const changeAmount = typeof quote.changeAmount === 'number'
            ? quote.changeAmount
            : Number((price - prevClose).toFixed(2));
          const changePercent = typeof quote.changePercent === 'number'
            ? quote.changePercent
            : Number((((price - prevClose) / prevClose) * 100).toFixed(2));
          const isRising = changeAmount >= 0;

          const newHistory = Array.isArray(quote.sparkline1D) && quote.sparkline1D.length > 0
            ? quote.sparkline1D
            : [...(buyer.priceHistory || [prevClose]).slice(-8), price];

          const nowTime = quote.lastUpdated || new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return {
            ...buyer,
            stockPrice: price,
            previousStockPrice: prevClose,
            priceChange: changeAmount,
            priceChangePercent: changePercent,
            priceHistory: newHistory,
            dayHigh: quote.dayHigh || Math.max(buyer.dayHigh || price, price),
            dayLow: quote.dayLow || Math.min(buyer.dayLow || price, price),
            volume: quote.volume || buyer.volume,
            marketCap: quote.marketCap ? `$${quote.marketCap}` : buyer.marketCap,
            lastUpdatedTime: nowTime,
            isProcurementActive: isRising,
            procurementStatus: isRising ? ('active' as const) : ('halted' as const),
            procurementStatusReason: isRising
              ? `Finviz hissesi yükselişte ($${price}, +%${changePercent}). Fabrikalardan hammadde alımı açık.`
              : `Finviz hissesi ekside ($${price}, %${changePercent}). Malzeme alımı durduruldu.`,
          };
        });
      });
    } catch (err) {
      console.warn('Finviz borsa verisi çekilemedi:', err);
    }
  }, []);

  // Poll Finviz every 12 seconds when running, plus immediate fetch on mount
  useEffect(() => {
    fetchBuyerStocksFromFinviz();
  }, [fetchBuyerStocksFromFinviz]);

  useEffect(() => {
    if (!isTimeRunning) return;

    const interval = setInterval(() => {
      fetchBuyerStocksFromFinviz();
    }, 12000);

    return () => clearInterval(interval);
  }, [isTimeRunning, fetchBuyerStocksFromFinviz]);

  // Fast Forward Line
  const fastForwardLine = useCallback(
    (companyId: string, seconds: number = 15) => {
      setInventories((prev) => {
        const comp = companies.find((c) => c.id === companyId);
        if (!comp || !prev[companyId]) return prev;

        const compInv = prev[companyId];
        let newCash = compInv.cash;
        let newExpenses = compInv.totalExpenses;
        const newStock = { ...compInv.stock };
        const newTotalProduced = { ...compInv.totalProduced };
        const newLines: Record<string, ProductLineStatus> = {};
        const completed: string[] = [];

        comp.products.forEach((prod) => {
          const line = compInv.lines[prod.id];
          if (!line || !line.isActive) {
            newLines[prod.id] = line;
            return;
          }

          const rem = line.remainingSeconds - seconds;
          if (rem <= 0) {
            newStock[prod.id] = (newStock[prod.id] || 0) + 1;
            newTotalProduced[prod.id] = (newTotalProduced[prod.id] || 0) + 1;
            completed.push(prod.name);

            if (newCash >= prod.productionCost) {
              newCash -= prod.productionCost;
              newExpenses += prod.productionCost;
              newLines[prod.id] = {
                ...line,
                remainingSeconds: prod.durationSeconds,
                completedBatches: line.completedBatches + 1,
                isActive: true,
              };
            } else {
              newLines[prod.id] = {
                ...line,
                remainingSeconds: prod.durationSeconds,
                completedBatches: line.completedBatches + 1,
                isActive: false,
              };
            }
          } else {
            newLines[prod.id] = {
              ...line,
              remainingSeconds: rem,
            };
          }
        });

        if (completed.length > 0) {
          addLog(
            'produce_complete',
            `⏩ Hızlı İlerletme: ${completed.join(', ')} üretildi!`,
            undefined,
            companyId
          );
          showToast(`✓ ${completed.join(', ')} üretildi!`);
        }

        return {
          ...prev,
          [companyId]: {
            ...compInv,
            cash: newCash,
            totalExpenses: newExpenses,
            stock: newStock,
            totalProduced: newTotalProduced,
            lines: newLines,
          },
        };
      });
    },
    [companies, addLog, showToast]
  );

  // Toggle Auto Production
  const toggleProductionLine = useCallback((companyId: string, productId: string) => {
    setInventories((prev) => {
      const compInv = prev[companyId];
      if (!compInv || !compInv.lines[productId]) return prev;

      const current = compInv.lines[productId];
      const nextActive = !current.isActive;

      return {
        ...prev,
        [companyId]: {
          ...compInv,
          lines: {
            ...compInv.lines,
            [productId]: {
              ...current,
              isActive: nextActive,
              isAutoProducing: nextActive,
            },
          },
        },
      };
    });
  }, []);

  // Sell Product from a Company
  const sellProduct = useCallback(
    (companyId: string, productId: string, quantity: number = 1) => {
      const comp = companies.find((c) => c.id === companyId);
      if (!comp) return;

      const product = comp.products.find((p) => p.id === productId);
      if (!product) return;

      const currentStock = inventories[companyId]?.stock[productId] || 0;
      if (currentStock < quantity || quantity <= 0) {
        showToast('⚠️ Yetersiz stok! Önce üretim yapılmalı.');
        return;
      }

      const { finalPrice } = getProductPriceBreakdown(comp, product);
      const totalRevenue = finalPrice * quantity;

      // Update Inventory
      setInventories((prev) => {
        const compInv = prev[companyId];
        if (!compInv) return prev;

        return {
          ...prev,
          [companyId]: {
            ...compInv,
            cash: compInv.cash + totalRevenue,
            totalRevenue: compInv.totalRevenue + totalRevenue,
            stock: {
              ...compInv.stock,
              [productId]: (compInv.stock[productId] || 0) - quantity,
            },
            totalSold: {
              ...compInv.totalSold,
              [productId]: (compInv.totalSold[productId] || 0) + quantity,
            },
          },
        };
      });

      // Update Market Sold Total
      setMarketItems((prev) =>
        prev.map((item) => {
          if (item.id === productId) {
            return {
              ...item,
              totalMarketSold: item.totalMarketSold + quantity,
            };
          }
          return item;
        })
      );

      // Boost company stock price with sales! (Satışlar hisse fiyatıma yansısın)
      recordCompanySale(companyId, quantity, totalRevenue);

      // Log transaction
      const msg = `💰 ${comp.code}: ${quantity} ${product.unit} ${product.name} satıldı (+${currencySymbol}${totalRevenue}). Kasa ve hisse fiyatı güncellendi.`;
      addLog('sell', msg, totalRevenue, companyId);
      showToast(`✓ ${quantity} ${product.unit} ${product.name} satıldı (+${currencySymbol}${totalRevenue})`);
    },
    [companies, inventories, getProductPriceBreakdown, currencySymbol, addLog, showToast, recordCompanySale]
  );

  // Sell All of a Product
  const sellAllProduct = useCallback(
    (companyId: string, productId: string) => {
      const stock = inventories[companyId]?.stock[productId] || 0;
      if (stock > 0) {
        sellProduct(companyId, productId, stock);
      }
    },
    [inventories, sellProduct]
  );

  // ASSIGN CEO TO COMPANY (CEO Atama)
  const assignCeoToCompany = useCallback(
    (companyId: string, ceoId: string) => {
      const targetCeo = ceoCards.find((c) => c.id === ceoId);
      const targetCompany = companies.find((comp) => comp.id === companyId);
      if (!targetCeo || !targetCompany) return;

      // Update ceoCards assignment
      setCeoCards((prev) =>
        prev.map((c) => {
          if (c.id === ceoId) {
            return { ...c, assignedCompanyId: companyId };
          }
          // If another CEO was assigned to this company, release them to pool
          if (c.assignedCompanyId === companyId) {
            return { ...c, assignedCompanyId: null };
          }
          return c;
        })
      );

      // Update companies state with the CEO's 3 income and 3 expense skills
      setCompanies((prev) =>
        prev.map((comp) => {
          if (comp.id === companyId) {
            return {
              ...comp,
              ceo: {
                name: targetCeo.name,
                title: targetCeo.title,
                skills: [...targetCeo.incomeSkills, ...targetCeo.expenseSkills],
              },
            };
          }
          return comp;
        })
      );

      addLog(
        'ceo_assign',
        `👔 ${targetCeo.name}, ${targetCompany.code} (${targetCompany.name}) şirketine CEO olarak atandı! (3 Gelir & 3 Gider Bonusu Aktif)`,
        undefined,
        companyId
      );
      showToast(`✓ ${targetCeo.name}, ${targetCompany.code} CEO'su olarak atandı!`);
    },
    [ceoCards, companies, addLog, showToast]
  );

  // SELL TO BUYER CORPORATE (PWR, NVDA, CNQ vb. Alıcı Şirketlere Satış)
  const sellToBuyer = useCallback(
    (buyerId: string, productId: string, quantity: number = 1) => {
      const buyer = buyerCompanies.find((b) => b.id === buyerId);
      if (!buyer) return;

      // Check if procurement is active (Hisse fiyatı eksideyse veya alım kapalıysa alım durdurulur)
      if (!buyer.isProcurementActive || (buyer.priceChange ?? 0) <= 0) {
        showToast(
          `⛔ ${buyer.code} hisse fiyatı ekside (%${buyer.priceChangePercent}) olduğu için alımı durdurdu! Hammaddeler fabrikaların stoğunda beklemeye devam ediyor.`
        );
        return;
      }

      const demand = buyer.demands.find((d) => d.productId === productId);
      if (!demand) return;

      // Find company that produces this product or has stock
      const companyWithStock = companies.find((comp) => {
        const stock = inventories[comp.id]?.stock[productId] || 0;
        return stock >= quantity;
      });

      if (!companyWithStock) {
        const producer = companies.find((c) => c.products.some((p) => p.id === productId));
        const avail = producer ? (inventories[producer.id]?.stock[productId] || 0) : 0;
        showToast(`⚠️ Yetersiz stok! ${demand.productName} mevcudu: ${avail} ${demand.unit}. Talep: ${quantity}`);
        return;
      }

      const companyId = companyWithStock.id;
      const unitPrice = demand.offeredPrice;
      const totalEarned = unitPrice * quantity;

      // Deduct stock and credit revenue to company
      setInventories((prev) => {
        const compInv = prev[companyId];
        if (!compInv) return prev;

        return {
          ...prev,
          [companyId]: {
            ...compInv,
            cash: compInv.cash + totalEarned,
            totalRevenue: compInv.totalRevenue + totalEarned,
            stock: {
              ...compInv.stock,
              [productId]: (compInv.stock[productId] || 0) - quantity,
            },
            totalSold: {
              ...compInv.totalSold,
              [productId]: (compInv.totalSold[productId] || 0) + quantity,
            },
          },
        };
      });

      // Update buyer company contract progress and crafted product inventory
      let bonusEarned = 0;
      setBuyerCompanies((prev) =>
        prev.map((b) => {
          if (b.id !== buyerId) return b;

          const updatedDemands = b.demands.map((d) => {
            if (d.productId === productId) {
              return {
                ...d,
                fulfilledQty: d.fulfilledQty + quantity,
              };
            }
            return d;
          });

          // Check if all contract demands are satisfied
          const allCompleted = updatedDemands.every(
            (d) => d.fulfilledQty >= d.targetContractQty
          );

          // Update buyer's sectoral crafted product raw materials & manufacturing
          let craftedProduct = b.craftedProduct;
          if (craftedProduct) {
            const curMat = { ...(craftedProduct.currentMaterials || {}) };
            curMat[productId] = (curMat[productId] || 0) + quantity;
            let totalCost = (craftedProduct.totalCost || 0) + totalEarned;
            let producedCount = craftedProduct.producedCount || 0;

            // Check if recipe requirements are met
            let canCraft = true;
            while (canCraft) {
              for (const req of craftedProduct.requirements) {
                if ((curMat[req.productId] || 0) < req.requiredQty) {
                  canCraft = false;
                  break;
                }
              }
              if (canCraft) {
                for (const req of craftedProduct.requirements) {
                  curMat[req.productId] = (curMat[req.productId] || 0) - req.requiredQty;
                }
                producedCount += 1;
                addLog(
                  'produce_complete',
                  `💊 ${b.code}: Gerekli hammaddeleri toplayarak 1 adet "${craftedProduct.name}" üretti ve deposuna koydu!`,
                  undefined,
                  companyId
                );
              }
            }

            const unitCost = producedCount > 0 ? Number((totalCost / producedCount).toFixed(2)) : 0;
            craftedProduct = {
              ...craftedProduct,
              currentMaterials: curMat,
              totalCost,
              producedCount,
              unitCost,
            };
          }

          if (allCompleted && !b.contractCompleted) {
            bonusEarned = b.contractBonusReward;
            return {
              ...b,
              demands: updatedDemands,
              craftedProduct,
              contractCompleted: true,
            };
          }

          return {
            ...b,
            demands: updatedDemands,
            craftedProduct,
          };
        })
      );

      // Award contract fulfillment bonus if unlocked
      if (bonusEarned > 0) {
        setInventories((prev) => {
          const compInv = prev[companyId];
          if (!compInv) return prev;
          return {
            ...prev,
            [companyId]: {
              ...compInv,
              cash: compInv.cash + bonusEarned,
            },
          };
        });
        addLog(
          'buyer_sell',
          `🏆 SÖZLEŞME TAMAMLANDI! ${buyer.code} tüm tedarik kotalarını doldurdu ve +${currencySymbol}${bonusEarned} ek ödül ödedi!`,
          bonusEarned,
          companyId
        );
        showToast(`🏆 ${buyer.code} Sözleşme Tamamlama Bonusu: +${currencySymbol}${bonusEarned}!`);
      }

      // Boost company stock price with buyer sales!
      recordCompanySale(companyId, quantity, totalEarned + bonusEarned);

      addLog(
        'buyer_sell',
        `💼 ${buyer.code} (${buyer.name}) şirketine ${quantity} ${demand.unit} ${demand.productName} satıldı! (+${currencySymbol}${totalEarned}). Hisse değeri yükseldi.`,
        totalEarned,
        companyId
      );
      showToast(`✓ ${buyer.code}'a ${quantity} ${demand.unit} ${demand.productName} satıldı (+${currencySymbol}${totalEarned})`);
    },
    [buyerCompanies, companies, inventories, currencySymbol, addLog, showToast, recordCompanySale]
  );

  // Sell All of a product to a buyer
  const sellAllToBuyer = useCallback(
    (buyerId: string, productId: string) => {
      const buyer = buyerCompanies.find((b) => b.id === buyerId);
      if (!buyer) return;

      if (!buyer.isProcurementActive) {
        showToast(
          `⛔ ${buyer.code} hisse fiyatı düştüğü için alımı durdurdu (%${buyer.priceChangePercent})! Fiyatın yükselmesini bekleyin.`
        );
        return;
      }

      let totalStock = 0;
      companies.forEach((comp) => {
        const s = inventories[comp.id]?.stock[productId] || 0;
        totalStock += s;
      });

      if (totalStock <= 0) {
        showToast('⚠️ Depolarda bu üründen bulunmuyor! Önce üretim yapın.');
        return;
      }

      sellToBuyer(buyerId, productId, totalStock);
    },
    [buyerCompanies, companies, inventories, sellToBuyer, showToast]
  );

  // Reçete Tamamlama: Fabrikalardaki stoklardan alıcı şirketin üreteceği ürün için eksik hammaddeleri tedarik et
  const supplyBuyerRecipe = useCallback(
    (buyerId: string) => {
      const buyer = buyerCompanies.find((b) => b.id === buyerId);
      if (!buyer || !buyer.craftedProduct) return;

      if (!buyer.isProcurementActive) {
        showToast(
          `⛔ ${buyer.code} hisse fiyatı negatif olduğu için malzeme alımı durduruldu! Fiyatın yükselmesini bekleyin.`
        );
        return;
      }

      const requirements = buyer.craftedProduct.requirements;
      const curMat = buyer.craftedProduct.currentMaterials || {};
      let anySupplied = false;
      let totalSuppliedCount = 0;

      requirements.forEach((req) => {
        const collected = curMat[req.productId] || 0;
        const missing = Math.max(0, req.requiredQty - collected);
        if (missing > 0) {
          // Check player factory stock
          let totalAvail = 0;
          companies.forEach((comp) => {
            totalAvail += inventories[comp.id]?.stock[req.productId] || 0;
          });

          const toSend = Math.min(missing, totalAvail);
          if (toSend > 0) {
            sellToBuyer(buyerId, req.productId, toSend);
            anySupplied = true;
            totalSuppliedCount += toSend;
          }
        }
      });

      if (!anySupplied) {
        showToast(
          `⚠️ Fabrikalarınızda ${buyer.code} için gereken eksik hammaddelerden yeterli stok bulunmuyor!`
        );
      } else {
        showToast(
          `✓ ${buyer.code} için ${totalSuppliedCount} adet hammadde fabrikalardan aktarıldı!`
        );
      }
    },
    [buyerCompanies, companies, inventories, sellToBuyer, showToast]
  );

  // Ülkeye İhracat Fiyatı Hesaplayıcı (Baz Fiyat + Gümrük + Lojistik + Ürün Primi + CEO Ülke Bonusu)
  const getExportPriceBreakdown = useCallback(
    (countryId: string, productName: string): ExportPriceBreakdown => {
      const country = countries.find((c) => c.id === countryId) || currentCountry;
      const buyer = buyerCompanies.find(
        (b) => b.craftedProduct?.name.toLowerCase() === productName.toLowerCase()
      );

      let basePrice = 160;
      const pNameLower = productName.toLowerCase();
      if (pNameLower.includes('çip') || pNameLower.includes('cip')) basePrice = 160;
      else if (pNameLower.includes('ilaç') || pNameLower.includes('ilac')) basePrice = 180;
      else if (pNameLower.includes('trafo')) basePrice = 190;
      else if (pNameLower.includes('bulut') || pNameLower.includes('platform')) basePrice = 200;
      else if (pNameLower.includes('drone')) basePrice = 230;
      else if (buyer?.craftedProduct?.unitCost && buyer.craftedProduct.unitCost > 0) {
        basePrice = buyer.craftedProduct.unitCost;
      }

      const customsDuty = country.customsDuty || 0;
      const logisticsCost = country.logisticsCost || 0;
      const isBonus = country.productBonus?.productName.toLowerCase() === productName.toLowerCase();
      const countryProductBonus = isBonus ? country.productBonus?.bonus || 0 : 0;

      // Check CEO country bonuses
      let ceoBonus = 0;
      let ceoName = '';
      let ceoCountryName = '';
      let isCeoAssigned = false;

      // 1. Önce fabrikalara atanmış CEO'lara bak
      for (const comp of companies) {
        const assignedCeo = ceoCards.find((c) => c.assignedCompanyId === comp.id);
        if (assignedCeo?.bonuses?.countryBonus?.countryId === country.id) {
          ceoBonus = assignedCeo.bonuses.countryBonus.bonus;
          ceoName = assignedCeo.name;
          ceoCountryName = assignedCeo.bonuses.countryBonus.countryName;
          isCeoAssigned = true;
          break;
        }
      }

      // 2. Eğer atanmışlar arasında yoksa yönetim kadrosundaki CEO'lara bak
      if (!isCeoAssigned) {
        const matchingCeo = ceoCards.find(
          (c) => c.bonuses?.countryBonus?.countryId === country.id
        );
        if (matchingCeo) {
          ceoBonus = matchingCeo.bonuses.countryBonus.bonus;
          ceoName = matchingCeo.name;
          ceoCountryName = matchingCeo.bonuses.countryBonus.countryName;
          isCeoAssigned = Boolean(matchingCeo.assignedCompanyId);
        }
      }

      const netPrice = Math.max(
        10,
        basePrice + customsDuty + logisticsCost + countryProductBonus + ceoBonus
      );

      return {
        basePrice,
        customsDuty,
        logisticsCost,
        countryProductBonus,
        ceoCountryBonus: ceoBonus,
        ceoBonus,
        ceoName,
        ceoCountryName,
        isCeoAssigned,
        netPrice,
      };
    },
    [countries, currentCountry, buyerCompanies, companies, ceoCards]
  );

  // 30 Dakikalık Ülke İhracat Fonksiyonu (CEO Ülke Bonusu Eklenir)
  const sellToCountry = useCallback(
    (countryId: string, productName: string, quantity: number = 1) => {
      const country = countries.find((c) => c.id === countryId) || currentCountry;
      const buyerIndex = buyerCompanies.findIndex(
        (b) => b.craftedProduct?.name.toLowerCase() === productName.toLowerCase()
      );

      if (buyerIndex === -1) {
        showToast(`${productName} alıcı şirket depolarında bulunamadı!`);
        return;
      }

      const buyer = buyerCompanies[buyerIndex];
      const available = buyer.craftedProduct?.producedCount || 0;
      if (available < quantity) {
        showToast(`Yetersiz stok! Alıcı deposunda sadece ${available} adet ${productName} var.`);
        return;
      }

      const priceInfo = getExportPriceBreakdown(country.id, productName);
      const netPerUnit = priceInfo.netPrice;
      const totalEarnings = netPerUnit * quantity;

      // Deduct stock from buyer crafted product
      setBuyerCompanies((prev) => {
        const updated = [...prev];
        const target = updated[buyerIndex];
        if (target && target.craftedProduct) {
          target.craftedProduct = {
            ...target.craftedProduct,
            producedCount: Math.max(0, target.craftedProduct.producedCount - quantity),
          };
        }
        return updated;
      });

      // Add cash to active company
      setInventories((prev) => {
        const compInv = prev[selectedCompanyId];
        if (!compInv) return prev;
        return {
          ...prev,
          [selectedCompanyId]: {
            ...compInv,
            cash: compInv.cash + totalEarnings,
            totalRevenue: compInv.totalRevenue + totalEarnings,
          },
        };
      });

      const ceoBonusDetail = priceInfo.ceoBonus > 0
        ? ` | 🌟 CEO Bonusu (${priceInfo.ceoName} - ${priceInfo.ceoCountryName}): +${currencySymbol}${priceInfo.ceoBonus}`
        : '';

      addLog(
        'country_sell',
        `🌍 ${country.name} Heyetine ${quantity} adet ${productName} ihraç edildi! Birim Net: ${currencySymbol}${netPerUnit} (Baz: ${currencySymbol}${priceInfo.basePrice}, Gümrük: ${priceInfo.customsDuty} ₺, Lojistik: ${priceInfo.logisticsCost} ₺, Ülke Primi: +${priceInfo.countryProductBonus} ₺${ceoBonusDetail}). Toplam Gelir: +${currencySymbol}${totalEarnings.toLocaleString('tr-TR')}`,
        totalEarnings,
        selectedCompanyId
      );
      showToast(
        `✓ ${country.name}'ye ${quantity} adet ${productName} satıldı! (+${currencySymbol}${totalEarnings}${priceInfo.ceoBonus > 0 ? ` • +${priceInfo.ceoBonus} ₺ CEO Bonusu eklendi` : ''})`
      );
    },
    [
      countries,
      currentCountry,
      buyerCompanies,
      selectedCompanyId,
      currencySymbol,
      getExportPriceBreakdown,
      addLog,
      showToast,
    ]
  );

  // Sonraki Rastgele Ülkeyi Çağır / Rotasyon
  const switchRandomCountry = useCallback(() => {
    setCurrentCountryIndex((currIdx) => {
      const otherIndices = countries.map((_, i) => i).filter((i) => i !== currIdx);
      const nextIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
      const nextCountry = countries[nextIdx];
      setTimeout(() => {
        addLog(
          'country_sell',
          `🌍 ${nextCountry.name} Ticaret Heyeti sanayinizi ziyarete başladı! (30 dk)`
        );
        showToast(`🌍 ${nextCountry.name} Ticaret Heyeti fabrikanıza ulaştı!`);
      }, 0);
      return nextIdx;
    });
    setCountryTimeRemaining(1800);
  }, [countries, addLog, showToast]);

  // 30-Minute Visiting Country Interval (Rastgele Ülke Ziyareti)
  useEffect(() => {
    if (!isTimeRunning) return;

    const interval = setInterval(() => {
      setCountryTimeRemaining((prev) => {
        if (prev <= 1) {
          setCurrentCountryIndex((currIdx) => {
            const otherIndices = countries.map((_, i) => i).filter((i) => i !== currIdx);
            const nextIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
            const nextCountry = countries[nextIdx];
            setTimeout(() => {
              addLog(
                'country_sell',
                `🌍 ${nextCountry.name} Ticaret Delegasyonu sanayinizi ziyarete başladı! (30 dk)`
              );
              showToast(`🌍 ${nextCountry.name} Ticaret Heyeti fabrikanıza ulaştı!`);
            }, 0);
            return nextIdx;
          });
          return 1800;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeRunning, countries, addLog, showToast]);

  // UPDATE BUYER PRICES & EXECUTE CONDITIONAL PROCUREMENT
  // Kural: Borsa fiyatı yükselen şirketler fabrikalardan malzeme alır, fiyatı düşenler alımı durdurur.
  // Alıcı şirketlerin hisse fiyatları bağımsız gerçek Finviz borsa fiyatlarıdır, iç alım/tedarik hisse fiyatını bozmaz.
  const updateBuyerPricesAndProcure = useCallback(
    () => {
      const reports: BuyerTurnProcurement[] = [];
      let totalProcuredCash = 0;
      let totalProcuredItems = 0;

      setInventories((prevInventories) => {
        const nextInventories: Record<string, CompanyInventoryState> = {};
        Object.keys(prevInventories).forEach((cId) => {
          nextInventories[cId] = {
            ...prevInventories[cId],
            cash: prevInventories[cId].cash,
            totalRevenue: prevInventories[cId].totalRevenue,
            totalExpenses: prevInventories[cId].totalExpenses,
            stock: { ...prevInventories[cId].stock },
            totalProduced: { ...prevInventories[cId].totalProduced },
            totalSold: { ...prevInventories[cId].totalSold },
          };
        });

        setBuyerCompanies((prevBuyers) => {
          const nextBuyers = prevBuyers.map((buyer) => {
            const currentPrice = buyer.stockPrice || 100;
            const priceDelta = buyer.priceChange ?? 0;
            const finalPct = buyer.priceChangePercent ?? 0;
            const isRising = priceDelta >= 0;

            const itemsBoughtThisRound: BuyerTurnProcurement['itemsBought'] = [];
            let updatedDemands = [...buyer.demands];
            let newTotalPurchased = buyer.totalPurchasedValue || 0;
            let contractCompletedNow = buyer.contractCompleted;

            if (isRising) {
              // FİYAT YÜKSELDİ VEYA ARTI DA -> Fabrikalardan malzeme satın al!
              updatedDemands = updatedDemands.map((demand) => {
                if (demand.fulfilledQty >= demand.targetContractQty) {
                  return demand;
                }

                // Check which factory produces this product
                const producerComp = companies.find((c) =>
                  c.products.some((p) => p.id === demand.productId)
                );
                if (!producerComp) return demand;

                const factoryStock = nextInventories[producerComp.id]?.stock[demand.productId] || 0;
                if (factoryStock <= 0) return demand;

                // Purchase 1-2 units from factory
                const remainingQuota = demand.targetContractQty - demand.fulfilledQty;
                const buyCount = Math.min(factoryStock, remainingQuota, Math.floor(Math.random() * 2) + 1);

                if (buyCount > 0) {
                  const payment = buyCount * demand.offeredPrice;
                  const fInv = nextInventories[producerComp.id];
                  if (fInv) {
                    fInv.cash += payment;
                    fInv.totalRevenue += payment;
                    fInv.stock[demand.productId] = (fInv.stock[demand.productId] || 0) - buyCount;
                    fInv.totalSold[demand.productId] = (fInv.totalSold[demand.productId] || 0) + buyCount;
                  }

                  totalProcuredCash += payment;
                  totalProcuredItems += buyCount;
                  newTotalPurchased += payment;

                  itemsBoughtThisRound.push({
                    productId: demand.productId,
                    productName: demand.productName,
                    quantity: buyCount,
                    unit: demand.unit,
                    unitPrice: demand.offeredPrice,
                    totalPaid: payment,
                    factoryCode: producerComp.code,
                  });

                  return {
                    ...demand,
                    fulfilledQty: demand.fulfilledQty + buyCount,
                  };
                }

                return demand;
              });

              // Check if contract completed
              const allDone = updatedDemands.every((d) => d.fulfilledQty >= d.targetContractQty);
              if (allDone && !contractCompletedNow) {
                contractCompletedNow = true;
              }

              const reason = `Finviz hissesi $${currentPrice} seviyesinde yükselişte (+%${finalPct}). Bütçe onaylandı; fabrikalardan hammadde tedariği yapılıyor.`;

              reports.push({
                buyerId: buyer.id,
                buyerCode: buyer.code,
                ticker: buyer.ticker || buyer.code,
                oldStockPrice: currentPrice,
                newStockPrice: currentPrice,
                priceDelta,
                priceDeltaPercent: finalPct,
                procurementStatus: 'active',
                statusReason: reason,
                itemsBought: itemsBoughtThisRound,
              });

              // Crafting check for this buyer if items bought
              let craftedProduct = buyer.craftedProduct;
              if (craftedProduct && itemsBoughtThisRound.length > 0) {
                const curMat = { ...(craftedProduct.currentMaterials || {}) };
                let additionalCost = 0;
                itemsBoughtThisRound.forEach((it) => {
                  curMat[it.productId] = (curMat[it.productId] || 0) + it.quantity;
                  additionalCost += it.totalPaid;
                });
                let totalCost = (craftedProduct.totalCost || 0) + additionalCost;
                let producedCount = craftedProduct.producedCount || 0;

                let canCraft = true;
                while (canCraft) {
                  for (const req of craftedProduct.requirements) {
                    if ((curMat[req.productId] || 0) < req.requiredQty) {
                      canCraft = false;
                      break;
                    }
                  }
                  if (canCraft) {
                    for (const req of craftedProduct.requirements) {
                      curMat[req.productId] = (curMat[req.productId] || 0) - req.requiredQty;
                    }
                    producedCount += 1;
                    addLog(
                      'produce_complete',
                      `💊 ${buyer.code}: Malzemeleri tamamlayarak 1 adet "${craftedProduct.name}" üretti ve kurumsal deposuna koydu!`,
                      undefined
                    );
                  }
                }

                const unitCost = producedCount > 0 ? Number((totalCost / producedCount).toFixed(2)) : 0;
                craftedProduct = {
                  ...craftedProduct,
                  currentMaterials: curMat,
                  totalCost,
                  producedCount,
                  unitCost,
                };
              }

              return {
                ...buyer,
                isProcurementActive: true,
                procurementStatus: 'active' as const,
                procurementStatusReason: reason,
                demands: updatedDemands,
                craftedProduct,
                totalPurchasedValue: newTotalPurchased,
                contractCompleted: contractCompletedNow,
                lastProcuredProduct: itemsBoughtThisRound[0]?.productName,
                lastProcuredQty: itemsBoughtThisRound.reduce((s, i) => s + i.quantity, 0),
              };
            } else {
              // FİYAT DÜŞTÜ VEYA EKSİDE -> ALIMI DURDUR!
              const reason = `Finviz hissesi $${currentPrice} seviyesinde ekside (%${finalPct}). Tasarruf tedbiri nedeniyle malzeme alımı durduruldu.`;

              reports.push({
                buyerId: buyer.id,
                buyerCode: buyer.code,
                ticker: buyer.ticker || buyer.code,
                oldStockPrice: currentPrice,
                newStockPrice: currentPrice,
                priceDelta,
                priceDeltaPercent: finalPct,
                procurementStatus: 'halted',
                statusReason: reason,
                itemsBought: [],
              });

              return {
                ...buyer,
                isProcurementActive: false,
                procurementStatus: 'halted' as const,
                procurementStatusReason: reason,
                demands: updatedDemands,
              };
            }
          });

          return nextBuyers;
        });

        return nextInventories;
      });

      // Show summary notifications & logs
      setTimeout(() => {
        reports.forEach((rep) => {
          if (rep.procurementStatus === 'active') {
            if (rep.itemsBought.length > 0) {
              const details = rep.itemsBought
                .map((it) => `${it.factoryCode}'den ${it.quantity} ${it.unit} ${it.productName} (+${currencySymbol}${it.totalPaid})`)
                .join(', ');
              addLog(
                'buyer_auto_procure',
                `📈 ${rep.buyerCode} hissesi yükseldi ($${rep.newStockPrice}, +%${rep.priceDeltaPercent})! Fabrikalarınızdan malzeme aldı: ${details}`
              );
            } else {
              addLog(
                'buyer_sell',
                `📈 ${rep.buyerCode} hissesi yükseldi ($${rep.newStockPrice}, +%${rep.priceDeltaPercent})! Alım açık (Fabrikalarda yeterli stok bekleniyor).`
              );
            }
          } else {
            addLog(
              'buyer_halt',
              `⛔ ${rep.buyerCode} hissesi düştü ($${rep.newStockPrice}, %${rep.priceDeltaPercent}). Tasarruf gereği malzeme alımı durduruldu!`
            );
          }
        });

        if (totalProcuredItems > 0) {
          showToast(
            `📈 Alıcı şirketler fiyat yükselişiyle fabrikalarınızdan ${totalProcuredItems} adet malzeme aldı (+${currencySymbol}${totalProcuredCash})!`
          );
        } else {
          showToast('✓ Alıcı şirket borsa fiyatları ve alım durumları güncellendi.');
        }
      }, 50);

      return reports;
    },
    [activeEvent, companies, currencySymbol, addLog, showToast]
  );

  // ADVANCE TURN (Turu İlerlet)
  const advanceTurn = useCallback(() => {
    const nextTurn = turn + 1;
    const cashBefore = playerTotalCash;

    // 1. Run 1 turn production batch for each active line
    let turnProducedCount = 0;
    const updatedInventories: Record<string, CompanyInventoryState> = { ...inventories };

    companies.forEach((comp) => {
      const compInv = updatedInventories[comp.id];
      if (!compInv) return;

      let newCash = compInv.cash;
      let newExpenses = compInv.totalExpenses;
      const newStock = { ...compInv.stock };
      const newTotalProduced = { ...compInv.totalProduced };

      comp.products.forEach((prod) => {
        const line = compInv.lines[prod.id];
        if (line && line.isActive) {
          // Complete 1 batch per turn step
          newStock[prod.id] = (newStock[prod.id] || 0) + 1;
          newTotalProduced[prod.id] = (newTotalProduced[prod.id] || 0) + 1;
          turnProducedCount += 1;

          if (newCash >= prod.productionCost) {
            newCash -= prod.productionCost;
            newExpenses += prod.productionCost;
          }
        }
      });

      updatedInventories[comp.id] = {
        ...compInv,
        cash: newCash,
        totalExpenses: newExpenses,
        stock: newStock,
        totalProduced: newTotalProduced,
      };
    });

    // 2. Select next random Game Event
    const nextEvent =
      SAMPLE_GAME_EVENTS[(nextTurn - 1) % SAMPLE_GAME_EVENTS.length] ||
      SAMPLE_GAME_EVENTS[0];
    setActiveEvent(nextEvent);

    // 3. Fluctuate Market Prices & Update Demand/Supply
    const marketUpdates: {
      commodity: string;
      oldPrice: number;
      newPrice: number;
      delta: number;
    }[] = [];

    const updatedMarket = marketItems.map((item) => {
      const isAffected = nextEvent.affectedCommodity === item.id;
      const eventMultiplier = isAffected ? (nextEvent.priceDeltaMultiplier || 1) : 1;

      // Random price drift between -1 and +1
      const randomDrift = (Math.floor(Math.random() * 3) - 1);
      let calculatedPrice = Math.round(item.currentPrice * eventMultiplier + randomDrift);
      // Floor at baseCost + 1
      calculatedPrice = Math.max(item.baseCost + 1, calculatedPrice);

      const delta = calculatedPrice - item.currentPrice;
      const pct = Number(((delta / item.currentPrice) * 100).toFixed(1));

      marketUpdates.push({
        commodity: item.name,
        oldPrice: item.currentPrice,
        newPrice: calculatedPrice,
        delta,
      });

      const newHistory = [...item.priceHistory.slice(1), calculatedPrice];

      return {
        ...item,
        previousPrice: item.currentPrice,
        currentPrice: calculatedPrice,
        priceChange: delta,
        priceChangePercent: pct,
        priceHistory: newHistory,
        demand: delta > 0 ? ('Çok Yüksek' as const) : delta < 0 ? ('Düşük' as const) : ('Normal' as const),
        supply: item.totalMarketSold > 10 ? ('Bol' as const) : ('Dengeli' as const),
      };
    });

    setMarketItems(updatedMarket);
    setInventories(updatedInventories);

    // 4. Update Buyer Corporate Prices & Conditional Procurement (Fiyat Yükselirse Malzeme Al, Düşerse Durdur)
    updateBuyerPricesAndProcure(nextEvent);

    // Calculate cash after
    const cashAfter: number = (Object.values(updatedInventories) as CompanyInventoryState[]).reduce(
      (acc: number, inv: CompanyInventoryState) => acc + (inv.cash || 0),
      0
    );
    const cashDelta: number = cashAfter - cashBefore;

    // 5. Record Turn Summary
    const summary: TurnSummary = {
      turnNumber: nextTurn,
      timestamp: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      cashBefore,
      cashAfter,
      cashDelta,
      producedCount: turnProducedCount,
      soldCount: 0,
      marketUpdates,
      event: nextEvent,
    };

    setTurnSummaries((prev) => [summary, ...prev]);
    setTurn(nextTurn);

    addLog(
      'system',
      `🎲 Tur ${nextTurn} başladı! Olay: "${nextEvent.title}". ${turnProducedCount} ürün üretildi. Alıcı şirket piyasaları güncellendi.`
    );
    showToast(`✓ Tur ${nextTurn}'ye geçildi! Olay: ${nextEvent.title}`);
  }, [
    turn,
    playerTotalCash,
    inventories,
    companies,
    marketItems,
    updateBuyerPricesAndProcure,
    addLog,
    showToast,
  ]);

  const refreshAllMarketPrices = useCallback(async () => {
    await fetchBuyerStocksFromFinviz();
    updateBuyerPricesAndProcure();
  }, [fetchBuyerStocksFromFinviz, updateBuyerPricesAndProcure]);

  const resetProductionAndSales = useCallback(() => {
    const freshInv: Record<string, CompanyInventoryState> = {};
    companies.forEach((comp) => {
      freshInv[comp.id] = createInitialInventory(comp);
    });
    setInventories(freshInv);
    setCompanyStocks(createInitialCompanyStocks());
    setBuyerCompanies(INITIAL_BUYER_COMPANIES);
    setElapsedSeconds(0);
    showToast('✓ Tüm üretim döngüleri, depo stokları ve satışlar sıfırlandı.');
  }, [companies, showToast]);

  const navigateToCompany = useCallback(
    (companyId: string) => {
      setSelectedCompanyId(companyId);
      setActiveTab('company_detail');
    },
    []
  );

  return (
    <GameContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCompanyId,
        setSelectedCompanyId,
        navigateToCompany,
        currency,
        setCurrency,
        currencySymbol,
        turn,
        advanceTurn,
        activeEvent,
        turnSummaries,
        companies,
        selectedCompany,
        playerTotalCash,
        inventories,
        getCompanyInventory,
        ceoCards,
        assignCeoToCompany,
        buyerCompanies,
        sellToBuyer,
        sellAllToBuyer,
        supplyBuyerRecipe,
        updateBuyerPricesAndProcure,
        countries,
        currentCountry,
        countryTimeRemaining,
        sellToCountry,
        getExportPriceBreakdown,
        switchRandomCountry,
        marketItems,
        getMarketItem,
        isFactoryRunning,
        setIsFactoryRunning,
        sellProduct,
        sellAllProduct,
        toggleProductionLine,
        fastForwardLine,
        getProductPriceBreakdown,
        companyStocks,
        getCompanyStock,
        recordCompanySale,
        autoRefreshEnabled,
        setAutoRefreshEnabled,
        autoRefreshSeconds,
        refreshAllMarketPrices,
        resetProductionAndSales,
        isTimeRunning,
        toggleTimeRunning,
        setTimeRunning,
        elapsedSeconds,
        recentTransactions,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
