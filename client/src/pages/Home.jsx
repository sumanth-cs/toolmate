import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Globe, FileText, Code, Image as ImageIcon, Video, MessageSquare, Cpu, ChevronDown, Check, Play } from 'lucide-react';
import { TbApiApp } from "react-icons/tb";

const fadeIn = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const badges = [
"50+ AI-Powered Tools — All Free",
"Generate Images, Videos & Code in Seconds",
"Built for Students, Teachers & Developers",
"PDF Tools, QR Codes, Dev Utilities & More",
"No Signup Required for Most Tools"];


const features = [
{
  icon: ImageIcon, title: 'AI Image & Video Studio',
  desc: 'Generate stunning visuals and videos from simple text prompts using state-of-the-art AI diffusion models.',
  details: ['Text-to-Image with multiple AI models', 'AI Video Generation', 'Background Removal & Upscaling', 'Screen & Webcam Recording']
},
{
  icon: FileText, title: 'Document Workshop',
  desc: 'Merge, split, compress PDFs. Convert between Word, images and PDF instantly — no watermarks, no limits.',
  details: ['PDF Merge, Split & Compress', 'Image to PDF & vice versa', 'Word to PDF conversion', 'Drag-and-drop interface']
},
{
  icon: Code, title: 'Developer Toolkit',
  desc: 'Base64, JWT Debugger, Regex Tester, API Tester, minifiers — everything a modern developer needs.',
  details: ['Hash Generator (MD5, SHA)', 'JSON/SQL/HTML Formatter', 'CSS & JS Minifier', 'Full API Tester with headers']
},
{
  icon: Cpu, title: 'Data Intelligence',
  desc: 'CSV visualization with charts, JSON tools, QR code generation/scanning, color palette extraction.',
  details: ['CSV Visualizer with Chart.js', 'JSON ↔ CSV Converter', 'QR Generator & Scanner', 'Color Palette Extractor']
},
{
  icon: MessageSquare, title: 'AI Chatbots',
  desc: 'Chat with the best LLMs for coding help, research, creative writing, and general Q&A.',
  details: ['Multiple AI model support', 'Context-aware conversations', 'Code generation & debugging', 'Export chat history']
},
{
  icon: Video, title: 'Utility Hub',
  desc: 'Password generator, world clock, BMI calculator, currency converter, and many more everyday essentials.',
  details: ['Password Generator & Strength Checker', 'Unit & Currency Converter', 'Word Counter & Lorem Ipsum', 'Age & BMI Calculator']
}];


const stats = [
{ value: '50+', label: 'AI Tools' },
{ value: '10K+', label: 'Active Users' },
{ value: '99.9%', label: 'Uptime' },
{ value: 'Free', label: 'Forever' }];


// Animated floating dots for the preview section
function AnimatedPreview() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            {/* Animated elements */}
            <motion.div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-400/10 border border-brand-500/10 flex items-center justify-center"
      animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                <ImageIcon className="w-7 h-7 text-brand-400/60" />
            </motion.div>
            <motion.div className="absolute top-[20%] right-[15%] w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600/20 to-brand-500/10 border border-brand-600/10 flex items-center justify-center"
      animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}>
                <Code className="w-6 h-6 text-brand-500/60" />
            </motion.div>
            <motion.div className="absolute bottom-[25%] left-[20%] w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400/15 to-brand-300/10 border border-brand-400/10 flex items-center justify-center"
      animate={{ y: [0, -8, 0], x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}>
                <FileText className="w-5 h-5 text-brand-400/50" />
            </motion.div>
            <motion.div className="absolute bottom-[15%] right-[10%] w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-400/5 border border-brand-500/10 flex items-center justify-center"
      animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.3 }}>
                <Cpu className="w-7 h-7 text-brand-500/50" />
            </motion.div>
            <motion.div className="absolute top-[50%] left-[45%] w-10 h-10 rounded-lg bg-gradient-to-br from-brand-400/20 to-transparent border border-brand-400/10 flex items-center justify-center"
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.8 }}>
                <Sparkles className="w-5 h-5 text-brand-400/60" />
            </motion.div>

            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <motion.line x1="18%" y1="23%" x2="45%" y2="50%" stroke="var(--color-accent)" strokeWidth="0.5" strokeOpacity="0.1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
                <motion.line x1="85%" y1="27%" x2="55%" y2="50%" stroke="var(--color-accent)" strokeWidth="0.5" strokeOpacity="0.1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.8 }} />
                <motion.line x1="28%" y1="75%" x2="50%" y2="55%" stroke="var(--color-accent)" strokeWidth="0.5" strokeOpacity="0.1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.1 }} />
                <motion.line x1="90%" y1="80%" x2="55%" y2="55%" stroke="var(--color-accent)" strokeWidth="0.5" strokeOpacity="0.1"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.4 }} />
            </svg>

            {/* Center pulse */}
            <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-brand-500/10"
      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }} />
        </div>);

}

