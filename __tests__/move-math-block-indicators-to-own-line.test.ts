import MoveMathBlockIndicatorsToOwnLine from '../src/rules/move-math-block-indicators-to-own-line';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: MoveMathBlockIndicatorsToOwnLine,
  testCases: [
    {
      testName: 'Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2 and ending indicator is on the same line as the ending line of the content and there is content on the next line',
      before: dedent`
        $$
        \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}$$
        text here
      `,
      after: dedent`
        $$
        \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
        $$
        text here
      `,
    },
  ],
});
