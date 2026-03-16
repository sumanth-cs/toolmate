import { useLocation } from "react-router-dom";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GenericTool() {
  const location = useLocation();
  // Create a title based on the path
  const getTitle = (path) => {
    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6">
      <div className="w-24 h-24 rounded-3xl bg-accent border border-border shadow-2xl flex items-center justify-center mb-8 relative">
        <Settings
          className="w-12 h-12 text-brand-500 animate-spin"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 border-4 border-background flex items-center justify-center shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-4">
        {getTitle(location.pathname)}
      </h1>
      <p className="text-foreground/60 mb-8 leading-relaxed">
        This feature is currently in active development by the CodeMate team. We
        are training the AI models and setting up dedicated infrastructure.
        Check back soon!
      </p>

      <Link
        to="/app"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all active:scale-95 shadow-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Go back to Dashboard
      </Link>
    </div>
  );
}
