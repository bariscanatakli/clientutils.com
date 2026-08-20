# Autonomous SEO Product Roadmap

This is the cumulative product backlog and decision log for search-led improvements. Query synonyms belong to one useful workflow and canonical page, not duplicate landing pages.

## Demand baseline

Initial evidence comes from Google Search Console data supplied for **18 July–11 August 2026**. All listed queries had zero reported clicks and CTR. Treat these impressions as a prioritization seed and re-rank when newer search, repository, or product evidence becomes available.

## Product backlog

| Priority | Need cluster and evidence | User intent | Existing coverage | Missing functionality | Missing SEO/content | Status | Validation | Implementing commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | **cURL ↔ Axios** — `curl to axios` (6 impressions), `axios to curl` (2) | Move requests between terminal examples and JavaScript without losing method, headers, auth, query, or body | One canonical `/tools/curl-converter` workflow converts robust cURL→Axios/Fetch and safe literal Axios→cURL with validation, samples, paste/copy/download/reset and private browser processing | Multipart/FormData and variable-dependent Axios expressions; monitor real query/CTR evidence before expanding | Bidirectional metadata/H1, steps, honest limits, privacy, FAQ, structured data and related links are complete | Complete for supported literal workflows | Lint, production build, deterministic bidirectional cases, rejection cases and rendered metadata | `8603aa3` cURL→Axios; this commit — `feat: add safe Axios to cURL conversion` |
| P1 | **Tailwind gradients** — `tailwind gradient generator` (3), `tailwind css gradient generator` (2) | Visually compose a gradient and copy valid Tailwind classes | Generic `/tools/css-gradient` exists | Audit Tailwind version syntax, stops, arbitrary values, preview and export workflow | Retarget the existing page to one canonical Tailwind intent; add examples, FAQ and internal links | Planned | Pending | — |
| P2 | **JSON compress/minify/format** — five variants, 9 total impressions | Move between readable and compact JSON, validate content, and understand size savings | Separate formatter and minifier pages exist | Connect or consolidate workflow; paste/upload/sample, errors, size delta, copy/download/reset | Consolidate synonyms around one canonical intent without thin duplicates | Planned | Pending | — |
| P3 | **UUID generate/validate** — misspelled `uudi` (3) | Generate UUIDs in batches and validate/version-inspect values | `/tools/uuid-generator` exists | Audit versions, validator, batch controls, copy/download and deterministic messages | Handle the typo naturally in helpful copy/search recovery, never as repeated spam | Planned | Pending | — |
| P4 | **Cron calculator/tester/wizard** — four variants, 5 total impressions | Build, explain, validate, and preview runs in a timezone | Generator and parser pages exist | Audit presets, timezone/DST, validation, next runs and whether the pages should form one workflow | One canonical intent with accurate terminology, examples and FAQ | Planned | Pending | — |
| P5 | **Hash generator** — `generator hash` (1) | Hash and verify text/files with clear algorithm choices | `/tools/hash-generator` exists | Audit file input, encodings, algorithm coverage, copy/download/reset and security guidance | Strengthen metadata, examples, limitations and related links | Planned | Pending | — |
| P6 | **XML to JSON for JavaScript** — `xml to json javascript` (1) | Convert XML locally into JSON usable in JavaScript | `/tools/xml-json` exists | Audit attributes, namespaces, arrays, upload/sample, validation and export | Align the existing canonical page to JavaScript intent | Planned | Pending | — |
| P7 | **Line trim/dedupe/sort** — `line tools text trim dedupe sort` (2) | Clean pasted lists in one predictable pass | `/tools/line-sort` exists | Audit trim, blanks, case-sensitive dedupe, stable/natural/numeric sort, stats and export | Present one complete line-cleaning workflow with examples and canonical metadata | Planned | Pending | — |

## Decision log

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
