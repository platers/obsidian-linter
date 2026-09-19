import HeadingBlankLines from '../src/rules/heading-blank-lines';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: HeadingBlankLines,
  testCases: [
    {
      testName: 'Leaves heading spacing inside fenced code alone',
      before: '```\n# inside\ntext\n```',
      after: '```\n# inside\ntext\n```',
    },
    {
      testName: 'Leaves heading spacing inside disabled sections alone',
      before: '<!-- linter-disable -->\n# inside\ntext\n<!-- linter-enable -->',
      after: '<!-- linter-disable -->\n# inside\ntext\n<!-- linter-enable -->',
    },
    {
      testName: 'Preserves heading adjacency across a multiline disabled section',
      before: '# <!-- linter-disable -->\n<!-- linter-enable -->\n# h',
      after: '# <!-- linter-disable -->\n<!-- linter-enable -->\n# h',
      options: {bottom: false, emptyLineAfterYaml: true},
    },
    {
      testName: 'Maps blank lines around a heading containing a multiline disabled section',
      before: 'text\n# <!-- linter-disable -->\n<!-- linter-enable -->\n# h\ntext',
      after: 'text\n\n# <!-- linter-disable -->\n<!-- linter-enable -->\n\n# h\n\ntext',
    },
    {
      testName: 'Maps YAML spacing and adjacent heading edits without overlapping',
      before: '---\nkey: value\n---\n\n\n# first\n# second\n```\n# inside\n```\n# last\n\n',
      after: '---\nkey: value\n---\n# first\n\n# second\n\n```\n# inside\n```\n\n# last',
      options: {bottom: true, emptyLineAfterYaml: false},
    },
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/993
      testName: 'Make sure that headings proceeded by a line with a hashtag get a blank line added when `Bottom=false`.',
      before: dedent`
        # Heading 1
        Lorem ipsum.
        ${''}
        ## Heading 2
        Woah, cool text here. #reallycool
        ## Heading 3
      `,
      after: dedent`
        # Heading 1
        Lorem ipsum.
        ${''}
        ## Heading 2
        Woah, cool text here. #reallycool
        ${''}
        ## Heading 3
      `,
      options: {
        bottom: false,
        emptyLineAfterYaml: false,
      },
    },
  ],
});
