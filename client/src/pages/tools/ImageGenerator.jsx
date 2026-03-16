import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Download, Loader2, AlertCircle, Wand2, ZoomIn, X } from 'lucide-react';
import axios from 'axios';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('fast');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(false);

  const ENDPOINTS = {
    fast: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools/proxy/generate-image`,
    pro: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools/proxy/generate-image-pro`
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
      // n8n webhook may return the image URL in different formats
      const url = res.data?.imageUrl || res.data?.image || res.data?.url || res.data?.output || res.data?.generated_image || res.data?.data?.imageUrl;
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
                    <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20">
                        <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    AI Image Generation
                </h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Turn your ideas into breathtaking visuals in seconds.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto">
                {/* Controls Panel */}
                <div className="lg:w-[340px] flex-shrink-0 space-y-4">
                    <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>

                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Your Prompt</label>
                                <textarea
                  className="input-field min-h-[140px] resize-none text-sm"
                  placeholder="A futuristic city at sunset, cyberpunk style, ultra detailed 8k HDR..."
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
                    'border-pink-500/50 bg-pink-500/10 text-pink-400' :
                    'border-border hover:border-pink-500/30 text-foreground/70 hover:bg-white/5'}`
                    }>
                    
                                        <Sparkles className="w-4 h-4 mb-1" />
                                        <span className="block font-bold">Fast</span>
                                        <span className="text-[10px] opacity-70">Speed optimized</span>
                                    </button>
                                    <button
                    onClick={() => setModel('pro')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                    model === 'pro' ?
                    'border-pink-500/50 bg-pink-500/10 text-pink-400' :
                    'border-border hover:border-pink-500/30 text-foreground/70 hover:bg-white/5'}`
                    }>
                    
                                        <Wand2 className="w-4 h-4 mb-1" />
                                        <span className="block font-bold">Pro</span>
                                        <span className="text-[10px] opacity-70">Highest quality</span>
                                    </button>
                                </div>
                            </div>

                            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Generating...' : 'Generate Image'}
                            </button>
                        </div>
                    </div>

                    {error &&
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </motion.div>
          }
                </div>

                {/* Preview Area */}
                <div className="flex-1 min-w-0">
                    <div className="glass-card rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[520px] flex flex-col">
                        {/* Toolbar */}
                        <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-card/80">
                            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : resultUrl ? 'bg-emerald-500' : 'bg-foreground/20'}`} />
                                {loading ? 'Rendering' : resultUrl ? 'Complete' : 'Workspace'}
                            </span>
                            {resultUrl &&
              <div className="flex items-center gap-2">
                                    <button onClick={() => setLightbox(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/50 hover:text-foreground transition-colors">
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <a
                  href={resultUrl} download="ai-image.png" target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 text-xs font-semibold transition-colors">
                  
                                        <Download className="w-3.5 h-3.5" /> Download
                                    </a>
                                </div>
              }
                        </div>

                        {/* Canvas */}
                        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_70%)]">
                            <AnimatePresence mode="wait">
                                {loading ?
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-500/20 animate-pulse">
                                                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                                            </div>
                                            <div className="absolute -inset-2 rounded-3xl border border-pink-500/10 animate-ping opacity-30" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-pink-400">Synthesizing pixels...</p>
                                            <p className="text-xs text-foreground/40 mt-1">This may take 10-30 seconds</p>
                                        </div>
                                    </motion.div> :
                resultUrl ?
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex items-center justify-center">
                                        <img
                    src={resultUrl} alt="AI Generated"
                    onClick={() => setLightbox(true)}
                    className="max-w-full max-h-[460px] object-contain rounded-xl shadow-2xl shadow-black/30 cursor-zoom-in hover:shadow-pink-500/10 transition-shadow" />
                  
                                    </motion.div> :

                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-foreground/30 max-w-xs text-center">
                                        <div className="w-16 h-16 mb-4 rounded-2xl bg-white/5 border border-dashed border-foreground/10 flex items-center justify-center">
                                            <ImageIcon className="w-7 h-7" />
                                        </div>
                                        <h4 className="font-semibold text-foreground/50 mb-1">Ready to Create</h4>
                                        <p className="text-xs">Enter a prompt and hit generate to bring your vision to life.</p>
                                    </motion.div>
                }
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && resultUrl &&
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(false)}>
          
                        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white" onClick={() => setLightbox(false)}>
                            <X className="w-6 h-6" />
                        </button>
                        <motion.img
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            src={resultUrl} alt="Full size" className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" />
          
                    </motion.div>
        }
            </AnimatePresence>
        </motion.div>);

}