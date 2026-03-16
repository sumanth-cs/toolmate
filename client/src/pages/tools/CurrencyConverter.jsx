import { useState } from 'react';
import { DollarSign, ArrowRightLeft, Loader2, AlertCircle, Activity } from 'lucide-react';
import axios from 'axios';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const commonCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'AED'];

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  // Deep extract a numeric value from any response shape
  const extractResult = (data) => {
    if (data === null || data === undefined) return null;

    // If it's already a number or numeric string
    if (typeof data === 'number') return data.toFixed(4);
    if (typeof data === 'string') {
      const num = parseFloat(data);
      if (!isNaN(num)) return num.toFixed(4);
      // Just return it if it's a non-empty string
      if (data.trim()) return data;
      return null;
    }

    // If it's an array, try the first element
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      return extractResult(data[0]);
    }

    // If it's an object, try common keys
    if (typeof data === 'object') {
      const keys = ['result', 'converted', 'amount', 'output', 'value', 'convertedAmount', 'rate', 'conversion', 'data', 'response'];
      for (const key of keys) {
        if (data[key] !== undefined) {
          const val = extractResult(data[key]);
          if (val) return val;
        }
      }
      // Try all keys
      for (const key of Object.keys(data)) {
        const val = data[key];
        if (typeof val === 'number') return val.toFixed(4);
        if (typeof val === 'string') {
          const num = parseFloat(val);
          if (!isNaN(num)) return num.toFixed(4);
        }
      }
    }

    return null;
  };

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = JSON.parse(localStorage.getItem('toolmate_user') || '{}')?.token;
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools/proxy/convert-currency`, {
        amount: Number(amount),
        from: fromCurrency,
        to: toCurrency
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const converted = extractResult(res.data);
      if (converted) {
        setResult(converted);
      } else {
        // Fallback: show the raw response as a string
        const raw = JSON.stringify(res.data);
        setError(`Unexpected response: ${raw.substring(0, 200)}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred converting currency.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 flex flex-col max-w-2xl mx-auto">
            <div className="mb-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Currency Converter</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Real-time exchange rates powered by AI automation.</p>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                <div className="flex flex-col gap-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">Amount</label>
                        <div className="relative flex items-center bg-background rounded-xl border border-border focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
                            <DollarSign className="w-5 h-5 text-foreground/40 absolute left-4" />
                            <input
                type="number"
                min="0"
                step="any"
                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-2xl font-bold focus:ring-0 focus:outline-none"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)} />
              
                        </div>
                    </div>

                    {/* Currencies */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">From</label>
                            <select
                className="w-full bg-background border border-border rounded-xl p-4 text-lg font-bold focus:ring-2 focus:ring-emerald-500/50 focus:outline-none appearance-none"
                value={fromCurrency}
                onChange={(e) => {setFromCurrency(e.target.value);setResult(null);}}>
                
                                {commonCurrencies.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <button
              onClick={handleSwap}
              className="mt-6 sm:mt-8 p-3 bg-accent rounded-full text-foreground/60 hover:text-foreground hover:bg-emerald-500/10 hover:text-emerald-500 transition-all flex-shrink-0 border border-border">
              
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>

                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">To</label>
                            <select
                className="w-full bg-background border border-border rounded-xl p-4 text-lg font-bold focus:ring-2 focus:ring-emerald-500/50 focus:outline-none appearance-none"
                value={toCurrency}
                onChange={(e) => {setToCurrency(e.target.value);setResult(null);}}>
                
                                {commonCurrencies.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <button
            onClick={handleConvert}
            disabled={loading || !amount || isNaN(Number(amount))}
            className="w-full mt-2 h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                        {loading ? 'Converting...' : 'Convert Currency'}
                    </button>
                </div>
            </div>

            {error &&
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3 text-sm mb-6 text-center">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
      }

            {result && !loading &&
      <div className="glass-card rounded-2xl p-6 border-emerald-500/20 text-center">
                    <p className="text-foreground/60 text-sm font-medium mb-1">
                        {amount} {fromCurrency} equals
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
                        {result} <span className="text-2xl">{toCurrency}</span>
                    </h2>
                </div>
      }
        </div>);

}