<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Spacing Rules


## Compact YAML

Alias: `compact-yaml`

Removes leading and trailing blank lines in the YAML front matter.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Inner New Lines` | Remove new lines that are not at the start or the end of the YAML | N/A | false |



### Examples

<details><summary>Remove blank lines at the start and end of the YAML</summary>

Before:

`````` markdown
---

date: today

title: unchanged without inner new lines turned on

---
``````

After:

`````` markdown
---
date: today

title: unchanged without inner new lines turned on
---
``````
</details>
<details><summary>Remove blank lines anywhere in YAML with inner new lines set to true</summary>

Before:

`````` markdown
---

date: today


title: remove inner new lines

---

# Header 1


Body content here.
``````

After:

`````` markdown
---
date: today
title: remove inner new lines
---

# Header 1


Body content here.
``````
</details>

## Consecutive blank lines

Alias: `consecutive-blank-lines`

There should be at most one consecutive blank line.





### Examples

<details><summary>Consecutive blank lines are removed</summary>

Before:

`````` markdown
Some text


Some more text
``````

After:

`````` markdown
Some text

Some more text
``````
</details>

## Convert Spaces to Tabs

Alias: `convert-spaces-to-tabs`

Converts leading spaces to tabs.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Tabsize` | Number of spaces that will be converted to a tab | N/A | `4` |



### Examples

<details><summary>Converting spaces to tabs with `tabsize = 3`</summary>

Before:

`````` markdown
- text with no indention
   - text indented with 3 spaces
- text with no indention
      - text indented with 6 spaces
``````

After:

`````` markdown
- text with no indention
	- text indented with 3 spaces
- text with no indention
		- text indented with 6 spaces
``````
</details>

## Empty Line Around Blockquotes

Alias: `empty-line-around-blockquotes`

Ensures that there is an empty line around blockquotes unless they start or end a document. **Note: an empty line is either one less level of nesting for blockquotes or a newline character.**





### Examples

<details><summary>Blockquotes that start a document do not get an empty line before them.</summary>

Before:

`````` markdown
> Quote content here
> quote content continued
# Title here
``````

After:

`````` markdown
> Quote content here
> quote content continued

# Title here
``````
</details>
<details><summary>Blockquotes that end a document do not get an empty line after them.</summary>

Before:

`````` markdown
# Heading 1
> Quote content here
> quote content continued
``````

After:

`````` markdown
# Heading 1

> Quote content here
> quote content continued
``````
</details>
<details><summary>Blockquotes that are nested have the proper empty line added</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>

## Empty Line Around Code Fences

Alias: `empty-line-around-code-fences`

Ensures that there is an empty line around code fences unless they start or end a document.





### Examples

<details><summary>Fenced code blocks that start a document do not get an empty line before them.</summary>

Before:

`````` markdown
``` js
var temp = 'text';
// this is a code block
```
Text after code block.
``````

After:

`````` markdown
``` js
var temp = 'text';
// this is a code block
```

Text after code block.
``````
</details>
<details><summary>Fenced code blocks that end a document do not get an empty line after them.</summary>

Before:

`````` markdown
# Heading 1
```
Here is a code block
```
``````

After:

`````` markdown
# Heading 1

```
Here is a code block
```
``````
</details>
<details><summary>Fenced code blocks that are in a blockquote have the proper empty line added</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Nested fenced code blocks get empty lines added around them</summary>

Before:

`````` markdown
```markdown
# Header

````JavaScript
var text = 'some string';
````
```
``````

After:

`````` markdown
```markdown
# Header

````JavaScript
var text = 'some string';
````

```
``````
</details>

## Empty Line Around Math Blocks

Alias: `empty-line-around-math-blocks`

Ensures that there is an empty line around math blocks using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.





### Examples

<details><summary>Math blocks that start a document do not get an empty line before them.</summary>

Before:

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
some more text
``````

After:

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$

some more text
``````
</details>
<details><summary>Math blocks that are singe-line are updated based on the value of `Number of Dollar Signs to Indicate a Math Block` (in this case its value is 2)</summary>

Before:

`````` markdown
$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$
some more text
``````

