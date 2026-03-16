import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Upload, Download, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState("portrait");
  const [fitting, setFitting] = useState("fit");
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(async (fileList) => {
    const newImages = [];
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) continue;
      const url = URL.createObjectURL(file);
      const dims = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = url;
      });
      newImages.push({
        name: file.name,
        url,
        width: dims.width,
        height: dims.height,
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = (idx) => {
    URL.revokeObjectURL(images[idx].url);
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);
    try {
      const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = images[i];
        let drawWidth, drawHeight, x, y;
        const imgAspect = img.width / img.height;
        const pageAspect = pageWidth / pageHeight;

        if (fitting === "stretch") {
          drawWidth = pageWidth;
          drawHeight = pageHeight;
          x = 0;
          y = 0;
        } else if (fitting === "fill") {
          if (imgAspect > pageAspect) {
            drawHeight = pageHeight;
            drawWidth = drawHeight * imgAspect;
          } else {
            drawWidth = pageWidth;
            drawHeight = drawWidth / imgAspect;
          }
          x = (pageWidth - drawWidth) / 2;
          y = (pageHeight - drawHeight) / 2;
        } else {
          // fit
          if (imgAspect > pageAspect) {
            drawWidth = pageWidth;
            drawHeight = drawWidth / imgAspect;
          } else {
            drawHeight = pageHeight;
            drawWidth = drawHeight * imgAspect;
          }
          x = (pageWidth - drawWidth) / 2;
          y = (pageHeight - drawHeight) / 2;
        }

        pdf.addImage(img.url, "JPEG", x, y, drawWidth, drawHeight);
      }

      pdf.save("images_to_pdf.pdf");
    } catch (err) {
      alert("Error generating PDF from images.");
    }
    setGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <ImagePlus className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
          Image to PDF
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Convert images into a beautiful PDF document. Each image becomes a
          page.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-brand-500 bg-brand-500/10"
              : "border-border hover:border-brand-500/50 hover:bg-white/5"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => handleFiles(e.target.files);
            input.click();
          }}
        >
          <Upload className="w-10 h-10 mx-auto mb-3 text-brand-500/60" />
          <p className="text-foreground/80 font-semibold">
            Drop images here or click to browse
          </p>
          <p className="text-foreground/40 text-sm mt-1">
            JPG, PNG, WEBP supported
          </p>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground/80">
                {images.length} image{images.length > 1 ? "s" : ""}
              </h3>
              <button
                onClick={() => {
                  images.forEach((img) => URL.revokeObjectURL(img.url));
                  setImages([]);
                }}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-border aspect-[3/4]"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-[10px] text-white truncate">
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Options */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-background/50 border border-border rounded-xl">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="input-field"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground/80">
                Image Fitting
              </label>
              <select
                value={fitting}
                onChange={(e) => setFitting(e.target.value)}
                className="input-field"
              >
                <option value="fit">Fit (maintain aspect ratio)</option>
                <option value="fill">Fill (crop to fill)</option>
                <option value="stretch">Stretch (fill page)</option>
              </select>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generatePdf}
          disabled={images.length === 0 || generating}
          className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" /> Generate PDF
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
