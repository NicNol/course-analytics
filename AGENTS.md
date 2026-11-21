# Course Analytics

Next.js (Pages Router) site that summarizes Oregon State University CS course reviews. Node 24 is pinned in `package.json` and `.tool-versions`.

## Commands

- `npm run dev`: dev server on localhost:3000. It needs no environment variables.
- `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`: the four checks CI runs on every pull request.
- `npx vitest run tests/lib/survey.test.ts`: run one test file. Add `-t "name"` to run one test.
- `npm run typegen`: regenerates the Chakra theme types from `theme/system.ts`. `postinstall` runs it, so rerun it after editing the theme.

## Architecture

All data comes from one public Google Sheet, read as CSV. There's no database and no scraper.

- [lib/survey.ts](lib/survey.ts) is the only data source. `getReviews()` downloads the CSV, checks that the headers match `EXPECTED_HEADERS`, and expands each row into up to three `ICourse` reviews (one per course the student took that quarter). The headers check throws on any change to the form, so a renamed or reordered question fails loudly instead of misreading columns.
- `getReviews()` shares one in-flight download for five minutes and clears it on failure.
- [lib/classList.ts](lib/classList.ts) is the allowlist of courses. Survey rows for courses not in it are dropped, and the course pages are generated from it.
- [lib/summarize.ts](lib/summarize.ts) turns reviews into per-course summaries for three windows (All Time, Past 2 Years, Past 6 Months). [lib/summaries.ts](lib/summaries.ts) and [lib/courses.ts](lib/courses.ts) are the thin entry points the pages and API routes call.
- The home page ([pages/index.tsx](pages/index.tsx)) and course pages ([pages/courses/[courseid].tsx](pages/courses/[courseid].tsx)) use `getStaticProps` with `revalidate: 3600`. Course slugs and course codes convert with `CS-271` to `CS 271`.
- The public API lives in `pages/api/summary` and `pages/api/courses`. It's GET-only and sets `PUBLIC_API_CACHE_CONTROL` (five minutes). The README documents it for outside users, so don't change the response shapes casually.
- UI is Chakra UI v3 with Emotion. Course page reviews load after the first page, only when the user presses Next.

## Tests

Vitest runs two projects from [vitest.config.mts](vitest.config.mts): `*.test.ts` files run in Node and `*.test.tsx` files run in jsdom. Shared helpers are in `tests/support/` (fixtures, API mocks, a fixed clock). Mocks reset between tests automatically.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
