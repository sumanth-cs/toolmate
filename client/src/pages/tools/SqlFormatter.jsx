import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Trash2, Copy, Check, Sparkles, FileText } from 'lucide-react';
import { format } from 'sql-formatter';

export default function SqlFormatter() {
  const [input, setInput] = useState("SELECT * FROM users WHERE active = 1 AND city IN ('New York', 'London') ORDER BY created_at DESC;");
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [copied, setCopied] = useState(false);

  const formatSql = () => {
    try {
      const formatted = format(input, {
        language: dialect,
        keywordCase: 'upper',
        tabWidth: 4
      });
      setOutput(formatted);
    } catch (err) {
      setOutput('-- Query Error: Check syntax or dialect\n' + input);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-6xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SQL Formatter</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Prettify and standardise your complex SQL queries for better clarity.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Query Input</label>
                        <button onClick={() => setInput('')} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[400px] bg-black/10 border border-border rounded-2xl p-6 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            placeholder="SELECT * FROM table..." />
          
                    <div className="flex gap-4">
                        <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value)}
              className="bg-black/20 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500">
              
                            <option value="sql">Standard SQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="postgresql">PostgreSQL</option>
                            <option value="tsql">T-SQL (SQL Server)</option>
                            <option value="sqlite">SQLite</option>
                        </select>
                        <button
              onClick={formatSql}
              className="btn-primary flex-1 bg-indigo-500 border-none h-14 uppercase font-black tracking-widest gap-2 shadow-lg shadow-indigo-500/20">
              
                            <Sparkles className="w-5 h-5" /> Format Query
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Formatted Query</label>
                        <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-2 text-xs font-bold text-indigo-500 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest disabled:opacity-30">
              
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Query'}
                        </button>
                    </div>
                    <div className="w-full h-[400px] bg-black/20 border border-border rounded-2xl p-6 font-mono text-sm overflow-auto leading-relaxed relative group">
                        {output ?
            <pre className="text-indigo-400 whitespace-pre-wrap">{output}</pre> :

            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                                <FileText className="w-12 h-12" />
                                <p className="font-bold uppercase tracking-widest">Click Format to see output</p>
                            </div>
            }
                    </div>
                </div>
            </div>
        </motion.div>);

}