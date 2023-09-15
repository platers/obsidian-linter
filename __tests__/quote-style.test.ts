import QuoteStyle, {SingleQuoteStyles, DoubleQuoteStyles} from '../src/rules/quote-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: QuoteStyle,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/826
      testName: 'Make sure inline code is unaffected',
      before: dedent`
        \`'Test'\`
        \`"Test"\`
      `,
      after: dedent`
        \`'Test'\`
        \`"Test"\`
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure that more nuanced scenarios are handled properly when using smart quotes for foreign languages',
      before: dedent`
        Het 'is' zo.
      `,
      after: dedent`
        Het ‘is’ zo.
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure if a double quote starts a file, it becomes an opening smart quote when using smart double quotes',
      before: dedent`
        "
      `,
      after: dedent`
        “
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure if a double quote starts a file, it becomes an opening smart quote when using smart single quotes',
      before: dedent`
        '
      `,
      after: dedent`
        ‘
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure if a double quote starts a file, it becomes an opening smart quote when using smart single quotes',
      before: dedent`
        '
      `,
      after: dedent`
        ‘
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure quotes in a sentence get handled correctly with smart quotes',
      before: dedent`
        He said to his friend, "How are you able to say 'this is fun' when we could get grounded?" But he got no response.
      `,
      after: dedent`
        He said to his friend, “How are you able to say ‘this is fun’ when we could get grounded?” But he got no response.
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure that a letter before and after a single quote get interpreted as a contraction',
      before: dedent`
        zo'n
      `,
      after: dedent`
        zo’n
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/885
      testName: 'Make sure that replacing quotes with smart quotes works properly in partial replace situations',
      before: dedent`
        He said to his friend, “How are you able to say ‘this is fun.' when we could get grounded?" But he got no response.
      `,
      after: dedent`
        He said to his friend, “How are you able to say ‘this is fun.’ when we could get grounded?” But he got no response.
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
        doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
      },
    },
  ],
});