After:

`````` markdown
$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$

some more text
``````
</details>
<details><summary>Math blocks that end a document do not get an empty line after them.</summary>

Before:

`````` markdown
Some text
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````

After:

`````` markdown
Some text

$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````
</details>
<details><summary>Math blocks that are not at the start or the end of the document will have an empty line added before and after them</summary>

Before:

`````` markdown
Some text
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
some more text
``````

After:

`````` markdown
Some text

$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$

some more text
``````
</details>
<details><summary>Math blocks in callouts or blockquotes have the appropriately formatted blank lines added</summary>

Before:

`````` markdown
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

`````` markdown
> Math block in blockquote
>
> $$
> \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> $$

More content here

> Math block doubly nested in blockquote
>
> > $$
> > \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> > $$
``````
</details>

## Empty Line Around Tables

Alias: `empty-line-around-tables`

Ensures that there is an empty line around github flavored tables unless they start or end a document.





### Examples

<details><summary>Tables that start a document do not get an empty line before them.</summary>

Before:

`````` markdown
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

`````` markdown
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |

More text.
# Heading

**Note that text directly following a table is considered part of a table according to github markdown**
``````
</details>
<details><summary>Tables that end a document do not get an empty line after them.</summary>

Before:

`````` markdown
# Heading 1
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
``````

After:

`````` markdown
# Heading 1

| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
``````
</details>
<details><summary>Tables that are not at the start or the end of the document will have an empty line added before and after them</summary>

Before:

`````` markdown
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

`````` markdown
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
</details>
<details><summary>Tables in callouts or blockquotes have the appropriately formatted blank lines added</summary>

Before:

`````` markdown
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

`````` markdown
> Table in blockquote
>
> | Column 1 | Column 2 | Column 3 |
> |----------|----------|----------|
> | foo      | bar      | blob     |
> | baz      | qux      | trust    |
> | quux     | quuz     | glob     |

More content here

> Table doubly nested in blockquote
>
> > | Column 1 | Column 2 | Column 3 |
> > |----------|----------|----------|
> > | foo      | bar      | blob     |
> > | baz      | qux      | trust    |
> > | quux     | quuz     | glob     |
``````
</details>

## Heading blank lines

Alias: `heading-blank-lines`

