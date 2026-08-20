"use client";

import { useState, useMemo } from "react";
import { generateCron, CronConfig } from "@/lib/tools/cron-generator";
import { CopyButton } from "@/components/ui/CopyButton";

export function CronGeneratorClient() {
  const [config, setConfig] = useState<CronConfig>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*"
  });

  const result = useMemo(() => generateCron(config), [config]);

  // Preset buttons helper
  const applyPreset = (preset: CronConfig) => setConfig(preset);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cron Job Generator</h1>
          <p className="text-sm text-muted mt-2">
            Build cron expressions visually with instant readable descriptions and next run times.
          </p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <PresetButton label="Every Minute" config={{ minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" }} current={config} onSelect={applyPreset} />
        <PresetButton label="Every 5 Minutes" config={{ minute: "*/5", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" }} current={config} onSelect={applyPreset} />
        <PresetButton label="Every Hour" config={{ minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" }} current={config} onSelect={applyPreset} />
        <PresetButton label="Every Day at Midnight" config={{ minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" }} current={config} onSelect={applyPreset} />
        <PresetButton label="Every Monday at 9AM" config={{ minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1" }} current={config} onSelect={applyPreset} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        {/* Editor Settings */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <FieldEditor label="Minute (0-59)" value={config.minute} onChange={(v) => setConfig({ ...config, minute: v })} />
          <FieldEditor label="Hour (0-23)" value={config.hour} onChange={(v) => setConfig({ ...config, hour: v })} />
          <FieldEditor label="Day of Month (1-31)" value={config.dayOfMonth} onChange={(v) => setConfig({ ...config, dayOfMonth: v })} />
          <FieldEditor label="Month (1-12)" value={config.month} onChange={(v) => setConfig({ ...config, month: v })} />
          <FieldEditor label="Day of Week (0-6)" value={config.dayOfWeek} onChange={(v) => setConfig({ ...config, dayOfWeek: v })} />
        </div>

        {/* Results */}
        <div className="space-y-6">
           <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
             <span className="text-xs font-semibold text-primary uppercase tracking-wider">Cron Expression</span>
             <div className="text-4xl font-black font-mono tracking-widest text-foreground">
               {result.expression}
             </div>
             <CopyButton text={result.expression} label="Kopyala" />
           </div>

           <div className="bg-code-bg border border-border rounded-xl p-6 space-y-2">
             <span className="text-xs font-semibold text-muted uppercase tracking-wider">Description</span>
             <p className="text-sm font-medium text-success">{result.description}</p>
           </div>

           <div className="bg-code-bg border border-border rounded-xl overflow-hidden">
             <div className="bg-sidebar border-b border-border px-4 py-3">
               <span className="text-xs font-semibold text-muted uppercase tracking-wider">Next 5 Runs</span>
             </div>
             <ul className="divide-y divide-border/50">
                {result.nextRuns.map((run, i) => (
                  <li key={i} className="px-4 py-2.5 text-xs font-mono text-code-foreground">{run}</li>
                ))}
             </ul>
           </div>
        </div>

      </div>
    </div>
  );
}

function PresetButton({ label, config, current, onSelect }: { label: string, config: CronConfig, current: CronConfig, onSelect: (c: CronConfig) => void }) {
  const isActive = JSON.stringify(config) === JSON.stringify(current);
  return (
    <button
      onClick={() => onSelect(config)}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        isActive ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:border-primary/50'
      }`}
    >
      {label}
    </button>
  );
}

function FieldEditor({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4 last:border-0 last:pb-0">
      <label className="text-sm font-medium text-foreground min-w-[150px]">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="flex-1 max-w-[300px] bg-input border border-input-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
      />
    </div>
  );
}
