!!! Note
    An empty `Alias Helper Key` will be treated as if you are using `linter-yaml-title-alias` as the value.
!!! Note
    With the default `Alias Helper Key`, the value is stored under the Linter's own `linter` key:
    ``` yaml
    linter:
      yaml-title-alias: Title
    ```
    A top-level `linter-yaml-title-alias` key written by older versions of the Linter is still read and is moved under `linter` the next time the file is linted. A custom `Alias Helper Key`, like `title`, stays a top-level key.
