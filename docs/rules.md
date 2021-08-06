# Rules

## Trailing spaces

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

## Headings should be surrounded by blank lines

All headings have a blank line both before and after (except where the heading is at the beginning or end of the document)

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

## Space after list markers

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

Keep track of the date the file was last edited in the header YAML.

Example: Adds a header with the date.

Before:

```markdown
# H1
```

After:

```markdown
---
date updated: Tue Dec 31 2019
---
# H1
```

## Compact YAML

Removes leading and trailing blank lines in the header YAML.

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

Heading levels should only increment by one level at a time

Example: 

Before:

```markdown
# H1

### H3

We skipped a 2nd level heading
```

After:

```markdown
# H1

## H3

We skipped a 2nd level heading
```

## Multiple consecutive blank lines

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
