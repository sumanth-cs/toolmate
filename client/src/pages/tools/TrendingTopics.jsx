import {
  TrendingUp,
  Flame,
  Globe,
  Zap,
  Hash,
  MessageSquare,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function TrendingTopics() {
  const categories = [
    { id: "all", label: "All Categories", icon: Globe },
    { id: "tech", label: "Technology", icon: Zap },
    { id: "business", label: "Business & SaaS", icon: Flame },
    { id: "marketing", label: "Marketing", icon: TrendingUp },
  ];

  const trendingData = [
    {
      id: 1,
      rank: 1,
      topic: "Artificial Intelligence",
      category: "tech",
      volume: "2.4M Tweets",
      growth: "+24%",
      isHot: true,
    },
    {
      id: 2,
      rank: 2,
      topic: "Remote Work Trends 2026",
      category: "business",
      volume: "850K Mentions",
      growth: "+15%",
      isHot: true,
    },
    {
      id: 3,
      rank: 3,
      topic: "Short-form Video SEO",
      category: "marketing",
      volume: "620K Searches",
      growth: "+45%",
      isHot: true,
    },
    {
      id: 4,
      rank: 4,
      topic: "Web3 & Blockchain",
      category: "tech",
      volume: "1.2M Mentions",
      growth: "-5%",
      isHot: false,
    },
    {
      id: 5,
      rank: 5,
      topic: "Creator Economy",
      category: "business",
      volume: "450K Tweets",
      growth: "+10%",
      isHot: false,
    },
    {
      id: 6,
      rank: 6,
      topic: "Aged Domains Strategy",
      category: "marketing",
      volume: "120K Mentions",
      growth: "+85%",
      isHot: false,
    },
    {
      id: 7,
      rank: 7,
      topic: "React vs Vue 2026",
      category: "tech",
      volume: "340K Tweets",
      growth: "+12%",
      isHot: false,
    },
    {
      id: 8,
      rank: 8,
      topic: "B2B Lead Generation",
      category: "business",
      volume: "280K Searches",
      growth: "+8%",
      isHot: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Trending Topics
          </h1>
          <p className="text-muted-foreground">
            Discover what's viral right now and join the conversation.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
              i === 0
                ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/25"
                : "bg-background/50 border-border/50 text-muted-foreground hover:bg-background/80",
            )}
          >
            <cat.icon className="w-4 h-4" /> {cat.label}
          </button>
        ))}
      </div>

      {/* Trending List */}
      <div className="glass-card rounded-3xl overflow-hidden border border-border/30">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/30 bg-background/40 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 sm:col-span-6">Topic / Keyword</div>
          <div className="col-span-3 sm:col-span-3">Volume</div>
          <div className="col-span-3 sm:col-span-2 text-right">Trend</div>
        </div>

        <div className="divide-y divide-border/30">
          {trendingData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-background/30 transition-colors group"
            >
              <div className="col-span-1 text-center font-black text-lg text-muted-foreground group-hover:text-brand-500 transition-colors">
                #{item.rank}
              </div>

              <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                      {item.topic}
                    </h3>
                    {item.isHot && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 shrink-0">
                        <Flame className="w-3 h-3 text-red-500" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded text-brand-500 bg-brand-500/10">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-3 sm:col-span-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="w-4 h-4 hidden sm:block opacity-50" />
                {item.volume}
              </div>

              <div className="col-span-3 sm:col-span-2 flex justify-end">
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1",
                    item.growth.startsWith("+")
                      ? "text-green-500 bg-green-500/10"
                      : "text-red-500 bg-red-500/10",
                  )}
                >
                  <TrendingUp
                    className={cn(
                      "w-3 h-3",
                      item.growth.startsWith("-") && "rotate-180",
                    )}
                  />
                  {item.growth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use Case Helper */}
      <div className="mt-8 glass-card rounded-2xl p-6 bg-brand-500/5 items-start gap-4 flex border border-brand-500/20">
        <div className="p-3 rounded-xl bg-brand-500/10 shrink-0">
          <Hash className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground mb-1">
            How to use Trending Topics
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Copy these high-volume keywords and plug them into the{" "}
            <strong className="text-foreground">Tweet Generator</strong> or{" "}
            <strong className="text-foreground">Hashtag Generator</strong> to
            naturally insert your brand into viral conversations and boost
            organic reach.
          </p>
        </div>
      </div>
    </div>
  );
}
