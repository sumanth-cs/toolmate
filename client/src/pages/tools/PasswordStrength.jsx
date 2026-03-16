import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import zxcvbn from "zxcvbn";

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const result = password ? zxcvbn(password) : null;

  const getStrengthColor = () => {
    if (!result) return "bg-border";
    switch (result.score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-emerald-500";
      default:
        return "bg-border";
    }
  };

  const getStrengthLabel = () => {
    if (!result) return "Enter a password";
    switch (result.score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };
  const getScoreIcon = () => {
    if (!result)
      return <ShieldCheck className="w-12 h-12 text-foreground/20" />;
    if (result.score <= 1)
      return <AlertTriangle className="w-12 h-12 text-red-500" />;
    if (result.score === 2)
      return <AlertCircle className="w-12 h-12 text-orange-500" />;
    if (result.score === 3)
      return <CheckCircle2 className="w-12 h-12 text-yellow-500" />;
    return <ShieldCheck className="w-12 h-12 text-emerald-500" />;
  };

  const formatCrackTime = () => {
    if (!result) return "-";
    return result.crack_times_display.offline_slow_hashing_1e4_per_second;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-2xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Password Strength
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Check the strength and hackability of your password.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
        {/* Input Field */}
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type password to check..."
            className="input-field w-full text-lg sm:text-2xl pr-14 text-center font-mono placeholder:font-sans placeholder:font-semibold"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-accent transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Score Status */}
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          {getScoreIcon()}
          <h2
            className={`text-3xl font-black uppercase tracking-widest ${
              !result
                ? "text-foreground/20"
                : result.score <= 1
                  ? "text-red-500"
                  : result.score === 2
                    ? "text-orange-500"
                    : result.score === 3
                      ? "text-yellow-500"
                      : "text-emerald-500"
            }`}
          >
            {getStrengthLabel()}
          </h2>

          <div className="w-full flex gap-2 h-3 max-w-xs mt-2">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`flex-1 rounded-full transition-colors duration-500 ${result && result.score >= level - 1 && password.length > 0 ? getStrengthColor() : "bg-accent border border-border/50"}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/5 rounded-xl border border-border p-4 text-center flex flex-col gap-2">
                <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
                  Estimated Hack Time
                </span>
                <span
                  className={`text-xl font-black ${result.score > 2 ? "text-emerald-500" : "text-red-500"}`}
                >
                  {formatCrackTime()}
                </span>
              </div>
              <div className="bg-black/5 rounded-xl border border-border p-4 text-center flex flex-col gap-2">
                <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider">
                  Guesses to Crack
                </span>
                <span className="text-xl font-black text-indigo-500">
                  {result.guesses.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Feedback */}
            {result.feedback &&
              (result.feedback.warning ||
                result.feedback.suggestions.length > 0) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 space-y-3">
                  {result.feedback.warning && (
                    <p className="flex items-center gap-2 text-red-500 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {result.feedback.warning}
                    </p>
                  )}
                  {result.feedback.suggestions.length > 0 && (
                    <ul className="text-red-400 text-sm list-disc pl-5 font-medium space-y-1">
                      {result.feedback.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
