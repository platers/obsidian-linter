import dedent from 'ts-dedent';
import EmptyLineAroundHorizontalRules from '../src/rules/empty-line-around-horizontal-rules';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: EmptyLineAroundHorizontalRules,
  testCases: [
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
