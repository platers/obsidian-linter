<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Paste Rules

## Limitations

- The plugin only works with the standard pasting (`cmd/ctrl + v`) shortcut, and not with the `p` operator in vim. (Pasting with `cmd/ctrl + v` in normal or insert mode does work though.)
- To avoid conflicts with Plugins like [Auto Link Title](https://obsidian.md/plugins?id=obsidian-auto-link-title) or [Paste URL into Selection](https://obsidian.md/plugins?id=url-into-selection), will not be triggered when an URL is detected in the clipboard.
- On mobile, in order to paste the URL, ensure you perform the `Tap and Hold -> Paste` action to paste into your document and use the paste rules.
- When doing a multicursor multiline paste, the cursors will stay where they were after pasting the values instead of moving to the end of the pasted value


## Add Blockquote Indentation on Paste

Alias: `add-blockquote-indentation-on-paste`

Adds blockquotes to all but the first line, when the cursor is in a blockquote/callout line during pasting





### Examples

<details><summary>Line being pasted into regular text does not get blockquotified with current line being `Part 1 of the sentence`</summary>

Before:

`````` markdown
was much less likely to succeed, but they tried it anyway.
Part 2 was much more interesting.
``````

After:

`````` markdown
was much less likely to succeed, but they tried it anyway.
Part 2 was much more interesting.
``````
</details>
<details><summary>Line being pasted into a blockquote gets blockquotified with current line being `> > `</summary>

Before:

`````` markdown

This content is being added to a blockquote
Note that the second line is indented and the surrounding blank lines were trimmed

``````

After:

`````` markdown
This content is being added to a blockquote
> > Note that the second line is indented and the surrounding blank lines were trimmed
``````
</details>

## Prevent Double Checklist Indicator on Paste

Alias: `prevent-double-checklist-indicator-on-paste`

Removes starting checklist indicator from the text to paste if the line the cursor is on in the file has a checklist indicator





### Examples

<details><summary>Line being pasted is left alone when current line has no checklist indicator in it: `Regular text here`</summary>

Before:

`````` markdown
- [ ] Checklist item being pasted
``````

After:

`````` markdown
- [ ] Checklist item being pasted
``````
</details>
<details><summary>Line being pasted into a blockquote without a checklist indicator is left alone when it lacks a checklist indicator: `> > `</summary>

Before:

`````` markdown
- [ ] Checklist item contents here
More content here
``````

After:

`````` markdown
- [ ] Checklist item contents here
More content here
``````
</details>
<details><summary>Line being pasted into a blockquote with a checklist indicator has its checklist indicator removed when current line is: `> - [x] `</summary>

Before:

`````` markdown
- [ ] Checklist item contents here
More content here
``````

After:

`````` markdown
Checklist item contents here
More content here
``````
</details>
<details><summary>Line being pasted with a checklist indicator has its checklist indicator removed when current line is: `- [ ] `</summary>

Before:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

`````` markdown
Checklist item 1
- [ ] Checklist item 2
``````
</details>
<details><summary>Line being pasted as a checklist indicator has its checklist indicator removed when current line is: `- [!] `</summary>

Before:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

`````` markdown
Checklist item 1
- [ ] Checklist item 2
``````
</details>
<details><summary>When pasting a checklist and the selected text starts with a checklist, the text to paste should still start with a checklist</summary>

Before:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````
</details>

## Prevent Double List Item Indicator on Paste

Alias: `prevent-double-list-item-indicator-on-paste`

Removes starting list indicator from the text to paste if the line the cursor is on in the file has a list indicator





### Examples

<details><summary>Line being pasted is left alone when current line has no list indicator in it: `Regular text here`</summary>

Before:

`````` markdown
- List item being pasted
``````

After:

`````` markdown
- List item being pasted
``````
</details>
<details><summary>Line being pasted into a blockquote without a list indicator is left alone when it lacks a list indicator: `> > `</summary>

Before:

`````` markdown
* List item contents here
More content here
``````

After:

`````` markdown
* List item contents here
More content here
``````
</details>
<details><summary>Line being pasted into a blockquote with a list indicator is has its list indicator removed when current line is: `> * `</summary>

Before:

`````` markdown
+ List item contents here
More content here
``````

After:

`````` markdown
List item contents here
More content here
``````
</details>
<details><summary>Line being pasted with a list indicator is has its list indicator removed when current line is: `+ `</summary>

Before:

`````` markdown
- List item 1
- List item 2
``````

After:

`````` markdown
List item 1
- List item 2
``````
</details>
<details><summary>When pasting a list item and the selected text starts with a list item indicator, the text to paste should still start with a list item indicator</summary>

Before:

`````` markdown
- List item 1
- List item 2
``````

After:

`````` markdown
- List item 1
- List item 2
``````
</details>

## Proper Ellipsis on Paste

Alias: `proper-ellipsis-on-paste`

Replaces three consecutive dots with an ellipsis even if they have a space between them in the text to paste





### Examples

<details><summary>Replacing three consecutive dots with an ellipsis even if spaces are present</summary>

Before:

`````` markdown
Lorem (...) Impsum.
Lorem (. ..) Impsum.
Lorem (. . .) Impsum.
``````

After:

`````` markdown
Lorem (…) Impsum.
Lorem (…) Impsum.
Lorem (…) Impsum.
``````
</details>

## Remove Hyphens on Paste

Alias: `remove-hyphens-on-paste`

Removes hyphens from the text to paste





### Examples

<details><summary>Remove hyphen in content to paste</summary>

Before:

`````` markdown
Text that was cool but hyper-
tension made it uncool.
``````

After:

`````` markdown
Text that was cool but hypertension made it uncool.
``````
</details>

## Remove Leading or Trailing Whitespace on Paste

Alias: `remove-leading-or-trailing-whitespace-on-paste`

Removes any leading non-tab whitespace and all trailing whitespace for the text to paste





### Examples

<details><summary>Removes leading spaces and newline characters</summary>

Before:

`````` markdown


         This text was really indented

``````

After:

`````` markdown
This text was really indented
``````
</details>
<details><summary>Leaves leading tabs alone</summary>

Before:

`````` markdown


		This text is really indented

``````

After:

`````` markdown
		This text is really indented
``````
</details>

## Remove Leftover Footnotes from Quote on Paste

Alias: `remove-leftover-footnotes-from-quote-on-paste`

Removes any leftover footnote references for the text to paste





### Examples

<details><summary>Footnote reference removed</summary>

Before:

`````` markdown
He was sure that he would get off without doing any time, but the cops had other plans.50

_Note that the format for footnote references to remove is a dot or comma followed by any number of digits_
``````

After:

`````` markdown
He was sure that he would get off without doing any time, but the cops had other plans

_Note that the format for footnote references to remove is a dot or comma followed by any number of digits_
``````
</details>

## Remove Multiple Blank Lines on Paste

Alias: `remove-multiple-blank-lines-on-paste`

Condenses multiple blank lines down into one blank line for the text to paste





### Examples

<details><summary>Multiple blanks lines condensed down to one</summary>

Before:

`````` markdown
Here is the first line.




Here is some more text.
``````

After:

`````` markdown
Here is the first line.

Here is some more text.
``````
</details>
<details><summary>Text with only one blank line in a row is left alone</summary>

Before:

`````` markdown
First line.

Last line.
``````

After:

`````` markdown
First line.

Last line.
``````
</details>
