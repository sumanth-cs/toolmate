import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Code,
  Menu,
  Search,
  Sun,
  Moon,
  X,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronRight,
  PanelLeftOpen,
  Key,
  Binary,
  Hash as HashIcon,
  QrCode,
  Type,
  RefreshCw,
  FileText,
  MonitorPlay,
  Scissors,
  User,
  Settings,
  Lock,
  Mic,
  Youtube,
  File,
  Files,
  SplitSquareHorizontal,
  Minimize2,
  ImagePlus,
  FileImage,
  Maximize,
  Crop,
  ArrowUpCircle,
  Film,
  Camera,
  Monitor,
  Database,
  LayoutGrid,
  Scan,
  Palette,
  GitCompare,
  Globe,
  CheckSquare,
  Paintbrush,
  Zap,
  Activity,
  Scale,
  AlignLeft,
  Clock,
  Hourglass,
  ShieldCheck,
  ExternalLink,
  PenTool,
  FileSearch,
  ListTree,
  CalendarDays,
  BarChart,
  TrendingUp,
  Share2,
} from "lucide-react";
import { TbHexagonLetterT } from "react-icons/tb";

// Full tool list per category
const sidebarCategories = [
  {
    title: "AI Creator Studio",
    items: [
      {
        name: "Image Generator",
        icon: ImageIcon,
        path: "/app/image-generator",
      },
      { name: "Video Generator", icon: Video, path: "/app/video-generator" },
      { name: "AI Chatbots", icon: MessageSquare, path: "/app/chatbot" },
      { name: "Text to Speech", icon: Mic, path: "/app/text-to-speech" },
      { name: "Speech to Text", icon: Type, path: "/app/speech-to-text" },
      {
        name: "YouTube Transcriber",
        icon: Youtube,
        path: "/app/youtube-transcriber",
      },
    ],
  },
  {
    title: "AI Intelligence",
    items: [
      { name: "AI StudyMate", icon: FileText, path: "/app/ai-studymate" },
      { name: "Resume Analyzer", icon: User, path: "/app/resume-analyzer" },
      {
        name: "Interview Bot",
        icon: MessageSquare,
        path: "/app/interview-bot",
      },
      { name: "Lit Review Gen", icon: Files, path: "/app/literature-review" },
      { name: "Document Q&A", icon: FileSearch, path: "/app/document-qa" },
      { name: "SEO Blog Writer", icon: PenTool, path: "/app/blog-writer" },
      {
        name: "Website Summarizer",
        icon: Globe,
        path: "/app/website-summarizer",
      },
      { name: "Idea Generator", icon: Zap, path: "/app/idea-generator" },
    ],
  },
  {
    title: "Media Studio",
    items: [
      {
        name: "Image Compressor",
        icon: Minimize2,
        path: "/app/image-compressor",
      },
      { name: "BG Remover", icon: Scissors, path: "/app/bg-remover" },
      { name: "Screen Recorder", icon: Monitor, path: "/app/screen-recorder" },
      { name: "Image Resizer", icon: Maximize, path: "/app/image-resizer" },
      { name: "Image Cropper", icon: Crop, path: "/app/image-cropper" },
      {
        name: "Format Converter",
        icon: RefreshCw,
        path: "/app/format-converter",
      },
      {
        name: "Image Upscaler",
        icon: ArrowUpCircle,
        path: "/app/image-upscaler",
      },
      { name: "Video to GIF", icon: Film, path: "/app/video-to-gif" },
      { name: "GIF to Video", icon: Camera, path: "/app/gif-to-video" },
      {
        name: "Webcam Recorder",
        icon: MonitorPlay,
        path: "/app/webcam-recorder",
      },
    ],
  },
  {
    title: "Content Creator Suite",
    items: [
      {
        name: "Tweet Generator",
        icon: MessageSquare,
        path: "/app/tweet-generator",
      },
      { name: "Thread Creator", icon: ListTree, path: "/app/thread-creator" },
      {
        name: "Hashtag Generator",
        icon: HashIcon,
        path: "/app/hashtag-generator",
      },
      { name: "Caption Writer", icon: PenTool, path: "/app/caption-writer" },
      {
        name: "Post Scheduler",
        icon: CalendarDays,
        path: "/app/post-scheduler",
      },
      { name: "Analytics Dashboard", icon: BarChart, path: "/app/analytics" },
      { name: "Trending Topics", icon: TrendingUp, path: "/app/trending" },
      { name: "Auto Poster", icon: Share2, path: "/app/auto-poster" },
      {
        name: "Content Calendar",
        icon: CalendarDays,
        path: "/app/content-calendar",
      },
    ],
  },
  {
    title: "Document Workshop",
    items: [
      { name: "PDF Merger", icon: Files, path: "/app/pdf-merger" },
      {
        name: "PDF Splitter",
        icon: SplitSquareHorizontal,
        path: "/app/pdf-splitter",
      },
      { name: "Image to PDF", icon: ImagePlus, path: "/app/image-to-pdf" },
      { name: "PDF to Word", icon: FileText, path: "/app/pdf-to-word" },
      { name: "Word to PDF", icon: File, path: "/app/word-to-pdf" },
      { name: "PDF Compressor", icon: Minimize2, path: "/app/pdf-compressor" },
      { name: "PDF to Images", icon: FileImage, path: "/app/pdf-to-images" },
    ],
  },
  {
    title: "Utility Hub",
    items: [
      {
        name: "Currency Converter",
        icon: Activity,
        path: "/app/currency-converter",
      },
      {
        name: "Password Generator",
        icon: Key,
        path: "/app/password-generator",
      },
      {
        name: "Password Strength",
        icon: ShieldCheck,
        path: "/app/password-strength",
      },
      { name: "Unit Converter", icon: Scale, path: "/app/unit-converter" },
      { name: "Age Calculator", icon: Hourglass, path: "/app/age-calculator" },
      { name: "Word Counter", icon: Type, path: "/app/word-counter" },
      {
        name: "Lorem Ipsum Generator",
        icon: AlignLeft,
        path: "/app/lorem-ipsum",
      },
      { name: "World Clock", icon: Clock, path: "/app/world-clock" },
      { name: "BMI Calculator", icon: Scale, path: "/app/bmi-calculator" },
    ],
  },
  {
    title: "Data Intelligence",
    items: [
      { name: "JSON Formatter", icon: Code, path: "/app/json-formatter" },
      { name: "JSON to CSV", icon: RefreshCw, path: "/app/json-to-csv" },
      { name: "CSV to JSON", icon: RefreshCw, path: "/app/csv-to-json" },
      { name: "QR Generator", icon: QrCode, path: "/app/qr-generator" },
      { name: "CSV Visualizer", icon: LayoutGrid, path: "/app/csv-visualizer" },
      { name: "QR Scanner", icon: Scan, path: "/app/qr-scanner" },
      { name: "Color Extractor", icon: Palette, path: "/app/color-extractor" },
      {
        name: "Data Comparator",
        icon: GitCompare,
        path: "/app/data-comparator",
      },
      { name: "Web Scraper", icon: Globe, path: "/app/web-scraper" },
    ],
  },
  {
    title: "Developer Toolkit",
    items: [
      { name: "Base64 Encoder", icon: Binary, path: "/app/base64" },
      { name: "Hash Generator", icon: HashIcon, path: "/app/hash-generator" },
      { name: "JWT Debugger", icon: Key, path: "/app/jwt-debugger" },
      { name: "Regex Tester", icon: CheckSquare, path: "/app/regex-tester" },
      { name: "HTML Formatter", icon: Code, path: "/app/html-formatter" },
      { name: "CSS Minifier", icon: Paintbrush, path: "/app/css-minifier" },
      { name: "JS Minifier", icon: Code, path: "/app/js-minifier" },
      { name: "API Tester", icon: Zap, path: "/app/api-tester" },
      { name: "SQL Formatter", icon: Database, path: "/app/sql-formatter" },
    ],
  },
];

