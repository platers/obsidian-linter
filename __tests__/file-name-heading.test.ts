import FileNameHeading from '../src/rules/file-name-heading';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: FileNameHeading,
  testCases: [
    {
      testName: 'Handles stray dashes',
      before: dedent`
        Text 1
        ${''}
        ---
        ${''}
        Text 2
      `,
      after: dedent`
        # File Name
        Text 1
        ${''}
        ---
        ${''}
        Text 2
      `,
      options: {
        fileName: 'File Name',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/513
      testName: 'Inserts the heading on the line after the frontmatter of the file when it is the only thing in the file',
      before: dedent`
        ---
        hello: test
        ---
      `,
      after: dedent`
        ---
        hello: test
        ---
        # Test note
        ${''}
      `,
      options: {
        fileName: 'Test note',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1426
      testName: 'Escapes the markdown special characters in the file name',
      before: '',
      after: dedent`
        # Escape \\[\\_\\]
        ${''}
      `,
      options: {
        fileName: 'Escape [_]',
      },
    },
  ],
});
