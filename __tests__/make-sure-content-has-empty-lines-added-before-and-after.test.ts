import {makeSureContentHasEmptyLinesAddedBeforeAndAfter} from '../src/utils/strings';
import dedent from 'ts-dedent';

type EmptyStringBeforeAndAfterTestCase = {
  testName: string,
  startOfContent: number,
  endOfContent: number
  before: string,
  after: string,
}

const testCases: EmptyStringBeforeAndAfterTestCase[] = [
  {
    testName: 'Content with no empty line before or after it should have one added before and after',
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
  {
    testName: 'A table in a blockquote or callout should have a blank line added before and after the table',
    startOfContent: 24, // start of the table header: "|"
    endOfContent: 206, // end of the table "\n"
    before: dedent`
      > Table in blockquote
      > | Column 1 | Column 2 | Column 3 |
      > |----------|----------|----------|
      > | foo      | bar      | blob     |
      > | baz      | qux      | trust    |
      > | quux     | quuz     | glob     |
      ${''}
      More content here
    `,
    after: dedent`
      > Table in blockquote
      >
      > | Column 1 | Column 2 | Column 3 |
      > |----------|----------|----------|
      > | foo      | bar      | blob     |
      > | baz      | qux      | trust    |
      > | quux     | quuz     | glob     |
      ${''}
      More content here
    `,
  },
  {
    testName: 'A table in a nested blockquote or callout should have a blank line added before and after the table',
    startOfContent: 59, // start of the table header: "|"
    endOfContent: 249, // end of the table "\n"
    before: dedent`
      More content here
      ${''}
      > Table doubly nested in blockquote
      > > | Column 1 | Column 2 | Column 3 |
      > > |----------|----------|----------|
      > > | foo      | bar      | blob     |
      > > | baz      | qux      | trust    |
      > > | quux     | quuz     | glob     |
      More content here
    `,
    after: dedent`
      More content here
      ${''}
      > Table doubly nested in blockquote
      >
      > > | Column 1 | Column 2 | Column 3 |
      > > |----------|----------|----------|
      > > | foo      | bar      | blob     |
      > > | baz      | qux      | trust    |
      > > | quux     | quuz     | glob     |
      ${''}
      More content here
    `,
  },
  {
    startOfContent: 124, // start of the 2nd code block: "`"
    endOfContent: 175, // end of the 2nd code block: "\n"
    testName: 'Fenced code blocks that are in a blockquote have the proper empty line added',
    before: dedent`
      # Make sure that code blocks in blockquotes are accounted for correctly
      > \`\`\`js
      > var text = 'this is some text';
      > \`\`\`
      >
      > \`\`\`js
      > var other text = 'this is more text';
      > \`\`\`
      ${''}
      **Note that the blanks blockquote lines added do not have whitespace after them**
      ${''}
      # Doubly nested code block
      ${''}
      > > \`\`\`js
      > > var other text = 'this is more text';
      > > \`\`\`
    `,
    after: dedent`
      # Make sure that code blocks in blockquotes are accounted for correctly
      > \`\`\`js
      > var text = 'this is some text';
      > \`\`\`
      >
      > \`\`\`js
      > var other text = 'this is more text';
      > \`\`\`
      ${''}
      **Note that the blanks blockquote lines added do not have whitespace after them**
      ${''}
      # Doubly nested code block
      ${''}
      > > \`\`\`js
      > > var other text = 'this is more text';
      > > \`\`\`
    `,
  },
];


describe('Make Sure Content Has Empty Lines Added Before and After', () => {
  for (const testCase of testCases) {
    it(testCase.testName, () => {
      // console.log(testCase.testName, testCase.before.indexOf('Text content here')); // helpful for adding new tests
      expect(makeSureContentHasEmptyLinesAddedBeforeAndAfter(testCase.before, testCase.startOfContent, testCase.endOfContent)).toStrictEqual(testCase.after);
    });
  }
});
