import EmphasisStyle from '../src/rules/emphasis-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: EmphasisStyle,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/380
      testName: 'Make sure inline math is unaffected',
      before: dedent`
        - $m_{pq} = \int^{\infty}_{-\infty}\int^{\infty}_{-\infty} x^p y^q f(x,y) dxdy$
      `,
      after: dedent`
        - $m_{pq} = \int^{\infty}_{-\infty}\int^{\infty}_{-\infty} x^p y^q f(x,y) dxdy$
      `,
      options: {style: 'asterisk'},
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/1503
      // Math blocks with underscores inside should not be converted to emphasis
      testName: 'Make sure math blocks are unaffected',
      before: dedent`
        adafsd$$
        \begin{align}
        \text{asfsss}_{}{d_{a}}
        \end{align}
        $$
      `,
      after: dedent`
        adafsd$$
        \begin{align}
        \text{asfsss}_{}{d_{a}}
        \end{align}
        $$
      `,
      options: {style: 'asterisk'},
    },
    {
      testName: 'Make sure multiline math block with align environment is unaffected',
      before: dedent`
        $$
        \begin{align}
        x_{test} &= some_long_equation \\
        y_{other} &= another_equation
        \end{align}
        $$
      `,
      after: dedent`
        $$
        \begin{align}
        x_{test} &= some_long_equation \\
        y_{other} &= another_equation
        \end{align}
        $$
      `,
      options: {style: 'asterisk'},
    },
  ],
});
