export type QrType = "text" | "url" | "wifi" | "email" | "sms" | "phone" | "vcard";
export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrPayloadInput {
  type: QrType;
  text: string;
  url: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsMessage: string;
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
}

export interface QrPayloadResult {
  payload: string;
  isValid: boolean;
  error: string | null;
  bytes: number;
}

export const DEFAULT_QR_INPUT: QrPayloadInput = {
  type: "url",
  text: "ClientUtils — private browser-based developer tools",
  url: "https://clientutils.com",
  wifiSsid: "ClientUtils Guest",
  wifiPassword: "safe;password:2026",
  wifiEncryption: "WPA",
  wifiHidden: false,
  emailTo: "hello@example.com",
  emailSubject: "Hello",
  emailBody: "I scanned your QR code.",
  phone: "+905551234567",
  smsMessage: "Hello from ClientUtils",
  firstName: "Ada",
  lastName: "Lovelace",
  organization: "Analytical Engine",
  jobTitle: "Programmer",
  contactEmail: "ada@example.com",
  contactPhone: "+441234567890",
  contactWebsite: "https://example.com",
};

const MAX_PAYLOAD_BYTES = 2000;

function result(payload: string, error: string | null = null): QrPayloadResult {
  const bytes = new TextEncoder().encode(payload).length;
  if (!error && bytes > MAX_PAYLOAD_BYTES) {
    return { payload: "", isValid: false, error: `Payload is ${bytes} bytes. Keep it under ${MAX_PAYLOAD_BYTES} bytes for a practical, scannable QR code.`, bytes };
  }
  return { payload: error ? "" : payload, isValid: error === null, error, bytes };
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizedPhone(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\+?[0-9 ()-]{5,24}$/.test(trimmed)) return null;
  return `${trimmed.startsWith("+") ? "+" : ""}${trimmed.replace(/\D/g, "")}`;
}

function validHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function escapeWifiValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/([;,:\"])/g, "\\$1");
}

export function escapeVCardValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function buildQrPayload(input: QrPayloadInput): QrPayloadResult {
  if (input.type === "text") {
    return input.text ? result(input.text) : result("", "Enter text to encode.");
  }

  if (input.type === "url") {
    const value = input.url.trim();
    return validHttpUrl(value) ? result(value) : result("", "Enter a complete http:// or https:// URL.");
  }

  if (input.type === "wifi") {
    const ssid = input.wifiSsid.trim();
    if (!ssid) return result("", "Enter the Wi-Fi network name (SSID).");
    if (input.wifiEncryption !== "nopass" && !input.wifiPassword) return result("", "Enter the Wi-Fi password or choose No password.");
    const password = input.wifiEncryption === "nopass" ? "" : escapeWifiValue(input.wifiPassword);
    return result(`WIFI:T:${input.wifiEncryption};S:${escapeWifiValue(ssid)};P:${password};H:${input.wifiHidden ? "true" : "false"};;`);
  }

  if (input.type === "email") {
    const address = input.emailTo.trim();
    if (!isEmail(address)) return result("", "Enter a valid recipient email address.");
    const params = new URLSearchParams();
    if (input.emailSubject) params.set("subject", input.emailSubject);
    if (input.emailBody) params.set("body", input.emailBody);
    return result(`mailto:${address}${params.size ? `?${params.toString()}` : ""}`);
  }

  if (input.type === "phone") {
    const phone = normalizedPhone(input.phone);
    return phone ? result(`tel:${phone}`) : result("", "Enter a valid phone number using digits and an optional country-code +.");
  }

  if (input.type === "sms") {
    const phone = normalizedPhone(input.phone);
    if (!phone) return result("", "Enter a valid SMS recipient number.");
    return result(`sms:${phone}${input.smsMessage ? `?body=${encodeURIComponent(input.smsMessage)}` : ""}`);
  }

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  if (!firstName && !lastName) return result("", "Enter at least a first or last name for the contact.");
  if (input.contactEmail && !isEmail(input.contactEmail.trim())) return result("", "Enter a valid contact email address.");
  const phone = input.contactPhone ? normalizedPhone(input.contactPhone) : null;
  if (input.contactPhone && !phone) return result("", "Enter a valid contact phone number.");
  if (input.contactWebsite && !validHttpUrl(input.contactWebsite.trim())) return result("", "Enter a complete contact website URL.");
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(fullName)}`,
    ...(input.organization ? [`ORG:${escapeVCardValue(input.organization.trim())}`] : []),
    ...(input.jobTitle ? [`TITLE:${escapeVCardValue(input.jobTitle.trim())}`] : []),
    ...(phone ? [`TEL;TYPE=CELL:${phone}`] : []),
    ...(input.contactEmail ? [`EMAIL:${input.contactEmail.trim()}`] : []),
    ...(input.contactWebsite ? [`URL:${input.contactWebsite.trim()}`] : []),
    "END:VCARD",
  ];
  return result(lines.join("\r\n"));
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function relativeLuminance(color: string): number {
  const values = [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = values.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number | null {
  if (!isHexColor(foreground) || !isHexColor(background)) return null;
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
