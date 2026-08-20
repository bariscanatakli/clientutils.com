export function encodeText(text: string): string {
  try {
    // btoa doesn't handle unicode out of the box, we need to encode encodeURIComponent
    // but the standard way for Base64 with unicode is text encoder
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return "";
  }
}

export function decodeText(base64: string): { text: string; error: string | null } {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return { text: decoder.decode(bytes), error: null };
  } catch {
    return { text: "", error: "Geçersiz Base64 formatı" };
  }
}

export function encodeFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // reader.result is a data URI: data:[<mediatype>][;base64],<data>
      // We return the full data URI so it can be previewed or we can extract the base64 part
      resolve(result); 
    };
    reader.onerror = () => reject(new Error("Dosya okuma hatası"));
    reader.readAsDataURL(file);
  });
}

export function isValidBase64(input: string): boolean {
  if (input === '' || input.trim() === '') return false;
  try {
    // Attempt to decode, if it throws, it's not base64
    return btoa(atob(input)) === input || atob(input).length > 0;
  } catch {
    return false;
  }
}

export function getBase64Stats(input: string) {
  // Rough estimate of size in bytes
  // Base64 uses 4 characters to represent 3 bytes of data
  // Equals signs at the end are padding
  const paddingCount = (input.match(/=/g) || []).length;
  const byteSize = (input.length * 3) / 4 - paddingCount;
  
  return {
    charCount: input.length,
    byteSize: Math.max(0, byteSize),
    formattedSize: formatBytes(Math.max(0, byteSize))
  };
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
