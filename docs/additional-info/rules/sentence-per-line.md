#### Rendering: Obsidian "Strict line breaks"

This rule writes one sentence per source line. Under standard Markdown (and
under Obsidian with **Settings → Editor → Strict line breaks** turned **on**) a
single newline is treated as a space, so the rendered output is **unchanged** —
only the diff-friendliness of the source improves.

**Obsidian's "Strict line breaks" setting is off by default.** With it off,
Obsidian renders a single newline as a visible line break, so this rule **will**
change reading-view rendering (each sentence appears on its own visual line).
Enable this rule only if you use "Strict line breaks", or a standard-Markdown
renderer (GitHub/GitLab, Pandoc, Hugo, etc.). This is the single most important
thing to know before turning the rule on.

#### Scope

Only top-level paragraphs are reflowed. Headings, lists, blockquotes, tables,
fenced/indented code, math blocks, HTML blocks, footnote definitions, and YAML
frontmatter are left untouched. Reflowing prose nested inside list items and
blockquotes is intentionally out of scope for now.

A line whose content is exactly one masked construct (a table, an Obsidian
`%%…%%` comment, a custom-ignore block, or a lone link/embed) acts as a
structural divider: it is emitted verbatim and the blank-or-not spacing on
either side of it is preserved exactly. Adding blank lines around blocks is the
job of *Paragraph blank lines*, not this rule; this rule only avoids corrupting
that adjacency.

#### Accepted heuristic limitations

Sentence detection is a heuristic. The following are deliberate trade-offs that
favor precision (not splitting where it would be wrong) over recall:

- A sentence that genuinely starts with a lowercase word or a digit
  (`iOS is great.`) is **not** split — the following word looks like a
  continuation.
- A single capital letter that genuinely ends a sentence before another capital
  (`Choose plan B. Then pay.`) is **not** split — it is indistinguishable from
  an initial such as `J. R. R. Tolkien`.
- An abbreviation that genuinely ends a sentence (`… at Foo Inc. We won.`) is
  **not** split.
- A half-width `.` placed directly before CJK text with no space
  (`句子.句子`) is **not** split — CJK authors should use the full-width `。`
  (which splits without requiring a space).
- A mid-line `<br>`/`<br/>` is treated as opaque inline content and does not
  force a split (only a *line-final* hard break is honored).
- Prose glued to the line immediately after a closing HTML block tag (no blank
  line after `</div>`) is absorbed into the HTML block by Markdown itself and
  is therefore **not** reflowed (a no-op, matching how other content rules
  treat HTML blocks).

The sentence terminators and the abbreviation list are both configurable to
tune this behavior. Leaving the terminators empty makes the rule a no-op.

#### Interaction with other rules

- **Line break between lines with content** (`two-spaces-between-lines-with-content`):
  using both is contradictory — it would add a hard-break indicator to every
  per-sentence line, turning each sentence into a *rendered* line break and
  defeating the purpose of this rule. Enabling one while the other is on prompts
  you to disable the conflicting rule, and if both are enabled via
  `data.json`/sync, *Line break between lines with content* is automatically
  disabled on the next settings load (with a notice).
- **Trailing spaces**: this rule preserves an author hard break by re-emitting
  its exact indicator. Whether that indicator survives a *full* lint run depends
  on *Trailing spaces*, which runs afterward:
  - `<br>`, `<br/>`, and `\` always survive.
  - Exactly two trailing spaces survive **only** if *Trailing spaces* has its
    "Two space linebreak" option enabled.
  - A one-space, three-or-more-space, or any tab-containing trailing run is
    **not** preserved (it is stripped by *Trailing spaces*).

  For a hard break that survives a full lint run, author it as `<br>`, `<br/>`,
  `\`, or as exactly two trailing spaces with "Two space linebreak" enabled.
