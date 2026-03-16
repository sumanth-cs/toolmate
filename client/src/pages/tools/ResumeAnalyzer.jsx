import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Copy, Check, FileText, Briefcase } from 'lucide-react';
import { useGeminiAPI } from '../../hooks/useGeminiAPI';
import ReactMarkdown from 'react-markdown';

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const analyzeResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) return;

    const prompt = `
        You are an elite Tech Recruiter and ATS (Applicant Tracking System) algorithm.
        I will provide my Resume and a Job Description. 
        
        Please provide:
        1. An estimated "ATS Match Score" out of 100%. Don't be afraid to be harsh.
        2. A brief 2-sentence summary of why I matched or didn't match.
        3. 3-5 Missing Keywords or skills I need to add to pass the ATS.
        4. Bulleted actionable feedback on how to tailor my resume for this specific role.
        
        ### Resume:
        """${resume}"""
        
        ### Job Description:
        """${jobDescription}"""
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
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">AI Resume Analyzer</h1>
                        <p className="text-muted-foreground">Compare your resume against a job description to get your ATS score and feedback.</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-6 flex flex-col h-full">
                    <div className="glass-card rounded-3xl p-6 flex flex-col min-h-[300px] flex-1">
                        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand-500" />
                            Your Resume (Paste text)
                        </h3>
                        <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="flex-1 w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm" />
            
                    </div>

                    <div className="glass-card rounded-3xl p-6 flex flex-col min-h-[250px] flex-1">
                        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-brand-500" />
                            Job Description
                        </h3>
                        <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="flex-1 w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm mb-4" />
            

                        {error &&
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                                {error}
                            </div>
            }

                        <button
              onClick={analyzeResume}
              disabled={!resume.trim() || !jobDescription.trim() || isLoading}
              className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:shadow-none transition-all">
              
                            {isLoading ?
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Sparkles className="w-5 h-5" />
                                </motion.div> :

              <><Sparkles className="w-5 h-5" /> Analyze Match</>
              }
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="glass-card rounded-3xl p-6 flex flex-col h-full min-h-[600px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-brand-500" />
                            ATS Analysis & Feedback
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

                    <div className="flex-1 bg-background border border-input rounded-2xl p-5 sm:p-6 relative overflow-y-auto custom-scrollbar">
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
                
                                    <User className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Your ATS score and feedback will appear here.</p>
                                    <p className="text-xs mt-2 opacity-60 max-w-sm">We'll identify missing keywords and skills to help you tailor your resume and pass the automated screening.</p>
                                </motion.div>
              }
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>);

}