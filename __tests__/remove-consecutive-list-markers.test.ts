import RemoveConsecutiveListMarkers from '../src/rules/remove-consecutive-list-markers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveConsecutiveListMarkers,
  testCases: [
    {
      testName: 'Leaves consecutive markers inside fenced code alone',
      before: '```\n- - item\n```\n- - outside',
      after: '```\n- - item\n```\n- outside',
    },
    {
      testName: 'Leaves consecutive markers inside disabled sections alone',
      before: '<!-- linter-disable -->\n- - item\n<!-- linter-enable -->\n- - outside',
      after: '<!-- linter-disable -->\n- - item\n<!-- linter-enable -->\n- outside',
    },
    {
      testName: 'Does not treat a protected link as the letter anchor',
      before: '- - [letter](url)\n- - [[letter]]',
      after: '- - [letter](url)\n- - [[letter]]',
    },
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
