import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Copy, Check, Sparkles, Send } from "lucide-react";

export default function CaptionWriter() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCaption = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      let generated = "";
      const t = topic.toLowerCase();
      if (platform === "instagram") {
        generated = `Stepping into the new week like ✨\n\nJust exploring ${t} and honestly, feeling so inspired by the process! Sometimes you have to zoom out to see the bigger picture. 📸🤍\n\nWhat are you focusing on this week? Let me know 👇\n\n#${t.replace(/\s+/g, "")} #Inspiration #DailyGrind #InstaGood`;
      } else if (platform === "tiktok") {
        generated = `POV: You finally figured out ${t} 🤯🔥\n\nDrop a comment if you want a full tutorial video! 👇\n\n#${t.replace(/\s+/g, "")} #ForYou #Viral #Trending`;
      } else if (platform === "linkedin") {
        generated = `I'm thrilled to announce a new milestone in my journey with ${topic}!\n\nOver the past few months, my team and I have been diving deep into ${t}. The insights we've uncovered have completely reshaped our strategy. \n\nKey takeaways:\n✅ Consistency pays off\n✅ Data drives decisions\n✅ Surround yourself with smart people\n\nI'm so grateful for everyone who has supported me along the way.\n\n#${t.replace(/\s+/g, "")} #ProfessionalGrowth #Milestone #Networking`;
      }
      setCaption(generated);
      setIsGenerating(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    if (!caption) return;
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
          <PenTool className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Caption Writer</h1>
          <p className="text-muted-foreground">
            Generate engaging captions for Instagram, TikTok, or LinkedIn.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What is your post about?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., A photo of my morning coffee setup..."
                className="w-full h-32 p-4 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["instagram", "tiktok", "linkedin"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                      platform === p
                        ? "bg-brand-500/10 border-brand-500 text-brand-500"
                        : "bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateCaption}
              disabled={!topic || isGenerating}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
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
                  <Send className="w-5 h-5" /> Generate Caption
                </>
              )}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <PenTool className="w-4 h-4 text-brand-500" />
              Generated Result
            </h3>
            {caption && (
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-background/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <div className="flex-1 bg-background/30 rounded-xl p-6 relative overflow-hidden group">
            {caption ? (
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {caption}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                <PenTool className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">
                  Your generated caption will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
