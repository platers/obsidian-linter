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

Each rule is its own set of logic and is designed to be run independently. This means that enabling certain rules together could cause undesired results. One such case would be using "Paragraph blank lines" with "Two Spaces Between Lines with Content". These two rules have some overlap in what they target to change which results in undesired or unexpected results since together they work differently than if they were run by themselves.

{{RULES PLACEHOLDER}}

## Installing

As of version [0.9.7 of Obsidian](https://forum.obsidian.md/t/obsidian-release-v0-9-7-insider-build/7628), this plugin is available to be installed directly from within the app. The plugin can be found in the Community Plugins directory which can be accessed from the Settings pane under Third Party Plugins.

### Manual installation

1. Download the [latest release](https://github.com/platers/obsidian-linter/releases/latest)
1. Extract the obsidian-linter folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`  
Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
1. Reload Obsidian
1. If prompted about Safe Mode, you can disable safe mode and enable the plugin.

## Contributing

Contributions are welcome, especially for new rules. If this is something you would like to do, take a look at the
[contribution guidelines](CONTRIBUTING.md).
