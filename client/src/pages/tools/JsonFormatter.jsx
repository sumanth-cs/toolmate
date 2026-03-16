import { useState } from "react";
import {
  Code,
  Copy,
  Check,
  AlertCircle,
  FileJson,
  Sparkles,
} from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      setError("");
      if (!input.trim()) {
        setOutput("");
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 4));
    } catch (err) {
      setError(err.message || "Invalid JSON");
    }
  };

  const handleMinify = () => {
    try {
      setError("");
      if (!input.trim()) {
        setOutput("");
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err) {
      setError(err.message || "Invalid JSON");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col pt-2 pb-12 max-w-6xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            JSON Formatter
          </h1>
          <p className="text-foreground/60 ml-1">
            Format, validate, and minify your JSON data instantly.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1">
        {/* Input Area */}
        <div className="flex flex-col relative">
          <div className="h-12 bg-accent/50 border border-border border-b-0 rounded-t-xl flex items-center justify-between px-4">
            <span className="text-sm font-semibold flex items-center gap-2">
              <FileJson className="w-4 h-4 text-amber-500" /> Input JSON
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setInput("")}
                className="hover:text-amber-500 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full bg-background border border-border rounded-b-xl p-4 font-mono text-sm focus:ring-2 focus:ring-amber-500/50 focus:outline-none transition-all resize-none shadow-sm"
            placeholder='{"hello": "world"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>

          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="truncate">{error}</p>
            </div>
          )}
        </div>

        {/* Controls & Output */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button
              onClick={handleFormat}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Format
            </button>
            <button
              onClick={handleMinify}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-accent text-foreground font-semibold shadow-sm border border-border hover:bg-accent/80 transition-all active:scale-95"
            >
              Minify
            </button>
          </div>

          <div className="flex-1 flex flex-col relative group">
            <div className="h-12 bg-accent/50 border border-border border-b-0 rounded-t-xl flex items-center justify-between px-4">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-500" /> Output
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-background border border-border rounded-md hover:border-amber-500/50 hover:text-amber-500 transition-all"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="flex-1 bg-[#1e1e1e] border border-border rounded-b-xl relative overflow-hidden group">
              <textarea
                readOnly
                value={output}
                className="w-full h-full bg-transparent text-[#d4d4d4] font-mono text-sm p-4 resize-none focus:outline-none"
                placeholder="Output will appear here..."
              />

              {!output && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 pointer-events-none">
                  <FileJson className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">
                    No valid JSON formatted yet.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
