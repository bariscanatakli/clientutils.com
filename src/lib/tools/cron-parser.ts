import cronstrue from "cronstrue";
import "cronstrue/locales/tr.js";
import { CronExpressionParser } from "cron-parser";

export interface CronParseResult {
  isValid: boolean;
  humanReadable: string;
  nextRuns: Date[];
  error?: string;
}

export function parseCronExpression(
  expression: string,
  locale: "en" | "tr" = "tr",
  count: number = 5
): CronParseResult {
  const trimmed = expression.trim();

  if (!trimmed) {
    return {
      isValid: false,
      humanReadable: "",
      nextRuns: [],
    };
  }

  try {
    // 1. Get human-readable description
    const humanReadable = cronstrue.toString(trimmed, {
      locale,
      use24HourTimeFormat: true,
      dayOfWeekStartIndexZero: false,
    });

    // 2. Get next N runs
    const interval = CronExpressionParser.parse(trimmed);
    const nextRuns: Date[] = [];
    
    for (let i = 0; i < count; i++) {
      nextRuns.push(interval.next().toDate());
    }

    return {
      isValid: true,
      humanReadable,
      nextRuns,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Geçersiz cron ifadesi";
    
    // Make errors more user friendly
    let friendlyError = errorMessage;
    if (errorMessage.includes("invalid minute")) friendlyError = "Geçersiz dakika değeri (0-59 olmalı)";
    else if (errorMessage.includes("invalid hour")) friendlyError = "Geçersiz saat değeri (0-23 olmalı)";
    else if (errorMessage.includes("invalid day of month")) friendlyError = "Geçersiz gün değeri (1-31 olmalı)";
    else if (errorMessage.includes("invalid month")) friendlyError = "Geçersiz ay değeri (1-12 olmalı)";
    else if (errorMessage.includes("invalid day of week")) friendlyError = "Geçersiz haftanın günü değeri (0-7 olmalı)";
    else if (errorMessage.includes("Validation error")) friendlyError = "Geçersiz cron sözdizimi";
    else if (errorMessage.includes("Missing")) friendlyError = "Eksik cron alanı (5 veya 6 alan olmalı)";

    return {
      isValid: false,
      humanReadable: "",
      nextRuns: [],
      error: friendlyError,
    };
  }
}
