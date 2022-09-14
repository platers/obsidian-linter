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
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/378
      testName: 'Make sure that inline code blocks are not affected',
      before: dedent`
        \`test\`
        \`test_case\`
        \`test_case_here\`
        \`test*case\`
        \`test*case*here\`
        \`测试\`
        \`测试_一下\`
        \`测试_一下_吧\`
        \`测试-几个-才行\`
        \`测试*一下\`
        \`测试*一下*你们\`
        \`测试一下**你们**所有人\`
        \`测试this case\`
        \`测试_this_case\`
        \`this_测试-还*可以\`
        \`filepath = './知识_巴别图书馆.md'\`
      `,
      after: dedent`
        \`test\`
        \`test_case\`
        \`test_case_here\`
        \`test*case\`
        \`test*case*here\`
        \`测试\`
        \`测试_一下\`
        \`测试_一下_吧\`
        \`测试-几个-才行\`
        \`测试*一下\`
        \`测试*一下*你们\`
        \`测试一下**你们**所有人\`
        \`测试this case\`
        \`测试_this_case\`
        \`this_测试-还*可以\`
        \`filepath = './知识_巴别图书馆.md'\`
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/407
      testName: 'Make sure that inline math blocks are not affected',
      before: dedent`
        # Title Here

        $M0 = 现金$
      `,
      after: dedent`
        # Title Here

        $M0 = 现金$
      `,
    },
  ],
});
