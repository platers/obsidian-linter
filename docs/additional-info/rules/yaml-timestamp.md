#### Date Modified Value Origin

The date modified is _not_ based on the file date modified metadata. This is because the Linter only has access to the last
date modified when it runs. This is not a problem or too noticeable when you modify a file frequently.
However, when a file is rarely updated, the date modified could be very out of date.

For example, say the date modified is January 22nd 2020. But you update the file on January 3rd 2021. The date modified in
the YAML frontmatter would say January 22nd 2020 despite being updated in 2021. If you did not run the Linter
against the file a 2nd time, it could be left with a very misleading value. As such, the date modified is the time when
Linter asks to update the file via any rule except Custom Commands. This should be within about 5 seconds of the value in the file metadata.
