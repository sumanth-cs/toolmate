import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Trash2, Copy, Check, Zap, Sparkles, Loader2 } from 'lucide-react';
import { minify } from 'terser';

export default function JsMinifier() {
  const [input, setInput] = useState('function hello(name) {\n  const message = "Hello " + name;\n  console.log(message);\n}\nhello("World");');
  const [output, setOutput] = useState('');
  const [copying, setCopying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const minifyJs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await minify(input, {
        compress: true,
        mangle: true
      });
      if (result.code) {
        setOutput(result.code);
      }
    } catch (err) {
      setError(err.message || 'Minification Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const savedPercent = input.length > 0 && output.length > 0 ?
  Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-6xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
                    <Code className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">JS Minifier</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Mangle and compress your JavaScript code using high-performance Terser engine.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Source JavaScript</label>
                        <button onClick={() => setInput('')} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 bg-black/10 border border-border rounded-2xl p-6 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition-all focus:bg-black/20"
            placeholder="async function example() { ..." />
          
                    <button
            onClick={minifyJs}
            disabled={loading || !input}
            className="btn-primary w-full bg-indigo-500 border-none h-14 uppercase font-black tracking-widest gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50">
            
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? 'Minifying...' : 'Minify JavaScript'}
                    </button>
                    {error &&
          <p className="text-xs text-red-500 font-mono bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
          }
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Compressed Build</label>
                        {output &&
            <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest">
                                Optimized {savedPercent}%
                            </span>
            }
                    </div>
                    <div className="w-full h-96 bg-black/20 border border-border rounded-2xl p-6 font-mono text-sm overflow-auto break-all relative bg-grid-white/[0.02]">
                        {output ?
            <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre> :

            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                                <Zap className="w-12 h-12" />
                                <p className="font-bold uppercase tracking-widest">Awaiting optimization</p>
                            </div>
            }
                    </div>
                    <button
            onClick={handleCopy}
            disabled={!output}
            className="btn-secondary w-full h-14 border-border font-black uppercase tracking-widest gap-2 hover:bg-white hover:text-black transition-all">
            
                        {copying ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        {copying ? 'Copied' : 'Copy Optimized Build'}
                    </button>
                </div>
            </div>
        </motion.div>);

}