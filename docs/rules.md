<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Rules


## YAML
### Format Tags in YAML

Alias: `format-tags-in-yaml`

Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.



Example: Format Tags in YAML frontmatter

Before:

```markdown
---
tags: #one #two #three #nested/four/five
---
```

After:

```markdown
---
tags: one two three nested/four/five
---
```
Example: Format tags in array

Before:

```markdown
---
tags: [#one #two #three]
---
```

After:

```markdown
---
tags: [one two three]
---
```
Example: Format tags in list

Before:

```markdown
---
tags:
- #tag1
- #tag2
---
```

After:

```markdown
---
tags:
- tag1
- tag2
---
```

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

```markdown
---
animal: cat
---
```

After:

```markdown
---
aliases:
tags: doc
animal: cat
---
```

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
- Format: Date format
	- Default: `dddd, MMMM Do YYYY, h:mm:ss a`

Example: Adds a header with the date.

Before:

```markdown
# H1
```

After:

```markdown
---
date created: Wednesday, January 1st 2020, 12:00:00 am
date modified: Thursday, January 2nd 2020, 12:00:05 am
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
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
```
Example: Date Created Key is set

Before:

```markdown
# H1
```

After:

```markdown
---
created: Wednesday, January 1st 2020, 12:00:00 am
---
# H1
```
Example: Date Modified Key is set

Before:

```markdown
# H1
```

After:

```markdown
---
modified: Wednesday, January 1st 2020, 4:00:00 pm
---
# H1
```

### YAML Title

Alias: `yaml-title`

Inserts the title of the file into the YAML frontmatter. Gets the title from the first H1 or filename.

Options:
- Title Key: Which YAML key to use for title
	- Default: `title`

Example: Adds a header with the title from heading.

Before:

```markdown
# Obsidian
```

After:

```markdown
---
title: Obsidian
---
# Obsidian
```
Example: Adds a header with the title.

Before:

```markdown

```

After:

```markdown
---
title: Filename
---

```

### YAML Title Alias

Alias: `yaml-title-alias`

Inserts the title of the file into the YAML frontmatter's aliases section. Gets the title from the first H1 or filename.



Example: Adds a header with the title from heading.

Before:

```markdown
# Obsidian
```

After:

```markdown
---
aliases:
  # linter-yaml-title-alias
  - Obsidian
---
# Obsidian
```
Example: Adds a header with the title.

Before:

```markdown

```

After:

```markdown
---
aliases:
  # linter-yaml-title-alias
  - Filename
---

```

### Escape YAML Special Characters

Alias: `escape-yaml-special-characters`

