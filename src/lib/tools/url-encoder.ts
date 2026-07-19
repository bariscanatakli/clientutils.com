export function encodeUrl(url: string): string {
  try {
    return encodeURIComponent(url);
  } catch (err) {
    return "";
  }
}

export function decodeUrl(url: string): { data: string; error: string | null } {
  try {
    return { data: decodeURIComponent(url), error: null };
  } catch (err) {
    return { data: url, error: "Geçersiz URL formatı veya escape karakteri." };
  }
}
