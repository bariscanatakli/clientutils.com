"use client";

import { useState, useMemo } from "react";
import { analyzeText } from "@/lib/tools/word-counter";

export function WordCounterClient() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => analyzeText(input), [input]);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Word & Character Counter</h1>
          <p className="text-sm text-muted mt-2">
            Analyze text metrics instantly. Works completely offline.
          </p>
        </div>
        
        <button 
          onClick={() => setInput("")} 
          className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
        >
          Clear Text
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Words" value={stats.words} highlight />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="Chars (no space)" value={stats.charactersNoSpaces} />
        <StatCard label="Sentences/Lines" value={stats.lines} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Reading Time" value={`${stats.readingTimeMinutes} min`} />
      </div>

      {/* Editor Area */}
      <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[400px]">
        <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
           <span className="text-xs font-mono text-muted">Paste your text below</span>
        </div>
        <textarea
           value={input}
           onChange={(e) => setInput(e.target.value)}
           className="flex-1 resize-none bg-transparent outline-none p-5 text-sm font-sans text-foreground whitespace-pre-wrap leading-relaxed"
           spellCheck={true}
           placeholder="Start typing or paste your document here..."
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${highlight ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border text-foreground'}`}>
      <span className="text-2xl font-bold font-mono tracking-tight">{value}</span>
      <span className={`text-xs mt-1 font-medium uppercase tracking-wider ${highlight ? 'text-primary/80' : 'text-muted'}`}>{label}</span>
    </div>
  );
}
