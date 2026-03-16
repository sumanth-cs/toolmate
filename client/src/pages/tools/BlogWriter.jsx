import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Sparkles, Copy, Check, Hash } from 'lucide-react';
import { useGeminiAPI } from '../../hooks/useGeminiAPI';
import ReactMarkdown from 'react-markdown';

export default function BlogWriter() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const generateBlog = async () => {
    if (!topic.trim()) return;

    const prompt = `
        You are an Expert SEO Copywriter and Content Marketer.
        Please write a full-length, highly engaging blog post about: "${topic}".
        
        Additional Instructions:
        - Tone: ${tone}
        - Keywords to include (if any): ${keywords}
        
        Format beautifully in Markdown. Include:
        1. A catchy H1 Title
        2. Suggested Meta Description
        3. An engaging introduction hook
        4. Structured H2 and H3 subheadings
        5. A solid conclusion with a call-to-action (CTA).
        `;

    try {
      const response = await generateContent(prompt);
      setResult(response);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
                        <PenTool className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">SEO Blog Writer</h1>
                        <p className="text-muted-foreground">Generate comprehensive, fully-formatted markdown blog posts from a single topic.</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                <PenTool className="w-4 h-4 text-brand-500" /> Topic / Idea
                            </label>
                            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What should the blog post be about? Be as specific as you like..."
                className="w-full p-4 h-32 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm" />
              
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-brand-500" /> Target Keywords (Optional)
                            </label>
                            <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. AI tools, productivity, SaaS"
                className="w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground shadow-sm" />
              
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Voice & Tone</label>
                            <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-foreground cursor-pointer shadow-sm">
                
                                <option value="Professional & Authoritative">Professional & Authoritative</option>
                                <option value="Conversational & Friendly">Conversational & Friendly</option>
                                <option value="Humorous & Witty">Humorous & Witty</option>
                                <option value="Inspirational">Inspirational</option>
                                <option value="Academic">Academic</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        {error &&
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                                {error}
                            </div>
            }

                        <button
              onClick={generateBlog}
              disabled={!topic.trim() || isLoading}
              className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:shadow-none transition-all">
              
                            {isLoading ?
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Sparkles className="w-5 h-5" />
                                </motion.div> :

              <><Sparkles className="w-5 h-5" /> Write Blog Post</>
              }
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-brand-500" />
                            Generated Article
                        </h3>
                        {result &&
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium">
              
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
            }
                    </div>

                    <div className="flex-1 bg-background border border-input rounded-2xl p-5 sm:p-8 relative overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {result ?
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                
                                    <ReactMarkdown>{result}</ReactMarkdown>
                                </motion.div> :

              <motion.div
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 p-6 text-center">
                
                                    <PenTool className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Your polished blog post will appear here.</p>
                                    <p className="text-xs mt-2 opacity-60 max-w-sm">We'll handle the formatting, meta descriptions, headings, and SEO optimization.</p>
                                </motion.div>
              }
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>);

}