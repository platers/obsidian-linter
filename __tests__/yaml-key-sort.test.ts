import YamlKeySort from '../src/rules/yaml-key-sort';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: YamlKeySort,
  testCases: [
    {
      testName: 'When the sort changes the YAML contents and YAML timestamp date modified is active, update date modified value',
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
      testName: 'Sort works with dictionary YAML value',
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/796
      testName: 'Sort works when priority keys end in a colon',
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
          'date:',
          'type:',
          'language:',
        ],
        dateModifiedKey: 'modified',
        currentTimeFormatted: 'Thursday, January 2nd 2020, 12:00:00 am',
        yamlTimestampDateModifiedEnabled: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/899
      testName: 'Make sure that nested values are left alone when sorting priority sort values with the same key name as a nested key',
      before: dedent`
        ---
        foo:
          type: bar
        ---
      `,
      after: dedent`
        ---
        foo:
          type: bar
        ---
      `,
      options: {
        yamlKeyPrioritySortOrder: [
          'type:',
        ],
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/899
      testName: 'Make sure that nested values are left alone when sorting priority sort values with the same key name as a nested key even when there is non-nested key with the same name',
      before: dedent`
        ---
        foo:
          type: bar
        type: cat
        ---
      `,
      after: dedent`
        ---
        type: cat
        foo:
          type: bar
        ---
      `,
      options: {
        yamlKeyPrioritySortOrder: [
          'type:',
        ],
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1202
      testName: 'Make sure that settings that end in whitespace have them trimmed so they are properly recognized',
      before: dedent`
        ---
        stakeholders:${' '}
        pr-type:${' '}
        date-created: Thursday, August 22nd 2024, 6:41:04 pm
        pr-pipeline-stage:${' '}
        pr-priority:${' '}
        modified: Tuesday, October 22nd 2024, 10:58:16 am
        pr-size:${' '}
        pr-urgency:${' '}
        pr-okr:${' '}
        pr-due-date:${' '}
        pr-completed-date:${' '}
        template: "[[Pro New Project Outcome Template]]"
        related-companies:${' '}
        created-date: '[[<% tp.file.creation_date("YYYY-MM-DD") %>]]'
        ---
      `,
      after: dedent`
        ---
        related-companies:${' '}
        stakeholders:${' '}
        pr-pipeline-stage:${' '}
        pr-priority:${' '}
        pr-size:${' '}
        pr-urgency:${' '}
        pr-type:${' '}
        pr-okr:${' '}
        pr-due-date:${' '}
        pr-completed-date:${' '}
        template: "[[Pro New Project Outcome Template]]"
        created-date: '[[<% tp.file.creation_date("YYYY-MM-DD") %>]]'
        modified: Tuesday, October 22nd 2024, 10:58:16 am
        date-created: Thursday, August 22nd 2024, 6:41:04 pm
        ---
      `,
      options: {
        yamlKeyPrioritySortOrder: [
          'related-companies: ',
          'stakeholders: ',
          'pr-pipeline-stage:',
          'pr-priority:',
          'pr-size:',
          'pr-urgency:',
          'pr-type: ',
          'pr-okr:',
          'pr-due-date:',
          'pr-completed-date: ',
          'template:',
          'created-date:',
          'modified:',
        ],
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1082
      testName: 'Make sure that literal operator `|` is handled correctly',
      before: dedent`
        ---
        sorting-spec: |
          order-desc: a-z
        first: alphabetical
        ---
      `,
      after: dedent`
        ---
        first: alphabetical
        sorting-spec: |
          order-desc: a-z
        ---
      `,
      options: {
        yamlKeyPrioritySortOrder: [
          'first',
          'sorting-spec:',
        ],
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/912
      testName: 'Make sure that lots of nesting does not get broken',
      before: dedent`
        ---
        AAA:
          - BBB: x
            CCC: x
          - DDD: x
            EEE: x
            FFF:
              - GGG: x
              - HHH
            III: x
        FFF:
          -${' '}
        ---
      `,
      after: dedent`
        ---
        AAA:
          - BBB: x
            CCC: x
          - DDD: x
            EEE: x
            FFF:
              - GGG: x
              - HHH
            III: x
        FFF:
          -${' '}
        ---
      `, // note that this does look wonky, but it works the same in Obsidian, so I am going to consider this fine for now
      // see https://github.com/eemeli/yaml/issues/590 for more information on this
      options: {
        yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/660
      testName: 'Make sure that comments are not removed when sorting',
      before: dedent`
        ---
        created: 2023-02-18T10:53:01+00:00
        # Dont remove me
        disabled rules: [capitalize-headings]
        modified: 2023-03-20T14:53:42+00:00
        ---
      `,
      after: dedent`
        ---
        created: 2023-02-18T10:53:01+00:00
        # Dont remove me
        disabled rules: [capitalize-headings]
        modified: 2023-03-20T14:53:42+00:00
        ---
      `,
      options: {
        yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/660
      testName: 'Make sure that scalars are not removed when sorting',
      before: dedent`
        ---
        name: John
        husband: Tim
        biography: |
          A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap.
        ---
      `,
      after: dedent`
        ---
        biography: |
          A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap. A very nice chap.
        husband: Tim
        name: John
        ---
      `,
      options: {
        yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1258
      testName: 'Make sure that folded block scalars are not broken up when sorting',
      before: dedent`
        ---
        aliases: []
        tags:
          - media/podcast/episode
        description: >-
          Follow our ad-free Rain Playlist here:
        image: 'https://i.scdn.co/image/ab6765630000ba8a8d796ac81fdad1d895dd28a1'
        links:
          - https://open.spotify.com/episode/1LSnoZVPWB8ynOCMCwKw5S
        showName: ASMR Rain Recordings
        created: 11-05-2024 21:09
        updated: 13-01-2025 08:16
        ---
      `,
      after: dedent`
        ---
        aliases: []
        created: 11-05-2024 21:09
        description: >-
          Follow our ad-free Rain Playlist here:
        image: 'https://i.scdn.co/image/ab6765630000ba8a8d796ac81fdad1d895dd28a1'
        links:
          - https://open.spotify.com/episode/1LSnoZVPWB8ynOCMCwKw5S
        showName: ASMR Rain Recordings
        tags:
          - media/podcast/episode
        updated: 13-01-2025 08:16
        ---
      `,
      options: {
        yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/660
      testName: 'Make sure that comments on an array do not cause issues when sorting',
      before: dedent`
        ---
        Ingredients: # [\`<free text for ingredient>\`,\`<amount>\`, \`<unit>\`, \`<form>\`, \`<note>\`]
          - [Watermelon, 80 g, cubed, note]
          - [sugar, 20 g]
        ---
      `,
      after: dedent`
        ---
        Ingredients: # [\`<free text for ingredient>\`,\`<amount>\`, \`<unit>\`, \`<form>\`, \`<note>\`]
          - [Watermelon, 80 g, cubed, note]
          - [sugar, 20 g]
        ---
      `,
      options: {
        yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
      },
    },
  ],
});
