import cronstrue from "cronstrue";
import "cronstrue/locales/tr.js";
import { CronExpressionParser } from "cron-parser";

export type CronLocale = "en" | "tr";

export interface CronFields {
  second?: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronParseOptions {
  locale?: CronLocale;
  count?: number;
  timezone?: string;
  currentDate?: Date | string;
}

export interface CronParseResult {
  isValid: boolean;
  humanReadable: string;
  nextRuns: Date[];
  fieldCount: 5 | 6 | null;
  error?: string;
}

export function cronFieldsFromExpression(expression: string): CronFields | null {
  const fields = expression.trim().split(/\s+/);
  if (fields.length === 5) {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;
    return { minute, hour, dayOfMonth, month, dayOfWeek };
  }
  if (fields.length === 6) {
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = fields;
    return { second, minute, hour, dayOfMonth, month, dayOfWeek };
  }
  return null;
}

export function buildCronExpression(fields: CronFields): string {
  return [fields.second, fields.minute, fields.hour, fields.dayOfMonth, fields.month, fields.dayOfWeek].filter((field) => field !== undefined).join(" ");
}

function friendlyError(message: string, locale: CronLocale): string {
  const isTurkish = locale === "tr";
  if (/invalid.*second/i.test(message)) return isTurkish ? "Saniye alanı 0–59 aralığında olmalı." : "The seconds field must be between 0 and 59.";
  if (/invalid.*minute/i.test(message)) return isTurkish ? "Dakika alanı 0–59 aralığında olmalı." : "The minute field must be between 0 and 59.";
  if (/invalid.*hour/i.test(message)) return isTurkish ? "Saat alanı 0–23 aralığında olmalı." : "The hour field must be between 0 and 23.";
  if (/invalid.*day of month/i.test(message)) return isTurkish ? "Ayın günü alanı 1–31 aralığında olmalı." : "The day-of-month field must be between 1 and 31.";
  if (/invalid.*month/i.test(message)) return isTurkish ? "Ay alanı 1–12 aralığında olmalı." : "The month field must be between 1 and 12.";
  if (/invalid.*day of week/i.test(message)) return isTurkish ? "Haftanın günü alanı 0–7 aralığında olmalı." : "The day-of-week field must be between 0 and 7.";
  return isTurkish ? `Geçersiz cron ifadesi: ${message}` : `Invalid cron expression: ${message}`;
}

export function parseCronExpression(expression: string, options: CronParseOptions = {}): CronParseResult {
  const trimmed = expression.trim();
  const locale = options.locale ?? "en";
  const fields = cronFieldsFromExpression(trimmed);

  if (!trimmed) return { isValid: false, humanReadable: "", nextRuns: [], fieldCount: null, error: locale === "tr" ? "Bir cron ifadesi girin." : "Enter a cron expression." };
  if (!fields) return { isValid: false, humanReadable: "", nextRuns: [], fieldCount: null, error: locale === "tr" ? "Standart cron ifadesi 5, saniyeli ifade 6 alan içermeli." : "A standard cron expression needs 5 fields, or 6 when seconds are included." };

  try {
    const humanReadable = cronstrue.toString(trimmed, { locale, use24HourTimeFormat: true, dayOfWeekStartIndexZero: true });
    const interval = CronExpressionParser.parse(trimmed, {
      tz: options.timezone || "UTC",
      ...(options.currentDate ? { currentDate: options.currentDate } : {}),
    });
    const count = Math.min(20, Math.max(1, Math.floor(options.count ?? 5)));
    const nextRuns = Array.from({ length: count }, () => interval.next().toDate());
    return { isValid: true, humanReadable, nextRuns, fieldCount: fields.second === undefined ? 5 : 6 };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown validation error";
    return { isValid: false, humanReadable: "", nextRuns: [], fieldCount: fields.second === undefined ? 5 : 6, error: friendlyError(message, locale) };
  }
}
