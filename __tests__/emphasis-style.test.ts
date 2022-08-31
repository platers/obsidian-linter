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
  ],
});
