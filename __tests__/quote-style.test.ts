import QuoteStyle, {SingleQuoteStyles, DoubleQuoteStyles} from '../src/rules/quote-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: QuoteStyle,
  testCases: [
    {
      // Edits come from more than one pass and have to be ordered together before applying.
      testName: 'Orders double and single quote edits together with default settings',
      before: '‘“',
      after: '\'"',
    },
    {
      testName: 'Leaves smart quotes inside fenced code alone',
      before: '```\n“inside” ‘inside’\n```\n“outside” ‘outside’',
      after: '```\n“inside” ‘inside’\n```\n"outside" \'outside\'',
    },
    {
      testName: 'Leaves smart quotes inside disabled sections alone',
      before: '<!-- linter-disable -->\n“inside” ‘inside’\n<!-- linter-enable -->\n“outside” ‘outside’',
      after: '<!-- linter-disable -->\n“inside” ‘inside’\n<!-- linter-enable -->\n"outside" \'outside\'',
    },
    {
      testName: 'Protected straight quotes do not advance smart quote pairing',
      before: '```\n"\'\n```\n<!-- linter-disable -->\n"\'\n<!-- linter-enable -->\n"outside" \'outside\'',
      after: '```\n"\'\n```\n<!-- linter-disable -->\n"\'\n<!-- linter-enable -->\n“outside” ‘outside’',
      options: {singleQuoteStyle: SingleQuoteStyles.SmartQuote, doubleQuoteStyle: DoubleQuoteStyles.SmartQuote},
    },
    {
      testName: 'Ignores templater and HTML quotes while converting surrounding quotes',
      before: '"<% "\' %>" \'<span title="\'">text</span>\'',
      after: '“<% "\' %>” ‘<span title="\'">text</span>’',
      options: {singleQuoteStyle: SingleQuoteStyles.SmartQuote, doubleQuoteStyle: DoubleQuoteStyles.SmartQuote},
    },
    {
      testName: 'Classifies quotes beside protected content without reading its letters',
      before: '\'`a`\'b "[x](url)"',
      after: '‘`a`’b “[x](url)”',
      options: {singleQuoteStyle: SingleQuoteStyles.SmartQuote, doubleQuoteStyle: DoubleQuoteStyles.SmartQuote},
    },
    {
      testName: 'Combines double quote straightening and single quote smartening against original text',
      before: '“\'text\'”',
      after: '"‘text’"',
      options: {singleQuoteStyle: SingleQuoteStyles.SmartQuote, doubleQuoteStyle: DoubleQuoteStyles.Straight},
    },
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/929
      testName: 'Make sure quotes in markdown links get ignored',
      before: dedent`
        [link](https://test.it 'Test title')
      `,
      after: dedent`
        [link](https://test.it 'Test title')
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1109
      testName: 'Make sure quotes in markdown image links get ignored',
      before: dedent`
        ![link](https://test.it 'Test title')
      `,
      after: dedent`
        ![link](https://test.it 'Test title')
      `,
      options: {
        singleQuoteStyle: SingleQuoteStyles.SmartQuote,
      },
    },
  ],
});
