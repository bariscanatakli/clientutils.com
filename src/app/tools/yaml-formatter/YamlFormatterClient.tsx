"use client";

import { useState, useMemo } from "react";
import { formatYaml, YamlFormatMode } from "@/lib/tools/yaml-formatter";
import { CopyButton } from "@/components/ui/CopyButton";

export function YamlFormatterClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<YamlFormatMode>("yaml-to-yaml");
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => formatYaml(input, mode, indent), [input, mode, indent]);

  const placeholderIn = mode === "json-to-yaml" ? '{"key": "value"}' : "key: value";
  const placeholderOut = mode === "yaml-to-json" ? '{"key": "value"}' : "key: value\n";

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">YAML Formatter & Converter</h1>
          <p className="text-sm text-muted mt-2">
            Format YAML, convert YAML to JSON, or JSON to YAML securely in your browser.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as YamlFormatMode)}
            className="text-xs bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="yaml-to-yaml">Format YAML</option>
            <option value="yaml-to-json">YAML to JSON</option>
            <option value="json-to-yaml">JSON to YAML</option>
          </select>

          <div className="flex items-center gap-2 text-xs text-muted">
            <label>Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-input border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
          
          <button 
            onClick={() => setInput("")} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[600px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Input</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={placeholderIn}
          />
          {!result.isValid && input && (
             <div className="absolute bottom-0 left-0 right-0 bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20 backdrop-blur-md">
               Error: {result.error}
             </div>
          )}
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Output</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={placeholderOut}
          />
        </div>
      </div>
    </div>
  );
}
