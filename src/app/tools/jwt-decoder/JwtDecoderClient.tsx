"use client";

import { useMemo, useRef, useState } from "react";
import { Download, FileUp, RotateCcw, ShieldAlert } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { JsonTree } from "@/components/ui/JsonTree";
import { decodeJWT, getClaimDescription, MAX_JWT_LENGTH, type JwtTimeStatus } from "@/lib/tools/jwt-decoder";

const SAMPLE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsInJvbGUiOiJkZXZlbG9wZXIiLCJpYXQiOjE3NjcyMjU2MDAsIm5iZiI6MTc2NzIyNTYwMCwiZXhwIjo0MTAyNDQ0ODAwfQ.ZGVtby1zaWduYXR1cmU";
const buttonClass = "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-50";

const timeLabels: Record<JwtTimeStatus, string> = {
  active: "Within stated time window",
  expired: "Expired by exp",
  "not-active": "Not active yet by nbf",
  "future-issued": "iat is in the future",
  "no-time-claims": "No time claims",
  invalid: "Invalid time claim",
};

function downloadText(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function JwtDecoderClient() {
  const [token, setToken] = useState(SAMPLE_TOKEN);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const result = useMemo(() => decodeJWT(token), [token]);
  const parts = token.trim().split(".");
  const report = useMemo(() => JSON.stringify({
    verification: "NOT VERIFIED — decoded structure only",
    inspectedAt: new Date().toISOString(),
    structure: result.isDecodable ? "decodable" : "invalid",
    algorithmFromUntrustedHeader: result.algorithm,
    tokenType: result.tokenType,
    timeStatusAgainstBrowserClock: result.timeStatus,
    timeClaims: result.timeClaims,
    warnings: result.warnings,
    header: result.header.decoded,
    payload: result.payload.decoded,
    signatureBase64Url: result.signature,
  }, null, 2), [result]);

  const paste = async () => {
    try { setToken((await navigator.clipboard.readText()).trim()); setActionError(null); }
    catch { setActionError("Clipboard access was unavailable. Paste into the token field manually."); }
  };
  const loadFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_JWT_LENGTH) { setActionError(`Choose a token file smaller than ${MAX_JWT_LENGTH.toLocaleString()} bytes.`); return; }
    const text = (await file.text()).trim();
    if (text.length > MAX_JWT_LENGTH) { setActionError(`Token exceeds ${MAX_JWT_LENGTH.toLocaleString()} characters.`); return; }
    setToken(text); setActionError(null);
  };

  return <main className="mx-auto max-w-6xl space-y-8">
    <header className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">JWT Decoder &amp; Token Inspector</h1>
      <p className="max-w-3xl text-lg text-muted">Strictly decode compact JWT header and payload data, inspect NumericDate claims and understand what still requires trusted signature verification.</p>
    </header>

    <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4" role="status">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
      <div><strong className="text-foreground">Decoded only — never verified here.</strong><p className="mt-1 text-sm leading-relaxed text-muted">Readable claims are not proof of identity or authorization. Your server must verify the signature, expected algorithm, issuer, audience and application policy before trusting a token.</p></div>
    </div>

    <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="jwt-input" className="font-semibold">Compact JWT</label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={buttonClass} onClick={() => void paste()}>Paste</button>
          <button type="button" className={buttonClass} onClick={() => fileInputRef.current?.click()}><FileUp className="h-4 w-4" /> Upload .txt</button>
          <button type="button" className={buttonClass} onClick={() => { setToken(SAMPLE_TOKEN); setActionError(null); }}>Sample</button>
          <button type="button" className={buttonClass} onClick={() => { setToken(""); setActionError(null); }}>Clear</button>
          <button type="button" className={buttonClass} onClick={() => { setToken(SAMPLE_TOKEN); setActionError(null); }}><RotateCcw className="h-4 w-4" /> Reset</button>
          <input ref={fileInputRef} type="file" accept=".txt,text/plain,application/jwt" className="sr-only" onChange={(event) => { void loadFile(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        </div>
      </div>
      <textarea id="jwt-input" value={token} maxLength={MAX_JWT_LENGTH} onChange={(event) => { setToken(event.target.value); setActionError(null); }} className="min-h-40 w-full resize-y rounded-xl border border-input bg-code-bg p-4 font-mono text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring" spellCheck={false} aria-describedby="jwt-limit jwt-error" />
      <div className="flex flex-wrap justify-between gap-2 text-xs text-muted"><span id="jwt-limit">{token.length.toLocaleString()} / {MAX_JWT_LENGTH.toLocaleString()} characters · exactly three Base64URL segments</span>{parts.length === 3 && <span><span className="text-danger">header</span> · <span className="text-primary">payload</span> · <span className="text-info">signature</span></span>}</div>
      {(actionError || (token && result.error)) && <p id="jwt-error" className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert">{actionError || result.error}</p>}
      <p className="text-xs leading-relaxed text-muted">Inspection runs only in this browser. Tokens can contain personal data and bearer credentials: avoid shared devices, screenshots and public issue reports.</p>
    </section>

    <section aria-label="Inspection summary" className="grid gap-3 sm:grid-cols-3">
      <Summary label="Structure" value={result.isDecodable ? "Decodable" : "Invalid"} tone={result.isDecodable ? "success" : "danger"} detail="Syntax and JSON only" />
      <Summary label="Signature" value="Not verified" tone="warning" detail={result.signatureBytes === null ? "Invalid or missing segment" : `${result.signatureBytes} decoded bytes`} />
      <Summary label="Time status" value={timeLabels[result.timeStatus]} tone={result.timeStatus === "active" || result.timeStatus === "no-time-claims" ? "neutral" : "warning"} detail="Compared with this browser clock" />
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <DecodedPanel title="Header" subtitle={`${result.algorithm ?? "No alg"}${result.tokenType ? ` · ${result.tokenType}` : ""}`} tone="danger" data={result.header.decoded} error={result.header.error} />
      <DecodedPanel title="Payload" subtitle={result.payload.decoded ? `${Object.keys(result.payload.decoded).length} claims` : "Claims"} tone="primary" data={result.payload.decoded} error={result.payload.error} />
    </section>

    {result.payload.decoded && <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Claim guide</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.keys(result.payload.decoded).map((claim) => <div key={claim} className="rounded-lg border border-border bg-background p-3"><code className="font-semibold text-primary">{claim}</code><p className="mt-1 text-xs text-muted">{getClaimDescription(claim)}</p></div>)}</div>
      {result.timeClaims.length > 0 && <div className="mt-6"><h3 className="font-semibold">NumericDate interpretation</h3><p className="mt-1 text-sm text-muted">JWT NumericDate values are seconds since 1970-01-01 UTC. Clock comparison does not verify authenticity and applies no issuer-specific clock tolerance.</p><div className="mt-3 grid gap-3 md:grid-cols-3">{result.timeClaims.map((claim) => <div key={claim.name} className={`rounded-lg border p-3 ${claim.status === "invalid" ? "border-danger/30 bg-danger/5" : "border-border bg-code-bg"}`}><div className="flex justify-between gap-2"><strong>{claim.label}</strong><code>{String(claim.value)}</code></div><p className="mt-2 break-all text-xs text-muted">{claim.iso || claim.message}</p><p className="mt-1 text-xs">{claim.message}</p></div>)}</div></div>}
    </section>}

    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-info/30 bg-card p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold text-info">Signature segment</h2><CopyButton text={result.signature} label="signature" size="sm" /></div><p className="mt-3 break-all rounded-lg bg-code-bg p-3 font-mono text-xs text-info">{result.signature || "No signature data"}</p><p className="mt-3 text-xs text-muted">This is encoded signature data, not a successful verification result.</p></div>
      <div className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Signing input</h2><CopyButton text={result.signingInput} label="signing input" size="sm" /></div><p className="mt-3 max-h-24 overflow-auto break-all rounded-lg bg-code-bg p-3 font-mono text-xs">{result.signingInput || "Header and payload segments appear here."}</p></div>
    </section>

    {result.warnings.length > 0 && <section className="rounded-xl border border-warning/30 bg-warning/5 p-5"><h2 className="font-semibold">Trust checks still required</h2><ul className="mt-3 space-y-2 text-sm text-muted">{result.warnings.map((warning) => <li key={warning} className="flex gap-2"><span aria-hidden="true">•</span><span>{warning}</span></li>)}</ul></section>}

    <div className="flex flex-wrap gap-3"><CopyButton text={report} label="inspection report" /><button type="button" className={buttonClass} onClick={() => downloadText(report, "jwt-inspection.json")} disabled={!result.header.decoded && !result.payload.decoded}><Download className="h-4 w-4" /> Download report</button></div>
  </main>;
}

function Summary({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "success" | "danger" | "warning" | "neutral" }) {
  const colors = { success: "text-success", danger: "text-danger", warning: "text-warning", neutral: "text-foreground" };
  return <div className="rounded-xl border border-border bg-card p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p><p className={`mt-1 font-semibold ${colors[tone]}`}>{value}</p><p className="mt-1 text-xs text-muted">{detail}</p></div>;
}

function DecodedPanel({ title, subtitle, tone, data, error }: { title: string; subtitle: string; tone: "danger" | "primary"; data: Record<string, unknown> | null; error: string | null }) {
  return <div className={`overflow-hidden rounded-xl border bg-card ${tone === "danger" ? "border-danger/30" : "border-primary/30"}`}><div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"><div><h2 className={tone === "danger" ? "font-semibold text-danger" : "font-semibold text-primary"}>{title}</h2><p className="text-xs text-muted">{subtitle}</p></div>{data && <CopyButton text={JSON.stringify(data, null, 2)} label={title.toLowerCase()} size="sm" />}</div><div className="min-h-40 bg-code-bg p-4">{data ? <JsonTree data={data} /> : <p className="text-sm text-muted">{error || "Awaiting a decodable token."}</p>}</div></div>;
}
