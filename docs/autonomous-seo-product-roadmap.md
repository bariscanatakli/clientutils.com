# Autonomous SEO Product Roadmap

This is the cumulative product backlog and decision log for search-led improvements. Query synonyms belong to one useful workflow and canonical page, not duplicate landing pages.

## Demand baseline

Initial evidence comes from Google Search Console data supplied for **18 July–11 August 2026**. All listed queries had zero reported clicks and CTR. Treat these impressions as a prioritization seed and re-rank when newer search, repository, or product evidence becomes available.

## Product backlog

| Priority | Need cluster and evidence | User intent | Existing coverage | Missing functionality | Missing SEO/content | Status | Validation | Implementing commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | **cURL ↔ Axios** — `curl to axios` (6 impressions), `axios to curl` (2) | Move requests between terminal examples and JavaScript without losing method, headers, auth, query, or body | `/tools/curl-converter` provides basic cURL→Fetch/Axios output | Robust common-flag parsing, actionable validation, paste/sample/download/reset, reverse Axios→cURL, multipart/FormData | Canonical Axios intent, unique metadata/H1, steps, examples, limitations, privacy, structured data, related links | Planned — next | Pending | — |
| P1 | **Tailwind gradients** — `tailwind gradient generator` (3), `tailwind css gradient generator` (2) | Visually compose a gradient and copy valid Tailwind classes | Generic `/tools/css-gradient` exists | Audit Tailwind version syntax, stops, arbitrary values, preview and export workflow | Retarget the existing page to one canonical Tailwind intent; add examples, FAQ and internal links | Planned | Pending | — |
| P2 | **JSON compress/minify/format** — five variants, 9 total impressions | Move between readable and compact JSON, validate content, and understand size savings | Separate formatter and minifier pages exist | Connect or consolidate workflow; paste/upload/sample, errors, size delta, copy/download/reset | Consolidate synonyms around one canonical intent without thin duplicates | Planned | Pending | — |
| P3 | **UUID generate/validate** — misspelled `uudi` (3) | Generate UUIDs in batches and validate/version-inspect values | `/tools/uuid-generator` exists | Audit versions, validator, batch controls, copy/download and deterministic messages | Handle the typo naturally in helpful copy/search recovery, never as repeated spam | Planned | Pending | — |
| P4 | **Cron calculator/tester/wizard** — four variants, 5 total impressions | Build, explain, validate, and preview runs in a timezone | Generator and parser pages exist | Audit presets, timezone/DST, validation, next runs and whether the pages should form one workflow | One canonical intent with accurate terminology, examples and FAQ | Planned | Pending | — |
| P5 | **Hash generator** — `generator hash` (1) | Hash and verify text/files with clear algorithm choices | `/tools/hash-generator` exists | Audit file input, encodings, algorithm coverage, copy/download/reset and security guidance | Strengthen metadata, examples, limitations and related links | Planned | Pending | — |
| P6 | **XML to JSON for JavaScript** — `xml to json javascript` (1) | Convert XML locally into JSON usable in JavaScript | `/tools/xml-json` exists | Audit attributes, namespaces, arrays, upload/sample, validation and export | Align the existing canonical page to JavaScript intent | Planned | Pending | — |
| P7 | **Line trim/dedupe/sort** — `line tools text trim dedupe sort` (2) | Clean pasted lists in one predictable pass | `/tools/line-sort` exists | Audit trim, blanks, case-sensitive dedupe, stable/natural/numeric sort, stats and export | Present one complete line-cleaning workflow with examples and canonical metadata | Planned | Pending | — |

## Decision log

### Validation gate repair

- **Evidence:** The latest `main` checkout failed `npm run lint` with 68 errors and 26 warnings, blocking the required safe direct-to-main workflow.
- **Decision:** Repair the existing lint baseline as one operational increment before shipping search-led product changes. Rules were not disabled or weakened.
- **Change:** Replace unsafe `any` values with explicit unions or `unknown` narrowing; derive synchronous state with `useMemo`; defer effect-driven updates to timer callbacks with cleanup; remove unused values; use ESM for cron parsing; escape JSX text without changing rendered copy.
- **Validation:** `npm run lint` passes with zero errors and warnings. `npm run build` passes TypeScript and prerenders all 39 routes.
- **Implementing commit:** This commit — `fix: restore lint validation gate`.
- **Next recommended increment:** Complete the cURL→Axios workflow on the existing `/tools/curl-converter` canonical page.
