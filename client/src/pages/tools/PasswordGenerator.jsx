import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Key, Copy, Check, RefreshCw } from "lucide-react";
import zxcvbn from "zxcvbn";

export default function PasswordGenerator() {
  const [password, setPassword] = useState(
    "Click generate to create a password",
  );
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const strength =
    password !== "Click generate to create a password"
      ? zxcvbn(password)
      : { score: 0 };
  const getStrengthColor = () => {
    if (password === "Click generate to create a password")
      return "bg-gray-500/20";
    switch (strength.score) {
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
        return "bg-gray-500/20";
    }
  };
  const getStrengthLabel = () => {
    if (password === "Click generate to create a password") return "";
    switch (strength.score) {
      case 0:
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

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };
    let availableChars = "";
    if (uppercase) availableChars += charset.uppercase;
    if (lowercase) availableChars += charset.lowercase;
    if (numbers) availableChars += charset.numbers;
    if (symbols) availableChars += charset.symbols;
    if (!availableChars) {
      setPassword("Please select at least one character type");
      return;
    }

    let newPassword = "";
    // Ensure at least one of each selected type
    if (uppercase)
      newPassword +=
        charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
    if (lowercase)
      newPassword +=
        charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
    if (numbers)
      newPassword +=
        charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    if (symbols)
      newPassword +=
        charset.symbols[Math.floor(Math.random() * charset.symbols.length)];
    for (let i = newPassword.length; i < length; i++) {
      newPassword +=
        availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    // Shuffle the password
    newPassword = newPassword
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
    setPassword(newPassword);
    setCopied(false);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => {
    if (
      password === "Click generate to create a password" ||
      password === "Please select at least one character type"
    )
      return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-2xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Password Generator
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Generate strong, secure, and random passwords.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
        {/* Result Display */}
        <div className="relative mb-6">
          <div
            className={`p-6 rounded-xl border border-border bg-black/5 font-mono text-center text-xl sm:text-2xl break-all min-h-[5rem] flex items-center justify-center ${password.includes(" ") && !password.includes("Click") ? "text-red-500" : "text-foreground font-bold"}`}
          >
            {password}
          </div>
          {password !== "Click generate to create a password" &&
            !password.includes("Please select") && (
              <button
                onClick={copyToClipboard}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-background border border-border shadow-sm hover:bg-accent hover:text-indigo-500 transition-colors"
                aria-label="Copy password"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            )}
        </div>

        {/* Strength Meter */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground/80">
              Password Strength
            </span>
            <span
              className={`text-xs font-bold ${getStrengthLabel() === "Strong" ? "text-emerald-500" : getStrengthLabel() === "Weak" ? "text-red-500" : "text-foreground"}`}
            >
              {getStrengthLabel()}
            </span>
          </div>
          <div className="flex gap-2 h-2">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`flex-1 rounded-full transition-colors duration-300 ${password !== "Click generate to create a password" && strength.score >= level - 1 && strength.score > 0 ? getStrengthColor() : "bg-border"}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold">Length</label>
              <span className="text-sm font-bold text-indigo-500">
                {length}
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Uppercase",
                state: uppercase,
                setter: setUppercase,
                id: "upper",
              },
              {
                label: "Lowercase",
                state: lowercase,
                setter: setLowercase,
                id: "lower",
              },
              {
                label: "Numbers",
                state: numbers,
                setter: setNumbers,
                id: "num",
              },
              {
                label: "Symbols",
                state: symbols,
                setter: setSymbols,
                id: "sym",
              },
            ].map(({ label, state, setter, id }) => (
              <label
                key={id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-accent/50 transition-colors select-none"
              >
                <input
                  type="checkbox"
                  checked={state}
                  onChange={(e) => setter(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-indigo-500 focus:ring-indigo-500/50 bg-background"
                />

                <span className="text-sm font-semibold">{label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={generatePassword}
            className="btn-primary w-full h-14 gap-2 text-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-indigo-500/40"
          >
            <RefreshCw className="w-5 h-5" /> Generate Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}
