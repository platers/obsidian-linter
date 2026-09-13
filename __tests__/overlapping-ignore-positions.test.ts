import SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers from '../src/rules/space-between-chinese-japanese-or-korean-and-english-or-numbers';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers,
  testCases: [
    { // accounts for the text duplication reported when emphasis positions overlap
      testName: 'overlapping emphasis is left alone instead of being duplicated',
      before: '*)*g**',
      after: '*)*g**',
    },
    {
      testName: 'emphasis containing parentheses is not duplicated',
      before: 'maps hardware devices from your host system*(the physical computer you are installing this program onto)* into the container',
      after: 'maps hardware devices from your host system*(the physical computer you are installing this program onto)* into the container',
    },
    {
      testName: 'spacing is still added between CJK and english',
      before: '中文English',
      after: '中文 English',
    },
    {
      testName: 'spacing is still added inside emphasis',
      before: '*中文English*',
      after: '*中文 English*',
    },
    {
      testName: 'spacing is still added inside strong',
      before: '**中文English**',
      after: '**中文 English**',
    },
  ],
});
