<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->

# Rules

## Trailing spaces

Alias: `trailing-spaces`

Removes extra spaces after every line.



Example: Removes trailing spaces and tabs

Before:

```markdown
# H1   
line with trailing spaces and tabs            
```

After:

```markdown
# H1
line with trailing spaces and tabs
```

## Heading blank lines

Alias: `heading-blank-lines`

All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).

Options:
- bottom: Insert a blank line after headings, default=`true`

Example: Headings should be surrounded by blank lines

Before:

```markdown
# H1
## H2


# H1
line
## H2

```

After:

```markdown
# H1

## H2

# H1

line

## H2
```
Example: With `bottom=false`

Before:

```markdown
# H1
line
## H2
# H1
line
```

After:

```markdown
# H1
line

## H2

# H1
line
```

## Paragraph blank lines

Alias: `paragraph-blank-lines`

All paragraphs should have exactly one blank line both before and after.



Example: Paragraphs should be surrounded by blank lines

Before:

```markdown
# H1
Newlines are inserted.
A paragraph is a line that starts with a letter.
```

After:

```markdown
# H1

Newlines are inserted.

A paragraph is a line that starts with a letter.
```

## Space after list markers

Alias: `space-after-list-markers`

There should be a single space after list markers and checkboxes.



Example: 

Before:

```markdown
1.      Item 1
2.  Item 2

-   [ ] Item 1
- [x]    Item 2
```

After:

```markdown
1. Item 1
2. Item 2

- [ ] Item 1
- [x] Item 2
```

## YAML Timestamp

Alias: `yaml-timestamp`

Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.

Options:
- format: [date format](https://momentjs.com/docs/#/displaying/format/), default=`"dddd, MMMM Do YYYY, h:mm:ss a"`
- dateCreated: Insert the current date if date created is not present, default=`true`
- dateUpdated: Update the current date, default=`true`

Example: Adds a header with the date.

Before:

```markdown
# H1
```

After:

```markdown
---
date created: Wednesday, January 1st 2020, 12:00:00 am
date updated: Thursday, January 2nd 2020, 12:00:00 am
---
# H1
```
Example: dateCreated option is false

Before:

```markdown
# H1
```

After:

```markdown
---
date updated: Wednesday, January 1st 2020, 12:00:00 am
---
# H1
```

## Compact YAML

Alias: `compact-yaml`

Removes leading and trailing blank lines in the YAML front matter.



Example: 

Before:

```markdown
---

date: today

---
```

After:

```markdown
---
date: today
---
```

## Header Increment

Alias: `header-increment`

Heading levels should only increment by one level at a time



Example: 

Before:

```markdown
# H1
### H3
### H3
#### H4
###### H6

We skipped a 2nd level heading
```

After:

```markdown
# H1
## H3
## H3
### H4
#### H6

We skipped a 2nd level heading
```

## Consecutive blank lines

Alias: `consecutive-blank-lines`

There should be at most one consecutive blank line.



Example: 

Before:

```markdown
Some text


Some more text
```

After:

```markdown
Some text

Some more text
```

## Capitalize Headings

Alias: `capitalize-headings`

Headings should be formatted with capitalization

Options:
- titleCase: Format headings with title case capitalization, default=`false`
- allCaps: Format headings with all capitals, default= `false`

Example: The first letter of a heading should be capitalized

Before:

```markdown
# this is a heading 1
## this is a heading 2
```

After:

```markdown
# This is a heading 1
## This is a heading 2
```
Example: With `titleCase=true`

Before:

```markdown
# this is a heading 1
## THIS IS A HEADING 2
### a heading 3
```

After:

```markdown
# This is a Heading 1
## This is a Heading 2
### A Heading 3
```
Example: With `allCaps=true`

Before:

```markdown
# this is a heading 1
## this is a heading 2
```

After:

```markdown
# THIS IS A HEADING 1
## THIS IS A HEADING 2
```

## File Name Heading

Alias: `file-name-heading`

Inserts the file name as a H1 heading if no H1 heading exists.



Example: Inserts an H1 heading

Before:

```markdown
This is a line of text
```

After:

```markdown
# File Name
This is a line of text
```
Example: Inserts heading after YAML front matter

Before:

```markdown
---
title: My Title
---
This is a line of text
```

After:

```markdown
---
title: My Title
---
# File Name
This is a line of text
```

## Format Tags in YAML

Alias: `format-tags-in-yaml`

Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.



Example: Format Tags in YAML frontmatter

Before:

```markdown
---
tags: #one #two #three
---
```

After:

```markdown
---
tags: one, two, three
---
```
Example: Format Tags in YAML frontmatter

Before:

```markdown
---
tags: #one, #two, #three
---
```

After:

```markdown
---
tags: one, two, three
---
```

## Move Footnotes to the bottom

Alias: `move-footnotes-to-the-bottom`

Move all footnotes to the bottom of the document.



Example: Moving footnotes to the bottom

Before:

```markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

[^1]: first footnote

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
[^2]: second footnote

Maecenas malesuada dignissim purus ac volutpat.
```

After:

```markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
Maecenas malesuada dignissim purus ac volutpat.

[^1]: first footnote
[^2]: second footnote
```

## Re-Index Footnotes

Alias: `re-index-footnotes`

Re-indexes footnote keys and footnote, based on the order of occurence (NOTE: This rule deliberately does *not* preserve the relation between key and footnote, to be able to re-index duplicate keys.)



Example: Re-indexing footnotes after having deleted previous footnotes

Before:

```markdown
Lorem ipsum at aliquet felis.[^3] Donec dictum turpis quis pellentesque,[^5] et iaculis tortor condimentum.

[^3]: first footnote
[^5]: second footnote
```

After:

```markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

[^1]: first footnote
[^2]: second footnote
```
Example: Re-indexing footnotes after inserting a footnote between

Before:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.

[^1]: first footnote
[^1a]: third footnote, inserted later
[^2]: second footnotes
```

After:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.

[^1]: first footnote
[^2]: third footnote, inserted later
[^3]: second footnotes
```
Example: Re-indexing duplicate footnote keys

Before:

```markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^1] et iaculis tortor condimentum.

[^1]: first footnote
[^1]: second footnote
```

After:

```markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

[^1]: first footnote
[^2]: second footnote
```

## Convert Spaces to Tabs

Alias: `convert-spaces-to-tabs`

Converts 4 spaces to 1 tab.

Options:
- tabsize: Number of spaces to convert to one tab, default=`4`

Example: Converting spaces to tabs with `tabsize = 3`

Before:

```markdown
- text with no indention
   - text indented with 3 spaces
- text with no indention
      - text indented with 6 spaces
```

After:

```markdown
- text with no indention
	- text indented with 3 spaces
- text with no indention
		- text indented with 6 spaces
```

## Line Break at Document End

Alias: `line-break-at-document-end`

Appends a line break at the end of the document, if there is none.



Example: Appending a line break to the end of the document.

Before:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

After:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

```
