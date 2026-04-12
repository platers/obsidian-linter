import {IgnoreType, IgnoreTypes, ignoreListOfTypes} from '../src/utils/ignore-types';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedTextAfterIgnore?: string,
  ignoreTypes: IgnoreType[];
  afterIgnoreAssert?: (text: string) => void,
};

const ignoreListOfTypesTestCases: customIgnoresInTextTestCase[] = [
  {
    name: 'when no ignore type is provided, the text stays the same',
    text: dedent`
      Here is some text
      Here is some more text
    `,
    expectedTextAfterIgnore: dedent`
      Here is some text
      Here is some more text
    `,
    ignoreTypes: [],
  },
  { // accounts for https://github.com/platers/obsidian-linter/issues/733
    name: 'when no custom ignore ranges are used and multiple times, the text is properly replaced and put back together',
    text: dedent`
      content
      ${''}
      <!-- linter-disable -->
      ${''}
      $$
      abc
      $$
      ${''}
      <!-- linter-enable -->
      ${''}
      content
      ${''}
      <!-- linter-disable -->
      ${''}
      $$
      abc
      $$
      ${''}
      <!-- linter-enable -->
      ${''}
      content
    `,
    expectedTextAfterIgnore: dedent`
      content
      ${''}
      {CUSTOM_IGNORE_PLACEHOLDER}
      ${''}
      content
      ${''}
      {CUSTOM_IGNORE_PLACEHOLDER}
      ${''}
      content
    `,
    ignoreTypes: [IgnoreTypes.customIgnore],
  },
  {
    name: 'when no custom ignore ranges are used and multiple times, the text is properly replaced and put back together when Obsidian comment format used',
    text: dedent`
      content
      ${''}
      %% linter-disable %%
      ${''}
      $$
      abc
      $$
      ${''}
      %% linter-enable %%
      ${''}
      content
      ${''}
      %% linter-disable %%
      ${''}
      $$
      abc
      $$
      ${''}
      %% linter-enable %%
      ${''}
      content
    `,
    expectedTextAfterIgnore: dedent`
      content
      ${''}
      {CUSTOM_IGNORE_PLACEHOLDER}
      ${''}
      content
      ${''}
      {CUSTOM_IGNORE_PLACEHOLDER}
      ${''}
      content
    `,
    ignoreTypes: [IgnoreTypes.customIgnore],
  },
  {
    name: 'inline code ignore types are promoted to unique tokens',
    text: dedent`
      Before \`alpha\` and \`beta\`
    `,
    ignoreTypes: [IgnoreTypes.inlineCode],
    afterIgnoreAssert: (text: string) => {
      expect(text).toContain('{INLINE_CODE_BLOCK_PLACEHOLDER}_0');
      expect(text).toContain('{INLINE_CODE_BLOCK_PLACEHOLDER}_1');
      expect(text).not.toContain('`alpha`');
      expect(text).not.toContain('`beta`');
    },
  },
];

describe('Ignore List of Types', () => {
  for (const testCase of ignoreListOfTypesTestCases) {
    it(testCase.name, () => {
      const text = ignoreListOfTypes(testCase.ignoreTypes, testCase.text, (text: string) => {
        if (testCase.afterIgnoreAssert) {
          testCase.afterIgnoreAssert(text);
        } else {
          expect(text).toEqual(testCase.expectedTextAfterIgnore);
        }

        return text;
      } );

      expect(text).toEqual(testCase.text);
    });
  }
});
