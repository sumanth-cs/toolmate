import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Upload, Download, Loader2 } from "lucide-react";
import { saveAs } from "file-saver";

export default function FormatConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);

  const formatMap = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/webp": "WEBP",
  };

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const convertFormat = async () => {
    if (!file || !preview) return;
    setConverting(true);
    setResult(null);
    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Background color for transparent images converted to JPG
        if (targetFormat === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResult({
                blob,
                url: URL.createObjectURL(blob),
                format: formatMap[targetFormat].toLowerCase(),
              });
            }
            setConverting(false);
          },
          targetFormat,
          targetFormat === "image/png" ? undefined : quality,
        );
      }
    } catch (error) {
      console.error(error);
      alert("Error converting image.");
      setConverting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-4xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-lg shadow-fuchsia-500/20 flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Format Converter
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Instantly convert images to JPG, PNG, or WEBP.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-foreground/80 mb-2">
                Target Format
              </label>
              <select
                className="w-full bg-background border border-border rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-fuchsia-500/50 focus:outline-none appearance-none cursor-pointer"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>

            {targetFormat !== "image/png" && (
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-foreground/80 mb-2">
                  Quality ({Math.round(quality * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-12 accent-fuchsia-500"
                />
              </div>
            )}
          </div>

          {!file ? (
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 min-h-[300px] cursor-pointer transition-all ${
                dragOver
                  ? "border-fuchsia-500 bg-fuchsia-500/10"
                  : "border-border hover:border-fuchsia-500/50 hover:bg-white/5"
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
              <Upload className="w-12 h-12 mx-auto mb-4 text-fuchsia-500/60" />
              <p className="text-foreground/80 font-semibold mb-2 text-center">
                Click or Drop Image
              </p>
              <p className="text-foreground/40 text-xs mt-1 text-center">
                Converts locally in your browser
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
                    setResult(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-400 font-semibold"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src={preview}
                  alt="Original"
                  className="max-h-[300px] object-contain"
                />
              </div>
            </div>
          )}

          <button
            onClick={convertFormat}
            disabled={converting || !file}
            className="w-full mt-2 h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            {converting
              ? "Converting..."
              : `Convert to ${formatMap[targetFormat]}`}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && !converting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 border-fuchsia-500/20 text-center shadow-xl"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Conversion Successful
              </span>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black/5 mb-6 max-h-[400px] flex items-center justify-center">
              {/* Checkered background for transparent PNG outputs */}
              <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), repeating-linear-gradient(45deg, #e5e7eb 25%, #ffffff 25%, #ffffff 75%, #e5e7eb 75%, #e5e7eb)",
                  backgroundPosition: "0 0, 10px 10px",
                  backgroundSize: "20px 20px",
                }}
              ></div>
              <img
                src={result.url}
                className="max-h-[300px] relative z-10 object-contain mx-auto"
                alt="Converted"
              />
            </div>
            <button
              onClick={() => {
                const newName = file?.name.split(".")[0] + "." + result.format;
                saveAs(result.blob, newName);
              }}
              className="btn-primary w-full max-w-md mx-auto h-12 gap-2 text-base shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
            >
              <Download className="w-4 h-4" /> Download{" "}
              {result.format.toUpperCase()}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
