"use client";

import { useState, useMemo } from "react";
import { convertTomlJson, TomlJsonMode } from "@/lib/tools/toml-json";
import { CopyButton } from "@/components/ui/CopyButton";

const DEFAULT_TOML = `# This is a TOML document

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00

[database]
server = "192.168.1.1"
ports = [ 8000, 8001, 8002 ]
connection_max = 5000
enabled = true`;

const DEFAULT_JSON = `{
  "title": "TOML Example",
  "owner": {
    "name": "Tom Preston-Werner",
    "dob": "1979-05-27T15:32:00.000Z"
  },
  "database": {
    "server": "192.168.1.1",
    "ports": [
      8000,
      8001,
      8002
    ],
    "connection_max": 5000,
    "enabled": true
  }
}`;

export function TomlJsonClient() {
  const [input, setInput] = useState(DEFAULT_TOML);
  const [mode, setMode] = useState<TomlJsonMode>("toml-to-json");

  const result = useMemo(() => convertTomlJson(input, mode), [input, mode]);

  const handleModeChange = (newMode: TomlJsonMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setInput(newMode === "toml-to-json" ? DEFAULT_TOML : DEFAULT_JSON);
    }
  };

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">TOML ↔ JSON Converter</h1>
          <p className="text-sm text-muted mt-2">
            Convert TOML configuration files to JSON, or parse JSON back into TOML format.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-input border border-border rounded-lg p-1">
             <button
               onClick={() => handleModeChange("toml-to-json")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "toml-to-json" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               TOML to JSON
             </button>
             <button
               onClick={() => handleModeChange("json-to-toml")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "json-to-toml" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               JSON to TOML
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

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[600px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Input ({mode === 'toml-to-json' ? 'TOML' : 'JSON'})</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={mode === "toml-to-json" ? 'title = "Example"' : '{"title": "Example"}'}
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
             <span className="text-xs font-mono text-primary font-semibold">Output ({mode === 'toml-to-json' ? 'JSON' : 'TOML'})</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-primary leading-relaxed break-all"
             spellCheck={false}
             placeholder={mode === "toml-to-json" ? '{"title": "Example"}' : 'title = "Example"'}
          />
        </div>
      </div>
    </div>
  );
}
