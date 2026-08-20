export function encodeUrl(url: string): string {
  try {
    return encodeURIComponent(url);
  } catch {
    return "";
  }
}

export function decodeUrl(url: string): { data: string; error: string | null } {
  try {
    return { data: decodeURIComponent(url), error: null };
  } catch {
    return { data: url, error: "Geçersiz URL formatı veya escape karakteri." };
  }
}
