import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Sparkles, Send, Bot } from "lucide-react";
import { useGeminiAPI } from "../../hooks/useGeminiAPI";
import ReactMarkdown from "react-markdown";

export default function DocumentQA() {
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const { generateContent, isLoading, error } = useGeminiAPI();

  const askQuestion = async (e) => {
    if (e) e.preventDefault();
    if (!context.trim() || !question.trim() || isLoading) return;

    const userQuestion = question;
    setQuestion("");
    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: userQuestion },
    ];
    setMessages(newMessages);

    // Build prompt with history
    const chatHistory = newMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");
    const prompt = `
        You are an intelligent Document Q&A Assistant.
        
        ### Source Document:
        """${context}"""
        
        ### Chat History:
        ${chatHistory}
        
        ### Instructions:
        Answer the User's latest question USING ONLY the provided Source Document. 
        If the answer is not in the document, politely say: "I cannot find the answer to this in the provided document."
        Do not make up facts. Be concise and helpful. Format beautifully using Markdown.
        
        Answer the final question now.
        `;

    try {
      const response = await generateContent(prompt);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: response },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Document Q&A
            </h1>
            <p className="text-muted-foreground">
              Paste any long document and chat with it to extract answers
              instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 h-[700px]">
        {/* Context Section */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col h-full">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-brand-500" />
            Source Document Context
          </h3>

          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Paste your long document, contract, manual, or article here... The AI will use this text as its only source of truth."
            className="flex-1 w-full p-4 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground shadow-sm"
          />

          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            Your text is processed entirely locally in your browser.
          </p>
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 text-center px-6">
                <Bot className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">
                  Hello! I'm your Document Assistant.
                </p>
                <p className="text-xs mt-2 opacity-60 max-w-sm">
                  Paste a document on the left, then ask me anything about it
                  here. I'll search the text and give you exact answers.
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-brand-500" />
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-2xl max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-brand-500 text-white rounded-tr-sm"
                          : "bg-background border border-input text-foreground rounded-tl-sm prose prose-sm dark:prose-invert"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm m-0">{msg.content}</p>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-brand-500" />
                    </div>
                    <div className="p-4 rounded-2xl bg-background border border-input rounded-tl-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground animate-pulse">
                        Searching document...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={askQuestion} className="relative mt-auto">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={!context.trim() || isLoading}
              placeholder="Ask a question about the document..."
              className="w-full py-4 pl-4 pr-14 rounded-2xl bg-background border border-input focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-sm disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!question.trim() || !context.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-brand-500 text-white disabled:bg-muted-foreground/20 hover:bg-brand-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
