# Contributing

Thanks for considering contributing to this plugin. This document will hopefully give you some tips and tricks to help you and us
with making this plugin better.

## Development Instructions

1. Fork this repository
2. Clone the repository
3. Run `npm ci` to install dependencies
4. Add a new rule in `rules.ts`.
   1. Insert a new rule in the corresponding rule type (spacing, headings, etc)
   2. Follow the format of the existing rules
   3. Add tests for edge cases in `src/test/rule_alias_here.test.ts`
   4. You should probably use some helper functions from `utils.ts`, such as `formatYAML`.
5. Run `npm run compile` to build, generate documentation, and test the plugin.
6. Run `npm run lint` to lint the plugin.

_Make sure to use Node 15.x or higher._

## Tests

Tests are located in `src/test/` and should have dashes between words and end in `.test.ts`. These files will be run by jest.
When adding a a test, please add it in `src/test/rule_alias.test.ts`. If the file does not already exist, please create it and
add the new test(s).

## Creating a Release

In order to create a release, there are a couple of steps to go through:

1. Update the version number in `versions.json`, `package.json`, and `manifest.json`. When updating `versions.json` add a value that looks like `"plugin_version": "minimum_obsidian_version"`. If uncertain what version to put, I recommend using your current version of Obsidian.
2. Once the version change is merged into master, go to the [releases tab](https://github.com/platers/obsidian-linter//releases/latest) and select draft a new release.
3. Then you can type in the new tag which should be the version of the release (i.e. `1.3.4`) and have it create the tag on creation of the release.
4. Auto fill the release using the option to "Generate release notes".
5. Then attach the compiled `main.js` and `manifest.json` to the release before publishing the release.
