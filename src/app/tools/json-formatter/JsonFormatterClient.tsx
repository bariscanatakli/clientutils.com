"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { JsonTree } from "@/components/ui/JsonTree";
import { formatJSON, jsonByteLength, minifyJSON, parseJSON } from "@/lib/tools/json-formatter";

const SAMPLE_JSON = `{
  "project": "ClientUtils",
  "version": 2,
  "private": true,
  "features": ["format", "validate", "minify", "tree"],
  "limits": { "uploadMB": 5, "serverUpload": false }
}`;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
type ViewMode = "formatted" | "minified" | "tree";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function JsonFormatterClient() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState<number | "tab">(2);
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [scrollTop, setScrollTop] = useState(0);
  const [actionError, setActionError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => parseJSON(input), [input]);
  const formatted = useMemo(() => parsed.isValid ? formatJSON(parsed.data, indent) : "", [indent, parsed]);
  const minified = useMemo(() => parsed.isValid ? minifyJSON(parsed.data) : "", [parsed]);
  const output = viewMode === "minified" ? minified : formatted;
  const lines = input.split("\n");
  const inputBytes = jsonByteLength(input);
  const compactBytes = jsonByteLength(minified);
  const savedBytes = parsed.isValid ? Math.max(0, inputBytes - compactBytes) : 0;
  const savedPercent = inputBytes > 0 ? (savedBytes / inputBytes) * 100 : 0;

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
      setActionError("This file is larger than 5 MB. Use a smaller JSON file to keep the browser responsive.");
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
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "application/json;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = viewMode === "minified" ? "data.min.json" : "data.formatted.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function replaceInputWithOutput() {
    if (!output) return;
    setInput(output);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const tab = indent === "tab" ? "\t" : " ".repeat(indent);
    setInput(target.value.slice(0, start) + tab + target.value.slice(end));
    setTimeout(() => {
      if (!textareaRef.current) return;
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tab.length;
    }, 0);
  }

  return (
    <div className="stagger-children mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JSON Formatter, Minifier &amp; Validator</h1>
          <p className="mt-2 text-sm text-muted">Validate, format, compact, inspect, copy, and download JSON entirely in your browser.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted" htmlFor="json-indent">Indent</label>
          <select className="rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20" id="json-indent" onChange={(event) => setIndent(event.target.value === "tab" ? "tab" : Number(event.target.value))} value={indent}>
            <option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value="tab">Tabs</option>
          </select>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={pasteInput} type="button">Paste</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => fileInputRef.current?.click()} type="button">Upload JSON</button>
          <input accept="application/json,.json,.txt" className="hidden" onChange={(event) => loadFile(event.target.files?.[0])} ref={fileInputRef} type="file" />
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(SAMPLE_JSON); setActionError(""); }} type="button">Load sample</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(""); setActionError(""); }} type="button">Clear</button>
        </div>
      </div>

      {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}

      {parsed.isValid && <section aria-label="JSON size comparison" className="grid gap-3 rounded-xl border border-success/20 bg-success/10 p-4 text-sm sm:grid-cols-3">
        <div><span className="text-muted">Current input</span><strong className="ml-2 text-foreground">{formatBytes(inputBytes)}</strong></div>
        <div><span className="text-muted">Compact JSON</span><strong className="ml-2 text-foreground">{formatBytes(compactBytes)}</strong></div>
        <div><span className="text-muted">Whitespace removed</span><strong className="ml-2 text-success">{formatBytes(savedBytes)} ({savedPercent.toFixed(1)}%)</strong></div>
      </section>}

      <div className="flex flex-col gap-6 lg:grid lg:h-[620px] lg:grid-cols-2">
        <section className="relative flex h-[360px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg lg:h-full" aria-labelledby="json-input-heading">
          <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2"><label className="font-mono text-xs text-muted" htmlFor="json-input" id="json-input-heading">JSON input</label><CopyButton label="input JSON" size="sm" text={input} /></div>
          <div className="relative flex flex-1 overflow-hidden">
            <div aria-hidden="true" className="w-12 select-none overflow-hidden border-r border-border bg-sidebar py-4 pr-2 text-right font-mono text-xs text-muted"><div style={{ transform: `translateY(-${scrollTop}px)` }}>{lines.map((_, index) => <div className={`h-[21px] leading-[21px] ${parsed.errorLine === index + 1 ? "bg-danger/10 font-bold text-danger" : ""}`} key={index}>{index + 1}</div>)}</div></div>
            <textarea aria-describedby="json-validation-status" className="flex-1 resize-none whitespace-pre bg-transparent p-4 font-mono text-sm leading-[21px] text-code-foreground outline-none" id="json-input" onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)} placeholder='Paste JSON, for example {"key":"value"}' ref={textareaRef} spellCheck={false} value={input} />
            {parsed.errorLine !== null && <div aria-hidden="true" className="pointer-events-none absolute left-12 right-0 border-l-[3px] border-danger bg-danger/10" style={{ height: "21px", top: `${(parsed.errorLine - 1) * 21 + 16 - scrollTop}px` }} />}
          </div>
          <div aria-live="polite" className={`flex items-center gap-2 border-t px-4 py-2 text-xs font-medium ${parsed.isValid ? "border-success/20 bg-success/10 text-success" : input.trim() ? "border-danger/20 bg-danger/10 text-danger" : "border-border bg-sidebar text-muted"}`} id="json-validation-status">
            {parsed.isValid ? "Valid JSON" : input.trim() ? `${parsed.error ?? "Invalid JSON"}${parsed.errorLine ? ` — line ${parsed.errorLine}${parsed.errorColumn ? `, column ${parsed.errorColumn}` : ""}` : ""}` : "Waiting for JSON input"}
          </div>
        </section>

        <section className="flex h-[360px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg lg:h-full" aria-labelledby="json-output-heading">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2">
            <div className="flex rounded-lg border border-border bg-input p-0.5" role="group" aria-label="JSON output view">
              {(["formatted", "minified", "tree"] as ViewMode[]).map((mode) => <button aria-pressed={viewMode === mode} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${viewMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} key={mode} onClick={() => setViewMode(mode)} type="button">{mode === "minified" ? "Minify / Compact" : mode}</button>)}
            </div>
            <div className="flex items-center gap-2">
              {viewMode !== "tree" && <button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50" disabled={!output} onClick={replaceInputWithOutput} type="button">Use as input</button>}
              {viewMode !== "tree" && <button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50" disabled={!output} onClick={downloadOutput} type="button">Download</button>}
              {viewMode !== "tree" && <CopyButton label={`${viewMode} JSON`} size="sm" text={output} />}
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!input.trim() ? <div className="flex h-full items-center justify-center text-sm text-muted">Waiting for JSON input</div> : !parsed.isValid ? <div className="flex h-full items-center justify-center text-sm text-danger">Fix the validation error to generate output.</div> : viewMode === "tree" ? <JsonTree data={parsed.data} initiallyExpanded /> : <pre className={`font-mono text-sm text-code-foreground ${viewMode === "minified" ? "whitespace-pre-wrap break-all" : "whitespace-pre"}`}>{output}</pre>}
          </div>
        </section>
      </div>

      <p className="text-xs text-muted">Privacy: JSON parsing, formatting, minification, file reading, and size calculation happen locally. Your data is not uploaded. Size values are UTF-8 bytes.</p>
    </div>
  );
}
