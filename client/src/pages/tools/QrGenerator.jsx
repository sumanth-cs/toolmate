import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Palette } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QrGenerator() {
  const [value, setValue] = useState('https://toolmate-ai.com');
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "toolmate_qrcode.png";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-brand-500" />
                    QR Code Generator
                </h1>
                <p className="text-foreground/60 mt-2">Generate customized QR codes instantly from text or URLs.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col md:flex-row gap-8 max-w-5xl mx-auto w-full">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80">Content</label>
                        <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-field min-h-[160px] resize-none"
              placeholder="Enter text, URL, or data..." />
            
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-brand-500" />
                                Foreground
                            </label>
                            <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-12 w-full cursor-pointer bg-background rounded-lg border border-border p-1" />
              
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-foreground/50" />
                                Background
                            </label>
                            <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-12 w-full cursor-pointer bg-background rounded-lg border border-border p-1" />
              
                        </div>
                    </div>
                </div>

                <div className="md:w-[320px] flex flex-col items-center justify-center gap-6 border-t md:border-t-0 md:border-l border-border/50 pt-8 md:pt-0 md:pl-8">
                    <div
            ref={qrRef}
            className="p-4 bg-white rounded-xl shadow-lg border border-slate-200 transition-all flex items-center justify-center w-[250px] h-[250px]">
            
                        {value ?
            <QRCodeSVG
              value={value}
              size={220}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              marginSize={1} /> :


            <div className="text-center text-slate-400 font-medium">Type to generate</div>
            }
                    </div>

                    <button
            onClick={handleDownload}
            disabled={!value}
            className="btn-primary w-full gap-2 mt-4">
            
                        <Download className="w-5 h-5" />
                        Download PNG
                    </button>
                </div>
            </div>
        </motion.div>);

}