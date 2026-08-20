"use client";

import { useState, useMemo } from "react";
import { processLines, LineSortConfig } from "@/lib/tools/line-sort";
import { CopyButton } from "@/components/ui/CopyButton";

const DEFAULT_TEXT = `Apple
Banana
Orange

apple
Grape
Banana
Mango`;

export function LineSortClient() {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [config, setConfig] = useState<LineSortConfig>({
    sortOrder: "none",
    removeDuplicates: true,
    removeEmptyLines: true,
    caseSensitive: false,
    reverseLines: false,
  });

  const result = useMemo(() => processLines(input, config), [input, config]);

  const originalCount = input ? input.split(/\\r?\\n/).length : 0;
  const resultCount = result ? result.split(/\\r?\\n/).length : 0;

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sort Lines & Remove Duplicates</h1>
          <p className="text-sm text-muted mt-2">
            Clean up text lists by sorting alphabetically, removing duplicates, and deleting empty lines.
          </p>
        </div>
        <button 
          onClick={() => setInput("")} 
          className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
        >
          Clear Text
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Editor Area */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:h-[500px]">
          {/* Input Pane */}
          <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] md:h-full">
            <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
               <span className="text-xs font-mono text-muted">Original ({originalCount} lines)</span>
            </div>
            <textarea
               value={input}
               onChange={(e) => setInput(e.target.value)}
               className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-sans text-foreground whitespace-pre leading-relaxed"
               spellCheck={false}
               placeholder="Paste your list here..."
            />
          </div>

          {/* Output Pane */}
          <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] md:h-full relative">
            <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
               <span className="text-xs font-mono text-primary font-semibold">Result ({resultCount} lines)</span>
               <CopyButton text={result} size="sm" label="Kopyala" />
            </div>
            <textarea
               value={result}
               readOnly
               className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-sans text-primary leading-relaxed break-all"
               spellCheck={false}
               placeholder="Processed list will appear here..."
            />
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">Processing Options</h3>
          
          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-xs font-semibold text-muted uppercase tracking-wider">Sort Order</label>
               <select 
                 value={config.sortOrder}
                 onChange={(e) => setConfig({...config, sortOrder: e.target.value as LineSortConfig["sortOrder"]})}
                 className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
               >
                 <option value="none">Original Order</option>
                 <option value="asc">A to Z (Ascending)</option>
                 <option value="desc">Z to A (Descending)</option>
               </select>
             </div>

             <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={config.removeDuplicates} 
                 onChange={(e) => setConfig({ ...config, removeDuplicates: e.target.checked })}
                 className="rounded border-border text-primary focus:ring-primary/20 bg-input"
               />
               <span className="group-hover:text-primary transition-colors">Remove Duplicates</span>
             </label>

             <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={config.removeEmptyLines} 
                 onChange={(e) => setConfig({ ...config, removeEmptyLines: e.target.checked })}
                 className="rounded border-border text-primary focus:ring-primary/20 bg-input"
               />
               <span className="group-hover:text-primary transition-colors">Remove Empty Lines</span>
             </label>

             <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={config.caseSensitive} 
                 onChange={(e) => setConfig({ ...config, caseSensitive: e.target.checked })}
                 className="rounded border-border text-primary focus:ring-primary/20 bg-input"
               />
               <span className="group-hover:text-primary transition-colors">Case Sensitive</span>
             </label>

             <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={config.reverseLines} 
                 disabled={config.sortOrder !== "none"}
                 onChange={(e) => setConfig({ ...config, reverseLines: e.target.checked })}
                 className="rounded border-border text-primary focus:ring-primary/20 bg-input disabled:opacity-50"
               />
               <span className={`transition-colors ${config.sortOrder !== "none" ? "text-muted opacity-50" : "group-hover:text-primary"}`}>
                 Reverse Lines
               </span>
             </label>
          </div>
        </div>
      </div>
    </div>
  );
}
