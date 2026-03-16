import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Copy, Check, FileText } from 'lucide-react';
import { useGeminiAPI } from '../../hooks/useGeminiAPI';
import ReactMarkdown from 'react-markdown';

export default function AiStudymate() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const generateExplanation = async () => {
    if (!notes.trim()) return;

    const prompt = `
        You are an expert AI tutor named StudyMate. 
        Please analyze the following study notes or text and provide:
        1. A simplified "Like I'm 5" summary.
        2. The core concepts broke down into 3-5 bullet points.
        3. A quick mnemonic or analogy to help remember the core topic.
        
        Text to analyze:
        """${notes}"""
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
    <div className="max-w-5xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">AI StudyMate</h1>
                        <p className="text-muted-foreground">Paste your complex notes and get them simplified instantly.</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
                    <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-500" />
                        Original Notes / Text
                    </h3>
                    
                    <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your dense textbook paragraphs, lecture transcripts, or confusing notes here..."
            className="flex-1 w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm mb-4" />
          

                    {error &&
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                            {error}
                        </div>
          }

                    <button
            onClick={generateExplanation}
            disabled={!notes.trim() || isLoading}
            className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:shadow-none transition-all">
            
                        {isLoading ?
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Sparkles className="w-5 h-5" />
                            </motion.div> :

            <><Sparkles className="w-5 h-5" /> Simplify Concept</>
            }
                    </button>
                </div>

                {/* Output Section */}
                <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-brand-500" />
                            AI Explanation
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

                    <div className="flex-1 bg-background rounded-2xl p-5 sm:p-6 border border-input relative overflow-y-auto custom-scrollbar">
                        {result ?
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div> :

            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 p-6 text-center">
                                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">Your simplified notes will appear here.</p>
                                <p className="text-xs mt-2 opacity-60 max-w-xs">StudyMate breaks down complex topics into easy-to-understand concepts and bullet points.</p>
                            </div>
            }
                    </div>
                </div>
            </div>
        </div>);

}