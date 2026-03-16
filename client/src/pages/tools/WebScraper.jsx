import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, ArrowRight, Loader2, Link as LinkIcon, Download, AlertCircle } from 'lucide-react';

export default function WebScraper() {
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    if (!url) return;
    setScraping(true);
    setError(null);
    setResult(null);

    try {
      // Integration with n8n Webhook via our backend proxy
      const token = JSON.parse(localStorage.getItem('toolmate_user') || '{}')?.token;
      const webhookUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tools/proxy/scrape-instagram`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error('Scraping service unavailable');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('This tool requires a configured n8n Webhook. Please ensure your scraping workflow is active.');
      // Mock result for demonstration if needed, but here we stay realistic with error
    } finally {
      setScraping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-4xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center mb-4">
                    <Globe className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Web Scraper</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Extract structured data from any website using AI-powered Puppeteer workflows.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-border shadow-2xl space-y-8 bg-black/10">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="input-field w-full h-14 pl-12 pr-4 text-lg font-medium" />
            
                    </div>
                    <button
            onClick={handleScrape}
            disabled={scraping || !url}
            className="btn-primary h-14 px-8 bg-amber-500 border-none gap-2 min-w-[160px] disabled:opacity-50">
            
                        {scraping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {scraping ? 'Scraping...' : 'Start Scrape'}
                    </button>
                </div>

                <div className="border border-dashed border-border rounded-2xl min-h-[300px] flex items-center justify-center bg-black/5 relative overflow-hidden">
                    {!result && !error && !scraping &&
          <div className="text-center space-y-4 opacity-30 px-6">
                            <Globe className="w-16 h-16 mx-auto" />
                            <h3 className="text-xl font-bold uppercase tracking-widest">Awaiting Command</h3>
                            <p className="max-w-xs mx-auto text-sm">Enter a target URL and click Start Scrape to trigger the n8n logic engine.</p>
                        </div>
          }

                    {scraping &&
          <div className="text-center space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin mx-auto"></div>
                                <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-amber-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">Connecting to n8n Webhook...</h3>
                                <p className="text-sm text-foreground/50">Puppeteer is spinning up a headless browser instance.</p>
                            </div>
                        </div>
          }

                    {error &&
          <div className="p-8 text-center space-y-4">
                            <AlertCircle className="w-12 h-12 text-amber-500/50 mx-auto" />
                            <p className="text-foreground font-medium max-w-sm mx-auto">{error}</p>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left">
                                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Technical Note</p>
                                <p className="text-xs text-foreground/70 leading-relaxed italic">
                                    "This feature leverages a backend Puppeteer node. In production environments, Ensure your n8n workflow is configured to receive POST requests at the specified webhook endpoint."
                                </p>
                            </div>
                        </div>
          }

                    {result &&
          <div className="w-full p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4" /> Scraping Successful
                                </span>
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-lg border border-border hover:bg-black/60 transition-all">
                                    <Download className="w-3 h-3" /> Download JSON
                                </button>
                            </div>
                            <pre className="bg-black/40 p-6 rounded-xl border border-border overflow-auto text-xs font-mono max-h-[400px]">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
          }
                </div>
            </div>
        </motion.div>);

}