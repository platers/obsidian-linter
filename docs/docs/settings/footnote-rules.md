<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Footnote Rules


## Footnote after Punctuation

Alias: `footnote-after-punctuation`

Ensures that footnote references are placed after punctuation, not before.





### Examples

<details><summary>Placing footnotes after punctuation.</summary>

Before:

`````` markdown
Lorem[^1]. Ipsum[^2], doletes.
``````

After:

`````` markdown
Lorem.[^1] Ipsum,[^2] doletes.
``````
</details>
<details><summary>A footnote at the start of a task is not moved to after the punctuation</summary>

Before:

`````` markdown
- [ ] [^1]: This is a footnote and a task.
- [ ] This is a footnote and a task that gets swapped with the punctuation[^2]!
[^2]: This footnote got modified
``````

After:

`````` markdown
- [ ] [^1]: This is a footnote and a task.
- [ ] This is a footnote and a task that gets swapped with the punctuation![^2]
[^2]: This footnote got modified
``````
</details>

## Move Footnotes to the bottom

Alias: `move-footnotes-to-the-bottom`

Move all footnotes to the bottom of the document and makes sure they are sorted based on the order they are referenced in the file's body.

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Include Blank Line Between Footnotes` | Includes a blank line between footnotes when enabled. | N/A | false |



### Examples

<details><summary>Moving footnotes to the bottom</summary>

Before:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

[^1]: first footnote

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
[^2]: second footnote

Maecenas malesuada dignissim purus ac volutpat.
``````

After:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
Maecenas malesuada dignissim purus ac volutpat.

[^1]: first footnote
[^2]: second footnote
``````
</details>
<details><summary>Moving footnotes to the bottom with including a blank line between footnotes</summary>

Before:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

[^1]: first footnote

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
[^2]: second footnote

Maecenas malesuada dignissim purus ac volutpat.
``````

After:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
Maecenas malesuada dignissim purus ac volutpat.

[^1]: first footnote

[^2]: second footnote
``````
</details>

## Re-Index Footnotes

Alias: `re-index-footnotes`

Re-indexes footnote keys and footnote, based on the order of occurrence. <b>Note: This rule does <i>not</i> work if there is more than one footnote for a key.</b>





### Examples

<details><summary>Re-indexing footnotes after having deleted previous footnotes</summary>

Before:

`````` markdown
Lorem ipsum at aliquet felis.[^3] Donec dictum turpis quis pellentesque,[^5] et iaculis tortor condimentum.

[^3]: first footnote
[^5]: second footnote
``````

After:

`````` markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

[^1]: first footnote
[^2]: second footnote
``````
</details>
<details><summary>Re-indexing footnotes after inserting a footnote between</summary>

Before:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.

[^1]: first footnote
[^1a]: third footnote, inserted later
[^2]: second footnotes
``````

After:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.

[^1]: first footnote
[^2]: third footnote, inserted later
[^3]: second footnotes
``````
</details>
<details><summary>Re-indexing footnotes preserves multiple references to the same footnote index</summary>

Before:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.[^1]

[^1]: first footnote
[^1a]: third footnote, inserted later
[^2]: second footnotes
``````

After:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.[^1]

[^1]: first footnote
[^2]: third footnote, inserted later
[^3]: second footnotes
``````
</details>
<details><summary>Re-indexing footnotes condense duplicate footnotes into 1 when key and footnote are the same</summary>

Before:

`````` markdown
bla[^1], bla[^1], bla[^2]
[^1]: bla
[^1]: bla
[^2]: bla
``````

After:

`````` markdown
bla[^1], bla[^1], bla[^2]
[^1]: bla
[^2]: bla
``````
</details>
