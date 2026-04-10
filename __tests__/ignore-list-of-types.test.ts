import {IgnoreType, IgnoreTypes, ignoreListOfTypes} from '../src/utils/ignore-types';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedTextAfterIgnore?: string,
  ignoreTypes: IgnoreType[];
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
    ignoreTypes: [IgnoreTypes.customIgnore],
  },
];

describe('Ignore List of Types', () => {
  for (const testCase of ignoreListOfTypesTestCases) {
    it(testCase.name, () => {
      const text = ignoreListOfTypes(testCase.ignoreTypes, testCase.text, (text: string) => {
        if (testCase.expectedTextAfterIgnore !== undefined) {
          expect(text).toEqual(testCase.expectedTextAfterIgnore);
        } else {
          expect(text).not.toContain('$$\nabc\n$$');

          const ignoreTokens = text.match(/IGNORE_TOKEN_[a-z0-9]+_\d+/g);
          expect(ignoreTokens).toHaveLength(2);
          expect(new Set(ignoreTokens).size).toBe(2);
        }

        return text;
      } );

      expect(text).toEqual(testCase.text);
    });
  }
});
