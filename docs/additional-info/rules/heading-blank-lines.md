!!! Warning
    If [paragraph blank lines](#paragraph-blank-lines) is on, a newline will still be added between a heading and a paragraph, even if `Bottom` is `false`. You can override this by adding a [custom regex replacement rule](./custom-rules.md#custom-regex-replacement) with the following settings:
    
    | regex to find  | flags | regex to replace |
    |:-------------  |:----- |:---------------- |
    | `(^#+\s.*)\n+` | `gm`  | `$1\n`           |
