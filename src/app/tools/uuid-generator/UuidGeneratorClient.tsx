"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { generateIdentifiers, inspectIdentifierList, type IdentifierType } from "@/lib/tools/uuid-generator";

const SAMPLE_IDENTIFIERS = `550e8400-e29b-41d4-a716-446655440000
01890f2e-7c5a-7cc3-98c4-dc0c0c07398f
01ARZ3NDEKTSV4RRFFQ69G5FAV
not-an-identifier`;
const MAX_FILE_BYTES = 1024 * 1024;
type Mode = "generate" | "validate";

export function UuidGeneratorClient() {
  const [mode, setMode] = useState<Mode>("generate");
  const [type, setType] = useState<IdentifierType>("uuid-v4");
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [validationInput, setValidationInput] = useState(SAMPLE_IDENTIFIERS);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const timer = window.setTimeout(() => setResults(generateIdentifiers({ type: "uuid-v4", count: 5, uppercase: false, hyphens: true })), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const joinedResults = useMemo(() => results.join("\n"), [results]);
  const inspections = useMemo(() => inspectIdentifierList(validationInput), [validationInput]);
  const validCount = inspections.filter((result) => result.valid).length;

  function handleGenerate() {
    setResults(generateIdentifiers({ type, count, uppercase, hyphens }));
  }

  async function pasteIdentifiers() {
    try {
      setValidationInput(await navigator.clipboard.readText());
      setActionError("");
    } catch {
      setActionError("Clipboard access was blocked. Paste with Ctrl/Cmd+V instead.");
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setActionError("This file is larger than 1 MB. Choose a smaller text file to keep validation responsive.");
      return;
    }
    try {
      setValidationInput(await file.text());
      setActionError("");
    } catch {
      setActionError("The selected file could not be read.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function downloadResults() {
    if (!joinedResults) return;
    const url = URL.createObjectURL(new Blob([joinedResults], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${type}-${results.length}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stagger-children mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">UUID Generator &amp; Validator</h1>
        <p className="mt-2 text-sm text-muted">Generate UUID v1, v4, v7 or ULID batches, then validate and inspect identifiers locally.</p>
      </div>

      <div aria-label="UUID tool mode" className="inline-flex rounded-xl border border-border bg-input p-1" role="group">
        {(["generate", "validate"] as Mode[]).map((item) => <button aria-pressed={mode === item} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${mode === item ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} key={item} onClick={() => setMode(item)} type="button">{item === "generate" ? "Generate" : "Validate & inspect"}</button>)}
      </div>

      {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}

      {mode === "generate" ? (
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <section aria-labelledby="generator-options" className="space-y-6 rounded-xl border border-border bg-card p-5">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground" id="generator-options">Identifier type</h2>
              {[{ id: "uuid-v4", label: "UUID v4 — random" }, { id: "uuid-v7", label: "UUID v7 — time ordered" }, { id: "uuid-v1", label: "UUID v1 — time based" }, { id: "ulid", label: "ULID — sortable" }].map((option) => (
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${type === option.id ? "border-primary bg-primary-soft" : "border-border hover:bg-sidebar-hover"}`} key={option.id}>
                  <input checked={type === option.id} className="h-4 w-4 accent-primary" name="identifier-type" onChange={(event) => setType(event.target.value as IdentifierType)} type="radio" value={option.id} />
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2"><label className="text-sm font-semibold text-foreground" htmlFor="identifier-count">Quantity (1–100)</label><input className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" id="identifier-count" max={100} min={1} onChange={(event) => setCount(Math.min(100, Math.max(1, Number(event.target.value))))} type="number" value={count} /></div>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3"><input checked={uppercase} className="h-4 w-4 accent-primary" onChange={(event) => setUppercase(event.target.checked)} type="checkbox" /><span className="text-sm text-foreground">Uppercase output</span></label>
              <label className={`flex items-center gap-3 ${type === "ulid" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}><input checked={hyphens} className="h-4 w-4 accent-primary" disabled={type === "ulid"} onChange={(event) => setHyphens(event.target.checked)} type="checkbox" /><span className="text-sm text-foreground">Keep UUID hyphens</span></label>
            </div>
            <div className="grid grid-cols-2 gap-2"><button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover" onClick={handleGenerate} type="button">Generate</button><button className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card-hover" onClick={() => { setType("uuid-v4"); setCount(5); setUppercase(false); setHyphens(true); }} type="button">Reset options</button></div>
          </section>

          <section aria-labelledby="generated-heading" className="flex min-h-[430px] flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-3"><h2 className="text-sm font-semibold text-foreground" id="generated-heading">Generated values <span className="font-normal text-muted">({results.length})</span></h2><div className="flex gap-2"><button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-50" disabled={!results.length} onClick={downloadResults} type="button">Download .txt</button><button className="rounded-lg border border-border bg-input px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-sidebar-hover disabled:opacity-50" disabled={!results.length} onClick={() => copy(joinedResults)} type="button">{copied ? "Copied" : "Copy all"}</button></div></div>
            <ul aria-live="polite" className="flex-1 space-y-1.5 overflow-y-auto bg-code-bg p-4">{results.map((id, index) => <li className="flex items-center justify-between gap-3 rounded px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5" key={`${id}-${index}`}><code className="break-all text-sm text-code-foreground">{id}</code><CopyButton label={`identifier ${index + 1}`} size="sm" text={id} /></li>)}</ul>
          </section>
        </div>
      ) : (
        <div className="space-y-5">
          <section aria-labelledby="validator-heading" className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-3"><label className="text-sm font-semibold text-foreground" htmlFor="identifier-input" id="validator-heading">UUID or ULID values</label><div className="flex flex-wrap gap-2"><button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground" onClick={pasteIdentifiers} type="button">Paste</button><button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground" onClick={() => fileInputRef.current?.click()} type="button">Upload .txt</button><input accept=".txt,text/plain" className="hidden" onChange={(event) => loadFile(event.target.files?.[0])} ref={fileInputRef} type="file" /><button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground" onClick={() => setValidationInput(SAMPLE_IDENTIFIERS)} type="button">Load sample</button><button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground" onClick={() => setValidationInput("")} type="button">Clear</button></div></div>
            <textarea aria-describedby="validation-summary" className="min-h-52 w-full resize-y bg-code-bg p-4 font-mono text-sm text-code-foreground outline-none" id="identifier-input" onChange={(event) => setValidationInput(event.target.value)} placeholder="Paste one UUID or ULID per line (commas and spaces also work)" spellCheck={false} value={validationInput} />
            <div aria-live="polite" className="border-t border-border bg-sidebar px-4 py-2 text-xs text-muted" id="validation-summary">{inspections.length ? `${validCount} valid, ${inspections.length - validCount} invalid — showing ${inspections.length} of at most 500 values` : "Enter identifiers to validate"}</div>
          </section>

          <section aria-label="Validation results" className="grid gap-3">{inspections.map((result, index) => <article className={`rounded-xl border p-4 ${result.valid ? "border-success/20 bg-success/10" : "border-danger/20 bg-danger/10"}`} key={`${result.input}-${index}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className={`text-xs font-bold uppercase tracking-wide ${result.valid ? "text-success" : "text-danger"}`}>{result.valid ? result.typeLabel : "Invalid identifier"}</p><code className="mt-1 block break-all text-sm text-foreground">{result.normalized || "(empty)"}</code></div>{result.valid && <CopyButton label={`normalized identifier ${index + 1}`} size="sm" text={result.normalized} />}</div>{result.valid ? <dl className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-3"><div><dt className="font-semibold text-foreground">Family</dt><dd>{result.family?.toUpperCase()}</dd></div><div><dt className="font-semibold text-foreground">Version / variant</dt><dd>{result.version === null ? "—" : `v${result.version}`} · {result.variant}</dd></div><div><dt className="font-semibold text-foreground">Embedded time</dt><dd>{result.timestamp ?? "Not exposed by this format"}</dd></div></dl> : <p className="mt-2 text-sm text-danger">{result.error}</p>}</article>)}</section>
        </div>
      )}

      <p className="text-xs text-muted">Privacy: generation, file reading, normalization, and validation happen in this browser. Values are not uploaded. UUIDs and ULIDs are identifiers, not passwords or secrets.</p>
    </div>
  );
}
