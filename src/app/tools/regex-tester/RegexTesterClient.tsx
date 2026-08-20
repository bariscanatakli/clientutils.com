"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileText, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { MAX_REGEX_INPUT_BYTES, runRegexSafely, type RegexTestResult } from "@/lib/tools/regex-tester";

const INITIAL_PATTERN = "(?<user>[a-zA-Z0-9._%+-]+)@(?<domain>[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})";
const INITIAL_TEXT = `Contact ada@example.com or grace@clientutils.com.
Order IDs: ORD-1042, ORD-2048.`;
const EMPTY_RESULT: RegexTestResult = { isValid: true, error: null, matches: [], replacement: "", execTimeMs: 0, truncated: false };
const fieldClass = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const patterns = [
  { label: "Email", pattern: INITIAL_PATTERN, flags: "gi", text: INITIAL_TEXT },
  { label: "Named date", pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})", flags: "g", text: "Released 2026-08-20; previous build 2026-08-19.", replacement: "$<day>/$<month>/$<year>" },
  { label: "Order ID", pattern: "\\bORD-(\\d{4})\\b", flags: "g", text: "ORD-1042, draft-1, ORD-2048", replacement: "order:$1" },
  { label: "Repeated spaces", pattern: "[ \\t]+", flags: "g", text: "alpha    beta\tgamma", replacement: " " },
];
const flags = [{ id: "g", label: "Global" }, { id: "i", label: "Ignore case" }, { id: "m", label: "Multiline" }, { id: "s", label: "DotAll" }, { id: "u", label: "Unicode" }];

