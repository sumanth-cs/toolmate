import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Minimize2, Upload, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (f) => {
    if (f.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    const data = await f.arrayBuffer();
    setFile({ name: f.name, data, size: f.size });
    setResult(null);
  }, []);

  const compressPdf = async () => {
    if (!file) return;
    setCompressing(true);
    try {
      // Load and re-serialize the PDF which can reduce redundancy
      const pdfDoc = await PDFDocument.load(file.data, {
        ignoreEncryption: true,
      });
      // Remove metadata to reduce size
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true, // More compact format
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const blob = new Blob([compressedBytes.buffer], {
        type: "application/pdf",
      });
      setResult({ size: compressedBytes.length, blob });
    } catch (err) {
      alert("Error compressing PDF. The file may be encrypted or corrupted.");
    }
    setCompressing(false);
  };

  const downloadCompressed = () => {
    if (!result || !file) return;
    saveAs(result.blob, `compressed_${file.name}`);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const savings =
    file && result
      ? Math.max(0, ((file.size - result.size) / file.size) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <Minimize2 className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
          PDF Compressor
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Reduce PDF file size by optimizing internal structure and removing
          metadata.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
        {!file ? (
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
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".pdf";
              input.onchange = (e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-brand-500/60" />
            <p className="text-foreground/80 font-semibold">
              Drop a PDF file here or click to browse
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
              <div>
                <p className="text-sm font-semibold truncate">{file.name}</p>
                <p className="text-xs text-foreground/40">
                  Original: {formatSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Change File
              </button>
            </div>

            {!result ? (
              <button
                onClick={compressPdf}
                disabled={compressing}
                className="btn-primary w-full h-12 gap-2 text-base disabled:opacity-50"
              >
                {compressing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Compressing...
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-5 h-5" /> Compress PDF
                  </>
                )}
              </button>
            ) : (
              <>
                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-background/50 border border-border text-center">
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">
                      Original
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {formatSize(file.size)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-brand-500/30 text-center">
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">
                      Compressed
                    </p>
                    <p className="text-xl font-bold text-brand-400">
                      {formatSize(result.size)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-emerald-500/30 text-center">
                    <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1">
                      Saved
                    </p>
                    <p className="text-xl font-bold text-emerald-400">
                      {savings.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {savings < 1 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                    ⚠️ This PDF is already well-optimized. Client-side
                    compression has limited effect on image-heavy PDFs.
                  </div>
                )}

                <button
                  onClick={downloadCompressed}
                  className="btn-primary w-full h-12 gap-2 text-base"
                >
                  <Download className="w-5 h-5" /> Download Compressed PDF
                </button>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
