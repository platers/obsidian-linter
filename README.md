<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->

![Build](https://github.com/platers/obsidian-linter/actions/workflows/main.yml/badge.svg)

# Obsidian Linter

This Obsidian plugin applies consistent styling to your markdown files.
Rules can be added or removed in the settings.

## Usage

To lint the current file, run `Lint the current file` (`Ctrl+Alt+L` by default).

### Settings

![Settings](https://github.com/platers/obsidian-linter/blob/master/docs/settings.png?raw=true)

Add a rule by adding its alias in the settings. The listed rules are applied in order.

Some rules have configurable options, which are set with the format `option=value`.
For example, `yaml-timestamp format="YYYY-MM-DD"`

## Development Instructions

Pull requests are welcome, especially for new rules.

To add a new rule, edit `rules.ts`.

Run `npm test` to test the plugin.
Run `npm run docs` to generate the documentation.

## Rules

Documentation for all rules can be found in the [rules docs](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md).

- [Trailing spaces](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#trailing-spaces)
- [Heading blank lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#heading-blank-lines)
- [Space after list markers](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#space-after-list-markers)
- [YAML Timestamp](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#yaml-timestamp)
- [Compact YAML](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#compact-yaml)
- [Header Increment](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#header-increment)
- [Consecutive blank lines](https://github.com/platers/obsidian-linter/blob/master/docs/rules.md#consecutive-blank-lines)
