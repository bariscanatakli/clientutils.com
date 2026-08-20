# Autonomous SEO Product Roadmap

This is the cumulative product backlog and decision log for search-led improvements. Query synonyms belong to one useful workflow and canonical page, not duplicate landing pages.

## Demand baseline

Initial evidence comes from Google Search Console data supplied for **18 July–11 August 2026**. All listed queries had zero reported clicks and CTR. Treat these impressions as a prioritization seed and re-rank when newer search, repository, or product evidence becomes available.

## Product backlog

| Priority | Need cluster and evidence | User intent | Existing coverage | Missing functionality | Missing SEO/content | Status | Validation | Implementing commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | **cURL ↔ Axios** — `curl to axios` (6 impressions), `axios to curl` (2) | Move requests between terminal examples and JavaScript without losing method, headers, auth, query, or body | One canonical `/tools/curl-converter` workflow converts robust cURL→Axios/Fetch and safe literal Axios→cURL with validation, samples, paste/copy/download/reset and private browser processing | Multipart/FormData and variable-dependent Axios expressions; monitor real query/CTR evidence before expanding | Bidirectional metadata/H1, steps, honest limits, privacy, FAQ, structured data and related links are complete | Complete for supported literal workflows | Lint, production build, deterministic bidirectional cases, rejection cases and rendered metadata | `8603aa3` cURL→Axios; this commit — `feat: add safe Axios to cURL conversion` |
| P1 | **Tailwind gradients** — `tailwind gradient generator` (3), `tailwind css gradient generator` (2) | Visually compose a gradient and copy valid Tailwind classes | `/tools/css-gradient` is one canonical Tailwind-first visual workflow with linear/radial/conic modes, 2–5 positioned stops, presets, reverse/reset, Tailwind v4/v3 output, HTML/CSS copy and CSS download | Monitor real query/CTR evidence; consider transparency and interpolation controls only if demand appears | Tailwind intent, unique metadata/H1, steps, version guidance, examples, FAQ, privacy, structured data, breadcrumb and related color tool are complete | Complete | Lint, production build, deterministic v4/v3 generation cases and rendered metadata | This commit — `feat: complete Tailwind gradient generator` |
| P2 | **JSON compress/minify/format** — five variants, 9 total impressions | Move between readable and compact JSON, validate content, and understand size savings | One canonical `/tools/json-formatter` workflow supports paste/upload/sample, line-column errors, formatted/minified/tree output, UTF-8 size savings, copy/download/use-as-input/reset and local processing; `/tools/json-minifier` permanently redirects | Monitor real query/CTR evidence; binary GZIP/Brotli is intentionally outside the text workflow | Unified intent, metadata/H1, steps, accurate minification-vs-compression explanation, examples, FAQ, privacy, structured data, breadcrumb and related links are complete; duplicate removed from navigation/sitemap | Complete | Lint, production build, deterministic null/Unicode/error/format/minify metrics, redirect and rendered metadata | This commit — `feat: consolidate JSON format and minify workflow` |
| P3 | **UUID generate/validate** — misspelled `uudi` (3) | Generate UUIDs in batches and validate/version-inspect values | One canonical `/tools/uuid-generator` workflow generates UUID v1/v4/v7 and ULID batches, validates pasted/uploaded values, normalizes compact UUIDs, detects versions/variants and exposes ULID timestamps | Monitor real query/CTR evidence; UUID v7 timestamp decoding can be added if actual use justifies it | Unique metadata/H1, steps, format guidance, validation limits, privacy, FAQ, structured data, breadcrumb and related links are complete; the typo appears once as a useful correction | Complete | Lint, production build, deterministic generation/normalization/version/variant/ULID/invalid cases and rendered metadata | This commit — `feat: complete UUID generator and validator` |
| P4 | **Cron calculator/tester/wizard** — four variants, 5 total impressions | Build, explain, validate, and preview runs in a timezone | Generator and parser pages exist | Audit presets, timezone/DST, validation, next runs and whether the pages should form one workflow | One canonical intent with accurate terminology, examples and FAQ | Planned | Pending | — |
| P5 | **Hash generator** — `generator hash` (1) | Hash and verify text/files with clear algorithm choices | `/tools/hash-generator` exists | Audit file input, encodings, algorithm coverage, copy/download/reset and security guidance | Strengthen metadata, examples, limitations and related links | Planned | Pending | — |
| P6 | **XML to JSON for JavaScript** — `xml to json javascript` (1) | Convert XML locally into JSON usable in JavaScript | `/tools/xml-json` exists | Audit attributes, namespaces, arrays, upload/sample, validation and export | Align the existing canonical page to JavaScript intent | Planned | Pending | — |
| P7 | **Line trim/dedupe/sort** — `line tools text trim dedupe sort` (2) | Clean pasted lists in one predictable pass | `/tools/line-sort` exists | Audit trim, blanks, case-sensitive dedupe, stable/natural/numeric sort, stats and export | Present one complete line-cleaning workflow with examples and canonical metadata | Planned | Pending | — |

