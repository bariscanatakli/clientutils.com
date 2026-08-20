"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Download, FileUp, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { decodeBase64, decodeText, encodeBytes, encodeText, formatBytes, MAX_BASE64_FILE_BYTES, MAX_BASE64_TEXT_BYTES, toDataUri, type Base64Variant } from "@/lib/tools/base64-encoder";

const TEXT_SAMPLE = "Hello, İstanbul 👋\nBase64 preserves these UTF-8 bytes.";
const BASE64_SAMPLE = "SGVsbG8sIMSwc3RhbmJ1bCDwn5GLCkJhc2U2NCBwcmVzZXJ2ZXMgdGhlc2UgVVRGLTggYnl0ZXMu";
const fieldClass = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function Base64EncoderClient() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [action, setAction] = useState<"encode" | "decode">("encode");
  const [variant, setVariant] = useState<Base64Variant>("standard");
  const [includePadding, setIncludePadding] = useState(true);
  const [input, setInput] = useState(TEXT_SAMPLE);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("sample.bin");
  const [mimeType, setMimeType] = useState("application/octet-stream");
  const [isDragging, setIsDragging] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textResult = useMemo(() => {
    if (mode !== "text") return { output: "", error: null as string | null, bytes: 0 };
    if (action === "encode") {
      const bytes = new TextEncoder().encode(input).length;
      if (bytes > MAX_BASE64_FILE_BYTES) return { output: "", error: `Text is ${formatBytes(bytes)}. Keep it under ${formatBytes(MAX_BASE64_FILE_BYTES)}.`, bytes };
      return { output: input ? encodeText(input, variant, includePadding) : "", error: null, bytes };
    }
    const decoded = decodeText(input);
    return { output: decoded.text, error: decoded.error, bytes: decoded.details.bytes.length };
  }, [mode, action, input, variant, includePadding]);

  const fileEncoded = useMemo(() => fileBytes ? encodeBytes(fileBytes, variant, includePadding) : "", [fileBytes, variant, includePadding]);
  const fileDecoded = useMemo(() => mode === "file" && action === "decode" ? decodeBase64(input) : null, [mode, action, input]);
  const effectiveMime = fileDecoded?.mimeType ?? (mimeType.trim() || "application/octet-stream");
  const previewUri = useMemo(() => {
    if (mode !== "file") return null;
    if (action === "encode" && fileBytes && mimeType.startsWith("image/")) return toDataUri(encodeBytes(fileBytes), mimeType);
    if (action === "decode" && fileDecoded && !fileDecoded.error && effectiveMime.startsWith("image/")) return toDataUri(encodeBytes(fileDecoded.bytes), effectiveMime);
    return null;
  }, [mode, action, fileBytes, fileDecoded, mimeType, effectiveMime]);

  const reset = () => {
    setMode("text"); setAction("encode"); setVariant("standard"); setIncludePadding(true); setInput(TEXT_SAMPLE); setFileBytes(null); setFileName("sample.bin"); setMimeType("application/octet-stream"); setActionError(null);
  };
  const loadSample = () => { setInput(action === "encode" ? TEXT_SAMPLE : BASE64_SAMPLE); setActionError(null); };
  const paste = async () => { try { setInput(await navigator.clipboard.readText()); setActionError(null); } catch { setActionError("Clipboard access was unavailable. Paste into the input manually."); } };
  const selectAction = (next: "encode" | "decode") => { setAction(next); setInput(next === "encode" ? TEXT_SAMPLE : BASE64_SAMPLE); setFileBytes(null); setActionError(null); };
  const readFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_BASE64_FILE_BYTES) { setActionError(`Choose a file no larger than ${formatBytes(MAX_BASE64_FILE_BYTES)}.`); return; }
    setFileBytes(new Uint8Array(await file.arrayBuffer())); setFileName(file.name); setMimeType(file.type || "application/octet-stream"); setActionError(null);
  };
  const downloadEncoded = () => downloadBlob(new Blob([fileEncoded], { type: "text/plain;charset=utf-8" }), `${fileName}.base64.txt`);
  const downloadDecoded = () => {
    if (!fileDecoded || fileDecoded.error) return;
    const buffer = new ArrayBuffer(fileDecoded.bytes.length);
    new Uint8Array(buffer).set(fileDecoded.bytes);
    downloadBlob(new Blob([buffer], { type: effectiveMime }), fileName.trim() || "decoded-file.bin");
  };

  return <main className="mx-auto max-w-6xl space-y-8">
    <header className="space-y-2"><h1 className="text-3xl font-bold tracking-tight">Base64 Encoder &amp; Decoder for Text and Files</h1><p className="max-w-3xl text-lg text-muted">Encode UTF-8 text or binary files, strictly decode standard and URL-safe Base64, and recover the original bytes locally.</p></header>

    <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-lg border border-border bg-background p-1" role="group" aria-label="Input type"><Toggle active={mode === "text"} onClick={() => { setMode("text"); setFileBytes(null); }}>Text</Toggle><Toggle active={mode === "file"} onClick={() => { setMode("file"); setInput(action === "decode" ? BASE64_SAMPLE : ""); }}>File / binary</Toggle></div>
        <div className="flex rounded-lg border border-border bg-background p-1" role="group" aria-label="Base64 action"><Toggle active={action === "encode"} onClick={() => selectAction("encode")}>Encode</Toggle><Toggle active={action === "decode"} onClick={() => selectAction("decode")}>Decode</Toggle></div>
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-card-hover"><RotateCcw className="h-4 w-4" /> Reset</button>
      </div>

      {action === "encode" && <div className="grid gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-2"><label className="space-y-2"><span className="text-sm font-medium">Alphabet</span><select className={fieldClass} value={variant} onChange={(event) => setVariant(event.target.value as Base64Variant)}><option value="standard">Standard Base64 (+ and /)</option><option value="url">URL-safe Base64 (- and _)</option></select></label><label className="flex items-center gap-2 self-end rounded-lg border border-border px-3 py-2 text-sm"><input type="checkbox" checked={includePadding} onChange={(event) => setIncludePadding(event.target.checked)} /> Include = padding</label></div>}

      {mode === "text" ? <TextWorkspace action={action} input={input} setInput={setInput} output={textResult.output} error={textResult.error} onPaste={paste} onSample={loadSample} /> : action === "encode" ? <div className="grid gap-6 lg:grid-cols-2"><div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click(); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); void readFile(event.dataTransfer.files[0]); }} className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center ${isDragging ? "border-primary bg-primary-soft" : "border-border bg-code-bg hover:border-primary"}`}><FileUp className="mb-4 h-10 w-10 text-primary" /><strong>Choose or drop a file</strong><p className="mt-2 text-sm text-muted">Any binary format, up to {formatBytes(MAX_BASE64_FILE_BYTES)}</p><input ref={fileInputRef} type="file" className="sr-only" onChange={(event) => { void readFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></div><FileEncodeResult bytes={fileBytes} base64={fileEncoded} fileName={fileName} mimeType={mimeType} previewUri={previewUri} onDownload={downloadEncoded} /></div> : <FileDecodeWorkspace input={input} setInput={setInput} decoded={fileDecoded} fileName={fileName} setFileName={setFileName} mimeType={effectiveMime} setMimeType={setMimeType} previewUri={previewUri} onPaste={paste} onSample={loadSample} onDownload={downloadDecoded} />}

      {actionError && <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert">{actionError}</p>}
      <p className="text-xs leading-relaxed text-muted">Processing stays in this browser. Text and files are never uploaded. Base64 increases binary size by roughly one third and provides no encryption or secrecy.</p>
    </section>
  </main>;
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-md px-4 py-2 text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "text-muted hover:bg-card-hover hover:text-foreground"}`}>{children}</button>; }

