These rules try their best to work with YAML values in [Obsidian.md](https://obsidian.md/). There are a couple of things to keep in mind about these rules:

- The rules work on most YAML use cases, but it is not perfect
- There are certain formats of YAML that may have problems being parsed since the YAML keys have their values parsed via regex instead of a library at this time
- Comments in the value of a key may cause problems with things like sorting or properly grabbing a key's value
- Blank lines may be removed if you try sorting or making modifications to the order of keys in the YAML via the Linter
