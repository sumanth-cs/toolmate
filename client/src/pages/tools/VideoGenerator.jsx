import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Sparkles, Download, Loader2, AlertCircle, Wand2, Play } from 'lucide-react';
import axios from 'axios';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('fast');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const ENDPOINTS = {
    fast: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools/proxy/generate-video-fast`,
    pro: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools/proxy/generate-video`
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const token = JSON.parse(localStorage.getItem('toolmate_user') || '{}')?.token;
      const res = await axios.post(ENDPOINTS[model], { prompt }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = res.data?.videoUrl || res.data?.video || res.data?.url || res.data?.output || res.data?.data?.video_url || res.data?.data?.url;
      if (url) {
        setResultUrl(url);
      } else if (typeof res.data === 'string' && res.data.startsWith('http')) {
        setResultUrl(res.data);
      } else {
        setError('Unexpected response format. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/20">
                        <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    AI Video Generator
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Generate cinematic short videos from text descriptions.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
                {/* Controls Panel */}
                <div className="lg:w-[340px] flex-shrink-0 space-y-4">
                    <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>

                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Your Prompt</label>
                                <textarea
                  className="input-field min-h-[140px] resize-none text-sm"
                  placeholder="Camera slowly pans across a beautiful snowy mountain range at golden hour, cinematic 4K..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)} />
                
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Model</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                    onClick={() => setModel('fast')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    model === 'fast' ?
                    'border-violet-500/50 bg-violet-500/10 text-violet-400' :
                    'border-border hover:border-violet-500/30 text-foreground/70 hover:bg-white/5'}`
                    }>
                    
                                        <Sparkles className="w-4 h-4 mb-1" />
                                        <span className="block font-bold">Fast</span>
                                        <span className="text-[10px] opacity-70">Quick render</span>
                                    </button>
                                    <button
                    onClick={() => setModel('pro')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    model === 'pro' ?
                    'border-violet-500/50 bg-violet-500/10 text-violet-400' :
                    'border-border hover:border-violet-500/30 text-foreground/70 hover:bg-white/5'}`
                    }>
                    
                                        <Wand2 className="w-4 h-4 mb-1" />
                                        <span className="block font-bold">Pro</span>
                                        <span className="text-[10px] opacity-70">4K cinematic</span>
                                    </button>
                                </div>
                            </div>

                            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Rendering...' : 'Generate Video'}
                            </button>
                        </div>
                    </div>

                    {error &&
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </motion.div>
          }

                    {loading &&
          <div className="glass-card rounded-2xl p-4">
                            <p className="text-xs text-foreground/50 mb-2 font-semibold">Pro tip</p>
                            <p className="text-xs text-foreground/40">Video generation can take 30-90 seconds. Be descriptive with camera angles and lighting for best results.</p>
                        </div>
          }
                </div>

                {/* Preview Area */}
                <div className="flex-1 min-w-0">
                    <div className="glass-card rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[520px] flex flex-col">
                        {/* Toolbar */}
                        <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-card/80">
                            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : resultUrl ? 'bg-emerald-500' : 'bg-foreground/20'}`} />
                                {loading ? 'Rendering' : resultUrl ? 'Complete' : 'Output'}
                            </span>
                            {resultUrl &&
              <a
                href={resultUrl} download="ai-video.mp4" target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 text-xs font-semibold transition-colors">
                
                                    <Download className="w-3.5 h-3.5" /> Download
                                </a>
              }
                        </div>

                        {/* Canvas */}
                        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.03)_0%,_transparent_70%)]">
                            <AnimatePresence mode="wait">
                                {loading ?
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/20 animate-pulse">
                                                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                                            </div>
                                            <div className="absolute -inset-2 rounded-3xl border border-violet-500/10 animate-ping opacity-30" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-violet-400">Rendering frames...</p>
                                            <p className="text-xs text-foreground/40 mt-1">This may take 30-90 seconds</p>
                                        </div>
                                    </motion.div> :
                resultUrl ?
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex items-center justify-center">
                                        <div className="relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl shadow-black/30 group">
                                            <video
                      src={resultUrl} controls autoPlay loop
                      className="w-full rounded-xl"
                      style={{ maxHeight: '460px' }} />
                    
                                        </div>
                                    </motion.div> :

                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-foreground/30 max-w-xs text-center">
                                        <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 border border-dashed border-foreground/10 flex items-center justify-center">
                                            <Play className="w-7 h-7" />
                                        </div>
                                        <h4 className="font-semibold text-foreground/50 mb-1">Canvas Empty</h4>
                                        <p className="text-xs">Describe a scene and we'll render it into a cinematic video.</p>
                                    </motion.div>
                }
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>);

}