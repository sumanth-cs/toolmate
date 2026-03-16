import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Trash2 } from 'lucide-react';
import * as diff from 'diff';

export default function DataComparator() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [viewMode, setViewMode] = useState('line');

  const diffResult = useMemo(() => {
    if (viewMode === 'line') {
      return diff.diffLines(left, right);
    }
    return diff.diffWords(left, right);
  }, [left, right, viewMode]);

  const handleClear = () => {
    setLeft('');
    setRight('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-6xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center mb-4">
                    <GitCompare className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Data Comparator</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Compare two sets of text or data and visualize the differences instantly.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Original Data (Left)</label>
                        <button onClick={() => setLeft('')} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original data here..."
            className="w-full h-64 bg-black/10 border border-border rounded-2xl p-4 font-mono text-sm outline-none focus:ring-1 focus:ring-amber-500 resize-none" />
          
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Modified Data (Right)</label>
                        <button onClick={() => setRight('')} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified data here..."
            className="w-full h-64 bg-black/10 border border-border rounded-2xl p-4 font-mono text-sm outline-none focus:ring-1 focus:ring-amber-500 resize-none" />
          
                </div>
            </div>

            <div className="glass-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
                <div className="h-16 border-b border-border bg-black/20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                            <GitCompare className="w-4 h-4 text-amber-500" /> Comparison Result
                        </span>
                        <div className="flex bg-black/40 rounded-lg p-1 border border-border">
                            <button
                onClick={() => setViewMode('line')}
                className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'line' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-foreground/40 hover:text-foreground'}`}>
                
                                Line Diff
                            </button>
                            <button
                onClick={() => setViewMode('word')}
                className={`px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'word' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-foreground/40 hover:text-foreground'}`}>
                
                                Word Diff
                            </button>
                        </div>
                    </div>
                    <button onClick={handleClear} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest">
                        <Trash2 className="w-3 h-3" /> Clear Both
                    </button>
                </div>

                <div className="p-8 bg-black/40 font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[300px] overflow-y-auto max-h-[600px]">
                    {left || right ?
          diffResult.map((part, index) =>
          <span
            key={index}
            className={`${
            part.added ? 'bg-emerald-500/20 text-emerald-400 border-x border-emerald-500/30' :
            part.removed ? 'bg-red-500/20 text-red-400 border-x border-red-500/30 line-through' :
            'text-foreground/60'} px-0.5 rounded-sm`
            }>
            
                                {part.value}
                            </span>
          ) :

          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
                            <GitCompare className="w-12 h-12" />
                            <p className="font-bold uppercase tracking-widest">Paste data in both fields to compare</p>
                        </div>
          }
                </div>
            </div>
        </motion.div>);

}