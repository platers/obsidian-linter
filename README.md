<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->

![Build](https://github.com/platers/obsidian-linter/actions/workflows/main.yml/badge.svg)

# Obsidian Linter

This Obsidian plugin applies consistent styling to your markdown files.
Rules can be added or removed in the settings.

## Usage

To lint the current file, run `Lint the current file` (`Ctrl+Alt+L` by default).

When `Lint on save` is toggled on, the plugin will lint the current file on save.

### Settings

![Settings](https://github.com/platers/obsidian-linter/blob/master/docs/settings.png?raw=true)

Add a rule by adding its alias in the settings. The listed rules are applied in order.

Some rules have configurable options, which are set with the format `option=value`.
For example, `yaml-timestamp format="YYYY-MM-DD"`

### Disable rules

```markdown
---
disabled rules: [ capitalize-headings ]
---
```

Add `disabled rules: [ ... ]` to the YAML frontmatter of a file to disable those rules when linting that file. 

Add `disabled rules: [ all ]` to the YAML frontmatter of a file to disable all rules.

## Development Instructions

Pull requests are welcome, especially for new rules.

1. Clone the repository
2. Run `npm ci` to install dependencies
3. Add a new rule in `rules.ts`.
4. Run `npm run compile` to build, generate documentation, and test the plugin. 

Make sure to use Node 15.x or higher.

Run `npm test` to run tests.
Run `npm run docs` to generate the documentation.
Run `npm run lint` to lint the code.

## Rules

Documentation for all rules can be found in the [rules docs](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md).

- [trailing-spaces](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#trailing-spaces)
- [heading-blank-lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#heading-blank-lines)
- [paragraph-blank-lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#paragraph-blank-lines)
- [space-after-list-markers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#space-after-list-markers)
- [yaml-timestamp](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#yaml-timestamp)
- [compact-yaml](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#compact-yaml)
- [header-increment](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#header-increment)
- [consecutive-blank-lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#consecutive-blank-lines)
- [capitalize-headings](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#capitalize-headings)
- [file-name-heading](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#file-name-heading)
- [format-tags-in-yaml](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#format-tags-in-yaml)
- [move-footnotes-to-the-bottom](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#move-footnotes-to-the-bottom)
- [re-index-footnotes](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#re-index-footnotes)
- [convert-spaces-to-tabs](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#convert-spaces-to-tabs)
- [line-break-at-document-end](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#line-break-at-document-end)
