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
      <!-- linter-ignore-end -->
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'a simple example of a start and end custom ignore indicator results in the proper start and end positions for the ignore section',
    text: dedent`
      Here is some text
      <!-- linter-ignore-start -->
      This content will be ignored
      So any format put here gets to stay as is
      <!-- linter-ignore-end -->
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 144}],
  },
  {
    name: 'when a custom ignore start indicator is not followed by a custom ignore end indicator in the text, the end is considered to be the end of the text',
    text: dedent`
      Here is some text
      <!-- linter-ignore-start -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 134}],
  },
  {
    name: 'when a custom ignore start indicator shows up midline, it ignores the part in question',
    text: dedent`
      Here is some text<!-- linter-ignore-start -->here is some ignored text<!-- linter-ignore-end -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 96}],
  },
  {
    name: 'when a custom ignore start indicator does not follow the exact syntax, it is not counted as existing',
    text: dedent`
      Here is some text<!-- linter-ignore-start-->here is some ignored text<!-- linter-ignore-end -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'multiple matches can be returned',
    text: dedent`
      Here is some text<!-- linter-ignore-start -->here is some ignored text<!-- linter-ignore-end -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
      ${''}
      <!-- linter-ignore-start -->
      We want to ignore the following as we want to preserve its format
        -> level 1
          -> level 1.3
        -> level 2
      Finish
    `,
    expectedCustomIgnoresInText: 2,
    expectedPositions: [{startIndex: 17, endIndex: 96}, {startIndex: 187, endIndex: 330}],
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
