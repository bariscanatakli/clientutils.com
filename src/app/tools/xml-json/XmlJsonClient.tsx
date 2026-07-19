"use client";

import { useState, useMemo } from "react";
import { convertXmlToJson, convertJsonToXml } from "@/lib/tools/xml-json";
import { CopyButton } from "@/components/ui/CopyButton";

export function XmlJsonClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"xml2json" | "json2xml">("xml2json");
  const [compact, setCompact] = useState(true);

  const result = useMemo(() => {
    if (mode === "xml2json") {
      return convertXmlToJson(input, compact);
    } else {
      return convertJsonToXml(input, compact);
    }
  }, [input, mode, compact]);

  const handleSwap = () => {
    if (result.isValid && result.data) {
      setInput(result.data);
    }
    setMode(mode === "xml2json" ? "json2xml" : "xml2json");
  };

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">XML ↔ JSON Converter</h1>
          <p className="text-sm text-muted mt-2">
            Convert data securely between XML and JSON formats in your browser.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input 
              type="checkbox" 
              checked={compact} 
              onChange={(e) => setCompact(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary/20 bg-input"
            />
            Compact Mode
          </label>
          
          <button 
            onClick={() => setInput("")} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] gap-4 lg:h-[600px] items-stretch lg:items-center">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">{mode === "xml2json" ? "input.xml" : "input.json"}</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={`Paste your ${mode === "xml2json" ? "XML" : "JSON"} here...`}
          />
          {!result.isValid && input && (
             <div className="bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20">
               Hata: {result.error}
             </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleSwap}
            className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary-hover active:scale-90 transition-all shadow-lg hover:shadow-primary/25 z-10"
            title="Swap Formats"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">{mode === "xml2json" ? "output.json" : "output.xml"}</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder="Converted result..."
          />
        </div>
      </div>
    </div>
  );
}
