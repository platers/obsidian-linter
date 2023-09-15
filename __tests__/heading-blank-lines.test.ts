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
    { // accounts for https://github.com/platers/obsidian-linter/issues/501
      testName: 'Make sure a tag after a header still only has 1 blank line when bottom is set to true',
      before: dedent`
        ## diary

        #study
        blah blah blah

        #life
        blah blah blah
      `,
      after: dedent`
        ## diary

        #study
        blah blah blah

        #life
        blah blah blah
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/751
      testName: 'Make sure that blank lines after a heading are left alone when `bottom = false`',
      before: dedent`
        ## diary
        ${''}
        ${''}
        Content here
        ## entry 2
        blah blah blah
      `,
      after: dedent`
        ## diary
        ${''}
        ${''}
        Content here
        ${''}
        ## entry 2
        blah blah blah
      `,
      options: {
        bottom: false,
        emptyLineAfterYaml: false,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/773
      testName: 'Make sure that blank lines are not added when there is no content between 2 headings when `bottom = false`',
      before: dedent`
        # Heading 1
        ## Heading 2
      `,
      after: dedent`
        # Heading 1
        ## Heading 2
      `,
      options: {
        bottom: false,
        emptyLineAfterYaml: false,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/773
      testName: 'Make sure that blank lines are not changed when there is no content between 2 headings when `bottom = false`',
      before: dedent`
        # Heading 1
        ${''}
        ${''}
        ## Heading 2
      `,
      after: dedent`
        # Heading 1
        ${''}
        ${''}
        ## Heading 2
      `,
      options: {
        bottom: false,
        emptyLineAfterYaml: false,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/773
      testName: 'Make sure that blank lines are not added when there is already a blank line between headings `bottom = false`',
      before: dedent`
        ## foobar
        ### Hello World
        ${''}
        ### Hello two
      `,
      after: dedent`
        ## foobar
        ### Hello World
        ${''}
        ### Hello two
      `,
      options: {
        bottom: false,
        emptyLineAfterYaml: false,
      },
    },
  ],
});
