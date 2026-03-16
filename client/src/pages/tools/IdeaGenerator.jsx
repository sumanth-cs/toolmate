import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sparkles, Copy, Check, Target } from "lucide-react";
import { useGeminiAPI } from "../../hooks/useGeminiAPI";
import ReactMarkdown from "react-markdown";

export default function IdeaGenerator() {
  const [problem, setProblem] = useState("");
  const [industry, setIndustry] = useState("Agnostic / General");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const generateIdeas = async () => {
    if (!problem.trim()) return;
    const prompt = `
        You are a Y-Combinator level Startup Advisor and Brainstorming Engine.
        I will provide a Problem Statement, and an Industry (optional).
        
        Please generate exactly 3 highly distinct, innovative startup/project ideas to solve this problem.
        For EACH idea, provide:
        **1. The Pitch:** (A 1-sentence description of the solution)
        **2. How it Works:** (Brief summary of the mechanic/tech)
        **3. Pros:** (2 bullet points)
        **4. Cons / Risks:** (2 bullet points)
        **5. Potential Moat:** (Why would it be hard to copy?)
        
        Format beautifully in Markdown. Be concise and deeply creative.
        
        ### Problem:
        "${problem}"
        
        ### Industry Context:
        ${industry}
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
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Startup Idea Generator
            </h1>
            <p className="text-muted-foreground">
              Turn any problem statement into 3 validated startup concepts with
              pros, cons, and moats.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 h-[700px]">
        {/* Input Section */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col h-full">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-500" /> The Problem
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What is the painful problem you want to solve? e.g. 'It is too hard for college students to find affordable groceries nearby.'"
                className="w-full p-4 h-40 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Industry / Niche
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. EdTech, SaaS, Mobile App, Hardware..."
                className="w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>
          </div>

          <div className="mt-auto pt-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                {error}
              </div>
            )}

            <button
              onClick={generateIdeas}
              disabled={!problem.trim() || isLoading}
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
                  <Zap className="w-5 h-5" /> Generate Ideas
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Generated Concepts
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

          <div className="flex-1 bg-background border border-input rounded-2xl p-5 sm:p-8 relative overflow-y-auto custom-scrollbar">
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
                  <Zap className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">
                    Your innovative startup ideas will appear here.
                  </p>
                  <p className="text-xs mt-2 opacity-60 max-w-sm">
                    We'll provide the pitch, mechanics, risks, and moats for 3
                    unique concepts based on your problem.
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
