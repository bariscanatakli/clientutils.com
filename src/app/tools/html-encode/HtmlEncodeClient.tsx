"use client";

import { useState, useMemo } from "react";
import { processHtmlString, HtmlEncodeMode } from "@/lib/tools/html-encode";
import { CopyButton } from "@/components/ui/CopyButton";

export function HtmlEncodeClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<HtmlEncodeMode>("encode");

  const result = useMemo(() => processHtmlString(input, mode), [input, mode]);

  const placeholderIn = mode === "encode" 
    ? '<h1>Hello World</h1>\\n<script>alert("test & demo");</script>' 
    : '&lt;h1&gt;Hello World&lt;/h1&gt;\\n&lt;script&gt;alert(&quot;test &amp; demo&quot;);&lt;/script&gt;';
    
  const placeholderOut = mode === "encode" 
    ? '&lt;h1&gt;Hello World&lt;/h1&gt;\\n&lt;script&gt;alert(&quot;test &amp; demo&quot;);&lt;/script&gt;'
    : '<h1>Hello World</h1>\\n<script>alert("test & demo");</script>';

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">HTML Entity Encode / Decode</h1>
          <p className="text-sm text-muted mt-2">
            Convert special characters to their corresponding HTML entities (e.g. <code>&lt;</code> to <code>&amp;lt;</code>) and vice versa.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-input border border-border rounded-lg p-1">
             <button
               onClick={() => setMode("encode")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "encode" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               Encode
             </button>
             <button
               onClick={() => setMode("decode")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "decode" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               Decode
             </button>
          </div>
          
          <button 
            onClick={() => setInput("")} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[500px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Input ({mode === 'encode' ? 'Raw Text' : 'Encoded Entities'})</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={placeholderIn}
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-primary font-semibold">Output ({mode === 'encode' ? 'Encoded Entities' : 'Raw Text'})</span>
             <CopyButton text={result} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-primary leading-relaxed break-all"
             spellCheck={false}
             placeholder={placeholderOut}
          />
        </div>
      </div>
    </div>
  );
}