const allTools = sidebarCategories.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, category: cat.title })),
);

const SIDEBAR_PREVIEW_COUNT = 3;

export default function MainLayout() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isDarkMode,
    toggleTheme,
    user,
    logout,
  } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const active = sidebarCategories.find((cat) =>
      cat.items.some((item) => location.pathname === item.path),
    );
    if (active)
      setExpandedCategories((prev) => ({ ...prev, [active.title]: true }));
  }, [location.pathname]);

  const toggleCategory = useCallback((title) => {
    setExpandedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const handleNavClick = useCallback(() => setMobileMenuOpen(false), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allTools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [searchQuery]);

  const handleSearchSelect = useCallback(
    (path) => {
      navigate(path);
      setSearchQuery("");
      setSearchFocused(false);
      setMobileMenuOpen(false);
    },
    [navigate],
  );

  const SidebarContent = ({ mobile = false }) => {
    const isOpen = isSidebarOpen || mobile;
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex h-14 items-center px-4 justify-between shrink-0 border-b border-border/30">
          {isOpen ? (
            <Link
              to="/app"
              className="flex items-center gap-2.5 group"
              onClick={handleNavClick}
            >
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                <TbHexagonLetterT className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                ToolMate
              </span>
            </Link>
          ) : (
            <button
              onClick={toggleSidebar}
              className="mx-auto p-1.5 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transition-shadow"
              title="Expand sidebar"
            >
              <TbHexagonLetterT className="w-5 h-5 text-white" />
            </button>
          )}
          {mobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          )}
          {!mobile && isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors hidden lg:block"
            >
              <Menu className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed (Desktop only) */}
        {!mobile && !isOpen && (
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={toggleSidebar}
              className="sidebar-item justify-center w-full"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-[18px] h-[18px] shrink-0 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Dashboard */}
        <div className="px-3 pt-3 pb-1">
          <Link
            to="/app"
            onClick={handleNavClick}
            className={`sidebar-item ${location.pathname === "/app" ? "active" : ""}`}
          >
            <LayoutDashboard
              className={`w-[18px] h-[18px] shrink-0 ${location.pathname === "/app" ? "text-brand-500" : "text-muted-foreground"}`}
            />
            {isOpen && <span className="text-sm font-medium">Dashboard</span>}
          </Link>
        </div>

        <div className="mx-4 my-1.5 h-px bg-border/30" />

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-1 px-3 space-y-0.5">
          {sidebarCategories.map((category) => {
            const isExpanded = expandedCategories[category.title] ?? false;
            const hasActive = category.items.some(
              (item) => location.pathname === item.path,
            );
            const displayItems = isExpanded
              ? category.items
              : category.items.slice(0, SIDEBAR_PREVIEW_COUNT);
            const hasMore = category.items.length > SIDEBAR_PREVIEW_COUNT;

            return (
              <div key={category.title}>
                {isOpen ? (
                  <button
                    onClick={() => toggleCategory(category.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors ${hasActive ? "text-brand-500" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <span>{category.title}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-150 ${isExpanded ? "" : "-rotate-90"}`}
                    />
                  </button>
                ) : (
                  <div className="flex justify-center py-1.5">
                    <div className="w-6 h-[2px] rounded-full bg-border/50" />
                  </div>
                )}

                <div className="space-y-px">
                  {(isOpen
                    ? displayItems
                    : isExpanded
                      ? category.items
                      : category.items.slice(0, 2)
                  ).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={`sidebar-item text-sm ${isOpen ? "ml-1" : "justify-center"} ${isActive ? "active" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <item.icon
                          className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-500" : ""}`}
                        />
                        {isOpen && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    );
                  })}
                  {isOpen && hasMore && !isExpanded && (
                    <button
                      onClick={() => toggleCategory(category.title)}
                      className="flex items-center gap-2 px-3 py-1.5 ml-1 rounded-xl text-xs font-medium text-brand-500 hover:bg-brand-500/5 transition-colors w-full"
                    >
                      <ChevronRight className="w-3 h-3" />
                      <span>View all ({category.items.length})</span>
                    </button>
                  )}
                  {isOpen && hasMore && isExpanded && (
                    <button
                      onClick={() => toggleCategory(category.title)}
                      className="flex items-center gap-2 px-3 py-1.5 ml-1 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--hover-bg)] transition-colors w-full"
                    >
                      <ChevronDown className="w-3 h-3 rotate-180" />
                      <span>Show less</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom User */}
        <div className="p-3 border-t border-border/30 mt-auto shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 text-white font-bold text-xs shrink-0 shadow-md shadow-brand-500/20">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">
                  {user?.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden relative">
      {/* Desktop Sidebar — pure CSS transition, no framer-motion */}
      <aside
        style={{ width: isSidebarOpen ? "15rem" : "4.5rem" }}
        className="relative z-20 shrink-0 hidden lg:flex flex-col glass-sidebar h-full sidebar-transition"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <div
              className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="fixed inset-y-0 left-0 w-[280px] z-50 glass-sidebar shadow-glass-lg lg:hidden flex flex-col mobile-sidebar-enter">
              <SidebarContent mobile />
            </aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0">
        {/* Navbar */}
        <header className="h-14 shrink-0 px-3 sm:px-5 glass-navbar flex items-center justify-between z-[100] sticky top-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors lg:hidden shrink-0"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2 lg:hidden shrink-0">
              <div className="p-1 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 shadow-sm">
                <TbHexagonLetterT className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                ToolMate
              </span>
            </div>

            {/* Search */}
            <div
              className="relative flex-1 max-w-xs sm:max-w-sm"
              ref={searchRef}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search tools..."
                className="glass-input pl-9 pr-4 py-2 text-sm rounded-xl w-full"
              />

              {/* Search Results Dropdown — fixed positioning to escape stacking context */}
              {searchFocused && searchResults.length > 0 && (
                <div className="fixed top-14 mt-1 w-72 sm:w-80 dropdown-solid rounded-2xl shadow-dropdown overflow-hidden z-[200] max-h-80 overflow-y-auto custom-scrollbar">
                  <div className="p-1.5">
                    {searchResults.map((tool) => (
                      <button
                        key={tool.path}
                        onClick={() => handleSearchSelect(tool.path)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-[var(--hover-bg)] transition-colors w-full text-left"
                      >
                        <tool.icon className="w-4 h-4 text-brand-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium truncate block">
                            {tool.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {tool.category}
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {searchFocused &&
                searchQuery.trim() &&
                searchResults.length === 0 && (
                  <div className="fixed top-14 mt-1 w-72 sm:w-80 dropdown-solid rounded-2xl shadow-dropdown z-[200] p-4 text-center text-sm text-muted-foreground">
                    No tools found for "{searchQuery}"
                  </div>
                )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme Toggle — simple CSS, no framer-motion */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-[18px] h-[18px] text-amber-400" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-brand-500" />
              )}
            </button>

            <div className="h-5 w-px bg-border/50 hidden sm:block" />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-2 sm:pr-3 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-tr from-brand-500 to-brand-400 text-white font-bold text-[10px] shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block max-w-[80px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-muted-foreground hidden sm:block transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>
              {profileOpen && (
                <div className="fixed top-14 mt-1 right-3 sm:right-5 w-60 dropdown-solid rounded-2xl shadow-dropdown overflow-hidden z-[200]">
                  <div className="p-3 border-b border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 text-white font-bold text-sm shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { to: "/app/profile", icon: User, label: "My Profile" },
                      {
                        to: "/app/change-password",
                        icon: Lock,
                        label: "Change Password",
                      },
                      {
                        to: "/app/settings",
                        icon: Settings,
                        label: "Settings",
                      },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-[var(--hover-bg)] transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-1.5 border-t border-border/30">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full p-3 sm:p-5 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
