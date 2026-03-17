import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";

// Layouts
import MainLayout from "./layout/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Tools
import ImageGenerator from "./pages/tools/ImageGenerator";
import VideoGenerator from "./pages/tools/VideoGenerator";
import Chatbot from "./pages/tools/Chatbot";
import BgRemover from "./pages/tools/BgRemover";
import TextToSpeech from "./pages/tools/TextToSpeech";
import SpeechToText from "./pages/tools/SpeechToText";
import YoutubeTranscriber from "./pages/tools/YoutubeTranscriber";
import CurrencyConverter from "./pages/tools/CurrencyConverter";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageResizer from "./pages/tools/ImageResizer";
import ImageCropper from "./pages/tools/ImageCropper";
import FormatConverter from "./pages/tools/FormatConverter";
import ImageUpscaler from "./pages/tools/ImageUpscaler";
import VideoToGif from "./pages/tools/VideoToGif";
import GifToVideo from "./pages/tools/GifToVideo";
import ScreenRecorder from "./pages/tools/ScreenRecorder";
import WebcamRecorder from "./pages/tools/WebcamRecorder";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import PasswordStrength from "./pages/tools/PasswordStrength";
import UnitConverter from "./pages/tools/UnitConverter";
import AgeCalculator from "./pages/tools/AgeCalculator";
import WordCounter from "./pages/tools/WordCounter";
import LoremGenerator from "./pages/tools/LoremGenerator";
import WorldClock from "./pages/tools/WorldClock";
import BmiCalculator from "./pages/tools/BmiCalculator";
import JsonFormatter from "./pages/tools/JsonFormatter";
import JsonToCsv from "./pages/tools/JsonToCsv";
import CsvToJson from "./pages/tools/CsvToJson";
import HashGenerator from "./pages/tools/HashGenerator";
import Base64Encoder from "./pages/tools/Base64Encoder";
import QrGenerator from "./pages/tools/QrGenerator";
// Document Workshop Tools
import PdfMerger from "./pages/tools/PdfMerger";
import PdfSplitter from "./pages/tools/PdfSplitter";
import PdfCompressor from "./pages/tools/PdfCompressor";
import ImageToPdf from "./pages/tools/ImageToPdf";
import PdfToImages from "./pages/tools/PdfToImages";
import PdfToWord from "./pages/tools/PdfToWord";
import WordToPdf from "./pages/tools/WordToPdf";
import CsvVisualizer from "./pages/tools/CsvVisualizer";
import QrScanner from "./pages/tools/QrScanner";
import ColorExtractor from "./pages/tools/ColorExtractor";
import DataComparator from "./pages/tools/DataComparator";
import WebScraper from "./pages/tools/WebScraper";
import JwtDebugger from "./pages/tools/JwtDebugger";
import RegexTester from "./pages/tools/RegexTester";
import HtmlFormatter from "./pages/tools/HtmlFormatter";
import CssMinifier from "./pages/tools/CssMinifier";
import JsMinifier from "./pages/tools/JsMinifier";
import ApiTester from "./pages/tools/ApiTester";
import SqlFormatter from "./pages/tools/SqlFormatter";
import GenericTool from "./pages/tools/GenericTool";
import Profile from "./pages/tools/Profile";
import ChangePassword from "./pages/tools/ChangePassword";
import VerifyEmail from "./pages/VerifyEmail";

// Social Media Tools
import TweetGenerator from "./pages/tools/TweetGenerator";
import ThreadCreator from "./pages/tools/ThreadCreator";
import HashtagGenerator from "./pages/tools/HashtagGenerator";
import CaptionWriter from "./pages/tools/CaptionWriter";
import PostScheduler from "./pages/tools/PostScheduler";
import AnalyticsDashboard from "./pages/tools/AnalyticsDashboard";
import TrendingTopics from "./pages/tools/TrendingTopics";
import AutoPoster from "./pages/tools/AutoPoster";
import ContentCalendar from "./pages/tools/ContentCalendar";

// AI Intelligence Tools
import AiStudymate from "./pages/tools/AiStudymate";
import ResumeAnalyzer from "./pages/tools/ResumeAnalyzer";
import InterviewBot from "./pages/tools/InterviewBot";
import LiteratureReview from "./pages/tools/LiteratureReview";
import DocumentQA from "./pages/tools/DocumentQA";
import BlogWriter from "./pages/tools/BlogWriter";
import WebsiteSummarizer from "./pages/tools/WebsiteSummarizer";
import IdeaGenerator from "./pages/tools/IdeaGenerator";