export function RegexTesterClient() {
  const [pattern, setPattern] = useState(INITIAL_PATTERN);
  const [activeFlags, setActiveFlags] = useState("gi");
  const [text, setText] = useState(INITIAL_TEXT);
  const [replacement, setReplacement] = useState("$<user> at $<domain>");
  const [mode, setMode] = useState<"match" | "replace">("match");
  const [result, setResult] = useState<RegexTestResult>(EMPTY_RESULT);
  const [running, setRunning] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cleanupTask: () => void = () => undefined;
    const timer = window.setTimeout(() => {
      setRunning(true);
      const task = runRegexSafely({ pattern, flags: activeFlags, text, replacement });
      task.promise.then((next) => { setResult(next); setRunning(false); });
      cleanupTask = task.cancel;
    }, 120);
    return () => { clearTimeout(timer); cleanupTask(); };
  }, [pattern, activeFlags, text, replacement]);

  const highlighted = useMemo(() => {
    if (!result.isValid || !result.matches.length) return text;
    const nodes: React.ReactNode[] = [];
    let cursor = 0;
    result.matches.forEach((match, index) => {
      if (match.index < cursor || match.length === 0) return;
      if (match.index > cursor) nodes.push(<span key={`plain-${index}`}>{text.slice(cursor, match.index)}</span>);
      nodes.push(<mark className="rounded-sm bg-primary/35 px-px text-transparent" key={`match-${index}`}>{match.text}</mark>);
      cursor = match.index + match.length;
    });
    if (cursor < text.length) nodes.push(<span key="plain-end">{text.slice(cursor)}</span>);
    return nodes;
  }, [result, text]);

  const toggleFlag = (flag: string) => setActiveFlags((current) => current.includes(flag) ? current.replace(flag, "") : `${current}${flag}`);
  const loadSample = (sample = patterns[0]) => {
    setPattern(sample.pattern); setActiveFlags(sample.flags); setText(sample.text); setReplacement(sample.replacement ?? "$&"); setActionError(null);
  };
  const reset = () => { loadSample(); setMode("match"); };
  const pasteText = async () => {
    try { setText(await navigator.clipboard.readText()); setActionError(null); }
    catch { setActionError("Clipboard access was unavailable. Paste into the editor manually."); }
  };
  const readFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_REGEX_INPUT_BYTES) { setActionError(`Choose a UTF-8 text file smaller than ${MAX_REGEX_INPUT_BYTES.toLocaleString()} bytes.`); return; }
    setText(await file.text()); setActionError(null);
  };
  const download = () => {
    const content = mode === "replace" ? result.replacement : result.matches.map((match) => `${match.index}\t${JSON.stringify(match.text)}`).join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = mode === "replace" ? "regex-replacement.txt" : "regex-matches.txt"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2"><h1 className="text-3xl font-bold tracking-tight">Regex Tester &amp; Replace Tool</h1><p className="max-w-3xl text-lg text-muted">Test JavaScript regular expressions, inspect capture groups and safely preview replacements without sending text to a server.</p></header>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="regex-heading">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="regex-heading" className="text-lg font-semibold">1. Enter a JavaScript regex</h2><div className="flex flex-wrap gap-2"><button type="button" onClick={() => loadSample()} className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover">Load sample</button><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover"><RotateCcw className="h-4 w-4" /> Reset</button><CopyButton text={`/${pattern}/${activeFlags}`} label="regex" size="sm" /></div></div>
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="flex flex-1 items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring"><span className="pl-3 font-mono text-muted">/</span><span className="sr-only">Regular expression pattern</span><input value={pattern} onChange={(event) => setPattern(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 py-2.5 font-mono outline-none" placeholder="pattern" spellCheck={false} /><span className="pr-3 font-mono text-muted">/</span></label>
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-background p-1" role="group" aria-label="Regular expression flags">{flags.map((flag) => <button key={flag.id} type="button" title={flag.label} aria-label={`${flag.label} flag`} aria-pressed={activeFlags.includes(flag.id)} onClick={() => toggleFlag(flag.id)} className={`h-9 w-9 rounded-md font-mono text-sm font-semibold ${activeFlags.includes(flag.id) ? "bg-primary text-primary-foreground" : "text-muted hover:bg-card-hover hover:text-foreground"}`}>{flag.id}</button>)}</div>
        </div>
        <div className="flex flex-wrap gap-2">{patterns.map((sample) => <button key={sample.label} type="button" onClick={() => loadSample(sample)} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary">{sample.label}</button>)}</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="test-text-heading">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="test-text-heading" className="text-lg font-semibold">2. Add test text</h2><div className="flex flex-wrap gap-2"><button type="button" onClick={pasteText} className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover">Paste</button><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover"><FileText className="h-4 w-4" /> Upload</button><button type="button" onClick={() => setText("")} className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover">Clear</button><input ref={fileRef} className="sr-only" type="file" accept=".txt,text/plain" onChange={(event) => { void readFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></div></div>
          <div className="relative h-[360px] overflow-hidden rounded-xl border border-border bg-code-bg">
            <div ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6 text-transparent">{highlighted}</div>
            <textarea aria-label="Test text" value={text} onChange={(event) => setText(event.target.value)} onScroll={(event) => { if (overlayRef.current) { overlayRef.current.scrollTop = event.currentTarget.scrollTop; overlayRef.current.scrollLeft = event.currentTarget.scrollLeft; } }} className="absolute inset-0 z-10 resize-none whitespace-pre-wrap break-words bg-transparent p-4 font-mono text-sm leading-6 text-code-foreground outline-none" spellCheck={false} placeholder="Enter text to test" />
          </div>
          <p className="text-xs text-muted">UTF-8 input limit: {MAX_REGEX_INPUT_BYTES.toLocaleString()} bytes. Evaluation runs in a disposable worker and is stopped after 300 ms.</p>
        </section>

        <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="results-heading">
          <div className="flex items-center justify-between gap-3"><h2 id="results-heading" className="text-lg font-semibold">3. Inspect results</h2><div className="flex rounded-lg border border-border p-1" role="group" aria-label="Result mode"><button type="button" aria-pressed={mode === "match"} onClick={() => setMode("match")} className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === "match" ? "bg-primary text-primary-foreground" : "text-muted"}`}>Matches</button><button type="button" aria-pressed={mode === "replace"} onClick={() => setMode("replace")} className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === "replace" ? "bg-primary text-primary-foreground" : "text-muted"}`}>Replace</button></div></div>
          <div className="grid grid-cols-2 gap-3"><Metric label="Matches" value={running ? "…" : String(result.matches.length)} /><Metric label="Execution" value={running ? "…" : `${result.execTimeMs} ms`} /></div>
          {!running && !result.isValid && <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert">{result.error}</p>}
          {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}
          {result.truncated && <p className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm" role="status">Showing the first 500 matches. Refine the pattern to inspect a smaller result set.</p>}

          {mode === "match" && result.isValid && <div className="space-y-3"><div className="flex items-center justify-between"><h3 className="font-semibold">Match details</h3><button type="button" disabled={!result.matches.length} onClick={download} className="inline-flex items-center gap-1 text-sm font-medium text-primary disabled:opacity-40"><Download className="h-4 w-4" /> Download</button></div><div className="max-h-[430px] space-y-2 overflow-auto">{result.matches.length ? result.matches.map((match, index) => <MatchCard key={`${match.index}-${index}`} number={index + 1} match={match} />) : <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">No matches. Check the pattern, flags and test text.</p>}</div></div>}

          {mode === "replace" && <div className="space-y-4"><label className="block space-y-2"><span className="text-sm font-medium">Replacement string</span><input className={`${fieldClass} font-mono`} value={replacement} onChange={(event) => setReplacement(event.target.value)} placeholder="$1, $& or $<name>" spellCheck={false} /></label><p className="text-xs text-muted">JavaScript replacement tokens are supported: <code>$&amp;</code> whole match, <code>$1</code> numbered group, <code>$&lt;name&gt;</code> named group and <code>$$</code> literal dollar.</p><div><div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-semibold">Replacement preview</h3><div className="flex gap-2"><CopyButton text={result.replacement} label="replacement" size="sm" /><button type="button" disabled={!result.isValid} onClick={download} className="inline-flex items-center gap-1 text-sm font-medium text-primary disabled:opacity-40"><Download className="h-4 w-4" /> Download</button></div></div><pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-code-bg p-3 text-xs">{result.isValid ? result.replacement : "Correct the regex to preview replacement."}</pre></div></div>}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-border bg-background p-3"><p className="text-xs font-semibold uppercase text-muted">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>; }
function MatchCard({ number, match }: { number: number; match: RegexTestResult["matches"][number] }) {
  const groups = Object.entries(match.namedGroups);
  return <article className="rounded-lg border border-border bg-background p-3 text-sm"><div className="flex justify-between gap-3"><strong>#{number}</strong><span className="text-xs text-muted">index {match.index}, length {match.length}</span></div><code className="mt-2 block break-all rounded bg-code-bg p-2">{match.text || "(zero-length match)"}</code>{match.groups.length > 0 && <div className="mt-2 text-xs text-muted">Groups: {match.groups.map((value, index) => <span className="mr-2" key={index}><code>${index + 1}</code>={value === undefined ? "unmatched" : JSON.stringify(value)}</span>)}</div>}{groups.length > 0 && <div className="mt-1 text-xs text-muted">Named: {groups.map(([name, value]) => <span className="mr-2" key={name}><code>{name}</code>={value === undefined ? "unmatched" : JSON.stringify(value)}</span>)}</div>}</article>;
}
