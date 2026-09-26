import OrderedListStyle from '../src/rules/ordered-list-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {OrderListItemEndOfIndicatorStyles, OrderListItemStyles, UnorderedListItemStyles} from '../src/utils/mdast';
import UnorderedListStyle from '../src/rules/unordered-list-style';

ruleTest({
  RuleBuilderClass: OrderedListStyle,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/422
      testName: 'Make sure more advanced nesting correctly updates ordered list items',
      before: dedent`
        1. Element 1
          1. Sub element 1
          2. Sub element 2
            1. [ ] Other element 1
              1. [ ] Yet another element 1
            3. [ ] XXX
        2. Element 2
          1. Another sub list
          2. other text
            1. XXX
              1. XXX
            1. XXX
            1. XXX
            1. more text
          1. yet
          2. again
            1. maybe
              1. yesterday
            1. today
            1. tomorrow
        3. What about now?
          1. Do you see me?
          2. No?
            1. Maybe
              1. What if I do?
            1. XXX
            1. XXX
            2. I believe I can fly
      `,
      after: dedent`
        1. Element 1
          1. Sub element 1
          2. Sub element 2
            1. [ ] Other element 1
              1. [ ] Yet another element 1
            2. [ ] XXX
        2. Element 2
          1. Another sub list
          2. other text
            1. XXX
              1. XXX
            2. XXX
            3. XXX
            4. more text
          3. yet
          4. again
            1. maybe
              1. yesterday
            2. today
            3. tomorrow
        3. What about now?
          1. Do you see me?
          2. No?
            1. Maybe
              1. What if I do?
            2. XXX
            3. XXX
            4. I believe I can fly
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/422
      testName: 'Make sure more advanced nesting correctly updates ordered list items with Chinese characters',
      before: dedent`
        1. 项目 A
          1. 类别一
          2. 类别二
            1. [ ] XXX
              1. [ ] XXX
            3. [ ] XXX
        2. 项目 B
            1. 类别一
            2. 类别二
              1. XXX
                1. XXX
              1. XXX
              1. XXX
          1. 发几封积分积分
            1. 类别一
            2. 类别二
              1. XXX
                1. XXX
              1. XXX
              1. XXX
        3. 发几封积分积分3. 项目 B
            1. 类别一
            2. 类别二
              1. XXX
                1. XXX
              1. XXX
              1. XXX
          2. 发几封积分积分
      `,
      after: dedent`
        1. 项目 A
          1. 类别一
          2. 类别二
            1. [ ] XXX
              1. [ ] XXX
            2. [ ] XXX
        2. 项目 B
            1. 类别一
            2. 类别二
              1. XXX
                1. XXX
              2. XXX
              3. XXX
          1. 发几封积分积分
            1. 类别一
            2. 类别二
              1. XXX
                1. XXX
              2. XXX
              3. XXX
        3. 发几封积分积分3. 项目 B
            1. 类别一
            2. 类别二
              1. XXX
                1. XXX
              2. XXX
              3. XXX
          1. 发几封积分积分
      `,
    },
    {
      testName: 'Make sure that tabs in lists with sublists still works correctly',
      before: dedent`
        1. Entry 1
        \t1. Sub 1
        \t\t\t1. Sub2 1
        \t1. Sub 2
        1. Entry 2
          1. Sub3 1
        \t1. Sub3 2
        1. Entry 3
      `,
      after: dedent`
        1. Entry 1
        \t1. Sub 1
        \t\t\t1. Sub2 1
        \t2. Sub 2
        2. Entry 2
          1. Sub3 1
        \t2. Sub3 2
        3. Entry 3
      `,
    },
    {
      testName: 'Make sure indentation levels are calculated correctly for blockquotes',
      before: dedent`
        > 1. Entry 1
        >  1. Entry 2
        >   1. Sub1 1
      `,
      after: dedent`
        > 1. Entry 1
        >  2. Entry 2
        >   1. Sub1 1
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/631
      testName: 'Ordered list item levels should be reset when a non-ordered item is encountered',
      before: dedent`
        - a
          1. b
          1. b
        - c
        - c
          1. d
          1. d
      `,
      after: dedent`
        - a
          1. b
          2. b
        - c
        - c
          1. d
          2. d
      `,
    },
    {
      testName: 'Parenthesis-terminated indicators keep their numbers when preserve start is enabled',
      options: {preserveStart: true},
      before: dedent`
        1) Item 1
        1) Item 2
        1) Item 3
      `,
      after: dedent`
        1. Item 1
        2. Item 2
        3. Item 3
      `,
    },
    {
      testName: 'Parenthesis-terminated indicators keep their numbers when number style is preserve',
      options: {numberStyle: OrderListItemStyles.Preserve},
      before: dedent`
        3) Item 3
        4) Item 4
      `,
      after: dedent`
        3. Item 3
        4. Item 4
      `,
    },
  ],
});

