import RemoveSpaceAroundCharacters from '../src/rules/remove-space-around-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveSpaceAroundCharacters,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/344
      testName: 'Make sure that lists with a dollar sign in them actually get escaped correctly',
      before: dedent`
        # Title
        ${''}
        - lorem \`$\` ipsum
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - lorem \`$\` ipsum
        ${''}
      `,
    },
    {
      testName: 'Fullwidth characters can be excluded',
      before: dedent`
        Spaces around fullwidth Ａ are preserved
      `,
      after: dedent`
        Spaces around fullwidth Ａ are preserved
      `,
      options: {
        includeFullwidthForms: false,
      },
    },
    {
      testName: 'CJK symbols and punctuations can be excluded',
      before: dedent`
        Spaces around 《 are preserved
      `,
      after: dedent`
        Spaces around 《 are preserved
      `,
      options: {
        includeCJKSymbolsAndPunctuation: false,
      },
    },
    {
      testName: 'Dashes can be excluded',
      before: dedent`
        Spaces around en dash – and em dash — are preserved
      `,
      after: dedent`
        Spaces around en dash – and em dash — are preserved
      `,
      options: {
        includeDashes: false,
      },
    },
    {
      testName: 'Custom symbols can be added',
      before: dedent`
        Spaces around custom symbols : are ; removed
      `,
      after: dedent`
        Spaces around custom symbols:are;removed
      `,
      options: {
        otherSymbols: ':;',
      },
    },
  ],
});