All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Bottom` | Insert a blank line after headings | N/A | `true` |
| `Empty Line Between YAML and Header` | Keep the empty line between the YAML frontmatter and header | N/A | `true` |



### Examples

<details><summary>Headings should be surrounded by blank lines</summary>

Before:

`````` markdown
# H1
## H2


# H1
line
## H2

``````

After:

`````` markdown
# H1

## H2

# H1

line

## H2
``````
</details>
<details><summary>With `Bottom=false`</summary>

Before:

`````` markdown
# H1
line
## H2
# H1
line
``````

After:

`````` markdown
# H1
line

## H2

# H1
line
``````
</details>
<details><summary>Empty line before header and after YAML is removed with `Empty Line Between YAML and Header=false`</summary>

Before:

`````` markdown
---
key: value
---

# Header
Paragraph here...
``````

After:

`````` markdown
---
key: value
---
# Header

Paragraph here...
``````
</details>

## Line Break at Document End

Alias: `line-break-at-document-end`

Ensures that there is exactly one line break at the end of a document.





### Examples

<details><summary>Appending a line break to the end of the document.</summary>

Before:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
``````

After:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

``````
</details>
<details><summary>Removing trailing line breaks to the end of the document, except one.</summary>

Before:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.



``````

After:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

``````
</details>

## Move Math Block Indicators to Their Own Line

Alias: `move-math-block-indicators-to-their-own-line`

Move all starting and ending math block indicators to their own lines using `Number of Dollar Signs to Indicate a Math Block` to determine how many dollar signs indicates a math block for single-line math.





### Examples

<details><summary>Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2</summary>

Before:

`````` markdown
This is left alone:
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
The following is updated:
$$L = \frac{1}{2} \rho v^2 S C_L$$
``````

After:

`````` markdown
This is left alone:
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
The following is updated:
$$
L = \frac{1}{2} \rho v^2 S C_L
$$
``````
</details>
<details><summary>Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 3 and opening indicator is on the same line as the start of the content</summary>

Before:

`````` markdown
$$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$$
``````

After:

`````` markdown
$$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$$
``````
</details>
<details><summary>Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2 and ending indicator is on the same line as the ending line of the content</summary>

Before:

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$
``````

After:

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````
</details>

## Paragraph blank lines

Alias: `paragraph-blank-lines`

All paragraphs should have exactly one blank line both before and after.



### Additional Info


!!! Warning
    Do not use with [two spaces between lines with consecutive content](./content-rules.md#two-spaces-between-lines-with-content). They work differently and will result in unexpected results.

#### When Is a Blank Line Added?

When a paragraph has another line after the current one and it does not end in 2 or more spaces or `<br>` or `<br/>`.


### Examples

<details><summary>Paragraphs should be surrounded by blank lines</summary>

Before:

`````` markdown
# H1
Newlines are inserted.
A paragraph is a line that starts with a letter.
``````

After:

`````` markdown
# H1

Newlines are inserted.

A paragraph is a line that starts with a letter.
``````
</details>
<details><summary>Paragraphs can be extended via the use of 2 or more spaces at the end of a line or line break html</summary>

Before:

`````` markdown
# H1
Content  
Paragraph content continued <br>
Paragraph content continued once more <br/>
Last line of paragraph
A new paragraph
# H2
``````

After:

`````` markdown
# H1

Content  
Paragraph content continued <br>
Paragraph content continued once more <br/>
Last line of paragraph

A new paragraph

# H2
``````
</details>

## Remove Empty Lines Between List Markers and Checklists

Alias: `remove-empty-lines-between-list-markers-and-checklists`

There should not be any empty lines between list markers and checklists.





### Examples

<details><summary>Blank lines are removed between ordered list items</summary>

Before:

`````` markdown
1. Item 1

2. Item 2
``````

After:

`````` markdown
1. Item 1
2. Item 2
``````
</details>
<details><summary>Blank lines are removed between list items when the list indicator is '-'</summary>

Before:

`````` markdown
- Item 1

	- Subitem 1

- Item 2
``````

After:

`````` markdown
- Item 1
	- Subitem 1
- Item 2
``````
</details>
<details><summary>Blank lines are removed between checklist items</summary>

Before:

`````` markdown
- [x] Item 1

	- [!] Subitem 1

- [ ] Item 2
``````

After:

`````` markdown
- [x] Item 1
	- [!] Subitem 1
- [ ] Item 2
``````
</details>
<details><summary>Blank lines are removed between list items when the list indicator is '+'</summary>

Before:

`````` markdown
+ Item 1

	+ Subitem 1

+ Item 2
``````

After:

`````` markdown
+ Item 1
	+ Subitem 1
+ Item 2
``````
</details>
<details><summary>Blank lines are removed between list items when the list indicator is '*'</summary>

Before:

`````` markdown
* Item 1

	* Subitem 1

* Item 2
``````

After:

`````` markdown
* Item 1
	* Subitem 1
* Item 2
``````
</details>
<details><summary>Blanks lines are removed between like list types (ordered, specific list item indicators, and checklists) while blanks are left between different kinds of list item indicators</summary>

Before:

`````` markdown
1. Item 1

2. Item 2

- Item 1

	- Subitem 1

- Item 2

- [x] Item 1

	- [f] Subitem 1

- [ ] Item 2

+ Item 1

	+ Subitem 1

+ Item 2

* Item 1

	* Subitem 1

* Item 2
``````

After:

`````` markdown
1. Item 1
2. Item 2

- Item 1
	- Subitem 1
- Item 2

- [x] Item 1
	- [f] Subitem 1
- [ ] Item 2

+ Item 1
	+ Subitem 1
+ Item 2

* Item 1
	* Subitem 1
* Item 2
``````
</details>

## Remove link spacing

Alias: `remove-link-spacing`

Removes spacing around link text.





### Examples

<details><summary>Space in regular markdown link text</summary>

Before:

`````` markdown
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

`````` markdown
[here is link text1](link_here)
[here is link text2](link_here)
[here is link text3](link_here)
[here is link text4](link_here)
[here is link text5](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
``````
</details>
<details><summary>Space in wiki link text</summary>

Before:

`````` markdown
[[link_here| here is link text1 ]]
[[link_here|here is link text2 ]]
[[link_here| here is link text3]]
[[link_here|here is link text4]]
[[link_here|	here is link text5	]]
![[link_here|	here is link text6	]]
[[link_here]]
``````

After:

`````` markdown
[[link_here|here is link text1]]
[[link_here|here is link text2]]
[[link_here|here is link text3]]
[[link_here|here is link text4]]
[[link_here|here is link text5]]
![[link_here|here is link text6]]
[[link_here]]
``````
</details>

## Remove Space around Characters

Alias: `remove-space-around-characters`

Ensures that certain characters are not surrounded by whitespace (either single spaces or a tab). **Note: this may causes issues with markdown format in some cases.**

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Include Fullwidth Forms` | Include <a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">Fullwidth Forms Unicode block</a> | N/A | `true` |
| `Include CJK Symbols and Punctuation` | Include <a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">CJK Symbols and Punctuation Unicode block</a> | N/A | `true` |
| `Include Dashes` | Include en dash (–) and em dash (—) | N/A | `true` |
| `Other symbols` | Other symbols to include | N/A |  |



