import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Send, Plus, Trash2, Loader2, Code } from 'lucide-react';
import axios from 'axios';

export default function ApiTester() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('headers');

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);

    const headerObj = headers.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {});

    try {
      const res = await axios({
        method,
        url,
        data: method !== 'GET' && body ? JSON.parse(body) : undefined,
        headers: headerObj,
        timeout: 5000
      });
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        time: 'unknown' // Axios doesn't provide timing natively easily without interceptors
      });
    } catch (err) {
      setResponse({
        status: err.response?.status || 'ERROR',
        statusText: err.message,
        data: err.response?.data || { error: err.message },
        headers: err.response?.headers || {}
      });
    } finally {
      setLoading(false);
    }
  };

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (i) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i, field, val) => {
    const newHeaders = [...headers];
    newHeaders[i][field] = val;
    setHeaders(newHeaders);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-6xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">API Tester Pro</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Debug and test RESTful APIs instantly from your browser.</p>
            </div>

            <div className="glass-card rounded-3xl border border-border shadow-2xl overflow-hidden bg-black/10 flex flex-col">
                {/* URL Bar */}
                <div className="p-6 border-b border-border bg-black/20 flex gap-4">
                    <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm outline-none ${
            method === 'GET' ? 'text-emerald-500' :
            method === 'POST' ? 'text-amber-500' :
            'text-red-500'}`
            }>
            
                        {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500 text-foreground/80"
            placeholder="Enter API Endpoint URL" />
          
                    <button
            onClick={sendRequest}
            disabled={loading || !url}
            className="btn-primary h-14 px-8 bg-indigo-500 border-none gap-2 min-w-[140px] disabled:opacity-50">
            
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {loading ? 'Sending' : 'Send'}
                    </button>
                </div>

                <div className="flex h-[500px]">
                    {/* Request Pane */}
                    <div className="w-1/2 border-r border-border flex flex-col">
                        <div className="flex border-b border-border bg-black/10">
                            {['headers', 'body'].map((tab) =>
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' : 'border-transparent text-foreground/40 hover:text-foreground'}`
                }>
                
                                    {tab}
                                </button>
              )}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeTab === 'headers' &&
              <div className="space-y-4">
                                    {headers.map((h, i) =>
                <div key={i} className="flex gap-2">
                                            <input
                    placeholder="Key"
                    value={h.key}
                    onChange={(e) => updateHeader(i, 'key', e.target.value)}
                    className="flex-1 bg-black/20 border border-border rounded-lg px-3 py-2 text-xs font-mono outline-none" />
                  
                                            <input
                    placeholder="Value"
                    value={h.value}
                    onChange={(e) => updateHeader(i, 'value', e.target.value)}
                    className="flex-1 bg-black/20 border border-border rounded-lg px-3 py-2 text-xs font-mono outline-none" />
                  
                                            <button onClick={() => removeHeader(i)} className="text-red-500/50 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                )}
                                    <button onClick={addHeader} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-500/10 px-3 py-2 rounded-lg transition-all">
                                        <Plus className="w-3 h-3" /> Add Header
                                    </button>
                                </div>
              }
                            {activeTab === 'body' &&
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-full bg-black/20 border border-border rounded-xl p-4 font-mono text-xs outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder='{ "key": "value" }' />

              }
                        </div>
                    </div>

                    {/* Response Pane */}
                    <div className="w-1/2 flex flex-col bg-black/20">
                        <div className="h-10 border-b border-border bg-black/40 flex items-center justify-between px-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Response</span>
                            {response &&
              <div className="flex gap-3">
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${response.status >= 200 && response.status < 300 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        Status: {response.status}
                                    </span>
                                </div>
              }
                        </div>
                        <div className="flex-1 p-6 overflow-auto bg-grid-white/[0.02]">
                            {response ?
              <pre className="text-xs font-mono text-indigo-300 leading-relaxed tabular-nums">
                                    {JSON.stringify(response.data, null, 2)}
                                </pre> :

              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                                    <Code className="w-12 h-12" />
                                    <p className="font-bold uppercase tracking-widest">Send request to see data</p>
                                </div>
              }
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>);

}