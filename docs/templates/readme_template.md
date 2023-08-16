# Obsidian Linter

![Build](https://github.com/platers/obsidian-linter/actions/workflows/main.yml/badge.svg)
![Downloads](https://img.shields.io/github/downloads/platers/obsidian-linter/total)

This Obsidian plugin formats and styles your notes with a focus on configurability and extensibility.
Rules can be toggled and configured in the settings. The main documentation on rules and other things are
located on the [wiki](https://platers.github.io/obsidian-linter/). Below is a quick run down of some reference links to the rules that exist and how to install the Linter.

## Rules

Documentation for all rules can be found on the [wiki](https://platers.github.io/obsidian-linter/). The docs are updated before the plugin is released, so they may not be completely accurate.

Each rule is its own set of logic and is designed to be run independently. This means that enabling certain rules together could cause undesired results. One such case would be using "Paragraph blank lines" with "Two Spaces Between Lines with Content". These two rules have some overlap in what they target to change which results in undesired or unexpected results since together they work differently than if they were run by themselves.

{{RULES PLACEHOLDER}}

## Installing

As of version [0.9.7 of Obsidian](https://forum.obsidian.md/t/obsidian-release-v0-9-7-insider-build/7628), this plugin is available to be installed directly from within the app. The plugin can be found in the Community Plugins directory which can be accessed from the Settings pane under Third Party Plugins. The plugin is called `Linter`.

### Manual installation

1. Download the [latest release](https://github.com/platers/obsidian-linter/releases/latest)
1. Extract the obsidian-linter folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`  
Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
1. Reload Obsidian
1. If prompted about Safe Mode, you can disable safe mode and enable the plugin.

## How You Can Help

Contributions are welcome and appreciated. You can help in any of the following ways:

No repo setup required:
- [Reporting a bug](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug%3A+)
- [Requesting a feature](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=rule+suggestion&template=feature_request.md&title=FR%3A+)
- [Suggesting documentation](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=documentation&template=documentation_request.md&title=Doc%3A+)

Varying repo and development setup required:
- [Updating or adding documentation](https://platers.github.io/obsidian-linter/contributing/documentation/)
- [Translating the plugin into a new language](https://platers.github.io/obsidian-linter/contributing/translation/#adding-a-new-language-translation)
- [Fixing a bug](https://platers.github.io/obsidian-linter/contributing/bug-fix/)
- [Adding a new rule](https://platers.github.io/obsidian-linter/contributing/adding-a-rule/)

