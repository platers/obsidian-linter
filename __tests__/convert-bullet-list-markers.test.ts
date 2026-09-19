import ConvertBulletListMarkers from '../src/rules/convert-bullet-list-markers';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: ConvertBulletListMarkers,
  testCases: [
    {
      testName: 'Leaves bullet markers inside fenced code alone',
      before: '```\n• item\n§ item\n```\n• outside',
      after: '```\n• item\n§ item\n```\n- outside',
    },
    {
      testName: 'Leaves bullet markers inside disabled sections alone',
      before: '<!-- linter-disable -->\n• item\n§ item\n<!-- linter-enable -->\n§ outside',
      after: '<!-- linter-disable -->\n• item\n§ item\n<!-- linter-enable -->\n- outside',
    },
    {
      testName: 'Leaves indented code alone and allows protected content after a bullet',
      before: ' \t•  [link](url)\n§ [[wiki]]',
      after: ' \t•  [link](url)\n- [[wiki]]',
    },
  ],
});
