"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { DEFAULT_LINE_SORT_CONFIG, LineSortConfig, processLines } from "@/lib/tools/line-sort";

const SAMPLE_TEXT = `  item10
item2
Item2

  item1  
42
3.5
42
 apple 
Apple`;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function LineSortClient() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [config, setConfig] = useState<LineSortConfig>(DEFAULT_LINE_SORT_CONFIG);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const result = useMemo(() => processLines(input, config), [input, config]);

  function setOption<K extends keyof LineSortConfig>(key: K, value: LineSortConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  async function pasteInput() {
    try {
      setInput(await navigator.clipboard.readText());
      setActionError("");
    } catch {
      setActionError("Clipboard access was blocked. Paste with Ctrl/Cmd+V instead.");
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setActionError("This file is larger than 5 MB. Choose a smaller text file to keep the browser responsive.");
      return;
    }
    try {
      setInput(await file.text());
      setActionError("");
    } catch {
      setActionError("The selected file could not be read.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function downloadOutput() {
    if (!result.output) return;
    const url = URL.createObjectURL(new Blob([result.output], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cleaned-lines.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function applyPreset(preset: "clean" | "natural" | "numeric") {
    if (preset === "clean") setConfig({ ...DEFAULT_LINE_SORT_CONFIG, sortMode: "none" });
    if (preset === "natural") setConfig(DEFAULT_LINE_SORT_CONFIG);
    if (preset === "numeric") setConfig({ ...DEFAULT_LINE_SORT_CONFIG, sortMode: "numeric", caseSensitive: true });
  }

  return (
    <div className="stagger-children mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Line Tools: Trim, Dedupe &amp; Sort Text</h1>
          <p className="mt-2 text-sm text-muted">Clean lists in a predictable order: trim whitespace, remove blanks, keep the first duplicate, then sort or reverse.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={pasteInput} type="button">Paste</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => fileInputRef.current?.click()} type="button">Upload text</button>
          <input accept="text/plain,.txt,.csv,.log" className="hidden" onChange={(event) => loadFile(event.target.files?.[0])} ref={fileInputRef} type="file" />
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(SAMPLE_TEXT); setActionError(""); }} type="button">Load sample</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(""); setActionError(""); }} type="button">Clear</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(SAMPLE_TEXT); setConfig(DEFAULT_LINE_SORT_CONFIG); setActionError(""); }} type="button">Reset</button>
        </div>
      </div>

      {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}

      <section aria-label="Line processing summary" className="grid gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <div><span className="text-muted">Input</span><strong className="ml-2 text-foreground">{result.stats.inputLines}</strong></div>
        <div><span className="text-muted">Output</span><strong className="ml-2 text-foreground">{result.stats.outputLines}</strong></div>
        <div><span className="text-muted">Trimmed</span><strong className="ml-2 text-primary">{result.stats.trimmedLines}</strong></div>
        <div><span className="text-muted">Blanks removed</span><strong className="ml-2 text-primary">{result.stats.emptyLinesRemoved}</strong></div>
        <div><span className="text-muted">Duplicates removed</span><strong className="ml-2 text-primary">{result.stats.duplicatesRemoved}</strong></div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 md:h-[560px] md:grid-cols-2">
          <section aria-labelledby="line-input-label" className="flex h-[340px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg md:h-full">
            <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2"><label className="font-mono text-xs text-muted" htmlFor="line-input" id="line-input-label">Original · {result.stats.inputLines} lines</label><CopyButton label="input lines" size="sm" text={input} /></div>
            <textarea className="flex-1 resize-none whitespace-pre bg-transparent p-4 font-mono text-sm leading-relaxed text-code-foreground outline-none" id="line-input" onChange={(event) => setInput(event.target.value)} placeholder="Paste one value per line…" spellCheck={false} value={input} />
          </section>

          <section aria-labelledby="line-output-label" className="flex h-[340px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg md:h-full">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2"><span className="font-mono text-xs font-semibold text-primary" id="line-output-label">Result · {result.stats.outputLines} lines</span><div className="flex items-center gap-2"><button className="text-xs font-semibold text-muted hover:text-foreground disabled:opacity-50" disabled={!result.output} onClick={() => setInput(result.output)} type="button">Use as input</button><button className="text-xs font-semibold text-muted hover:text-foreground disabled:opacity-50" disabled={!result.output} onClick={downloadOutput} type="button">Download</button><CopyButton label="cleaned lines" size="sm" text={result.output} /></div></div>
            <textarea aria-label="Processed line output" className="flex-1 resize-none whitespace-pre bg-transparent p-4 font-mono text-sm leading-relaxed text-code-foreground outline-none" placeholder="Processed lines appear here…" readOnly spellCheck={false} value={result.output} />
            {config.sortMode === "numeric" && result.stats.nonNumericLines > 0 && <p className="border-t border-warning/20 bg-warning/10 px-4 py-2 text-xs text-foreground" role="status">{result.stats.numericLines} numeric lines sorted first; {result.stats.nonNumericLines} non-numeric lines remain in their original relative order.</p>}
          </section>
        </div>

        <aside aria-label="Line processing options" className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
          <div><h2 className="text-sm font-semibold text-foreground">Quick presets</h2><div className="mt-3 grid grid-cols-3 gap-2"><button className="rounded-lg border border-border bg-input px-2 py-2 text-xs text-foreground hover:bg-card-hover" onClick={() => applyPreset("clean")} type="button">Clean only</button><button className="rounded-lg border border-border bg-input px-2 py-2 text-xs text-foreground hover:bg-card-hover" onClick={() => applyPreset("natural")} type="button">Natural</button><button className="rounded-lg border border-border bg-input px-2 py-2 text-xs text-foreground hover:bg-card-hover" onClick={() => applyPreset("numeric")} type="button">Numbers</button></div></div>

          <label className="grid gap-1 text-xs font-semibold text-muted" htmlFor="trim-mode">1. Trim whitespace
            <select className="rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal text-foreground" id="trim-mode" onChange={(event) => setOption("trimMode", event.target.value as LineSortConfig["trimMode"])} value={config.trimMode}><option value="none">Do not trim</option><option value="both">Both sides</option><option value="start">Start only</option><option value="end">End only</option></select>
          </label>
          <div className="space-y-3"><p className="text-xs font-semibold text-muted">2. Filter</p>
            <label className="flex items-center gap-2 text-sm text-foreground"><input checked={config.removeEmptyLines} onChange={(event) => setOption("removeEmptyLines", event.target.checked)} type="checkbox" />Remove blank lines</label>
            <label className="flex items-center gap-2 text-sm text-foreground"><input checked={config.removeDuplicates} onChange={(event) => setOption("removeDuplicates", event.target.checked)} type="checkbox" />Remove duplicates</label>
            <label className="flex items-center gap-2 text-sm text-foreground"><input checked={config.caseSensitive} onChange={(event) => setOption("caseSensitive", event.target.checked)} type="checkbox" />Case-sensitive compare</label>
          </div>
          <div className="space-y-3"><p className="text-xs font-semibold text-muted">3. Order</p>
            <select aria-label="Sort method" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground" onChange={(event) => setOption("sortMode", event.target.value as LineSortConfig["sortMode"])} value={config.sortMode}><option value="none">Keep original order</option><option value="alphabetical">Alphabetical</option><option value="natural">Natural (item2 before item10)</option><option value="numeric">Numeric values first</option></select>
            {config.sortMode !== "none" ? <select aria-label="Sort direction" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground" onChange={(event) => setOption("sortDirection", event.target.value as LineSortConfig["sortDirection"])} value={config.sortDirection}><option value="asc">Ascending</option><option value="desc">Descending</option></select> : <label className="flex items-center gap-2 text-sm text-foreground"><input checked={config.reverseLines} onChange={(event) => setOption("reverseLines", event.target.checked)} type="checkbox" />Reverse original order</label>}
          </div>
          <label className="grid gap-1 text-xs font-semibold text-muted" htmlFor="line-ending">Output line endings
            <select className="rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal text-foreground" id="line-ending" onChange={(event) => setOption("lineEnding", event.target.value as LineSortConfig["lineEnding"])} value={config.lineEnding}><option value="lf">LF — Unix/macOS</option><option value="crlf">CRLF — Windows</option></select>
          </label>
        </aside>
      </div>

      <p className="text-xs text-muted">Privacy: text processing, file reading, copying, and downloads happen locally in this browser. Nothing is uploaded. Files are limited to 5 MB for browser responsiveness.</p>
    </div>
  );
}
