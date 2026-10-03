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