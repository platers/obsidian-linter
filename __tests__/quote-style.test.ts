import QuoteStyle, {SingleQuoteStyles, DoubleQuoteStyles} from '../src/rules/quote-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: QuoteStyle,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/380
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
  ],
});
