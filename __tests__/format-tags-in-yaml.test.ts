import dedent from 'ts-dedent';
import FormatTagsInYaml from '../src/rules/format-tags-in-yaml';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: FormatTagsInYaml,
  testCases: [
    { // fixes https://github.com/platers/obsidian-linter/issues/1155
      testName: 'Make sure that when a tags array is empty and the next line has a hashtag it is not affected',
      before: dedent`
        ---
        created: 2024-08-29T19:28:47+02:00
        updated: 2024-08-29T19:48:06+02:00
        title: Share note Test
        aliases: 
        tags: []
        share_link: https://share.note.sx/r0w1vdtw#goaVfYU2NExAphdG8oHzVUZ2h8E22JDbJHC5BBEsZPo
        share_updated: 2024-08-29T19:37:28+02:00
        ---
      `,
      after: dedent`
        ---
        created: 2024-08-29T19:28:47+02:00
        updated: 2024-08-29T19:48:06+02:00
        title: Share note Test
        aliases: 
        tags: []
        share_link: https://share.note.sx/r0w1vdtw#goaVfYU2NExAphdG8oHzVUZ2h8E22JDbJHC5BBEsZPo
        share_updated: 2024-08-29T19:37:28+02:00
        ---
      `,
    },
  ],
});
