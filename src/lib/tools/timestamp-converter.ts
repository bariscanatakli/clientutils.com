export interface DateConversionResult {
  date: Date | null;
  isValid: boolean;
  isMilliseconds: boolean;
  formats: {
    iso: string;
    utc: string;
    local: string;
    relative: string;
  };
}

export function detectMilliseconds(timestamp: number): boolean {
  // Typical seconds timestamp for year 2026 is around 1.7 billion (10 digits)
  // Milliseconds would be 1.7 trillion (13 digits)
  // So a threshold like 100000000000 is safe
  return Math.abs(timestamp) > 100000000000;
}

export function getRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat("tr", { numeric: "auto" });
  const now = new Date();
  
  const diffInMs = date.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);
  const diffInMonths = Math.round(diffInDays / 30.436875);
  const diffInYears = Math.round(diffInDays / 365.25);

  if (Math.abs(diffInYears) > 0) return rtf.format(diffInYears, "year");
  if (Math.abs(diffInMonths) > 0) return rtf.format(diffInMonths, "month");
  if (Math.abs(diffInDays) > 0) return rtf.format(diffInDays, "day");
  if (Math.abs(diffInHours) > 0) return rtf.format(diffInHours, "hour");
  if (Math.abs(diffInMins) > 0) return rtf.format(diffInMins, "minute");
  return rtf.format(diffInSecs, "second");
}

export function timestampToDate(timestamp: number): DateConversionResult {
  if (isNaN(timestamp) || !isFinite(timestamp)) {
    return {
      date: null,
      isValid: false,
      isMilliseconds: false,
      formats: { iso: "", utc: "", local: "", relative: "" },
    };
  }

  const isMs = detectMilliseconds(timestamp);
  const finalTimestamp = isMs ? timestamp : timestamp * 1000;
  
  const date = new Date(finalTimestamp);
  const isValid = !isNaN(date.getTime());

  if (!isValid) {
     return {
      date: null,
      isValid: false,
      isMilliseconds: isMs,
      formats: { iso: "", utc: "", local: "", relative: "" },
    };
  }

  return {
    date,
    isValid: true,
    isMilliseconds: isMs,
    formats: {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString("tr-TR", { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      relative: getRelativeTime(date),
    },
  };
}

export function dateToTimestamp(date: Date, asMilliseconds: boolean = false): number {
  const ms = date.getTime();
  if (isNaN(ms)) return 0;
  return asMilliseconds ? ms : Math.floor(ms / 1000);
}
