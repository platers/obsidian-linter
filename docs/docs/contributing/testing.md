# Testing

Testing the Linter is broken into unit tests that can be run against logic inside of the repository and manual testing
which general applies to interacting with Obsidian, verifying how UI elements look, and making sure the plugin still loads.

## Unit Testing

Unit tests are a great way to make sure that the rules and other logic within the Linter is working as intended and expected
especially over time with code refactoring, logical changes, and bug fixes. This helps make sure that the logic still works
like it did before changes were made.

!!! warning "Unit test reliability"
    Unit tests are only as reliable as the quality of the tests. So if the tests are poor and barely test the
    functionality of the rules or logic in question, the unit tests can give a false impression that the code is working.

### Should You Add a Test?

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

### Running Tests

#### All Tests

Tests are run by jest. They can be run by either running `npm run test` or `npm run compile`. The output will let
you know how many of the tests passed and if any failed, why they failed using a visual comparison of what was expected
versus what was received.

!!! note "Advanced tests"
    When advanced tests fail, their output is harder to read since it uses a regex match. It is recommended that you use
    the output of the expected versus actual values for the normal tests to determine what went wrong with the test.

#### A Specific Test Suite

If you know the suite of tests that you would like to run, you can use `npm run test-suite TEST_SUITE_HERE` to run just
the desired test suite. The test suite names are the names of the files in `__tests` minus `.test.ts`. You only need to
use part of a file name for a test suite to be used as it checks that the test suite name starts with the value of `TEST_SUITE_HERE`.

So for example, `npm run test-suite format-yaml-arrays` would run the test suite for formatting YAML arrays since that is
the only test suite that starts with `format-yaml-arrays`. While, `npm run test-suite header` would run all test suites
that start with the word `header`.

!!! note
    Running a test suite for a specific rule or rules does not run the examples for that rule(s) as all examples
    are bundled together in the examples test suite which can be run via `npm run test-suite examples`.

## Manual Testing
