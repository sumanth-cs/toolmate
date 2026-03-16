import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Upload, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfToImages() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [converting, setConverting] = useState(false);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState('png');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (f) => {
    if (f.type !== 'application/pdf') {alert('Please upload a PDF file.');return;}
    const data = await f.arrayBuffer();
    setFile({ name: f.name, data });
    setPages([]);
    setCurrentPage(0);
  }, []);

  const convertToImages = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const pdf = await pdfjsLib.getDocument({ data: file.data }).promise;
      const pageImages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
        pageImages.push(dataUrl);
      }

      setPages(pageImages);
      setCurrentPage(0);
    } catch (err) {
      alert('Error converting PDF to images. The file may be encrypted.');
    }
    setConverting(false);
  };

  const downloadCurrent = () => {
    if (!pages[currentPage]) return;
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const link = document.createElement('a');
    link.href = pages[currentPage];
    link.download = `page_${currentPage + 1}.${ext}`;
    link.click();
  };

  const downloadAll = () => {
    pages.forEach((dataUrl, idx) => {
      const ext = format === 'jpeg' ? 'jpg' : 'png';
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `page_${idx + 1}.${ext}`;
      link.click();
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <FileImage className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
                    PDF to Images
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Convert each page of a PDF into high-quality images.</p>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-5xl mx-auto flex flex-col gap-6">
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
                    </div> :

        <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-background/50 border border-border">
                            <div>
                                <p className="text-sm font-semibold truncate">{file.name}</p>
                            </div>
                            <button onClick={() => {setFile(null);setPages([]);}} className="text-sm text-red-400 hover:text-red-300">Change File</button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-background/50 border border-border rounded-xl">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-foreground/80">Quality (Scale: {scale}x)</label>
                                <input
                type="range" min="1" max="4" step="0.5" value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-brand-500" />
              
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-foreground/80">Format</label>
                                <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field">
                                    <option value="png">PNG (lossless)</option>
                                    <option value="jpeg">JPEG (smaller)</option>
                                </select>
                            </div>
                        </div>

                        {pages.length === 0 ?
          <button
            onClick={convertToImages}
            disabled={converting}
            className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50">
            
                                {converting ?
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Converting...</> :

            <><FileImage className="w-5 h-5" /> Convert to Images</>
            }
                            </button> :

          <>
                                {/* Preview */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-full max-h-[500px] overflow-auto rounded-xl border border-border bg-white flex items-center justify-center p-2">
                                        <img src={pages[currentPage]} alt={`Page ${currentPage + 1}`} className="max-w-full h-auto" />
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex items-center gap-4">
                                        <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30">
                  
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm font-semibold">Page {currentPage + 1} of {pages.length}</span>
                                        <button
                  onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                  disabled={currentPage === pages.length - 1}
                  className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30">
                  
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Download Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button onClick={downloadCurrent} className="btn-secondary h-12 gap-2">
                                        <Download className="w-5 h-5" /> Download This Page
                                    </button>
                                    <button onClick={downloadAll} className="btn-primary h-12 gap-2">
                                        <Download className="w-5 h-5" /> Download All Pages
                                    </button>
                                </div>
                            </>
          }
                    </>
        }
            </div>
        </motion.div>);

}