import SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers from '../src/rules/space-between-chinese-japanese-or-korean-and-english-or-numbers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/303
      testName:
        'Make sure that spaces are added after a dollar sign if followed by Chinese characters',
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
        \`テスト_ＴＥＳＴ\`
        \`filepath = './ちしき_図書館.md'\`
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
        \`テスト_ＴＥＳＴ\`
        \`filepath = './ちしき_図書館.md'\`
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/407
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/583
      testName: 'Make sure that wiki link and markdown links are ignored in italics',
      before: dedent`
        *[[abs 接口]]*
        *[abs 接口](abs 接口.md)*
      `,
      after: dedent`
        *[[abs 接口]]*
        *[abs 接口](abs 接口.md)*
      `,
    },
    { // relates for https://github.com/platers/obsidian-linter/issues/583
      testName: 'Make sure that wiki link and markdown links are ignored in bold',
      before: dedent`
        **[[abs 接口]]**
        **[abs 接口](abs 接口.md)**
      `,
      after: dedent`
        **[[abs 接口]]**
        **[abs 接口](abs 接口.md)**
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/662
      testName: 'Make sure that html is ignored',
      before: dedent`
        <img src="中文small.png" />
      `,
      after: dedent`
        <img src="中文small.png" />
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/667
      testName: 'Make sure that html elements do not affect the surrounding text',
      before: dedent`
        <u>自己想说的</u>
      `,
      after: dedent`
        <u>自己想说的</u>
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/681
      testName: 'Make sure that wiki links with their size specified are unaffected',
      before: dedent`
        ![[流浪地球-1.webp|image title|600]]
      `,
      after: dedent`
        ![[流浪地球-1.webp|image title|600]]
      `,
    },
  ],
});
