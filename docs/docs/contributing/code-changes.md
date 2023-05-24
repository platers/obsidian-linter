# Code Changes

## Adding a Rule

When adding a rule, please add that rule in `src/rules/` directory. You can use `src/rules/_rule-template.ts.ts` as the quick start.
Try to follow the format of the existing rules where possible as it makes the code easier to maintain and changes easier to review.
You may find it useful to reference methods from `src/utils/`.

For example, you may want to ignore tables and tags which will require `ignoreListOfTypes` from `src/utils/ignore-types.ts`.

Once a rule has been created, see about adding tests for edge cases as described [below](#adding-tests).

## Bug Fixes

When fixing a bug, if the bug is specific to one of more rules, please add tests to cover the scenarios where the bug ocurred.
If you are not aware of how to do this, please see [Adding Tests](#adding-tests) below.

It can be helpful to add a test that recreates the bug prior to making changes to the code, then once the failing test case(s) is/are in place, all that is left is to get them to pass without breaking other tests. This may not work for everyone

## Refactoring Code

When planning to refactor large portions of code, please create an issue on the repository before creating a pull request, so that the suggested refactor can be looked at before any work or [proof of concept](#proof-of-concept) is requested. This will help save time for everyone involved.

Once the proof of concept, if requested, or refactor idea gets the green light, feel free to create a [pull request](#issuing-a-pull-request) with the suggested changes present or convert the draft pull request to a regular pull request.

## Adding Tests

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
