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
    expectedPositions: [{startIndex: 178, endIndex: 316}, {startIndex: 17, endIndex: 87}],
  },
  { // relates to https://github.com/platers/obsidian-linter/issues/733
    name: 'multiple matches can be returned',
    text: dedent`
      content
      ${''}
      <!-- linter-disable -->
      ${''}
      $$
      abc
      $$
      {#eq:a}
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
      {#eq:b}
      ${''}
      <!-- linter-enable -->
      ${''}
      content
    `,
    expectedCustomIgnoresInText: 2,
    expectedPositions: [{startIndex: 86, endIndex: 152}, {startIndex: 9, endIndex: 75}],
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
