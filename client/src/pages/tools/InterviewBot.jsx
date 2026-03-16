import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, Copy, Check, Briefcase } from "lucide-react";
import { useGeminiAPI } from "../../hooks/useGeminiAPI";
import ReactMarkdown from "react-markdown";

export default function InterviewBot() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Mid-Level");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const generateInterview = async () => {
    if (!role.trim()) return;
    const prompt = `
        You are an expert Technical and Behavioral Interviewer.
        The candidate is applying for a "${role}" position at the "${experience}" level.
        
        Please generate:
        1. 3 highly specific Behavioral Questions based on this role and level.
        2. 3 highly specific Technical/Hard Skills Questions based on this role and level.
        3. For EACH question, provide a brief "Example Brilliant Answer" snippet or framework to help the candidate prepare.
        
        Format beautifully in Markdown.
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
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Mock Interview Bot
            </h1>
            <p className="text-muted-foreground">
              Generate tailored interview questions and brilliant answers for
              any role.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <div className="glass-card rounded-3xl p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-500" /> Target Role /
                Job Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Product Manager"
                className="w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-foreground cursor-pointer shadow-sm"
              >
                <option value="Internship">Internship</option>
                <option value="Entry-Level">Entry-Level / Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead / Staff">Lead / Staff</option>
                <option value="Manager / Director">Manager / Director</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <button
            onClick={generateInterview}
            disabled={!role.trim() || isLoading}
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
                <MessageSquare className="w-5 h-5" /> Generate Mock Interview
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="glass-card rounded-3xl p-6 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              Interview Prep Sheet
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                >
                  <ReactMarkdown>{result}</ReactMarkdown>
                </motion.div>
              ) : (
                <motion.div
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 p-6 text-center"
                >
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">
                    Your customized interview questions will appear here.
                  </p>
                  <p className="text-xs mt-2 opacity-60 max-w-sm">
                    We'll provide behavioral frameworks and brilliant response
                    examples to help you ace your interview.
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
