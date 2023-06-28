# Testing

Before trying to run tests, make sure that you have setup the Linter for local use as described in the [Setup Guide](getting-setup.md).

Testing the Linter is broken into unit tests that can be run against logic inside of the repository and integration testing
which general applies to interacting with Obsidian, verifying how UI elements look, and making sure the plugin still loads.

## Unit Testing

Unit tests are a great way to make sure that the rules and other logic within the Linter is working as intended and expected
especially over time with code refactoring, logical changes, and bug fixes. This helps make sure that the logic still works
like it did before changes were made.

!!! warning "Unit test reliability"
    Unit tests are only as reliable as the quality of the tests. So if the tests are poor and barely test the
    functionality of the rules or logic in question, the unit tests can give a false impression that the code is working.

### What Do Unit Tests Look Like in the Linter?

There are really 2 broad categories of unit tests in the Linter: rule examples and test suites.

#### Rule Examples

These are the examples that you find in the definition of rules themselves. You can find more on them in [Rule Examples](adding-a-rule.md#rule-examples) under Adding a Rule.

#### Test Suites

These are tests that reside in the `__tests__` directory. They can be broken into 2 categories themselves: general rule test
suites and specific test suites.

##### General Rule Test Suites

As the name suggests, these are test suites that follow a general format and each one is specific to a rule. For example,
[capitalize-headings.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/capitalize-headings.test.ts)
is a general rule test suite since it only has tests for [Capitalize Headings](../settings/heading-rules.md#capitalize-headings).

These rules follow the same kind of format:

``` TypeScript
import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    ...
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
  ],
});
```

The file starts off with the imports which includes the [Rule Options](adding-a-rule.md#rule-options), any type imports it may
need, and the `ruleTest` method which basically sets up the tests to be run as an array of tests:

``` TypeScript
import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
```

After that comes the list of tests being passed into `ruleTest`:

``` TypeScript
ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    ...
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
  ],
});
```

`rulesTest` expects the `RuleBuilderClass` to be the rule options class reference and then `testCases` which is a list of
test cases for the rule. The test cases are almost identical to [Rule Examples](adding-a-rule.md#rule-examples) however they use `testName` instead of `description`.

##### Specific Test Suites

These test suites are generally tailored to a specific function that exists that is not a rule. They are generally meant to
make sure that certain functions still work as intended. An example of a specific test suite is [get-all-custom-ignore-sections-in-text.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/get-all-custom-ignore-sections-in-text.test.ts).
The logic for these tests tries to follow a similar setup to that of a general rule test suite, but is tailored to the needs
of the specific function that is being tested:

``` TypeScript
import {getAllCustomIgnoreSectionsInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedCustomIgnoresInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};

const getCustomIgnoreSectionsInTextTestCases: customIgnoresInTextTestCase[] = [
  {
    name: 'when no custom ignore start indicator is present, no positions are returned',
    text: dedent`
      Here is some text
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'when no custom ignore start indicator is present, no positions are returned even if custom ignore end indicator is present',
    text: dedent`
      Here is some text
      <!-- linter-enable -->
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'a simple example of a start and end custom ignore indicator results in the proper start and end positions for the ignore section',
    text: dedent`
      Here is some text
      <!-- linter-disable -->
      This content will be ignored
      So any format put here gets to stay as is
      <!-- linter-enable -->
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 135}],
  },
  {
    name: 'when a custom ignore start indicator is not followed by a custom ignore end indicator in the text, the end is considered to be the end of the text',
    text: dedent`
      Here is some text
      <!-- linter-disable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 129}],
  },
  {
    name: 'when a custom ignore start indicator shows up midline, it ignores the part in question',
    text: dedent`
      Here is some text<!-- linter-disable -->here is some ignored text<!-- linter-enable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 87}],
  },
  {
    name: 'when a custom ignore start indicator does not follow the exact syntax, it is counted as existing when it is a single-line comment',
    text: dedent`
      Here is some text<!-- linter-disable-->here is some ignored text<!-------------         linter-enable ------>
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 109}],
  },
  {
    name: 'multiple matches can be returned',
    text: dedent`
      Here is some text<!-- linter-disable -->here is some ignored text<!-- linter-enable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
      ${''}
      <!-- linter-disable -->
      We want to ignore the following as we want to preserve its format
        -> level 1
          -> level 1.3
        -> level 2
      Finish
    `,
    expectedCustomIgnoresInText: 2,
    expectedPositions: [{startIndex: 17, endIndex: 87}, {startIndex: 178, endIndex: 316}],
  },
];

describe('Get All Custom Ignore Sections in Text', () => {
  for (const testCase of getCustomIgnoreSectionsInTextTestCases) {
    it(testCase.name, () => {
      const customIgnorePositions = getAllCustomIgnoreSectionsInText(testCase.text);

      expect(customIgnorePositions.length).toEqual(testCase.expectedCustomIgnoresInText);
      expect(customIgnorePositions).toEqual(testCase.expectedPositions);
    });
  }
});
```

These tests general start by importing the function to test followed by the format of how the test cases will be formatted:

``` TypeScript
import {getAllCustomIgnoreSectionsInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedCustomIgnoresInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};
```

After that comes the test cases and then the running of the test cases:

``` TypeScript
describe('Get All Custom Ignore Sections in Text', () => {
  for (const testCase of getCustomIgnoreSectionsInTextTestCases) {
    it(testCase.name, () => {
      const customIgnorePositions = getAllCustomIgnoreSectionsInText(testCase.text);

      expect(customIgnorePositions.length).toEqual(testCase.expectedCustomIgnoresInText);
      expect(customIgnorePositions).toEqual(testCase.expectedPositions);
    });
  }
});
```

This is the format you will want to use for specific test suites if at all possible. There are some scenarios where the test
cases do vary so much that creating a type for the test case is not feasible and so individual tests are used like what
[rules-runner.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/rules-runner.test.ts) does.

### Should You Add a Test?

You may be wondering whether you should or should not add a test to the Linter. If you do any of the following, you should add a unit test:

| Situation | Tests to Include |
| --------- | ---------------- |
| Add a new rule | Examples on the rule that cover general use cases<br/><br/>Unit tests in a test suite for the new rule that cover cases that make the examples too long or that are edge cases |
| Add a new option to a rule | An example or examples on the rule to cover the general scenarios of the new option<br/><br/>Unit tests in a test suite for the rule that cover cases that make the examples too long or that are edge cases |
| Refactoring code | This may require a new test suite that is designed specifically for the refactored code (for example [get-all-tables-in-text.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/get-all-tables-in-text.test.ts)) or new unit tests in a test suite that uses the logic that was refactored if it has changed the edge cases that are possible |
| Fixing a bug | When a bug directly affects a single rule and can be reproduced by setting up a case in the rule's test suite, add that rule with a comment referencing back to the issue that reported the problem* |

*Here is what an example of bug fix unit test looks like in a general rule test suite:

``` TypeScript
{ // accounts for https://github.com/platers/obsidian-linter/issues/412
  testName: 'H1s become H2s and all other headers are shifted accordingly when an H1 starts a file',
  before: dedent`
    # H1
    ### H3
    #### H4
    # H1
    #### H4
    ###### H6
  `,
  after: dedent`
    ## H1
    ### H3
    #### H4
    ## H1
    ### H4
    #### H6
  `,
  options: {
    startAtH2: true,
  },
},
```

### Adding Tests

Where to add a test depends on what kind of test you are adding. If it is an example, it should reside in the specific rule
that it pertains to. If it is meant to be a bug fix, edge case test, a test for a non-rule function, or a large test, then
adding it to an existing or new test suite makes the most sense.

When adding an example test case, please follow the format described by [Rule Examples](adding-a-rule.md#rule-examples).
When adding an test suite test case, please follow the format described above by [Test Suites](#test-suites) making sure
that any newly added test suites have dashes between words in the filename.

Once a test is added, you will want to run the tests, see [Running Tests](#running-tests).

### Running Tests


Tests are run by jest and running them varies depending on whether you want to run all tests or one or more test suites.

#### All Tests

They can be run by either running `npm run test` or `npm run compile`. The output will let
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

## Integration Testing

Integration tests are reserved for things that are not easily tested with unit tests. When doing these tests,
you will need to load your local copy of the Linter into Obsidian and then run the Linter with the desired rules turned on.

### When Should I Do Integration Testing?

When a rule is changed to run as part of the rules to run after or rules to run before the normal rules in [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts).

When a UI change is made. For example a wording change or a display element changes like CSS or HTML changes.

When the issue was caused by multiple rules making changes to the contents of a file to create an issue.
When this happens, the only way I have found to be reliable when testing that the issue is resolved is via integration testing.
