import AutoCorrectCommonMisspellings from '../src/rules/auto-correct-common-misspellings';
import dedent from 'ts-dedent';
import {defaultMisspellings, ruleTest} from './common';

ruleTest({
  RuleBuilderClass: AutoCorrectCommonMisspellings,
  testCases: [
    {
      // The word expression includes the backtick, so inline code must be a token before words can be found.
      testName: 'Corrects a visible word immediately before inline code',
      before: 'a`b`',
      after: 'c`b`',
      options: {misspellingToCorrection: new Map([['a', 'c']])},
    },
    {
      testName: 'Leaves misspellings inside fenced code alone',
      before: '```\nabsoltely\n```\nabsoltely',
      after: '```\nabsoltely\n```\nabsolutely',
      options: {misspellingToCorrection: defaultMisspellings()},
    },
    {
      testName: 'Leaves misspellings inside disabled sections alone',
      before: '<!-- linter-disable -->\nabsoltely\n<!-- linter-enable -->\n\nabsoltely',
      after: '<!-- linter-disable -->\nabsoltely\n<!-- linter-enable -->\n\nabsolutely',
      options: {misspellingToCorrection: defaultMisspellings()},
    },
    {
      testName: 'Doesn\'t auto-correct markdown and wiki links',
      before: dedent`
        [[absoltely not a changed]]
        [absoltely not a changed](absoltely.not.changed.md)
      `,
      after: dedent`
        [[absoltely not a changed]]
        [absoltely not a changed](absoltely.not.changed.md)
      `,
      options: {
        misspellingToCorrection: defaultMisspellings(),
      },
    },
    {
      testName: 'Doesn\'t auto-correct markdown and wiki images',
      before: dedent`
        ![[absoltely.not.a.changed.jpg]]
        ![absoltely not a changed](absoltely.not.changed.md)
      `,
      after: dedent`
        ![[absoltely.not.a.changed.jpg]]
        ![absoltely not a changed](absoltely.not.changed.md)
      `,
      options: {
        misspellingToCorrection: defaultMisspellings(),
      },
    },
    {
      testName: 'Doesn\'t auto-correct words that start with unicode specific characters when not in correction list',
      before: dedent`
        être
      `,
      after: dedent`
        être
      `,
      options: {
        misspellingToCorrection: defaultMisspellings(),
      },
    },
    {
      testName: 'Custom replacements should work on file content',
      before: dedent`
        The cartt is over theree.
      `,
      after: dedent`
        The cart is over there.
      `,
      options: {
        misspellingToCorrection: defaultMisspellings(),
        extraAutoCorrectFiles: [{
          filePath: 'file_path',
          customReplacements: new Map<string, string>([['cartt', 'cart'], ['theree', 'there']]),
        }],
      },
    },
  ],
});