// Protected Route Wrapper - Disabled to allow anonymous access
const ProtectedRoute = ({ children }) => {
  return <>{children}</>;
};

function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        {/* Public Marketing Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Secure App / Dashboard Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="image-generator" element={<ImageGenerator />} />
          <Route path="video-generator" element={<VideoGenerator />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="bg-remover" element={<BgRemover />} />
          <Route path="text-to-speech" element={<TextToSpeech />} />
          <Route path="speech-to-text" element={<SpeechToText />} />
          <Route path="youtube-transcriber" element={<YoutubeTranscriber />} />
          <Route path="currency-converter" element={<CurrencyConverter />} />

          {/* Media Studio */}
          <Route path="image-compressor" element={<ImageCompressor />} />
          <Route path="image-resizer" element={<ImageResizer />} />
          <Route path="image-cropper" element={<ImageCropper />} />
          <Route path="format-converter" element={<FormatConverter />} />
          <Route path="image-upscaler" element={<ImageUpscaler />} />
          <Route path="video-to-gif" element={<VideoToGif />} />
          <Route path="gif-to-video" element={<GifToVideo />} />
          <Route path="screen-recorder" element={<ScreenRecorder />} />
          <Route path="webcam-recorder" element={<WebcamRecorder />} />

          {/* Document Workshop */}
          <Route path="pdf-to-word" element={<PdfToWord />} />
          <Route path="word-to-pdf" element={<WordToPdf />} />
          <Route path="pdf-merger" element={<PdfMerger />} />
          <Route path="pdf-splitter" element={<PdfSplitter />} />
          <Route path="pdf-compressor" element={<PdfCompressor />} />
          <Route path="image-to-pdf" element={<ImageToPdf />} />
          <Route path="pdf-to-images" element={<PdfToImages />} />

          {/* Data Tools */}
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="json-to-csv" element={<JsonToCsv />} />
          <Route path="csv-to-json" element={<CsvToJson />} />
          <Route path="qr-generator" element={<QrGenerator />} />
          <Route path="csv-visualizer" element={<CsvVisualizer />} />
          <Route path="qr-scanner" element={<QrScanner />} />
          <Route path="color-extractor" element={<ColorExtractor />} />
          <Route path="data-comparator" element={<DataComparator />} />
          <Route path="web-scraper" element={<WebScraper />} />

          {/* Utility Hub */}
          <Route path="password-generator" element={<PasswordGenerator />} />
          <Route path="password-strength" element={<PasswordStrength />} />
          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="age-calculator" element={<AgeCalculator />} />
          <Route path="word-counter" element={<WordCounter />} />
          <Route path="lorem-ipsum" element={<LoremGenerator />} />
          <Route path="world-clock" element={<WorldClock />} />
          <Route path="bmi-calculator" element={<BmiCalculator />} />

          {/* Developer Tools */}
          <Route path="base64" element={<Base64Encoder />} />
          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="jwt-debugger" element={<JwtDebugger />} />
          <Route path="regex-tester" element={<RegexTester />} />
          <Route path="html-formatter" element={<HtmlFormatter />} />
          <Route path="css-minifier" element={<CssMinifier />} />
          <Route path="js-minifier" element={<JsMinifier />} />
          <Route path="api-tester" element={<ApiTester />} />
          <Route path="sql-formatter" element={<SqlFormatter />} />

          {/* Social Media & Marketing */}
          <Route path="tweet-generator" element={<TweetGenerator />} />
          <Route path="thread-creator" element={<ThreadCreator />} />
          <Route path="hashtag-generator" element={<HashtagGenerator />} />
          <Route path="caption-writer" element={<CaptionWriter />} />
          <Route path="post-scheduler" element={<PostScheduler />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="trending" element={<TrendingTopics />} />
          <Route path="auto-poster" element={<AutoPoster />} />
          <Route path="content-calendar" element={<ContentCalendar />} />

          {/* AI Intelligence */}
          <Route path="ai-studymate" element={<AiStudymate />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="interview-bot" element={<InterviewBot />} />
          <Route path="literature-review" element={<LiteratureReview />} />
          <Route path="document-qa" element={<DocumentQA />} />
          <Route path="blog-writer" element={<BlogWriter />} />
          <Route path="website-summarizer" element={<WebsiteSummarizer />} />
          <Route path="idea-generator" element={<IdeaGenerator />} />

          {/* Profile & Settings */}
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="settings" element={<Profile />} />

          <Route path="*" element={<GenericTool />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
