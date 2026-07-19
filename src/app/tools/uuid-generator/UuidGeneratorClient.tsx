"use client";

import { useState, useEffect, useMemo } from "react";
import { generateIdentifiers, IdentifierType } from "@/lib/tools/uuid-generator";
import { CopyButton } from "@/components/ui/CopyButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function UuidGeneratorClient() {
  const [type, setType] = useState<IdentifierType>("uuid-v4");
  const [count, setCount] = useState<number>(1);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  
  const [results, setResults] = useState<string[]>([]);
  const { copied, copy } = useCopyToClipboard();

  const handleGenerate = () => {
    const ids = generateIdentifiers({ type, count, uppercase, hyphens });
    setResults(ids);
  };

  // Generate on mount or when options change (only if count is small, otherwise wait for button)
  useEffect(() => {
    if (count <= 10) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, count, uppercase, hyphens]);

  const joinedResults = useMemo(() => results.join("\n"), [results]);

  return (
    <div className="stagger-children max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">UUID / ULID Generator</h1>
        <p className="text-sm text-muted mt-2">
          Generate UUIDs (v1, v4, v7) and ULIDs instantly in bulk. All generation happens locally in your browser.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Controls Sidebar */}
        <div className="space-y-6 rounded-xl border border-border bg-card p-5">
          {/* Version Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Format / Versiyon</label>
            <div className="flex flex-col gap-2">
              {[
                { id: "uuid-v4", label: "UUID v4 (Random)" },
                { id: "uuid-v7", label: "UUID v7 (Time-based)" },
                { id: "uuid-v1", label: "UUID v1 (Mac/Time)" },
                { id: "ulid", label: "ULID (Sortable)" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors
                    ${
                      type === opt.id
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:bg-sidebar-hover"
                    }`}
                >
                  <input
                    type="radio"
                    name="identifier-type"
                    value={opt.id}
                    checked={type === opt.id}
                    onChange={(e) => setType(e.target.value as IdentifierType)}
                    className="h-4 w-4 text-primary focus:ring-primary/20 accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="count-slider" className="text-sm font-semibold text-foreground">Üretilecek Adet</label>
              <span className="text-xs font-bold text-primary bg-primary-soft px-2 py-0.5 rounded-md">
                {count}
              </span>
            </div>
            <input
              id="count-slider"
              type="range"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Seçenekler</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                />
                <span className="text-sm text-foreground">Büyük Harf (Uppercase)</span>
              </label>
              <label className={`flex items-center gap-3 cursor-pointer ${type === "ulid" ? "opacity-50 pointer-events-none" : ""}`}>
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  disabled={type === "ulid"}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                />
                <span className="text-sm text-foreground">Tireleri Koru (Hyphens)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground 
                       hover:bg-primary-hover active:scale-97 pressable transition-all"
          >
            Yeniden Üret
          </button>
        </div>

        {/* Results Area */}
        <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-full min-h-[400px]">
          <div className="bg-sidebar border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Üretilen Değerler <span className="text-muted font-normal ml-1">({results.length})</span>
            </h3>
            <button
              onClick={() => copy(joinedResults)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 active:scale-97 pressable
                ${copied ? "bg-success/15 text-success" : "bg-input border border-border hover:bg-sidebar-hover text-foreground"}
              `}
            >
              {copied ? (
                 <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
              ) : (
                <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              )}
              {copied ? "Tümünü Kopyalandı" : "Tümünü Kopyala"}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-code-bg">
            <ul className="space-y-1.5">
              {results.map((id, index) => (
                <li 
                  key={`${id}-${index}`} 
                  className="flex items-center justify-between group rounded px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="font-mono text-sm text-code-foreground break-all">{id}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <CopyButton text={id} size="sm" label="Kopyala" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
