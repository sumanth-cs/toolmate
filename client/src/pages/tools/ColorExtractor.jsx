import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Palette, Upload, Copy, Check, Trash2 } from 'lucide-react';
// @ts-ignore
import { getPaletteSync } from 'colorthief';

export default function ColorExtractor() {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const imgRef = useRef(null);


  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result);
      setPalette([]);
    };
    reader.readAsDataURL(file);
  };

  const extractColors = () => {
    if (!imgRef.current) return;
    try {
      const colors = getPaletteSync(imgRef.current, { colorCount: 8 });
      if (colors) {
        const hexColors = colors.map((c) => c.hex());
        setPalette(hexColors);
      }
    } catch (err) {
      console.error('Extraction failed:', err);
    }
  };

  const copyColor = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-4xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center mb-4">
                    <Palette className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Color Palette Extractor</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Upload an image and extract its dominant color palette instantly.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-xl">
                        {!image ?
            <div className="relative aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center group hover:border-amber-500/50 transition-all cursor-pointer overflow-hidden">
                                <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              
                                <div className="text-center space-y-2">
                                    <Upload className="w-10 h-10 text-foreground/20 mx-auto group-hover:text-amber-500 transition-colors" />
                                    <p className="text-sm font-bold text-foreground/40 group-hover:text-amber-500 uppercase tracking-widest">Upload Image</p>
                                </div>
                            </div> :

            <div className="space-y-4">
                                <div className="relative rounded-xl overflow-hidden border border-border bg-black/20">
                                    <img
                  ref={imgRef}
                  src={image}
                  alt="Uploaded"
                  className="w-full h-auto max-h-[400px] object-contain mx-auto"
                  onLoad={extractColors}
                  crossOrigin="anonymous" />
                
                                    <button
                  onClick={() => {setImage(null);setPalette([]);}}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-500 text-white shadow-lg hover:scale-110 transition-transform">
                  
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                onClick={extractColors}
                className="btn-primary w-full bg-amber-500 border-none h-12 rounded-xl uppercase font-black tracking-widest">
                
                                    Re-extract Colors
                                </button>
                            </div>
            }
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-xl h-full flex flex-col">
                        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-6">Extracted Palette</h3>
                        
                        {palette.length > 0 ?
            <div className="grid grid-cols-2 gap-4 flex-1">
                                {palette.map((color, index) =>
              <motion.div
                key={color}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative h-24 rounded-xl border border-border overflow-hidden cursor-pointer"
                onClick={() => copyColor(color, index)}>
                
                                        <div
                  className="w-full h-full"
                  style={{ backgroundColor: color }} />
                
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                            {copiedIndex === index ?
                  <div className="flex flex-col items-center gap-1">
                                                    <Check className="w-5 h-5 text-emerald-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Copied</span>
                                                </div> :

                  <div className="flex flex-col items-center gap-1">
                                                    <Copy className="w-5 h-5" />
                                                    <span className="text-xs font-mono font-bold uppercase">{color}</span>
                                                </div>
                  }
                                        </div>
                                    </motion.div>
              )}
                            </div> :

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                                <Palette className="w-16 h-16" />
                                <p className="text-sm font-bold uppercase tracking-widest">Upload an image to extract colors</p>
                            </div>
            }
                    </div>
                </div>
            </div>
        </motion.div>);

}