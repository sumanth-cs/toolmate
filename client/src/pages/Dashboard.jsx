import { Link } from 'react-router-dom';
import {
  Image as ImageIcon, Video, Mic, Type, Youtube, MessageSquare, Music, User, Podcast,
  FileText, File, Files, SplitSquareHorizontal, Minimize2, ImagePlus, FileImage, FileSearch, Globe,
  MonitorPlay, Maximize, Crop, RefreshCw, Scissors, ArrowUpCircle, Film, Camera, Monitor,
  Database, Code, ListTree, QrCode, Scan, Palette, GitCompare, LayoutGrid,
  Binary, Key, CheckSquare, AlignLeft, Paintbrush,
  Hourglass, Activity, Clock, Scale, PenTool,
  Hash, CalendarDays, BarChart, TrendingUp, Zap, ArrowRight, Share2, TerminalSquare, Settings,
  ShieldCheck } from
'lucide-react';
import { useStore } from '../store/useStore';

const categories = [
{
  title: "AI Creator Studio",
  description: "Content Creation Superpowers",
  color: "from-brand-500 to-brand-400",
  icon: Paintbrush,
  sectionId: "ai-creator-studio",
  tools: [
  { name: 'AI Text-to-Image', path: '/app/image-generator', icon: ImageIcon, active: true },
  { name: 'AI Video Generator', path: '/app/video-generator', icon: Video, active: true },
  { name: 'AI Text-to-Speech', path: '/app/text-to-speech', icon: Mic, active: true },
  { name: 'AI Speech-to-Text', path: '/app/speech-to-text', icon: Type, active: true },
  { name: 'YouTube Transcriber', path: '/app/youtube-transcriber', icon: Youtube, active: true },
  { name: 'AI Chatbots', path: '/app/chatbot', icon: MessageSquare, active: true },
  { name: 'AI Music Generator', path: '/app/music-generator', icon: Music, active: false },
  { name: 'AI Voice Cloning', path: '/app/voice-cloning', icon: Podcast, active: false },
  { name: 'AI Avatar Video', path: '/app/avatar-video', icon: User, active: false }]

},
{
  title: "AI Intelligence",
  description: "Problem-Solving AI Tools",
  color: "from-brand-600 to-brand-500",
  icon: Zap,
  sectionId: "ai-intelligence",
  tools: [
  { name: 'AI StudyMate', path: '/app/ai-studymate', icon: FileText, active: true },
  { name: 'Resume Analyzer', path: '/app/resume-analyzer', icon: User, active: true },
  { name: 'Interview Bot', path: '/app/interview-bot', icon: MessageSquare, active: true },
  { name: 'Literature Review', path: '/app/literature-review', icon: Files, active: true },
  { name: 'Document Q&A', path: '/app/document-qa', icon: FileSearch, active: true },
  { name: 'SEO Blog Writer', path: '/app/blog-writer', icon: PenTool, active: true },
  { name: 'Website Summarizer', path: '/app/website-summarizer', icon: Globe, active: true },
  { name: 'Startup Idea Gen', path: '/app/idea-generator', icon: Zap, active: true }]

},
{
  title: "Media Studio",
  description: "Image & Video Wizardry",
  color: "from-brand-400 to-brand-300",
  icon: MonitorPlay,
  sectionId: "media-studio",
  tools: [
  { name: 'Image Compressor', path: '/app/image-compressor', icon: Minimize2, active: true },
  { name: 'Image Resizer', path: '/app/image-resizer', icon: Maximize, active: true },
  { name: 'Image Cropper', path: '/app/image-cropper', icon: Crop, active: true },
  { name: 'Format Converter', path: '/app/format-converter', icon: RefreshCw, active: true },
  { name: 'Background Remover', path: '/app/bg-remover', icon: Scissors, active: true },
  { name: 'Image Upscaler', path: '/app/image-upscaler', icon: ArrowUpCircle, active: true },
  { name: 'Video to GIF', path: '/app/video-to-gif', icon: Film, active: true },
  { name: 'GIF to Video', path: '/app/gif-to-video', icon: Camera, active: true },
  { name: 'Screen Recorder', path: '/app/screen-recorder', icon: Monitor, active: true },
  { name: 'Webcam Recorder', path: '/app/webcam-recorder', icon: Camera, active: true }]

},
{
  title: "Content Creator Suite",
  description: "Social Media & Marketing",
  color: "from-brand-500 to-brand-400",
  icon: Share2,
  sectionId: "content-creator-suite",
  tools: [
  { name: 'Tweet Generator', path: '/app/tweet-generator', icon: MessageSquare, active: true },
  { name: 'Thread Creator', path: '/app/thread-creator', icon: ListTree, active: true },
  { name: 'Hashtag Generator', path: '/app/hashtag-generator', icon: Hash, active: true },
  { name: 'Caption Writer', path: '/app/caption-writer', icon: PenTool, active: true },
  { name: 'Post Scheduler', path: '/app/post-scheduler', icon: CalendarDays, active: true },
  { name: 'Analytics Dashboard', path: '/app/analytics', icon: BarChart, active: true },
  { name: 'Trending Topics', path: '/app/trending', icon: TrendingUp, active: true },
  { name: 'Auto Poster', path: '/app/auto-poster', icon: Share2, active: true },
  { name: 'Content Calendar', path: '/app/content-calendar', icon: CalendarDays, active: true }]

},
{
  title: "Document Workshop",
  description: "PDF & Document Magic",
  color: "from-brand-600 to-brand-500",
  icon: FileText,
  sectionId: "document-workshop",
  tools: [
  { name: 'PDF to Word', path: '/app/pdf-to-word', icon: FileText, active: true },
  { name: 'Word to PDF', path: '/app/word-to-pdf', icon: File, active: true },
  { name: 'PDF Merger', path: '/app/pdf-merger', icon: Files, active: true },
  { name: 'PDF Splitter', path: '/app/pdf-splitter', icon: SplitSquareHorizontal, active: true },
  { name: 'PDF Compressor', path: '/app/pdf-compressor', icon: Minimize2, active: true },
  { name: 'Image to PDF', path: '/app/image-to-pdf', icon: ImagePlus, active: true },
  { name: 'PDF to Images', path: '/app/pdf-to-images', icon: FileImage, active: true },
  { name: 'Resume Parser', path: '/app/resume-parser', icon: FileSearch, active: false },
  { name: 'Document Translator', path: '/app/document-translator', icon: Globe, active: false }]

},
{
  title: "Utility Hub",
  description: "Everyday Essential Tools",
  color: "from-brand-400 to-brand-300",
  icon: Settings,
  sectionId: "utility-hub",
  tools: [
  { name: 'Currency Converter', path: '/app/currency-converter', icon: Activity, active: true },
  { name: 'Password Generator', path: '/app/password-generator', icon: Key, active: true },
  { name: 'Password Strength', path: '/app/password-strength', icon: ShieldCheck, active: true },
  { name: 'Unit Converter', path: '/app/unit-converter', icon: Scale, active: true },
  { name: 'Age Calculator', path: '/app/age-calculator', icon: Hourglass, active: true },
  { name: 'Word Counter', path: '/app/word-counter', icon: Type, active: true },
  { name: 'Lorem Ipsum Generator', path: '/app/lorem-ipsum', icon: AlignLeft, active: true },
  { name: 'World Clock', path: '/app/world-clock', icon: Clock, active: true },
  { name: 'BMI Calculator', path: '/app/bmi-calculator', icon: Scale, active: true }]

},
{
  title: "Data Intelligence",
  description: "Transform Data into Insights",
  color: "from-brand-500 to-brand-400",
  icon: Database,
  sectionId: "data-intelligence",
  tools: [
  { name: 'CSV Visualizer', path: '/app/csv-visualizer', icon: LayoutGrid, active: true },
  { name: 'JSON Formatter', path: '/app/json-formatter', icon: Code, active: true },
  { name: 'JSON to CSV', path: '/app/json-to-csv', icon: RefreshCw, active: true },
  { name: 'CSV to JSON', path: '/app/csv-to-json', icon: RefreshCw, active: true },
  { name: 'QR Code Generator', path: '/app/qr-generator', icon: QrCode, active: true },
  { name: 'QR Code Scanner', path: '/app/qr-scanner', icon: Scan, active: true },
  { name: 'Color Palette Extractor', path: '/app/color-extractor', icon: Palette, active: true },
  { name: 'Data Comparator', path: '/app/data-comparator', icon: GitCompare, active: true },
  { name: 'Web Scraper', path: '/app/web-scraper', icon: Globe, active: true }]

},
{
  title: "Developer Toolkit",
  description: "For Coders & Engineers",
  color: "from-brand-600 to-brand-500",
  icon: TerminalSquare,
  sectionId: "developer-toolkit",
  tools: [
  { name: 'Base64 Encoder / Decoder', path: '/app/base64', icon: Binary, active: true },
  { name: 'JWT Debugger', path: '/app/jwt-debugger', icon: Key, active: true },
  { name: 'Hash Generator', path: '/app/hash-generator', icon: Hash, active: true },
  { name: 'Regex Tester', path: '/app/regex-tester', icon: CheckSquare, active: true },
  { name: 'HTML Formatter', path: '/app/html-formatter', icon: Code, active: true },
  { name: 'CSS Minifier', path: '/app/css-minifier', icon: Paintbrush, active: true },
  { name: 'JS Minifier', path: '/app/js-minifier', icon: Code, active: true },
  { name: 'API Tester', path: '/app/api-tester', icon: Zap, active: true },
  { name: 'SQL Formatter', path: '/app/sql-formatter', icon: Database, active: true }]

}];


