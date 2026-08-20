import { Tool, ToolCategory_Meta } from "@/types/tools";

// ============================================
// TOOL CATEGORIES
// ============================================

export const TOOL_CATEGORIES: ToolCategory_Meta[] = [
  {
    id: "formatters",
    name: "Formatlayıcılar",
    nameEn: "Formatters",
    icon: "📝",
    description: "JSON, SQL, XML ve daha fazlasını formatla ve doğrula",
  },
  {
    id: "encoders",
    name: "Kodlayıcılar",
    nameEn: "Encoders",
    icon: "🔐",
    description: "Base64, URL, JWT ve diğer kodlama/çözme araçları",
  },
  {
    id: "generators",
    name: "Üreticiler",
    nameEn: "Generators",
    icon: "⚡",
    description: "UUID, hash, şifre ve benzersiz kimlik üreticileri",
  },
  {
    id: "converters",
    name: "Çeviriciler",
    nameEn: "Converters",
    icon: "🔄",
    description: "Zaman, renk ve veri formatı dönüştürücüler",
  },
  {
    id: "helpers",
    name: "Yardımcılar",
    nameEn: "Helpers",
    icon: "🛠️",
    description: "Regex tester, diff checker ve diğer geliştirici yardımcıları",
  },
  {
    id: "text",
    name: "Metin Araçları",
    nameEn: "Text & Content",
    icon: "✍️",
    description: "Kelime sayacı, slug oluşturucu ve metin manipülasyonu",
  },
  {
    id: "web",
    name: "Web & HTTP",
    nameEn: "Web & HTTP",
    icon: "🌐",
    description: "cURL çeviriciler ve API test araçları",
  }
];

// ============================================
// ALL TOOLS — Single source of truth
// ============================================

