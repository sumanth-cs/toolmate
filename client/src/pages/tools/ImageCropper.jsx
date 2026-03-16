import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Crop as CropIcon, Upload, Download, Loader2 } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { saveAs } from "file-saver";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropper() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [aspect, setAspect] = useState(undefined);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultBlob, setResultBlob] = useState(null);

  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setCrop(undefined);
    setCompletedCrop(null);
    setResultUrl(null);
  }, []);

  const performCrop = async () => {
    if (!completedCrop || !imgRef.current || !file) return;
    setCropping(true);
    try {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("No 2d context");

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      );

      const type = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResultBlob(blob);
            setResultUrl(URL.createObjectURL(blob));
          }
          setCropping(false);
        },
        type,
        1,
      );
    } catch (e) {
      console.error(e);
      alert("Failed to crop image");
      setCropping(false);
    }
  };

  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    if (newAspect && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-5xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
            <CropIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          Image Cropper
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Crop images freehand or using specific aspect ratios.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-border bg-background rounded-2xl p-6 relative flex flex-col gap-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAspectChange(undefined)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${aspect === undefined ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-accent/50 text-foreground/60 hover:text-foreground"}`}
              >
                Free
              </button>
              <button
                onClick={() => handleAspectChange(1)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${aspect === 1 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-accent/50 text-foreground/60 hover:text-foreground"}`}
              >
                1:1 (Square)
              </button>
              <button
                onClick={() => handleAspectChange(16 / 9)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${aspect === 16 / 9 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-accent/50 text-foreground/60 hover:text-foreground"}`}
              >
                16:9
              </button>
              <button
                onClick={() => handleAspectChange(4 / 3)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${aspect === 4 / 3 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-accent/50 text-foreground/60 hover:text-foreground"}`}
              >
                4:3
              </button>
            </div>
          </div>

          <button
            onClick={performCrop}
            disabled={
              cropping || !completedCrop?.width || !completedCrop?.height
            }
            className="w-full mt-auto h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cropping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CropIcon className="w-4 h-4" />
            )}
            {cropping ? "Cropping..." : "Crop Image"}
          </button>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {!file ? (
            <div
              className={`glass-card rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[400px] ${
                dragOver
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border hover:border-emerald-500/50 hover:bg-white/5"
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
              <Upload className="w-12 h-12 mx-auto mb-4 text-emerald-500/60" />
              <p className="text-foreground/80 font-semibold mb-2">
                Drop an image here or click to browse
              </p>
              <p className="text-foreground/40 text-sm">
                JPG, PNG, WEBP supported
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
              <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-accent/30">
                <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </span>
                <div className="flex gap-4">
                  {resultUrl && (
                    <button
                      onClick={() => setResultUrl(null)}
                      className="text-xs text-emerald-500 hover:text-emerald-400 font-semibold"
                    >
                      Back to Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setResultUrl(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-400 font-semibold"
                  >
                    Change File
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[length:100px_100px] opacity-[0.98] overflow-hidden">
                {resultUrl ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center w-full gap-6"
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-full bg-black/5 flex items-center justify-center">
                      <img
                        src={resultUrl}
                        alt="Cropped"
                        className="max-h-[350px] object-contain block"
                      />
                    </div>
                    <button
                      onClick={() => saveAs(resultBlob, `cropped_${file.name}`)}
                      className="btn-primary w-full max-w-sm h-12 gap-2 text-base shadow-emerald-500/20 shadow-lg"
                    >
                      <Download className="w-4 h-4" /> Download Cropped Image
                    </button>
                  </motion.div>
                ) : (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-h-[500px]"
                  >
                    <img
                      ref={imgRef}
                      src={preview}
                      alt="Crop me"
                      onLoad={onImageLoad}
                      style={{ maxHeight: "450px", objectFit: "contain" }}
                    />
                  </ReactCrop>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
