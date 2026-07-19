import { xml2json, json2xml, Options } from "xml-js";

export interface ConversionResult {
  data: string;
  isValid: boolean;
  error: string | null;
}

export function convertXmlToJson(xml: string, compact: boolean = true): ConversionResult {
  if (!xml.trim()) return { data: "", isValid: true, error: null };
  
  try {
    const jsonStr = xml2json(xml, { compact, spaces: 2 });
    return { data: jsonStr, isValid: true, error: null };
  } catch (err) {
    return { 
      data: "", 
      isValid: false, 
      error: err instanceof Error ? err.message : "Geçersiz XML formatı" 
    };
  }
}

export function convertJsonToXml(json: string, compact: boolean = true): ConversionResult {
  if (!json.trim()) return { data: "", isValid: true, error: null };
  
  try {
    // Validate JSON first
    JSON.parse(json);
    const xmlStr = json2xml(json, { compact, spaces: 2 });
    return { data: xmlStr, isValid: true, error: null };
  } catch (err) {
    return { 
      data: "", 
      isValid: false, 
      error: err instanceof Error ? err.message : "Geçersiz JSON formatı" 
    };
  }
}