### Examples

<details><summary>Remove Spaces and Tabs around Fullwidth Characters</summary>

Before:

`````` markdown
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

`````` markdown
Full list of affected characters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
This is a fullwidth period。with text after it.
This is a fullwidth comma，with text after it.
This is a fullwidth left parenthesis（with text after it.
This is a fullwidth right parenthesis）with text after it.
This is a fullwidth colon：with text after it.
This is a fullwidth semicolon；with text after it.
Ｒemoves space at start of line
``````
</details>
<details><summary>Fullwidth Characters in List Do not Affect List Markdown Syntax</summary>

Before:

`````` markdown
# List indicators should not have the space after them removed if they are followed by a fullwidth character

- ［ contents here］
  -  ［ more contents here］ more text here
+   ［ another item here］
* ［ one last item here］

# Nested in a blockquote

> - ［ contents here］
>   -  ［ more contents here］ more text here
> +  ［ another item here］
> * ［ one last item here］

# Doubly nested in a blockquote

> The following is doubly nested
> > - ［ contents here］
> >   -   ［ more contents here］ more text here
> > +  ［ another item here］
> > * ［ one last item here］
``````

After:

`````` markdown
# List indicators should not have the space after them removed if they are followed by a fullwidth character

- ［contents here］
  - ［more contents here］more text here
+ ［another item here］
* ［one last item here］

# Nested in a blockquote

> - ［contents here］
>   - ［more contents here］more text here
> + ［another item here］
> * ［one last item here］

# Doubly nested in a blockquote

> The following is doubly nested
> > - ［contents here］
> >   - ［more contents here］more text here
> > + ［another item here］
> > * ［one last item here］
``````
</details>

## Remove Space Before or After Characters

Alias: `remove-space-before-or-after-characters`

