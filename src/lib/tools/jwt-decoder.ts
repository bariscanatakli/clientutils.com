export interface JwtPart {
  raw: string;
  decoded: any | null;
  error: string | null;
}

export interface JwtDecodeResult {
  isValid: boolean;
  header: JwtPart;
  payload: JwtPart;
  signature: string;
  isExpired: boolean | null;
  error: string | null;
}

function base64UrlDecode(str: string): string {
  // Convert Base64Url to Base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Safe decode for UTF-8
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}

function parseJwtPart(part: string): JwtPart {
  if (!part) return { raw: "", decoded: null, error: "Missing part" };
  
  try {
    const decodedStr = base64UrlDecode(part);
    try {
      const json = JSON.parse(decodedStr);
      return { raw: part, decoded: json, error: null };
    } catch (e) {
      return { raw: part, decoded: decodedStr, error: "Invalid JSON format" };
    }
  } catch (e) {
    return { raw: part, decoded: null, error: "Invalid Base64 format" };
  }
}

export function decodeJWT(token: string): JwtDecodeResult {
  const parts = token.trim().split('.');

  if (parts.length !== 3) {
    return {
      isValid: false,
      header: { raw: "", decoded: null, error: null },
      payload: { raw: "", decoded: null, error: null },
      signature: "",
      isExpired: null,
      error: "A valid JWT must have 3 parts separated by dots."
    };
  }

  const header = parseJwtPart(parts[0]);
  const payload = parseJwtPart(parts[1]);
  const signature = parts[2];

  let isExpired = null;
  if (payload.decoded && typeof payload.decoded === 'object' && payload.decoded.exp) {
    const expTimeMs = payload.decoded.exp * 1000;
    isExpired = Date.now() > expTimeMs;
  }

  const isValid = !header.error && !payload.error;

  return {
    isValid,
    header,
    payload,
    signature,
    isExpired,
    error: isValid ? null : "Failed to parse JWT parts."
  };
}

export function getClaimDescription(claim: string): string {
  const map: Record<string, string> = {
    iss: "Issuer",
    sub: "Subject",
    aud: "Audience",
    exp: "Expiration Time",
    nbf: "Not Before",
    iat: "Issued At",
    jti: "JWT ID",
    name: "Full Name",
    given_name: "Given Name",
    family_name: "Family Name",
    email: "Email Address",
    role: "User Role",
    scp: "Scopes",
    scope: "Scopes",
    azp: "Authorized Party",
  };
  return map[claim] || "Custom Claim";
}
