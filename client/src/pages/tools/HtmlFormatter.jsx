import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Trash2, Copy, Check, Sparkles, FileCode } from 'lucide-react';
import { html as beautifyHtml } from 'js-beautify';

export default function HtmlFormatter() {
  const [input, setInput] = useState('<div><ul><li>Item 1</li><li>Item 2</li></ul></div>');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(4);
  const [copied, setCopied] = useState(false);

  const formatCode = () => {
    const options = {
      indent_size: indentSize,
      indent_char: ' ',
      max_preserve_newlines: 5,
      preserve_newlines: true,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_inner_html: true,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    };
    const result = beautifyHtml(input, options);
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-6xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
                    <FileCode className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">HTML Formatter</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Beautify and structure your messy HTML code for better readability.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Input HTML</label>
                        <button onClick={() => setInput('')} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[500px] bg-black/10 border border-border rounded-2xl p-6 font-mono text-sm outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            placeholder="Paste your messy HTML here..." />
          
                    <div className="flex gap-4">
                        <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="bg-black/20 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500">
              
                            <option value={2}>2 Spaces Indent</option>
                            <option value={4}>4 Spaces Indent</option>
                            <option value={8}>8 Spaces Indent</option>
                        </select>
                        <button
              onClick={formatCode}
              className="btn-primary flex-1 bg-indigo-500 border-none h-14 uppercase font-black tracking-widest gap-2">
              
                            <Sparkles className="w-5 h-5" /> Format Code
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Structured Output</label>
                        <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-2 text-xs font-bold text-indigo-500 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest disabled:opacity-30">
              
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy HTML'}
                        </button>
                    </div>
                    <div className="w-full h-[500px] bg-black/20 border border-border rounded-2xl p-6 font-mono text-sm overflow-auto leading-relaxed relative group">
                        {output ?
            <pre className="text-indigo-400 whitespace-pre-wrap">{output}</pre> :

            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                                <Code className="w-12 h-12" />
                                <p className="font-bold uppercase tracking-widest">Click Format to see result</p>
                            </div>
            }
                    </div>
                </div>
            </div>
        </motion.div>);

}