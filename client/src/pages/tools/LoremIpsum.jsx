import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, Copy, Check, RefreshCw } from 'lucide-react';

const wordsList = [
"lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
"sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
"magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
"exercitation", "ullamco", "laboris", "nisi", "mollit", "aliquip", "ex", "ea",
"commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
"voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur",
"excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
"culpa", "qui", "officia", "deserunt", "anim", "id", "est", "laborum"];


export default function LoremIpsum() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    let generatedText = '';

    switch (type) {
      case 'words':
        for (let i = 0; i < count; i++) {
          const word = wordsList[Math.floor(Math.random() * wordsList.length)];
          generatedText += (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + ' ';
        }
        generatedText = generatedText.trim() + '.';
        break;

      case 'sentences':
        for (let i = 0; i < count; i++) {
          let sentenceLength = Math.floor(Math.random() * 8) + 5;
          let sentence = '';
          for (let j = 0; j < sentenceLength; j++) {
            const word = wordsList[Math.floor(Math.random() * wordsList.length)];
            sentence += (j === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + (j === sentenceLength - 1 ? '' : ' ');
          }
          generatedText += sentence + '. ';
        }
        break;

      case 'paragraphs':
        for (let i = 0; i < count; i++) {
          let paragraphLength = Math.floor(Math.random() * 5) + 3; // 3-8 sentences per paragraph
          let paragraph = '';
          for (let j = 0; j < paragraphLength; j++) {
            let sentenceLength = Math.floor(Math.random() * 8) + 5;
            let sentence = '';
            for (let k = 0; k < sentenceLength; k++) {
              const word = wordsList[Math.floor(Math.random() * wordsList.length)];
              sentence += (k === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) + (k === sentenceLength - 1 ? '' : ' ');
            }
            paragraph += sentence + '. ';
          }
          generatedText += paragraph.trim() + '\n\n';
        }
        break;
    }

    setOutput(generatedText.trim());
    setCopied(false);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <AlignLeft className="w-8 h-8 text-brand-500" />
                    Lorem Ipsum Generator
                </h1>
                <p className="text-foreground/60 mt-2">Generate placeholder text customized by paragraphs, sentences or words.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 w-full max-w-5xl mx-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background/50 p-4 border border-border rounded-xl">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80">Generate</label>
                        <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field">
              
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80">Count</label>
                        <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="input-field" />
            
                    </div>
                </div>

                <div className="flex flex-col gap-2 min-h-[400px]">
                    <div className="flex justify-between items-center">
                        <button
              onClick={handleCopy}
              disabled={!output}
              className="text-sm flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50">
              
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    
                    <div className="bg-background border border-border rounded-xl p-4 flex-1 font-mono text-sm overflow-y-auto whitespace-pre-wrap text-foreground/80">
                        {output || 'Click Generate to get some beautiful placeholder text...'}
                    </div>
                </div>

                <div className="flex lg:justify-center">
                    <button onClick={generateLorem} className="btn-primary w-full md:w-auto h-12 px-8 flex gap-2 text-lg">
                        <RefreshCw className="w-5 h-5" />
                        Generate Text
                    </button>
                </div>
            </div>
        </motion.div>);

}