import { useState } from "react";
import { motion } from "framer-motion";
import { ListTree, Copy, Check, Sparkles, Send } from "lucide-react";

export default function ThreadCreator() {
  const [topic, setTopic] = useState("");
  const [thread, setThread] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateThread = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      const t = topic.toLowerCase();
      const generated = [
        `🧵 Let's talk about ${topic}.\n\nIt's one of the most misunderstood concepts today. Here's a breakdown of why it matters and how you can leverage it 👇`,
        `1/ First, the foundation. ${topic} isn't just a trend; it's a fundamental shift in how we operate. Without understanding the basics, you'll fall behind.`,
        `2/ The biggest mistake people make?\n\nIgnoring the long-term compounding effects of ${t}. It's not about quick wins. It's about sustainable systems.`,
        `3/ How to start today:\n- Audit your current process\n- Identify the biggest bottleneck\n- Apply one principle of ${t}\n- Measure the difference`,
        `4/ In conclusion, mastery of ${t} takes time but the ROI is infinite.\n\nWhat's your biggest challenge with ${topic}? Let me know below! 👇\n\n#${t.replace(/\s+/g, "")} #Growth`,
      ];
      setThread(generated);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
          <ListTree className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Thread Creator</h1>
          <p className="text-muted-foreground">
            Transform a single topic into an engaging Twitter/X thread.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What's your thread about?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., Productivity frameworks for remote teams..."
                className="w-full h-32 p-4 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            <button
              onClick={generateThread}
              disabled={!topic || isGenerating}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Generate Thread
                </>
              )}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 min-h-[400px]">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <ListTree className="w-4 h-4 text-brand-500" />
            Generated Thread ({thread.length} tweets)
          </h3>

          <div className="space-y-4">
            {thread.length > 0 ? (
              thread.map((t, index) => (
                <div
                  key={index}
                  className="bg-background/30 rounded-xl p-4 relative group hover:ring-1 hover:ring-brand-500/50 transition-all"
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(t, index)}
                      className="p-1.5 hover:bg-background/80 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pr-8">
                    {t}
                  </div>
                  {index < thread.length - 1 && (
                    <div className="absolute -bottom-4 left-6 w-0.5 h-4 bg-border/50" />
                  )}
                </div>
              ))
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl">
                <ListTree className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">
                  Your generated thread will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
