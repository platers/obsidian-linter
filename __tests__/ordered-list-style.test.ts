import OrderedListStyle from '../src/rules/ordered-list-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

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
  ],
});
