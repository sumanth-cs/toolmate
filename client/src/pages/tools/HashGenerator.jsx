import { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary as HashIcon, Copy, Check } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [copiedStates, setCopiedStates] = useState({});

  const handleCopy = (hashValue, algo) => {
    if (!hashValue) return;
    navigator.clipboard.writeText(hashValue);
    setCopiedStates({ ...copiedStates, [algo]: true });
    setTimeout(() => setCopiedStates({ ...copiedStates, [algo]: false }), 2000);
  };

  const getHash = (algo, text) => {
    if (!text) return '';
    switch (algo) {
      case 'MD5':return CryptoJS.MD5(text).toString();
      case 'SHA-1':return CryptoJS.SHA1(text).toString();
      case 'SHA-256':return CryptoJS.SHA256(text).toString();
      case 'SHA-512':return CryptoJS.SHA512(text).toString();
      default:return '';
    }
  };

  const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <HashIcon className="w-8 h-8 text-brand-500" />
                    Hash Generator
                </h1>
                <p className="text-foreground/60 mt-2">Generate multiple cryptographic hashes from input string simultaneously.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 w-full max-w-5xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">Input Text</label>
                    <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field min-h-[120px] font-mono text-sm resize-none"
            placeholder="Type string to hash..." />
          
                </div>

                <div className="space-y-4">
                    {algorithms.map((algo) => {
            const hashValue = getHash(algo, input);
            const isCopied = copiedStates[algo];

            return (
              <div key={algo} className="bg-background/40 border border-border rounded-xl p-4 flex flex-col gap-2 relative">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-brand-500 tracking-wide">{algo}</h3>
                                    <button
                    onClick={() => handleCopy(hashValue, algo)}
                    disabled={!hashValue}
                    className="text-xs flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50">
                    
                                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {isCopied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-black/20 p-3 rounded-lg font-mono text-xs md:text-sm break-all text-foreground/80 min-h-[44px] flex items-center">
                                    {hashValue || 'Awaiting input...'}
                                </div>
                            </div>);

          })}
                </div>
            </div>
        </motion.div>);

}