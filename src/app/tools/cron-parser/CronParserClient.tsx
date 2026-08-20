"use client";

import { useMemo, useState } from "react";
import { parseCronExpression } from "@/lib/tools/cron-parser";
import { CopyButton } from "@/components/ui/CopyButton";

const PRESETS = [
  { label: "Her Dakika", value: "* * * * *" },
  { label: "Her Saat", value: "0 * * * *" },
  { label: "Her Gün (Gece Yarısı)", value: "0 0 * * *" },
  { label: "Hafta İçi Her Gün", value: "0 0 * * 1-5" },
  { label: "Pazartesi Sabah", value: "0 9 * * 1" },
];

export function CronParserClient() {
  const [expression, setExpression] = useState("* * * * *");
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const result = useMemo(() => parseCronExpression(expression, locale), [expression, locale]);

  return (
    <div className="stagger-children max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cron Expression Parser</h1>
        <p className="text-sm text-muted mt-2">
          Parse cron expressions instantly. Convert cron to human-readable text and see next run times.
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="cron-input" className="block text-sm font-medium text-foreground mb-2">
            Cron İfadesi
          </label>
          <input
            id="cron-input"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            className="w-full font-mono text-lg rounded-xl border border-input-border bg-input px-4 py-3
                       text-foreground transition-colors duration-200
                       focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {!result.isValid && result.error && (
            <p className="mt-2 text-sm text-danger animate-in slide-in-from-top-1">
              {result.error}
            </p>
          )}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setExpression(preset.value)}
              className="rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-medium text-muted
                         transition-colors duration-150 hover:bg-card-hover hover:text-foreground active:scale-97 pressable"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Human Readable Box */}
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="bg-sidebar border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Açıklama</h3>
            <div className="flex items-center gap-1 bg-input rounded-lg p-0.5 border border-border">
              <button
                onClick={() => setLocale("tr")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  locale === "tr" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  locale === "en" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[160px] text-center">
            {result.isValid ? (
              <>
                <p className="text-xl md:text-2xl font-semibold text-primary capitalize leading-tight">
                  {result.humanReadable}
                </p>
                <div className="mt-6 w-full flex justify-end">
                  <CopyButton text={result.humanReadable} size="sm" />
                </div>
              </>
            ) : (
              <p className="text-muted">Geçerli bir cron ifadesi girin</p>
            )}
          </div>
        </div>

        {/* Next Runs Box */}
        <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="bg-sidebar border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Sonraki 5 Çalışma Zamanı</h3>
            <span className="text-xs text-muted">Yerel Saat</span>
          </div>
          <div className="p-4 flex-1">
            {result.isValid ? (
              <ul className="space-y-2">
                {result.nextRuns.map((date, index) => {
                  const isFirst = index === 0;
                  return (
                    <li
                      key={index}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isFirst ? "bg-primary-soft text-primary" : "text-foreground hover:bg-sidebar-hover"
                      }`}
                    >
                      <span className={`text-xs font-bold w-6 ${isFirst ? "text-primary" : "text-muted"}`}>
                        #{index + 1}
                      </span>
                      <span className="font-mono text-sm">
                        {date.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted">Geçerli bir cron ifadesi girin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
