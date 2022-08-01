import HeadingBlankLines from '../src/rules/heading-blank-lines';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: HeadingBlankLines,
  testCases: [
    {
      testName: 'Ignores codeblocks',
      before: dedent`
        ---
        front matter
        ---
        ${''}
        # H1
        \`\`\`
        # comment not header
        $$
        a = b
        $$
        \`\`\`
      `,
      after: dedent`
        ---
        front matter
        ---
        ${''}
        # H1
        ${''}
        \`\`\`
        # comment not header
        $$
        a = b
        $$
        \`\`\`
      `,
    },
    {
      testName: 'Ignores # not in headings',
      before: dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
      `,
      after: dedent`
        Not a header # .
        Line
        \`\`\`
        # comment not header
        a = b
        \`\`\`
        ~~~
        # comment not header
        ~~~
          # tabbed not header
            # space not header
      `,
    },
    {
      testName: 'Works normally',
      before: dedent`
        # H1
        ## H2
        Line
        ### H3
      `,
      after: dedent`
        # H1
        ${''}
        ## H2
        ${''}
        Line
        ${''}
        ### H3
      `,
    },
  ],
});
