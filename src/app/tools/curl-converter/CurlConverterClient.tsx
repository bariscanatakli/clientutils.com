"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { convertCurl, type TargetLanguage } from "@/lib/tools/curl-converter";

const SAMPLE_CURL = `curl --request POST "https://api.example.com/v1/users" \\
  --header "Authorization: Bearer YOUR_TOKEN" \\
  --header "Content-Type: application/json" \\
  --data '{"name":"Jane Doe","email":"jane@example.com"}'`;

const TARGETS: { value: TargetLanguage; label: string }[] = [
  { value: "axios", label: "Axios" },
  { value: "fetch", label: "Browser Fetch" },
  { value: "node-fetch", label: "Node Fetch" },
];

export function CurlConverterClient() {
  const [input, setInput] = useState(SAMPLE_CURL);
  const [target, setTarget] = useState<TargetLanguage>("axios");
  const [clipboardError, setClipboardError] = useState("");
  const result = useMemo(() => convertCurl(input, target), [input, target]);

  async function pasteInput() {
    try {
      setInput(await navigator.clipboard.readText());
      setClipboardError("");
    } catch {
      setClipboardError("Clipboard access was blocked. Paste with Ctrl/Cmd+V instead.");
    }
  }

  function downloadCode() {
    if (!result.code) return;
    const url = URL.createObjectURL(new Blob([result.code], { type: "text/javascript;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `curl-${target}.js`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stagger-children mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">cURL to Axios Converter</h1>
          <p className="mt-2 text-sm text-muted">Convert cURL into readable Axios or Fetch code without sending the request anywhere.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div aria-label="Output format" className="flex max-w-full overflow-x-auto rounded-lg border border-border bg-input p-1" role="group">
            {TARGETS.map((option) => (
              <button
                aria-pressed={target === option.value}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors ${target === option.value ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                key={option.value}
                onClick={() => setTarget(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={pasteInput} type="button">Paste</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => setInput(SAMPLE_CURL)} type="button">Load sample</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => setInput("")} type="button">Clear</button>
        </div>
      </div>

      {clipboardError && <p className="text-sm text-danger" role="alert">{clipboardError}</p>}

      <div className="flex flex-col gap-6 lg:grid lg:h-[520px] lg:grid-cols-2">
        <section className="relative flex h-[330px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg lg:h-full" aria-labelledby="curl-input-label">
          <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2">
            <label className="text-xs font-mono text-muted" htmlFor="curl-input" id="curl-input-label">Bash cURL command</label>
          </div>
          <textarea aria-describedby="curl-input-help" className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-code-foreground outline-none" id="curl-input" onChange={(event) => setInput(event.target.value)} placeholder="Paste a cURL command here..." spellCheck={false} value={input} />
          <span className="sr-only" id="curl-input-help">Supports request methods, headers, JSON and form bodies, query parameters, cookies, and basic authentication.</span>
          {result.error && input && <div className="border-t border-danger/20 bg-danger/10 px-4 py-2 text-xs text-danger" role="alert">{result.error}</div>}
        </section>

        <section className="flex h-[330px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg lg:h-full" aria-labelledby="generated-code-label">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2">
            <label className="text-xs font-mono capitalize text-muted" htmlFor="generated-code" id="generated-code-label">{target.replace("-", " ")} code</label>
            <div className="flex items-center gap-2">
              <button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50" disabled={!result.code} onClick={downloadCode} type="button">Download .js</button>
              <CopyButton label="Copy code" size="sm" text={result.code} />
            </div>
          </div>
          <textarea className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-primary outline-none" id="generated-code" placeholder="Generated code will appear here..." readOnly spellCheck={false} value={result.code} />
        </section>
      </div>

      <p className="text-xs text-muted">Privacy: parsing and code generation run entirely in your browser. Commands, URLs, tokens, and request bodies are not uploaded.</p>
    </div>
  );
}
