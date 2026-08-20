"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  DEFAULT_XML_OPTIONS,
  XmlJsonIndent,
  XmlToJsonOptions,
  convertJsonToXml,
  convertXmlToJson,
  createJavaScriptOutput,
} from "@/lib/tools/xml-json";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Values remain strings unless native types are enabled. -->
<catalog xmlns:shop="urn:clientutils:shop">
  <shop:item id="sku-1" active="true">
    <name>Keyboard</name>
    <tag>hardware</tag>
    <tag>usb</tag>
    <price>49.90</price>
  </shop:item>
</catalog>`;

const SAMPLE_JSON = `{
  "catalog": {
    "_attributes": { "version": "1" },
    "item": [
      { "_attributes": { "id": "sku-1" }, "_text": "Keyboard" },
      { "_attributes": { "id": "sku-2" }, "_text": "Mouse" }
    ]
  }
}`;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
type Mode = "xml2json" | "json2xml";
type OutputView = "json" | "javascript";

function byteLabel(value: string): string {
  const bytes = new TextEncoder().encode(value).length;
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export function XmlJsonClient() {
  const [input, setInput] = useState(SAMPLE_XML);
  const [mode, setMode] = useState<Mode>("xml2json");
  const [options, setOptions] = useState<XmlToJsonOptions>(DEFAULT_XML_OPTIONS);
  const [outputView, setOutputView] = useState<OutputView>("json");
  const [variableName, setVariableName] = useState("parsedXml");
  const [includeExport, setIncludeExport] = useState(true);
  const [actionError, setActionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => mode === "xml2json"
    ? convertXmlToJson(input, options)
    : convertJsonToXml(input, options.compact, options.indent), [input, mode, options]);
  const javascriptOutput = useMemo(
    () => createJavaScriptOutput(result.data, variableName, includeExport),
    [includeExport, result.data, variableName],
  );
  const output = mode === "xml2json" && outputView === "javascript" ? javascriptOutput : result.data;

  function setOption<K extends keyof XmlToJsonOptions>(key: K, value: XmlToJsonOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function changeMode(nextMode: Mode, useOutput = false) {
    if (useOutput && result.isValid && result.data) setInput(result.data);
    else if (!input.trim()) setInput(nextMode === "xml2json" ? SAMPLE_XML : SAMPLE_JSON);
    setMode(nextMode);
    setOutputView("json");
    setActionError("");
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
      setActionError("This file is larger than 5 MB. Choose a smaller file to keep the browser responsive.");
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
    const isJavaScript = mode === "xml2json" && outputView === "javascript";
    const type = isJavaScript ? "text/javascript" : mode === "xml2json" ? "application/json" : "application/xml";
    const extension = isJavaScript ? "js" : mode === "xml2json" ? "json" : "xml";
    const url = URL.createObjectURL(new Blob([output], { type: `${type};charset=utf-8` }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `converted.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const status = !input.trim()
    ? `Waiting for ${mode === "xml2json" ? "XML" : "JSON"} input`
    : result.isValid
      ? `Valid ${mode === "xml2json" ? "XML" : "xml-js JSON"}`
      : `${result.error ?? "Invalid input"}${result.errorLine ? ` — line ${result.errorLine}${result.errorColumn ? `, column ${result.errorColumn}` : ""}` : ""}`;

  return (
    <div className="stagger-children mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">XML to JSON Converter for JavaScript</h1>
          <p className="mt-2 text-sm text-muted">Preserve attributes, namespaces, repeated elements and node order—then copy JSON or ready-to-use JavaScript.</p>
        </div>
        <div aria-label="Conversion direction" className="flex rounded-lg border border-border bg-input p-1" role="group">
          <button aria-pressed={mode === "xml2json"} className={`rounded-md px-4 py-2 text-xs font-semibold ${mode === "xml2json" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} onClick={() => changeMode("xml2json")} type="button">XML → JSON</button>
          <button aria-pressed={mode === "json2xml"} className={`rounded-md px-4 py-2 text-xs font-semibold ${mode === "json2xml" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} onClick={() => changeMode("json2xml")} type="button">JSON → XML</button>
        </div>
      </div>

      <section aria-label="Conversion options" className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="grid gap-1 text-xs text-muted">JSON shape
            <select className="rounded-lg border border-border bg-input px-3 py-2 text-foreground" onChange={(event) => setOption("compact", event.target.value === "compact")} value={options.compact ? "compact" : "verbose"}>
              <option value="compact">Compact object</option><option value="verbose">Preserve node order</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted">Indentation
            <select className="rounded-lg border border-border bg-input px-3 py-2 text-foreground" onChange={(event) => setOption("indent", event.target.value === "tab" ? "tab" : Number(event.target.value) as XmlJsonIndent)} value={options.indent}>
              <option value={0}>Minified</option><option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value="tab">Tabs</option>
            </select>
          </label>
          {mode === "xml2json" && <>
            <label className="flex items-center gap-2 text-xs text-foreground"><input checked={options.trim} onChange={(event) => setOption("trim", event.target.checked)} type="checkbox" />Trim text</label>
            <label className="flex items-center gap-2 text-xs text-foreground"><input checked={options.nativeType} onChange={(event) => setOption("nativeType", event.target.checked)} type="checkbox" />Numbers / booleans</label>
            <label className={`flex items-center gap-2 text-xs ${options.compact ? "text-foreground" : "text-muted"}`}><input checked={options.alwaysArray} disabled={!options.compact} onChange={(event) => setOption("alwaysArray", event.target.checked)} type="checkbox" />Always arrays</label>
            <label className="flex items-center gap-2 text-xs text-foreground"><input checked={!options.ignoreDeclaration} onChange={(event) => setOption("ignoreDeclaration", !event.target.checked)} type="checkbox" />Keep declaration</label>
            <label className="flex items-center gap-2 text-xs text-foreground"><input checked={!options.ignoreComment} onChange={(event) => setOption("ignoreComment", !event.target.checked)} type="checkbox" />Keep comments</label>
          </>}
        </div>
        <p className="mt-3 text-xs text-muted">Compact uses <code>_attributes</code> and <code>_text</code>. Preserve node order uses an <code>elements</code> array and is best for mixed text, comments, and child ordering.</p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={pasteInput} type="button">Paste</button>
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => fileInputRef.current?.click()} type="button">Upload {mode === "xml2json" ? "XML" : "JSON"}</button>
        <input accept={mode === "xml2json" ? "application/xml,text/xml,.xml,.txt" : "application/json,.json,.txt"} className="hidden" onChange={(event) => loadFile(event.target.files?.[0])} ref={fileInputRef} type="file" />
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(mode === "xml2json" ? SAMPLE_XML : SAMPLE_JSON); setActionError(""); }} type="button">Load sample</button>
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(""); setActionError(""); }} type="button">Clear</button>
        <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setInput(SAMPLE_XML); setMode("xml2json"); setOptions(DEFAULT_XML_OPTIONS); setOutputView("json"); setVariableName("parsedXml"); setIncludeExport(true); setActionError(""); }} type="button">Reset</button>
      </div>
      {actionError && <p className="text-sm text-danger" role="alert">{actionError}</p>}

      <div className="grid gap-6 lg:h-[620px] lg:grid-cols-2">
        <section aria-labelledby="xml-json-input-label" className="flex h-[360px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg lg:h-full">
          <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2"><label className="font-mono text-xs text-muted" htmlFor="xml-json-input" id="xml-json-input-label">input.{mode === "xml2json" ? "xml" : "json"}</label><span className="text-xs text-muted">{byteLabel(input)}</span></div>
          <textarea aria-describedby="xml-json-status" className="flex-1 resize-none whitespace-pre bg-transparent p-4 font-mono text-sm leading-relaxed text-code-foreground outline-none" id="xml-json-input" onChange={(event) => setInput(event.target.value)} placeholder={`Paste ${mode === "xml2json" ? "XML" : "xml-js JSON"} here`} spellCheck={false} value={input} />
          <div aria-live="polite" className={`border-t px-4 py-2 text-xs font-medium ${result.isValid && input.trim() ? "border-success/20 bg-success/10 text-success" : input.trim() ? "border-danger/20 bg-danger/10 text-danger" : "border-border bg-sidebar text-muted"}`} id="xml-json-status">{status}</div>
        </section>

        <section aria-labelledby="xml-json-output-label" className="flex h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-code-bg lg:h-full">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted" id="xml-json-output-label">output.{mode === "json2xml" ? "xml" : outputView === "json" ? "json" : "js"}</span>
              {mode === "xml2json" && <div aria-label="Output format" className="flex rounded-md border border-border bg-input p-0.5" role="group">{(["json", "javascript"] as OutputView[]).map((view) => <button aria-pressed={outputView === view} className={`rounded px-2 py-1 text-xs ${outputView === view ? "bg-card text-foreground" : "text-muted"}`} key={view} onClick={() => setOutputView(view)} type="button">{view === "javascript" ? "JavaScript" : "JSON"}</button>)}</div>}
            </div>
            <div className="flex items-center gap-2"><button className="text-xs font-semibold text-muted hover:text-foreground disabled:opacity-50" disabled={!output} onClick={downloadOutput} type="button">Download</button><CopyButton label="converted output" size="sm" text={output} /></div>
          </div>
          {mode === "xml2json" && outputView === "javascript" && <div className="flex flex-wrap items-center gap-3 border-b border-border bg-sidebar px-4 py-2"><label className="text-xs text-muted" htmlFor="xml-variable">Variable</label><input className="w-40 rounded-md border border-border bg-input px-2 py-1 text-xs text-foreground" id="xml-variable" onChange={(event) => setVariableName(event.target.value)} value={variableName} /><label className="flex items-center gap-2 text-xs text-foreground"><input checked={includeExport} onChange={(event) => setIncludeExport(event.target.checked)} type="checkbox" />ES module export</label></div>}
          <pre className="flex-1 overflow-auto whitespace-pre p-4 font-mono text-sm leading-relaxed text-code-foreground">{output || (input.trim() && !result.isValid ? "Fix the validation error to generate output." : "Converted output will appear here.")}</pre>
          <div className="flex items-center justify-between border-t border-border bg-sidebar px-4 py-2"><span className="text-xs text-muted">{byteLabel(output)}</span><button className="text-xs font-semibold text-primary hover:underline disabled:text-muted disabled:no-underline" disabled={!result.data} onClick={() => changeMode(mode === "xml2json" ? "json2xml" : "xml2json", true)} type="button">Use {mode === "xml2json" ? "JSON" : "XML"} as reverse input</button></div>
        </section>
      </div>

      <p className="text-xs text-muted">Privacy: parsing, file reading, conversion, copying, and downloads happen locally in this browser. Nothing is uploaded. Files are limited to 5 MB for browser responsiveness.</p>
    </div>
  );
}
