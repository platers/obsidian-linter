# Contributing

Thanks for considering contributing to this plugin. This document will hopefully give you some tips and tricks to help you and us
with making this plugin better.

## Development Setup

You will want to start by forking this repository. Once that is done, you will want to clone your fork of the repository.
The command should look something like the following:
``` sh
git clone https://github.com/{USERNAME_HERE}/obsidian-linter/
```

### Node and NPM

Next you will want to install the appropriate versions of Node and NPM.  
_This plugin requires Node version `15.x` or higher._

#### Windows

Install the version of [Node](https://nodejs.org/en/download/) you would like. Make sure to add it to your path under environment variables.

#### Linux, Mac, and Windows via WSL/WSL2

It is recommended that you use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) which is a node version manager that comes in handy when swapping and installing node versions,
especially since most linux package managers do not have the needed node version in the standard packages.

### Install Dependencies

Now that Node and NPM are installed, we can go ahead and run `npm ci` from the base of the cloned repository.
This should install the necessary dependencies for working on the plugin. The command may take several minutes to complete.

Once this is done, you should be all set up for contributing to the plugin.

## Making Changes

Now that the repository is set up, you should be able to start making changes.

### Adding a Rule

When adding a rule, please add that rule in `src/rules/` directory. You can use `src/rules/_rule-template.ts.ts` as the quick start.
Try to follow the format of the existing rules where possible as it makes the code easier to maintain and changes easier to review.
You may find it useful to reference methods from `src/utils/`.

For example, you may want to ignore tables and tags which will require `ignoreListOfTypes` from `src/utils/ignore-types.ts`.

