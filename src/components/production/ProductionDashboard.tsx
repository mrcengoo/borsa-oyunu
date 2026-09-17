import { useState, useEffect, useCallback, useRef } from 'react';
import { ARZ_COMPANY } from '../../data/productionCompanies';
import {
  CompanyConfig,
  CompanyInventoryState,
  ProductionLogEntry,
  RawMaterialProduct,
  ProductLineStatus,
} from '../../types/production';
import { CompanyOverviewCard } from './CompanyOverviewCard';
import { CeoSkillsCard } from './CeoSkillsCard';
import { ProductionSection } from './ProductionSection';
import { InventorySection } from './InventorySection';
import { ProductionLogsCard } from './ProductionLogsCard';

interface ProductionDashboardProps {
  currency: 'USD' | 'TRY';
  usdRate?: number;
  showToast?: (message: string) => void;
}

const STORAGE_KEY = 'arz_production_timer_save_v2';

export function ProductionDashboard({ currency, showToast }: ProductionDashboardProps) {
  const company: CompanyConfig = ARZ_COMPANY;

  // Initialize line statuses for 4 products: Çimento (60s), Petrol (60s), Çelik (120s), Bakır (180s)
  const getInitialLines = (): Record<string, ProductLineStatus> => {
    const lines: Record<string, ProductLineStatus> = {};
    company.products.forEach((prod) => {
      lines[prod.id] = {
        productId: prod.id,
        productName: prod.name,
        totalDurationSeconds: prod.durationSeconds,
        remainingSeconds: prod.durationSeconds,
        isAutoProducing: true, // Otomatik üretim aktif
        isActive: true,
        completedBatches: 0,
      };
    });
    return lines;
  };

  const getInitialInventoryState = (): CompanyInventoryState => ({
    cash: company.initialCash,
    stock: {
      cimento: 0,
      petrol: 0,
      celik: 0,
      bakir: 0,
    },
    lines: getInitialLines(),
    totalProduced: {
      cimento: 0,
      petrol: 0,
      celik: 0,
      bakir: 0,
    },
    totalSold: {
      cimento: 0,
      petrol: 0,
      celik: 0,
      bakir: 0,
    },
    totalRevenue: 0,
    totalExpenses: 0,
  });

  const [inventoryState, setInventoryState] = useState<CompanyInventoryState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inv`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure lines exist with current duration constants
        if (!parsed.lines || Object.keys(parsed.lines).length < 4) {
          parsed.lines = getInitialLines();
        }
        return parsed;
      }
    } catch {}
    return getInitialInventoryState();
  });

  const [isFactoryRunning, setIsFactoryRunning] = useState<boolean>(true);

  const [logs, setLogs] = useState<ProductionLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-1',
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type: 'system',
        message: 'Gerçek zamanlı otomatik üretim başlatıldı (Çimento 60s, Petrol 60s, Çelik 120s, Bakır 180s).',
      },
    ];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_inv`, JSON.stringify(inventoryState));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(logs.slice(0, 30)));
    } catch {}
  }, [inventoryState, logs]);

  const addLog = useCallback(
    (
      type: ProductionLogEntry['type'],
      message: string,
      amountChange?: number
    ) => {
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
      };
      setLogs((prev) => [newEntry, ...prev.slice(0, 40)]);
    },
    []
  );

  // REAL-TIME TICK ENGINE (Ticks every 1 second)
  useEffect(() => {
    if (!isFactoryRunning) return;

    const interval = setInterval(() => {
      setInventoryState((prev) => {
        let cashChanged = false;
        let newCash = prev.cash;
        let newExpenses = prev.totalExpenses;
        const newStock = { ...prev.stock };
        const newTotalProduced = { ...prev.totalProduced };
        const newLines: Record<string, ProductLineStatus> = {};
        const completedThisTick: string[] = [];

        company.products.forEach((prod) => {
          const line = prev.lines[prod.id] || {
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
            };
          } else {
            // Reached 0: Batch Complete!
            newStock[prod.id] = (newStock[prod.id] || 0) + 1;
            newTotalProduced[prod.id] = (newTotalProduced[prod.id] || 0) + 1;
            completedThisTick.push(prod.name);

            // Cost for the next automatic cycle
            if (newCash >= prod.productionCost) {
              newCash -= prod.productionCost;
              newExpenses += prod.productionCost;
              cashChanged = true;

              newLines[prod.id] = {
                ...line,
                remainingSeconds: prod.durationSeconds, // restart countdown
                completedBatches: line.completedBatches + 1,
                isActive: true,
              };
            } else {
              // Not enough cash to start next cycle immediately, pause until sold
              newLines[prod.id] = {
                ...line,
                remainingSeconds: prod.durationSeconds,
                completedBatches: line.completedBatches + 1,
                isActive: false, // pause until funds replenished
              };
            }
          }
        });

        if (completedThisTick.length > 0) {
          setTimeout(() => {
            const names = completedThisTick.join(', ');
            addLog(
              'produce_complete',
              `🎉 ${names} üretimi tamamlandı ve ARZ stoğuna 1 adet eklendi!`
            );
            showToast?.(`✓ ${names} üretildi ve depoya eklendi!`);
          }, 10);
        }

        return {
          ...prev,
          cash: newCash,
          totalExpenses: newExpenses,
          stock: newStock,
          totalProduced: newTotalProduced,
          lines: newLines,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFactoryRunning, company.products, addLog, showToast]);

  // FAST FORWARD (for testing without waiting full seconds)
  const handleFastForward = useCallback(
    (seconds: number = 15) => {
      setInventoryState((prev) => {
        let newCash = prev.cash;
        let newExpenses = prev.totalExpenses;
        const newStock = { ...prev.stock };
        const newTotalProduced = { ...prev.totalProduced };
        const newLines: Record<string, ProductLineStatus> = {};
        const completed: string[] = [];

        company.products.forEach((prod) => {
          const line = prev.lines[prod.id];
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
                remainingSeconds: prod.durationSeconds + rem, // wrapped
                completedBatches: line.completedBatches + 1,
              };
            } else {
              newLines[prod.id] = {
                ...line,
                remainingSeconds: prod.durationSeconds,
                completedBatches: line.completedBatches + 1,
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
          const names = completed.join(', ');
          addLog('produce_complete', `⚡ Hızlı sarma: ${names} üretildi ve stoğa eklendi.`);
          showToast?.(`⚡ ${names} üretildi (+1 Adet)`);
        } else {
          showToast?.(`⚡ Süreç ${seconds} saniye ileri sarıldı`);
        }

        return {
          ...prev,
          cash: newCash,
          totalExpenses: newExpenses,
          stock: newStock,
          totalProduced: newTotalProduced,
          lines: newLines,
        };
      });
    },
    [company.products, addLog, showToast]
  );

  // TOGGLE SINGLE LINE AUTO-PRODUCE
  const handleToggleLineAuto = useCallback((productId: string) => {
    setInventoryState((prev) => {
      const line = prev.lines[productId];
      if (!line) return prev;
      const nextAuto = !line.isAutoProducing;
      return {
        ...prev,
        lines: {
          ...prev.lines,
          [productId]: {
            ...line,
            isAutoProducing: nextAuto,
            isActive: nextAuto,
          },
        },
      };
    });
  }, []);

  // RESTART SINGLE LINE MANUALLY
  const handleRestartLine = useCallback(
    (prod: RawMaterialProduct) => {
      setInventoryState((prev) => {
        let newCash = prev.cash;
        let newExpenses = prev.totalExpenses;
        if (newCash >= prod.productionCost) {
          newCash -= prod.productionCost;
          newExpenses += prod.productionCost;
        }
        return {
          ...prev,
          cash: newCash,
          totalExpenses: newExpenses,
          lines: {
            ...prev.lines,
            [prod.id]: {
              productId: prod.id,
              productName: prod.name,
              totalDurationSeconds: prod.durationSeconds,
              remainingSeconds: prod.durationSeconds,
              isAutoProducing: true,
              isActive: true,
              completedBatches: prev.lines[prod.id]?.completedBatches || 0,
            },
          },
        };
      });
      showToast?.(`✓ ${prod.name} üretim sayacı sıfırlandı ve başlatıldı (${prod.durationSeconds} sn)`);
    },
    [showToast]
  );

  // SELL PRODUCT (Rules 9, 10, 11, 12, 13, 14, 15)
  const handleSellProduct = useCallback(
    (product: RawMaterialProduct, quantity: number = 1) => {
      const currentStock = inventoryState.stock[product.id] || 0;
      if (currentStock < quantity) {
        showToast?.(`⚠️ Stokta yeterli ${product.name} bulunmuyor!`);
        return;
      }

      // 1. Taban Satış (Maliyet): Çimento 4, Petrol 2, Çelik 6, Bakır 7
      // 2. (+) Gelir Bonusları: Satış +5, İhracat +4, Pazarlama +3, Ar-Ge +1 (+13), Petrolde +2 (+15)
      // 3. (-) Gider Bonusları: İşçilik -4, Finansman -3, Bakım -2, Lojistik -2 (-11)
      // 4. (=) Tam Satış Fiyatı (Maliyet + Gelir Bonusları - Gider Bonusları)
      const basePrice = product.baseSellPrice;
      const salesBonus = 5;
      const exportBonus = 4;
      const marketingBonus = 3;
      const rdBonus = 1;
      const generalIncomeBonus = salesBonus + exportBonus + marketingBonus + rdBonus; // 13
      const oilBonus = product.isSpecialOil ? 2 : 0; // Petrol Bonusu +2
      const totalIncomeBonus = generalIncomeBonus + oilBonus; // 13 veya 15
      const grossPrice = basePrice + totalIncomeBonus; // Gelir ekli fiyat (örn. 4 + 13 = 17)
      const totalExpenseBonus = 11; // 11
      const unitRevenue = Math.max(1, grossPrice - totalExpenseBonus); // Tam Satış Fiyatı (örn. 17 - 11 = 6)
      const totalSaleRevenue = unitRevenue * quantity;

      setInventoryState((prev) => {
        const nextCash = prev.cash + totalSaleRevenue;
        // Reactivate any paused lines if cash is now available
        const updatedLines = { ...prev.lines };
        Object.keys(updatedLines).forEach((pId) => {
          if (!updatedLines[pId].isActive && updatedLines[pId].isAutoProducing) {
            updatedLines[pId] = {
              ...updatedLines[pId],
              isActive: true,
            };
          }
        });

        return {
          ...prev,
          cash: nextCash,
          totalRevenue: prev.totalRevenue + totalSaleRevenue,
          lines: updatedLines,
          stock: {
            ...prev.stock,
            [product.id]: prev.stock[product.id] - quantity,
          },
          totalSold: {
            ...prev.totalSold,
            [product.id]: (prev.totalSold[product.id] || 0) + quantity,
          },
        };
      });

      const bonusText = product.isSpecialOil
        ? ` (Maliyet: ${basePrice} + Gelir Bonusları: +15 - Gider Bonusları: -11 = Tam Satış: ${unitRevenue})`
        : ` (Maliyet: ${basePrice} + Gelir Bonusları: +13 - Gider Bonusları: -11 = Tam Satış: ${unitRevenue})`;

      const msg = `💰 ${quantity} ${product.unit} ${product.name} satıldı: +${totalSaleRevenue}${bonusText}. ARZ kasasına eklendi.`;
      addLog('sell', msg, totalSaleRevenue);
      showToast?.(`✓ ${quantity} ${product.name} satıldı (+${totalSaleRevenue})`);
    },
    [inventoryState.stock, addLog, showToast]
  );

  // RESET SIMULATION
  const handleResetGame = useCallback(() => {
    if (!window.confirm('ARZ Fabrika ve Stok simülasyonunu sıfırlamak istediğinize emin misiniz?')) {
      return;
    }
    const freshInv = getInitialInventoryState();
    setInventoryState(freshInv);
    setIsFactoryRunning(true);
    setLogs([
      {
        id: 'reset-1',
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type: 'system',
        message: 'Simülasyon sıfırlandı. 100 başlangıç sermayesi tahsis edildi ve otomatik üretim başlatıldı.',
      },
    ]);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_inv`);
      localStorage.removeItem(`${STORAGE_KEY}_logs`);
    } catch {}
    showToast?.('✓ ARZ Üretim ve Stok simülasyonu sıfırlandı.');
  }, [showToast]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Company Overview Header Card with Real-time Status */}
      <CompanyOverviewCard
        company={company}
        inventoryState={inventoryState}
        isFactoryRunning={isFactoryRunning}
        onToggleFactory={() => setIsFactoryRunning((prev) => !prev)}
        onFastForward={handleFastForward}
        onResetGame={handleResetGame}
        currency={currency}
      />

      {/* 2. CEO Skills Section */}
      <CeoSkillsCard company={company} />

      {/* 3. Real-time Production Lines (60s, 60s, 120s, 180s) */}
      <ProductionSection
        company={company}
        inventoryState={inventoryState}
        onToggleLineAuto={handleToggleLineAuto}
        onRestartLine={handleRestartLine}
        currency={currency}
      />

      {/* 4. Company Warehouse & Product Sales */}
      <InventorySection
        company={company}
        inventoryState={inventoryState}
        onSellProduct={handleSellProduct}
        currency={currency}
      />

      {/* 5. Real-Time Transaction Logs */}
      <ProductionLogsCard logs={logs} currency={currency} />
    </div>
  );
}
