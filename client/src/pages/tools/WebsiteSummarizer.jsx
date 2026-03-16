import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, Copy, Check, FileText } from "lucide-react";
import { useGeminiAPI } from "../../hooks/useGeminiAPI";
import ReactMarkdown from "react-markdown";

export default function WebsiteSummarizer() {
  const [websiteContent, setWebsiteContent] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const generateSummary = async () => {
    if (!websiteContent.trim()) return;
    const prompt = `
        You are an expert Executive Assistant.
        I will provide the raw scraped text or HTML of a webpage.
        
        Please provide a perfectly formatted "Executive Summary" including:
        1. A 1-sentence TL;DR highlighting the main point of the page.
        2. A "Key Takeaways" bulleted list.
        3. A "Target Audience" note indicating who this page is for.
        
        Do not output your own conversational filler, only the summary formatted beautifully in Markdown.
        
        ### Webpage Content:
        """${websiteContent}"""
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
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Website Summarizer
            </h1>
            <p className="text-muted-foreground">
              Paste the text of any large website or article to extract an
              instant executive summary.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            Website Raw Text
          </h3>

          <textarea
            value={websiteContent}
            onChange={(e) => setWebsiteContent(e.target.value)}
            placeholder="Due to CORS limits in browsers, please copy and paste the large text blocks from the website you want summarized..."
            className="flex-1 w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm mb-4"
          />

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <button
            onClick={generateSummary}
            disabled={!websiteContent.trim() || isLoading}
            className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate TL;DR
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Executive Summary
            </h3>
            {result && (
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium"
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

          <div className="flex-1 bg-background rounded-2xl p-5 sm:p-6 border border-input relative overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              ) : (
                <motion.div
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 p-6 text-center"
                >
                  <Globe className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">
                    The summary will appear here.
                  </p>
                  <p className="text-xs mt-2 opacity-60 max-w-xs">
                    We'll distill paragraphs of marketing or technical text into
                    a succinct, scannable format.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
