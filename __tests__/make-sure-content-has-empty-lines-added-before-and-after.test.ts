import {makeSureContentHasEmptyLinesAddedBeforeAndAfter} from '../src/utils/strings';
import dedent from 'ts-dedent';

type EmptyStringBeforeAndAfterTestCase = {
  testName: string,
  isForBlockquote: boolean,
  startOfContent: number,
  endOfContent: number
  before: string,
  after: string,
}

const testCases: EmptyStringBeforeAndAfterTestCase[] = [
  {
    testName: 'Content with no empty line before or after it should have one added before and after',
    isForBlockquote: false,
    startOfContent: 9,
    endOfContent: 26,
    before: dedent`
      # Header
      Text content here
      ## Other Header
    `,
    after: dedent`
      # Header
      ${''}
      Text content here
      ${''}
      ## Other Header
    `,
  },
  {
    testName: 'Content with multiple empty lines before it should have one added before and after',
    isForBlockquote: false,
    startOfContent: 12,
    endOfContent: 29,
    before: dedent`
      # Header
      ${''}
      ${''}
      ${''}
      Text content here
      ${''}
      ## Other Header
    `,
    after: dedent`
      # Header
      ${''}
      Text content here
      ${''}
      ## Other Header
    `,
  },
  {
    testName: 'Content at the start of the file should not get an empty line added before it',
    isForBlockquote: false,
    startOfContent: 0,
    endOfContent: 17,
    before: dedent`
      Text content here
      ${''}
      ## Other Header
    `,
    after: dedent`
      Text content here
      ${''}
      ## Other Header
    `,
  },
  {
    testName: 'Content at the end of the file should not get an empty line added after it',
    isForBlockquote: false,
    startOfContent: 9,
    endOfContent: 26,
    before: dedent`
      # Header
      Text content here
    `,
    after: dedent`
      # Header
      ${''}
      Text content here
    `,
  },
  {
    testName: 'Content in blockquote has en empty line added before and after it',
    isForBlockquote: false,
    startOfContent: 11,
    endOfContent: 28,
    before: dedent`
      # Header
      > Text content here
      More unrelated content here
    `,
    after: dedent`
      # Header
      ${''}
      > Text content here
      ${''}
      More unrelated content here
    `,
  },
  {
    testName: 'Content in blockquote that is surrounded by more content in the same blockquote does not end the blockquote',
    isForBlockquote: false,
    startOfContent: 64,
    endOfContent: 81,
    before: dedent`
      # Header
      > Content prior to content to put empty lines around
      > Text content here
      > Content after content to put empty lines around
    `,
    after: dedent`
      # Header
      > Content prior to content to put empty lines around
      >
      > Text content here
      >
      > Content after content to put empty lines around
    `,
  },
];


describe('Make Sure Content Has Empty Lines Added Before and After', () => {
  for (const testCase of testCases) {
    it(testCase.testName, () => {
      console.log(testCase.testName, testCase.before.indexOf('Text content here'));
      expect(makeSureContentHasEmptyLinesAddedBeforeAndAfter(testCase.before, testCase.startOfContent, testCase.endOfContent, testCase.isForBlockquote)).toStrictEqual(testCase.after);
    });
  }
});
