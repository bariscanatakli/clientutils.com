export type TargetLanguage = 'fetch' | 'axios' | 'node-fetch';

export interface CurlResult {
  code: string;
  error: string | null;
}

export function convertCurl(curlString: string, target: TargetLanguage): CurlResult {
  if (!curlString || !curlString.trim()) {
    return { code: "", error: null };
  }

  try {
    // 1. Basic cleaning
    let str = curlString.trim();
    if (!str.startsWith("curl ")) {
      return { code: "", error: "Command must start with 'curl '" };
    }
    
    // Remove multi-line backslashes
    str = str.replace(/\\\n/g, " ");

    const headers: Record<string, string> = {};
    let url = "";
    let method = "";
    let data = "";

    // 2. Tokenize (handles quoted strings)
    const tokens = [];
    let current = "";
    let inQuote = false;
    let quoteChar = "";

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if ((char === "'" || char === '"') && (i === 0 || str[i - 1] !== "\\")) {
        if (!inQuote) {
          inQuote = true;
          quoteChar = char;
        } else if (quoteChar === char) {
          inQuote = false;
          quoteChar = "";
        } else {
          current += char;
        }
      } else if (char === " " && !inQuote) {
        if (current.trim()) tokens.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) tokens.push(current);

    // 3. Parse tokens
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token === "-H" || token === "--header") {
        const headerStr = tokens[++i];
        if (headerStr) {
          const splitIdx = headerStr.indexOf(":");
          if (splitIdx !== -1) {
            headers[headerStr.substring(0, splitIdx).trim()] = headerStr.substring(splitIdx + 1).trim();
          }
        }
      } else if (token === "-X" || token === "--request") {
        method = tokens[++i];
      } else if (token === "-d" || token === "--data" || token === "--data-raw" || token === "--data-binary") {
        data = tokens[++i] || "";
        if (!method) method = "POST";
      } else if (!token.startsWith("-") && !url) {
        url = token;
      }
    }

    if (!method) method = "GET";
    if (!url) return { code: "", error: "No URL found in the cURL command." };

    // 4. Generate Code
    let code = "";
    const hasHeaders = Object.keys(headers).length > 0;
    
    if (target === "fetch" || target === "node-fetch") {
      if (target === "node-fetch") {
        code += `import fetch from "node-fetch";\n\n`;
      }
      
      const options: any = { method };
      if (hasHeaders) options.headers = headers;
      if (data) {
        try {
          // Pretty print if it's JSON
          JSON.parse(data);
          options.body = `JSON.stringify(${data})`;
        } catch {
          options.body = `"${data.replace(/"/g, '\\"')}"`;
        }
      }

      let optionsStr = JSON.stringify(options, null, 2);
      // Clean up the JSON.stringify literal injection if body is JSON
      if (options.body && options.body.startsWith("JSON.stringify")) {
        optionsStr = optionsStr.replace(/"JSON\.stringify\(([\s\S]*)\)"/, "JSON.stringify($1)");
      }

      code += `fetch("${url}", ${optionsStr})\n`;
      code += `  .then(response => response.json())\n`;
      code += `  .then(data => console.log(data))\n`;
      code += `  .catch(error => console.error("Error:", error));`;
      
    } else if (target === "axios") {
      code += `import axios from "axios";\n\n`;
      
      const options: any = {
        method,
        url
      };
      if (hasHeaders) options.headers = headers;
      if (data) {
        try {
          options.data = JSON.parse(data);
        } catch {
          options.data = data;
        }
      }

      code += `axios({\n`;
      code += `  method: "${method}",\n`;
      code += `  url: "${url}"`;
      if (hasHeaders) {
        code += `,\n  headers: ${JSON.stringify(headers, null, 2).replace(/\\n/g, "\n  ")}`;
      }
      if (data) {
        code += `,\n  data: ${JSON.stringify(options.data, null, 2).replace(/\\n/g, "\n  ")}`;
      }
      code += `\n})\n`;
      code += `  .then(response => console.log(response.data))\n`;
      code += `  .catch(error => console.error(error));`;
    }

    return { code, error: null };
  } catch (err: any) {
    return { code: "", error: "Failed to parse command. Please check syntax." };
  }
}
