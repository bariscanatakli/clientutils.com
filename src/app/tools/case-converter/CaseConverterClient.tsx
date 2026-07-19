"use client";

import { useState, useMemo } from "react";
import { convertCase, CaseFormat } from "@/lib/tools/case-converter";
import { CopyButton } from "@/components/ui/CopyButton";

const FORMATS: CaseFormat[] = [
  "lowercase",
  "uppercase",
  "camelCase",
  "PascalCase",
  "snake_case",
  "kebab-case",
  "CONSTANT_CASE",
  "Title Case"
];

export function CaseConverterClient() {
  const [input, setInput] = useState("hello world, this is a test_string!");
  const [activeFormat, setActiveFormat] = useState<CaseFormat>("camelCase");

  const result = useMemo(() => convertCase(input, activeFormat), [input, activeFormat]);

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Case Converter</h1>
          <p className="text-sm text-muted mt-2">
            Convert strings between camelCase, snake_case, PascalCase, kebab-case, and more.
          </p>
        </div>
        <button 
          onClick={() => setInput("")} 
          className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
        >
          Clear
        </button>
      </div>

      {/* Format Selection Badges */}
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt}
            onClick={() => setActiveFormat(fmt)}
            className={`px-4 py-2 text-xs font-mono rounded-lg border transition-all ${
              activeFormat === fmt 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-card text-foreground border-border hover:border-primary/50"
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[400px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[250px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Original Text</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-5 text-sm font-sans text-foreground whitespace-pre-wrap leading-relaxed"
             spellCheck={false}
             placeholder="Type or paste your text here..."
          />
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[250px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-primary font-semibold">Converted ({activeFormat})</span>
             <CopyButton text={result} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-5 text-sm font-mono text-primary leading-relaxed break-all"
             spellCheck={false}
             placeholder="Converted text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
