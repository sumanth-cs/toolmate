import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Twitter,
  Copy,
  Check,
  Sparkles,
  Send,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function TweetGenerator() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("engaging");
  const [tweet, setTweet] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTweet = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => {
      let generated = "";
      const t = topic.toLowerCase();
      if (tone === "professional") {
        generated = `Excited to share some thoughts on ${topic}. In today's rapidly evolving landscape, understanding ${t} is more critical than ever. Here are my key takeaways:\n\n1️⃣ It drives innovation.\n2️⃣ It fosters collaboration.\n3️⃣ It builds sustainable growth.\n\nWhat are your thoughts on this? Let's discuss! 👇\n#${t.replace(/\s+/g, "")} #ProfessionalGrowth #IndustryInsights`;
      } else if (tone === "funny") {
        generated = `Me: I'm going to be productive today and focus on ${topic}.\nAlso me 5 minutes later: *starts watching 3-hour documentary about how ${t} was invented in the 1800s*\n\nSend help 🙃\n#${t.replace(/\s+/g, "")} #Relatable #Procrastination`;
      } else if (tone === "educational") {
        generated = `🧵 Want to master ${topic}?\n\nHere's a quick thread to get you started:\n\n1/ The core concept relies on efficiency and consistency.\n2/ Always measure your outcomes against your baseline.\n3/ Consistency compounds over time.\n\nSave this for your next project! 💡\n#${t.replace(/\s+/g, "")} #Learning #Education`;
      } else {
        generated = `Just had an incredible breakthrough working with ${topic}! 🚀\n\nThe possibilities with ${t} are absolutely mind-blowing right now. If you're not paying attention to this space, you are missing out on the next big wave! 🌊✨\n\nWho else is experimenting with this? Drop your projects below! 👇🔥\n#${t.replace(/\s+/g, "")} #Innovation #TechTrends`;
      }
      setTweet(generated);
      setIsGenerating(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
          <Twitter className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Tweet Generator
          </h1>
          <p className="text-muted-foreground">
            Generate highly engaging tweets tailored to your audience.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What's your tweet about?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., The future of AI in web development..."
                className="w-full h-32 p-4 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["engaging", "professional", "funny", "educational"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium capitalize transition-all",
                        tone === t
                          ? "bg-brand-500/10 border-brand-500 text-brand-500"
                          : "bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
            </div>

            <button
              onClick={generateTweet}
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
                  <Send className="w-5 h-5" /> Generate Tweet
                </>
              )}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              Generated Result
            </h3>
            {tweet && (
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
            {tweet ? (
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                {tweet}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                <Twitter className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Your generated tweet will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
