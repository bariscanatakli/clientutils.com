"use client";

import { useState, useMemo } from "react";
import { convertCsvJson, CsvJsonMode } from "@/lib/tools/csv-json";
import { CopyButton } from "@/components/ui/CopyButton";

const DEFAULT_CSV = `id,name,role
1,John Doe,Admin
2,Jane Smith,User
3,"O'Connor, Tom",Manager`;

const DEFAULT_JSON = `[
  {
    "id": "1",
    "name": "John Doe",
    "role": "Admin"
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "role": "User"
  }
]`;

export function CsvJsonClient() {
  const [input, setInput] = useState(DEFAULT_CSV);
  const [mode, setMode] = useState<CsvJsonMode>("csv-to-json");

  const result = useMemo(() => convertCsvJson(input, mode), [input, mode]);

  const handleModeChange = (newMode: CsvJsonMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setInput(newMode === "csv-to-json" ? DEFAULT_CSV : DEFAULT_JSON);
    }
  };

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CSV ↔ JSON Converter</h1>
          <p className="text-sm text-muted mt-2">
            Convert CSV to JSON arrays, or parse JSON arrays back into CSV data tables.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-input border border-border rounded-lg p-1">
             <button
               onClick={() => handleModeChange("csv-to-json")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "csv-to-json" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               CSV to JSON
             </button>
             <button
               onClick={() => handleModeChange("json-to-csv")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "json-to-csv" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               JSON to CSV
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
             <span className="text-xs font-mono text-muted">Input ({mode === 'csv-to-json' ? 'CSV' : 'JSON'})</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={mode === "csv-to-json" ? "id,name\\n1,John" : '[{"id":"1","name":"John"}]'}
          />
          {!result.data && input && result.error && (
             <div className="absolute bottom-0 left-0 right-0 bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20 backdrop-blur-md">
               Error: {result.error}
             </div>
          )}
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-primary font-semibold">Output ({mode === 'csv-to-json' ? 'JSON' : 'CSV'})</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-primary leading-relaxed break-all"
             spellCheck={false}
             placeholder={mode === "csv-to-json" ? '[{"id":"1","name":"John"}]' : "id,name\\n1,John"}
          />
        </div>
      </div>
    </div>
  );
}
