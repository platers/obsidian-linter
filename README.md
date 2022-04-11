<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->
# Obsidian Linter
![Build](https://github.com/platers/obsidian-linter/actions/workflows/main.yml/badge.svg)
![Downloads](https://img.shields.io/github/downloads/platers/obsidian-linter/total)

This Obsidian plugin formats and styles your notes with a focus on configurability and extensibility.
Rules can be toggled and configured in the settings.

## Usage

To lint the current file, run `Lint the current file` (`Ctrl+Alt+L` by default).
To lint the all files, run `Lint all files in the vault`.

When `Lint on save` is toggled on, the plugin will lint the current file on manual save (when you press `Ctrl+S`).

### Disable rules

```markdown
---
disabled rules: [ capitalize-headings ]
---
```

Add `disabled rules: [ ... ]` to the YAML frontmatter of a file to disable those rules when linting that file. 

Add `disabled rules: [ all ]` to the YAML frontmatter of a file to disable all rules.

## Rules

Documentation for all rules can be found in the [rules docs](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md). The docs are updated before the plugin is released, so may not be completely accurate.


### YAML rules

- [format-tags-in-yaml](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#format-tags-in-yaml)
- [insert-yaml-attributes](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#insert-yaml-attributes)
- [yaml-timestamp](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#yaml-timestamp)
- [yaml-title](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#yaml-title)

### Heading rules

- [header-increment](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#header-increment)
- [file-name-heading](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#file-name-heading)
- [capitalize-headings](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#capitalize-headings)

### Footnote rules

- [move-footnotes-to-the-bottom](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#move-footnotes-to-the-bottom)
- [re-index-footnotes](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#re-index-footnotes)
- [footnote-after-punctuation](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#footnote-after-punctuation)

### Content rules

- [remove-multiple-spaces](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#remove-multiple-spaces)
- [remove-hyphenated-line-breaks](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#remove-hyphenated-line-breaks)
- [remove-consecutive-list-markers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#remove-consecutive-list-markers)
- [remove-empty-list-markers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#remove-empty-list-markers)
- [convert-bullet-list-markers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#convert-bullet-list-markers)
- [proper-ellipsis](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#proper-ellipsis)

### Spacing rules

- [trailing-spaces](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#trailing-spaces)
- [heading-blank-lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#heading-blank-lines)
- [paragraph-blank-lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#paragraph-blank-lines)
- [space-after-list-markers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#space-after-list-markers)
- [compact-yaml](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#compact-yaml)
- [consecutive-blank-lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#consecutive-blank-lines)
- [convert-spaces-to-tabs](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#convert-spaces-to-tabs)
- [line-break-at-document-end](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#line-break-at-document-end)
- [space-between-chinese-and-english-or-numbers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#space-between-chinese-and-english-or-numbers)


## Development Instructions

Pull requests are welcome, especially for new rules.

1. Clone the repository
2. Run `npm ci` to install dependencies
3. Add a new rule in `rules.ts`.
    1. Insert a new rule in the corresponding rule type(spacing, headings, etc)
    2. Follow the format of the existing rules
    3. Add tests for edge cases in `test.ts`
    4. You should probably use some helper functions from `utils.ts`, such as `ignoreCodeBlocksAndYAML`.
4. Run `npm run compile` to build, generate documentation, and test the plugin. 
5. Run `npm run lint` to lint the plugin.

Make sure to use Node 15.x or higher.