<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Rules

## General Settings

### Default Escape Character

The default character to use to escape YAML values when a single quote and double quote are not present.

- Default: `"`
- `"`: Use a double quote to escape if no single or double quote is present
- `'`: Use a single quote to escape if no single or double quote is present

### Yaml aliases section style

The style of the YAML aliases section

- Default: `single-line`
- `multi-line`: ```aliases:\n  - Title```
- `single-line`: ```aliases: [Title]```
- `single string comma delimited`: ```aliases: Title, Other Title```
- `single string to single-line`: Aliases will be formatted as a string if there is 1 or fewer elements like so ```aliases: Title```. If there is more than 1 element, it will be formatted like a single-line array.
- `single string to multi-line`: Aliases will be formatted as a string if there is 1 or fewer elements like so ```aliases: Title```. If there is more than 1 element, it will be formatted like a multi-line array.



## YAML
### Escape YAML Special Characters

Alias: `escape-yaml-special-characters`

Escapes colons with a space after them (: ), single quotes ('), and double quotes (") in YAML.

Options:
- Try to Escape Single Line Arrays: Tries to escape array values assuming that an array starts with "[", ends with "]", and has items that are delimited by ",".
	- Default: `false`

Example: YAML without anything to escape

Before:

``````markdown
---
key: value
otherKey: []
---
``````

After:

``````markdown
---
key: value
otherKey: []
---
``````
Example: YAML with unescaped values

Before:

``````markdown
---
key: value: with colon in the middle
secondKey: value with ' a single quote present
thirdKey: "already escaped: value"
fourthKey: value with " a double quote present
fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
sixthKey: colon:between characters is fine
otherKey: []
---
``````

After:

``````markdown
---
key: "value: with colon in the middle"
secondKey: "value with ' a single quote present"
thirdKey: "already escaped: value"
fourthKey: 'value with " a double quote present'
fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
sixthKey: colon:between characters is fine
otherKey: []
---
``````
Example: YAML with unescaped values in an expanded list with `Default Escape Character = '`

Before:

``````markdown
---
key:
  - value: with colon in the middle
  - value with ' a single quote present
  - 'already escaped: value'
  - value with " a double quote present
  - value with both ' " a double and single quote present is not escaped, but is invalid YAML
  - colon:between characters is fine
---
``````

After:

``````markdown
---
key:
  - 'value: with colon in the middle'
  - "value with ' a single quote present"
  - 'already escaped: value'
  - 'value with " a double quote present'
  - value with both ' " a double and single quote present is not escaped, but is invalid YAML
  - colon:between characters is fine
---
``````
Example: YAML with unescaped values with arrays

Before:

``````markdown
---
array: [value: with colon in the middle, value with ' a single quote present, "already escaped: value", value with " a double quote present, value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [[value: with colon in the middle, value with ' a single quote present], ["already escaped: value", value with " a double quote present], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [[value: with colon in the middle], value with ' a single quote present]
---

_Note that escaped commas in a YAML array will be treated as a separator._
``````

After:

``````markdown
---
array: ["value: with colon in the middle", "value with ' a single quote present", "already escaped: value", 'value with " a double quote present', value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [["value: with colon in the middle", "value with ' a single quote present"], ["already escaped: value", 'value with " a double quote present'], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [["value: with colon in the middle"], "value with ' a single quote present"]
---

_Note that escaped commas in a YAML array will be treated as a separator._
``````

### Force YAML Escape

Alias: `force-yaml-escape`

Escapes the values for the specified YAML keys.

Options:
- Force YAML Escape on Keys: Uses the YAML escape character on the specified YAML keys separated by a new line character if it is not already escaped. Do not use on YAML arrays.
	- Default: ``

Example: YAML without anything to escape

Before:

``````markdown
---
key: value
otherKey: []
---
``````

After:

``````markdown
---
key: value
otherKey: []
---
``````
Example: Force YAML keys to be escaped with double quotes where not already escaped with `Force Yaml Escape on Keys = 'key'\n'title'\n'bool'`

Before:

``````markdown
---
key: 'Already escaped value'
title: This is a title
bool: false
unaffected: value
---

_Note that the force Yaml key option should not be used with arrays._
``````

After:

``````markdown
---
key: 'Already escaped value'
title: "This is a title"
bool: "false"
unaffected: value
---

_Note that the force Yaml key option should not be used with arrays._
``````

### Format Tags in YAML

Alias: `format-tags-in-yaml`

Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.



Example: Format Tags in YAML frontmatter

Before:

``````markdown
---
tags: #one #two #three #nested/four/five
---
``````

After:

``````markdown
---
tags: one two three nested/four/five
---
``````
Example: Format tags in array

Before:

``````markdown
---
tags: [#one #two #three]
---
``````

After:

``````markdown
---
tags: [one two three]
---
``````
Example: Format tags in array with `tag` as the tags key

Before:

``````markdown
---
tag: [#one #two #three]
---
``````

After:

``````markdown
---
tag: [one two three]
---
``````
Example: Format tags in list

Before:

``````markdown
---
tags:
- #tag1
- #tag2
---
``````

After:

``````markdown
---
tags:
- tag1
- tag2
---
``````

### Format Yaml Array

Alias: `format-yaml-array`

Allows for the formatting of regular yaml arrays as either multi-line or single-line and `tags` and `aliases` are allowed to have some Obsidian specific yaml formats. Note that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.

Options:
- Format yaml aliases section: Turns on formatting for the yaml aliases section. You should not enable this option alongside the rule `YAML Title Alias` as they may not work well together or they may have different format styles selected causing unexpected results.
	- Default: `true`
- Format yaml tags section: Turns on formatting for the yaml tags section.
	- Default: `true`
- Default yaml array section style: The style of other yaml arrays that are not `tags`, `aliases` or  in `Force key values to be single-line arrays` and `Force key values to be multi-line arrays`
	- Default: `single-line`
	- `multi-line`: ```key:\n  - value```
	- `single-line`: ```key: [value]```
- Format yaml array sections: Turns on formatting for regular yaml arrays
	- Default: `true`
- Force key values to be single-line arrays: Forces the yaml array for the new line separated keys to be in single-line format (leave empty to disable this option)
	- Default: ``
- Force key values to be multi-line arrays: Forces the yaml array for the new line separated keys to be in multi-line format (leave empty to disable this option)
	- Default: ``

Example: Format tags as a single-line array delimited by spaces and aliases as a multi-line array and format the key `test` to be a single-line array

Before:

``````markdown
---
tags:
  - computer
  - research
aliases: Title 1, Title2
test: this is a value
---

# Notes:

Nesting yaml arrays may result in unexpected results.

Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid yaml unless it comes as the last entry in the array.
``````

After:

``````markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
test: [this is a value]
---

# Notes:

Nesting yaml arrays may result in unexpected results.

Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid yaml unless it comes as the last entry in the array.
``````
Example: Format tags as a single string with space delimiters, ignore aliases, and format regular yaml arrays as single-line arrays

Before:

``````markdown
---
aliases: Typescript
types:
  - thought provoking
  - peer reviewed
tags: [computer, science, trajectory]
---
``````

After:

``````markdown
---
aliases: Typescript
types: [thought provoking, peer reviewed]
tags: computer science trajectory
---
``````
Example: Arrays with dictionaries in them are ignored

Before:

``````markdown
---
gists:
  - id: test123
    url: 'some_url'
    filename: file.md
    isPublic: true
---
``````

After:

``````markdown
---
gists:
  - id: test123
    url: 'some_url'
    filename: file.md
    isPublic: true
---
``````

### Insert YAML attributes

Alias: `insert-yaml-attributes`

Inserts the given YAML attributes into the YAML frontmatter. Put each attribute on a single line.

Options:
- Text to insert: Text to insert into the YAML frontmatter
	- Default: `aliases: 
tags: `

Example: Insert static lines into YAML frontmatter. Text to insert: `aliases:
tags: doc
animal: dog`

Before:

``````markdown
---
animal: cat
---
``````

After:

``````markdown
---
aliases:
tags: doc
animal: cat
---
``````

### Move Tags to Yaml

Alias: `move-tags-to-yaml`

Move all tags to Yaml frontmatter of the document.

Options:
- Body tag operation: What to do with non-ignored tags in the body of the file once they have been moved to the frontmatter
	- Default: `Nothing`
	- `Nothing`: Leaves tags in the body of the file alone
	- `Remove hashtag`: Removes `#` from tags in content body after moving them to the YAML frontmatter
	- `Remove whole tag`: Removes the whole tag in content body after moving them to the YAML frontmatter. _Note that this removes the first space prior to the tag as well_
- Tags to ignore: The tags that will not be moved to the tags array or removed from the body content if `Remove the hashtag from tags in content body` is enabled. Each tag should be on a new line and without the `#`. **Make sure not to include the hashtag in the tag name.**
	- Default: ``

Example: Move tags from body to Yaml with `Tags to ignore = 'ignored-tag'`

Before:

``````markdown
Text has to do with #test and #markdown

#test content here
```
#ignored
Code block content is ignored
```

This inline code `#ignored content`

#ignored-tag is ignored since it is in the ignored list
``````

After:

``````markdown
---
tags: [test, markdown]
---
Text has to do with #test and #markdown

#test content here
```
#ignored
Code block content is ignored
```

This inline code `#ignored content`

#ignored-tag is ignored since it is in the ignored list
``````
Example: Move tags from body to YAML with existing tags retains the already existing ones and only adds new ones

Before:

``````markdown
---
tags: [test, tag2]
---
Text has to do with #test and #markdown
``````

After:

``````markdown
---
tags: [test, tag2, markdown]
---
Text has to do with #test and #markdown
``````
Example: Move tags to YAML frontmatter and then remove hashtags in body content tags when `Body tag operation = 'Remove hashtag'` and `Tags to ignore = 'yet-another-ignored-tag'`.

Before:

``````markdown
---
tags: [test, tag2]
---
Text has to do with #test and #markdown

The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
``````

After:

``````markdown
---
tags: [test, tag2, markdown]
---
Text has to do with test and markdown

The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
``````
Example: Move tags to YAML frontmatter and then remove body content tags when `Body tag operation = 'Remove whole tag'`.

Before:

``````markdown
---
tags: [test, tag2]
---
This document will have #tags removed and spacing around tags is left alone except for the space prior to the hashtag #warning
``````

After:

``````markdown
---
tags: [test, tag2, tags, warning]
---
This document will have removed and spacing around tags is left alone except for the space prior to the hashtag
``````

### Remove YAML Keys

Alias: `remove-yaml-keys`

Removes the YAML keys specified

Options:
- YAML Keys to Remove: The yaml keys to remove from the yaml frontmatter with or without colons
	- Default: ``

Example: Removes the values specified in `YAML Keys to Remove` = "status:
keywords
date"

Before:

``````markdown
---
language: Typescript
type: programming
tags: computer
keywords:
  - keyword1
  - keyword2
status: WIP
date: 02/15/2022
---

# Header Context

Text
``````

After:

``````markdown
---
language: Typescript
type: programming
tags: computer
---

# Header Context

Text
``````

### YAML Key Sort

Alias: `yaml-key-sort`

Sorts the YAML keys based on the order and priority specified. Note: may remove blank lines as well.

Options:
- YAML Key Priority Sort Order: The order in which to sort keys with one on each line where it sorts in the order found in the list
	- Default: ``
- Priority Keys at Start of YAML: YAML Key Priority Sort Order is placed at the start of the YAML frontmatter
	- Default: `true`
- YAML Sort Order for Other Keys: The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area
	- Default: `None`
	- `None`: No sorting other than what is in the YAML Key Priority Sort Order text area
	- `Ascending Alphabetical`: Sorts the keys based on key value from a to z
	- `Descending Alphabetical`: Sorts the keys based on key value from z to a

Example: Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`

Before:

``````markdown
---
language: Typescript
type: programming
tags: computer
keywords: []
status: WIP
date: 02/15/2022
---
``````

After:

``````markdown
---
date: 02/15/2022
type: programming
language: Typescript
tags: computer
keywords: []
status: WIP
---
``````
Example: Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `'YAML Sort Order for Other Keys' = Ascending Alphabetical`

Before:

``````markdown
---
language: Typescript
type: programming
tags: computer
keywords: []
status: WIP
date: 02/15/2022
---
``````

After:

``````markdown
---
date: 02/15/2022
type: programming
language: Typescript
keywords: []
status: WIP
tags: computer
---
``````
Example: Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `'YAML Sort Order for Other Keys' = Descending Alphabetical`

Before:

``````markdown
---
language: Typescript
type: programming
tags: computer
keywords: []
status: WIP
date: 02/15/2022
---
``````

After:

``````markdown
---
date: 02/15/2022
type: programming
language: Typescript
tags: computer
status: WIP
keywords: []
---
``````
Example: Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `'YAML Sort Order for Other Keys' = Descending Alphabetical` and `'Priority Keys at Start of YAML' = false`

Before:

``````markdown
---
language: Typescript
type: programming
tags: computer
keywords: []

status: WIP
date: 02/15/2022
---
``````

After:

``````markdown
---
tags: computer
status: WIP
keywords: []
date: 02/15/2022
type: programming
language: Typescript
---
``````

### YAML Timestamp

Alias: `yaml-timestamp`

Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.

Options:
- Date Created: Insert the file creation date
	- Default: `true`
- Date Created Key: Which YAML key to use for creation date
	- Default: `date created`
- Date Modified: Insert the date the file was last modified
	- Default: `true`
- Date Modified Key: Which YAML key to use for modification date
	- Default: `date modified`
- Format: Moment date format to use (see [Moment format options](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/))
	- Default: `dddd, MMMM Do YYYY, h:mm:ss a`

Example: Adds a header with the date.

Before:

``````markdown
# H1
``````

After:

``````markdown
---
date created: Wednesday, January 1st 2020, 12:00:00 am
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
``````
Example: dateCreated option is false

Before:

``````markdown
# H1
``````

After:

``````markdown
---
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
``````
Example: Date Created Key is set

Before:

``````markdown
# H1
``````

After:

``````markdown
---
created: Wednesday, January 1st 2020, 12:00:00 am
---
# H1
``````
Example: Date Modified Key is set

Before:

``````markdown
# H1
``````

After:

``````markdown
---
modified: Wednesday, January 1st 2020, 4:00:00 pm
---
# H1
``````

### YAML Title

Alias: `yaml-title`

Inserts the title of the file into the YAML frontmatter. Gets the title from the first H1 or filename if there is no H1.

Options:
- Title Key: Which YAML key to use for title
	- Default: `title`

Example: Adds a header with the title from heading.

Before:

``````markdown
# Obsidian
``````

After:

``````markdown
---
title: Obsidian
---
# Obsidian
``````
Example: Adds a header with the title.

Before:

``````markdown

``````

After:

``````markdown
---
title: Filename
---

``````

### YAML Title Alias

Alias: `yaml-title-alias`

Inserts the title of the file into the YAML frontmatter's aliases section. Gets the title from the first H1 or filename.

Options:
- Preserve existing aliases section style: If set, the `YAML aliases section style` setting applies only to the newly created sections
	- Default: `true`
- Keep alias that matches the filename: Such aliases are usually redundant
	- Default: `false`
- Use the YAML key `linter-yaml-title-alias` to help with filename and heading changes: If set, when the first H1 heading changes or filename if first H1 is not present changes, then the old alias stored in this key will be replaced with the new value instead of just inserting a new entry in the aliases array
	- Default: `true`

Example: Adds a header with the title from heading.

Before:

``````markdown
# Obsidian
``````

After:

``````markdown
---
aliases:
  - Obsidian
linter-yaml-title-alias: Obsidian
---
# Obsidian
``````
Example: Adds a header with the title from heading without YAML key when the use of the YAML key is set to false.

Before:

``````markdown
# Obsidian
``````

After:

``````markdown
---
aliases:
  - Obsidian
---
# Obsidian
``````
Example: Adds a header with the title.

Before:

``````markdown

``````

After:

``````markdown
---
aliases:
  - Filename
linter-yaml-title-alias: Filename
---

``````
Example: Adds a header with the title without YAML key when the use of the YAML key is set to false.

Before:

``````markdown

``````

After:

``````markdown
---
aliases:
  - Filename
---

``````
Example: Replaces old filename with new filename when no header is present and filename is different than the old one listed in `linter-yaml-title-alias`.

Before:

``````markdown
---
aliases:
  - Old Filename
  - Alias 2
linter-yaml-title-alias: Old Filename
---

``````

After:

``````markdown
---
aliases:
  - Filename
  - Alias 2
linter-yaml-title-alias: Filename
---

``````

## Heading
### Capitalize Headings

Alias: `capitalize-headings`

Headings should be formatted with capitalization

Options:
- Style: The style of capitalization to use
	- Default: `Title Case`
	- `Title Case`: Capitalize Using Title Case Rules
	- `ALL CAPS`: CAPITALIZE THE WHOLE TITLE
	- `First letter`: Only capitalize the first letter
- Ignore Cased Words: Only apply title case style to words that are all lowercase
	- Default: `true`
- Ignore Words: A comma separated list of words to ignore when capitalizing
	- Default: `macOS, iOS, iPhone, iPad, JavaScript, TypeScript, AppleScript`
- Lowercase Words: A comma separated list of words to keep lowercase
	- Default: `via, a, an, the, and, or, but, for, nor, so, yet, at, by, in, of, on, to, up, as, is, if, it, for, to, with, without, into, onto, per`

Example: With `Title Case=true`, `Ignore Cased Words=false`

Before:

``````markdown
# this is a heading 1
## THIS IS A HEADING 2
### a heading 3
``````

After:

``````markdown
# This is a Heading 1
## This is a Heading 2
### A Heading 3
``````
Example: With `Title Case=true`, `Ignore Cased Words=true`

Before:

``````markdown
# this is a heading 1
## THIS IS A HEADING 2
### a hEaDiNg 3
``````

After:

``````markdown
# This is a Heading 1
## THIS IS A HEADING 2
### A hEaDiNg 3
``````
Example: With `First letter=true`

Before:

``````markdown
# this is a heading 1
## this is a heading 2
``````

After:

``````markdown
# This is a heading 1
## This is a heading 2
``````
Example: With `ALL CAPS=true`

Before:

``````markdown
# this is a heading 1
## this is a heading 2
``````

After:

``````markdown
# THIS IS A HEADING 1
## THIS IS A HEADING 2
``````

### File Name Heading

Alias: `file-name-heading`

Inserts the file name as a H1 heading if no H1 heading exists.



Example: Inserts an H1 heading

Before:

``````markdown
This is a line of text
``````

After:

``````markdown
# File Name
This is a line of text
``````
Example: Inserts heading after YAML front matter

Before:

``````markdown
---
title: My Title
---
This is a line of text
``````

After:

``````markdown
---
title: My Title
---
# File Name
This is a line of text
``````

### Header Increment

Alias: `header-increment`

Heading levels should only increment by one level at a time



Example: 

Before:

``````markdown
# H1
### H3
### H3
#### H4
###### H6

We skipped a 2nd level heading
``````

After:

``````markdown
# H1
## H3
## H3
### H4
#### H6

We skipped a 2nd level heading
``````
Example: Skipped headings in sections that would be decremented will result in those headings not having the same meaning

Before:

``````markdown
# H1
### H3

We skip from 1 to 3

####### H7

We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered

###### H6

We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

## H2

This resets the decrement section so the H6 below is decremented to an H3

###### H6
``````

After:

``````markdown
# H1
## H3

We skip from 1 to 3

### H7

We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered

## H6

We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

## H2

This resets the decrement section so the H6 below is decremented to an H3

### H6
``````

## Footnote
### Footnote after Punctuation

Alias: `footnote-after-punctuation`

Ensures that footnote references are placed after punctuation, not before.



Example: Placing footnotes after punctuation.

Before:

``````markdown
Lorem[^1]. Ipsum[^2], doletes.
``````

After:

``````markdown
Lorem.[^1] Ipsum,[^2] doletes.
``````

### Move Footnotes to the bottom

Alias: `move-footnotes-to-the-bottom`

Move all footnotes to the bottom of the document.



Example: Moving footnotes to the bottom

Before:

``````markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

[^1]: first footnote

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
[^2]: second footnote

Maecenas malesuada dignissim purus ac volutpat.
``````

After:

``````markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
Maecenas malesuada dignissim purus ac volutpat.

[^1]: first footnote
[^2]: second footnote
``````

### Re-Index Footnotes

Alias: `re-index-footnotes`

Re-indexes footnote keys and footnote, based on the order of occurrence (NOTE: This rule deliberately does *not* preserve the relation between key and footnote, to be able to re-index duplicate keys.)



Example: Re-indexing footnotes after having deleted previous footnotes

Before:

``````markdown
Lorem ipsum at aliquet felis.[^3] Donec dictum turpis quis pellentesque,[^5] et iaculis tortor condimentum.

[^3]: first footnote
[^5]: second footnote
``````

After:

``````markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

[^1]: first footnote
[^2]: second footnote
``````
Example: Re-indexing footnotes after inserting a footnote between

Before:

``````markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.

[^1]: first footnote
[^1a]: third footnote, inserted later
[^2]: second footnotes
``````

After:

``````markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.

[^1]: first footnote
[^2]: third footnote, inserted later
[^3]: second footnotes
``````
Example: Re-indexing duplicate footnote keys

Before:

``````markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^1] et iaculis tortor condimentum.

[^1]: first footnote
[^1]: second footnote
``````

After:

``````markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

[^1]: first footnote
[^2]: second footnote
``````

## Content
### Convert Bullet List Markers

Alias: `convert-bullet-list-markers`

Converts common bullet list marker symbols to markdown list markers.



Example: Converts •

Before:

``````markdown
• item 1
• item 2
``````

After:

``````markdown
- item 1
- item 2
``````
Example: Converts §

Before:

``````markdown
• item 1
  § item 2
  § item 3
``````

After:

``````markdown
- item 1
  - item 2
  - item 3
``````

### Emphasis Style

Alias: `emphasis-style`

Makes sure the emphasis style is consistent.

Options:
- Style: The style used to denote emphasized content
	- Default: `consistent`
	- `consistent`: Makes sure the first instance of emphasis is the style that will be used throughout the document
	- `asterisk`: Makes sure * is the emphasis indicator
	- `underscore`: Makes sure _ is the emphasis indicator

Example: Emphasis indicators should use underscores when style is set to 'underscore'

Before:

``````markdown
# Emphasis Cases

*Test emphasis*
* Test not emphasized *
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is ***bold and emphasized***
This is ***nested bold** and ending emphasized*
This is ***nested emphasis* and ending bold**

**Test bold**

* List Item1 with *emphasized text*
* List Item2
``````

After:

``````markdown
# Emphasis Cases

_Test emphasis_
* Test not emphasized *
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is _**bold and emphasized**_
This is _**nested bold** and ending emphasized_
This is **_nested emphasis_ and ending bold**

**Test bold**

* List Item1 with _emphasized text_
* List Item2
``````
Example: Emphasis indicators should use asterisks when style is set to 'asterisk'

Before:

``````markdown
# Emphasis Cases

_Test emphasis_
_ Test not emphasized _
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is ___nested bold__ and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
``````

After:

``````markdown
# Emphasis Cases

*Test emphasis*
_ Test not emphasized _
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is __*nested emphasis* and ending bold__

__Test bold__
``````
Example: Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to 'consistent'

Before:

``````markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is _emphasized_ mid sentence
This is *emphasized* mid sentence with a second _emphasis_ on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is **_nested emphasis_ and ending bold**

__Test bold__
``````

After:

``````markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is ***nested emphasis* and ending bold**

__Test bold__
``````
Example: Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to 'consistent'

Before:

``````markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is *emphasized* mid sentence with a second _emphasis_ on the same line
This is *__bold and emphasized__*
This is _**nested bold** and ending emphasized_
This is __*nested emphasis* and ending bold__

__Test bold__
``````

After:

``````markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is _**nested bold** and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
``````

### No Bare URLs

Alias: `no-bare-urls`

Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.



Example: Make sure that links are inside of angle brackets when not in single quotes('), double quotes("), or backticks(`)

Before:

``````markdown
https://github.com
braces around url should stay the same: [https://github.com]
backticks around url should stay the same: `https://github.com`
Links mid-sentence should be updated like https://google.com will be.
'https://github.com'
"https://github.com"
<https://github.com>
links should stay the same: [](https://github.com)
https://gitlab.com
``````

After:

``````markdown
<https://github.com>
braces around url should stay the same: [https://github.com]
backticks around url should stay the same: `https://github.com`
Links mid-sentence should be updated like <https://google.com> will be.
'https://github.com'
"https://github.com"
<https://github.com>
links should stay the same: [](https://github.com)
<https://gitlab.com>
``````
Example: Angle brackets are added if the url is not the only text in the single quotes(') or double quotes(")

Before:

``````markdown
[https://github.com some text here]
backticks around a url should stay the same: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
``````

After:

``````markdown
[<https://github.com> some text here]
backticks around a url should stay the same: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
``````
Example: Multiple angle brackets at the start and or end of a url will be reduced down to 1

Before:

``````markdown
<<https://github.com>
<https://google.com>>
<<https://gitlab.com>>
``````

After:

``````markdown
<https://github.com>
<https://google.com>
<https://gitlab.com>
``````

### Ordered List Style

Alias: `ordered-list-style`

Makes sure that ordered lists follow the style specified. Note that 2 spaces or 1 tab is considered to be an indentation level.

Options:
- Number Style: The number style used in ordered list indicators
	- Default: `ascending`
	- `ascending`: Makes sure ordered list items are ascending (i.e. 1, 2, 3, etc.)
	- `lazy`: Makes sure ordered list item indicators all are the number 1
- Ordered List Indicator End Style: The ending character of an ordered list indicator
	- Default: `.`
	- `.`: Makes sure ordered list items indicators end in '.' (i.e `1.`)
	- `)`: Makes sure ordered list item indicators end in ')' (i.e. `1)`)

Example: Ordered lists have list items set to ascending numerical order when Number Style is `ascending`.

Before:

``````markdown
1. Item 1
2. Item 2
4. Item 3

Some text here

1. Item 1
1. Item 2
1. Item 3
``````

After:

``````markdown
1. Item 1
2. Item 2
3. Item 3

Some text here

1. Item 1
2. Item 2
3. Item 3
``````
Example: Nested ordered lists have list items set to ascending numerical order when Number Style is `ascending`.

Before:

``````markdown
1. Item 1
2. Item 2
  1. Subitem 1
  5. Subitem 2
  2. Subitem 3
4. Item 3
``````

After:

``````markdown
1. Item 1
2. Item 2
  1. Subitem 1
  2. Subitem 2
  3. Subitem 3
3. Item 3
``````
Example: Ordered list in blockquote has list items set to '1.' when Number Style is `lazy`.

Before:

``````markdown
> 1. Item 1
> 4. Item 2
> > 1. Subitem 1
> > 5. Subitem 2
> > 2. Subitem 3
``````

After:

``````markdown
> 1. Item 1
> 1. Item 2
> > 1. Subitem 1
> > 1. Subitem 2
> > 1. Subitem 3
``````
Example: Ordered list in blockquote has list items set to ascending numerical order when Number Style is `ascending`.

Before:

``````markdown
> 1. Item 1
> 4. Item 2
> > 1. Subitem 1
> > 5. Subitem 2
> > 2. Subitem 3
``````

After:

``````markdown
> 1. Item 1
> 2. Item 2
> > 1. Subitem 1
> > 2. Subitem 2
> > 3. Subitem 3
``````
Example: Nested ordered list has list items set to '1)' when Number Style is `lazy` and Ordered List Indicator End Style is `)`.

Before:

``````markdown
1. Item 1
2. Item 2
  1. Subitem 1
  5. Subitem 2
  2. Subitem 3
4. Item 3
``````

After:

``````markdown
1) Item 1
1) Item 2
  1) Subitem 1
  1) Subitem 2
  1) Subitem 3
1) Item 3
``````

### Proper Ellipsis

Alias: `proper-ellipsis`

Replaces three consecutive dots with an ellipsis.



Example: Replacing three consecutive dots with an ellipsis.

Before:

``````markdown
Lorem (...) Impsum.
``````

After:

``````markdown
Lorem (…) Impsum.
``````

### Remove Consecutive List Markers

Alias: `remove-consecutive-list-markers`

Removes consecutive list markers. Useful when copy-pasting list items.



Example: Removing consecutive list markers.

Before:

``````markdown
- item 1
- - copypasted item A
- item 2
  - indented item
  - - copypasted item B
``````

After:

``````markdown
- item 1
- copypasted item A
- item 2
  - indented item
  - copypasted item B
``````

### Remove Empty List Markers

Alias: `remove-empty-list-markers`

Removes empty list markers, i.e. list items without content.



Example: Removes empty list markers.

Before:

``````markdown
- item 1
-
- item 2

* list 2 item 1
    *
* list 2 item 2

+ list 3 item 1
+
+ list 3 item 2
``````

After:

``````markdown
- item 1
- item 2

* list 2 item 1
* list 2 item 2

+ list 3 item 1
+ list 3 item 2
``````
Example: Removes empty ordered list markers.

Before:

``````markdown
1. item 1
2.
3. item 2

1. list 2 item 1
2. list 2 item 2
3. 

_Note that this rule does not make sure that the ordered list is sequential after removal_
``````

After:

``````markdown
1. item 1
3. item 2

1. list 2 item 1
2. list 2 item 2

_Note that this rule does not make sure that the ordered list is sequential after removal_
``````
Example: Removes empty checklist markers.

Before:

``````markdown
- [ ]  item 1
- [x]
- [ ] item 2
- [ ]   

_Note that this will affect checked and uncheck checked list items_
``````

After:

``````markdown
- [ ]  item 1
- [ ] item 2

_Note that this will affect checked and uncheck checked list items_
``````
Example: Removes empty list, checklist, and ordered list markers in callouts/blockquotes

Before:

``````markdown
> Checklist in blockquote
> - [ ]  item 1
> - [x]
> - [ ] item 2
> - [ ]   

> Ordered List in blockquote
> > 1. item 1
> > 2.
> > 3. item 2
> > 4.  

> Regular lists in blockquote
>
> - item 1
> -
> - item 2
>
> List 2
>
> * item 1
>     *
> * list 2 item 2
>
> List 3
>
> + item 1
> + 
> + item 2
``````

After:

``````markdown
> Checklist in blockquote
> - [ ]  item 1
> - [ ] item 2

> Ordered List in blockquote
> > 1. item 1
> > 3. item 2

> Regular lists in blockquote
>
> - item 1
> - item 2
>
> List 2
>
> * item 1
> * list 2 item 2
>
> List 3
>
> + item 1
> + item 2
``````

### Remove Hyphenated Line Breaks

Alias: `remove-hyphenated-line-breaks`

Removes hyphenated line breaks. Useful when pasting text from textbooks.



Example: Removing hyphenated line breaks.

Before:

``````markdown
This text has a linebr‐ eak.
``````

After:

``````markdown
This text has a linebreak.
``````

### Remove Multiple Spaces

Alias: `remove-multiple-spaces`

Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. 



Example: Removing double and triple space.

Before:

``````markdown
Lorem ipsum   dolor  sit amet.
``````

After:

``````markdown
Lorem ipsum dolor sit amet.
``````

### Strong Style

Alias: `strong-style`

Makes sure the strong style is consistent.

Options:
- Style: The style used to denote strong/bolded content
	- Default: `consistent`
	- `consistent`: Makes sure the first instance of strong is the style that will be used throughout the document
	- `asterisk`: Makes sure ** is the strong indicator
	- `underscore`: Makes sure __ is the strong indicator

Example: Strong indicators should use underscores when style is set to 'underscore'

Before:

``````markdown
# Strong/Bold Cases

**Test bold**
** Test not bold **
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is ***bold and emphasized***
This is ***nested bold** and ending emphasized*
This is ***nested emphasis* and ending bold**

*Test emphasis*

* List Item1 with **bold text**
* List Item2
``````

After:

``````markdown
# Strong/Bold Cases

__Test bold__
** Test not bold **
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is __*nested emphasis* and ending bold__

*Test emphasis*

* List Item1 with __bold text__
* List Item2
``````
Example: Strong indicators should use asterisks when style is set to 'asterisk'

Before:

``````markdown
# Strong/Bold Cases

__Test bold__
__ Test not bold __
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is ___nested bold__ and ending emphasized_
This is ___nested emphasis_ and ending bold__

_Test emphasis_
``````

After:

``````markdown
# Strong/Bold Cases

**Test bold**
__ Test not bold __
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is _**nested bold** and ending emphasized_
This is **_nested emphasis_ and ending bold**

_Test emphasis_
``````
Example: Strong indicators should use consistent style based on first strong indicator in a file when style is set to 'consistent'

Before:

``````markdown
# Strong First Strong Is an Asterisk

**First bold**
This is __bold__ mid sentence
This is __bold__ mid sentence with a second **bold** on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is **_nested emphasis_ and ending bold**

__Test bold__
``````

After:

``````markdown
# Strong First Strong Is an Asterisk

**First bold**
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is ***nested bold** and ending emphasized*
This is **_nested emphasis_ and ending bold**

**Test bold**
``````
Example: Strong indicators should use consistent style based on first strong indicator in a file when style is set to 'consistent'

Before:

``````markdown
# Strong First Strong Is an Underscore

__First bold__
This is **bold** mid sentence
This is **bold** mid sentence with a second __bold__ on the same line
This is **_bold and emphasized_**
This is ***nested bold** and ending emphasized*
This is ___nested emphasis_ and ending bold__

**Test bold**
``````

After:

``````markdown
# Strong First Strong Is an Underscore

__First bold__
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is ___nested emphasis_ and ending bold__

__Test bold__
``````

### Two Spaces Between Lines with Content

Alias: `two-spaces-between-lines-with-content`

Makes sure that two spaces are added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items



Example: Make sure two spaces are added to the ends of lines that have content on it and the next line for lists, blockquotes, and paragraphs

Before:

``````markdown
# Heading 1
First paragraph stays as the first paragraph

- list item 1
- list item 2
Continuation of list item 2
- list item 3

1. Item 1
2. Item 2
Continuation of item 3
3. Item 3

Paragraph for with link [[other file name]].
Continuation *of* the paragraph has `inline code block` __in it__.
Even more continuation

Paragraph lines that end in <br/>
Or lines that end in <br>
Are left alone
Since they mean the same thing

``` text
Code blocks are ignored
Even with multiple lines
```
Another paragraph here

> Blockquotes are affected
> More content here
Content here

<div>
html content
should be ignored
</div>
Even more content here

``````

After:

``````markdown
# Heading 1
First paragraph stays as the first paragraph

- list item 1
- list item 2  
Continuation of list item 2
- list item 3

1. Item 1
2. Item 2  
Continuation of item 3
3. Item 3

Paragraph for with link [[other file name]].  
Continuation *of* the paragraph has `inline code block` __in it__.  
Even more continuation

Paragraph lines that end in <br/>
Or lines that end in <br>
Are left alone  
Since they mean the same thing

``` text
Code blocks are ignored
Even with multiple lines
```
Another paragraph here

> Blockquotes are affected  
> More content here  
Content here

<div>
html content
should be ignored
</div>
Even more content here

``````

### Unordered List Style

Alias: `unordered-list-style`

Makes sure that unordered lists follow the style specified.

Options:
- List item style: The list item style to use in unordered lists
	- Default: `consistent`
	- `consistent`: Makes sure unordered list items use a consistent list item indicator in the file which will be based on the first list item found
	- `-`: Makes sure unordered list items use `-` as their indicator
	- `*`: Makes sure unordered list items use `*` as their indicator
	- `+`: Makes sure unordered list items use `+` as their indicator

Example: Unordered lists have their indicator updated to `*` when `List item style = 'consistent'` and `*` is the first unordered list indicator

Before:

``````markdown
1. ordered item 1
2. ordered item 2

Checklists should be ignored
- [ ] Checklist item 1
- [x] completed item

* Item 1
  - Sublist 1 item 1
  - Sublist 1 item 2
- Item 2
  + Sublist 2 item 1
  + Sublist 2 item 2
+ Item 3
  * Sublist 3 item 1
  * Sublist 3 item 2

``````

After:

``````markdown
1. ordered item 1
2. ordered item 2

Checklists should be ignored
- [ ] Checklist item 1
- [x] completed item

* Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  * Sublist 2 item 1
  * Sublist 2 item 2
* Item 3
  * Sublist 3 item 1
  * Sublist 3 item 2

``````
Example: Unordered lists have their indicator updated to `-` when `List item style = '-'`

Before:

``````markdown
- Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  + Sublist 2 item 1
  + Sublist 2 item 2
+ Item 3
  - Sublist 3 item 1
  - Sublist 3 item 2

See that the ordered list is ignored, but its sublist is not

1. Item 1
  - Sub item 1
1. Item 2
  * Sub item 2
1. Item 3
  + Sub item 3
``````

After:

``````markdown
- Item 1
  - Sublist 1 item 1
  - Sublist 1 item 2
- Item 2
  - Sublist 2 item 1
  - Sublist 2 item 2
- Item 3
  - Sublist 3 item 1
  - Sublist 3 item 2

See that the ordered list is ignored, but its sublist is not

1. Item 1
  - Sub item 1
1. Item 2
  - Sub item 2
1. Item 3
  - Sub item 3
``````
Example: Unordered lists have their indicator updated to `*` when `List item style = '*'`

Before:

``````markdown
- Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  + Sublist 2 item 1
  + Sublist 2 item 2
+ Item 3
  - Sublist 3 item 1
  - Sublist 3 item 2

``````

After:

``````markdown
* Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  * Sublist 2 item 1
  * Sublist 2 item 2
* Item 3
  * Sublist 3 item 1
  * Sublist 3 item 2

``````
Example: Unordered list in blockquote has list item indicators set to `+` when `List item style = '-'`

Before:

``````markdown
> - Item 1
> + Item 2
> > * Subitem 1
> > + Subitem 2
> >   - Sub sub item 1
> > - Subitem 3
``````

After:

``````markdown
> + Item 1
> + Item 2
> > + Subitem 1
> > + Subitem 2
> >   + Sub sub item 1
> > + Subitem 3
``````

## Spacing
### Compact YAML

Alias: `compact-yaml`

Removes leading and trailing blank lines in the YAML front matter.

Options:
- Inner New Lines: Remove new lines that are not at the start or the end of the YAML
	- Default: `false`

Example: Remove blank lines at the start and end of the YAML

Before:

``````markdown
---

date: today

title: unchanged without inner new lines turned on

---
``````

After:

``````markdown
---
date: today

title: unchanged without inner new lines turned on
---
``````
Example: Remove blank lines anywhere in YAML with inner new lines set to true

Before:

``````markdown
---

date: today


title: remove inner new lines

---

# Header 1


Body content here.
``````

After:

``````markdown
---
date: today
title: remove inner new lines
---

# Header 1


Body content here.
``````

### Consecutive blank lines

Alias: `consecutive-blank-lines`

There should be at most one consecutive blank line.



Example: 

Before:

``````markdown
Some text


Some more text
``````

After:

``````markdown
Some text

Some more text
``````

### Convert Spaces to Tabs

Alias: `convert-spaces-to-tabs`

Converts leading spaces to tabs.

Options:
- Tabsize: Number of spaces that will be converted to a tab
	- Default: `4`

Example: Converting spaces to tabs with `tabsize = 3`

Before:

``````markdown
- text with no indention
   - text indented with 3 spaces
- text with no indention
      - text indented with 6 spaces
``````

After:

``````markdown
- text with no indention
	- text indented with 3 spaces
- text with no indention
		- text indented with 6 spaces
``````

### Empty Line Around Blockquotes

Alias: `empty-line-around-blockquotes`

Ensures that there is an empty line around blockquotes unless they start or end a document. **Note that an empty line is either one less level of nesting for blockquotes or a newline character.**



Example: Blockquotes that start a document do not get an empty line before them.

Before:

``````markdown
> Quote content here
> quote content continued
# Title here
``````

After:

``````markdown
> Quote content here
> quote content continued

# Title here
``````
Example: Blockquotes that end a document do not get an empty line after them.

Before:

``````markdown
# Heading 1
> Quote content here
> quote content continued
``````

After:

``````markdown
# Heading 1

> Quote content here
> quote content continued
``````
Example: Blockquotes that are nested have the proper empty line added

Before:

``````markdown
# Make sure that nested blockquotes are accounted for correctly
> Quote content here
> quote content continued
> > Nested Blockquote
> > content continued

**Note that the empty line is either one less blockquote indicator if followed/proceeded by more blockquote content or it is an empty line**

# Doubly nested code block

> > Quote content here
> > quote content continued
``````

After:

``````markdown
# Make sure that nested blockquotes are accounted for correctly

> Quote content here
> quote content continued
>
> > Nested Blockquote
> > content continued

**Note that the empty line is either one less blockquote indicator if followed/proceeded by more blockquote content or it is an empty line**

# Doubly nested code block

> > Quote content here
> > quote content continued
``````

### Empty Line Around Code Fences

Alias: `empty-line-around-code-fences`

Ensures that there is an empty line around code fences unless they start or end a document.



Example: Fenced code blocks that start a document do not get an empty line before them.

Before:

``````markdown
``` js
var temp = 'text';
// this is a code block
```
Text after code block.
``````

After:

``````markdown
``` js
var temp = 'text';
// this is a code block
```

Text after code block.
``````
Example: Fenced code blocks that end a document do not get an empty line after them.

Before:

``````markdown
# Heading 1
```
Here is a code block
```
``````

After:

``````markdown
# Heading 1

```
Here is a code block
```
``````
Example: Fenced code blocks that are in a blockquote have the proper empty line added

Before:

``````markdown
# Make sure that code blocks in blockquotes are accounted for correctly
> ```js
> var text = 'this is some text';
> ```
>
> ```js
> var other text = 'this is more text';
> ```

**Note that the blanks blockquote lines added do not have whitespace after them**

# Doubly nested code block

> > ```js
> > var other text = 'this is more text';
> > ```
``````

After:

``````markdown
# Make sure that code blocks in blockquotes are accounted for correctly
>
> ```js
> var text = 'this is some text';
> ```
>
> ```js
> var other text = 'this is more text';
> ```
>

**Note that the blanks blockquote lines added do not have whitespace after them**

# Doubly nested code block

> >
> > ```js
> > var other text = 'this is more text';
> > ```
``````
Example: Nested fenced code blocks get empty lines added around them

Before:

``````markdown
```markdown
# Header

````JavaScript
var text = 'some string';
````
```
``````

After:

``````markdown
```markdown
# Header

````JavaScript
var text = 'some string';
````

```
``````

### Empty Line Around Math Blocks

Alias: `empty-line-around-math-blocks`

Ensures that there is an empty line around math blocks using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.



Example: Math blocks that start a document do not get an empty line before them.

Before:

``````markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
some more text
``````

After:

``````markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$

some more text
``````
Example: Math blocks that are singe-line are updated based on the value of `Number of Dollar Signs to Indicate a Math Block` (in this case its value is 2)

Before:

``````markdown
$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$
some more text
``````

After:

``````markdown
$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$

some more text
``````
Example: Math blocks that end a document do not get an empty line after them.

Before:

``````markdown
Some text
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````

After:

``````markdown
Some text

$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````
Example: Math blocks that are not at the start or the end of the document will have an empty line added before and after them

Before:

``````markdown
Some text
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
some more text
``````

After:

``````markdown
Some text

$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$

some more text
``````
Example: Math blocks in callouts or blockquotes have the appropriately formatted blank lines added

Before:

``````markdown
> Math block in blockquote
> $$
> \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> $$

More content here

> Math block doubly nested in blockquote
> > $$
> > \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> > $$
``````

After:

``````markdown
> Math block in blockquote
>
> $$
> \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> $$
>

More content here

> Math block doubly nested in blockquote
> >
> > $$
> > \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> > $$
``````

### Empty Line Around Tables

Alias: `empty-line-around-tables`

Ensures that there is an empty line around github flavored tables unless they start or end a document.



Example: Tables that start a document do not get an empty line before them.

Before:

``````markdown
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
More text.
# Heading

**Note that text directly following a table is considered part of a table according to github markdown**
``````

After:

``````markdown
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |

More text.
# Heading

**Note that text directly following a table is considered part of a table according to github markdown**
``````
Example: Tables that end a document do not get an empty line after them.

Before:

``````markdown
# Heading 1
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
``````

After:

``````markdown
# Heading 1

| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
``````
Example: Tables that are not at the start or the end of the document will have an empty line added before and after them

Before:

``````markdown
# Table 1
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| foo      | bar      | blob     |
| baz      | qux      | trust    |
| quux     | quuz     | glob     |
# Table 2 without Pipe at Start and End
| Column 1 | Column 2 |
:-: | -----------:
bar | baz
foo | bar
# Header for more content
New paragraph.
``````

After:

``````markdown
# Table 1

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| foo      | bar      | blob     |
| baz      | qux      | trust    |
| quux     | quuz     | glob     |

# Table 2 without Pipe at Start and End

| Column 1 | Column 2 |
:-: | -----------:
bar | baz
foo | bar

# Header for more content
New paragraph.
``````
Example: Tables in callouts or blockquotes have the appropriately formatted blank lines added

Before:

``````markdown
> Table in blockquote
> | Column 1 | Column 2 | Column 3 |
> |----------|----------|----------|
> | foo      | bar      | blob     |
> | baz      | qux      | trust    |
> | quux     | quuz     | glob     |

More content here

> Table doubly nested in blockquote
> > | Column 1 | Column 2 | Column 3 |
> > |----------|----------|----------|
> > | foo      | bar      | blob     |
> > | baz      | qux      | trust    |
> > | quux     | quuz     | glob     |
``````

After:

``````markdown
> Table in blockquote
>
> | Column 1 | Column 2 | Column 3 |
> |----------|----------|----------|
> | foo      | bar      | blob     |
> | baz      | qux      | trust    |
> | quux     | quuz     | glob     |
>

More content here

> Table doubly nested in blockquote
> >
> > | Column 1 | Column 2 | Column 3 |
> > |----------|----------|----------|
> > | foo      | bar      | blob     |
> > | baz      | qux      | trust    |
> > | quux     | quuz     | glob     |
``````

### Heading blank lines

Alias: `heading-blank-lines`

All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).

Options:
- Bottom: Insert a blank line after headings
	- Default: `true`
- Empty Line Between Yaml and Header: Keep the empty line between the Yaml frontmatter and header
	- Default: `true`

Example: Headings should be surrounded by blank lines

Before:

``````markdown
# H1
## H2


# H1
line
## H2

``````

After:

``````markdown
# H1

## H2

# H1

line

## H2
``````
Example: With `Bottom=false`

Before:

``````markdown
# H1
line
## H2
# H1
line
``````

After:

``````markdown
# H1
line

## H2

# H1
line
``````
Example: Empty line before header and after Yaml is removed with `Empty Line Between Yaml and Header=true`

Before:

``````markdown
---
key: value
---
# Header
Paragraph here...
``````

After:

``````markdown
---
key: value
---
# Header

Paragraph here...
``````

### Line Break at Document End

Alias: `line-break-at-document-end`

Ensures that there is exactly one line break at the end of a document.



Example: Appending a line break to the end of the document.

Before:

``````markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
``````

After:

``````markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

``````
Example: Removing trailing line breaks to the end of the document, except one.

Before:

``````markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.



``````

After:

``````markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

``````

### Move Math Block Indicators to Their Own Line

Alias: `move-math-block-indicators-to-their-own-line`

Move all starting and ending math block indicators to their own lines using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.



Example: Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2

Before:

``````markdown
This is left alone:
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
The following is updated:
$$L = \frac{1}{2} \rho v^2 S C_L$$
``````

After:

``````markdown
This is left alone:
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
The following is updated:
$$
L = \frac{1}{2} \rho v^2 S C_L
$$
``````
Example: Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 3 and opening indicator is on the same line as the start of the content

Before:

``````markdown
$$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$$
``````

After:

``````markdown
$$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$$
``````
Example: Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2 and ending indicator is on the same line as the ending line of the content

Before:

``````markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$
``````

After:

``````markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````

### Paragraph blank lines

Alias: `paragraph-blank-lines`

All paragraphs should have exactly one blank line both before and after.



Example: Paragraphs should be surrounded by blank lines

Before:

``````markdown
# H1
Newlines are inserted.
A paragraph is a line that starts with a letter.
``````

After:

``````markdown
# H1

Newlines are inserted.

A paragraph is a line that starts with a letter.
``````

### Remove Empty Lines Between List Markers and Checklists

Alias: `remove-empty-lines-between-list-markers-and-checklists`

There should not be any empty lines between list markers and checklists.



Example: 

Before:

``````markdown
1. Item 1

2. Item 2

- Item 1

	- Subitem 1

- Item 2

- [x] Item 1

	- [ ] Subitem 1

- [ ] Item 2

+ Item 1

	+ Subitem 1

+ Item 2

* Item 1

	* Subitem 1

* Item 2
``````

After:

``````markdown
1. Item 1
2. Item 2

- Item 1
	- Subitem 1
- Item 2

- [x] Item 1
	- [ ] Subitem 1
- [ ] Item 2

+ Item 1
	+ Subitem 1
+ Item 2

* Item 1
	* Subitem 1
* Item 2
``````

### Remove link spacing

Alias: `remove-link-spacing`

Removes spacing around link text.



Example: Space in regular markdown link text

Before:

``````markdown
[ here is link text1 ](link_here)
[ here is link text2](link_here)
[here is link text3 ](link_here)
[here is link text4](link_here)
[	here is link text5	](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
``````

After:

``````markdown
[here is link text1](link_here)
[here is link text2](link_here)
[here is link text3](link_here)
[here is link text4](link_here)
[here is link text5](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
``````
Example: Space in wiki link text

Before:

``````markdown
[[link_here| here is link text1 ]]
[[link_here|here is link text2 ]]
[[link_here| here is link text3]]
[[link_here|here is link text4]]
[[link_here|	here is link text5	]]
![[link_here|	here is link text6	]]
[[link_here]]
``````

After:

``````markdown
[[link_here|here is link text1]]
[[link_here|here is link text2]]
[[link_here|here is link text3]]
[[link_here|here is link text4]]
[[link_here|here is link text5]]
![[link_here|here is link text6]]
[[link_here]]
``````

### Remove Space around Fullwidth Characters

Alias: `remove-space-around-fullwidth-characters`

Ensures that fullwidth characters are not followed by whitespace (either single spaces or a tab). Note that this may causes issues with markdown format in some cases.



Example: Remove Spaces and Tabs around Fullwidth Characters

Before:

``````markdown
Full list of affected characters: ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
This is a fullwidth period	 。 with text after it.
This is a fullwidth comma	，  with text after it.
This is a fullwidth left parenthesis （ 	with text after it.
This is a fullwidth right parenthesis ）  with text after it.
This is a fullwidth colon ：  with text after it.
This is a fullwidth semicolon ；  with text after it.
  Ｒemoves space at start of line
``````

After:

``````markdown
Full list of affected characters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
This is a fullwidth period。with text after it.
This is a fullwidth comma，with text after it.
This is a fullwidth left parenthesis（with text after it.
This is a fullwidth right parenthesis）with text after it.
This is a fullwidth colon：with text after it.
This is a fullwidth semicolon；with text after it.
Ｒemoves space at start of line
``````
Example: Fullwidth Characters in List Do not Affect List Markdown Syntax

Before:

``````markdown
# List indicators should not have the space after them removed if they are followed by a fullwidth character

- ［ contents here］
  - 	［ more contents here］ more text here
+ 	［ another item here］
* ［ one last item here］

# Nested in a block quote

> - ［ contents here］
>   - 	［ more contents here］ more text here
> + 	［ another item here］
> * ［ one last item here］

# Doubly nested in a block quote

> The following is doubly nested
> > - ［ contents here］
> >   - 	［ more contents here］ more text here
> > + 	［ another item here］
> > * ［ one last item here］
``````

After:

``````markdown
# List indicators should not have the space after them removed if they are followed by a fullwidth character

- ［contents here］
  - ［more contents here］more text here
+ ［another item here］
* ［one last item here］

# Nested in a block quote

> - ［contents here］
>   - ［more contents here］more text here
> + ［another item here］
> * ［one last item here］

# Doubly nested in a block quote

> The following is doubly nested
> > - ［contents here］
> >   - ［more contents here］more text here
> > + ［another item here］
> > * ［one last item here］
``````

### Space after list markers

Alias: `space-after-list-markers`

There should be a single space after list markers and checkboxes.



Example: 

Before:

``````markdown
1.   Item 1
2.  Item 2

-   [ ] Item 1
- [x]    Item 2
	-  [ ] Item 3
``````

After:

``````markdown
1. Item 1
2. Item 2

- [ ] Item 1
- [x] Item 2
	- [ ] Item 3
``````

### Space between Chinese, Japanese, or Korean and English or numbers

Alias: `space-between-chinese,-japanese,-or-korean-and-english-or-numbers`

Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)



Example: Space between Chinese and English

Before:

``````markdown
中文字符串english中文字符串。
``````

After:

``````markdown
中文字符串 english 中文字符串。
``````
Example: Space between Chinese and link

Before:

``````markdown
中文字符串[english](http://example.com)中文字符串。
``````

After:

``````markdown
中文字符串 [english](http://example.com) 中文字符串。
``````
Example: Space between Chinese and inline code block

Before:

``````markdown
中文字符串`code`中文字符串。
``````

After:

``````markdown
中文字符串 `code` 中文字符串。
``````
Example: No space between Chinese and English in tag

Before:

``````markdown
#标签A #标签2标签
``````

After:

``````markdown
#标签A #标签2标签
``````
Example: Make sure that spaces are not added between italics and chinese characters to preserve markdown syntax

Before:

``````markdown
_这是一个数学公式_
*这是一个数学公式english*

# Handling bold and italics nested in each other is not supported at this time

**_这是一_个数学公式**
*这是一hello__个数学world公式__*
``````

After:

``````markdown
_这是一个数学公式_
*这是一个数学公式 english*

# Handling bold and italics nested in each other is not supported at this time

**_ 这是一 _ 个数学公式**
*这是一 hello__ 个数学 world 公式 __*
``````
Example: Images and links are ignored

Before:

``````markdown
[[这是一个数学公式english]]
![[这是一个数学公式english.jpg]]
[这是一个数学公式english](这是一个数学公式english.md)
![这是一个数学公式english](这是一个数学公式english.jpg)
``````

After:

``````markdown
[[这是一个数学公式english]]
![[这是一个数学公式english.jpg]]
[这是一个数学公式english](这是一个数学公式english.md)
![这是一个数学公式english](这是一个数学公式english.jpg)
``````
Example: Space between CJK and English

Before:

``````markdown
日本語englishひらがな
カタカナenglishカタカナ
ﾊﾝｶｸｶﾀｶﾅenglish１２３全角数字
한글english한글
``````

After:

``````markdown
日本語 english ひらがな
カタカナ english カタカナ
ﾊﾝｶｸｶﾀｶﾅ english１２３全角数字
한글 english 한글
``````

### Trailing spaces

Alias: `trailing-spaces`

Removes extra spaces after every line.

Options:
- Two Space Linebreak: Ignore two spaces followed by a line break ("Two Space Rule").
	- Default: `false`

Example: Removes trailing spaces and tabs.

Before:

``````markdown
# H1
Line with trailing spaces and tabs.	        
``````

After:

``````markdown
# H1
Line with trailing spaces and tabs.
``````
Example: With `Two Space Linebreak = true`

Before:

``````markdown
# H1
Line with trailing spaces and tabs.  
``````

After:

``````markdown
# H1
Line with trailing spaces and tabs.  
``````

## Paste
### Add Blockquote Indentation on Paste

Alias: `add-blockquote-indentation-on-paste`

Adds blockquotes to all but the first line, when the cursor is in a blockquote/callout line during pasting



Example: Line being pasted into regular text does not get blockquotified with current line being `Part 1 of the sentence`

Before:

``````markdown
was much less likely to succeed, but they tried it anyway.
Part 2 was much more interesting.
``````

After:

``````markdown
was much less likely to succeed, but they tried it anyway.
Part 2 was much more interesting.
``````
Example: Line being pasted into a blockquote gets blockquotified with current line being `> > `

Before:

``````markdown

This content is being added to a blockquote
Note that the second line is indented and the surrounding blank lines were trimmed

``````

After:

``````markdown
This content is being added to a blockquote
> > Note that the second line is indented and the surrounding blank lines were trimmed
``````

### Prevent Double Checklist Indicator on Paste

Alias: `prevent-double-checklist-indicator-on-paste`

Removes starting checklist indicator from the text to paste if the line the cursor is on in the file has a checklist indicator



Example: Line being pasted is left alone when current line has no checklist indicator in it: `Regular text here`

Before:

``````markdown
- [ ] Checklist item being pasted
``````

After:

``````markdown
- [ ] Checklist item being pasted
``````
Example: Line being pasted into a blockquote without a checklist indicator is left alone when it lacks a checklist indicator: `> > `

Before:

``````markdown
- [ ] Checklist item contents here
More content here
``````

After:

``````markdown
- [ ] Checklist item contents here
More content here
``````
Example: Line being pasted into a blockquote with a checklist indicator is has its checklist indicator removed when current line is: `> - [x] `

Before:

``````markdown
- [ ] Checklist item contents here
More content here
``````

After:

``````markdown
Checklist item contents here
More content here
``````
Example: Line being pasted with a checklist indicator is has its checklist indicator removed when current line is: `- [ ] `

Before:

``````markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

``````markdown
Checklist item 1
- [ ] Checklist item 2
``````

### Prevent Double List Item Indicator on Paste

Alias: `prevent-double-list-item-indicator-on-paste`

Removes starting list indicator from the text to paste if the line the cursor is on in the file has a list indicator



Example: Line being pasted is left alone when current line has no list indicator in it: `Regular text here`

Before:

``````markdown
- List item being pasted
``````

After:

``````markdown
- List item being pasted
``````
Example: Line being pasted into a blockquote without a list indicator is left alone when it lacks a list indicator: `> > `

Before:

``````markdown
* List item contents here
More content here
``````

After:

``````markdown
* List item contents here
More content here
``````
Example: Line being pasted into a blockquote with a list indicator is has its list indicator removed when current line is: `> * `

Before:

``````markdown
+ List item contents here
More content here
``````

After:

``````markdown
List item contents here
More content here
``````
Example: Line being pasted with a list indicator is has its list indicator removed when current line is: `+ `

Before:

``````markdown
- List item 1
- List item 2
``````

After:

``````markdown
List item 1
- List item 2
``````

### Proper Ellipsis on Paste

Alias: `proper-ellipsis-on-paste`

Replaces three consecutive dots with an ellipsis even if they have a space between them in the text to paste



Example: Replacing three consecutive dots with an ellipsis even if spaces are present

Before:

``````markdown
Lorem (...) Impsum.
Lorem (. ..) Impsum.
Lorem (. . .) Impsum.
``````

After:

``````markdown
Lorem (…) Impsum.
Lorem (…) Impsum.
Lorem (…) Impsum.
``````

### Remove Hyphens on Paste

Alias: `remove-hyphens-on-paste`

Removes hyphens from the text to paste



Example: Remove hyphen in content to paste

Before:

``````markdown
Text that was cool but hyper-
tension made it uncool.
``````

After:

``````markdown
Text that was cool but hypertension made it uncool.
``````

### Remove Leading or Trailing Whitespace on Paste

Alias: `remove-leading-or-trailing-whitespace-on-paste`

Removes any leading non-tab whitespace and all trailing whitespace for the text to paste



Example: Removes leading spaces and newline characters

Before:

``````markdown


         This text was really indented

``````

After:

``````markdown
This text was really indented
``````
Example: Leaves leading tabs alone

Before:

``````markdown


		This text is really indented

``````

After:

``````markdown
		This text is really indented
``````

### Remove Leftover Footnotes from Quote on Paste

Alias: `remove-leftover-footnotes-from-quote-on-paste`

Removes any leftover footnote references for the text to paste



Example: Footnote reference removed

Before:

``````markdown
He was sure that he would get off without doing any time, but the cops had other plans.50

_Note that the format for footnote references to move is a dot or comma followed by any number of digits_
``````

After:

``````markdown
He was sure that he would get off without doing any time, but the cops had other plans

_Note that the format for footnote references to move is a dot or comma followed by any number of digits_
``````

### Remove Multiple Blank Lines on Paste

Alias: `remove-multiple-blank-lines-on-paste`

Condenses multiple blank lines down into one blank line for the text to paste



Example: Multiple blanks lines condensed down to one

Before:

``````markdown
Here is the first line.




Here is some more text.
``````

After:

``````markdown
Here is the first line.

Here is some more text.
``````
Example: Text with only one blank line in a row is left alone

Before:

``````markdown
First line.

Last line.
``````

After:

``````markdown
First line.

Last line.
``````
