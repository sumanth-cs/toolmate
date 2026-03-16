import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { File, Upload, Download } from 'lucide-react';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState('upload');
  const previewRef = useRef(null);

  const handleFile = useCallback(async (f) => {
    const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'];

    if (!validTypes.includes(f.type) && !f.name.endsWith('.docx')) {
      alert('Please upload a .docx file.');
      return;
    }
    const data = await f.arrayBuffer();
    setFile({ name: f.name, data });
    setHtmlContent('');
    setStep('upload');
  }, []);

  const convertToHtml = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const result = await mammoth.convertToHtml({ arrayBuffer: file.data });
      setHtmlContent(result.value);
      setStep('preview');
    } catch (err) {
      alert('Error parsing Word document.');
    }
    setConverting(false);
  };

  const downloadAsPdf = async () => {
    if (!htmlContent) return;
    setConverting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - margin * 2;

      // Create a temporary element to parse HTML to text
      const temp = document.createElement('div');
      temp.innerHTML = htmlContent;

      // Extract structured content
      const blocks = [];

      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) {
            const parent = node.parentElement;
            const isHeading = parent ? /^H[1-6]$/.test(parent.tagName) : false;
            const isBold = parent ? parent.tagName === 'STRONG' || parent.tagName === 'B' || window.getComputedStyle?.(parent)?.fontWeight === 'bold' : false;
            const fontSize = isHeading ? 16 : 11;
            blocks.push({ text, isBold: isBold || isHeading, isHeading, fontSize });
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node;
          if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'LI'].includes(el.tagName)) {
            // Process children
            el.childNodes.forEach(processNode);
            blocks.push({ text: '\n', isBold: false, isHeading: false, fontSize: 11 });
          } else {
            el.childNodes.forEach(processNode);
          }
        }
      };

      temp.childNodes.forEach(processNode);

      let y = margin;

      blocks.forEach((block) => {
        if (block.text === '\n') {
          y += 4;
          return;
        }

        pdf.setFontSize(block.fontSize);
        pdf.setFont('helvetica', block.isBold ? 'bold' : 'normal');

        const lines = pdf.splitTextToSize(block.text, maxWidth);
        const lineHeight = block.fontSize * 0.5;

        lines.forEach((line) => {
          if (y + lineHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin, y);
          y += lineHeight;
        });
      });

      const baseName = file?.name.replace(/\.(docx?|doc)$/i, '') || 'converted';
      pdf.save(`${baseName}.pdf`);
      setStep('done');
    } catch (err) {
      alert('Error generating PDF.');
    }
    setConverting(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <File className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
                    Word to PDF
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Convert Word documents (.docx) into PDF format.</p>
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
          onClick={() => {const input = document.createElement('input');input.type = 'file';input.accept = '.docx,.doc';input.onchange = (e) => {const f = e.target.files?.[0];if (f) handleFile(f);};input.click();}}>
          
                        <Upload className="w-10 h-10 mx-auto mb-3 text-brand-500/60" />
                        <p className="text-foreground/80 font-semibold">Drop a Word document here or click to browse</p>
                        <p className="text-foreground/40 text-sm mt-1">.docx files supported</p>
                    </div> :

        <>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
                            <p className="text-sm font-semibold truncate">{file.name}</p>
                            <button onClick={() => {setFile(null);setHtmlContent('');setStep('upload');}} className="text-sm text-red-400 hover:text-red-300">Change File</button>
                        </div>

                        {step === 'upload' &&
          <button onClick={convertToHtml} disabled={converting} className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50">
                                {converting ?
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> :

            <><File className="w-5 h-5" /> Process Document</>
            }
                            </button>
          }

                        {step === 'preview' &&
          <>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-sm font-semibold text-foreground/80">Document Preview</h3>
                                    <div
                ref={previewRef}
                className="bg-white text-gray-900 rounded-xl p-6 sm:p-8 max-h-[500px] overflow-y-auto prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }} />
              
                                </div>
                                <button onClick={downloadAsPdf} disabled={converting} className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50">
                                    {converting ?
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating PDF...</> :

              <><Download className="w-5 h-5" /> Download PDF</>
              }
                                </button>
                            </>
          }

                        {step === 'done' &&
          <div className="text-center py-8">
                                <p className="text-lg font-bold text-emerald-400 mb-2">✅ Conversion Complete!</p>
                                <p className="text-foreground/60 text-sm">Your PDF has been downloaded.</p>
                                <button onClick={() => {setFile(null);setHtmlContent('');setStep('upload');}} className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-semibold">Convert another document</button>
                            </div>
          }
                    </>
        }
            </div>
        </motion.div>);

}