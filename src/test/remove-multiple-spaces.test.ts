import RemoveMultipleSpaces from '../rules/remove-multiple-spaces';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveMultipleSpaces,
  testCases: [
    {
      testName: 'Make sure spaces at the end of the line are ignored',
      before: dedent`
        # Hello world
        ${''}
        Paragraph contents are here  ${''}
        Second paragraph contents here  ${''}
      `,
      after: dedent`
        # Hello world
        ${''}
        Paragraph contents are here  ${''}
        Second paragraph contents here  ${''}
      `,
    },
    {
      testName: 'Make sure spaces at the start of the line are ignored',
      before: dedent`
        Paragraph contents are here
        Second paragraph here...
        ${''}
      `,
      after: dedent`
        Paragraph contents are here
        Second paragraph here...
        ${''}
      `,
    },
    {
      testName: 'Make sure non-letter followed or preceeded by 2 spaces has them cut down to 1 space',
      before: dedent`
        # Hello world
        ${''}
        Paragraph contents  (something). Something else  .
      `,
      after: dedent`
        # Hello world
        ${''}
        Paragraph contents (something). Something else .
      `,
    },
    {
      testName: 'Links followed by parentheses do not prevent other removal of multiple spaces in a row',
      before: dedent`
        [Link text](path/fileName.md) (2 spaces in between  text)
      `,
      after: dedent`
        [Link text](path/fileName.md) (2 spaces in between text)
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/244
      testName: 'Tables are ignored',
      before: dedent`
        # Table 1
        ${''}
        | Column 1 | Column 2 | Column 3 |
        |----------|----------|----------|
        | foo      | bar      | blob     |
        | baz      | qux      | trust    |
        | quux     | quuz     | glob     |
        ${''}
        # Table 2
        ${''}
        | Column 1 | Column 2 |
        |----------|----------|
        | foo      | bar      |
        | baz      | qux      |
        | quux     | quuz     |
        ${''}
        New paragraph.
      `,
      after: dedent`
        # Table 1
        ${''}
        | Column 1 | Column 2 | Column 3 |
        |----------|----------|----------|
        | foo      | bar      | blob     |
        | baz      | qux      | trust    |
        | quux     | quuz     | glob     |
        ${''}
        # Table 2
        ${''}
        | Column 1 | Column 2 |
        |----------|----------|
        | foo      | bar      |
        | baz      | qux      |
        | quux     | quuz     |
        ${''}
        New paragraph.
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/289
      testName: 'Callouts and block quotes allow multiple spaces at start to allow for code and list item indentation',
      before: dedent`
        # List Item in Callout
        ${''}
        > [!info] Unordered List
        > - First Level
        > - First Level
        >   - Second Level
        >     - Third Level
        > - First Level
        ${''}
        # Code in Callout
        ${''}
        > [!info] Code
        >     Line 1
        >     Line 2
        >     Line 3
        ${''}
        # List Item in Block Quote
        ${''}
        > Unordered List
        > - First Level
        > - First Level
        >   - Second Level
        >     - Third Level
        > - First Level
        ${''}
        # Code in Block Quote
        ${''}
        > Code
        >     Line 1
        >     Line 2
        >     Line 3
      `,
      after: dedent`
        # List Item in Callout
        ${''}
        > [!info] Unordered List
        > - First Level
        > - First Level
        >   - Second Level
        >     - Third Level
        > - First Level
        ${''}
        # Code in Callout
        ${''}
        > [!info] Code
        >     Line 1
        >     Line 2
        >     Line 3
        ${''}
        # List Item in Block Quote
        ${''}
        > Unordered List
        > - First Level
        > - First Level
        >   - Second Level
        >     - Third Level
        > - First Level
        ${''}
        # Code in Block Quote
        ${''}
        > Code
        >     Line 1
        >     Line 2
        >     Line 3
      `,
    },
    {
      testName: 'Multiple spaces after ">" are still removed if not the start of a line',
      before: dedent`
        # Text with > with multiple spaces after it
        ${''}
        Text >  other text
      `,
      after: dedent`
        # Text with > with multiple spaces after it
        ${''}
        Text > other text
      `,
    },
  ],
});
