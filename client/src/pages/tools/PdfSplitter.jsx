import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SplitSquareHorizontal, Upload, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [rangeInput, setRangeInput] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (f) => {
    if (f.type !== 'application/pdf') {alert('Please upload a PDF file.');return;}
    const data = await f.arrayBuffer();
    try {
      const pdf = await PDFDocument.load(data);
      setFile({ name: f.name, data, pages: pdf.getPageCount() });
      setRangeInput(`1-${pdf.getPageCount()}`);
    } catch {
      alert('Could not read this PDF. It may be corrupted or encrypted.');
    }
  }, []);

  const parseRanges = (input, maxPages) => {
    const ranges = [];
    const parts = input.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = Math.max(1, parseInt(startStr));
        const end = Math.min(maxPages, parseInt(endStr));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          ranges.push(Array.from({ length: end - start + 1 }, (_, i) => start + i - 1));
        }
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          ranges.push([page - 1]);
        }
      }
    }
    return ranges;
  };

  const splitPdf = async () => {
    if (!file) return;
    setSplitting(true);
    try {
      const ranges = parseRanges(rangeInput, file.pages);
      if (ranges.length === 0) {
        alert('Invalid page range. Example: 1-3, 5, 7-10');
        setSplitting(false);
        return;
      }

      const sourcePdf = await PDFDocument.load(file.data);

      if (ranges.length === 1) {
        // Single range — download as one PDF
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(sourcePdf, ranges[0]);
        pages.forEach((p) => newPdf.addPage(p));
        const bytes = await newPdf.save();
        saveAs(new Blob([bytes.buffer], { type: 'application/pdf' }), `split_${file.name}`);
      } else {
        // Multiple ranges — download each separately
        for (let i = 0; i < ranges.length; i++) {
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(sourcePdf, ranges[i]);
          pages.forEach((p) => newPdf.addPage(p));
          const bytes = await newPdf.save();
          saveAs(new Blob([bytes.buffer], { type: 'application/pdf' }), `split_part${i + 1}_${file.name}`);
        }
      }
    } catch (err) {
      alert('Error splitting PDF.');
    }
    setSplitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <SplitSquareHorizontal className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
                    PDF Splitter
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Extract specific pages or split a PDF into multiple documents.</p>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
                {!file ?
        <div
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-border hover:border-brand-500/50 hover:bg-white/5'}`
          }
          onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {e.preventDefault();setDragOver(false);if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);}}
          onClick={() => {const input = document.createElement('input');input.type = 'file';input.accept = '.pdf';input.onchange = (e) => {const f = e.target.files?.[0];if (f) handleFile(f);};input.click();}}>
          
                        <Upload className="w-10 h-10 mx-auto mb-3 text-brand-500/60" />
                        <p className="text-foreground/80 font-semibold">Drop a PDF file here or click to browse</p>
                        <p className="text-foreground/40 text-sm mt-1">Single PDF file</p>
                    </div> :

        <>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
                            <div>
                                <p className="text-sm font-semibold truncate">{file.name}</p>
                                <p className="text-xs text-foreground/40">{file.pages} pages</p>
                            </div>
                            <button onClick={() => {setFile(null);setRangeInput('');}} className="text-sm text-red-400 hover:text-red-300">Change File</button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground/80">Page Range</label>
                            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              className="input-field font-mono"
              placeholder="e.g. 1-3, 5, 7-10" />
            
                            <p className="text-xs text-foreground/40">
                                Separate ranges with commas. Each comma-separated range creates a separate file. Use single numbers for individual pages.
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setRangeInput(`1-${Math.ceil(file.pages / 2)}, ${Math.ceil(file.pages / 2) + 1}-${file.pages}`)} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors">
                                Split in half
                            </button>
                            <button onClick={() => setRangeInput(Array.from({ length: file.pages }, (_, i) => String(i + 1)).join(', '))} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors">
                                Every page separately
                            </button>
                            <button onClick={() => setRangeInput('1')} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors">
                                First page only
                            </button>
                            <button onClick={() => setRangeInput(String(file.pages))} className="text-xs px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors">
                                Last page only
                            </button>
                        </div>

                        <button
            onClick={splitPdf}
            disabled={splitting || !rangeInput.trim()}
            className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
            
                            {splitting ?
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Splitting...</> :

            <><Download className="w-5 h-5" /> Split & Download</>
            }
                        </button>
                    </>
        }
            </div>
        </motion.div>);

}