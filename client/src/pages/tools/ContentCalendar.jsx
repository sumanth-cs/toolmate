import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
  ListTree,
  Hash,
  Plus,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function ContentCalendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Generate a static grid for visual purposes
  const generateCalendarDays = () => {
    const calendar = [];
    for (let i = 1; i <= 31; i++) {
      const hasPost = i === 15 || i === 18 || i === 22 || i === 25;
      const isToday = i === 15;
      calendar.push(
        <div
          key={i}
          className={cn(
            "min-h-[100px] sm:min-h-[120px] p-2 border border-border/30 relative group transition-colors",
            isToday
              ? "bg-brand-500/5 group-hover:bg-brand-500/10"
              : "bg-background/20 hover:bg-background/50",
            i === 1 && "col-start-3", // offset to start on a Tuesday for example
          )}
        >
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md",
              isToday ? "bg-brand-500 text-white" : "text-muted-foreground",
            )}
          >
            {i}
          </span>

          {hasPost && (
            <div className="mt-2 space-y-1.5">
              {i === 15 && (
                <div className="text-[10px] font-medium p-1.5 rounded bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" />
                  <span className="truncate">Product Launch</span>
                </div>
              )}
              {i === 18 && (
                <div className="text-[10px] font-medium p-1.5 rounded bg-[#0A66C2]/10 text-[#0A66C2] flex items-center gap-1.5">
                  <Share2 className="w-3 h-3" />
                  <span className="truncate">Weekly Tips</span>
                </div>
              )}
              {i === 25 && (
                <>
                  <div className="text-[10px] font-medium p-1.5 rounded bg-pink-500/10 text-pink-500 flex items-center gap-1.5">
                    <Hash className="w-3 h-3" />
                    <span className="truncate">Behind Scenes</span>
                  </div>
                  <div className="text-[10px] font-medium p-1.5 rounded bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center gap-1.5">
                    <ListTree className="w-3 h-3" />
                    <span className="truncate">Thread</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 bg-background rounded-md text-muted-foreground hover:text-brand-500 hover:bg-brand-500/10">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>,
      );
    }
    return calendar;
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Content Calendar
            </h1>
            <p className="text-muted-foreground">
              Bird's eye view of your scheduled and published posts.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-secondary px-4 py-2 text-sm rounded-xl">
            Today
          </button>
          <div className="flex items-center glass-card rounded-xl border border-border/50 p-1">
            <button className="p-1.5 hover:bg-background/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-foreground px-4">
              March 2026
            </span>
            <button className="p-1.5 hover:bg-background/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border/50 shadow-sm">
        <div className="grid grid-cols-7 border-b border-border/50 bg-background/40 p-3">
          {days.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-background/20">
          {generateCalendarDays()}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Twitter / X", color: "bg-[#1DA1F2]" },
          { label: "LinkedIn", color: "bg-[#0A66C2]" },
          {
            label: "Instagram",
            color:
              "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500",
          },
          { label: "Facebook", color: "bg-[#1877F2]" },
        ].map((item, i) => (
          <div
            key={i}
            className="glass-card p-3 rounded-xl flex items-center justify-center gap-2 border border-border/30"
          >
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
            <span className="text-xs font-semibold text-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
