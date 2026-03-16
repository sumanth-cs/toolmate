import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Download, ListTree } from 'lucide-react';

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState('');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convertToCsv = () => {
    try {
      setError('');
      if (!jsonInput.trim()) {
        setCsvOutput('');
        return;
      }

      const parsedObj = JSON.parse(jsonInput);
      const arrayToConvert = Array.isArray(parsedObj) ? parsedObj : [parsedObj];

      if (arrayToConvert.length === 0) {
        setCsvOutput('');
        return;
      }

      const collectKeys = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, key) => {
          const value = obj[key];
          const pre = prefix.length ? prefix + '.' : '';
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            acc.push(...collectKeys(value, pre + key));
          } else {
            acc.push(pre + key);
          }
          return acc;
        }, []);
      };

      const headerKeys = new Set();
      arrayToConvert.forEach((item) => {
        const keys = collectKeys(item);
        keys.forEach((k) => headerKeys.add(k));
      });

      const headers = Array.from(headerKeys);

      const getValue = (obj, path) => {
        const keys = path.split('.');
        let val = obj;
        for (let key of keys) {
          if (val === undefined || val === null) return '';
          val = val[key];
        }
        return val;
      };

      const csvRows = [];
      csvRows.push(headers.join(','));

      arrayToConvert.forEach((item) => {
        const values = headers.map((header) => {
          let val = getValue(item, header);
          if (val === null || val === undefined) val = '';else
          if (typeof val === 'object') val = JSON.stringify(val);else
          val = String(val);

          val = val.replace(/"/g, '""');
          if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
          return val;
        });
        csvRows.push(values.join(','));
      });

      setCsvOutput(csvRows.join('\n'));
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
      setCsvOutput('');
    }
  };

  const handleCopy = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'converted.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <ListTree className="w-8 h-8 text-brand-500" />
                    JSON to CSV
                </h1>
                <p className="text-foreground/60 mt-2">Convert complex nested JSON structure into flat CSV data instantly.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col gap-6 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="flex flex-col gap-2 relative h-full">
                        <label className="text-sm font-semibold text-foreground/80">Input JSON Array or Object</label>
                        <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError('');
              }}
              className={`input-field flex-1 resize-none h-64 font-mono text-sm ${error ? 'border-red-500/50 ring-red-500/20' : ''}`}
              placeholder="Paste your JSON here..." />
            
                        {error && <div className="text-red-400 text-xs mt-1 absolute bottom-2 left-2 p-2 bg-red-500/10 rounded">{error}</div>}
                    </div>

                    <div className="flex flex-col gap-2 relative h-full">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-foreground/80">Output CSV</label>
                            <div className="flex items-center gap-4">
                                <button
                  onClick={handleCopy}
                  disabled={!csvOutput}
                  className="text-sm flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50">
                  
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                  onClick={downloadCsv}
                  disabled={!csvOutput}
                  className="text-sm flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50">
                  
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg flex-1 overflow-auto font-mono text-sm ring-1 ring-inset whitespace-pre wrap bg-background ring-border text-foreground">
                            {csvOutput || 'Result will appear here...'}
                        </div>
                    </div>
                </div>

                <div className="flex lg:justify-center">
                    <button onClick={convertToCsv} className="btn-primary w-full md:w-auto h-12 px-8 flex gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Convert Data
                    </button>
                </div>
            </div>
        </motion.div>);

}