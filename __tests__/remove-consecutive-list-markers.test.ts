import RemoveConsecutiveListMarkers from '../src/rules/remove-consecutive-list-markers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveConsecutiveListMarkers,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/1278
      testName: 'Make sure consecutive list markers are removed when dealing with non-latin characters',
      before: dedent`
        - - test content
        - - тест content
        - - 测试 content
      `,
      after: dedent`
        - test content
        - тест content
        - 测试 content
      `,
    },
  ],
});