export default function Dashboard() {
  const { user } = useStore();
  const activeToolCount = categories.reduce((sum, c) => sum + c.tools.filter((t) => t.active).length, 0);

  return (
    <div className="pb-8">
            {/* Welcome Hero */}
            <div
        className="glass-card rounded-3xl p-5 sm:p-8 mb-8 relative overflow-hidden">
        
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-brand-400/5 to-transparent rounded-tr-full pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground mb-1.5">
                            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
                            Your all-in-one AI toolkit is ready. Choose from {activeToolCount}+ active tools below to get started.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <div className="glass-card rounded-2xl px-4 py-3 text-center min-w-[80px]">
                            <p className="text-xl sm:text-2xl font-extrabold text-gradient">{activeToolCount}+</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Tools</p>
                        </div>
                        <div className="glass-card rounded-2xl px-4 py-3 text-center min-w-[80px]">
                            <p className="text-xl sm:text-2xl font-extrabold text-gradient">{categories.length}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Categories</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-8 sm:space-y-10">
                {categories.map((category, idx) =>
        <div
          key={idx}
          id={category.sectionId}
          className="scroll-mt-20">
          
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg shrink-0`}>
                                <category.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base sm:text-xl font-bold text-foreground truncate">{category.title}</h2>
                                <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">{category.description}</p>
                            </div>
                            <div className="ml-auto shrink-0">
                                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground glass-card px-2.5 py-1 rounded-full">
                                    {category.tools.filter((t) => t.active).length} tools
                                </span>
                            </div>
                        </div>

                        {/* Tool Cards Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                            {category.tools.map((tool, i) =>
            tool.active ?
            <div key={i}>
                                        <Link
                to={tool.path}
                className="group flex items-center p-3 sm:p-3.5 rounded-2xl glass-card hover:border-brand-500/40 transition-all duration-200 overflow-hidden relative">
                
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.06] bg-gradient-to-br ${category.color} transition-opacity duration-300`} />
                                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                                                <tool.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-brand-500 transition-colors">
                                                    {tool.name}
                                                </h3>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-foreground/15 group-hover:text-brand-500 transition-all opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 shrink-0" />
                                        </Link>
                                    </div> :

            <div key={i}>
                                        <div className="flex items-center p-3 sm:p-3.5 rounded-2xl border border-border/30 opacity-50 cursor-not-allowed">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-muted flex items-center justify-center mr-3 shrink-0">
                                                <tool.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">{tool.name}</h3>
                                                <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider">Coming Soon</span>
                                            </div>
                                        </div>
                                    </div>

            )}
                        </div>
                    </div>
        )}
            </div>
        </div>);

}