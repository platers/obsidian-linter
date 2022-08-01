import SpaceBetweenChineseAndEnglishOrNumbers from '../src/rules/space-between-chinese-and-english-or-numbers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: SpaceBetweenChineseAndEnglishOrNumbers,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/303
      testName: 'Make sure that spaces are added after a dollar sign if followed by Chinese characters',
      before: dedent`
        这是一个数学公式$f(x)=x^2$这是一个数学公式
      `,
      after: dedent`
        这是一个数学公式 $f(x)=x^2$ 这是一个数学公式
      `,
    },
  ],
});
