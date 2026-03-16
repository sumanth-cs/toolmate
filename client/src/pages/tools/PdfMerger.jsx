import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Files, Upload, Download, Trash2, GripVertical } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';







export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (fileList) => {
    const newFiles = [];
    for (const file of Array.from(fileList)) {
      if (file.type !== 'application/pdf') continue;
      const data = await file.arrayBuffer();
      try {
        const pdf = await PDFDocument.load(data);
        newFiles.push({ name: file.name, data, pages: pdf.getPageCount() });
      } catch {
        alert(`Could not read ${file.name}. It may be corrupted or encrypted.`);
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (from, to) => {
    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const pdf = await PDFDocument.load(file.data);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer], { type: 'application/pdf' });
      saveAs(blob, 'merged_document.pdf');
    } catch (err) {
      alert('Error merging PDFs. Some files may be encrypted or corrupted.');
    }
    setMerging(false);
  };

  const totalPages = files.reduce((sum, f) => sum + f.pages, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <Files className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
                    PDF Merger
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Combine multiple PDF files into a single document. Drag to reorder.</p>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
                {/* Drop Zone */}
                <div
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-border hover:border-brand-500/50 hover:bg-white/5'}`
          }
          onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);}}
          onClick={() => {const input = document.createElement('input');input.type = 'file';input.accept = '.pdf';input.multiple = true;input.onchange = (e) => handleFiles(e.target.files);input.click();}}>
          
                    <Upload className="w-10 h-10 mx-auto mb-3 text-brand-500/60" />
                    <p className="text-foreground/80 font-semibold">Drop PDF files here or click to browse</p>
                    <p className="text-foreground/40 text-sm mt-1">Supports multiple files at once</p>
                </div>

                {/* File List */}
                {files.length > 0 &&
        <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-foreground/80">{files.length} file{files.length > 1 ? 's' : ''} · {totalPages} total pages</h3>
                            <button onClick={() => setFiles([])} className="text-xs text-red-400 hover:text-red-300 transition-colors">Clear All</button>
                        </div>
                        {files.map((file, idx) =>
          <motion.div
            key={`${file.name}-${idx}`}
            layout
            className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border group">
            
                                <GripVertical className="w-4 h-4 text-foreground/30 cursor-grab flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-foreground/40">{file.pages} page{file.pages > 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {idx > 0 &&
              <button onClick={() => moveFile(idx, idx - 1)} className="p-1 rounded hover:bg-white/10 text-foreground/40 hover:text-foreground text-xs">↑</button>
              }
                                    {idx < files.length - 1 &&
              <button onClick={() => moveFile(idx, idx + 1)} className="p-1 rounded hover:bg-white/10 text-foreground/40 hover:text-foreground text-xs">↓</button>
              }
                                    <button onClick={() => removeFile(idx)} className="p-1 rounded hover:bg-red-500/10 text-foreground/40 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
          )}
                    </div>
        }

                {/* Merge Button */}
                <button
          onClick={mergePdfs}
          disabled={files.length < 2 || merging}
          className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
          
                    {merging ?
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Merging...</> :

          <><Download className="w-5 h-5" /> Merge & Download</>
          }
                </button>
            </div>
        </motion.div>);

}