function TextWorkspace({ action, input, setInput, output, error, onPaste, onSample }: { action: "encode" | "decode"; input: string; setInput: (value: string) => void; output: string; error: string | null; onPaste: () => void; onSample: () => void }) {
  return <div className="grid gap-4 lg:grid-cols-2"><Editor title={action === "encode" ? "UTF-8 text" : "Base64 input"} value={input} onChange={setInput} actions={<><button type="button" onClick={onPaste}>Paste</button><button type="button" onClick={onSample}>Sample</button><button type="button" onClick={() => setInput("")}>Clear</button></>} /><Editor title={action === "encode" ? "Base64 output" : "Decoded UTF-8 text"} value={error ? "" : output} readOnly actions={<><CopyButton text={error ? "" : output} label="output" size="sm" />{output && <button type="button" onClick={() => downloadBlob(new Blob([output], { type: "text/plain;charset=utf-8" }), action === "encode" ? "base64.txt" : "decoded.txt")}><Download className="h-4 w-4" /> Download</button>}</>} />{error && <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger lg:col-span-2" role="alert">{error}</p>}<div className="flex flex-wrap gap-4 text-xs text-muted lg:col-span-2"><span>Input: {formatBytes(new TextEncoder().encode(input).length)}</span>{!error && <span>Output: {formatBytes(new TextEncoder().encode(output).length)}</span>}</div></div>;
}

function Editor({ title, value, onChange, readOnly = false, actions }: { title: string; value: string; onChange?: (value: string) => void; readOnly?: boolean; actions: React.ReactNode }) { return <div className="flex min-h-80 flex-col overflow-hidden rounded-xl border border-border bg-code-bg"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2"><span className="text-xs font-mono text-muted">{title}</span><div className="flex items-center gap-3 text-xs font-medium text-primary [&_button]:inline-flex [&_button]:items-center [&_button]:gap-1">{actions}</div></div><textarea aria-label={title} value={value} onChange={(event) => onChange?.(event.target.value)} readOnly={readOnly} className="min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none" spellCheck={false} /></div>; }

function FileEncodeResult({ bytes, base64, fileName, mimeType, previewUri, onDownload }: { bytes: Uint8Array | null; base64: string; fileName: string; mimeType: string; previewUri: string | null; onDownload: () => void }) { return <div className="min-h-72 rounded-xl border border-border bg-code-bg p-4">{bytes ? <div className="space-y-4"><div><strong className="break-all">{fileName}</strong><p className="text-xs text-muted">{mimeType} · {formatBytes(bytes.length)} → {base64.length.toLocaleString()} characters</p></div>{previewUri && <div className="flex h-32 items-center justify-center rounded-lg border border-border bg-background p-2"><Image unoptimized src={previewUri} alt="Selected file preview" width={512} height={256} className="max-h-full max-w-full object-contain" /></div>}<textarea aria-label="Encoded file Base64" className="h-28 w-full resize-none rounded-lg border border-border bg-background p-3 font-mono text-xs" readOnly value={base64} /><div className="flex flex-wrap gap-2"><CopyButton text={base64} label="raw Base64" /><CopyButton text={toDataUri(encodeBytes(bytes), mimeType)} label="data URI" /><button type="button" onClick={onDownload} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover"><Download className="h-4 w-4" /> Download .txt</button></div></div> : <p className="flex h-full items-center justify-center text-center text-sm text-muted">Select a file to create raw Base64 and a MIME data URI.</p>}</div>; }

function FileDecodeWorkspace({ input, setInput, decoded, fileName, setFileName, mimeType, setMimeType, previewUri, onPaste, onSample, onDownload }: { input: string; setInput: (value: string) => void; decoded: ReturnType<typeof decodeBase64> | null; fileName: string; setFileName: (value: string) => void; mimeType: string; setMimeType: (value: string) => void; previewUri: string | null; onPaste: () => void; onSample: () => void; onDownload: () => void }) { return <div className="grid gap-4 lg:grid-cols-2"><Editor title="Raw Base64 or data URI" value={input} onChange={(value) => { if (value.length <= MAX_BASE64_TEXT_BYTES) setInput(value); }} actions={<><button type="button" onClick={onPaste}>Paste</button><button type="button" onClick={onSample}>Sample</button><button type="button" onClick={() => setInput("")}>Clear</button></>} /><div className="space-y-4 rounded-xl border border-border bg-code-bg p-4"><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1"><span className="text-xs font-medium">Download filename</span><input className={fieldClass} value={fileName} onChange={(event) => setFileName(event.target.value)} /></label><label className="space-y-1"><span className="text-xs font-medium">Media type</span><input className={fieldClass} value={mimeType} disabled={Boolean(decoded?.isDataUri)} onChange={(event) => setMimeType(event.target.value)} /></label></div>{decoded?.error ? <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert">{decoded.error}</p> : decoded && <><div className="rounded-lg border border-border bg-background p-4"><p className="font-semibold">Ready to download</p><p className="mt-1 text-sm text-muted">{formatBytes(decoded.bytes.length)} · {decoded.variant === "url" ? "URL-safe" : "standard"} Base64{decoded.isDataUri ? " · data URI media type detected" : ""}</p></div>{previewUri && <div className="flex h-36 items-center justify-center rounded-lg border border-border bg-background p-2"><Image unoptimized src={previewUri} alt="Decoded image preview" width={512} height={288} className="max-h-full max-w-full object-contain" /></div>}<button type="button" onClick={onDownload} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Download decoded file</button></>}</div></div>; }