// Feature accordion item
function FeatureCard({ feature, isOpen, onClick }) {
  return (
    <motion.div variants={fadeIn}
    className={`glass-card rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer group ${isOpen ? 'ring-1 ring-brand-500/20' : 'hover:ring-1 hover:ring-brand-500/10'}`}
    onClick={onClick}>
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'bg-brand-500/10 text-brand-500'}`}>
                        <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className={`text-base sm:text-lg font-bold transition-colors ${isOpen ? 'text-foreground' : 'text-foreground group-hover:text-brand-500'}`}>
                                {feature.title}
                            </h3>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{feature.desc}</p>
                    </div>
                </div>
                <AnimatePresence>
                    {isOpen &&
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} className="overflow-hidden">
                            <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {feature.details.map((d, i) =>
              <div key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                                        <div className="w-5 h-5 rounded-md bg-brand-500/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-brand-500" />
                                        </div>
                                        <span>{d}</span>
                                    </div>
              )}
                            </div>
                        </motion.div>
          }
                </AnimatePresence>
            </div>
        </motion.div>);

}

export default function Home() {
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [openFeature, setOpenFeature] = useState(0);

  // Rotate badges every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => setBadgeIndex((prev) => (prev + 1) % badges.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
            {/* Background Orbs */}
            <div className="bg-orb w-[500px] h-[500px] bg-brand-300/30 top-[-150px] left-[-100px] animate-blob" />
            <div className="bg-orb w-[400px] h-[400px] bg-brand-200/20 bottom-[-100px] right-[-50px] animate-blob animation-delay-2000" />
            <div className="bg-orb w-[350px] h-[350px] bg-brand-400/15 top-[40%] left-[50%] animate-blob animation-delay-4000" />

            {/* ====== NAVBAR ====== */}
            <nav className="fixed w-full z-50 top-0">
                <div className="mx-3 sm:mx-6 mt-3">
                    <div className="glass-card rounded-2xl px-4 sm:px-6 py-2.5">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="p-1.5 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                                    <TbApiApp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">ToolMate <span className="text-gradient">AI</span></span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6 lg:gap-8">
                                <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
                                <a href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Stats</a>
                                <a href="#trust" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Why Us</a>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link to="/login" className="text-sm font-semibold text-foreground hover:text-brand-500 transition-colors hidden sm:block">Sign in</Link>
                                <Link to="/register" className="btn-primary text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl">Get Started</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ====== HERO ====== */}
            <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 flex flex-col items-center text-center">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl flex flex-col items-center relative z-10">
                    {/* Rotating Badge */}
                    <motion.div variants={fadeIn} className="mb-6 sm:mb-8 h-8 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div key={badgeIndex}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-300">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                                </span>
                                <span className="whitespace-nowrap">{badges[badgeIndex]}</span>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={fadeIn} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 sm:mb-6 leading-[1.08] text-foreground">
                        All your tools,{' '}
                        <br className="hidden sm:block" />
                        <span className="text-gradient">one AI platform.</span>
                    </motion.h1>

                    <motion.p variants={fadeIn} className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl font-light leading-relaxed px-4">
                        The ultimate toolkit for students, teachers, and developers. Generate media, process documents, and build with AI — all in one place.
                    </motion.p>
                    
                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <Link to="/register" className="btn-primary h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-2xl gap-2 group justify-center">
                            Start Building Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#features" className="btn-secondary h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-2xl gap-2 justify-center">
                            <Play className="w-4 h-4" />
                            Explore Tools
                        </a>
                    </motion.div>
                </motion.div>

                {/* Animated Preview */}
                <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 sm:mt-20 relative w-full max-w-4xl">
          
                    <div className="glass-card rounded-3xl overflow-hidden h-[250px] sm:h-[350px] lg:h-[400px]">
                        <AnimatedPreview />
                    </div>
                    <div className="absolute inset-0 -z-10 bg-brand-400/8 rounded-3xl blur-3xl scale-95" />
                </motion.div>
            </section>

            {/* ====== STATS ====== */}
            <section id="stats" className="py-12 sm:py-16 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="glass-card rounded-3xl p-5 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((s, i) =>
            <motion.div key={i} variants={fadeIn} className="text-center">
                                <p className="text-2xl sm:text-4xl font-black text-gradient mb-0.5">{s.value}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{s.label}</p>
                            </motion.div>
            )}
                    </motion.div>
                </div>
            </section>

            {/* ====== FEATURES (Accordion Cards) ====== */}
            <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10 sm:mb-14">
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs font-bold text-brand-500 uppercase tracking-wider mb-4">
                            <Zap className="w-3 h-3" /> Features
                        </motion.div>
                        <motion.h2 variants={fadeIn} className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 text-foreground">
                            Everything you need,{' '}
                            <span className="text-gradient">built in.</span>
                        </motion.h2>
                        <motion.p variants={fadeIn} className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
                            No more juggling 10 different apps. All tools, one platform, one click away.
                        </motion.p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="space-y-3">
                        {features.map((feature, i) =>
            <FeatureCard key={i} feature={feature}
            isOpen={openFeature === i} onClick={() => setOpenFeature(openFeature === i ? -1 : i)} />
            )}
                    </motion.div>
                </div>
            </section>

            {/* ====== TRUST ====== */}
            <section id="trust" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="glass-card rounded-3xl p-6 sm:p-10 grid sm:grid-cols-3 gap-6 sm:gap-8">
                        {[
            { icon: Shield, title: 'Privacy First', desc: 'Client-side processing for most tools. Your files never leave your browser.' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed. No file uploads needed — instant results every time.' },
            { icon: Globe, title: 'Works Everywhere', desc: 'Fully responsive design. Desktop, tablet, and mobile — seamless experience.' }].
            map((item, i) =>
            <motion.div key={i} variants={fadeIn} className="text-center flex flex-col items-center gap-3">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-1">
                                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-foreground">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </motion.div>
            )}
                    </motion.div>
                </div>
            </section>

            {/* ====== CTA ====== */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.h2 variants={fadeIn} className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 text-foreground">
                            Ready to get started?
                        </motion.h2>
                        <motion.p variants={fadeIn} className="text-muted-foreground mb-8 max-w-lg mx-auto text-sm sm:text-base">
                            Join thousands of users who already use ToolMate AI every day. Free forever.
                        </motion.p>
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link to="/register" className="btn-primary h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base rounded-2xl gap-2 group justify-center">
                                Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ====== FOOTER ====== */}
            <footer className="py-8 px-4 sm:px-6 border-t border-border/30 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400">
                            <TbApiApp className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">ToolMate AI</span>
                    </div>
                    <p className="text-xs text-muted-foreground">&copy; 2026 ToolMate AI. Built for the future.</p>
                </div>
            </footer>
        </div>);

}