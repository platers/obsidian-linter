#### How to Use Custom Misspellings

There is a default list of common misspellings that is used as the base for how this rule works.
However, there may be instances where the user may want to add their own list of misspellings to handle.
In those scenarios, they can add files to the list of files that have custom misspellings in them.

##### Format

A file that has custom misspellings in them can have any content in them. But the only content that will
be parsed as custom misspellings should be found in a two column table. For example the following table
will result in `th` being replaced with `the` and `tht` being replaced with `that`:

``` markdown
The following is a table with custom misspellings:
| Replace | With |
| ------- | ---- |
| th | the |
| tht | that |
```

!!! Note
    The first two lines of the table are skipped (the header and separator) and all rows after that
    must start and end with a pipe (`|`). If any do not start or end with a pipe or they have more
    than 2 columns, then they will be skipped.

##### Current Limitations

- The list of custom replacements is only loaded automatically when the plugin first lints a file or when the file is added to the list of files that include custom misspellings
    - There is an option to manually rerun the parse custom misspelling files from the Auto-Correct Common Misspellings settings
- There is no way to specify that a word is to always be capitalized
    - This is due to how the auto-correct rule was designed as it sets the first letter of the replacement word to the case of the first letter of the word being replaced
