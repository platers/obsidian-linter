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
    { // accounts for https://github.com/platers/obsidian-linter/issues/1319
      testName: 'Make sure that empty lines around math blocks handles an empty line prior to the math block that is nested one blockquote level more than the math block is',
      before: dedent`
        > AAA
        >
        > > **BBB:**
        > >
        > > - CCC
        > > 
        > $$
        > Some math here
        > $$
      `,
      after: dedent`
        > AAA
        >
        > > **BBB:**
        > >
        > > - CCC
        > >
        > $$
        > Some math here
        > $$
      `
    },
    {
      testName: 'Make sure that empty lines around math blocks handles an empty line after the math block that is nested one blockquote level more than the math block is',
      before: dedent`
        > AAA
        >
        > $$
        > Some math here
        > $$
        > > **BBB:**
        > >
        > > - CCC
      `,
      after: dedent`
        > AAA
        >
        > $$
        > Some math here
        > $$
        >
        > > **BBB:**
        > >
        > > - CCC
      `
    },
  ],
});
