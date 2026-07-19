"use client";

import { useState, useMemo } from "react";
import { generateSlug, SlugConfig } from "@/lib/tools/slug-generator";
import { CopyButton } from "@/components/ui/CopyButton";

export function SlugGeneratorClient() {
  const [input, setInput] = useState("This is an Example Article Title! (2026 Edition)");
  const [config, setConfig] = useState<SlugConfig>({
    separator: "-",
    lowercase: true,
    removeStopWords: false
  });

  const output = useMemo(() => generateSlug(input, config), [input, config]);

  return (
    <div className="stagger-children max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Slug Generator</h1>
          <p className="text-sm text-muted mt-2">
            Convert text into SEO-friendly, URL-safe slugs.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Settings */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-wrap gap-6 items-center">
          <div className="space-y-2">
             <label className="text-xs font-semibold text-muted uppercase tracking-wider">Separator</label>
             <div className="flex bg-input border border-border rounded-lg p-1">
               <button
                 onClick={() => setConfig({ ...config, separator: "-" })}
                 className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${config.separator === "-" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
               >
                 Dash (-)
               </button>
               <button
                 onClick={() => setConfig({ ...config, separator: "_" })}
                 className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${config.separator === "_" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
               >
                 Underscore (_)
               </button>
             </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer mt-4 md:mt-0">
             <input 
               type="checkbox" 
               checked={config.lowercase} 
               onChange={(e) => setConfig({ ...config, lowercase: e.target.checked })}
               className="rounded border-border text-primary focus:ring-primary/20 bg-input"
             />
             Force Lowercase
          </label>

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer mt-4 md:mt-0" title="Removes common words like 'the', 'and', 'is' for shorter URLs">
             <input 
               type="checkbox" 
               checked={config.removeStopWords} 
               onChange={(e) => setConfig({ ...config, removeStopWords: e.target.checked })}
               className="rounded border-border text-primary focus:ring-primary/20 bg-input"
             />
             Remove Stop Words
          </label>
        </div>

        {/* Input */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[150px]">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Original Text</span>
             {input && <button onClick={() => setInput("")} className="text-[10px] text-muted hover:text-foreground">Clear</button>}
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-sans text-foreground leading-relaxed"
             spellCheck={false}
             placeholder="Enter article title or text..."
          />
        </div>

        {/* Output */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[150px]">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-primary font-semibold">Generated Slug</span>
             <CopyButton text={output} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={output}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-primary leading-relaxed break-all"
             spellCheck={false}
             placeholder="URL slug will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
