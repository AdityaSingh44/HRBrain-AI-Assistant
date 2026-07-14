/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Zap,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Clock,
  ArrowRight,
  ClipboardList,
  FileCheck2,
  Trash2
} from 'lucide-react';

interface AiAssistantViewProps {
  onAskAi: (query: string) => Promise<string>;
  chatHistory: { sender: 'user' | 'ai'; text: string; timestamp: string }[];
  onClearHistory: () => void;
}

export default function AiAssistantView({
  onAskAi,
  chatHistory,
  onClearHistory
}: AiAssistantViewProps) {
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  // Suggestion Prompts list
  const SUGGESTIONS = [
    { text: 'Who is absent or late today?', icon: Clock },
    { text: 'What are the main rules in the corporate leave policies?', icon: ClipboardList },
    { text: 'Which employees have pending leave requests?', icon: FileCheck2 },
    { text: 'How many employees work in Engineering?', icon: HelpCircle }
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.length, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || loading) return;

    const userQ = queryInput;
    setQueryInput('');
    setLoading(true);

    try {
      await onAskAi(userQ);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (text: string) => {
    if (loading) return;
    setLoading(true);
    try {
      await onAskAi(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden" id="ai-assistant-panel">
      
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-slate-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bot size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-black font-mono tracking-wider text-indigo-400 block uppercase">AI RAG COGNITIVE CO-PILOT</span>
            <h3 className="text-base font-black text-white mt-0.5 font-display">HRBrain AI Cognitive Hub</h3>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-rose-950/20 border border-slate-700 hover:border-rose-900/30 rounded-lg font-bold transition-all"
          id="clear-ai-history"
        >
          <Trash2 size={13} />
          <span>Clear logs</span>
        </button>
      </div>

      {/* Chat scroll feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[calc(100vh-270px)] scrollbar-thin bg-slate-50/20">
        {chatHistory.length === 0 ? (
          <div className="max-w-xl mx-auto py-12 space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 font-black bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 font-mono">
                <Sparkles size={12} className="animate-spin" />
                <span>RAG Augmented AI Engine</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">How can I assist you with enterprise operations?</h2>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Ask anything regarding employees, leaves, attendance, payroll formulas, or contract letters. All processed safely in server-side sandboxes.
              </p>
            </div>

            {/* Suggestions buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" id="ai-suggestions-grid">
              {SUGGESTIONS.map(sug => {
                const Icon = sug.icon;
                return (
                  <button
                    key={sug.text}
                    onClick={() => handleSuggestionClick(sug.text)}
                    className="p-4 text-left border border-slate-200 bg-white hover:bg-slate-50 rounded-2xl shadow-sm transition-all group flex items-start gap-3 cursor-pointer"
                  >
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-normal group-hover:text-indigo-600 font-display transition-colors">
                        {sug.text}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono font-bold">
                        <span>Query database</span>
                        <ArrowRight size={10} />
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((item, idx) => {
              const isAi = item.sender === 'ai';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white ${
                    isAi ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}>
                    {isAi ? <Bot size={16} /> : <span className="text-[10px] font-black">ME</span>}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-mono font-bold block">
                      {isAi ? 'HRBrain AI Co-pilot' : 'User Session'} • {item.timestamp}
                    </span>
                    
                    {/* Render message body nicely */}
                    <div className={`p-4 text-xs rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isAi
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-sans font-bold shadow-sm'
                        : 'bg-slate-900 text-white rounded-tr-none shadow-sm font-bold'
                    }`}>
                      {item.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Loading animation bubble */}
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <RefreshCw size={14} className="animate-spin" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-mono font-bold block">Thinking...</span>
                  <div className="p-4 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>Analyzing system records...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask HRBrain AI... (e.g. Who is late today?)"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          disabled={loading}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-45"
          id="ai-query-input"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl text-xs font-black transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-950/5 font-display tracking-tight"
          id="ai-submit-btn"
        >
          <Send size={14} />
          <span>Dispatch</span>
        </button>
      </form>

    </div>
  );
}
