"use client";

import { useMemo, useRef, useState } from "react";
import { Contact, Download, Link as LinkIcon, Mail, MessageSquare, Phone, RotateCcw, Type, Wifi } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CopyButton } from "@/components/ui/CopyButton";
import { buildQrPayload, contrastRatio, DEFAULT_QR_INPUT, isHexColor, type QrPayloadInput, type QrType } from "@/lib/tools/qr-code";

const fieldClass = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const typeOptions = [
  { id: "text", label: "Text", icon: Type },
  { id: "url", label: "URL", icon: LinkIcon },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "vcard", label: "vCard", icon: Contact },
] satisfies { id: QrType; label: string; icon: typeof Type }[];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function QrClient() {
  const [input, setInput] = useState<QrPayloadInput>(DEFAULT_QR_INPUT);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [marginSize, setMarginSize] = useState(4);
  const [exportSize, setExportSize] = useState(512);
  const [actionError, setActionError] = useState<string | null>(null);
  const qrRef = useRef<SVGSVGElement>(null);

  const payload = useMemo(() => buildQrPayload(input), [input]);
  const ratio = useMemo(() => contrastRatio(fgColor, bgColor), [fgColor, bgColor]);
  const colorsValid = isHexColor(fgColor) && isHexColor(bgColor);
  const canExport = payload.isValid && colorsValid;

  const setField = <K extends keyof QrPayloadInput>(key: K, value: QrPayloadInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
    setActionError(null);
  };

  const pastePrimary = async () => {
    try {
      const value = await navigator.clipboard.readText();
      const field: keyof QrPayloadInput = input.type === "url" ? "url" : input.type === "wifi" ? "wifiSsid" : input.type === "email" ? "emailTo" : input.type === "vcard" ? "firstName" : input.type === "text" ? "text" : "phone";
      setField(field, value);
    } catch {
      setActionError("Clipboard access was unavailable. Paste into the field manually.");
    }
  };

  const reset = () => {
    setInput({ ...DEFAULT_QR_INPUT, type: input.type });
    setFgColor("#000000");
    setBgColor("#ffffff");
    setLevel("M");
    setMarginSize(4);
    setExportSize(512);
    setActionError(null);
  };

  const clearCurrent = () => {
    const cleared = { ...input };
    if (input.type === "text") cleared.text = "";
    if (input.type === "url") cleared.url = "";
    if (input.type === "wifi") Object.assign(cleared, { wifiSsid: "", wifiPassword: "" });
    if (input.type === "email") Object.assign(cleared, { emailTo: "", emailSubject: "", emailBody: "" });
    if (input.type === "sms") Object.assign(cleared, { phone: "", smsMessage: "" });
    if (input.type === "phone") cleared.phone = "";
    if (input.type === "vcard") Object.assign(cleared, { firstName: "", lastName: "", organization: "", jobTitle: "", contactEmail: "", contactPhone: "", contactWebsite: "" });
    setInput(cleared);
    setActionError(null);
  };

  const serializedSvg = () => {
    if (!qrRef.current || !canExport) return null;
    return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(qrRef.current)}`;
  };

  const downloadSvg = () => {
    const svg = serializedSvg();
    if (svg) downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), "clientutils-qr-code.svg");
  };

  const downloadPng = () => {
    const svg = serializedSvg();
    if (!svg) return;
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = exportSize;
      canvas.height = exportSize;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        setActionError("This browser could not create a PNG canvas. Download SVG instead.");
        return;
      }
      context.fillStyle = bgColor;
      context.fillRect(0, 0, exportSize, exportSize);
      context.drawImage(image, 0, 0, exportSize, exportSize);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(svgUrl);
        if (blob) downloadBlob(blob, "clientutils-qr-code.png");
        else setActionError("PNG export failed. Download SVG instead.");
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      setActionError("PNG export failed. Download SVG instead.");
    };
    image.src = svgUrl;
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">QR Code Generator for URL, Wi-Fi, vCard &amp; SMS</h1>
        <p className="max-w-3xl text-lg text-muted">Build validated QR payloads locally, preview their exact contents, and download print-ready PNG or scalable SVG files.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="qr-content-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="qr-content-heading" className="text-lg font-semibold">1. Choose content</h2>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover" onClick={pastePrimary} type="button">Paste</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover" onClick={() => setInput({ ...DEFAULT_QR_INPUT, type: input.type })} type="button">Load sample</button>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover" onClick={clearCurrent} type="button">Clear</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" role="group" aria-label="QR content type">
              {typeOptions.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" aria-pressed={input.type === id} onClick={() => setField("type", id)} className={`flex min-h-16 flex-col items-center justify-center rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${input.type === id ? "border-primary bg-primary-soft text-primary" : "border-border bg-background hover:bg-card-hover"}`}>
                  <Icon aria-hidden="true" className="mb-1 h-4 w-4" />{label}
                </button>
              ))}
            </div>

            {input.type === "text" && <Field label="Text" id="qr-text"><textarea id="qr-text" className={`${fieldClass} min-h-32`} value={input.text} onChange={(event) => setField("text", event.target.value)} placeholder="Enter text to encode" /></Field>}
            {input.type === "url" && <Field label="Website URL" id="qr-url"><input id="qr-url" className={fieldClass} type="url" value={input.url} onChange={(event) => setField("url", event.target.value)} placeholder="https://example.com" /></Field>}
            {input.type === "wifi" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Network name (SSID)" id="wifi-ssid"><input id="wifi-ssid" className={fieldClass} value={input.wifiSsid} onChange={(event) => setField("wifiSsid", event.target.value)} /></Field>
                <Field label="Encryption" id="wifi-encryption"><select id="wifi-encryption" className={fieldClass} value={input.wifiEncryption} onChange={(event) => setField("wifiEncryption", event.target.value as QrPayloadInput["wifiEncryption"])}><option value="WPA">WPA/WPA2/WPA3</option><option value="WEP">WEP (legacy)</option><option value="nopass">No password</option></select></Field>
                <Field label="Password" id="wifi-password"><input id="wifi-password" className={fieldClass} type="password" disabled={input.wifiEncryption === "nopass"} value={input.wifiPassword} onChange={(event) => setField("wifiPassword", event.target.value)} autoComplete="off" /></Field>
                <label className="flex items-center gap-2 self-end rounded-lg border border-border px-3 py-2 text-sm"><input type="checkbox" checked={input.wifiHidden} onChange={(event) => setField("wifiHidden", event.target.checked)} /> Hidden network</label>
              </div>
            )}
            {input.type === "email" && <div className="grid gap-4 sm:grid-cols-2"><Field label="Recipient" id="email-to"><input id="email-to" className={fieldClass} type="email" value={input.emailTo} onChange={(event) => setField("emailTo", event.target.value)} /></Field><Field label="Subject" id="email-subject"><input id="email-subject" className={fieldClass} value={input.emailSubject} onChange={(event) => setField("emailSubject", event.target.value)} /></Field><div className="sm:col-span-2"><Field label="Message" id="email-body"><textarea id="email-body" className={`${fieldClass} min-h-24`} value={input.emailBody} onChange={(event) => setField("emailBody", event.target.value)} /></Field></div></div>}
            {(input.type === "sms" || input.type === "phone") && <div className="grid gap-4 sm:grid-cols-2"><Field label={input.type === "sms" ? "Recipient phone" : "Phone number"} id="phone"><input id="phone" className={fieldClass} type="tel" value={input.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="+905551234567" /></Field>{input.type === "sms" && <Field label="SMS message" id="sms-message"><textarea id="sms-message" className={`${fieldClass} min-h-20`} value={input.smsMessage} onChange={(event) => setField("smsMessage", event.target.value)} /></Field>}</div>}
            {input.type === "vcard" && <div className="grid gap-4 sm:grid-cols-2"><Field label="First name" id="first-name"><input id="first-name" className={fieldClass} value={input.firstName} onChange={(event) => setField("firstName", event.target.value)} /></Field><Field label="Last name" id="last-name"><input id="last-name" className={fieldClass} value={input.lastName} onChange={(event) => setField("lastName", event.target.value)} /></Field><Field label="Organization" id="organization"><input id="organization" className={fieldClass} value={input.organization} onChange={(event) => setField("organization", event.target.value)} /></Field><Field label="Job title" id="job-title"><input id="job-title" className={fieldClass} value={input.jobTitle} onChange={(event) => setField("jobTitle", event.target.value)} /></Field><Field label="Email" id="contact-email"><input id="contact-email" className={fieldClass} type="email" value={input.contactEmail} onChange={(event) => setField("contactEmail", event.target.value)} /></Field><Field label="Phone" id="contact-phone"><input id="contact-phone" className={fieldClass} type="tel" value={input.contactPhone} onChange={(event) => setField("contactPhone", event.target.value)} /></Field><div className="sm:col-span-2"><Field label="Website" id="contact-website"><input id="contact-website" className={fieldClass} type="url" value={input.contactWebsite} onChange={(event) => setField("contactWebsite", event.target.value)} /></Field></div></div>}

            {!payload.isValid && <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert">{payload.error}</p>}
          </section>

          <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="qr-design-heading">
            <div className="flex items-center justify-between gap-3"><h2 id="qr-design-heading" className="text-lg font-semibold">2. Set output quality</h2><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-card-hover"><RotateCcw className="h-4 w-4" /> Reset</button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField id="foreground" label="Foreground" value={fgColor} onChange={setFgColor} />
              <ColorField id="background" label="Background" value={bgColor} onChange={setBgColor} />
              <Field label="Error correction" id="error-level"><select id="error-level" className={fieldClass} value={level} onChange={(event) => setLevel(event.target.value as typeof level)}><option value="L">Low — about 7%</option><option value="M">Medium — about 15%</option><option value="Q">Quartile — about 25%</option><option value="H">High — about 30%</option></select></Field>
              <Field label="PNG size" id="export-size"><select id="export-size" className={fieldClass} value={exportSize} onChange={(event) => setExportSize(Number(event.target.value))}><option value={256}>256 × 256 px</option><option value={512}>512 × 512 px</option><option value={1024}>1024 × 1024 px</option></select></Field>
              <Field label="Quiet zone" id="quiet-zone"><select id="quiet-zone" className={fieldClass} value={marginSize} onChange={(event) => setMarginSize(Number(event.target.value))}><option value={4}>4 modules — recommended</option><option value={2}>2 modules</option><option value={0}>No margin</option></select></Field>
            </div>
            {!colorsValid && <p className="text-sm text-danger" role="alert">Use six-digit hex colors such as #000000.</p>}
            {ratio !== null && ratio < 3 && <p className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm" role="status">Low contrast ({ratio.toFixed(2)}:1) can make the code difficult to scan. Use a dark foreground on a light background.</p>}
          </section>

          {payload.isValid && <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Encoded payload</h2><p className="text-xs text-muted">{payload.bytes.toLocaleString()} UTF-8 bytes</p></div><CopyButton text={payload.payload} label="payload" /></div><pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-code-bg p-3 text-xs">{payload.payload}</pre></section>}
        </div>

        <aside className="h-fit space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-6" aria-label="QR preview and downloads">
          <h2 className="text-lg font-semibold">3. Preview and download</h2>
          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-4">
            {canExport ? <QRCodeSVG ref={qrRef} value={payload.payload} size={exportSize} fgColor={fgColor} bgColor={bgColor} level={level} marginSize={marginSize} boostLevel title={`${typeOptions.find((option) => option.id === input.type)?.label} QR code preview`} style={{ width: "240px", height: "240px", maxWidth: "100%" }} /> : <p className="max-w-56 text-center text-sm text-muted">Correct the content and color errors to generate a preview.</p>}
          </div>
          <div className="space-y-3">
            <button type="button" disabled={!canExport} onClick={downloadPng} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" /> Download PNG ({exportSize}px)</button>
            <button type="button" disabled={!canExport} onClick={downloadSvg} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 font-semibold hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" /> Download SVG</button>
          </div>
          {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}
          <p className="text-xs leading-relaxed text-muted">Everything runs in this browser. Payloads, Wi-Fi passwords and contact details are not uploaded. Always scan-test the exported file before printing or sharing it.</p>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return <div className="space-y-2"><label className="text-sm font-medium" htmlFor={id}>{label}</label>{children}</div>;
}

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  const pickerValue = isHexColor(value) ? value : "#000000";
  return <Field label={label} id={`${id}-hex`}><div className="flex gap-2"><input aria-label={`${label} color picker`} className="h-10 w-12 cursor-pointer rounded border border-input" type="color" value={pickerValue} onChange={(event) => onChange(event.target.value)} /><input id={`${id}-hex`} className={`${fieldClass} font-mono uppercase`} value={value} onChange={(event) => onChange(event.target.value)} maxLength={7} spellCheck={false} /></div></Field>;
}
