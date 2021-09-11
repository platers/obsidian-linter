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