export const TOOLS: Tool[] = [
  // --- DALGA 1 & 2 & 3 & 4 (MVP) ---
  {
    id: "cron-parser",
    name: "Cron Expression Parser",
    description:
      "Parse cron expressions instantly. Convert cron to human-readable text. See next 5 run times in your timezone. Supports all standard cron fields and special characters.",
    shortDescription: "Cron ifadelerini insan diline çevir",
    category: "converters",
    path: "/tools/cron-parser",
    seoKeyword: "cron expression reader",
    icon: "⏰",
  },
  {
    id: "uuid-generator",
    name: "UUID / ULID Generator",
    description:
      "Generate UUID v1, v4, v7 and ULID identifiers. Bulk generate up to 100 IDs at once. Copy individually or all at once with a single click.",
    shortDescription: "UUID v4/v7 ve ULID toplu üretimi",
    category: "generators",
    path: "/tools/uuid-generator",
    seoKeyword: "uuid generator v4",
    icon: "🆔",
    isPopular: true,
  },
  {
    id: "timestamp-converter",
    name: "Unix Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Auto-detects milliseconds. Shows multiple formats including ISO 8601, RFC 2822, and relative time.",
    shortDescription: "Epoch ↔ tarih çevirici",
    category: "converters",
    path: "/tools/timestamp-converter",
    seoKeyword: "epoch converter",
    icon: "📅",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter, Minifier & Validator",
    description:
      "Format, validate, minify, compact, and expand JSON locally. Upload or paste data, inspect line and column errors, compare UTF-8 size, use tree view, and download the result.",
    shortDescription: "JSON formatla, doğrula, küçült ve ağaçta incele",
    category: "formatters",
    path: "/tools/json-formatter",
    seoKeyword: "json formatter minifier compressor",
    icon: "{ }",
    isPopular: true,
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description:
      "Test regular expressions with real-time match highlighting. See capture groups, match indices, and use our library of common patterns. Replace mode included.",
    shortDescription: "Regex test, match vurgulama ve şablon kütüphanesi",
    category: "helpers",
    path: "/tools/regex-tester",
    seoKeyword: "online regex tester",
    icon: "🔍",
    isPopular: true,
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    description:
      "Encode and decode Base64 strings. Drag-and-drop file and image support with instant preview. Supports text and binary data.",
    shortDescription: "Base64 kodlama/çözme, dosya sürükle-bırak",
    category: "encoders",
    path: "/tools/base64-encoder",
    seoKeyword: "base64 decode online",
    icon: "🔣",
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description:
      "Decode JWT tokens and inspect Header, Payload, and Signature with color-coded sections. Check expiration status and standard claim descriptions.",
    shortDescription: "JWT Header, Payload, Signature renk kodlu çözme",
    category: "encoders",
    path: "/tools/jwt-decoder",
    seoKeyword: "jwt decoder",
    icon: "🎟️",
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description:
      "Generate MD5, SHA-1, SHA-256, SHA-512, and bcrypt hashes simultaneously. File hashing support. Verify mode to check if text matches a known hash.",
    shortDescription: "MD5, SHA-256, bcrypt tek tabloda",
    category: "generators",
    path: "/tools/hash-generator",
    seoKeyword: "sha256 hash generator",
    icon: "#️⃣",
  },
  {
    id: "css-gradient-generator",
    name: "Tailwind Gradient Generator",
    description:
      "Build linear, radial, and conic gradients visually. Control colors and stop positions, then copy valid Tailwind v4 or v3-compatible classes, HTML, and CSS.",
    shortDescription: "Tailwind v4/v3 gradient sınıfları ve canlı önizleme",
    category: "helpers",
    path: "/tools/css-gradient",
    seoKeyword: "tailwind gradient generator",
    icon: "🎨",
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description:
      "Format SQL queries with support for MySQL, PostgreSQL, and Standard SQL dialects. Syntax highlighting, indentation options, and keyword casing.",
    shortDescription: "SQL formatlama, MySQL/PostgreSQL lehçe desteği",
    category: "formatters",
    path: "/tools/sql-formatter",
    seoKeyword: "format sql query",
    icon: "🗄️",
  },
  {
    id: "url-encoder",
    name: "URL Encoder / Decoder",
    description:
      "Encode and decode URLs. Parse query string parameters into a clean table. View URL components breakdown (protocol, host, path, query, fragment).",
    shortDescription: "URL kodlama/çözme, query string ayrıştırma",
    category: "encoders",
    path: "/tools/url-encoder",
    seoKeyword: "url encode text",
    icon: "🔗",
  },
  {
    id: "color-converter",
    name: "Color Code Converter",
    description:
      "Convert between HEX, RGB, HSL, and RGBA color formats. Live color preview, shade generation, and nearest Tailwind CSS color class suggestion.",
    shortDescription: "HEX ↔ RGB ↔ HSL, Tailwind renk sınıfı",
    category: "converters",
    path: "/tools/color-converter",
    seoKeyword: "hex to rgb",
    icon: "🌈",
  },
  {
    id: "xml-to-json",
    name: "XML to JSON Converter",
    description:
      "Convert XML to JSON and JSON to XML instantly. Handles large files without browser freezing using optimized parsing.",
    shortDescription: "XML ↔ JSON dönüşümü, büyük dosya desteği",
    category: "converters",
    path: "/tools/xml-json",
    seoKeyword: "convert xml to json",
    icon: "📄",
  },
  {
    id: "diff-checker",
    name: "Diff Checker",
    description:
      "Compare two text blocks and see differences highlighted line-by-line. Side-by-side and unified diff views. Shows added, removed, and unchanged lines.",
    shortDescription: "İki metin arasındaki farkları satır bazlı göster",
    category: "helpers",
    path: "/tools/diff-checker",
    seoKeyword: "diff checker online",
    icon: "📊",
  },

  // --- PHASE 2 (High Traffic Additions) ---
  {
    id: "yaml-formatter",
    name: "YAML Formatter & Converter",
    description:
      "Format YAML files and convert seamlessly between YAML and JSON. Offline, secure, and preserves data types.",
    shortDescription: "YAML formatla, JSON'a çevir",
    category: "formatters",
    path: "/tools/yaml-formatter",
    seoKeyword: "yaml to json converter",
    icon: "📝",
    isNew: true,
  },
  {
    id: "json-diff",
    name: "JSON Compare",
    description:
      "Compare two JSON objects structure-wise. Ignores formatting and spacing differences to highlight actual data changes.",
    shortDescription: "JSON verilerini formatlamadan bağımsız karşılaştır",
    category: "formatters",
    path: "/tools/json-diff",
    seoKeyword: "json compare tool",
    icon: "⚖️",
    isNew: true,
  },
  {
    id: "word-counter",
    name: "Word & Character Counter",
    description:
      "Instantly count words, characters, lines, and paragraphs. See estimated reading time without sending data to servers.",
    shortDescription: "Kelime, karakter, satır sayacı",
    category: "text",
    path: "/tools/word-counter",
    seoKeyword: "word counter",
    icon: "🔢",
    isNew: true,
  },
  {
    id: "slug-generator",
    name: "URL Slug Generator",
    description:
      "Convert article titles and strings into SEO-friendly URL slugs. Removes stop words and normalizes accents.",
    shortDescription: "SEO uyumlu URL ve Slug oluşturucu",
    category: "text",
    path: "/tools/slug-generator",
    seoKeyword: "url slug generator",
    icon: "🔗",
    isNew: true,
  },
  {
    id: "curl-converter",
    name: "cURL to Axios Converter",
    description:
      "Convert cURL commands into Axios or JavaScript Fetch code with headers, JSON bodies, authentication, cookies, and query parameters preserved.",
    shortDescription: "cURL komutlarını Axios veya Fetch koduna çevir",
    category: "web",
    path: "/tools/curl-converter",
    seoKeyword: "curl to axios",
    icon: "💻",
    isNew: true,
    isPopular: true,
  },
  {
    id: "cron-generator",
    name: "Cron Expression Generator",
    description:
      "Build cron expressions visually with interactive dropdowns. See real-time validation and next execution times.",
    shortDescription: "Görsel arayüzle Cron job oluştur",
    category: "generators",
    path: "/tools/cron-generator",
    seoKeyword: "cron expression generator",
    icon: "⚙️",
    isNew: true,
  },

  // --- PHASE 3: SPRINT 1 (Data & Text) ---
  {
    id: "json-escape",
    name: "JSON Escape / Unescape",
    description: "Safely escape JSON strings to embed them inside other JSON objects or code blocks.",
    shortDescription: "JSON stringlerini güvenle kaçış karakterine çevir",
    category: "formatters",
    path: "/tools/json-escape",
    seoKeyword: "json string escape",
    icon: "🛡️",
    isNew: true,
  },
  {
    id: "csv-json",
    name: "CSV to JSON Converter",
    description: "Convert CSV (Comma Separated Values) data to JSON arrays and vice versa instantly.",
    shortDescription: "CSV ↔ JSON çift yönlü çevirici",
    category: "converters",
    path: "/tools/csv-json",
    seoKeyword: "csv to json converter",
    icon: "📊",
    isNew: true,
  },
  {
    id: "toml-json",
    name: "TOML to JSON Converter",
    description: "Convert TOML configuration files to JSON and parse JSON back into TOML format.",
    shortDescription: "TOML ↔ JSON ayar dosyası çevirici",
    category: "converters",
    path: "/tools/toml-json",
    seoKeyword: "toml to json converter",
    icon: "⚙️",
    isNew: true,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between camelCase, snake_case, PascalCase, kebab-case, and more.",
    shortDescription: "camelCase, snake_case metin çevirici",
    category: "text",
    path: "/tools/case-converter",
    seoKeyword: "camel case converter",
    icon: "🔠",
    isNew: true,
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview / Editor",
    description: "Write and edit Markdown files with a live HTML preview. Supports GitHub Flavored Markdown.",
    shortDescription: "Canlı önizlemeli GFM Markdown editörü",
    category: "text",
    path: "/tools/markdown-preview",
    seoKeyword: "online markdown editor",
    icon: "📝",
    isNew: true,
  },
  {
    id: "line-sort",
    name: "Line Sort & Deduplicator",
    description: "Alphabetize text lines, remove duplicate entries, and delete empty lines instantly.",
    shortDescription: "Satır sıralama ve kopya temizleme",
    category: "text",
    path: "/tools/line-sort",
    seoKeyword: "sort lines alphabetically",
    icon: "📋",
    isNew: true,
  },
  {
    id: "html-encode",
    name: "HTML Entity Encode / Decode",
    description: "Securely encode special characters into HTML entities to prevent XSS attacks.",
    shortDescription: "HTML özel karakterlerini kodla/çöz",
    category: "encoders",
    path: "/tools/html-encode",
    seoKeyword: "html entity encoder",
    icon: "🛡️",
    isNew: true,
  },
  {
    id: "hex-converter",
    name: "Hex / ASCII / Binary Converter",
    description: "Instantly convert strings between text, hexadecimal, binary, octal, and decimal representations.",
    shortDescription: "Hex, Binary, Octal, Text çevirici",
    category: "encoders",
    path: "/tools/hex-converter",
    seoKeyword: "hex to ascii converter",
    icon: "🔢",
    isNew: true,
  },
  // --- SPRINT 2: BATCH 1 (Generators) ---
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure, random passwords. Customize length, uppercase, lowercase, numbers, and symbols. Cryptographically secure client-side generation.",
    shortDescription: "Kriptografik olarak güvenli, özelleştirilebilir şifre üretici",
    category: "generators",
    path: "/tools/password-generator",
    seoKeyword: "strong password generator",
    icon: "🔑",
    isNew: true,
  },
  {
    id: "bcrypt-generator",
    name: "Bcrypt Generator & Checker",
    description: "Hash passwords using the Bcrypt algorithm or verify if a string matches an existing Bcrypt hash. Adjust salt rounds for desired performance.",
    shortDescription: "Bcrypt hashleme ve doğrulama aracı",
    category: "generators",
    path: "/tools/bcrypt-generator",
    seoKeyword: "bcrypt hash generator online",
    icon: "🔐",
    isNew: true,
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate customized QR codes from text, URLs, or contact info. Download as PNG or SVG instantly without watermarks.",
    shortDescription: "Metin ve linkleri özelleştirilebilir QR koda çevir",
    category: "generators",
    path: "/tools/qr-code-generator",
    seoKeyword: "free qr code generator",
    icon: "📱",
    isNew: true,
    isPopular: true,
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your designs and mockups. Customize the number of paragraphs, sentences, or words.",
    shortDescription: "Tasarımcılar için Lorem Ipsum sahte metin üretici",
    category: "text",
    path: "/tools/lorem-ipsum",
    seoKeyword: "lorem ipsum generator",
    icon: "📃",
    isNew: true,
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getToolsByCategory(categoryId: string): Tool[] {
  return TOOLS.filter((tool) => tool.category === categoryId);
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolByPath(path: string): Tool | undefined {
  return TOOLS.find((tool) => tool.path === path);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.seoKeyword.toLowerCase().includes(q)
  );
}
