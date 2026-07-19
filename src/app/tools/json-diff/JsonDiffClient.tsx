"use client";

import { useState, useMemo } from "react";
import { compareJson } from "@/lib/tools/json-diff";

const DEFAULT_ORIGINAL = `{
  "name": "John Doe",
  "age": 30,
  "skills": ["JavaScript", "React"]
}`;

const DEFAULT_MODIFIED = `{
  "name": "John Doe",
  "age": 31,
  "skills": ["JavaScript", "React", "Next.js"],
  "active": true
}`;

export function JsonDiffClient() {
  const [original, setOriginal] = useState(DEFAULT_ORIGINAL);
  const [modified, setModified] = useState(DEFAULT_MODIFIED);

  const diffResult = useMemo(() => compareJson(original, modified), [original, modified]);

  // JSON Error state
  const isError = useMemo(() => {
    try {
      if (original) JSON.parse(original);
      if (modified) JSON.parse(modified);
      return false;
    } catch {
      return true;
    }
  }, [original, modified]);

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JSON Compare & Diff</h1>
          <p className="text-sm text-muted mt-2">
            Compare two JSON objects structure-wise. Ignores formatting differences like spaces or tabs.
          </p>
        </div>

        <button 
          onClick={() => { setOriginal(""); setModified(""); }} 
          className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
        >
          Clear All
        </button>
      </div>

      {isError && (
        <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ Invalid JSON detected. Falling back to standard line-by-line text diff.
        </div>
      )}

      {/* Input Panes */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[300px]">
        {/* Original */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[250px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-danger font-semibold">Original JSON</span>
          </div>
          <textarea
             value={original}
             onChange={(e) => setOriginal(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder="Paste original JSON here..."
          />
        </div>

        {/* Modified */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[250px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-success font-semibold">Modified JSON</span>
          </div>
          <textarea
             value={modified}
             onChange={(e) => setModified(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder="Paste modified JSON here..."
          />
        </div>
      </div>

      {/* Diff Result Pane */}
      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden min-h-[350px]">
         <div className="bg-sidebar border-b border-border px-4 py-3 flex items-center justify-between shadow-sm z-10">
           <span className="text-xs font-semibold text-foreground">Structural Differences</span>
         </div>
         
         <div className="flex-1 p-6 overflow-auto bg-[#0d1117]">
            {!original && !modified ? (
               <div className="h-full flex items-center justify-center text-muted text-sm">
                 Waiting for JSON inputs to compare...
               </div>
            ) : (
               <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all m-0">
                 {diffResult.map((part, index) => {
                   const bgClass = part.added 
                     ? "bg-[#2ea04326]" 
                     : part.removed 
                       ? "bg-[#f8514926]" 
                       : "bg-transparent";
                       
                   const textClass = part.added 
                     ? "text-[#3fb950]" 
                     : part.removed 
                       ? "text-[#ff7b72]" 
                       : "text-[#c9d1d9]";
                       
                   const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
                   
                   // Diff outputs multi-line strings, we split them to add prefixes cleanly
                   const lines = part.value.split('\n');
                   // If the last line is empty (due to trailing newline), drop it to avoid blank diff rows
                   if (lines[lines.length - 1] === '') lines.pop();

                   return lines.map((line, i) => (
                     <div key={`${index}-${i}`} className={`px-4 py-0.5 w-full flex ${bgClass} ${textClass}`}>
                       <span className="select-none inline-block w-4 opacity-50 mr-2">{prefix}</span>
                       <span>{line}</span>
                     </div>
                   ));
                 })}
               </pre>
            )}
         </div>
      </div>
    </div>
  );
}
