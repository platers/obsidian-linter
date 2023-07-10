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
    { // accounts for https://github.com/platers/obsidian-linter/issues/560
      testName: 'Moving math block indicator to its own line when in a blockquote moves the content to lines with a blockquote indicator at their start for inline math',
      before: dedent`
        > $$math$$
      `,
      after: dedent`
        > $$
        > math
        > $$
      `,
    },
    {
      testName: 'Moving math block indicator to its own line when in a blockquote moves the content to lines with a blockquote indicator at their start for math block',
      before: dedent`
        > $$
        > \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}$$
        text here
      `,
      after: dedent`
        > $$
        > \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
        > $$
        text here
      `,
    },
    { // accounts for an issue noticed when looking at https://github.com/platers/obsidian-linter/issues/597
      testName: 'Math block in blockquote/callout should not get an empty blockquote line added',
      before: dedent`
        > [!note]
        > $$
        > \\frac{1}{2}
        > $$
      `,
      after: dedent`
        > [!note]
        > $$
        > \\frac{1}{2}
        > $$
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/783
      testName: 'Math indicators greater than or equal to the the starting indicator lead to a splitting of the math block if the number of qualifying math blocks is greater than 3',
      before: dedent`
        $$a$$
        ${''}
        $$
        b$$
        ${''}
        $$c
        $$
      `,
      after: dedent`
        $$
        a
        $$
        ${''}
        $$
        b
        $$
        ${''}
        $$
        c
        $$
      `,
    },
  ],
});