describe('list indicator protected-range compatibility', () => {
  const separatedByCustomIgnore = '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n1. after';
  const numberOptions = Object.values(OrderListItemStyles).flatMap((numberStyle) => {
    return Object.values(OrderListItemEndOfIndicatorStyles).flatMap((listEndStyle) => {
      return [false, true].map((preserveStart) => ({numberStyle, listEndStyle, preserveStart}));
    });
  });

  it.each(numberOptions)('preserves separate source lists for $numberStyle/$listEndStyle, preserveStart=$preserveStart', (options) => {
    // Masking joined these lists because its placeholder was absorbed as lazy continuation.
    // The real tree keeps them separate, so numbering now restarts after linter-disable sections.
    const expected = `1${options.listEndStyle} first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n1${options.listEndStyle} after`;
    expect(OrderedListStyle.getRule().apply(separatedByCustomIgnore, options)).toBe(expected);
  });

  it('renumbers a list enclosing code without counting or changing indicators inside the code', () => {
    const text = '1. outer\n   ```\n   90. code\n   - code\n   ```\n8. after';
    expect(OrderedListStyle.getRule().apply(text)).toBe('1. outer\n   ```\n   90. code\n   - code\n   ```\n2. after');
  });

  it('uses the first unprotected non-checklist bullet for consistent style', () => {
    const prefix = '<!-- linter-disable -->\n+ ignored\n<!-- linter-enable -->\n\n1. ordered\n\n- [ ] task\n\n';
    expect(UnorderedListStyle.getRule().apply(prefix + '* first\n- last')).toBe(prefix + '* first\n* last');
  });

  it('changes an unordered marker while preserving its protected contents', () => {
    const text = '- outer\n  ```\n  - code\n  ```\n- after';
    expect(UnorderedListStyle.getRule().apply(text, {listStyle: UnorderedListItemStyles.Plus})).toBe('+ outer\n  ```\n  - code\n  ```\n+ after');
  });

  it.each([
    {
      name: 'a protected gap without blank lines',
      before: '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n1. after',
      after: '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n1. after',
    },
    {
      name: 'a blank line before the protected section',
      before: '1. first\n\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n1. after',
      after: '1. first\n\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n1. after',
    },
    {
      name: 'a blank line after the protected section',
      before: '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n\n1. after',
      after: '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n\n1. after',
    },
    {
      name: 'two protected sections separated by a blank line',
      before: '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n\n<!-- linter-disable -->\n8. hidden\n<!-- linter-enable -->\n1. after',
      after: '1. first\n<!-- linter-disable -->\n9. hidden\n<!-- linter-enable -->\n\n<!-- linter-disable -->\n8. hidden\n<!-- linter-enable -->\n1. after',
    },
    {
      name: 'an unindented fenced code block between items',
      before: '1. first\n```\n9. hidden\n```\n1. after',
      after: '1. first\n```\n9. hidden\n```\n1. after',
    },
    {
      name: 'an indented code block inside a list item',
      before: '1. first\n\n       9. hidden\n\n1. after',
      after: '1. first\n\n       9. hidden\n\n2. after',
    },
    {
      name: 'a protected gap between different ordered delimiter styles',
      before: '1. first\n```\n9. hidden\n```\n1) after',
      after: '1. first\n```\n9. hidden\n```\n1. after',
    },
  ])('keeps natural list grouping for $name', ({before, after}) => {
    expect(OrderedListStyle.getRule().apply(before)).toBe(after);
  });
});
