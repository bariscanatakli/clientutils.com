"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eye, EyeOff, RefreshCw, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { entropyLabel, generateCharacterPasswords, generatePassphrases, type CharacterPasswordOptions, type PassphraseOptions, type PasswordGenerationResult, type PasswordMode } from "@/lib/tools/password-generator";

const DEFAULT_CHARACTERS: CharacterPasswordOptions = { length: 20, quantity: 5, uppercase: true, lowercase: true, numbers: true, symbols: true, avoidAmbiguous: true, excluded: "" };
const DEFAULT_PHRASE: PassphraseOptions = { words: 6, quantity: 5, separator: "-", capitalize: false, numberSuffix: false };
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-50";
const fieldClass = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

function downloadText(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "clientutils-passwords.txt"; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function PasswordGeneratorClient() {
  const [mode, setMode] = useState<PasswordMode>("characters");
  const [characterOptions, setCharacterOptions] = useState(DEFAULT_CHARACTERS);
  const [phraseOptions, setPhraseOptions] = useState(DEFAULT_PHRASE);
  const [result, setResult] = useState<PasswordGenerationResult>({ values: [], entropyBits: null, poolSize: 0, error: null });
  const [revealed, setRevealed] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const generatedInitial = useRef(false);

  const generate = useCallback((nextMode = mode, nextCharacters = characterOptions, nextPhrase = phraseOptions) => {
    setResult(nextMode === "characters" ? generateCharacterPasswords(nextCharacters) : generatePassphrases(nextPhrase));
    setIsStale(false);
  }, [mode, characterOptions, phraseOptions]);

  useEffect(() => {
    if (generatedInitial.current) return;
    generatedInitial.current = true;
    const timer = window.setTimeout(() => generate("characters", DEFAULT_CHARACTERS, DEFAULT_PHRASE), 0);
    return () => window.clearTimeout(timer);
  }, [generate]);

  const updateCharacters = <K extends keyof CharacterPasswordOptions>(key: K, value: CharacterPasswordOptions[K]) => { setCharacterOptions((current) => ({ ...current, [key]: value })); setIsStale(true); };
  const updatePhrase = <K extends keyof PassphraseOptions>(key: K, value: PassphraseOptions[K]) => { setPhraseOptions((current) => ({ ...current, [key]: value })); setIsStale(true); };
  const switchMode = (next: PasswordMode) => { setMode(next); setIsStale(true); };
  const applyPreset = (preset: "website" | "maximum" | "phrase") => {
    if (preset === "phrase") { const next = { ...DEFAULT_PHRASE, words: 7 as const }; setMode("passphrase"); setPhraseOptions(next); generate("passphrase", characterOptions, next); return; }
    const next = { ...DEFAULT_CHARACTERS, length: preset === "website" ? 20 : 32, quantity: preset === "website" ? 5 : 10 };
    setMode("characters"); setCharacterOptions(next); generate("characters", next, phraseOptions);
  };
  const reset = () => { setMode("characters"); setCharacterOptions(DEFAULT_CHARACTERS); setPhraseOptions(DEFAULT_PHRASE); setRevealed(true); generate("characters", DEFAULT_CHARACTERS, DEFAULT_PHRASE); };
  const output = result.values.join("\n");
  const bits = result.entropyBits === null ? null : Math.floor(result.entropyBits * 10) / 10;

  return <main className="mx-auto max-w-6xl space-y-8">
    <header className="space-y-2"><h1 className="text-3xl font-bold tracking-tight">Secure Password &amp; Passphrase Generator</h1><p className="max-w-3xl text-lg text-muted">Generate unbiased random passwords that satisfy every selected character class, or readable compound-word passphrases, entirely in your browser.</p></header>

    <section className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex rounded-lg border border-border bg-background p-1" role="group" aria-label="Generation mode"><Toggle active={mode === "characters"} onClick={() => switchMode("characters")}>Random password</Toggle><Toggle active={mode === "passphrase"} onClick={() => switchMode("passphrase")}>Passphrase</Toggle></div><button type="button" className={buttonClass} onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</button></div>
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Quick presets</p><div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={() => applyPreset("website")}>20-character website</button><button type="button" className={buttonClass} onClick={() => applyPreset("maximum")}>32-character batch</button><button type="button" className={buttonClass} onClick={() => applyPreset("phrase")}>7-compound passphrase</button></div></div>

      {mode === "characters" ? <CharacterControls options={characterOptions} update={updateCharacters} /> : <PhraseControls options={phraseOptions} update={updatePhrase} />}

      <button type="button" onClick={() => generate()} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90"><RefreshCw className="h-4 w-4" /> Generate {mode === "characters" ? characterOptions.quantity : phraseOptions.quantity}</button>
      {isStale && <p className="text-center text-xs text-warning" role="status">Settings changed. Generate to apply them to the output.</p>}
      {result.error && <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger" role="alert">{result.error}</p>}
      <p className="text-xs leading-relaxed text-muted">Generation uses your browser&apos;s cryptographic random source with rejection sampling, so character selection avoids modulo bias. Nothing is uploaded or stored by this tool.</p>
    </section>

    <section className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Generated values</h2><p className="mt-1 text-xs text-muted">Each line is generated independently. Accidental duplicates are possible but increasingly unlikely as entropy grows.</p></div><div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} onClick={() => setRevealed((value) => !value)} disabled={!result.values.length}>{revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {revealed ? "Hide" : "Reveal"}</button><CopyButton text={output} label="all passwords" /><button type="button" className={buttonClass} onClick={() => downloadText(output)} disabled={!output}><Download className="h-4 w-4" /> Download .txt</button></div></div>
      {result.values.length ? <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-code-bg">{result.values.map((value, index) => <li key={`${value}-${index}`} className="flex items-center gap-3 p-3"><span className="w-7 shrink-0 text-right text-xs text-muted">{index + 1}</span><code className="min-w-0 flex-1 break-all text-sm sm:text-base">{revealed ? value : "•".repeat(Math.min(value.length, 64))}</code><CopyButton text={value} label={`value ${index + 1}`} size="sm" /></li>)}</ol> : <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">Choose valid settings and generate values.</p>}
      <div className="grid gap-3 sm:grid-cols-3"><Metric label="Estimated entropy" value={bits === null ? "—" : `${bits} bits`} detail="Per generated value" /><Metric label="Estimate" value={entropyLabel(result.entropyBits)} detail="Randomness only; not a site-policy verdict" /><Metric label={mode === "characters" ? "Character pool" : "Compound list"} value={result.poolSize ? result.poolSize.toLocaleString() : "—"} detail={mode === "characters" ? "After ambiguity/exclusion filters" : "16 × 16 combinations"} /></div>
    </section>
  </main>;
}

function CharacterControls({ options, update }: { options: CharacterPasswordOptions; update: <K extends keyof CharacterPasswordOptions>(key: K, value: CharacterPasswordOptions[K]) => void }) {
  return <div className="space-y-5 rounded-xl border border-border bg-background p-4"><div className="grid gap-4 sm:grid-cols-2"><NumberField label="Length" value={options.length} min={8} max={128} onChange={(value) => update("length", value)} /><NumberField label="Quantity" value={options.quantity} min={1} max={50} onChange={(value) => update("quantity", value)} /></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Check label="Uppercase" example="A–Z" checked={options.uppercase} onChange={(value) => update("uppercase", value)} /><Check label="Lowercase" example="a–z" checked={options.lowercase} onChange={(value) => update("lowercase", value)} /><Check label="Numbers" example="0–9" checked={options.numbers} onChange={(value) => update("numbers", value)} /><Check label="Symbols" example="! @ # $ …" checked={options.symbols} onChange={(value) => update("symbols", value)} /></div><div className="grid gap-4 sm:grid-cols-2"><label className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"><input type="checkbox" checked={options.avoidAmbiguous} onChange={(event) => update("avoidAmbiguous", event.target.checked)} /><span><strong className="block">Avoid ambiguous characters</strong><span className="text-xs text-muted">Removes values such as I, l, 1, O, 0 and |</span></span></label><label className="space-y-1"><span className="text-sm font-medium">Exclude custom characters</span><input className={fieldClass} value={options.excluded} maxLength={64} onChange={(event) => update("excluded", event.target.value)} placeholder={'Example: {}[]"'} /><span className="block text-xs text-muted">Every listed character is removed from its class.</span></label></div></div>;
}

function PhraseControls({ options, update }: { options: PassphraseOptions; update: <K extends keyof PassphraseOptions>(key: K, value: PassphraseOptions[K]) => void }) {
  return <div className="space-y-5 rounded-xl border border-border bg-background p-4"><div className="grid gap-4 sm:grid-cols-3"><NumberField label="Compound words" value={options.words} min={4} max={12} onChange={(value) => update("words", value)} /><NumberField label="Quantity" value={options.quantity} min={1} max={50} onChange={(value) => update("quantity", value)} /><label className="space-y-1"><span className="text-sm font-medium">Separator</span><select className={fieldClass} value={options.separator} onChange={(event) => update("separator", event.target.value as PassphraseOptions["separator"])}><option value="-">Hyphen (-)</option><option value=".">Dot (.)</option><option value="_">Underscore (_)</option><option value=" ">Space</option></select></label></div><div className="grid gap-3 sm:grid-cols-2"><Check label="Capitalize compounds" example="Amberanchor" checked={options.capitalize} onChange={(value) => update("capitalize", value)} /><Check label="Add two random digits" example="00–99 suffix" checked={options.numberSuffix} onChange={(value) => update("numberSuffix", value)} /></div><p className="text-xs leading-relaxed text-muted">Each compound is selected from 256 equally likely adjective+noun combinations, contributing 8 bits. These are generated words, not quotations or natural-language phrases.</p></div>;
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-md px-4 py-2 text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "text-muted hover:bg-card-hover hover:text-foreground"}`}>{children}</button>; }
function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) { return <label className="space-y-1"><span className="text-sm font-medium">{label}</span><input type="number" className={fieldClass} value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} /><span className="block text-xs text-muted">{min}–{max}</span></label>; }
function Check({ label, example, checked, onChange }: { label: string; example: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-card-hover"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span><strong className="block text-sm">{label}</strong><span className="text-xs text-muted">{example}</span></span></label>; }
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-lg border border-border bg-background p-3"><p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p><p className="mt-1 text-xs text-muted">{detail}</p></div>; }