Removes space before the specified characters and after the specified characters. **Note: this may causes issues with markdown format in some cases.**

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Remove Space Before Characters` | Removes space before the specified characters. **Note: using `{` or `}` in the list of characters will unexpectedly affect files as it is used in the ignore syntax behind the scenes.** | N/A | `,!?;:).’”]` |
| `Remove Space After Characters` | Removes space after the specified characters. **Note: using `{` or `}` in the list of characters will unexpectedly affect files as it is used in the ignore syntax behind the scenes.** | N/A | `¿¡‘“([` |



### Examples

<details><summary>Remove Spaces and Tabs Before and After Default Symbol Set</summary>

Before:

`````` markdown
In the end , the space gets removed	 .
The space before the question mark was removed right ?
The space before the exclamation point gets removed !
A semicolon ; and colon : have spaces removed before them
‘ Text in single quotes ’
“ Text in double quotes ”
[ Text in square braces ]
( Text in parenthesis )
``````

After:

`````` markdown
In the end, the space gets removed.
The space before the question mark was removed right?
The space before the exclamation point gets removed!
A semicolon; and colon: have spaces removed before them
‘Text in single quotes’
“Text in double quotes”
[Text in square braces]
(Text in parenthesis)
``````
</details>

## Space after list markers

Alias: `space-after-list-markers`

There should be a single space after list markers and checkboxes.





### Examples

<details><summary>A single space is left between the list marker and the text of the list item</summary>

Before:

`````` markdown
1.   Item 1
2.  Item 2

-   [ ] Item 1
- [x]    Item 2
	-  [ ] Item 3
``````

After:

`````` markdown
1. Item 1
2. Item 2

- [ ] Item 1
- [x] Item 2
	- [ ] Item 3
``````
</details>

## Space between Chinese Japanese or Korean and English or numbers

Alias: `space-between-chinese-japanese-or-korean-and-english-or-numbers`

Ensures that Chinese, Japanese, or Korean and English or numbers are separated by a single space. Follows these [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)





### Examples

<details><summary>Space between Chinese and English</summary>

Before:

`````` markdown
中文字符串english中文字符串。
``````

After:

`````` markdown
中文字符串 english 中文字符串。
``````
</details>
<details><summary>Space between Chinese and link</summary>

Before:

`````` markdown
中文字符串[english](http://example.com)中文字符串。
``````

After:

`````` markdown
中文字符串 [english](http://example.com) 中文字符串。
``````
</details>
<details><summary>Space between Chinese and inline code block</summary>

Before:

`````` markdown
中文字符串`code`中文字符串。
``````

After:

`````` markdown
中文字符串 `code` 中文字符串。
``````
</details>
<details><summary>No space between Chinese and English in tag</summary>

Before:

`````` markdown
#标签A #标签2标签
``````

After:

`````` markdown
#标签A #标签2标签
``````
</details>
<details><summary>Make sure that spaces are not added between italics and chinese characters to preserve markdown syntax</summary>

Before:

`````` markdown
_这是一个数学公式_
*这是一个数学公式english*

# Handling bold and italics nested in each other is not supported at this time

**_这是一_个数学公式**
*这是一hello__个数学world公式__*
``````

After:

`````` markdown
_这是一个数学公式_
*这是一个数学公式 english*

# Handling bold and italics nested in each other is not supported at this time

**_ 这是一 _ 个数学公式**
*这是一 hello__ 个数学 world 公式 __*
``````
</details>
<details><summary>Images and links are ignored</summary>

Before:

`````` markdown
[[这是一个数学公式english]]
![[这是一个数学公式english.jpg]]
[这是一个数学公式english](这是一个数学公式english.md)
![这是一个数学公式english](这是一个数学公式english.jpg)
``````

After:

`````` markdown
[[这是一个数学公式english]]
![[这是一个数学公式english.jpg]]
[这是一个数学公式english](这是一个数学公式english.md)
![这是一个数学公式english](这是一个数学公式english.jpg)
``````
</details>
<details><summary>Space between CJK and English</summary>

Before:

`````` markdown
日本語englishひらがな
カタカナenglishカタカナ
ﾊﾝｶｸｶﾀｶﾅenglish１２３全角数字
한글english한글
``````

After:

`````` markdown
日本語 english ひらがな
カタカナ english カタカナ
ﾊﾝｶｸｶﾀｶﾅ english１２３全角数字
한글 english 한글
``````
</details>

## Trailing spaces

Alias: `trailing-spaces`

Removes extra spaces after every line.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Two Space Linebreak` | Ignore two spaces followed by a line break ("Two Space Rule"). | N/A | false |



### Examples

<details><summary>Removes trailing spaces and tabs.</summary>

Before:

`````` markdown
# H1
Line with trailing spaces and tabs.	        
``````

After:

`````` markdown
# H1
Line with trailing spaces and tabs.
``````
</details>
<details><summary>With `Two Space Linebreak = true`</summary>

Before:

`````` markdown
# H1
Line with trailing spaces and tabs.  
``````

After:

`````` markdown
# H1
Line with trailing spaces and tabs.  
``````
</details>