## Decision log

### UUID generation and validation workflow

- **Evidence:** The supplied misspelled query `uudi` had 3 impressions. The existing UUID page generated UUID v1/v4/v7 and ULID values, but its unused validator was not exposed, compact UUID handling returned vague labels, the workflow had no download/upload/reset path, and the content incorrectly implied browser UUID v1 generation read a device MAC address.
- **Decision:** Complete the existing canonical `/tools/uuid-generator` page rather than creating typo or validator doorway pages. Mention the transposition once in a useful FAQ answer and keep the title, metadata and H1 focused on the standard UUID term.
- **Change:** Add explicit Generate and Validate & inspect modes; quantity input, copy/download/reset, paste/upload/sample/clear, a 1 MB file and 500-value responsiveness limit, normalized copy, UUID version/variant and Nil/Max recognition, ULID timestamp decoding, actionable invalid messages, accessible status and local-processing/security guidance. Correct UUID v1 privacy wording.
- **Validation:** `npm run lint`, `npm run build`, deterministic UUID v1/v4/v7/ULID generation, compact/uppercase normalization, version/variant/Nil/Max detection, invalid-input and 500-value cap cases, plus prerendered metadata/JSON-LD/content inspection.
- **Implementing commit:** This commit — `feat: complete UUID generator and validator`.
- **Remaining gap:** UUID v7 timestamp decoding is useful but not necessary for structural validation; monitor actual evidence before extending the inspector.
- **Next recommended increment:** Audit the cron generator/parser pair and consolidate it into one calculator/tester/wizard workflow (P4).

### Consolidated JSON format and minify workflow

- **Evidence:** Five supplied query variants totalled 9 impressions, while the repository split the same intent across formatter and minifier pages. The minifier duplicated parsing logic, lacked upload/sample/download, and measured JavaScript string length as bytes.
- **Decision:** Use `/tools/json-formatter` as the single canonical page. Preserve old inbound links with a permanent `/tools/json-minifier` redirect and remove that duplicate from navigation and sitemap.
- **Change:** Combine formatted, minified/compact and tree outputs; add paste, local file upload with a 5 MB responsiveness limit, sample, clear, copy, download and use-as-input actions. Report actionable line/column errors and true UTF-8 byte savings, including valid top-level `null`. Add accessible labels, mobile layout, explicit local privacy, structured data, breadcrumb, steps, validation examples, FAQ and related JSON links. Clearly distinguish whitespace minification from binary GZIP/Brotli compression.
- **Validation:** `npm run lint`, `npm run build`, deterministic parse/format/minify/null/Unicode/error-location/byte-count cases, prerendered metadata/content, sitemap exclusion and permanent redirect inspection.
- **Implementing commit:** This commit — `feat: consolidate JSON format and minify workflow`.
- **Remaining gap:** Binary compression is a separate workflow and is not implied by this text utility; monitor evidence before adding browser CompressionStream controls.
- **Next recommended increment:** Completed by the following UUID generation and validation decision; move to cron calculator/tester/wizard (P4).

### Tailwind gradient generator

