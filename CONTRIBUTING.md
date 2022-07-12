# Contributing

Thanks for considering contributing to this plugin. This document will hopefully give you some tips and tricks to help you and us
with making this plugin better.

## Development Setup

You will want to start by forking this repository. Once that is done, you will want to clone your fork of the repository.
The command should look something like the following:
`git clone https://github.com/{USERNAME_HERE}/obsidian-linter/`.

### Node and NPM

Next you will want to install the appropriate versions of node and npm.  
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

When adding a rule, please add that rule in `rules.ts`.
Make sure to add it to the corresponding rule type section (spacing, headings, etc) in that file.
Try to follow the format of existing tests where possible as it makes the code easier to maintain and changes easier to review.
Yoy may find it useful to reference methods from `ignore-types.ts` and yo `utils.ts`.  
For example, you may want to ignore tables and tags which will require `ignoreTypes` from `ignore-types.ts`.

Once the rule has been created, see about adding tests for edge cases as described [below](#adding-tests).

### Bug Fixes

When fixing a bug, if the bug is specific to one of more rules, please add tests to cover the scenarios where the bug ocurred.
If you are not aware of how to do this, please see [Adding Tests](#adding-tests) below.

This may not work for everyone, but it can be helpful to add a test that creates the failure prior to making changes to the code.
Once the failing test case(s) is/are in place, all that is left is to get them to pass without breaking other tests.

### Refactoring Code

### Adding Tests

### Updating Documentation

Documentation can be broken up into two parts: generated documentation and documentation templates.

#### Generated Documentation

A lot of the documentation for this plugin is generated.
For example, the ReadMe file is generated from the list of rules that exist and the [ReadMe template)(docs/readme_template.ts).

Another generated file is `docs/rules.md`.

To make changes to the documentation for rule examples or rule descriptions as found in `docs/rules.md`, you will want to modify the rule information in `rules.ts`.  
If you just want to modify some of the look of the document in general you can modify `docs/rules_template.ts`.

#### Documentation Templates

There are currently two documentation templates:

1. Readme
  - This template is used for generating the ReadMe file.
2. Rules
  - This template is used for generating the `docs/rules.md` file.

4. Add a new rule in `rules.ts`.
   1. Insert a new rule in the corresponding rule type 
   2. Follow the format of the existing rules
   3. Add tests for edge cases in `src/test/rule_alias_here.test.ts`
   4. You should probably use some helper functions from `utils.ts`, such as `formatYAML`.
5. Run `npm run compile` to build, generate documentation, and test the plugin.
6. Run `npm run lint` to lint the plugin.

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
