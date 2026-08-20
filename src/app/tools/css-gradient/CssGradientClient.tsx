"use client";

import { useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  generateGradientCSS,
  generateHtmlExample,
  generateTailwindClass,
  type GradientConfig,
  type GradientType,
  type TailwindVersion,
} from "@/lib/tools/css-gradient";

const DEFAULT_CONFIG: GradientConfig = {
  type: "linear",
  angle: 90,
  shape: "circle",
  position: "center",
  stops: [
    { id: "default-1", color: "#4f46e5", position: 0 },
    { id: "default-2", color: "#7c3aed", position: 50 },
    { id: "default-3", color: "#ec4899", position: 100 },
  ],
};

const PRESETS: { name: string; colors: string[] }[] = [
  { name: "Aurora", colors: ["#06b6d4", "#8b5cf6", "#ec4899"] },
  { name: "Sunset", colors: ["#f97316", "#ef4444", "#7c3aed"] },
  { name: "Ocean", colors: ["#0ea5e9", "#2563eb", "#312e81"] },
  { name: "Forest", colors: ["#84cc16", "#16a34a", "#14532d"] },
];

function presetStops(colors: string[], prefix: string) {
  return colors.map((color, index) => ({
    id: `${prefix}-${index}`,
    color,
    position: Math.round((index / (colors.length - 1)) * 100),
  }));
}

