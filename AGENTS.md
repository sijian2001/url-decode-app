# Repository Guidelines

This repository contains a small Vite-based web app for URL encoding/decoding with a services + components architecture and comprehensive tests.

## Project Structure & Module Organization
- Source: `src/`
  - Entry & page: `src/index.html`, `src/main.js`
  - UI components: `src/components/` (e.g., `UrlInput.js`, `ResultDisplay.js`)
  - Core logic: `src/services/` (`urlEncoder.js`, `urlDecoder.js`, `validator.js`)
  - Styles: `src/styles/`
- Tests: `tests/` (`unit/`, `integration/`, `performance/`, `e2e/`, `browser/`)
- Build output: `dist/` (via Vite). Static assets may live in `public/`.

## Build, Test, and Development Commands
- `npm run dev` — Start Vite dev server at `http://localhost:5173`.
- `npm run build` — Production build to `dist/`.
- `npm run preview` — Serve the production build locally.
- `npm test` — Run Vitest (unit/integration) with jsdom and `tests/setup.js`.
- `npm run test:ui` — Vitest UI runner.
- `npm run test:e2e` — Run Playwright end-to-end tests; report in `playwright-report/`.
- `npm run lint` / `npm run lint:fix` — Lint (and auto-fix) with ESLint.
- `npm run format` — Format JS/CSS/HTML with Prettier.

## Coding Style & Naming Conventions
- JavaScript ES modules; prefer `const`, 2-space indentation.
- Components: `PascalCase` (e.g., `CopyButton.js`); services/utilities: `camelCase` files.
- Tests: `*.test.js` for unit/integration; `*.spec.js` for Playwright.
- Linting: ESLint (recommended rules + Prettier). Keep `no-console` noise minimal.

## Testing Guidelines
- Frameworks: Vitest (unit/integration, jsdom), Playwright (e2e/browser).
- Place tests under `tests/<type>/` mirroring `src/` structure when practical.
- Aim to test services in isolation and components via DOM interactions.
- Run all suites before PRs: `npm test && npm run test:e2e`.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- Commits should be small, focused, and reference issues when relevant.
- PRs must include: clear description, motivation, screenshots (UI changes), and test coverage notes.

## Security & Configuration Tips
- Do not commit secrets; keep test data non-sensitive.
- Node.js ≥ 18 recommended. Install deps with `npm ci` for reproducibility.
- Large artifacts (e.g., Playwright reports, screenshots) should not be hand-edited.

