import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Upload, Download, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);

  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith('image/')) {alert('Please upload an image file.');return;}
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const compressImage = async () => {
    if (!file) return;
    setCompressing(true);
    setResult(null);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true
      };
      const compressedBlob = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedBlob);
      setResult({ blob: compressedBlob, url, size: compressedBlob.size });
    } catch (error) {
      console.error(error);
      alert('Error compressing image.');
    } finally {
      setCompressing(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20">
                        <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    Image Compressor
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Reduce file size of your images without losing quality.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Target File Size (MB)</label>
                                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={maxSizeMB}
                  onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                  className="input-field" />
                
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Max Width / Height (px)</label>
                                <input
                  type="number"
                  min="100"
                  step="100"
                  value={maxWidthOrHeight}
                  onChange={(e) => setMaxWidthOrHeight(Number(e.target.value))}
                  className="input-field" />
                
                            </div>

                            <button
                onClick={compressImage}
                disabled={compressing || !file}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                
                                {compressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minimize2 className="w-4 h-4" />}
                                {compressing ? 'Compressing...' : 'Compress Image'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    {!file ?
          <div
            className={`glass-card rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[400px] ${
            dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50 hover:bg-white/5'}`
            }
            onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {e.preventDefault();setDragOver(false);if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);}}
            onClick={() => {const input = document.createElement('input');input.type = 'file';input.accept = 'image/*';input.onchange = (e) => {const f = e.target.files?.[0];if (f) handleFile(f);};input.click();}}>
            
                            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500/60" />
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
                                    {compressing ?
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-xl shadow-blue-500/10 animate-pulse">
                                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                            </div>
                                            <p className="text-sm font-semibold text-blue-400">Optimizing pixels...</p>
                                        </motion.div> :
                result ?
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-xs font-semibold text-foreground/50 uppercase">Original</span>
                                                    <p className="text-sm font-bold">{formatSize(file.size)}</p>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-xs font-semibold text-foreground/50 uppercase">Compressed</span>
                                                    <p className="text-sm font-bold text-emerald-400">{formatSize(result.size)}</p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-center text-sm font-bold">
                                                Saved {((1 - result.size / file.size) * 100).toFixed(1)}% ({formatSize(file.size - result.size)})
                                            </div>
                                            <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-full">
                                                <img src={result.url} alt="Compressed" className="max-h-[300px] object-contain bg-black/10" />
                                            </div>
                                            <button
                    onClick={() => saveAs(result.blob, `compressed_${file.name}`)}
                    className="btn-primary w-full h-12 gap-2 text-base">
                    
                                                <Download className="w-4 h-4" /> Download Compressed Image
                                            </button>
                                        </motion.div> :

                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-xl overflow-hidden shadow-2xl w-full flex justify-center">
                                            <img src={preview} alt="Preview" className="max-h-[350px] object-contain" />
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