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
    { // accounts for https://github.com/platers/obsidian-linter/issues/813
      testName: 'Math indicators that are malformed with content between them should be properly formatted without messing up the content of the other math blocks',
      before: dedent`
        $$
        \\sqrt{(x_1-x_2)^2+(y_1-y_2)^2+\cdots+(n_1-n_2)^2}$$
        - here is some text
        $$
        \\begin{aligned}
        \\frac{n*(n+1)}{2}=\\frac{1000*1001}{2}=500500
        \\end{aligned}
        $$
        text
      `,
      after: dedent`
        $$
        \\sqrt{(x_1-x_2)^2+(y_1-y_2)^2+\cdots+(n_1-n_2)^2}
        $$
        - here is some text
        $$
        \\begin{aligned}
        \\frac{n*(n+1)}{2}=\\frac{1000*1001}{2}=500500
        \\end{aligned}
        $$
        text
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/996
      testName: 'Math indicators with content before them should not have that content duplicated unless it is a blockquote',
      before: dedent`
        a $$b$$
      `,
      after: dedent`
        a
        $$
        b
        $$
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/996
      testName: 'Math indicators with content before them should have the opening indicator moved to a new line and have any tabs and spaces that were between the content and the opening indicators removed.',
      before: dedent`
        a \t    $$b$$
      `,
      after: dedent`
        a
        $$
        b
        $$
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/996
      testName: 'Math indicators in a blockquote/callout with content before them should have the opening indicator moved to a new line and have any tabs and spaces that were between the content and the opening indicators removed.',
      before: dedent`
        > a \t    $$b$$
      `,
      after: dedent`
        > a
        > $$
        > b
        > $$
      `,
    },
  ],
});