export function CssGradientClient() {
  const [config, setConfig] = useState<GradientConfig>(DEFAULT_CONFIG);
  const [tailwindVersion, setTailwindVersion] = useState<TailwindVersion>("v4");
  const nextStopId = useRef(0);

  const cssString = useMemo(() => generateGradientCSS(config), [config]);
  const tailwindString = useMemo(() => generateTailwindClass(config, tailwindVersion), [config, tailwindVersion]);
  const htmlExample = useMemo(() => generateHtmlExample(config, tailwindVersion), [config, tailwindVersion]);
  const sortedStops = useMemo(() => [...config.stops].sort((first, second) => first.position - second.position), [config.stops]);
  const sliderTrackBackground = useMemo(
    () => `linear-gradient(to right, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`,
    [sortedStops],
  );

  function updateStop(id: string, update: { color?: string; position?: number }) {
    setConfig((current) => ({
      ...current,
      stops: current.stops.map((stop) => stop.id === id ? { ...stop, ...update } : stop),
    }));
  }

  function addStop() {
    if (config.stops.length >= 5) return;
    const ordered = [...config.stops].sort((first, second) => first.position - second.position);
    let position = 50;
    let largestGap = -1;
    for (let index = 0; index < ordered.length - 1; index += 1) {
      const gap = ordered[index + 1].position - ordered[index].position;
      if (gap > largestGap) {
        largestGap = gap;
        position = Math.round((ordered[index].position + ordered[index + 1].position) / 2);
      }
    }
    nextStopId.current += 1;
    setConfig((current) => ({ ...current, stops: [...current.stops, { id: `added-${nextStopId.current}`, color: "#ffffff", position }] }));
  }

  function removeStop(id: string) {
    if (config.stops.length <= 2) return;
    setConfig((current) => ({ ...current, stops: current.stops.filter((stop) => stop.id !== id) }));
  }

  function reverseGradient() {
    setConfig((current) => ({ ...current, stops: current.stops.map((stop) => ({ ...stop, position: 100 - stop.position })) }));
  }

  function applyPreset(name: string, colors: string[]) {
    setConfig((current) => ({ ...current, stops: presetStops(colors, name.toLowerCase()) }));
  }

  function resetGradient() {
    setConfig({ ...DEFAULT_CONFIG, stops: DEFAULT_CONFIG.stops.map((stop) => ({ ...stop })) });
    setTailwindVersion("v4");
  }

  function downloadCss() {
    const content = `.gradient {\n  background: ${cssString};\n}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/css;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gradient.css";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stagger-children mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tailwind Gradient Generator</h1>
          <p className="mt-2 text-sm text-muted">Design linear, radial, and conic gradients, then copy valid Tailwind v4 or v3-compatible classes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={reverseGradient} type="button">Reverse</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={resetGradient} type="button">Reset</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={downloadCss} type="button">Download CSS</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div aria-label="Gradient preview" className="relative flex h-[300px] w-full items-end justify-end overflow-hidden rounded-xl border border-border p-4 shadow-inner md:h-[420px]" style={{ background: cssString }}>
            <span className="rounded-xl border border-white/20 bg-black/20 px-4 py-2 font-mono text-sm text-white backdrop-blur-md">Live preview</span>
          </div>

          <section className="space-y-5 rounded-xl border border-border bg-card p-5" aria-labelledby="color-stops-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground" id="color-stops-heading">Color stops</h2>
              <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50" disabled={config.stops.length >= 5} onClick={addStop} type="button">+ Add stop</button>
            </div>

            <div className="relative mx-3 h-8 rounded-lg border border-border/50" style={{ background: sliderTrackBackground }}>
              {sortedStops.map((stop) => <span aria-hidden="true" className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md" key={stop.id} style={{ backgroundColor: stop.color, left: `${stop.position}%` }} />)}
            </div>

            <div className="space-y-3">
              {sortedStops.map((stop, index) => (
                <div className="grid grid-cols-[auto_82px_1fr_54px_auto] items-center gap-2 rounded-lg border border-border bg-input p-2" key={stop.id}>
                  <label className="relative h-9 w-9 overflow-hidden rounded-md border border-border" title={`Choose color for stop ${index + 1}`}>
                    <span className="sr-only">Color for stop {index + 1}</span>
                    <input className="absolute -inset-2 h-14 w-14 cursor-pointer" onChange={(event) => updateStop(stop.id, { color: event.target.value })} type="color" value={stop.color} />
                  </label>
                  <code className="text-xs text-foreground">{stop.color.toUpperCase()}</code>
                  <input aria-label={`Position for stop ${index + 1}`} className="accent-primary" max="100" min="0" onChange={(event) => updateStop(stop.id, { position: Number(event.target.value) })} type="range" value={stop.position} />
                  <div className="flex items-center rounded-md border border-border bg-card px-1">
                    <input aria-label={`Exact percentage for stop ${index + 1}`} className="w-8 bg-transparent py-1 text-right font-mono text-xs text-foreground outline-none" max="100" min="0" onChange={(event) => updateStop(stop.id, { position: Math.min(100, Math.max(0, Number(event.target.value))) })} type="number" value={stop.position} />
                    <span className="text-xs text-muted">%</span>
                  </div>
                  <button aria-label={`Remove color stop ${index + 1}`} className="rounded-md p-1.5 text-danger/70 hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30" disabled={config.stops.length <= 2} onClick={() => removeStop(stop.id)} type="button">×</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-5 rounded-xl border border-border bg-card p-5" aria-labelledby="gradient-settings-heading">
            <h2 className="text-sm font-semibold text-foreground" id="gradient-settings-heading">Gradient settings</h2>
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Type</span>
              <div className="flex rounded-lg border border-border bg-input p-1" role="group" aria-label="Gradient type">
                {(["linear", "radial", "conic"] as GradientType[]).map((type) => <button aria-pressed={config.type === type} className={`flex-1 rounded-md py-2 text-xs font-semibold capitalize ${config.type === type ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} key={type} onClick={() => setConfig((current) => ({ ...current, type }))} type="button">{type}</button>)}
              </div>
            </div>

            {(config.type === "linear" || config.type === "conic") && <div className="space-y-2">
              <div className="flex justify-between"><label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="gradient-angle">Angle</label><span className="font-mono text-xs text-foreground">{config.angle}°</span></div>
              <input className="w-full accent-primary" id="gradient-angle" max="359" min="0" onChange={(event) => setConfig((current) => ({ ...current, angle: Number(event.target.value) }))} type="range" value={config.angle} />
            </div>}

            {config.type === "radial" && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <label className="space-y-2 text-xs font-semibold uppercase tracking-wider text-muted">Shape<select className="block w-full rounded-lg border border-border bg-input px-3 py-2 text-sm normal-case text-foreground outline-none focus:ring-1 focus:ring-primary" onChange={(event) => setConfig((current) => ({ ...current, shape: event.target.value as GradientConfig["shape"] }))} value={config.shape}><option value="circle">Circle</option><option value="ellipse">Ellipse</option></select></label>
              <label className="space-y-2 text-xs font-semibold uppercase tracking-wider text-muted">Origin<select className="block w-full rounded-lg border border-border bg-input px-3 py-2 text-sm normal-case text-foreground outline-none focus:ring-1 focus:ring-primary" onChange={(event) => setConfig((current) => ({ ...current, position: event.target.value }))} value={config.position}>{["center", "top", "top right", "right", "bottom right", "bottom", "bottom left", "left", "top left"].map((position) => <option key={position} value={position}>{position}</option>)}</select></label>
            </div>}

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Presets</span>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => <button className="rounded-lg border border-border px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-card-hover" key={preset.name} onClick={() => applyPreset(preset.name, preset.colors)} style={{ backgroundImage: `linear-gradient(90deg, ${preset.colors.join(", ")})` }} type="button"><span className="rounded bg-black/35 px-1.5 py-0.5 text-white">{preset.name}</span></button>)}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-code-bg" aria-labelledby="tailwind-output-heading">
            <div className="flex items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2">
              <div className="flex items-center gap-2"><h2 className="text-xs font-semibold text-foreground" id="tailwind-output-heading">Tailwind classes</h2><div className="flex rounded-md border border-border bg-input p-0.5" role="group" aria-label="Tailwind version">{(["v4", "v3"] as TailwindVersion[]).map((version) => <button aria-pressed={tailwindVersion === version} className={`rounded px-2 py-1 text-[10px] font-semibold ${tailwindVersion === version ? "bg-card text-foreground" : "text-muted"}`} key={version} onClick={() => setTailwindVersion(version)} type="button">{version}</button>)}</div></div>
              <CopyButton label="Tailwind classes" size="sm" text={tailwindString} />
            </div>
            <pre className="whitespace-pre-wrap break-all p-4 font-mono text-xs text-info">{tailwindString}</pre>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-code-bg" aria-labelledby="html-example-heading">
            <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2"><h2 className="text-xs font-semibold text-foreground" id="html-example-heading">HTML example</h2><CopyButton label="HTML example" size="sm" text={htmlExample} /></div>
            <pre className="whitespace-pre-wrap break-all p-4 font-mono text-xs text-code-foreground">{htmlExample}</pre>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-code-bg" aria-labelledby="css-output-heading">
            <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-2"><h2 className="text-xs font-semibold text-foreground" id="css-output-heading">CSS fallback</h2><CopyButton label="CSS declaration" size="sm" text={`background: ${cssString};`} /></div>
            <pre className="whitespace-pre-wrap break-all p-4 font-mono text-xs text-code-foreground">background: {cssString};</pre>
          </section>
        </div>
      </div>

      <p className="text-xs text-muted">Privacy: the preview and all generated classes are produced in your browser. No colors or configuration are uploaded.</p>
    </div>
  );
}
