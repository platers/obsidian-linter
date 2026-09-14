import StrongStyle from '../src/rules/strong-style';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: StrongStyle,
  testCases: [
    {
      testName: 'nested strong keeps disjoint delimiters under asterisk style',
      before: '**)**g****',
      after: '**)**g****',
      options: {style: 'asterisk'},
    },
    {
      testName: 'nested strong converts both delimiter pairs under underscore style',
      before: '**)**g****',
      after: '__)__g____',
      options: {style: 'underscore'},
    },
  ],
});
