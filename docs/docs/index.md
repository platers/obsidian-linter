# Overview

The Linter is an [Obsidian.md](https://obsidian.md/) plugin that is designed to help keep your notes in a more uniform pattern.
It is designed to allow the user to specify which rules and settings to use so that they can try to make
their notes as uniform as possible.

This includes, but is not limited to, rules that affect:

- YAML frontmatter
- Markdown headings
- Github flavored footnotes
- General markdown content
- Spacing
- Pasting content within the app

## How it Works

The Linter follows the following basic steps when it is run on a file:

``` mermaid
graph TD
    start[1. User initiates linting of file or files] --> run-linter-rules
    run-linter-rules[2. If file is not ignored, run Linter rules and Custom Commands*] --> handle-error
    handle-error{Did an error happen?} -- No --> update-file
    handle-error -- Yes --> log-error
    log-error[3. Display error and log to dev console] --> done
    update-file[3. Update file contents**] --> done
    done[Done]
```

!!! Note
    *Currently custom commands only run when a single file is linted.

    **This is a bit of a simplification as the file is updated after running Linter rules, but before Custom Commands run
    if no error has ocurred.

### 1. User Initiates Linting of File or Files

The user can initiate the Linter in several different ways. The scope of the action can affect anywhere from a file,
to a folder and its subfolders, to the entire vault. These actions can be initiated in several different ways as described
in [Running Rules](usage/running-rules.md).

### 2. Run Linter Rules and Custom Commands if File is not Ignored

The Linter checks to see if the file it is trying to lint is located in an ignored folder (learn more [here](usage/disabling-rules.md#ignoring-a-folder)
for more details). If that is the case, the file is skipped. If the file is not ignored, any disabled rules are
pulled from the YAML frontmatter (learn more [here](usage/disabling-rules.md#yaml-frontmatter)).

Once the list of rules that are disabled have been collected, rules are run in the following order:

1. Rules that need to run before other rules
2. Regular rules
3. Custom regex replacements
4. Rules that need to be run after most other rules

After each rule is run, an error check is performed and if any error happens the linting of a file stops. If no error happens while running
Linter rules, the file is updated in preparation for the Custom Commands running since they need changes to the file to have already been written.

Assuming the Linter is just linting a single file, Custom Commands are run. After each Custom Command is run,
linting will stop if an error has happened.

### 3. Handle Any Errors

If any errors happened while running Linter rules or Custom Commands, a notice is displayed in the UI and a log is added to the dev console.
Otherwise, everything is done.
