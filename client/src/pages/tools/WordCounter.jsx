import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Type, Activity, Trash2, Copy, Check } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    const sentences = trimmedText
      ? (trimmedText.match(/[.!?]+/g) || []).length
      : 0;
    const paragraphs = trimmedText
      ? trimmedText.split(/\n\s*\n/).filter((p) => p.length > 0).length
      : 0;
    const words = trimmedText
      ? trimmedText.split(/\s+/).filter((w) => w.length > 0).length
      : 0;
    const characters = text.length;
    const charsWithoutSpaces = text.replace(/\s+/g, "").length;
    // Average reading speed is ~250 words per minute
    const readingTimeMinutes = words > 0 ? Math.ceil(words / 250) : 0;
    const speakingTimeMinutes = words > 0 ? Math.ceil(words / 130) : 0;

    return {
      words,
      characters,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-5xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
          <Type className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Word & Character Counter
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Instantly count words, characters, sentences, and compute read time.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden">
          <div className="h-14 border-b border-border bg-accent/30 flex items-center justify-between px-4">
            <span className="text-sm font-bold text-foreground/80 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> Text Analysis
              Engine
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-foreground/50 hover:text-indigo-500 hover:bg-black/5 transition-colors"
                title="Copy Text"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setText("")}
                className="p-2 rounded-lg text-foreground/50 hover:text-red-500 hover:bg-black/5 transition-colors"
                title="Clear Text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to begin counting..."
            className="w-full flex-1 min-h-[400px] p-6 bg-transparent resize-none outline-none text-foreground font-medium leading-relaxed"
          />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-6 border-transparent bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-xl shadow-indigo-500/20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl font-black mb-1">{stats.words}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">
              Words
            </span>
          </div>
          <div className="glass-card rounded-2xl p-6 border-transparent bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl font-black mb-1">{stats.characters}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
              Characters
            </span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-border bg-black/5 flex flex-col gap-3">
            <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Chars (No Spaces)
              </span>
              <span className="font-black text-lg">
                {stats.charsWithoutSpaces}
              </span>
            </div>
            <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Sentences
              </span>
              <span className="font-black text-lg">{stats.sentences}</span>
            </div>
            <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
              <span className="text-xs font-bold text-foreground/60 uppercase">
                Paragraphs
              </span>
              <span className="font-black text-lg">{stats.paragraphs}</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-border bg-black/5 flex flex-col gap-3">
            <div className="flex justify-between items-center bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
              <span className="text-xs font-bold text-orange-600 uppercase">
                Read Time
              </span>
              <span className="font-black text-lg text-orange-500">
                ~{stats.readingTimeMinutes} min
              </span>
            </div>
            <div className="flex justify-between items-center bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 rounded-lg">
              <span className="text-xs font-bold text-fuchsia-600 uppercase">
                Speak Time
              </span>
              <span className="font-black text-lg text-fuchsia-500">
                ~{stats.speakingTimeMinutes} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
