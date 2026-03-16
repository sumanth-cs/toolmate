import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, RefreshCw } from 'lucide-react';
import { create, all } from 'mathjs';

const math = create(all, {});

export default function UnitConverter() {
  const [category, setCategory] = useState('Length');

  // Categories to pre-define the units supported by mathjs easily without complex querying
  const unitOptions = {
    'Length': ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi'],
    'Mass': ['kg', 'g', 'mg', 'lb', 'oz'],
    'Volume': ['l', 'ml', 'm3', 'cm3', 'in3', 'gal', 'cup'],
    'Temperature': ['degC', 'degF', 'degK'],
    'Time': ['s', 'min', 'h', 'day', 'week', 'month', 'year']
  };

  const [fromUnit, setFromUnit] = useState(unitOptions[category][0]);
  const [toUnit, setToUnit] = useState(unitOptions[category][1]);
  const [value, setValue] = useState('1');

  // Handle category change reset
  const handleCategoryChange = (c) => {
    setCategory(c);
    setFromUnit(unitOptions[c][0]);
    setToUnit(unitOptions[c][1]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const result = useMemo(() => {
    try {
      if (!value || isNaN(Number(value))) return '-';
      // Mathjs unit conversion
      const v = math.unit(Number(value), fromUnit).toNumber(toUnit);
      // formatting
      if (Math.abs(v) < 0.0001 || Math.abs(v) > 10000) return v.toExponential(4);
      return Number.isInteger(v) ? v : v.toFixed(4);
    } catch (error) {
      return 'Invalid conversion';
    }
  }, [value, fromUnit, toUnit]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-3xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
                    <Scale className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Unit Converter</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Precisely convert between lengths, weights, temperatures, and more.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {Object.keys(unitOptions).map((c) =>
          <button
            key={c}
            onClick={() => handleCategoryChange(c)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${category === c ? 'bg-indigo-500 text-white shadow-indigo-500/30 shadow-lg' : 'bg-background hover:bg-accent border border-border text-foreground/70 hover:text-foreground'}`}>
            
                            {c}
                        </button>
          )}
                </div>

                {/* Conversion Interface */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* From Section */}
                    <div className="flex-1 w-full bg-black/5 p-6 rounded-2xl border border-border shadow-inner">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-3 block">From</label>
                        <div className="flex gap-4 items-center">
                            <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-3/5 bg-background border border-border rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none" />
              
                            <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-2/5 bg-background border border-border rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer appearance-none text-indigo-500">
                
                                {unitOptions[category].map((u) => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <button
            onClick={swapUnits}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all outline-none">
            
                        <RefreshCw className="w-6 h-6" />
                    </button>

                    {/* To Section */}
                    <div className="flex-1 w-full bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 shadow-inner">
                        <label className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest mb-3 block">To (Result)</label>
                        <div className="flex gap-4 items-center">
                            <div
                className="w-3/5 bg-background border border-border rounded-xl px-4 py-3 text-lg font-bold text-emerald-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
                
                                {result}
                            </div>
                            <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-2/5 bg-background border border-border rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer appearance-none text-emerald-500">
                
                                {unitOptions[category].map((u) => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>);

}