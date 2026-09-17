import { useState, type FormEvent } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { StockData } from '../types';
import { INITIAL_STOCKS } from '../data/stocks';

interface EditModalProps {
  stock: StockData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStock: StockData) => void;
}

export function EditModal({ stock, isOpen, onClose, onSave }: EditModalProps) {
  if (!isOpen || !stock) return null;

  const [price, setPrice] = useState(stock.price.toString());
  const [changePercent, setChangePercent] = useState(stock.changePercent.toString());
  const [marketCapTr, setMarketCapTr] = useState(stock.marketCapTr);
  const [revenue, setRevenue] = useState(stock.revenue);
  const [netIncome, setNetIncome] = useState(stock.netIncome);
  const [debt, setDebt] = useState(stock.debt);
  const [investment, setInvestment] = useState(stock.investment);
  const [sharesOutstanding, setSharesOutstanding] = useState(stock.sharesOutstanding);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price) || stock.price;
    const numChange = parseFloat(changePercent) || stock.changePercent;
    const changeAmt = Number(((numPrice * numChange) / 100).toFixed(2));

    onSave({
      ...stock,
      price: numPrice,
      changePercent: numChange,
      changeAmount: changeAmt,
      marketCapTr,
      revenue,
      netIncome,
      debt,
      investment,
      sharesOutstanding,
      lastUpdated: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
    onClose();
  };

  const handleResetToRealMarket = () => {
    const defaultStock = INITIAL_STOCKS.find((s) => s.symbol === stock.symbol);
    if (defaultStock) {
      setPrice(defaultStock.price.toString());
      setChangePercent(defaultStock.changePercent.toString());
      setMarketCapTr(defaultStock.marketCapTr);
      setRevenue(defaultStock.revenue);
      setNetIncome(defaultStock.netIncome);
      setDebt(defaultStock.debt);
      setInvestment(defaultStock.investment);
      setSharesOutstanding(defaultStock.sharesOutstanding);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="font-mono text-sm px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                {stock.cardNumber || '#01'}
              </span>
              <span>{stock.symbol}</span>
              <span className="text-xs text-slate-500 font-semibold">({stock.name})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hisse kartı nitelikleri ve finansal bilanço göstergelerini güncelleyin
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Hisse Fiyatı ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Günlük Değişim (%)</label>
              <input
                type="number"
                step="0.01"
                value={changePercent}
                onChange={(e) => setChangePercent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Piyasa Değeri</label>
              <input
                type="text"
                value={marketCapTr}
                onChange={(e) => setMarketCapTr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Gelir (Hasılat)</label>
              <input
                type="text"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Net Kâr</label>
              <input
                type="text"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Toplam Borç</label>
              <input
                type="text"
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Yatırım (CapEx)</label>
              <input
                type="text"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Dolaşımdaki Hisse</label>
              <input
                type="text"
                value={sharesOutstanding}
                onChange={(e) => setSharesOutstanding(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToRealMarket}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Gerçek Verilere Sıfırla</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg bg-transparent hover:bg-slate-100 text-slate-600 font-semibold transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
