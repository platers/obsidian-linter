import dedent from 'ts-dedent';
import { ruleTest } from './common';
import EmptyLineAroundMathBlock from '../src/rules/empty-line-around-math-block';

ruleTest({
  RuleBuilderClass: EmptyLineAroundMathBlock,
  testCases: [
    {
      testName: 'When the next line after a math block in a blockquote is a callout, it should retain its current level instead of breaking callouts by adding a blank blocquote line before it',
      before: dedent`
        > [!Example]+
        > Some math equations:
        >${' '}
        > $$ a + b = c $$
        >
        > > [!Note]
        > > Text under nested callout.
      `,
      after: dedent`
        > [!Example]+
        > Some math equations:
        >
        > $$ a + b = c $$
        >
        > > [!Note]
        > > Text under nested callout.
      `,
    },
  ],
});
