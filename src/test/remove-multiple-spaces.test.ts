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

        Paragraph contents are here  
        Second paragraph contents here  
      `,
      after: dedent`
        # Hello world

        Paragraph contents are here  
        Second paragraph contents here  
      `,
    },
    {
      testName: 'Make sure non-letter followed or preceeded by 2 spaces has them cut down to 1 space',
      before: dedent`
        # Hello world

        Paragraph contents  (something). Something else  .
      `,
      after: dedent`
        # Hello world

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

        | Column 1 | Column 2 | Column 3 |
        |----------|----------|----------|
        | foo      | bar      | blob     |
        | baz      | qux      | trust    |
        | quux     | quuz     | glob     |

        # Table 2

        | Column 1 | Column 2 |
        |----------|----------|
        | foo      | bar      |
        | baz      | qux      |
        | quux     | quuz     |

        New paragraph.
      `,
      after: dedent`
        # Table 1

        | Column 1 | Column 2 | Column 3 |
        |----------|----------|----------|
        | foo      | bar      | blob     |
        | baz      | qux      | trust    |
        | quux     | quuz     | glob     |

        # Table 2

        | Column 1 | Column 2 |
        |----------|----------|
        | foo      | bar      |
        | baz      | qux      |
        | quux     | quuz     |

        New paragraph.
      `,
    },
    {
      testName: 'Multiple spaces after ">" are still removed if not the start of a line',
      before: dedent`
        # Text with > with multiple spaces after it
          
        Text >  other text
      `,
      after: dedent`
        # Text with > with multiple spaces after it
          
        Text > other text
      `,
    },
  ],
});
