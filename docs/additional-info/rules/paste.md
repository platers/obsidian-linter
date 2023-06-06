These rules try their best to work with YAML values in [Obsidian.md](https://obsidian.md/). There are a couple of things to keep in mind about these rules:

- The rules work on most YAML use cases, but it is not perfect
- There are certain formats of YAML that may have problems being parsed since the YAML keys have their values parsed via regex instead of a library at this time
- Comments in the value of a key may cause problems with things like sorting or properly grabbing a key's value
- Blank lines may be removed if you try sorting or making modifications to the order of keys in the YAML via the Linter

## Limitations

- The plugin only works with the standard pasting (`cmd/ctrl + v`) shortcut, and not with the `p` operator in vim. (Pasting with `cmd/ctrl + v` in normal or insert mode does work though.)
- To avoid conflicts with Plugins like [Auto Link Title](https://obsidian.md/plugins?id=obsidian-auto-link-title) or [Paste URL into Selection](https://obsidian.md/plugins?id=url-into-selection), will not be triggered when an URL is detected in the clipboard.
- On mobile, in order to paste the URL, ensure you perform the `Tap and Hold -> Paste` action to paste into your document and use the paste rules.
- When doing a multicursor multiline paste, the cursors will stay where they were after pasting the values instead of moving to the end of the pasted value
