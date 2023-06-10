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
      testName: 'Blank line between heading and table',
      before: dedent`
        # H1
        | a | b |

        # H1

        | a | b |


        # H1


        | a | b |
      `,
      after: dedent`
        # H1

        | a | b |

        # H1

        | a | b |

        # H1

        | a | b |
      `,
      options: {
        bottom: false, // this bug only affects bottom false
        emptyLineAfterYaml: true,
      },
    },
  ],
});
