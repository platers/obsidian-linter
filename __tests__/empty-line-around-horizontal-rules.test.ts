import dedent from 'ts-dedent';
import EmptyLineAroundHorizontalRules from '../src/rules/empty-line-around-horizontal-rules';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: EmptyLineAroundHorizontalRules,
  testCases: [
    {
      testName:
      'Horizontal rules that start a document do get an empty line before them.',
      before: dedent`
        ***
        ${''}
        ${''}
        Content
      `,
      after: dedent`
        ***
        ${''}
        Content
      `,
    },
    {
      testName: 'Horizontal rules that end a document do not get an empty line after them.',
      before: dedent`
        ***
        Content
        ***
      `,
      after: dedent`
        ***
        ${''}
        Content
        ${''}
        ***
      `,
    },
    {
      testName: 'YAML frontmatter is not affected by this rule',
      before: dedent`
        ---
        prop: value
        ---
        ${''}
        Content
      `,
      after: dedent`
        ---
        prop: value
        ---
        ${''}
        Content
      `,
    },
    {
      testName: 'All types of horizontal rules are affected by this rule',
      before: dedent`
        - Content 1
        ***
        - Content 2
        ---
        - Content 3
        ___
        - Content 4
      `,
      after: dedent`
        - Content 1
        ${''}
        ***
        ${''}
        - Content 2
        ${''}
        ---
        ${''}
        - Content 3
        ${''}
        ___
        ${''}
        - Content 4
      `,
    },
    {
      testName: 'Paragraphs above `---` are treated as a heading and not spaced apart',
      before: dedent`
        Content
        ---
      `,
      after: dedent`
        Content
        ---
      `,
    },
    {
      testName: 'Horizontal rules between blockquotes',
      before: dedent`
        > Blockquote
        > > Nested Blockquote
        ---
        > Blockquote
        > > Nested Blockquote
      `,
      after: dedent`
        > Blockquote
        > > Nested Blockquote
        ${''}
        ---
        ${''}
        > Blockquote
        > > Nested Blockquote
      `,
    },
    {
      testName: 'Horizontal rules inside blockquotes',
      before: dedent`
        > Blockquote
        ---
        > > Nested Blockquote
        > Blockquote
        > > Nested Blockquote
      `,
      after: dedent`
        > Blockquote
        ${''}
        ---
        ${''}
        > > Nested Blockquote
        > Blockquote
        > > Nested Blockquote
      `,
    },
    {
      testName:
        'Make sure that basic dash horizontal rules have lines added around them',
      before: dedent`
        - asdf
        ---
        - qwer
      `,
      after: dedent`
        - asdf
        ${''}
        ---
        ${''}
        - qwer
      `,
    },
    {
      testName: 'Make sure that basic asterisk horizontal rules have lines added around them',
      before: dedent`
        asdf
        ***
        qwer
      `,
      after: dedent`
        asdf
        ${''}
        ***
        ${''}
        qwer
      `,
    },
    {
      testName: 'Make sure that basic underscore horizontal rules have lines added around them',
      before: dedent`
        asdf
        ___
        qwer
      `,
      after: dedent`
        asdf
        ${''}
        ___
        ${''}
        qwer
      `,
    },
    {
      testName: 'Make sure that horizontal rules for frontmatter don\'t have lines added around them',
      before: dedent`
        ---
        prop: value
        ---
        ${''}
        asdf
        ___
        qwer
      `,
      after: dedent`
        ---
        prop: value
        ---
        ${''}
        asdf
        ${''}
        ___
        ${''}
        qwer
      `,
    },
  ],
});
