"use client";

import { useState, useMemo } from "react";
import { compareText, DiffMode } from "@/lib/tools/diff-checker";

const DEFAULT_ORIGINAL = `function calculateTotal(price, tax) {
  let total = price + tax;
  return total;
}

console.log(calculateTotal(100, 20));`;

const DEFAULT_MODIFIED = `function calculateTotal(price, tax, discount = 0) {
  const subtotal = price + tax;
  return subtotal - discount;
}

console.log(calculateTotal(100, 20, 10));`;

export function DiffCheckerClient() {
  const [original, setOriginal] = useState(DEFAULT_ORIGINAL);
  const [modified, setModified] = useState(DEFAULT_MODIFIED);
  const [mode, setMode] = useState<DiffMode>("lines");

  const diffResult = useMemo(() => compareText(original, modified, mode), [original, modified, mode]);

  // Statistics
  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    
    diffResult.forEach(part => {
      if (part.added) additions += part.count || 1;
      if (part.removed) deletions += part.count || 1;
    });
    
    return { additions, deletions };
  }, [diffResult]);

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Text Diff Checker</h1>
          <p className="text-sm text-muted mt-2">
            Compare text or code to find differences instantly.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-input rounded-lg p-1 border border-border w-max">
            {(["lines", "words", "chars", "json"] as DiffMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                  mode === m ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => { setOriginal(""); setModified(""); }} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Input Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
        {/* Original */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-danger font-semibold">Original Text</span>
          </div>
          <textarea
             value={original}
             onChange={(e) => setOriginal(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder="Paste original text here..."
          />
        </div>

        {/* Modified */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-success font-semibold">Modified Text</span>
          </div>
          <textarea
             value={modified}
             onChange={(e) => setModified(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder="Paste modified text here..."
          />
        </div>
      </div>

      {/* Diff Result Pane */}
      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden min-h-[300px]">
         <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
           <span className="text-xs font-semibold text-foreground">Diff Result</span>
           
           <div className="flex items-center gap-4 text-xs font-mono font-bold">
             <span className="text-success">+ {stats.additions}</span>
             <span className="text-danger">- {stats.deletions}</span>
           </div>
         </div>
         
         <div className="flex-1 p-4 overflow-auto bg-code-bg">
            {!original && !modified ? (
               <div className="h-full flex items-center justify-center text-muted text-sm">
                 Waiting for input to compare...
               </div>
            ) : (
               <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                 {diffResult.map((part, index) => {
                   const colorClass = part.added 
                     ? "bg-success/20 text-success font-semibold" 
                     : part.removed 
                       ? "bg-danger/20 text-danger font-semibold line-through" 
                       : "text-code-foreground";
                   
                   return (
                     <span key={index} className={colorClass}>
                       {part.value}
                     </span>
                   );
                 })}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
