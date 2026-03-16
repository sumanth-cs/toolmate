import { useState } from "react";
import { motion } from "framer-motion";
import { Binary, Copy, RefreshCw, Check } from "lucide-react";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const textToProcess = input;

  const handleProcess = () => {
    try {
      setError("");
      if (!textToProcess) {
        setOutput("");
        return;
      }
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(textToProcess))));
      } else {
        setOutput(decodeURIComponent(escape(atob(textToProcess))));
      }
    } catch (err) {
      setError("Invalid input for Base64 decoding");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 h-full flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Binary className="w-8 h-8 text-brand-500" />
          Base64 Encoder / Decoder
        </h1>
        <p className="text-foreground/60 mt-2">
          Easily encode strings to Base64 format or decode them back to plain
          text.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col gap-6 w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center bg-background/50 p-2 rounded-xl border border-border">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("encode");
                setInput(output);
                setOutput("");
                setError("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "encode" ? "bg-brand-500 text-white shadow-lg" : "text-foreground hover:bg-white/5"}`}
            >
              Encode
            </button>
            <button
              onClick={() => {
                setMode("decode");
                setInput(output);
                setOutput("");
                setError("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "decode" ? "bg-brand-500 text-white shadow-lg" : "text-foreground hover:bg-white/5"}`}
            >
              Decode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <div className="flex flex-col gap-2 relative h-full">
            <label className="text-sm font-semibold text-foreground/80">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              className="input-field flex-1 resize-none h-64 font-mono text-sm"
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 to decode..."
              }
            />
          </div>

          <div className="flex flex-col gap-2 relative h-full">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground/80">
                Output ({mode === "encode" ? "Base64" : "Text"})
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="text-sm flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div
              className={`p-4 rounded-lg flex-1 overflow-auto font-mono text-sm ring-1 ring-inset ${error ? "bg-red-500/10 ring-red-500/50 text-red-400" : "bg-background ring-border text-foreground"}`}
            >
              {error ? error : output || "Result will appear here..."}
            </div>
          </div>
        </div>

        <div className="flex lg:justify-center">
          <button
            onClick={handleProcess}
            className="btn-primary w-full md:w-auto h-12 px-8 flex gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Process {mode === "encode" ? "Text" : "Base64"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
