import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, Upload, Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });

  const [resizing, setResizing] = useState(false);
  const [result, setResult] = useState(null);


  const handleFile = useCallback((f) => {
    if (!f.type.startsWith('image/')) {alert('Please upload an image file.');return;}
    setFile(f);

    const url = URL.createObjectURL(f);
    setPreview(url);
    setResult(null);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  }, []);

  const handleWidthChange = (val) => {
    setWidth(val);
    if (maintainAspectRatio && originalDimensions.w) {
      setHeight(Math.round(val * (originalDimensions.h / originalDimensions.w)));
    }
  };

  const handleHeightChange = (val) => {
    setHeight(val);
    if (maintainAspectRatio && originalDimensions.h) {
      setWidth(Math.round(val * (originalDimensions.w / originalDimensions.h)));
    }
  };

  const resizeImage = async () => {
    if (!file || !preview) return;
    setResizing(true);
    setResult(null);

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => {img.onload = resolve;});

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Determine format
        const type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            setResult({
              blob,
              url: URL.createObjectURL(blob)
            });
          } else {
            throw new Error('Canvas toBlob failed');
          }
        }, type, 0.9);
      }
    } catch (error) {
      console.error(error);
      alert('Error resizing image.');
    } finally {
      setResizing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                        <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    Image Resizer
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Precisely resize images with custom dimensions.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 border border-border bg-background rounded-2xl p-6 relative overflow-hidden flex flex-col gap-6">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Width (px)</label>
                        <input
              type="number"
              min="1"
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="input-field w-full" />
            
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Height (px)</label>
                        <input
              type="number"
              min="1"
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="input-field w-full" />
            
                    </div>
                    
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
              type="checkbox"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="w-5 h-5 rounded border-border text-indigo-500 focus:ring-indigo-500/50 bg-background" />
            
                        <span className="text-sm font-semibold">Maintain Aspect Ratio</span>
                    </label>

                    <button
            onClick={resizeImage}
            disabled={resizing || !file}
            className="w-full mt-auto h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            
                        {resizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Maximize className="w-4 h-4" />}
                        {resizing ? 'Resizing...' : 'Resize Image'}
                    </button>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    {!file ?
          <div
            className={`glass-card rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[400px] ${
            dragOver ? 'border-indigo-500 bg-indigo-500/10' : 'border-border hover:border-indigo-500/50 hover:bg-white/5'}`
            }
            onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {e.preventDefault();setDragOver(false);if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);}}
            onClick={() => {const input = document.createElement('input');input.type = 'file';input.accept = 'image/*';input.onchange = (e) => {const f = e.target.files?.[0];if (f) handleFile(f);};input.click();}}>
            
                            <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-500/60" />
                            <p className="text-foreground/80 font-semibold mb-2">Drop an image here or click to browse</p>
                            <p className="text-foreground/40 text-sm">JPG, PNG, WEBP supported</p>
                        </div> :

          <div className="glass-card rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
                            <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-accent/30">
                                <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                                <button onClick={() => {setFile(null);setPreview(null);setResult(null);}} className="text-xs text-red-500 hover:text-red-400 font-semibold">Change File</button>
                            </div>
                            
                            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[length:100px_100px] opacity-[0.98]">
                                <AnimatePresence mode="wait">
                                    {resizing ?
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/10 animate-pulse">
                                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                            </div>
                                            <p className="text-sm font-semibold text-indigo-400">Scaling pixels...</p>
                                        </motion.div> :
                result ?
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
                                            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-center text-sm font-bold">
                                                Resized to {width} × {height} px
                                            </div>
                                            <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-full">
                                                {/* Intentionally display scaled down version if large */}
                                                <img src={result.url} alt="Resized" className="max-h-[300px] object-contain bg-black/10" />
                                            </div>
                                            <button
                    onClick={() => saveAs(result.blob, `resized_${file.name}`)}
                    className="btn-primary w-full h-12 gap-2 text-base">
                    
                                                <Download className="w-4 h-4" /> Download Resized Image
                                            </button>
                                        </motion.div> :

                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-xl overflow-hidden shadow-2xl w-full flex justify-center flex-col items-center gap-4">
                                            <p className="text-xs font-bold text-foreground/50 border border-border px-3 py-1 rounded-full">Original: {originalDimensions.w} × {originalDimensions.h} px</p>
                                            <img src={preview} alt="Preview" className="max-h-[300px] object-contain" />
                                        </motion.div>
                }
                                </AnimatePresence>
                            </div>
                        </div>
          }
                </div>
            </div>
        </motion.div>);

}