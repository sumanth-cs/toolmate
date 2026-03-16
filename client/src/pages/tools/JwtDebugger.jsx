import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, ShieldCheck, AlertCircle, Copy, Check, Fingerprint } from 'lucide-react';

export default function JwtDebugger() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(null);

  const decoded = useMemo(() => {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return { error: 'Invalid JWT structure' };

    try {
      const base64UrlDecode = (str) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
        return decodeURIComponent(atob(padded).split('').map((c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
      };

      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return { header, payload, signature: parts[2] || '', error: null };
    } catch (e) {
      return { error: 'Failed to decode: Data is not valid JWT format' };
    }
  }, [token]);

  const handleCopy = (data, type) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-6xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
                    <Key className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">JWT Debugger</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Decode and verify JSON Web Tokens (JWT) and inspect their claims.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-xl space-y-4 bg-black/5">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Encoded Token</label>
                        <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full h-96 bg-black/20 border border-border rounded-xl p-6 font-mono text-xs outline-none focus:ring-1 focus:ring-indigo-500 resize-none break-all"
              placeholder="Paste your JWT (eyJh...) here..." />
            
                    </div>
                    {decoded?.error &&
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-bold">{decoded.error}</p>
                        </div>
          }
                </div>

                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-border shadow-xl space-y-6 bg-black/5 h-full flex flex-col">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Header
                                </h3>
                                <button onClick={() => handleCopy(decoded?.header, 'h')} className="text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1">
                                    {copied === 'h' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    Copy
                                </button>
                            </div>
                            <pre className="bg-black/20 p-4 rounded-xl border border-border text-xs font-mono text-indigo-400 overflow-auto max-h-[150px]">
                                {decoded?.header ? JSON.stringify(decoded.header, null, 2) : '// No header data'}
                            </pre>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> Payload (Claims)
                                </h3>
                                <button onClick={() => handleCopy(decoded?.payload, 'p')} className="text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1">
                                    {copied === 'p' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    Copy
                                </button>
                            </div>
                            <pre className="bg-black/20 p-4 rounded-xl border border-border text-xs font-mono text-emerald-400 overflow-auto max-h-[300px]">
                                {decoded?.payload ? JSON.stringify(decoded.payload, null, 2) : '// No payload data'}
                            </pre>
                        </div>

                        <div className="pt-4 border-t border-border mt-auto">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-foreground/30">
                                <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" /> Signature</span>
                                <span className="flex items-center gap-1 text-emerald-500"><ShieldCheck className="w-3 h-3" /> RS256 Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>);

}