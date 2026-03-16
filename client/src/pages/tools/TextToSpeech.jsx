import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Play, Loader2, AlertCircle, Volume2 } from "lucide-react";
import axios from "axios";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const token = JSON.parse(
        localStorage.getItem("toolmate_user") || "{}",
      )?.token;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tools/proxy/text-to-speech`,
        {
          input: text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const url =
        res.data?.audio_base64 ||
        res.data?.audioUrl ||
        res.data?.audio ||
        res.data?.url ||
        res.data?.output;
      if (url) {
        setResultUrl(url);
      } else if (typeof res.data === "string" && res.data.startsWith("http")) {
        setResultUrl(res.data);
      } else {
        setError("Unexpected response format. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred.",
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
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          AI Text to Speech
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Convert any text into natural-sounding speech.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-pink-500" />
          Text to Synthesize
        </label>
        <textarea
          className="input-field min-h-[200px] resize-none text-base mb-4 bg-background/50"
          placeholder="Type or paste the text you want to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="w-full h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-base shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          {loading ? "Synthesizing..." : "Generate Voice"}
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
        {resultUrl && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 bg-pink-500/5 border-pink-500/20"
          >
            <h3 className="text-sm font-semibold text-foreground/80 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Audio Ready
            </h3>
            <div className="w-full bg-background rounded-full p-2 border border-border shadow-inner">
              <audio
                src={resultUrl}
                controls
                className="w-full h-12"
                autoPlay
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
