# Obsidian Linter

![Build](https://github.com/platers/obsidian-linter/actions/workflows/main.yml/badge.svg)
![Downloads](https://img.shields.io/github/downloads/platers/obsidian-linter/total)

This Obsidian plugin formats and styles your notes with a focus on configurability and extensibility.
Rules can be toggled and configured in the settings.

## Usage

![Demo](images/demo.gif)

To lint the current file, run `Lint the current file` (`Ctrl+Alt+L` by default).
To lint all files, run `Lint all files in the vault`.
To lint all files in the current folder run `Lint all files in the current folder`. This action includes all subfolders.  
You can also lint a folder by right clicking on it in the folder list and selecting "Lint folder" from the options.

![Lint folder contents](images/lintfolder.png)

When `Lint on save` is toggled on, the plugin will lint the current file on manual save (when you press `Ctrl+S`).

### Disable rules

```markdown
---
disabled rules: [capitalize-headings]
---
```

Add `disabled rules: [ ... ]` to the YAML frontmatter of a file to disable those rules when linting that file.

Add `disabled rules: [ all ]` to the YAML frontmatter of a file to disable all rules.

## Rules

Documentation for all rules can be found in the [rules docs](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md). The docs are updated before the plugin is released, so may not be completely accurate.

{{RULES PLACEHOLDER}}

## Development Instructions

Pull requests are welcome, especially for new rules.

1. Fork this repository
2. Clone the repository
3. Run `npm ci` to install dependencies
4. Add a new rule in `rules.ts`.
   1. Insert a new rule in the corresponding rule type(spacing, headings, etc)
   2. Follow the format of the existing rules
   3. Add tests for edge cases in `test.ts`
   4. You should probably use some helper functions from `utils.ts`, such as `ignoreCodeBlocksYAMLTagsAndLinks`.
5. Run `npm run compile` to build, generate documentation, and test the plugin.
6. Run `npm run lint` to lint the plugin.

Make sure to use Node 15.x or higher.