Escapes colons with a space after them (: ), single quotes ('), and double quotes (") in YAML.

Options:
- Default Escape Character: The default character to use to escape YAML values when a single quote and double quote are not present.
	- Default: `"`
	- `"`: Use a double quote to escape if no single or double quote is present
	- `'`: Use a single quote to escape if no single or double quote is present
- Try to Escape Single Line Arrays: Tries to escape array values assuming that an array starts with "[", ends with "]", and has items that are delimited by ",".
	- Default: `false`

Example: YAML without anything to escape

Before:

```markdown
---
key: value
otherKey: []
---
```

After:

```markdown
---
key: value
otherKey: []
---
```
Example: YAML with unescaped values

Before:

```markdown
---
key: value: with colon in the middle
secondKey: value with ' a single quote present
thirdKey: "already escaped: value"
fourthKey: value with " a double quote present
fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
sixthKey: colon:between characters is fine
otherKey: []
---
```

After:

```markdown
---
key: "value: with colon in the middle"
secondKey: "value with ' a single quote present"
thirdKey: "already escaped: value"
fourthKey: 'value with " a double quote present'
fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
sixthKey: colon:between characters is fine
otherKey: []
---
```
Example: YAML with unescaped values in an expanded list with `Default Escape Character = '`

Before:

```markdown
---
key:
  - value: with colon in the middle
  - value with ' a single quote present
  - 'already escaped: value'
  - value with " a double quote present
  - value with both ' " a double and single quote present is not escaped, but is invalid YAML
  - colon:between characters is fine
---
```

After:

```markdown
---
key:
  - 'value: with colon in the middle'
  - "value with ' a single quote present"
  - 'already escaped: value'
  - 'value with " a double quote present'
  - value with both ' " a double and single quote present is not escaped, but is invalid YAML
  - colon:between characters is fine
---
```
Example: YAML with unescaped values with arrays

Before:

```markdown
---
array: [value: with colon in the middle, value with ' a single quote present, "already escaped: value", value with " a double quote present, value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [[value: with colon in the middle, value with ' a single quote present], ["already escaped: value", value with " a double quote present], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [[value: with colon in the middle], value with ' a single quote present]
---

_Note that escaped commas in a YAML array will be treated as a separator._
```

After:

```markdown
---
array: ["value: with colon in the middle", "value with ' a single quote present", "already escaped: value", 'value with " a double quote present', value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [["value: with colon in the middle", "value with ' a single quote present"], ["already escaped: value", 'value with " a double quote present'], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [["value: with colon in the middle"], "value with ' a single quote present"]
---

_Note that escaped commas in a YAML array will be treated as a separator._
```

## Heading
### Header Increment

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
Example: Skipped headings in sections that would be decremented will result in those headings not having the same meaning

Before:

```markdown
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
```

After:

```markdown
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
```

### File Name Heading

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
Example: With `Title Case=true`, `Ignore Cased Words=true`

Before:

```markdown
# this is a heading 1
## THIS IS A HEADING 2
### a hEaDiNg 3
```

After:

```markdown
# This is a Heading 1
## THIS IS A HEADING 2
### A hEaDiNg 3
```
Example: With `First letter=true`

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
Example: With `ALL CAPS=true`

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

## Footnote
### Move Footnotes to the bottom

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

### Re-Index Footnotes

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

### Footnote after Punctuation

Alias: `footnote-after-punctuation`

Ensures that footnote references are placed after punctuation, not before.



Example: Placing footnotes after punctuation.

Before:

```markdown
Lorem[^1]. Ipsum[^2], doletes.
```

After:

```markdown
Lorem.[^1] Ipsum,[^2] doletes.
```

## Content
### Remove Multiple Spaces

Alias: `remove-multiple-spaces`

Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. 



Example: Removing double and triple space.

Before:

```markdown
Lorem ipsum   dolor  sit amet.
```

After:

```markdown
Lorem ipsum dolor sit amet.
```

### Remove Hyphenated Line Breaks

Alias: `remove-hyphenated-line-breaks`

Removes hyphenated line breaks. Useful when pasting text from textbooks.



Example: Removing hyphenated line breaks.

Before:

```markdown
This text has a linebr‐ eak.
```

After:

```markdown
This text has a linebreak.
```

### Remove Consecutive List Markers

Alias: `remove-consecutive-list-markers`

Removes consecutive list markers. Useful when copy-pasting list items.



Example: Removing consecutive list markers.

Before:

```markdown
- item 1
- - copypasted item A
- item 2
  - indented item
  - - copypasted item B
```

After:

```markdown
- item 1
- copypasted item A
- item 2
  - indented item
  - copypasted item B
```

### Remove Empty List Markers

Alias: `remove-empty-list-markers`

Removes empty list markers, i.e. list items without content.



Example: Removes empty list markers.

Before:

```markdown
- item 1
-
- item 2
```

After:

```markdown
- item 1
- item 2
```

### Convert Bullet List Markers

Alias: `convert-bullet-list-markers`

Converts common bullet list marker symbols to markdown list markers.



Example: Converts •

Before:

```markdown
• item 1
• item 2
```

After:

```markdown
- item 1
- item 2
```
Example: Converts §

Before:

```markdown
• item 1
  § item 2
  § item 3
```

After:

```markdown
- item 1
  - item 2
  - item 3
```

### Proper Ellipsis

Alias: `proper-ellipsis`

Replaces three consecutive dots with an ellipsis.



Example: Replacing three consecutive dots with an ellipsis.

Before:

```markdown
Lorem (...) Impsum.
```

After:

```markdown
Lorem (…) Impsum.
```

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

```markdown
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
```

After:

```markdown
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
```
Example: Emphasis indicators should use asterisks when style is set to 'asterisk'

Before:

```markdown
# Emphasis Cases

_Test emphasis_
_ Test not emphasized _
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is ___nested bold__ and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
```

After:

```markdown
# Emphasis Cases

*Test emphasis*
_ Test not emphasized _
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is __*nested emphasis* and ending bold__

__Test bold__
```
Example: Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to 'consistent'

Before:

```markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is _emphasized_ mid sentence
This is *emphasized* mid sentence with a second _emphasis_ on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is **_nested emphasis_ and ending bold**

__Test bold__
```

After:

```markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is ***nested emphasis* and ending bold**

__Test bold__
```
Example: Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to 'consistent'

Before:

```markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is *emphasized* mid sentence with a second _emphasis_ on the same line
This is *__bold and emphasized__*
This is _**nested bold** and ending emphasized_
This is __*nested emphasis* and ending bold__

__Test bold__
```

After:

```markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is _**nested bold** and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
```

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

```markdown
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
```

After:

```markdown
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
```
Example: Strong indicators should use asterisks when style is set to 'asterisk'

Before:

```markdown
# Strong/Bold Cases

__Test bold__
__ Test not bold __
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is ___nested bold__ and ending emphasized_
This is ___nested emphasis_ and ending bold__

_Test emphasis_
```

After:

```markdown
# Strong/Bold Cases

**Test bold**
__ Test not bold __
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is _**nested bold** and ending emphasized_
This is **_nested emphasis_ and ending bold**

_Test emphasis_
```
Example: Strong indicators should use consistent style based on first strong indicator in a file when style is set to 'consistent'

Before:

```markdown
# Strong First Strong Is an Asterisk

**First bold**
This is __bold__ mid sentence
This is __bold__ mid sentence with a second **bold** on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is **_nested emphasis_ and ending bold**

__Test bold__
```

After:

```markdown
# Strong First Strong Is an Asterisk

**First bold**
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is ***nested bold** and ending emphasized*
This is **_nested emphasis_ and ending bold**

**Test bold**
```
Example: Strong indicators should use consistent style based on first strong indicator in a file when style is set to 'consistent'

Before:

```markdown
# Strong First Strong Is an Underscore

__First bold__
This is **bold** mid sentence
This is **bold** mid sentence with a second __bold__ on the same line
This is **_bold and emphasized_**
This is ***nested bold** and ending emphasized*
This is ___nested emphasis_ and ending bold__

**Test bold**
```

After:

```markdown
# Strong First Strong Is an Underscore

__First bold__
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is ___nested emphasis_ and ending bold__

__Test bold__
```

### No Bare URLs

Alias: `no-bare-urls`

Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.



Example: Make sure that links are inside of angle brackets when not in single quotes('), double quotes("), or backticks(`)

Before:

```markdown
https://github.com
braces around url should stay the same: [https://github.com]
backticks around url should stay the same: `https://github.com`
Links mid-sentence should be updated like https://google.com will be.
'https://github.com'
"https://github.com"
<https://github.com>
links should stay the same: [](https://github.com)
https://gitlab.com
```

After:

```markdown
<https://github.com>
braces around url should stay the same: [https://github.com]
backticks around url should stay the same: `https://github.com`
Links mid-sentence should be updated like <https://google.com> will be.
'https://github.com'
"https://github.com"
<https://github.com>
links should stay the same: [](https://github.com)
<https://gitlab.com>
```
Example: Angle brackets are added if the url is not the only text in the single quotes('), double quotes("), or backticks(`)

Before:

```markdown
[https://github.com some text here]
backticks around a url should stay the same, but only if the only contents of the backticks: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
```

After:

```markdown
[<https://github.com> some text here]
backticks around a url should stay the same, but only if the only contents of the backticks: `<https://github.com> some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
```

### Two Spaces Between Lines with Content

Alias: `two-spaces-between-lines-with-content`

Makes sure that two spaces are added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items



Example: Make sure two spaces are added to the ends of lines that have content on it and the next line for lists, blockquotes, and paragraphs

Before:

```markdown
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

```

After:

```markdown
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

```

## Spacing
### Trailing spaces

Alias: `trailing-spaces`

Removes extra spaces after every line.

Options:
- Two Space Linebreak: Ignore two spaces followed by a line break ("Two Space Rule").
	- Default: `false`

Example: Removes trailing spaces and tabs.

Before:

```markdown
# H1   
Line with trailing spaces and tabs.	        
```

After:

```markdown
# H1
Line with trailing spaces and tabs.
```
Example: With `Two Space Linebreak = true`

Before:

```markdown
# H1
Line with trailing spaces and tabs.  
```

After:

```markdown
# H1
Line with trailing spaces and tabs.  
```

### Heading blank lines

Alias: `heading-blank-lines`

All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).

Options:
- Bottom: Insert a blank line after headings
	- Default: `true`

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
Example: With `Bottom=false`

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

### Paragraph blank lines

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

### Space after list markers

Alias: `space-after-list-markers`

There should be a single space after list markers and checkboxes.



Example: 

Before:

```markdown
1.   Item 1
2.  Item 2

-   [ ] Item 1
- [x]    Item 2
	-  [ ] Item 3
```

After:

```markdown
1. Item 1
2. Item 2

- [ ] Item 1
- [x] Item 2
	- [ ] Item 3
```

### Remove Empty Lines Between List Markers and Checklists

Alias: `remove-empty-lines-between-list-markers-and-checklists`

There should not be any empty lines between list markers and checklists.



Example: 

Before:

```markdown
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
```

After:

```markdown
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
```

### Compact YAML

Alias: `compact-yaml`

Removes leading and trailing blank lines in the YAML front matter.

Options:
- Inner New Lines: Remove new lines that are not at the start or the end of the YAML
	- Default: `false`

Example: Remove blank lines at the start and end of the YAML

Before:

```markdown
---

date: today

title: unchanged without inner new lines turned on

---
```

After:

```markdown
---
date: today

title: unchanged without inner new lines turned on
---
```
Example: Remove blank lines anywhere in YAML with inner new lines set to true

Before:

```markdown
---

date: today


title: remove inner new lines

---

# Header 1


Body content here.
```

After:

```markdown
---
date: today
title: remove inner new lines
---

# Header 1


Body content here.
```

### Consecutive blank lines

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

### Convert Spaces to Tabs

Alias: `convert-spaces-to-tabs`

Converts leading spaces to tabs.

Options:
- Tabsize: Number of spaces that will be converted to a tab
	- Default: `4`

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

### Line Break at Document End

Alias: `line-break-at-document-end`

Ensures that there is exactly one line break at the end of a document.



Example: Appending a line break to the end of the document.

Before:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
```

After:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

```
Example: Removing trailing line breaks to the end of the document, except one.

Before:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.



```

After:

```markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

```

### Space between Chinese and English or numbers

Alias: `space-between-chinese-and-english-or-numbers`

Ensures that Chinese and English or numbers are separated by a single space. Follow this [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)



Example: Space between Chinese and English

Before:

```markdown
中文字符串english中文字符串。
```

After:

```markdown
中文字符串 english 中文字符串。
```
Example: Space between Chinese and link

Before:

```markdown
中文字符串[english](http://example.com)中文字符串。
```

After:

```markdown
中文字符串 [english](http://example.com) 中文字符串。
```
Example: Space between Chinese and inline code block

Before:

```markdown
中文字符串`code`中文字符串。
```

After:

```markdown
中文字符串 `code` 中文字符串。
```
Example: No space between Chinese and English in tag

Before:

```markdown
#标签A #标签2标签
```

After:

```markdown
#标签A #标签2标签
```

### Remove link spacing

Alias: `remove-link-spacing`

Removes spacing around link text.



Example: Space in regular markdown link text

Before:

```markdown
[ here is link text1 ](link_here)
[ here is link text2](link_here)
[here is link text3 ](link_here)
[here is link text4](link_here)
[	here is link text5	](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
```

After:

```markdown
[here is link text1](link_here)
[here is link text2](link_here)
[here is link text3](link_here)
[here is link text4](link_here)
[here is link text5](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
```
Example: Space in wiki link text

Before:

```markdown
[[link_here| here is link text1 ]]
[[link_here|here is link text2 ]]
[[link_here| here is link text3]]
[[link_here|here is link text4]]
[[link_here|	here is link text5	]]
![[link_here|	here is link text6	]]
[[link_here]]
```

After:

```markdown
[[link_here|here is link text1]]
[[link_here|here is link text2]]
[[link_here|here is link text3]]
[[link_here|here is link text4]]
[[link_here|here is link text5]]
![[link_here|here is link text6]]
[[link_here]]
```
