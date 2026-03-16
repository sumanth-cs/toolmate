import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpCircle,
  Upload,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
import { saveAs } from "file-saver";
import Upscaler from "upscaler";

export default function ImageUpscaler() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [upscaling, setUpscaling] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const imgRef = useRef(null);
  const upscalerRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl(null);
  }, []);

  const performUpscale = async () => {
    if (!file || !preview || !imgRef.current) return;
    setUpscaling(true);
    setResultUrl(null);
    try {
      if (!upscalerRef.current) {
        upscalerRef.current = new Upscaler();
      }
      // Execute AI Upscale
      const upscaledImgSrc = await upscalerRef.current.upscale(imgRef.current);
      setResultUrl(upscaledImgSrc);
    } catch (error) {
      console.error(error);
      alert(
        "Error upscaling image. Image might be too large for local in-browser Neural Network.",
      );
    } finally {
      setUpscaling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-4xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 flex items-center justify-center mb-4">
          <ArrowUpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI Image Upscaler
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Enhance and upscale images locally using browser neural networks.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
        <div className="flex flex-col gap-6">
          {!file ? (
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 min-h-[300px] cursor-pointer transition-all ${
                dragOver
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-border hover:border-cyan-500/50 hover:bg-white/5"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0])
                  handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                };
                input.click();
              }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-500/60" />
              <p className="text-foreground/80 font-semibold mb-2 text-center">
                Click or Drop Image
              </p>
              <p className="text-foreground/40 text-xs mt-1 text-center">
                Locally processed. Small images work best.
              </p>
            </div>
          ) : (
            <div className="flex flex-col border border-border rounded-xl overflow-hidden min-h-[300px] bg-black/20">
              <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-background">
                <span className="text-xs font-semibold truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResultUrl(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-400 font-semibold"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  ref={imgRef}
                  src={preview}
                  alt="Original"
                  className="max-h-[300px] object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}

          <button
            onClick={performUpscale}
            disabled={upscaling || !file || !!resultUrl}
            className="w-full mt-2 h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upscaling ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {upscaling ? "AI is enhancing..." : "Upscale Image (2x)"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {resultUrl && !upscaling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 border-cyan-500/20 text-center shadow-xl"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Enhancement Complete
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/5 mb-6 max-h-[400px] flex items-center justify-center">
              <img
                src={resultUrl}
                className="max-h-[350px] relative z-10 object-contain mx-auto rounded-lg shadow-2xl border border-border"
                alt="Upscaled"
              />
            </div>
            <button
              onClick={() => saveAs(resultUrl, `upscaled_${file?.name}`)}
              className="btn-primary w-full max-w-md mx-auto h-12 gap-2 text-base shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-bold"
            >
              <Download className="w-4 h-4" /> Download HD Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
