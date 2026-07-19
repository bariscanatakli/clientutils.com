"use client";

import { useState, useMemo } from "react";
import { convertBases, BaseFormat } from "@/lib/tools/number-base";
import { CopyButton } from "@/components/ui/CopyButton";

export function HexConverterClient() {
  const [input, setInput] = useState("Hello World!");
  const [sourceFormat, setSourceFormat] = useState<BaseFormat>("text");

  const results = useMemo(() => convertBases(input, sourceFormat), [input, sourceFormat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, format: BaseFormat) => {
    setSourceFormat(format);
    setInput(e.target.value);
  };

  const getDisplayValue = (format: BaseFormat) => {
    if (format === sourceFormat) return input;
    return results[format] || "";
  };

  const renderCard = (title: string, format: BaseFormat, placeholder: string) => (
    <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[200px] relative transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
      <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
         <span className="text-xs font-mono font-semibold text-foreground">{title}</span>
         <CopyButton text={getDisplayValue(format)} size="sm" label="Kopyala" />
      </div>
      <textarea
         value={getDisplayValue(format)}
         onChange={(e) => handleInputChange(e, format)}
         className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-muted focus:text-primary leading-relaxed break-all transition-colors"
         spellCheck={false}
         placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hex / ASCII / Binary Converter</h1>
          <p className="text-sm text-muted mt-2">
            Type into any box below to instantly convert to all other formats.
          </p>
        </div>
        <button 
          onClick={() => { setInput(""); setSourceFormat("text"); }} 
          className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderCard("Text (ASCII / UTF-8)", "text", "Enter text...")}
        {renderCard("Hexadecimal", "hex", "e.g. 48 65 6c 6c 6f")}
        {renderCard("Binary", "binary", "e.g. 01001000 01100101")}
        {renderCard("Octal", "octal", "e.g. 110 145 154")}
        {renderCard("Decimal", "decimal", "e.g. 72 101 108")}
      </div>
    </div>
  );
}
