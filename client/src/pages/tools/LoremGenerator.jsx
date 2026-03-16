import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, Copy, Check, RefreshCw } from 'lucide-react';
import { loremIpsum } from 'lorem-ipsum';

export default function LoremGenerator() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(3);
  const [format, setFormat] = useState('paragraphs');
  const [copied, setCopied] = useState(false);

  const generateModeMap = {
    'paragraphs': 'paragraphs',
    'sentences': 'sentences',
    'words': 'words'
  };

  const generateText = () => {
    const output = loremIpsum({
      count,
      format: 'plain',
      units: generateModeMap[format],
      paragraphLowerBound: 3,
      paragraphUpperBound: 7,
      sentenceLowerBound: 5,
      sentenceUpperBound: 15
    });

    setText(format === 'paragraphs' ? output.replace(/\n/g, '\n\n') : output);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center mb-4">
                    <AlignLeft className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lorem Ipsum Generator</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Generate dummy text for your mockups and wireframes.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-foreground/80 mb-3">Amount</label>
                        <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className="input-field w-full text-lg h-14 font-bold" />
            
                    </div>
                    <div className="flex-[2]">
                        <label className="block text-sm font-semibold text-foreground/80 mb-3">Unit Type</label>
                        <div className="flex gap-2">
                            {['paragraphs', 'sentences', 'words'].map((f) =>
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 h-14 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${format === f ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-background border border-border hover:bg-black/5'}`}>
                
                                    {f}
                                </button>
              )}
                        </div>
                    </div>
                    <div className="flex-1 flex items-end">
                        <button
              onClick={generateText}
              className="btn-primary w-full h-14 gap-2 text-base bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/20">
              
                            <RefreshCw className="w-4 h-4" /> Generate
                        </button>
                    </div>
                </div>

                {/* Output */}
                <div className="relative border border-border rounded-xl bg-black/5 overflow-hidden">
                    <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
                        <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Output ({count} {format})</span>
                        <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg flex gap-2 items-center text-xs font-bold transition-all ${copied ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600' : 'bg-background border border-border hover:bg-accent text-foreground'}`}>
              
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>
                    </div>
                    <div className="p-6 max-h-[400px] overflow-y-auto font-medium text-foreground/80 whitespace-pre-wrap leading-relaxed">
                        {text || <span className="text-foreground/30 italic">Click Generate to create random placeholder text...</span>}
                    </div>
                </div>
            </div>
        </motion.div>);

}