# Rules

## General Settings

### Default Escape Character

The default character to use to escape YAML values when a single quote and double quote are not present.

- Default: `"`
- `"`: Use a double quote to escape if no single or double quote is present
- `'`: Use a single quote to escape if no single or double quote is present

### YAML aliases section style

The style of the YAML aliases section

- Default: `single-line`
- `multi-line`: ```aliases:\n  - Title```
- `single-line`: ```aliases: [Title]```
- `single string comma delimited`: ```aliases: Title, Other Title```
- `single string to single-line`: Aliases will be formatted as a string if there is 1 or fewer elements like so ```aliases: Title```. If there is more than 1 element, it will be formatted like a single-line array.
- `single string to multi-line`: Aliases will be formatted as a string if there is 1 or fewer elements like so ```aliases: Title```. If there is more than 1 element, it will be formatted like a multi-line array.
