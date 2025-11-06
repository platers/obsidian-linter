# Repository Guidelines

## Project Structure & Module Organization
- `src/main.ts`: Obsidian plugin entry point. Bundled to `main.js`.
- `src/rules/*`: Independent lint rules. Register via imports in `src/rules-registry.ts`; executed by `src/rules-runner.ts`.
- `src/ui/*`: Settings UI, modals, suggesters, and components.
- `src/lang/locale/*.ts`: Translations. Use `npm run translate` to regenerate helper artifacts.
- Tests: unit in `__tests__/*.test.ts`; integration in `__integration__/*.test.ts` (plugin builds into `test-vault/.obsidian/plugins/obsidian-linter`).
- Docs: `docs/` (MkDocs). Do not edit `README.md` directly; regenerate from templates in `docs/templates/*`.

## Build, Test, and Development Commands
- `npm ci`: Install dependencies (required first run).
- `npm run dev`: Watch build for plugin/docs helpers; writes `main.js` and test-vault plugin bundle.
- `npm run build`: Production build (minified, no sourcemaps).
- `npm test`: Run Jest unit tests (integration excluded by default).
- `npm run test-suite "<name>"`: Run tests matching a name fragment.
- `npm run lint`: ESLint autofix (TypeScript + Google style).
- `npm run docs`: Regenerate `README.md` and rules docs.
- `npm run clear-jest`: Clear Jest cache. `npm run minify-css`: Build `styles.css`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; LF endings; UTF-8; final newline (`.editorconfig`).
- Language: TypeScript; strict options (`noImplicitAny`, etc.).
- Linting: ESLint with google, jest, unicorn, deprecation plugins. Fix issues before PRs.
- Naming: PascalCase classes, camelCase vars/functions, kebab-case file names where applicable. Do not commit build outputs (`main.js`, `docs.js`, `styles.css`).

## Testing Guidelines
- Framework: Jest with Babel + TypeScript (`babel-jest`).
- Unit tests live in `__tests__` and end with `.test.ts`. Prefer the shared helpers in `__tests__/common.ts` for rule tests.
- Integration tests live in `__integration__`; the dev/build step emits a runnable plugin to `test-vault/.../obsidian-linter/`.
- Run `npm test` locally and add tests for new rules/bug fixes.

## Commits & Pull Requests
- Commits: clear, present tense; scopes acceptable (e.g., `fix(ui): ...`).
- Before PR: `npm run lint && npm test && npm run build` (and `npm run docs` if docs/templates changed).
- PRs: include a concise description and link issues (e.g., `Fixes #123`). Screenshots welcome for UI changes.

## Security & Configuration
- Requires Node ≥ 15 (Node 18+ recommended). Use `nvm` for versioning.
- Don’t commit secrets or non-repo vault content. Keep `manifest.json`/`versions.json` changes consistent when bumping versions.
