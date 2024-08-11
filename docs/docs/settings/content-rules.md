<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Content Rules


## Auto-correct Common Misspellings

Alias: `auto-correct-common-misspellings`

Uses a dictionary of common misspellings to automatically convert them to their proper spellings. See [auto-correct map](https://github.com/platers/obsidian-linter/tree/master/src/utils/auto-correct-misspellings.ts) for the full list of auto-corrected words. **Note: this list can work on text from multiple languages, but this list is the same no matter what language is currently in use.**

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Ignore Words` | A comma separated list of lowercased words to ignore when auto-correcting | N/A |  |
| `Extra Auto-Correct Source Files` | These are files that have a markdown table in them that have the initial word and the word to correct it to (these are case insensitive corrections). **Note: the tables used should have the starting and ending `|` indicators present for each line.** | N/A |  |

### Additional Info


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

- The list of custom replacements is only loaded when the plugin initially loads or when the file is added to the list of files that include custom misspellings
  - This means that making a change to a file that is already in the list of custom misspelling files will not work unless the Linter is reloaded or the file is removed and re-added to the list of custom misspelling files
- There is no way to specify that a word is to always be capitalized
  - This is due to how the auto-correct rule was designed as it sets the first letter of the replacement word to the case of the first letter of the word being replaced


### Examples

<details><summary>Auto-correct misspellings in regular text, but not code blocks, math blocks, YAML, or tags</summary>

Before:

`````` markdown
---
key: absoltely
---

I absoltely hate when my codeblocks get formatted when they should not be.

```
# comments absoltely can be helpful, but they can also be misleading
```

Note that inline code also has the applicable spelling errors ignored: `absoltely` 

$$
Math block absoltely does not get auto-corrected.
$$

The same $ defenately $ applies to inline math.

#defenately stays the same
``````

After:

`````` markdown
---
key: absoltely
---

I absolutely hate when my codeblocks get formatted when they should not be.

```
# comments absoltely can be helpful, but they can also be misleading
```

Note that inline code also has the applicable spelling errors ignored: `absoltely` 

$$
Math block absoltely does not get auto-corrected.
$$

The same $ defenately $ applies to inline math.

#defenately stays the same
``````
</details>
<details><summary>Auto-correct misspellings keeps first letter's case</summary>

Before:

`````` markdown
Accodringly we made sure to update logic to make sure it would handle case sensitivity.
``````

After:

`````` markdown
Accordingly we made sure to update logic to make sure it would handle case sensitivity.
``````
</details>
<details><summary>Links should not be auto-corrected</summary>

Before:

`````` markdown
http://www.Absoltely.com should not be corrected
``````

After:

`````` markdown
http://www.Absoltely.com should not be corrected
``````
</details>

## Blockquote Style

Alias: `blockquote-style`

Makes sure the blockquote style is consistent.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Style` | The style used on blockquote indicators | `space`: > indicator is followed by a space<br/><br/>`no space`: >indicator is not followed by a space | `space` |



### Examples

<details><summary>When style = `space`, a space is added to blockquotes missing a space after the indicator</summary>

Before:

`````` markdown
>Blockquotes will have a space added if one is not present
> Will be left as is.

> Nested blockquotes are also updated
>>Nesting levels are handled correctly
>> Even when only partially needing updates
> >Updated as well
>>>>>>> Is handled too
> > >>> As well

> <strong>Note that html is not affected in blockquotes</strong>
``````

After:

`````` markdown
> Blockquotes will have a space added if one is not present
> Will be left as is.

> Nested blockquotes are also updated
> > Nesting levels are handled correctly
> > Even when only partially needing updates
> > Updated as well
> > > > > > > Is handled too
> > > > > As well

> <strong>Note that html is not affected in blockquotes</strong>
``````
</details>
<details><summary>When style = `no space`, spaces are removed after a blockquote indicator</summary>

Before:

`````` markdown
>    Multiple spaces are removed
> > Nesting is handled
> > > > >  Especially when multiple levels are involved
> >>> > Even when partially correct already, it is handled
``````

After:

`````` markdown
>Multiple spaces are removed
>>Nesting is handled
>>>>>Especially when multiple levels are involved
>>>>>Even when partially correct already, it is handled
``````
</details>

## Convert Bullet List Markers

Alias: `convert-bullet-list-markers`

Converts common bullet list marker symbols to markdown list markers.





### Examples

<details><summary>Converts •</summary>

Before:

`````` markdown
• item 1
• item 2
``````

After:

`````` markdown
- item 1
- item 2
``````
</details>
<details><summary>Converts §</summary>

Before:

`````` markdown
• item 1
  § item 2
  § item 3
``````

After:

`````` markdown
- item 1
  - item 2
  - item 3
``````
</details>

## Default Language For Code Fences

Alias: `default-language-for-code-fences`

Add a default language to code fences that do not have a language specified.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Programming Language` | Leave empty to do nothing. Languages tags can be found [here](https://prismjs.com/#supported-languages). | N/A |  |



### Examples

<details><summary>Add a default language `javascript` to code blocks that do not have a language specified</summary>

Before:

`````` markdown
```
var temp = 'text';
// this is a code block
```
``````

After:

`````` markdown
```javascript
var temp = 'text';
// this is a code block
```
``````
</details>
<details><summary>If a code block already has a language specified, do not change it</summary>

Before:

`````` markdown
```javascript
var temp = 'text';
// this is a code block
```
``````

After:

`````` markdown
```javascript
var temp = 'text';
// this is a code block
```
``````
</details>
<details><summary>Empty string as the default language will not add a language to code blocks</summary>

Before:

`````` markdown
```
var temp = 'text';
// this is a code block
```
``````

After:

`````` markdown
```
var temp = 'text';
// this is a code block
```
``````
</details>

## Emphasis Style

Alias: `emphasis-style`

Makes sure the emphasis style is consistent.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Style` | The style used to denote emphasized content | `consistent`: Makes sure the first instance of emphasis is the style that will be used throughout the document<br/><br/>`asterisk`: Makes sure * is the emphasis indicator<br/><br/>`underscore`: Makes sure _ is the emphasis indicator | `consistent` |



### Examples

<details><summary>Emphasis indicators should use underscores when style is set to 'underscore'</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Emphasis indicators should use asterisks when style is set to 'asterisk'</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to 'consistent'</summary>

Before:

`````` markdown
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

`````` markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is ***nested emphasis* and ending bold**

__Test bold__
``````
</details>
<details><summary>Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to 'consistent'</summary>

Before:

`````` markdown
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

`````` markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is _**nested bold** and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
``````
</details>

## No Bare URLs

Alias: `no-bare-urls`

Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `No Bare URIs` | Attempts to enclose bare URIs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes. | N/A | false |



### Examples

<details><summary>Make sure that links are inside of angle brackets when not in single quotes('), double quotes("), or backticks(`)</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Angle brackets are added if the url is not the only text in the single quotes(') or double quotes(")</summary>

Before:

`````` markdown
[https://github.com some text here]
backticks around a url should stay the same: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
``````

After:

`````` markdown
[<https://github.com> some text here]
backticks around a url should stay the same: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
``````
</details>
<details><summary>Multiple angle brackets at the start and or end of a url will be reduced down to 1</summary>

Before:

`````` markdown
<<https://github.com>
<https://google.com>>
<<https://gitlab.com>>
``````

After:

`````` markdown
<https://github.com>
<https://google.com>
<https://gitlab.com>
``````
</details>
<details><summary>Puts angle brackets around URIs when `No Bare URIs` is enabled</summary>

Before:

`````` markdown
obsidian://show-plugin?id=cycle-in-sidebar
``````

After:

`````` markdown
<obsidian://show-plugin?id=cycle-in-sidebar>
``````
</details>

## Ordered List Style

Alias: `ordered-list-style`

Makes sure that ordered lists follow the style specified. **Note: that 2 spaces or 1 tab is considered to be an indentation level.**

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Number Style` | The number style used in ordered list indicators | `ascending`: Makes sure ordered list items are ascending (i.e. 1, 2, 3, etc.)<br/><br/>`lazy`: Makes sure ordered list item indicators all are the number 1 | `ascending` |
| `Ordered List Indicator End Style` | The ending character of an ordered list indicator | `.`: Makes sure ordered list items indicators end in '.' (i.e `1.`)<br/><br/>`)`: Makes sure ordered list item indicators end in ')' (i.e. `1)`) | `.` |



### Examples

<details><summary>Ordered lists have list items set to ascending numerical order when Number Style is `ascending`.</summary>

Before:

`````` markdown
1. Item 1
2. Item 2
4. Item 3

Some text here

1. Item 1
1. Item 2
1. Item 3
``````

After:

`````` markdown
1. Item 1
2. Item 2
3. Item 3

Some text here

1. Item 1
2. Item 2
3. Item 3
``````
</details>
<details><summary>Nested ordered lists have list items set to ascending numerical order when Number Style is `ascending`.</summary>

Before:

`````` markdown
1. Item 1
2. Item 2
  1. Subitem 1
  5. Subitem 2
  2. Subitem 3
4. Item 3
``````

After:

`````` markdown
1. Item 1
2. Item 2
  1. Subitem 1
  2. Subitem 2
  3. Subitem 3
3. Item 3
``````
</details>
<details><summary>Ordered list in blockquote has list items set to '1.' when Number Style is `lazy`.</summary>

Before:

`````` markdown
> 1. Item 1
> 4. Item 2
> > 1. Subitem 1
> > 5. Subitem 2
> > 2. Subitem 3
``````

After:

`````` markdown
> 1. Item 1
> 1. Item 2
> > 1. Subitem 1
> > 1. Subitem 2
> > 1. Subitem 3
``````
</details>
<details><summary>Ordered list in blockquote has list items set to ascending numerical order when Number Style is `ascending`.</summary>

Before:

`````` markdown
> 1. Item 1
> 4. Item 2
> > 1. Subitem 1
> > 5. Subitem 2
> > 2. Subitem 3
``````

After:

`````` markdown
> 1. Item 1
> 2. Item 2
> > 1. Subitem 1
> > 2. Subitem 2
> > 3. Subitem 3
``````
</details>
<details><summary>Nested ordered list has list items set to '1)' when Number Style is `lazy` and Ordered List Indicator End Style is `)`.</summary>

Before:

`````` markdown
1. Item 1
2. Item 2
  1. Subitem 1
  5. Subitem 2
  2. Subitem 3
4. Item 3
``````

After:

`````` markdown
1) Item 1
1) Item 2
  1) Subitem 1
  1) Subitem 2
  1) Subitem 3
1) Item 3
``````
</details>

## Proper Ellipsis

Alias: `proper-ellipsis`

Replaces three consecutive dots with an ellipsis.





### Examples

<details><summary>Replacing three consecutive dots with an ellipsis.</summary>

Before:

`````` markdown
Lorem (...) Impsum.
``````

After:

`````` markdown
Lorem (…) Impsum.
``````
</details>

## Quote Style

Alias: `quote-style`

Updates the quotes in the body content to be updated to the specified single and double quote styles.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Enable `Single Quote Style`` | Specifies that the selected single quote style should be used. | N/A | `true` |
| `Single Quote Style` | The style of single quotes to use. | `''`: Uses "'" instead of smart single quotes<br/><br/>`‘’`: Uses "‘" and "’" instead of straight single quotes | `''` |
| `Enable `Double Quote Style`` | Specifies that the selected double quote style should be used. | N/A | `true` |
| `Double Quote Style` | The style of double quotes to use. | `""`: Uses '"' instead of smart double quotes<br/><br/>`“”`: Uses '“' and '”' instead of straight double quotes | `""` |



### Examples

<details><summary>Smart quotes used in file are converted to straight quotes when styles are set to `Straight`</summary>

Before:

`````` markdown
# Double Quote Cases
“There are a bunch of different kinds of smart quote indicators”
„More than you would think”
«Including this one for Spanish»
# Single Quote Cases
‘Simple smart quotes get replaced’
‚Another single style smart quote also gets replaced’
‹Even this style of single smart quotes is replaced›
``````

After:

`````` markdown
# Double Quote Cases
"There are a bunch of different kinds of smart quote indicators"
"More than you would think"
"Including this one for Spanish"
# Single Quote Cases
'Simple smart quotes get replaced'
'Another single style smart quote also gets replaced'
'Even this style of single smart quotes is replaced'
``````
</details>
<details><summary>Straight quotes used in file are converted to smart quotes when styles are set to `Smart`</summary>

Before:

`````` markdown
"As you can see, these double quotes will be converted to smart quotes"
"Common contractions are handled as well. For example can't is updated to smart quotes."
"Nesting a quote in a quote like so: 'here I am' is handled correctly"
'Single quotes by themselves are handled correctly'
Possessives are handled correctly: Pam's dog is really cool!
Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>

Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
once possessives and common contractions have been dealt with. If not, it will throw an error.
``````

After:

`````` markdown
“As you can see, these double quotes will be converted to smart quotes”
“Common contractions are handled as well. For example can’t is updated to smart quotes.”
“Nesting a quote in a quote like so: ‘here I am’ is handled correctly”
‘Single quotes by themselves are handled correctly’
Possessives are handled correctly: Pam’s dog is really cool!
Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>

Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
once possessives and common contractions have been dealt with. If not, it will throw an error.
``````
</details>

## Remove Consecutive List Markers

Alias: `remove-consecutive-list-markers`

Removes consecutive list markers. Useful when copy-pasting list items.





### Examples

<details><summary>Removing consecutive list markers.</summary>

Before:

`````` markdown
- item 1
- - copypasted item A
- item 2
  - indented item
  - - copypasted item B
``````

After:

`````` markdown
- item 1
- copypasted item A
- item 2
  - indented item
  - copypasted item B
``````
</details>

## Remove Empty List Markers

Alias: `remove-empty-list-markers`

Removes empty list markers, i.e. list items without content.





### Examples

<details><summary>Removes empty list markers.</summary>

Before:

`````` markdown
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

`````` markdown
- item 1
- item 2

* list 2 item 1
* list 2 item 2

+ list 3 item 1
+ list 3 item 2
``````
</details>
<details><summary>Removes empty ordered list markers.</summary>

Before:

`````` markdown
1. item 1
2.
3. item 2

1. list 2 item 1
2. list 2 item 2
3. 

_Note that this rule does not make sure that the ordered list is sequential after removal_
``````

After:

`````` markdown
1. item 1
3. item 2

1. list 2 item 1
2. list 2 item 2

_Note that this rule does not make sure that the ordered list is sequential after removal_
``````
</details>
<details><summary>Removes empty checklist markers.</summary>

Before:

`````` markdown
- [ ]  item 1
- [x]
- [ ] item 2
- [ ]   

_Note that this will affect checked and uncheck checked list items_
``````

After:

`````` markdown
- [ ]  item 1
- [ ] item 2

_Note that this will affect checked and uncheck checked list items_
``````
</details>
<details><summary>Removes empty list, checklist, and ordered list markers in callouts/blockquotes</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>

## Remove Hyphenated Line Breaks

Alias: `remove-hyphenated-line-breaks`

Removes hyphenated line breaks. Useful when pasting text from textbooks.





### Examples

<details><summary>Removing hyphenated line breaks.</summary>

Before:

`````` markdown
This text has a linebr‐ eak.
``````

After:

`````` markdown
This text has a linebreak.
``````
</details>

## Remove Multiple Spaces

Alias: `remove-multiple-spaces`

Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. 





### Examples

<details><summary>Removing double and triple space.</summary>

Before:

`````` markdown
Lorem ipsum   dolor  sit amet.
``````

After:

`````` markdown
Lorem ipsum dolor sit amet.
``````
</details>

## Strong Style

Alias: `strong-style`

Makes sure the strong style is consistent.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Style` | The style used to denote strong/bolded content | `consistent`: Makes sure the first instance of strong is the style that will be used throughout the document<br/><br/>`asterisk`: Makes sure ** is the strong indicator<br/><br/>`underscore`: Makes sure __ is the strong indicator | `consistent` |



### Examples

<details><summary>Strong indicators should use underscores when style is set to 'underscore'</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Strong indicators should use asterisks when style is set to 'asterisk'</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Strong indicators should use consistent style based on first strong indicator in a file when style is set to 'consistent'</summary>

Before:

`````` markdown
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

`````` markdown
# Strong First Strong Is an Asterisk

**First bold**
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is ***nested bold** and ending emphasized*
This is **_nested emphasis_ and ending bold**

**Test bold**
``````
</details>
<details><summary>Strong indicators should use consistent style based on first strong indicator in a file when style is set to 'consistent'</summary>

Before:

`````` markdown
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

`````` markdown
# Strong First Strong Is an Underscore

__First bold__
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is ___nested emphasis_ and ending bold__

__Test bold__
``````
</details>

## Line Break Between Lines with Content

Alias: `two-spaces-between-lines-with-content`

Makes sure that the specified line break is added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Line Break Indicator` | The line break indicator to use. | `  `:   <br/><br/>`<br/>`: <br/><br/><br/>`<br>`: <br><br/><br/>`\`: \ | `  ` |

### Additional Info


!!! Warning
    Do not use with [paragraph blank lines](./spacing-rules.md#paragraph-blank-lines). They work differently and will result in unexpected results.


### Examples

<details><summary>Make sure two spaces are added to the ends of lines that have content on it and the next line for lists, blockquotes, and paragraphs when the line break indicator is `  `</summary>

Before:

`````` markdown
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
Are left swapped
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

`````` markdown
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

Paragraph lines that end in  
Or lines that end in  
Are left swapped  
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
</details>

## Unordered List Style

Alias: `unordered-list-style`

Makes sure that unordered lists follow the style specified.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `List item style` | The list item style to use in unordered lists | `consistent`: Makes sure unordered list items use a consistent list item indicator in the file which will be based on the first list item found<br/><br/>`-`: Makes sure unordered list items use `-` as their indicator<br/><br/>`*`: Makes sure unordered list items use `*` as their indicator<br/><br/>`+`: Makes sure unordered list items use `+` as their indicator | `consistent` |



### Examples

<details><summary>Unordered lists have their indicator updated to `*` when `List item style = 'consistent'` and `*` is the first unordered list indicator</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Unordered lists have their indicator updated to `-` when `List item style = '-'`</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Unordered lists have their indicator updated to `*` when `List item style = '*'`</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Unordered list in blockquote has list item indicators set to `+` when `List item style = '-'`</summary>

Before:

`````` markdown
> - Item 1
> + Item 2
> > * Subitem 1
> > + Subitem 2
> >   - Sub sub item 1
> > - Subitem 3
``````

After:

`````` markdown
> + Item 1
> + Item 2
> > + Subitem 1
> > + Subitem 2
> >   + Sub sub item 1
> > + Subitem 3
``````
</details>
