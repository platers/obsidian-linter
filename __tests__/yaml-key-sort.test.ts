import YamlKeySort from '../src/rules/yaml-key-sort';
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/415
      testName: 'Sort works with dictionary Yaml value',
      before: dedent`
        ---
        test_key: "Hello"
        dictionary:
          abc: "abc"
          def: "def"
        tags: 
          - Test
        ---
      `,
      after: dedent`
        ---
        dictionary:
          abc: "abc"
          def: "def"
        tags:
          - Test
        test_key: "Hello"
        ---
      `,
      options: {
        yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
      },
    },
  ],
});
