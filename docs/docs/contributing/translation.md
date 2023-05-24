# Translating the Linter

TODO: update this content especially with more code examples

If you would like to help out by translating the Linter either into a new language, adding a new value to a language,
or update an existing value for a language, these steps should help.

## Adding Translations for a Language

Translations exist under `src/lang/locale/`. Each translation is a file that should be the 2 letter language short code for the language,
unless it is a specific dialect or version of the language in which case it should be the 2 letter language short code followed by a dash and the dialect short code or identifier (i.e. `pt-br`).

_Note: any missing keys will be defaulted to its English values which allows for partial translation of a language._

## Adding/Updating Values to an Existing Language

If you would like to add a translation, you can add values manually or via running `npm run translate`. If you choose to use the script,
you will be able to add a translation value for a specific language, list untranslated keys in a specified language,
replace translated value with a new value for a specified key, translate all untranslated keys in a language one at a time

If you choose to do so manually, you will need to copy the structure found in [en.ts](src/lang/locale/en.ts) to the language that you want to add values for.

!!! note "Translation helper requirements"
    The translation helper requires that you have already followed the steps to setup npm and have installed its dependencies for this project.

## Adding a New Language

In order to add language support for a new language, create a new file with the following contents:
``` js
// {NAME_OF_LANGUAGE_IN_LANGUAGE_HERE}

export default {};
```

Next add an import statement like `import {LANGUAGE_SHORT_CODE} from './locale/{LANGUAGE_SHORT_CODE}';`
and an entry in `localeMap` that looks something like `{LANGUAGE_SHORT_CODE}`.
Both of these changes need to be added in [helpers.ts](src/lang/helpers.ts).

Once that is done, all that is left is to add values to the language.
