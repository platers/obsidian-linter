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

Thanks [chrisgrieser](https://github.com/chrisgrieser) for doing all of the base work for and for suggesting that the paste logic should reside in the Linter!

_Note: the paste rules will only run on an attempt to paste content into a Markdown file and they cannot be disabled on a file by file basis or by saying that a folder should not be linted. Please use the command for pasting text as is to not use the active pasting lint rules._

### Custom Lint Commands

These are special lint rules that the user may specify. They are Obsidian commands. If you would like to create a custom command that you can run, you can use the [QuickAdd](https://github.com/chhoumann/quickadd) plugin in order to add a JavaScript script to make modifications to a file. **This will require some level of knowledge about the Obsidian API and JavaScript.** To use a custom user script, you will want to follow these steps:

1. Install the QuickAdd plugin
2. Go ahead and go to the settings for QuickAdd and select "Manage Macros"
3. You should see a modal popup. In that modal, make sure to type in a macro name and add the macro.
4. Once the macro is added, go ahead and configure the macro making sure to add your user user script (this should be a JavaScript file in your Obsidian vault). [Here](https://github.com/chhoumann/quickadd/blob/master/docs/Examples/Macro_LogBookToDailyJournal.md) is an example from the QuickAdd repo with an explanation of what the code does.
5. Once you have finished all changes to your macro that you would like, go ahead and exit out of configure macro modal and the macro manager modal.
6. Then go ahead and select macro for the choice type and type in the name of the macro you just created (you may get suggestions or you may have to remember the name and type it in completely). Then add select "Add Choice".
7. Once the choice has been added, go ahead and click the lightning bolt icon which is the option to add a command for a choice.
8. Now you just need to search up this newly created command in the custom command settings for Obsidian Linter.

Now the next time you run the linter, the custom lint commands should run.

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
