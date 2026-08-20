"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { generateTextHashes, hashData, verifyData, verifyTextHash, type HashFormat, type HashResult, type VerifyResult } from "@/lib/tools/hash-generator";

const SAMPLE_TEXT = "ClientUtils";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
type Mode = "generate" | "verify";
type SourceMode = "text" | "file";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function HashGeneratorClient() {
  const [mode, setMode] = useState<Mode>("generate");
  const [sourceMode, setSourceMode] = useState<SourceMode>("text");
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<HashFormat>("hex");
  const [includeBcrypt, setIncludeBcrypt] = useState(true);
  const [bcryptRounds, setBcryptRounds] = useState(10);
  const [results, setResults] = useState<HashResult[]>([]);
  const [expectedHash, setExpectedHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textBytes = useMemo(() => new TextEncoder().encode(input).byteLength, [input]);
  const sourceLabel = sourceMode === "file" ? file?.name ?? "No file selected" : `UTF-8 text · ${formatBytes(textBytes)}`;
  const report = useMemo(() => results.map((result) => `${result.algorithm}: ${result.hash}`).join("\n"), [results]);

  function selectFile(selected: File | undefined) {
    if (!selected) return;
    if (selected.size > MAX_FILE_BYTES) {
      setActionError("This file is larger than 25 MB. Choose a smaller file to keep browser memory and hashing responsive.");
      return;
    }
    setFile(selected);
    setResults([]);
    setVerifyResult(null);
    setActionError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function pasteText() {
    try {
      setInput(await navigator.clipboard.readText());
      setResults([]);
      setVerifyResult(null);
      setActionError("");
    } catch {
      setActionError("Clipboard access was blocked. Paste with Ctrl/Cmd+V instead.");
    }
  }

  async function pasteExpected() {
    try {
      setExpectedHash((await navigator.clipboard.readText()).trim());
      setVerifyResult(null);
      setActionError("");
    } catch {
      setActionError("Clipboard access was blocked. Paste with Ctrl/Cmd+V instead.");
    }
  }

  async function generate() {
    if (sourceMode === "file" && !file) {
      setActionError("Choose a file before generating checksums.");
      return;
    }
    setIsWorking(true);
    setActionError("");
    try {
      const generated = sourceMode === "file" && file
        ? await hashData(await file.arrayBuffer(), undefined, format)
        : await generateTextHashes(input, format, bcryptRounds, includeBcrypt);
      setResults(generated);
    } catch {
      setActionError("Hash generation failed in this browser. Try a smaller file or another supported browser.");
      setResults([]);
    } finally {
      setIsWorking(false);
    }
  }

  async function verify() {
    if (sourceMode === "file" && !file) {
      setActionError("Choose a file before verifying its checksum.");
      return;
    }
    setIsWorking(true);
    setActionError("");
    try {
      const checked = sourceMode === "file" && file
        ? await verifyData(await file.arrayBuffer(), expectedHash)
        : await verifyTextHash(input, expectedHash);
      setVerifyResult(checked);
    } catch {
      setVerifyResult(null);
      setActionError("Verification failed in this browser.");
    } finally {
      setIsWorking(false);
    }
  }

  function downloadReport() {
    if (!report) return;
    const header = sourceMode === "file" && file ? `File: ${file.name} (${file.size} bytes)\n` : `Text input: ${textBytes} UTF-8 bytes\n`;
    const url = URL.createObjectURL(new Blob([header, `Encoding: ${format}\n\n`, report, "\n"], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = sourceMode === "file" && file ? `${file.name}.checksums.txt` : "text-hashes.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setSourceMode("text");
    setInput(SAMPLE_TEXT);
    setFile(null);
    setFormat("hex");
    setIncludeBcrypt(true);
    setBcryptRounds(10);
    setResults([]);
    setExpectedHash("");
    setVerifyResult(null);
    setActionError("");
  }

  return (
    <div className="stagger-children mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h1 className="text-2xl font-bold text-foreground">Hash Generator &amp; Checksum Verifier</h1><p className="mt-2 text-sm text-muted">Hash text or files with MD5, SHA-1, SHA-256, SHA-512 and bcrypt, then verify an expected digest locally.</p></div>
        <div aria-label="Hash tool mode" className="inline-flex rounded-lg border border-border bg-input p-1" role="group">{(["generate", "verify"] as Mode[]).map((item) => <button aria-pressed={mode === item} className={`rounded-md px-4 py-2 text-sm font-semibold capitalize ${mode === item ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} key={item} onClick={() => { setMode(item); setVerifyResult(null); setActionError(""); }} type="button">{item}</button>)}</div>
      </div>

      {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}

      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <section aria-labelledby="hash-source-heading" className="space-y-5 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-foreground" id="hash-source-heading">Input source</h2><p className="mt-1 text-xs text-muted">{sourceLabel}</p></div><div aria-label="Input source type" className="inline-flex rounded-lg border border-border bg-input p-1" role="group">{(["text", "file"] as SourceMode[]).map((item) => <button aria-pressed={sourceMode === item} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${sourceMode === item ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} key={item} onClick={() => { setSourceMode(item); setResults([]); setVerifyResult(null); setActionError(""); }} type="button">{item}</button>)}</div></div>

          {sourceMode === "text" ? <div className="overflow-hidden rounded-xl border border-border bg-code-bg"><div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2"><label className="text-xs font-semibold text-foreground" htmlFor="hash-text">Text input</label><div className="flex gap-2"><button className="text-xs font-semibold text-muted hover:text-foreground" onClick={pasteText} type="button">Paste</button><button className="text-xs font-semibold text-muted hover:text-foreground" onClick={() => { setInput(SAMPLE_TEXT); setResults([]); setVerifyResult(null); }} type="button">Sample</button><button className="text-xs font-semibold text-muted hover:text-foreground" onClick={() => { setInput(""); setResults([]); setVerifyResult(null); }} type="button">Clear</button></div></div><textarea className="min-h-56 w-full resize-y bg-transparent p-4 font-mono text-sm text-code-foreground outline-none" id="hash-text" onChange={(event) => { setInput(event.target.value); setResults([]); setVerifyResult(null); }} placeholder="Enter text, including spaces and line breaks exactly as they should be hashed" spellCheck={false} value={input} /></div> : <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-code-bg p-6 text-center"><p className="font-semibold text-foreground">{file?.name ?? "Choose a local file"}</p><p className="mt-2 text-xs text-muted">{file ? `${formatBytes(file.size)} · ${file.type || "unknown type"}` : "Maximum 25 MB. The file stays in this browser."}</p><button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover" onClick={() => fileInputRef.current?.click()} type="button">{file ? "Choose another file" : "Choose file"}</button><input className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} ref={fileInputRef} type="file" /></div>}

          {mode === "generate" ? <div className="space-y-4"><div><label className="mb-1 block text-sm font-medium text-foreground" htmlFor="hash-format">Digest encoding</label><select className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-sm text-foreground" id="hash-format" onChange={(event) => { setFormat(event.target.value as HashFormat); setResults([]); }} value={format}><option value="hex">Hexadecimal (standard checksums)</option><option value="base64">Base64</option></select></div>{sourceMode === "text" && <div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-center gap-2 text-sm text-foreground"><input checked={includeBcrypt} className="h-4 w-4 accent-primary" onChange={(event) => { setIncludeBcrypt(event.target.checked); setResults([]); }} type="checkbox" />Include bcrypt</label><label className="flex items-center gap-2 text-sm text-foreground">bcrypt cost<select className="rounded-lg border border-input-border bg-input px-2 py-1 text-sm" disabled={!includeBcrypt} onChange={(event) => { setBcryptRounds(Number(event.target.value)); setResults([]); }} value={bcryptRounds}><option value={8}>8 — quick test</option><option value={10}>10 — balanced</option><option value={12}>12 — stronger/slower</option></select></label></div>}<button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50" disabled={isWorking} onClick={generate} type="button">{isWorking ? "Hashing…" : "Generate hashes"}</button></div> : <div className="space-y-3"><div><div className="mb-1 flex items-center justify-between"><label className="text-sm font-medium text-foreground" htmlFor="expected-hash">Expected hash</label><button className="text-xs font-semibold text-muted hover:text-foreground" onClick={pasteExpected} type="button">Paste</button></div><textarea className="min-h-24 w-full resize-y rounded-lg border border-input-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" id="expected-hash" onChange={(event) => { setExpectedHash(event.target.value); setVerifyResult(null); }} placeholder="Hex MD5/SHA digest or bcrypt string" spellCheck={false} value={expectedHash} /></div><button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50" disabled={isWorking || !expectedHash.trim()} onClick={verify} type="button">{isWorking ? "Verifying…" : "Verify checksum"}</button></div>}

          <button className="text-xs font-semibold text-muted hover:text-foreground" onClick={reset} type="button">Reset all options</button>
        </section>

        <section aria-labelledby="hash-results-heading" className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-3"><h2 className="text-sm font-semibold text-foreground" id="hash-results-heading">{mode === "generate" ? "Hash results" : "Verification result"}</h2>{mode === "generate" && <div className="flex gap-2"><button className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-50" disabled={!results.length} onClick={downloadReport} type="button">Download report</button>{report && <CopyButton label="all hash results" size="sm" text={report} />}</div>}</div>
          {mode === "generate" ? <div className="divide-y divide-border">{results.length ? results.map((result) => <article className="p-4" key={result.algorithm}><div className="flex items-center justify-between gap-3"><div><h3 className="text-xs font-bold uppercase tracking-wide text-foreground">{result.algorithm}{result.bits ? ` · ${result.bits}-bit` : ""}</h3>{result.warning && <p className="mt-1 text-xs font-medium text-warning">{result.warning}</p>}</div><CopyButton label={`${result.algorithm} hash`} size="sm" text={result.hash} /></div><code className="mt-3 block break-all text-sm text-code-foreground">{result.hash}</code></article>) : <div className="flex min-h-[430px] items-center justify-center p-8 text-center text-sm text-muted">Choose text or a file, configure the output, then generate hashes.</div>}</div> : <div className="flex min-h-[430px] items-center justify-center p-6">{verifyResult ? <div aria-live="polite" className={`w-full rounded-xl border p-6 ${!verifyResult.validInput ? "border-warning/30 bg-warning/10 text-warning" : verifyResult.match ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger"}`} role="status"><p className="text-lg font-bold">{!verifyResult.validInput ? "Expected hash needs attention" : verifyResult.match ? "Checksum matches" : "Checksum does not match"}</p><p className="mt-2 text-sm">{verifyResult.error ?? `${verifyResult.algorithm} was detected automatically. ${verifyResult.match ? "The input produces the expected value." : "The input and expected value differ."}`}</p>{verifyResult.algorithm && <p className="mt-3 text-xs font-semibold uppercase tracking-wide">Detected: {verifyResult.algorithm}</p>}</div> : <p className="text-center text-sm text-muted">Provide an expected hexadecimal digest or bcrypt hash, then verify it against the exact text or file bytes.</p>}</div>}
        </section>
      </div>

      <p className="text-xs text-muted">Privacy: text encoding, file reading, hashing, bcrypt work, comparison and report export run locally. No input or file is uploaded. A matching checksum confirms identical bytes, not that a file is safe or authentic.</p>
    </div>
  );
}
