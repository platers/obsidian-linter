import RemoveMultipleSpaces from '../src/rules/remove-multiple-spaces';
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
      testName: 'Callouts and blockquotes allow multiple spaces at start to allow for code and list item indentation',
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
        # List Item in Blockquote
        ${''}
        > Unordered List
        > - First Level
        > - First Level
        >   - Second Level
        >     - Third Level
        > - First Level
        ${''}
        # Code in Blockquote
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
        # List Item in Blockquote
        ${''}
        > Unordered List
        > - First Level
        > - First Level
        >   - Second Level
        >     - Third Level
        > - First Level
        ${''}
        # Code in Blockquote
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/558
      testName: 'Multiple spaces are not removed in a math block',
      before: dedent`
        $$
        x = \left \{ \begin{array}{ll}
                         y   & \mbox{if $y>0$}   \\
                         z+y & \mbox{otherwise}
                     \end{array}
            \right.
        $$
      `,
      after: dedent`
        $$
        x = \left \{ \begin{array}{ll}
                         y   & \mbox{if $y>0$}   \\
                         z+y & \mbox{otherwise}
                     \end{array}
            \right.
        $$
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/558
      testName: 'Multiple spaces are not removed in inline math',
      before: dedent`
        $ x =  2y $
      `,
      after: dedent`
        $ x =  2y $
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1203
      testName: 'A nested callout/blockquote should not have list item proceeding space removed',
      before: dedent`
        > [!goal]+ Two goals of object-oriented design
        >
        > > [!def]- Cohesion
        > > - How strongly related the parts are inside a class
        > > - About a class
        > > - A class is *cohesive* if the data and behaviour of these objects makes sense
        > > - **High cohesion**:
        > >     - A class does one job, and does it well
        > > - **Low cohesion**:
        > >     - Class has parts that do not relate to each other
        > > - e.g., \`Customer\` class might have \`getName\`, \`getAddress\`, but also \`sendEmail\` that sends an email to the customer → Weird; not a major responsibility of the customer → ==not cohesive
      `,
      after: dedent`
        > [!goal]+ Two goals of object-oriented design
        >
        > > [!def]- Cohesion
        > > - How strongly related the parts are inside a class
        > > - About a class
        > > - A class is *cohesive* if the data and behaviour of these objects makes sense
        > > - **High cohesion**:
        > >     - A class does one job, and does it well
        > > - **Low cohesion**:
        > >     - Class has parts that do not relate to each other
        > > - e.g., \`Customer\` class might have \`getName\`, \`getAddress\`, but also \`sendEmail\` that sends an email to the customer → Weird; not a major responsibility of the customer → ==not cohesive
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1203
      testName: 'Make sure that remove multiple spaces works when it comes right after a list with a sublist in it',
      before: dedent`
        - first item
             - xxxxxxxxxxxxxxxxxxxxxxxxx

        test    test
      `,
      after: dedent`
        - first item
             - xxxxxxxxxxxxxxxxxxxxxxxxx

        test test
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1346
      testName: 'Make sure that spaces within an embed are preserved',
      before: dedent`
        ![](<./a  b.md>)
      `,
      after: dedent`
        ![](<./a  b.md>)
      `,
    },
  ],
});

