<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# Heading Rules

A heading for the purpose of the Linter is an ATX header. It does _not_ currently support Setext headers (see [this issue](https://github.com/platers/obsidian-linter/issues/423)).


## Capitalize Headings

Alias: `capitalize-headings`

Headings should be formatted with capitalization

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Style` | The style of capitalization to use | `Title Case`: Capitalize Using Title Case Rules<br/><br/>`ALL CAPS`: CAPITALIZE THE WHOLE TITLE<br/><br/>`First letter`: Only capitalize the first letter | `Title Case` |
| `Ignore Cased Words` | Only apply title case style to words that are all lowercase | N/A | `true` |
| `Ignore Words` | A comma separated list of words to ignore when capitalizing | N/A | `macOS, iOS, iPhone, iPad, JavaScript, TypeScript, AppleScript, I` |
| `Lowercase Words` | A comma separated list of words to keep lowercase | N/A | `a, an, the, aboard, about, abt., above, abreast, absent, across, after, against, along, aloft, alongside, amid, amidst, mid, midst, among, amongst, anti, apropos, around, round, as, aslant, astride, at, atop, ontop, bar, barring, before, B4, behind, below, beneath, neath, beside, besides, between, 'tween, beyond, but, by, chez, circa, c., ca., come, concerning, contra, counting, cum, despite, spite, down, during, effective, ere, except, excepting, excluding, failing, following, for, from, in, including, inside, into, less, like, minus, modulo, mod, near, nearer, nearest, next, notwithstanding, of, o', off, offshore, on, onto, opposite, out, outside, over, o'er, pace, past, pending, per, plus, post, pre, pro, qua, re, regarding, respecting, sans, save, saving, short, since, sub, than, through, thru, throughout, thruout, till, times, to, t', touching, toward, towards, under, underneath, unlike, until, unto, up, upon, versus, vs., v., via, vice, vis-à-vis, wanting, with, w/, w., c̄, within, w/i, without, 'thout, w/o, abroad, adrift, aft, afterward, afterwards, ahead, apart, ashore, aside, away, back, backward, backwards, beforehand, downhill, downstage, downstairs, downstream, downward, downwards, downwind, east, eastward, eastwards, forth, forward, forwards, heavenward, heavenwards, hence, henceforth, here, hereby, herein, hereof, hereto, herewith, home, homeward, homewards, indoors, inward, inwards, leftward, leftwards, north, northeast, northward, northwards, northwest, now, onward, onwards, outdoors, outward, outwards, overboard, overhead, overland, overseas, rightward, rightwards, seaward, seawards, skywards, skyward, south, southeast, southwards, southward, southwest, then, thence, thenceforth, there, thereby, therein, thereof, thereto, therewith, together, underfoot, underground, uphill, upstage, upstairs, upstream, upward, upwards, upwind, west, westward, westwards, when, whence, where, whereby, wherein, whereto, wherewith, although, because, considering, given, granted, if, lest, once, provided, providing, seeing, so, supposing, though, unless, whenever, whereas, wherever, while, whilst, ago, according to, as regards, counter to, instead of, owing to, pertaining to, at the behest of, at the expense of, at the hands of, at risk of, at the risk of, at variance with, by dint of, by means of, by virtue of, by way of, for the sake of, for sake of, for lack of, for want of, from want of, in accordance with, in addition to, in case of, in charge of, in compliance with, in conformity with, in contact with, in exchange for, in favor of, in front of, in lieu of, in light of, in the light of, in line with, in place of, in point of, in quest of, in relation to, in regard to, with regard to, in respect to, with respect to, in return for, in search of, in step with, in touch with, in terms of, in the name of, in view of, on account of, on behalf of, on grounds of, on the grounds of, on the part of, on top of, with a view to, with the exception of, à la, a la, as soon as, as well as, close to, due to, far from, in case, other than, prior to, pursuant to, regardless of, subsequent to, as long as, as much as, as far as, by the time, in as much as, inasmuch, in order to, in order that, even, provide that, if only, whether, whose, whoever, why, how, or not, whatever, what, both, and, or, not only, but also, either, neither, nor, just, rather, no sooner, such, that, yet, is, it` |



### Examples

<details><summary>With `Title Case=true`, `Ignore Cased Words=false`</summary>

Before:

`````` markdown
# this is a heading 1
## THIS IS A HEADING 2
### a heading 3
``````

After:

`````` markdown
# This is a Heading 1
## This is a Heading 2
### A Heading 3
``````
</details>
<details><summary>With `Title Case=true`, `Ignore Cased Words=true`</summary>

Before:

`````` markdown
# this is a heading 1
## THIS IS A HEADING 2
### a hEaDiNg 3
``````

After:

`````` markdown
# This is a Heading 1
## THIS IS A HEADING 2
### A hEaDiNg 3
``````
</details>
<details><summary>With `First letter=true`</summary>

Before:

`````` markdown
# this is a heading 1
## this is a heading 2
``````

After:

`````` markdown
# This is a heading 1
## This is a heading 2
``````
</details>
<details><summary>With `ALL CAPS=true`</summary>

Before:

`````` markdown
# this is a heading 1
## this is a heading 2
``````

After:

`````` markdown
# THIS IS A HEADING 1
## THIS IS A HEADING 2
``````
</details>

## File Name Heading

Alias: `file-name-heading`

Inserts the file name as a H1 heading if no H1 heading exists.





### Examples

<details><summary>Inserts an H1 heading</summary>

Before:

`````` markdown
This is a line of text
``````

After:

`````` markdown
# File Name
This is a line of text
``````
</details>
<details><summary>Inserts heading after YAML front matter</summary>

Before:

`````` markdown
---
title: My Title
---
This is a line of text
``````

After:

`````` markdown
---
title: My Title
---
# File Name
This is a line of text
``````
</details>

## Header Increment

Alias: `header-increment`

Heading levels should only increment by one level at a time

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Start Header Increment at Heading Level 2` | Makes heading level 2 the minimum heading level in a file for header increment and shifts all headings accordingly so they increment starting with a level 2 heading. | N/A | false |



### Examples

<details><summary>Heading levels are decremented as needed</summary>

Before:

`````` markdown
# H1
### H3
### H3
#### H4
###### H6

We skipped a 2nd level heading
``````

After:

`````` markdown
# H1
## H3
## H3
### H4
#### H6

We skipped a 2nd level heading
``````
</details>
<details><summary>Skipped headings in sections that would be decremented will result in those headings not having the same meaning</summary>

Before:

`````` markdown
# H1
### H3

We skip from 1 to 3

###### H6

We skip from 3 to 6 leaving out 4, 5, and 6. Thus headings level 4 and 5 will be treated like H3 above until another H2 or H1 is encountered

##### H5

We skipped 5 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

## H2

This resets the decrement section so the H6 below is decremented to an H3

###### H6
``````

After:

`````` markdown
# H1
## H3

We skip from 1 to 3

### H6

We skip from 3 to 6 leaving out 4, 5, and 6. Thus headings level 4 and 5 will be treated like H3 above until another H2 or H1 is encountered

## H5

We skipped 5 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

# H2

This resets the decrement section so the H6 below is decremented to an H3

## H6
``````
</details>
<details><summary>When `Start Header Increment at Heading Level 2 = true`, H1s become H2s and the other headers are incremented accordingly</summary>

Before:

`````` markdown
# H1 becomes H2
#### H4 becomes H3
###### H6
## H2
###### H6
# H1
## H2
``````

After:

`````` markdown
## H1 becomes H2
### H4 becomes H3
#### H6
## H2
### H6
## H1
### H2
``````
</details>

## Headings Start Line

Alias: `headings-start-line`

Headings that do not start a line will have their preceding whitespace removed to make sure they get recognized as headers.





### Examples

<details><summary>Removes spaces prior to a heading</summary>

Before:

`````` markdown
   ## Other heading preceded by 2 spaces ##
_Note that if the spacing is enough for the header to be considered to be part of a codeblock it will not be affected by this rule._
``````

After:

`````` markdown
## Other heading preceded by 2 spaces ##
_Note that if the spacing is enough for the header to be considered to be part of a codeblock it will not be affected by this rule._
``````
</details>
<details><summary>Tags are not affected by this</summary>

Before:

`````` markdown
  #test
  # Heading &amp;
``````

After:

`````` markdown
  #test
# Heading &amp;
``````
</details>

## Remove Trailing Punctuation in Heading

Alias: `remove-trailing-punctuation-in-heading`

Removes the specified punctuation from the end of headings making sure to ignore the semicolon at the end of [HTML entity references](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references).

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Trailing Punctuation` | The trailing punctuation to remove from the headings in the file. | N/A | `.,;:!。，；：！` |



### Examples

<details><summary>Removes punctuation from the end of a heading</summary>

Before:

`````` markdown
# Heading ends in a period.
## Other heading ends in an exclamation mark! ##
``````

After:

`````` markdown
# Heading ends in a period
## Other heading ends in an exclamation mark ##
``````
</details>
<details><summary>HTML Entities at the end of a heading is ignored</summary>

Before:

`````` markdown
# Heading 1
## Heading &amp;
``````

After:

`````` markdown
# Heading 1
## Heading &amp;
``````
</details>
