export type BaseFormat = "text" | "hex" | "binary" | "octal" | "decimal";

export function convertBases(input: string, sourceFormat: BaseFormat): Record<BaseFormat, string> {
  const result: Record<BaseFormat, string> = {
    text: "",
    hex: "",
    binary: "",
    octal: "",
    decimal: ""
  };

  if (!input.trim()) return result;

  try {
    let bytes: Uint8Array;

    switch (sourceFormat) {
      case "text":
        bytes = new TextEncoder().encode(input);
        break;
      case "hex":
        const hexStr = input.replace(/[^0-9a-fA-F]/g, "");
        bytes = new Uint8Array(Math.ceil(hexStr.length / 2));
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(hexStr.substring(i * 2, i * 2 + 2), 16);
        }
        break;
      case "binary":
        const binWords = input.replace(/[^01]/g, "").match(/.{1,8}/g) || [];
        bytes = new Uint8Array(binWords.map(b => parseInt(b, 2)));
        break;
      case "octal":
        const octWords = input.trim().split(/\\s+/);
        bytes = new Uint8Array(octWords.map(o => parseInt(o, 8)));
        break;
      case "decimal":
        const decWords = input.trim().split(/\\s+/);
        bytes = new Uint8Array(decWords.map(d => parseInt(d, 10)));
        break;
      default:
        bytes = new Uint8Array(0);
    }

    if (bytes.length === 0 || bytes.some(isNaN)) return result;

    result.text = new TextDecoder("utf-8", { fatal: false }).decode(bytes).replace(/\\uFFFD/g, "");
    
    const hexArr: string[] = [];
    const binArr: string[] = [];
    const octArr: string[] = [];
    const decArr: string[] = [];

    bytes.forEach(b => {
      hexArr.push(b.toString(16).padStart(2, "0"));
      binArr.push(b.toString(2).padStart(8, "0"));
      octArr.push(b.toString(8).padStart(3, "0"));
      decArr.push(b.toString(10));
    });

    result.hex = hexArr.join(" ");
    result.binary = binArr.join(" ");
    result.octal = octArr.join(" ");
    result.decimal = decArr.join(" ");

  } catch {
    // Return empty on parse error
  }

  return result;
}
