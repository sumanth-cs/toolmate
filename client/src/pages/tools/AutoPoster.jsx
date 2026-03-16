import { useState } from 'react';
import { Share2, Link as LinkIcon, CheckCircle2, AlertCircle, Settings2, Power, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AutoPoster() {
  const [accounts, setAccounts] = useState([
  { id: 1, platform: 'Twitter / X', handle: '@toolmate_ai', connected: true, autoPost: true },
  { id: 2, platform: 'LinkedIn', handle: 'ToolMate AI Company', connected: true, autoPost: false },
  { id: 3, platform: 'Instagram', handle: '@toolmate.ai', connected: false, autoPost: false },
  { id: 4, platform: 'Facebook', handle: 'ToolMate AI Official', connected: false, autoPost: false }]
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleConnection = (id) => {
    setAccounts(accounts.map((acc) =>
    acc.id === id ? { ...acc, connected: !acc.connected, autoPost: !acc.connected ? acc.autoPost : false } : acc
    ));
  };

  const toggleAutoPost = (id) => {
    setAccounts(accounts.map((acc) =>
    acc.id === id && acc.connected ? { ...acc, autoPost: !acc.autoPost } : acc
    ));
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Auto Poster Rules</h1>
                        <p className="text-muted-foreground">Manage your connected social accounts and automated posting settings.</p>
                    </div>
                </div>

                <button
          onClick={saveSettings}
          disabled={isSaving}
          className="btn-primary px-6 py-2.5 rounded-xl flex items-center justify-center gap-2">
          
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div className="grid gap-4">
                {accounts.map((acc) =>
        <div key={acc.id} className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all hover:border-brand-500/30">
                        <div className="flex items-center gap-4">
                            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
              acc.connected ? "bg-brand-500/10 text-brand-500" : "bg-muted text-muted-foreground"
            )}>
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    {acc.platform}
                                    {acc.connected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground">{acc.handle}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-background/50 border border-border/50">
                                <span className={cn(
                "text-sm font-semibold transition-colors",
                !acc.connected ? "text-muted-foreground opacity-50" : acc.autoPost ? "text-brand-500" : "text-muted-foreground"
              )}>
                                    Auto-Post Enabled
                                </span>
                                <button
                onClick={() => toggleAutoPost(acc.id)}
                disabled={!acc.connected}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-colors",
                  !acc.connected ? "bg-muted cursor-not-allowed" : acc.autoPost ? "bg-brand-500" : "bg-muted-foreground/30"
                )}>
                
                                    <div className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                  acc.autoPost ? "translate-x-5" : "translate-x-0"
                )} />
                                </button>
                            </div>

                            <button
              onClick={() => toggleConnection(acc.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto",
                acc.connected ?
                "bg-red-500/10 text-red-500 hover:bg-red-500/20" :
                "bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20"
              )}>
              
                                {acc.connected ?
              <><Power className="w-4 h-4" /> Disconnect</> :

              <><LinkIcon className="w-4 h-4" /> Connect</>
              }
                            </button>
                        </div>
                    </div>
        )}
            </div>

            <div className="mt-8 glass-card rounded-2xl p-6 bg-brand-500/5 border-brand-500/20">
                <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-brand-500 shrink-0" />
                    <div>
                        <h4 className="text-base font-bold text-foreground mb-1">About Auto Posting</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            When Auto-post is enabled, ToolMate AI will automatically publish drafts scheduled from the <span className="text-brand-500 font-semibold cursor-pointer">Post Scheduler</span> matching the exact configured parameters. Ensure your target platforms are connected and authenticated above to prevent failed deliveries.
                        </p>
                    </div>
                </div>
            </div>
        </div>);

}