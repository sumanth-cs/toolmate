import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  Link,
} from "lucide-react";
import axios from "axios";

export default function SpeechToText() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [inputType, setInputType] = useState("file");
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith("audio/") && !f.type.startsWith("video/")) {
      alert("Please upload an audio or video file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      setFile({ name: f.name, data: result });
      setResultText(null);
      setError(null);
    };
    reader.readAsDataURL(f);
  }, []);

  const handleTranscribe = async () => {
    if (inputType === "file" && !file) return;
    if (inputType === "url" && !url.trim()) return;
    setLoading(true);
    setError(null);
    setResultText(null);

    try {
      const audioData = file.data.includes(",")
        ? file.data.split(",")[1]
        : file.data;
      const payload =
        inputType === "file"
          ? { audio: audioData, fileName: file.name }
          : { url };

      const token = JSON.parse(
        localStorage.getItem("toolmate_user") || "{}",
      )?.token;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tools/proxy/transcribe-audio1`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const text =
        res.data?.transcript ||
        res.data?.text ||
        res.data?.output ||
        res.data?.result ||
        res.data?.data?.transcript ||
        res.data?.data?.text;
      if (typeof text === "string") {
        setResultText(text);
      } else if (typeof text === "object") {
        setResultText(JSON.stringify(text, null, 2));
      } else {
        setError("Unexpected response format. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during transcription.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
            <Type className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          AI Speech to Text
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Transcribe audio files or voice recordings into written text.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex bg-accent border border-border rounded-xl p-1 w-max mb-6">
          <button
            onClick={() => setInputType("file")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              inputType === "file"
                ? "bg-background shadow text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputType("url")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              inputType === "url"
                ? "bg-background shadow text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Paste URL
          </button>
        </div>

        {inputType === "file" ? (
          !file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-border hover:border-violet-500/50 hover:bg-white/5"
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
                input.accept = "audio/*,video/*";
                input.onchange = (e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                };
                input.click();
              }}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-violet-500/60" />
              <p className="text-foreground/80 font-semibold mb-1">
                Drop audio/video file here
              </p>
              <p className="text-foreground/40 text-xs">
                MP3, WAV, MP4, M4A up to 50MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 text-violet-500 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[400px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-foreground/50">
                    Ready to transcribe
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-sm font-semibold text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          )
        ) : (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Link className="w-4 h-4 text-violet-500" />
              Audio File URL
            </label>
            <input
              type="url"
              className="input-field h-14 text-base"
              placeholder="https://example.com/audio.mp3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={handleTranscribe}
          disabled={loading || (inputType === "file" ? !file : !url.trim())}
          className="w-full mt-6 h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold text-base shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Type className="w-5 h-5" />
          )}
          {loading ? "Transcribing Audio..." : "Start Transcription"}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3 text-sm mb-6"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}

      <AnimatePresence>
        {resultText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border-violet-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Transcription Result
              </h3>
              <button
                onClick={() => navigator.clipboard.writeText(resultText)}
                className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 transition-colors font-semibold"
              >
                Copy Text
              </button>
            </div>
            <div className="w-full bg-background/50 rounded-xl p-4 border border-border shadow-inner max-h-[500px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {resultText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
