"use client";

import { useState, useMemo } from "react";
import { encodeUrl, decodeUrl } from "@/lib/tools/url-encoder";
import { CopyButton } from "@/components/ui/CopyButton";

export function UrlEncoderClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const result = useMemo(() => {
    if (mode === "encode") {
      return { data: encodeUrl(input), error: null };
    } else {
      return decodeUrl(input);
    }
  }, [input, mode]);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">URL Encoder & Decoder</h1>
          <p className="text-sm text-muted mt-2">
            Safely encode or decode URLs and parameters. Instant and completely offline.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-input rounded-lg p-1 border border-border w-max">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "encode" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "decode" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 h-[400px]">
        {/* Input */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">{mode === "encode" ? "Plain URL String" : "Encoded URL String"}</span>
             {input && <button onClick={() => setInput("")} className="text-[10px] text-muted hover:text-foreground">Clear</button>}
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground break-all leading-relaxed"
             spellCheck={false}
             placeholder={mode === "encode" ? "e.g. https://example.com/?q=hello world!" : "e.g. https%3A%2F%2Fexample.com%2F%3Fq%3Dhello%20world!"}
          />
          {mode === "decode" && result.error && (
            <div className="bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20">
              Hata: {result.error}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">{mode === "encode" ? "Encoded URL String" : "Plain URL String"}</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground break-all leading-relaxed"
             spellCheck={false}
             placeholder="Output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
