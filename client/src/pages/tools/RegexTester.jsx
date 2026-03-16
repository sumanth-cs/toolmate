import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Bug, AlertCircle } from "lucide-react";

export default function RegexTester() {
  const [regex, setRegex] = useState(
    "([a-z0-9._%+-]+)@([a-z0-9.-]+\\.[a-z]{2,})",
  );
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(
    "My emails are test@example.com and dev@toolmate.ai",
  );

  const result = useMemo(() => {
    if (!regex) return { matches: [], error: null };
    try {
      const re = new RegExp(regex, flags);
      const matches = Array.from(testString.matchAll(re));
      return { matches, error: null };
    } catch (err) {
      return { matches: [], error: err.message };
    }
  }, [regex, flags, testString]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-5xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
          <CheckSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Regex Tester
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Real-time regular expression testing and debugging suite.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border shadow-xl space-y-4 bg-black/5">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                  Regular Expression
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">
                    /
                  </span>
                  <input
                    type="text"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    className="w-full bg-black/20 border border-border rounded-xl pl-8 pr-12 py-3 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">
                    /
                  </span>
                </div>
              </div>
              <div className="w-24 space-y-2">
                <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                  Flags
                </label>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="gim"
                  className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                />
              </div>
            </div>

            {result.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <pre className="font-mono text-xs">{result.error}</pre>
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 border border-border shadow-xl space-y-4 bg-black/5">
            <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
              Test String
            </label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full h-64 bg-black/20 border border-border rounded-xl p-6 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
              placeholder="Insert text to test against the expression..."
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border shadow-xl h-full flex flex-col bg-black/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-widest">
                Match Results
              </h3>
              <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {result.matches.length} Matches
              </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
              {result.matches.length > 0 ? (
                result.matches.map((match, i) => (
                  <div
                    key={i}
                    className="bg-black/20 border border-border rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                        Match #{i + 1}
                      </span>
                      <span className="text-[10px] text-foreground/40 font-mono">
                        Index: {match.index}
                      </span>
                    </div>
                    <div className="text-sm font-mono text-emerald-400 break-all">
                      {match[0]}
                    </div>
                    {match.length > 1 && (
                      <div className="space-y-1 pt-2">
                        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
                          Captured Groups
                        </p>
                        {Array.from(match)
                          .slice(1)
                          .map((group, gi) => (
                            <div
                              key={gi}
                              className="text-[11px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-1 rounded border border-indigo-500/10 mb-1"
                            >
                              ${gi + 1}: {group}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
                  <Bug className="w-12 h-12" />
                  <p className="text-sm font-bold uppercase tracking-widest">
                    No matches found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