- **Evidence:** Supplied queries `tailwind gradient generator` (3 impressions) and `tailwind css gradient generator` (2) share one visual creation intent. The repository already used Tailwind CSS `^4`, while its generic gradient page emitted outdated v3 `bg-gradient-*` syntax and rejected radial/conic Tailwind output.
- **Decision:** Retarget the existing `/tools/css-gradient` canonical page instead of creating keyword or version duplicates. Default to Tailwind v4 and provide an exact arbitrary background-image class for v3 compatibility.
- **Change:** Generate current `bg-linear-*`, `bg-radial-*`, and `bg-conic-*` v4 classes with arbitrary colors and stop positions; fall back to exact arbitrary classes for v3 and 4–5 stops. Add reliable stop controls, four presets, reverse/reset, angle/origin settings, HTML and CSS output, CSS download, accessible labels, mobile layout and local-processing privacy copy. Replace thin generic content with version guidance, steps, patterns, FAQ, structured data, breadcrumb and an internal color-tool link.
- **Validation:** `npm run lint`, `npm run build`, deterministic linear/radial/conic and multi-stop v4/v3 cases, plus prerendered title/canonical/JSON-LD/content inspection.
- **Implementing commit:** This commit — `feat: complete Tailwind gradient generator`.
- **Remaining gap:** Transparency and interpolation-mode controls are useful extensions but are not justified by current evidence; monitor Search Console and usage before adding complexity.
- **Next recommended increment:** Consolidate the JSON format/minify/compress workflow (P2).

### Safe Axios to cURL workflow

- **Evidence:** `axios to curl` had 2 supplied impressions and was the remaining functional gap in the highest-priority bidirectional cluster.
- **Decision:** Add the reverse direction to the existing canonical page. Parse a deliberate literal-only Axios subset without `eval`, code execution, a server, or a new dependency.
- **Change:** Support Axios config/request calls and get/post/put/patch/delete/head/options helpers with literal URL/baseURL, method, params, headers, auth and data. Produce shell-quoted multiline cURL, JSON content type where needed, copy/download/sample/reset controls, direction-specific labels and actionable rejection messages for dynamic expressions.
- **Validation:** `npm run lint`, `npm run build`, deterministic method/config/params/auth/data/string-escaping cases, unsafe-expression rejection, and prerendered metadata inspection.
- **Implementing commit:** This commit — `feat: add safe Axios to cURL conversion`.
- **Remaining gap:** Multipart/FormData and dynamic variables require explicit structured input rather than unsafe JavaScript execution; defer until demand justifies the added UI.
- **Next recommended increment:** Audit and complete the existing Tailwind gradient generator (P1).

### cURL to Axios workflow — first product increment

- **Evidence:** `curl to axios` led the supplied demand set with 6 impressions; the existing parser lost common flags and the page lacked a complete paste-to-export workflow.
- **Decision:** Strengthen the existing canonical `/tools/curl-converter` page instead of creating a keyword variant. Axios is the default output while Fetch remains available.
- **Change:** Parse quoted and multiline commands, request methods, headers, JSON/data, GET query data, basic auth, cookies, referrers and user agents. Add actionable errors for unsupported multipart and local-file bodies, plus paste, sample, reset, copy, download, accessible labels, mobile controls and a client-side privacy statement. Add unique metadata, breadcrumbs, structured data, steps, limitations, FAQ and related-tool links.
- **Validation:** `npm run lint`, `npm run build`, deterministic Axios/Fetch cases, failure cases, and prerendered title/canonical/JSON-LD inspection.
- **Implementing commit:** This commit — `feat: complete cURL to Axios workflow`.
- **Remaining gap:** Resolved by the safe Axios→cURL increment; multipart/FormData remains intentionally deferred.
- **Next recommended increment:** Implemented by the following safe Axios→cURL decision; move to Tailwind gradients.

### Validation gate repair

- **Evidence:** The latest `main` checkout failed `npm run lint` with 68 errors and 26 warnings, blocking the required safe direct-to-main workflow.
- **Decision:** Repair the existing lint baseline as one operational increment before shipping search-led product changes. Rules were not disabled or weakened.
- **Change:** Replace unsafe `any` values with explicit unions or `unknown` narrowing; derive synchronous state with `useMemo`; defer effect-driven updates to timer callbacks with cleanup; remove unused values; use ESM for cron parsing; escape JSX text without changing rendered copy.
- **Validation:** `npm run lint` passes with zero errors and warnings. `npm run build` passes TypeScript and prerenders all 39 routes.
- **Implementing commit:** This commit — `fix: restore lint validation gate`.
- **Next recommended increment:** Complete the cURL→Axios workflow on the existing `/tools/curl-converter` canonical page.
