"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { buildCronExpression, cronFieldsFromExpression, parseCronExpression, type CronFields, type CronLocale } from "@/lib/tools/cron-parser";

const DEFAULT_EXPRESSION = "0 9 * * 1-5";
const PRESETS = [
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at 02:00", value: "0 2 * * *" },
  { label: "Weekdays at 09:00", value: "0 9 * * 1-5" },
  { label: "Monthly on the 1st", value: "0 0 1 * *" },
  { label: "Yearly on Jan 1", value: "0 0 1 1 *" },
];
const TIMEZONES = ["UTC", "Europe/Istanbul", "Europe/Berlin", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo", "Asia/Singapore", "Australia/Sydney"];
const FIELD_DEFINITIONS: Array<{ key: keyof CronFields; label: string; hint: string }> = [
  { key: "second", label: "Second", hint: "0–59" },
  { key: "minute", label: "Minute", hint: "0–59" },
  { key: "hour", label: "Hour", hint: "0–23" },
  { key: "dayOfMonth", label: "Day of month", hint: "1–31" },
  { key: "month", label: "Month", hint: "1–12 or JAN–DEC" },
  { key: "dayOfWeek", label: "Day of week", hint: "0–7 or SUN–SAT" },
];

function defaultFields(includeSeconds: boolean): CronFields {
  return { ...(includeSeconds ? { second: "0" } : {}), minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" };
}

function formatRun(date: Date, timezone: string, locale: CronLocale): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    timeZone: timezone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(date);
}

export function CronParserClient() {
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION);
  const [locale, setLocale] = useState<CronLocale>("en");
  const [timezone, setTimezone] = useState("UTC");
  const [runCount, setRunCount] = useState(10);
  const parsedFields = useMemo(() => cronFieldsFromExpression(expression), [expression]);
  const includeSeconds = parsedFields?.second !== undefined;
  const result = useMemo(() => parseCronExpression(expression, { locale, timezone, count: runCount }), [expression, locale, timezone, runCount]);

  function updateField(key: keyof CronFields, value: string) {
    const fields = parsedFields ?? defaultFields(includeSeconds);
    setExpression(buildCronExpression({ ...fields, [key]: value }));
  }

  function toggleSeconds(enabled: boolean) {
    const fields = parsedFields ?? defaultFields(enabled);
    if (enabled) setExpression(buildCronExpression({ ...fields, second: fields.second ?? "0" }));
    else {
      const withoutSeconds = { ...fields };
      delete withoutSeconds.second;
      setExpression(buildCronExpression(withoutSeconds));
    }
  }

  function downloadSchedule() {
    if (!result.isValid) return;
    const content = [
      `Cron expression: ${expression.trim()}`,
      `Meaning: ${result.humanReadable}`,
      `Timezone: ${timezone}`,
      "",
      ...result.nextRuns.map((date, index) => `${index + 1}. ${formatRun(date, timezone, locale)} | ${date.toISOString()}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cron-schedule.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stagger-children mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cron Expression Generator, Tester &amp; Calculator</h1>
        <p className="mt-2 text-sm text-muted">Build or paste a cron schedule, validate it, explain it, and preview the next runs in a chosen timezone.</p>
      </div>

      <section aria-labelledby="cron-expression-heading" className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-foreground" htmlFor="cron-expression" id="cron-expression-heading">Cron expression</label>
            <input aria-describedby="cron-validation" className="w-full rounded-xl border border-input-border bg-input px-4 py-3 font-mono text-lg text-foreground outline-none focus:border-input-focus focus:ring-2 focus:ring-primary/20" id="cron-expression" onChange={(event) => setExpression(event.target.value)} placeholder="0 9 * * 1-5" spellCheck={false} value={expression} />
          </div>
          <div className="flex flex-wrap gap-2"><CopyButton label="cron expression" text={expression.trim()} /><button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" disabled={!result.isValid} onClick={downloadSchedule} type="button">Download schedule</button><button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-card-hover" onClick={() => { setExpression(DEFAULT_EXPRESSION); setLocale("en"); setTimezone("UTC"); setRunCount(10); }} type="button">Reset</button></div>
        </div>
        <p aria-live="polite" className={`text-sm ${result.isValid ? "text-success" : "text-danger"}`} id="cron-validation" role={result.isValid ? undefined : "alert"}>{result.isValid ? `Valid ${result.fieldCount}-field cron expression` : result.error}</p>
        <div aria-label="Cron presets" className="flex flex-wrap gap-2">{PRESETS.map((preset) => <button className={`rounded-full border px-3 py-1.5 text-xs font-medium ${expression === preset.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"}`} key={preset.value} onClick={() => setExpression(preset.value)} type="button">{preset.label}</button>)}</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <section aria-labelledby="wizard-heading" className="space-y-5 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-foreground" id="wizard-heading">Visual cron wizard</h2><p className="mt-1 text-xs text-muted">Use *, comma lists, ranges such as 1-5, or steps such as */15.</p></div><label className="flex cursor-pointer items-center gap-2 text-sm text-foreground"><input checked={includeSeconds} className="h-4 w-4 accent-primary" onChange={(event) => toggleSeconds(event.target.checked)} type="checkbox" />Include seconds</label></div>
          <div className="grid gap-4 sm:grid-cols-2">{FIELD_DEFINITIONS.filter((field) => field.key !== "second" || includeSeconds).map((field) => {
            const fields = parsedFields ?? defaultFields(includeSeconds);
            return <div key={field.key}><label className="mb-1 block text-sm font-medium text-foreground" htmlFor={`cron-${field.key}`}>{field.label} <span className="font-normal text-muted">({field.hint})</span></label><input className="w-full rounded-lg border border-input-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" id={`cron-${field.key}`} onChange={(event) => updateField(field.key, event.target.value)} spellCheck={false} value={fields[field.key] ?? ""} /></div>;
          })}</div>
        </section>

        <section aria-labelledby="calculator-options" className="space-y-5 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold text-foreground" id="calculator-options">Calculator options</h2>
          <div><label className="mb-1 block text-sm font-medium text-foreground" htmlFor="cron-timezone">Timezone</label><select className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" id="cron-timezone" onChange={(event) => setTimezone(event.target.value)} value={timezone}>{TIMEZONES.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select><p className="mt-2 text-xs text-muted">Named zones apply daylight-saving transitions automatically. UTC does not observe DST.</p></div>
          <div><label className="mb-1 block text-sm font-medium text-foreground" htmlFor="cron-run-count">Preview count</label><select className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" id="cron-run-count" onChange={(event) => setRunCount(Number(event.target.value))} value={runCount}><option value={5}>Next 5 runs</option><option value={10}>Next 10 runs</option><option value={20}>Next 20 runs</option></select></div>
          <div><span className="mb-1 block text-sm font-medium text-foreground">Description language</span><div aria-label="Description language" className="inline-flex rounded-lg border border-border bg-input p-1" role="group">{(["en", "tr"] as CronLocale[]).map((language) => <button aria-pressed={locale === language} className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase ${locale === language ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"}`} key={language} onClick={() => setLocale(language)} type="button">{language}</button>)}</div></div>
        </section>
      </div>

      <section aria-labelledby="cron-result-heading" className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-sidebar px-4 py-3"><h2 className="text-sm font-semibold text-foreground" id="cron-result-heading">Schedule test result</h2></div>
        {result.isValid ? <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]"><div className="border-b border-border p-6 lg:border-b-0 lg:border-r"><p className="text-xs font-bold uppercase tracking-wide text-muted">Meaning</p><p className="mt-3 text-xl font-semibold leading-relaxed text-primary">{result.humanReadable}</p><p className="mt-5 text-xs leading-relaxed text-muted">This tester calculates matching times only. It does not execute commands, create jobs, or contact a server.</p></div><div className="bg-code-bg p-4"><div className="mb-3 grid grid-cols-[2rem_1fr] gap-2 text-xs font-semibold text-muted sm:grid-cols-[2rem_1fr_12rem]"><span>#</span><span>{timezone}</span><span className="hidden sm:block">UTC / ISO 8601</span></div><ol className="space-y-2">{result.nextRuns.map((date, index) => <li className="grid grid-cols-[2rem_1fr] gap-2 rounded-lg px-2 py-2 text-sm text-code-foreground first:bg-primary-soft first:text-primary sm:grid-cols-[2rem_1fr_12rem]" key={date.toISOString()}><span className="font-bold text-muted">{index + 1}</span><span className="font-mono">{formatRun(date, timezone, locale)}</span><span className="hidden break-all font-mono text-xs text-muted sm:block">{date.toISOString()}</span></li>)}</ol></div></div> : <div className="p-10 text-center text-sm text-muted">Fix the validation error to calculate future runs.</div>}
      </section>

      <p className="text-xs text-muted">Privacy: expression parsing, validation, timezone calculation, and export happen locally in your browser. No schedule data is uploaded.</p>
    </div>
  );
}