Once a rule has been created, see about adding tests for edge cases as described [below](#adding-tests).

### Bug Fixes

When fixing a bug, if the bug is specific to one of more rules, please add tests to cover the scenarios where the bug ocurred.
If you are not aware of how to do this, please see [Adding Tests](#adding-tests) below.

It can be helpful to add a test that recreates the bug prior to making changes to the code, then once the failing test case(s) is/are in place, all that is left is to get them to pass without breaking other tests. This may not work for everyone

### Refactoring Code

When planning to refactor large portions of code, please create an issue on the repository before creating a pull request, so that the suggested refactor can be looked at before any work or [proof of concept](#proof-of-concept) is requested. This will help save time for everyone involved.

Once the proof of concept, if requested, or refactor idea gets the green light, feel free to create a [pull request](#issuing-a-pull-request) with the suggested changes present or convert the draft pull request to a regular pull request.

### Adding Tests

Tests are located in `__tests__/`. File names for tests must end in `.test.ts` and should have dashes between words.  
Tests for rule other than the examples will be in the format `{RULE_ALIAS}.test.ts` which will help keep testing files manageable.

A test will take the form of
```Typescript
ruleTest({
  RuleBuilderClass: {RULE_BUILDER_CLASS},
  testCases: [
    {
      testName: '{TEST_NAME}',
      before: dedent`
        NOTE
        BEFORE
        APPLYING
        THE RULE
      `,
      after: dedent`
        NOTE
        AFTER
        APPLYING
        THE RULE
      `,
      options: {
        {RULE_OPTIONS_PROPERTY_KEY}: '{RULE_OPTIONS_PROPERTY_VALUE}',
      },
    }
  ]
});
```

To run tests, see [Running Tests](#running-tests).

### Updating Documentation

Documentation can be broken up into two parts: generated documentation and documentation templates.

#### Generated Documentation

A lot of the documentation for this plugin is generated. See the [Documentation Templates](#documentation-templates) section to see which files they are and when they should be updated.

If you are looking to update the rules list information like section, examples, descriptions, or options in the Readme or rules documentation, update the rule information in the corresponding rule in `rules.ts`.  

#### Documentation Templates

There are currently two documentation templates:

1. [readme_template.md](docs/readme_template.md)
  - This template is used for generating the [README](README.md) file and should be updated for changes that are not rules documentation links and their corresponding sections.
2. [rules_template.md](docs/rules_template.md)
  - This template is used for generating the [rules.md](docs/rules.md) file and should be updated when you want to change the style or escaping of rule information or examples.

You may also want to take a look at `docs.ts` to modify how the generated files are created.

#### Generating Documentation

To update the documentation you can run `npm run compile` if you need to compile the code as well or just run `npm run docs` which just generates the documentation.

## Adding Translations for a Language

Translations exist under `src/lang/locale/`. Each translation is a file that should be the 2 letter language short code for the language,
unless it is a specific dialect or version of the language in which case it should be the 2 letter language short code followed by a dash and the dialect short code or identifier (i.e. `pt-br`).

_Note: any missing keys will be defaulted to its English values which allows for partial translation of a language._

### Adding/Updating Values to an Existing Language

If you would like to add a translation, you can add values manually or via running `npm run translate`. If you choose to use the script,
you will be able to add a translation value for a specific language, list untranslated keys in a specified language,
replace translated value with a new value for a specified key, translate all untranslated keys in a language one at a time

If you choose to do so manually, you will need to copy the structure found in [en.ts](src/lang/locale/en.ts) to the language that you want to add values for.

### Adding a New Language

In order to add language support for a new language, create a new file with the following contents:
``` js
// {NAME_OF_LANGUAGE_IN_LANGUAGE_HERE}

export default {};
```

Next add an import statement like `import {LANGUAGE_SHORT_CODE} from './locale/{LANGUAGE_SHORT_CODE}';`
and an entry in `localeMap` that looks something like `{LANGUAGE_SHORT_CODE}`.
Both of these changes need to be added in [helpers.ts](src/lang/helpers.ts).

Once that is done, all that is left is to add values to the language.

## Running Tests

Tests are run by jest. They can be run by either running `npm run test` or `npm run compile`. The output will let you know how many of the tests passed and if any failed, why they failed.

If you know the suite of tests that you would like to run, you can use `npm run test-suite TEST_SUITE_HERE` to run just the desired test suite. The test suite names are the names of the files in `__tests` minus `.test.ts`. So for example, `npm run test-suite format-yaml-arrays` would run the test suite for formatting yaml arrays. _Note: this does not run the examples for that rule as all examples are bundled together in the examples test suite._

## Linting Files

Files should be linted prior to creating a pull request. The linter will make sure that the code follows the desired codestyle and formats the files as needed. The linter can be run by `npm run lint` or `npm run compile`

Note that linter removes trailing spaces and blank lines. In case if they are essential use the following trick to preserve them

```js
const str = dedent`
  line with essential trailing spaces   ${''}
  ${''}
  previous line is completely blank
`;
```

## Issuing a Pull Request

Once all changes have been made, any applicable tests added, and the linter has applied formats and identified no issues, then it is time to create a pull request.

When creating a pull request, please make sure that if it fixes a bug, adds a requested feature, or implements a suggested refactor, please make sure to include `Fixes #{ISSUE_NUMBER}`. This will help associate the change with the created issue and it will help make sure that issues are closed when their fixes are merged.

Please include a little bit about what the pull request does in the description of the ticket to help give some context to the developers that review the pull request.

### Proof of Concept

A proof of concept may be requested which should be a small example of the refactor that will be created. It should be created as a draft pull request.

These types of pull requests should give an idea of the suggested change without spending the time needed to convert all code to use the suggestion. It can help display the strengths and weaknesses of the suggested change.

## Creating a Release

In order to create a release, there are a couple of steps to go through:

Start by updating the version number in `package.json` and `manifest.json`. Then add a new version entry into `versions.json`.

A version entry in `versions.json` would like something like the following:
```JSON
"{PLUGIN_VERSION}": "{MINIMUM_OBSIDIAN_VERSION}" // i.e. "1.3.4": "0.9.7" 
```
If you are not sure what version to use for `{MINIMUM_OBSIDIAN_VERSION}`, use your current version of Obsidian.

Now that the versions are updated, create a pull request and merge the changes into master. Once that is done go to the [releases tab](https://github.com/platers/obsidian-linter/releases/latest) and select draft a new release. Then you can type in the new tag which should be the version of the release (i.e. `1.3.4`) and have it create the tag on creation of the release. Auto fill the release using the option to "Generate release notes". Then attach the compiled `main.js` and `manifest.json` to the release before publishing the release.
