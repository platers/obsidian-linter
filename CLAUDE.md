# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Obsidian Linter is an Obsidian plugin that formats and styles markdown notes with configurable rules. The plugin enforces consistent markdown styling for YAML frontmatter, headings, footnotes, spacing, content formatting, and paste behavior.

## Build & Development Commands

### Building
- `npm run build` - Production build using esbuild
- `npm run dev` - Development build with watch mode
- `npm run compile` - Full compile (build + docs + lint + test)

### Testing
- `npm test` - Run all Jest tests
- `npm run test-suite` - Run specific test suite (set $1 to test name)
- `npm run clear-jest` - Clear Jest cache

### Linting & Docs
- `npm run lint` - Run ESLint with auto-fix
- `npm run docs` - Generate documentation (runs docs.js)
- `npm run translate` - Build and run translation helper

### Other
- `npm run minify-css` - Minify CSS using PostCSS

## Architecture Overview

### Core Components

**Main Plugin (`src/main.ts`)**
- Entry point: `LinterPlugin` class extends Obsidian's `Plugin`
- Manages settings, commands, event handlers, and file linting operations
- Handles paste events, file change detection, and custom commands
- Uses `AsyncLock` for custom command synchronization

**Rules System (`src/rules.ts` & `src/rules/`)**
- Rules are organized by type: YAML, Heading, Footnote, Content, Spacing, Paste
- Each rule is a class in `src/rules/` that extends `RuleBuilder<TOptions>`
- Rules are registered via decorator: `@RuleBuilder.register`
- Rule execution order respects `hasSpecialExecutionOrder` flag for dependencies
- Rules implement `apply(text: string, options: TOptions): string`

**Rule Builder Pattern (`src/rules/rule-builder.ts`)**
- Base class: `RuleBuilderBase` - manages static rule registry
- Main class: `RuleBuilder<TOptions>` - template for creating rules
- Each rule defines:
  - `OptionsClass` - typed options interface
  - `apply()` - core transformation logic
  - `exampleBuilders` - documentation examples
  - `optionBuilders` - UI option controls

**Rules Runner (`src/rules-runner.ts`)**
- `RulesRunner` class orchestrates rule execution
- Handles disabled rules from YAML frontmatter (`disabled rules:`)
- Runs rules in specific order: pre-rules → regular rules → post-rules
- Special handling for YAML timestamp, title, and escape rules

**Options System (`src/option.ts`)**
- Option types: `BooleanOption`, `TextOption`, `DropdownOption`, `TextAreaOption`, `MomentFormatOption`, `MdFilePickerOption`
- Options generate UI controls in settings tab
- Each rule has an 'enabled' option as first option

**Ignore Types (`src/utils/ignore-types.ts`)**
- Rules can ignore specific markdown elements during processing
- Types: code blocks, inline code, math, links, wikilinks, tags, YAML, custom ignore sections
- Custom ignore syntax: `<!-- linter-disable -->` / `<!-- linter-enable -->`

**YAML Processing (`src/utils/yaml.ts`)**
- Uses `yaml` package for parsing/stringifying frontmatter
- Handles YAML extraction, modification, and disabled rules detection
- Special handling for timestamp values and escape characters

**Markdown AST (`src/utils/mdast.ts`)**
- Uses `mdast` (markdown abstract syntax tree) for parsing
- Supports footnotes, math blocks, GFM task lists via micromark extensions
- Provides utilities for finding headings, links, tables, etc.

### Testing Architecture

**Test Structure (`__tests__/`)**
- One test file per rule: `{rule-name}.test.ts`
- Common utilities in `__tests__/common.ts`
- Mock Obsidian API in `__mocks__/obsidian.ts`
- Helper function: `ruleTest()` runs rule before/after comparisons

**Test Pattern**
```typescript
ruleTest({
  RuleBuilderClass: YourRule,
  testCases: [
    { testName: '...', before: '...', after: '...', options: {...} }
  ]
});
```

### Settings & UI

**Settings (`src/settings-data.ts` & `src/ui/settings.ts`)**
- `LinterSettings` interface defines all plugin settings
- `SettingTab` class creates Obsidian settings UI
- Rule configs stored in `settings.ruleConfigs[ruleAlias]`

**UI Components (`src/ui/`)**
- `modals/` - Confirmation modals, parse results
- `linter-components/` - Custom UI controls (file pickers, replacements, commands)
- `helpers.ts` - Settings UI helpers

### Language Support

**Internationalization (`src/lang/`)**
- Language files: `en.ts`, `zh.ts`, `zh-TW.ts`, etc.
- Helper: `getTextInLanguage(key)` retrieves translated strings
- All user-facing text uses language keys

## Creating a New Rule

1. Create `src/rules/{rule-name}.ts` using `_rule-template.ts.txt` as reference
2. Define options interface extending `Options`
3. Extend `RuleBuilder<YourOptions>` with `@RuleBuilder.register` decorator
4. Implement required properties:
   - `nameKey`, `descriptionKey` - language keys
   - `type` - RuleType enum value
   - `OptionsClass` - options class reference
   - `apply()` - transformation logic
   - `exampleBuilders` - documentation examples
   - `optionBuilders` - UI controls
5. Create test file: `__tests__/{rule-name}.test.ts`
6. Test using `ruleTest()` helper with before/after cases
7. Run `npm run compile` to verify build, docs, lint, and tests

## Common Patterns

**YAML Regex**
Use `yamlRegex` from `src/utils/regex.ts` to match frontmatter.

**Ignore Sections**
Set `ruleIgnoreTypes` in constructor to skip code blocks, links, etc.

**String Utilities**
- `stripCr()` - normalize line endings
- `parseCustomReplacements()` - parse replacement rules

**Moment Locale**
Plugin sets moment locale based on Obsidian language via `langToMomentLocale` mapping.

## Build System

**esbuild (`esbuild.config.mjs`)**
- Bundles TypeScript to `main.js`
- Production mode removes example code
- Mocked banner for docs.js (replaces Obsidian imports)
- Import glob plugin for dynamic rule loading

**TypeScript Config**
- Target: ES6, module: ESNext
- Decorators enabled (`experimentalDecorators: true`)
- Inline source maps for debugging

## CI/CD

GitHub Actions (`.github/workflows/main.yml`):
- Runs on Node 16.x
- Steps: install → build → test → lint
- Triggered on push/PR to master

## File Linting Modes

1. **Editor Lint** - Uses CodeMirror editor API for live editing
2. **File Lint** - Direct file content modification via Vault API
3. **Paste Rules** - Special rules triggered on paste events

## Notes

- Rules with `hasSpecialExecutionOrder: true` run before/after regular rules
- Paste rules (RuleType.PASTE) only run on paste events
- Custom commands can be configured per-file in settings
- YAML disabled rules: Add `disabled rules: [rule-alias]` to frontmatter
- Plugin supports auto-correct misspellings with 939KB default dictionary
