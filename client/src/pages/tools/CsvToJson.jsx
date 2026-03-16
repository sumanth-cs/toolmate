import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Download, ListTree } from 'lucide-react';

export default function CsvToJson() {
  const [csvInput, setCsvInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convertToJson = () => {
    try {
      setError('');
      if (!csvInput.trim()) {
        setJsonOutput('');
        return;
      }

      // A more robust CSV parsing function handling quoted fields and commas inside quotes
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result.map((s) => s.replace(/^"|"$/g, '').trim());
      };

      const lines = csvInput.trim().split('\n').filter((line) => line.trim());
      if (lines.length === 0) {
        setJsonOutput('');
        return;
      }

      const headers = parseCSVLine(lines[0]);
      const jsonArray = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          const key = headers[j];
          const val = values[j] !== undefined ? values[j] : '';
          if (key) {
            try {
              const parsedVal = JSON.parse(val);
              obj[key] = parsedVal;
            } catch {
              const num = Number(val);
              if (!isNaN(num) && val.trim() !== '') {
                obj[key] = num;
              } else if (val.toLowerCase() === 'true') {
                obj[key] = true;
              } else if (val.toLowerCase() === 'false') {
                obj[key] = false;
              } else {
                obj[key] = val;
              }
            }
          }
        }
        jsonArray.push(obj);
      }

      setJsonOutput(JSON.stringify(jsonArray, null, 4));
    } catch (e) {
      setError('Error parsing CSV: ' + e.message);
      setJsonOutput('');
    }
  };

  const handleCopy = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'converted.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <ListTree className="w-8 h-8 text-brand-500" />
                    CSV to JSON
                </h1>
                <p className="text-foreground/60 mt-2">Convert flat CSV data into structured JSON objects instantly.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col gap-6 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="flex flex-col gap-2 relative h-full">
                        <label className="text-sm font-semibold text-foreground/80">Input CSV Data</label>
                        <textarea
              value={csvInput}
              onChange={(e) => {
                setCsvInput(e.target.value);
                setError('');
              }}
              className={`input-field flex-1 resize-none h-64 font-mono text-sm ${error ? 'border-red-500/50 ring-red-500/20' : ''}`}
              placeholder="Paste your CSV data here (header row required)..." />
            
                        {error && <div className="text-red-400 text-xs mt-1 absolute bottom-2 left-2 p-2 bg-red-500/10 rounded">{error}</div>}
                    </div>

                    <div className="flex flex-col gap-2 relative h-full">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-foreground/80">Output JSON</label>
                            <div className="flex items-center gap-4">
                                <button
                  onClick={handleCopy}
                  disabled={!jsonOutput}
                  className="text-sm flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50">
                  
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                  onClick={downloadJson}
                  disabled={!jsonOutput}
                  className="text-sm flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50">
                  
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg flex-1 overflow-auto font-mono text-sm ring-1 ring-inset whitespace-pre wrap bg-background ring-border text-foreground">
                            {jsonOutput || 'Result will appear here...'}
                        </div>
                    </div>
                </div>

                <div className="flex lg:justify-center">
                    <button onClick={convertToJson} className="btn-primary w-full md:w-auto h-12 px-8 flex gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Convert Data
                    </button>
                </div>
            </div>
        </motion.div>);

}