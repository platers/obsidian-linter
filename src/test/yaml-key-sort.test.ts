import YamlKeySort from '../rules/yaml-key-sort';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: YamlKeySort,
  testCases: [
    {
      testName: 'When the sort changes the yaml contents and yaml timestamp date modified is active, update date modified value',
      before: dedent`
        ---
        language: Typescript
        type: programming
        tags: computer
        keywords: []
        status: WIP
        date: 01/15/2022
        modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
      `,
      after: dedent`
        ---
        date: 01/15/2022
        type: programming
        language: Typescript
        tags: computer
        keywords: []
        status: WIP
        modified: Thursday, January 2nd 2020, 12:00:00 am
        ---
      `,
      options: {
        yamlKeyPrioritySortOrder: [
          'date',
          'type',
          'language',
        ],
        dateModifiedKey: 'modified',
        currentTimeFormatted: 'Thursday, January 2nd 2020, 12:00:00 am',
        yamlTimestampDateModifiedEnabled: true,
      },
    },
  ],
});
