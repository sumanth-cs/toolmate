import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, Check, Sparkles, Send } from 'lucide-react';

export default function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateHashtags = () => {
    if (!topic) return;
    setIsGenerating(true);

    setTimeout(() => {
      const stopwords = new Set(['the', 'a', 'an', 'and', 'but', 'if', 'or', 'because', 'as', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'ought', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);
      const words = topic.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2 && !stopwords.has(w));

      // Create variations
      const generated = new Set();
      words.forEach((w) => {
        generated.add(`#${w}`);
        generated.add(`#${w}tips`);
        generated.add(`#${w}life`);
      });

      // Add some generic popular ones based on context length
      if (words.length > 0) {
        generated.add('#trending');
        generated.add('#viral');
        generated.add('#foryou');
        generated.add('#explore');
        generated.add('#contentcreator');
      }

      setHashtags(Array.from(generated).slice(0, 30));
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = () => {
    if (hashtags.length === 0) return;
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500">
                    <Hash className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Hashtag Generator</h1>
                    <p className="text-muted-foreground">Extract SEO-optimized hashtags from your content text.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 h-fit">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Paste your post caption or topic</label>
                            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., I just launched my new SaaS startup today..."
                className="w-full h-32 p-4 rounded-xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm" />
              
                        </div>

                        <button
              onClick={generateHashtags}
              disabled={!topic || isGenerating}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2">
              
                            {isGenerating ?
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Sparkles className="w-5 h-5" />
                                </motion.div> :

              <><Send className="w-5 h-5" /> Generate Hashtags</>
              }
                        </button>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Hash className="w-4 h-4 text-brand-500" />
                            Generated Tags ({hashtags.length})
                        </h3>
                        {hashtags.length > 0 &&
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-background/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm">
              
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy All'}
                            </button>
            }
                    </div>

                    <div className="flex-1 bg-background/30 rounded-xl p-4 relative">
                        {hashtags.length > 0 ?
            <div className="flex flex-wrap gap-2">
                                {hashtags.map((tag, i) =>
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-500">
                                        {tag}
                                    </span>
              )}
                            </div> :

            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                                <Hash className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-sm">Your AI hashtags will appear here</p>
                            </div>
            }
                    </div>
                </div>
            </div>
        </div>);

}