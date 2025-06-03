<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# YAML Rules

These rules try their best to work with YAML values in [Obsidian.md](https://obsidian.md/). There are a couple of things to keep in mind about these rules:

- The rules work on most YAML use cases, but it is not perfect
- There are certain formats of YAML that may have problems being parsed since the YAML keys have their values parsed via regex instead of a library at this time
- Comments in the value of a key may cause problems with things like sorting or properly grabbing a key's value
- Blank lines may be removed if you try sorting or making modifications to the order of keys in the YAML via the Linter


## Add Blank Line After YAML

Alias: `add-blank-line-after-yaml`

Adds a blank line after the YAML block if it does not end the current file or it is not already followed by at least 1 blank line





### Examples

<details><summary>A file with just YAML in it does not get a blank line after the YAML</summary>

Before:

`````` markdown
---
key: value
---
``````

After:

`````` markdown
---
key: value
---
``````
</details>
<details><summary>A file with YAML followed directly by content has an empty line added</summary>

Before:

`````` markdown
---
key: value
---
Here is some text
``````

After:

`````` markdown
---
key: value
---

Here is some text
``````
</details>
<details><summary>A file with YAML that already has a blank line after it and before content has no empty line added</summary>

Before:

`````` markdown
---
key: value
---

Here is some text
``````

After:

`````` markdown
---
key: value
---

Here is some text
``````
</details>

## Dedupe YAML Array Values

Alias: `dedupe-yaml-array-values`

Removes duplicate array values in a case sensitive manner.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Dedupe YAML aliases section` | Turns on removing duplicate aliases. | N/A | `true` |
| `Dedupe YAML tags section` | Turns on removing duplicate tags. | N/A | `true` |
| `Dedupe YAML array sections` | Turns on removing duplicate values for regular YAML arrays | N/A | `true` |
| `YAML Keys to Ignore` | A list of YAML keys without the ending colon on their own lines that are not meant to have duplicate values removed from them. | N/A |  |



### Examples

<details><summary>Dedupe YAML tags is case sensitive and will use your default format for tags.</summary>

Before:

`````` markdown
---
tags: [computer, research, computer, Computer]
aliases:
  - Title 1
  - Title2
---
``````

After:

`````` markdown
---
tags: [computer, research, Computer]
aliases:
  - Title 1
  - Title2
---
``````
</details>
<details><summary>Dedupe YAML aliases is case sensitive and will use your default format for aliases.</summary>

Before:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
  - Title 1
  - Title2
  - Title 3
---
``````

After:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
  - Title 3
---
``````
</details>
<details><summary>Dedupe YAML array keys is case sensitive and will try to preserve the original array format.</summary>

Before:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val, val2, Val]
arr2:
  - Val
  - Val
  - val
  - val2
  - Val2
---
``````

After:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val2, Val]
arr2:
  - Val
  - val
  - val2
  - Val2
---
``````
</details>
<details><summary>Dedupe YAML respects list of keys to not remove duplicates of for normal arrays (keys to ignore is just `arr2` for this example)</summary>

Before:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val, val2, Val]
arr2:
  - Val
  - Val
  - val
  - val2
  - Val2
---
``````

After:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val2, Val]
arr2:
  - Val
  - Val
  - val
  - val2
  - Val2
---
``````
</details>

## Escape YAML Special Characters

Alias: `escape-yaml-special-characters`

Escapes colons with a space after them (: ), single quotes ('), and double quotes (") in YAML.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Try to Escape Single Line Arrays` | Tries to escape array values assuming that an array starts with "[", ends with "]", and has items that are delimited by ",". | N/A | false |



### Examples

<details><summary>YAML without anything to escape</summary>

Before:

`````` markdown
---
key: value
otherKey: []
---
``````

After:

`````` markdown
---
key: value
otherKey: []
---
``````
</details>
<details><summary>YAML with unescaped values</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>YAML with unescaped values in an expanded list with `Default Escape Character = '`</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>YAML with unescaped values with arrays</summary>

Before:

`````` markdown
---
array: [value: with colon in the middle, value with ' a single quote present, "already escaped: value", value with " a double quote present, value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [[value: with colon in the middle, value with ' a single quote present], ["already escaped: value", value with " a double quote present], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [[value: with colon in the middle], value with ' a single quote present]
---

_Note that escaped commas in a YAML array will be treated as a separator._
``````

After:

`````` markdown
---
array: ["value: with colon in the middle", "value with ' a single quote present", "already escaped: value", 'value with " a double quote present', value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [["value: with colon in the middle", "value with ' a single quote present"], ["already escaped: value", 'value with " a double quote present'], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [["value: with colon in the middle"], "value with ' a single quote present"]
---

_Note that escaped commas in a YAML array will be treated as a separator._
``````
</details>

## Force YAML Escape

Alias: `force-yaml-escape`

Escapes the values for the specified YAML keys.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Force YAML Escape on Keys` | Uses the YAML escape character on the specified YAML keys separated by a new line character if it is not already escaped. Do not use on YAML arrays. | N/A |  |



### Examples

<details><summary>YAML without anything to escape</summary>

Before:

`````` markdown
---
key: value
otherKey: []
---
``````

After:

`````` markdown
---
key: value
otherKey: []
---
``````
</details>
<details><summary>Force YAML keys to be escaped with double quotes where not already escaped with `Force YAML Escape on Keys = 'key'\n'title'\n'bool'`</summary>

Before:

`````` markdown
---
key: 'Already escaped value'
title: This is a title
bool: false
unaffected: value
---

_Note that the force YAML key option should not be used with arrays._
``````

After:

`````` markdown
---
key: 'Already escaped value'
title: "This is a title"
bool: "false"
unaffected: value
---

_Note that the force YAML key option should not be used with arrays._
``````
</details>

## Format Tags in YAML

Alias: `format-tags-in-yaml`

Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.





### Examples

<details><summary>Format Tags in YAML frontmatter</summary>

Before:

`````` markdown
---
tags: #one #two #three #nested/four/five
---
``````

After:

`````` markdown
---
tags: one two three nested/four/five
---
``````
</details>
<details><summary>Format tags in array</summary>

Before:

`````` markdown
---
tags: [#one #two #three]
---
``````

After:

`````` markdown
---
tags: [one two three]
---
``````
</details>
<details><summary>Format tags in array with `tag` as the tags key</summary>

Before:

`````` markdown
---
tag: [#one #two #three]
---
``````

After:

`````` markdown
---
tag: [one two three]
---
``````
</details>
<details><summary>Format tags in list</summary>

Before:

`````` markdown
---
tags:
- #tag1
- #tag2
---
``````

After:

`````` markdown
---
tags:
- tag1
- tag2
---
``````
</details>

## Format YAML Array

Alias: `format-yaml-array`

Allows for the formatting of regular YAML arrays as either multi-line or single-line and <code>tags</code> and <code>aliases</code> are allowed to have some Obsidian specific YAML formats. <b>Note: that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.</b>

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Format YAML aliases section` | Turns on formatting for the YAML aliases section. You should not enable this option alongside the rule <code>YAML Title Alias</code> as they may not work well together or they may have different format styles selected causing unexpected results. | N/A | `true` |
| `Format YAML tags section` | Turns on formatting for the YAML tags section. | N/A | `true` |
| `Default YAML array section style` | The style of other YAML arrays that are not <code>tags</code>, <code>aliases</code> or  in <code>Force key values to be single-line arrays</code> and <code>Force key values to be multi-line arrays</code> | `multi-line`: ```key:\n  - value```<br/><br/>`single-line`: ```key: [value]``` | `single-line` |
| `Format YAML array sections` | Turns on formatting for regular YAML arrays | N/A | `true` |
| `Force key values to be single-line arrays` | Forces the YAML array for the new line separated keys to be in single-line format (leave empty to disable this option) | N/A |  |
| `Force key values to be multi-line arrays` | Forces the YAML array for the new line separated keys to be in multi-line format (leave empty to disable this option) | N/A |  |



### Examples

<details><summary>Format tags as a single-line array delimited by spaces and aliases as a multi-line array and format the key `test` to be a single-line array</summary>

Before:

`````` markdown
---
tags:
  - computer
  - research
aliases: Title 1, Title2
test: this is a value
---

# Notes:

Nesting YAML arrays may result in unexpected results.

Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid YAML unless it comes as the last entry in the array.
``````

After:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
test: [this is a value]
---

# Notes:

Nesting YAML arrays may result in unexpected results.

Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid YAML unless it comes as the last entry in the array.
``````
</details>
<details><summary>Format tags as a single string with space delimiters, ignore aliases, and format regular YAML arrays as single-line arrays</summary>

Before:

`````` markdown
---
aliases: Typescript
types:
  - thought provoking
  - peer reviewed
tags: [computer, science, trajectory]
---
``````

After:

`````` markdown
---
aliases: Typescript
types: [thought provoking, peer reviewed]
tags: computer science trajectory
---
``````
</details>
<details><summary>Arrays with dictionaries in them are ignored</summary>

Before:

`````` markdown
---
gists:
  - id: test123
    url: 'some_url'
    filename: file.md
    isPublic: true
---
``````

After:

`````` markdown
---
gists:
  - id: test123
    url: 'some_url'
    filename: file.md
    isPublic: true
---
``````
</details>

## Insert YAML attributes

Alias: `insert-yaml-attributes`

Inserts the given YAML attributes into the YAML frontmatter. Put each attribute on a single line.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Text to insert` | Text to insert into the YAML frontmatter | N/A | `aliases: 
tags: ` |



### Examples

<details><summary>Insert static lines into YAML frontmatter. Text to insert: `aliases:
tags: doc
animal: dog`</summary>

Before:

`````` markdown
---
animal: cat
---
``````

After:

`````` markdown
---
aliases:
tags: doc
animal: cat
---
``````
</details>

## Move Tags to YAML

Alias: `move-tags-to-yaml`

Move all tags to YAML frontmatter of the document.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Body tag operation` | What to do with non-ignored tags in the body of the file once they have been moved to the frontmatter | `Nothing`: Leaves tags in the body of the file alone<br/><br/>`Remove hashtag`: Removes `#` from tags in content body after moving them to the YAML frontmatter<br/><br/>`Remove whole tag`: Removes the whole tag in content body after moving them to the YAML frontmatter. _Note that this removes the first space prior to the tag as well_ | `Nothing` |
| `Tags to ignore` | The tags that will not be moved to the tags array or removed from the body content if <code>Remove the hashtag from tags in content body</code> is enabled. Each tag should be on a new line and without the <code>#</code>. <b>Make sure not to include the hashtag in the tag name.</b> | N/A |  |



### Examples

<details><summary>Move tags from body to YAML with `Tags to ignore = 'ignored-tag'`</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Move tags from body to YAML with existing tags retains the already existing ones and only adds new ones</summary>

Before:

`````` markdown
---
tags: [test, tag2]
---
Text has to do with #test and #markdown
``````

After:

`````` markdown
---
tags: [test, tag2, markdown]
---
Text has to do with #test and #markdown
``````
</details>
<details><summary>Move tags to YAML frontmatter and then remove hashtags in body content tags when `Body tag operation = 'Remove hashtag'` and `Tags to ignore = 'yet-another-ignored-tag'`.</summary>

Before:

`````` markdown
---
tags: [test, tag2]
---
Text has to do with #test and #markdown

The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
``````

After:

`````` markdown
---
tags: [test, tag2, markdown]
---
Text has to do with test and markdown

The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
``````
</details>
<details><summary>Move tags to YAML frontmatter and then remove body content tags when `Body tag operation = 'Remove whole tag'`.</summary>

Before:

`````` markdown
---
tags: [test, tag2]
---
This document will have #tags removed and spacing around tags is left alone except for the space prior to the hashtag #warning
``````

After:

`````` markdown
---
tags: [test, tag2, tags, warning]
---
This document will have removed and spacing around tags is left alone except for the space prior to the hashtag
``````
</details>

## Remove YAML Keys

Alias: `remove-yaml-keys`

Removes the YAML keys specified

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `YAML Keys to Remove` | The YAML keys to remove from the YAML frontmatter with or without colons | N/A |  |



### Examples

<details><summary>Removes the values specified in `YAML Keys to Remove` = "status:
keywords
date"</summary>

Before:

`````` markdown
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

`````` markdown
---
language: Typescript
type: programming
tags: computer
---

# Header Context

Text
``````
</details>

## Sort YAML Array Values

Alias: `sort-yaml-array-values`

Sorts YAML array values based on the specified sort order.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Sort YAML aliases section` | Turns on sorting aliases. | N/A | `true` |
| `Sort YAML tags section` | Turns on sorting tags. | N/A | `true` |
| `Sort YAML array sections` | Turns on sorting values for regular YAML arrays | N/A | `true` |
| `YAML Keys to Ignore` | A list of YAML keys without the ending colon on their own lines that are not meant to have their values sorted. | N/A |  |
| `Sort Order` | The way to sort the YAML array values. | `Ascending Alphabetical`: Sorts the array values from a to z<br/><br/>`Descending Alphabetical`: Sorts the array values from z to a | `Ascending Alphabetical` |



### Examples

<details><summary>Sorting YAML array values alphabetically</summary>

Before:

`````` markdown
---
tags: [computer, research, androids, Computer]
aliases:
  - Title 1
  - Title 2
---
``````

After:

`````` markdown
---
tags: [androids, computer, Computer, research]
aliases:
  - Title 1
  - Title 2
---
``````
</details>
<details><summary>Sorting YAML array values to be alphabetically descending</summary>

Before:

`````` markdown
---
tags: [computer, research, androids, Computer]
aliases:
  - Title 1
  - Title 2
---
``````

After:

`````` markdown
---
tags: [research, Computer, computer, androids]
aliases:
  - Title 2
  - Title 1
---
``````
</details>
<details><summary>Sort YAML Arrays respects list of keys to not sort values of for normal arrays (keys to ignore is just `arr2` for this example)</summary>

Before:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title 2
arr1: [val, val2, val1]
arr2:
  - val
  - val2
  - val1
---
``````

After:

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title 2
arr1: [val, val1, val2]
arr2:
  - val
  - val2
  - val1
---
``````
</details>

## YAML Key Sort

Alias: `yaml-key-sort`

Sorts the YAML keys based on the order and priority specified. <b>Note: may remove blank lines as well. Only works on non-nested keys.</b>

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `YAML Key Priority Sort Order` | The order in which to sort keys with one on each line where it sorts in the order found in the list | N/A |  |
| `Priority Keys at Start of YAML` | YAML Key Priority Sort Order is placed at the start of the YAML frontmatter | N/A | `true` |
| `YAML Sort Order for Other Keys` | The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area | `None`: No sorting other than what is in the YAML Key Priority Sort Order text area<br/><br/>`Ascending Alphabetical`: Sorts the keys based on key value from a to z<br/><br/>`Descending Alphabetical`: Sorts the keys based on key value from z to a | `None` |



### Examples

<details><summary>Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`</summary>

Before:

`````` markdown
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

`````` markdown
---
date: 02/15/2022
type: programming
language: Typescript
tags: computer
keywords: []
status: WIP
---
``````
</details>
<details><summary>Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `'YAML Sort Order for Other Keys' = Ascending Alphabetical`</summary>

Before:

`````` markdown
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

`````` markdown
---
date: 02/15/2022
type: programming
language: Typescript
keywords: []
status: WIP
tags: computer
---
``````
</details>
<details><summary>Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `'YAML Sort Order for Other Keys' = Descending Alphabetical`</summary>

Before:

`````` markdown
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

`````` markdown
---
date: 02/15/2022
type: programming
language: Typescript
tags: computer
status: WIP
keywords: []
---
``````
</details>
<details><summary>Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `'YAML Sort Order for Other Keys' = Descending Alphabetical` and `'Priority Keys at Start of YAML' = false`</summary>

Before:

`````` markdown
---
language: Typescript
type: programming
tags: computer
keywords: []

status: WIP
date: 02/15/2022
---
Any blank line is attached to the line that follows it
``````

After:

`````` markdown
---
tags: computer

status: WIP
keywords: []
date: 02/15/2022
type: programming
language: Typescript
---
Any blank line is attached to the line that follows it
``````
</details>

## YAML Timestamp

Alias: `yaml-timestamp`

Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Date Created` | Insert the file creation date | N/A | `true` |
| `Date Created Key` | Which YAML key to use for creation date | N/A | `date created` |
| `Date Created Source of Truth` | Specifies where to get the date created value from if it is already present in the frontmatter. | `file system`: The file system date created value is used to set the value of date created in the frontmatter<br/><br/>`frontmatter`: When a value is present in the frontmatter for date created, this value is used as the value for the date created | `file system` |
| `Date Modified` | Insert the date the file was last modified | N/A | `true` |
| `Date Modified Key` | Which YAML key to use for modification date | N/A | `date modified` |
| `Date Modified Source of Truth` | Specifies what way should be used to determine when the date modified should be updated if it is already present in the frontmatter. | `file system`: The file system date modified value is used to set the value of date modified in the frontmatter<br/><br/>`user or Linter edits`: When a value is present in the frontmatter for date modified, date modified is kept as is unless the Linter makes a change to a note or the user edits a note with the setting `Update YAML Timestamp on File Contents Update` set to something other than `Never`. | `file system` |
| `Format` | Moment date format to use (see <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">Moment format options</a>) | N/A | `dddd, MMMM Do YYYY, h:mm:ss a` |
| `Convert Local Time to UTC` | Uses UTC equivalent for saved dates instead of local time | N/A | false |
| `Update YAML Timestamp on File Contents Update` | When the currently active note is modified, <code>YAML Timestamp</code> is run on the note. This should update the modified note timestamp if it is more than 5 seconds off from the current value. | `never`: never<br/><br/>`after 5 seconds`: after 5 seconds<br/><br/>`after 10 seconds`: after 10 seconds<br/><br/>`after 15 seconds`: after 15 seconds<br/><br/>`after 30 seconds`: after 30 seconds<br/><br/>`after 1 minute`: after 1 minute | `never` |

### Additional Info


#### Date Modified Value Origin

The date modified is _not_ based on the file date modified metadata. This is because the Linter only has access to the last
date modified when it runs. This is not a problem or too noticeable when you modify a file frequently.
However, when a file is rarely updated, the date modified could be very out of date.

For example, say the date modified is January 22nd 2020. But you update the file on January 3rd 2021. The date modified in
the YAML frontmatter would say January 22nd 2020 despite being updated in 2021. If you did not run the Linter
against the file a 2nd time, it could be left with a very misleading value. As such, the date modified is the time when
Linter asks to update the file via any rule except Custom Commands. This should be within about 5 seconds of the value in the file metadata.


### Examples

<details><summary>Adds a header with the date.</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
date created: Wednesday, January 1st 2020, 12:00:00 am
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
``````
</details>
<details><summary>dateCreated option is false</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
``````
</details>
<details><summary>Date Created Key is set</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
created: Wednesday, January 1st 2020, 12:00:00 am
---
# H1
``````
</details>
<details><summary>Date Modified Key is set</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
modified: Wednesday, January 1st 2020, 4:00:00 pm
---
# H1
``````
</details>
<details><summary>Header is set with convert to UTC option true</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
date created: 2020-01-01T14:00:00+00:00
date modified: 2020-01-02T02:00:05+00:00
---
# H1
``````
</details>
<details><summary>dateCreated option is false with convert to UTC option true</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
date modified: 2020-01-02T02:00:05+00:00
---
# H1
``````
</details>
<details><summary>Date Created Key is set with convert to UTC option true</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
created: 2020-01-01T14:00:00+00:00
---
# H1
``````
</details>
<details><summary>Date Modified Key is set with convert to UTC option true</summary>

Before:

`````` markdown
# H1
``````

After:

`````` markdown
---
modified: 2020-01-02T02:00:05+00:00
---
# H1
``````
</details>

## YAML Title

Alias: `yaml-title`

Inserts the title of the file into the YAML frontmatter. Gets the title based on the selected mode.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Title Key` | Which YAML key to use for title | N/A | `title` |
| `Mode` | The method to use to get the title | `first-h1-or-filename-if-h1-missing`: Uses the first H1 in the file or the filename of the file if there is not H1<br/><br/>`filename`: Uses the filename as the title<br/><br/>`first-h1`: Uses the first H1 in the file as the title | `first-h1-or-filename-if-h1-missing` |



### Examples

<details><summary>Adds a header with the title from heading when `mode = 'First H1 or Filename if H1 Missing'`.</summary>

Before:

`````` markdown
# Obsidian
``````

After:

`````` markdown
---
title: Obsidian
---
# Obsidian
``````
</details>
<details><summary>Adds a header with the title when `mode = 'First H1 or Filename if H1 Missing'`.</summary>

Before:

`````` markdown

``````

After:

`````` markdown
---
title: Filename
---

``````
</details>
<details><summary>Make sure that markdown links in headings are properly copied to the YAML as just the text when `mode = 'First H1 or Filename if H1 Missing'`</summary>

Before:

`````` markdown
# This is a [Heading](test heading.md)
``````

After:

`````` markdown
---
title: This is a Heading
---
# This is a [Heading](test heading.md)
``````
</details>
<details><summary>When `mode = 'First H1'`, title does not have a value if no H1 is present</summary>

Before:

`````` markdown
## This is a Heading
``````

After:

`````` markdown
---
title: ""
---
## This is a Heading
``````
</details>
<details><summary>When `mode = 'Filename'`, title uses the filename ignoring all H1s. Note: the filename is "Filename" in this example.</summary>

Before:

`````` markdown
# This is a Heading
``````

After:

`````` markdown
---
title: Filename
---
# This is a Heading
``````
</details>

## YAML Title Alias

Alias: `yaml-title-alias`

Inserts or updates the title of the file into the YAML frontmatter's aliases section. Gets the title from the first H1 or filename.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Preserve existing aliases section style` | If set, the <code>YAML aliases section style</code> setting applies only to the newly created sections | N/A | `true` |
| `Keep alias that matches the filename` | Such aliases are usually redundant | N/A | false |
| `Use the YAML key specified by <code>Alias Helper Key</code> to help with filename and heading changes` | If set, when the first H1 heading changes or filename if first H1 is not present changes, then the old alias stored in this key will be replaced with the new value instead of just inserting a new entry in the aliases array | N/A | `true` |
| `Alias Helper Key` | The key to use to help keep track of what the last file name or heading was that was stored in the frontmatter by this rule. | N/A | `linter-yaml-title-alias` |

### Additional Info


!!! Note
    An empty `Alias Helper Key` will be treated as if you are using `linter-yaml-title-alias` as the value.


### Examples

<details><summary>Adds a header with the title from heading.</summary>

Before:

`````` markdown
# Obsidian
``````

After:

`````` markdown
---
aliases:
  - Obsidian
linter-yaml-title-alias: Obsidian
---
# Obsidian
``````
</details>
<details><summary>Adds a header with the title from heading without YAML key when the use of the YAML key is set to false.</summary>

Before:

`````` markdown
# Obsidian
``````

After:

`````` markdown
---
aliases:
  - Obsidian
---
# Obsidian
``````
</details>
<details><summary>Adds a header with the title.</summary>

Before:

`````` markdown

``````

After:

`````` markdown
---
aliases:
  - Filename
linter-yaml-title-alias: Filename
---

``````
</details>
<details><summary>Adds a header with the title without YAML key when the use of the YAML key is set to false.</summary>

Before:

`````` markdown

``````

After:

`````` markdown
---
aliases:
  - Filename
---

``````
</details>
<details><summary>Replaces old filename with new filename when no header is present and filename is different than the old one listed in `linter-yaml-title-alias`.</summary>

Before:

`````` markdown
---
aliases:
  - Old Filename
  - Alias 2
linter-yaml-title-alias: Old Filename
---

``````

After:

`````` markdown
---
aliases:
  - Filename
  - Alias 2
linter-yaml-title-alias: Filename
---

``````
</details>
<details><summary>Make sure that markdown and wiki links in first H1 get their values converted to text</summary>

Before:

`````` markdown
# This is a [Heading](markdown.md)
``````

After:

`````` markdown
---
aliases:
  - This is a Heading
linter-yaml-title-alias: This is a Heading
---
# This is a [Heading](markdown.md)
``````
</details>
<details><summary>Using `title` as `Alias Helper Key` sets the value of `title` to the alias.</summary>

Before:

`````` markdown

``````

After:

`````` markdown
---
aliases:
  - Filename
title: Filename
---

``````
</details>
