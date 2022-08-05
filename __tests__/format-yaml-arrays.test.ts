import FormatYamlArray from '../src/rules/format-yaml-arrays';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: FormatYamlArray,
  testCases: [
    // tags
    {
      testName: 'Convert tags from single-line with spaces to multi-line array',
      before: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      after: dedent`
        ---
        tags:
          - tag1
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: 'multi-line',
      },
    },
    {
      testName: 'Convert tags from single-line with spaces to single-line array',
      before: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      after: dedent`
        ---
        tags: [tag1, tag2, tag3, tag4]
        ---
      `,
      options: {
        tagArrayStyle: 'single-line',
      },
    },
    {
      testName: 'Convert tags from single-line with spaces to single-line with commas',
      before: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      after: dedent`
        ---
        tags: tag1, tag2, tag3, tag4
        ---
      `,
      options: {
        tagArrayStyle: 'single string comma delimited',
      },
    },
    {
      testName: 'Convert tags from single-line with spaces to single-line array which is space delimited',
      before: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      after: dedent`
        ---
        tags: [tag1 tag2 tag3 tag4]
        ---
      `,
      options: {
        tagArrayStyle: 'single-line space delimited',
      },
    },
    {
      testName: 'Convert tags from single-line with spaces to single-line with spaces',
      before: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      after: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      options: {
        tagArrayStyle: 'single string space delimited',
      },
    },
    {
      testName: 'Convert tags from single-line array with spaces to single-line with spaces',
      before: dedent`
        ---
        tags: [tag1 tag2 tag3 tag4]
        ---
      `,
      after: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      options: {
        tagArrayStyle: 'single string space delimited',
      },
    },
    {
      testName: 'Convert tags from multi-line array with spaces to single string when 1 element is present',
      before: dedent`
        ---
        tags:
          - tag1
        ---
      `,
      after: dedent`
        ---
        tags: tag1
        ---
      `,
      options: {
        tagArrayStyle: 'single string to single-line',
      },
    },
    {
      testName: 'Convert tags from single-line with commas to single-line array when multiple elements present and option is single string to single-line',
      before: dedent`
        ---
        tags: tag1, tag2, tag3, tag4
        ---
      `,
      after: dedent`
        ---
        tags: [tag1, tag2, tag3, tag4]
        ---
      `,
      options: {
        tagArrayStyle: 'single string to single-line',
      },
    },
    {
      testName: 'Convert tags from single-line array with spaces to multi-line array when multiple elements present and option is single string to multi-line',
      before: dedent`
        ---
        tags: tag1 tag2 tag3 tag4
        ---
      `,
      after: dedent`
        ---
        tags:
          - tag1
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: 'single string to multi-line',
      },
    },
    {
      testName: 'Convert tags from single-line string to single-line string when there is only 1 element and the style is single string to multi-line',
      before: dedent`
        ---
        tags: tag1, tag2, tag3, tag4
        ---
      `,
      after: dedent`
        ---
        tags:
          - tag1
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: 'single string to multi-line',
      },
    },
    {
      testName: 'Formatting yaml tags does nothing when disabled',
      before: dedent`
        ---
        tags: tag1, tag2, tag3, tag4
        ---
      `,
      after: dedent`
        ---
        tags: tag1, tag2, tag3, tag4
        ---
      `,
      options: {
        tagArrayStyle: 'single string to multi-line',
        formatTagKey: false,
      },
    },

    // aliases
    {
      testName: 'Convert aliases from single-line to multi-line array',
      before: dedent`
        ---
        aliases: [title1, title2, title3]
        ---
      `,
      after: dedent`
        ---
        aliases:
          - title1
          - title2
          - title3
        ---
      `,
      options: {
        aliasArrayStyle: 'multi-line',
      },
    },
    {
      testName: 'Convert aliases from multi-line to single string which is comma delimited',
      before: dedent`
        ---
        aliases:
          - title1
          - title2
          - title3
        ---
      `,
      after: dedent`
        ---
        aliases: title1, title2, title3
        ---
      `,
      options: {
        aliasArrayStyle: 'single string comma delimited',
      },
    },
    {
      testName: 'Convert multi-line to single string when there is 1 element and the style is single string to single-line',
      before: dedent`
        ---
        aliases:
          - title
        ---
      `,
      after: dedent`
        ---
        aliases: title
        ---
      `,
      options: {
        aliasArrayStyle: 'single string to single-line',
      },
    },
    {
      testName: 'Convert multi-line to single string when there is 1 element and the style is single string to multi-line',
      before: dedent`
        ---
        aliases:
          - title
        ---
      `,
      after: dedent`
        ---
        aliases: title
        ---
      `,
      options: {
        aliasArrayStyle: 'single string to multi-line',
      },
    },
    {
      testName: 'Convert single-line to multi-line string when there is more than 1 element and the style is single string to multi-line',
      before: dedent`
        ---
        aliases: [title, other title]
        ---
      `,
      after: dedent`
        ---
        aliases:
          - title
          - other title
        ---
      `,
      options: {
        aliasArrayStyle: 'single string to multi-line',
      },
    },
    {
      testName: 'Convert multi-line to single-line when there is more than 1 element and the style is single string to single-line',
      before: dedent`
        ---
        aliases:
          - title
          - other title
        ---
      `,
      after: dedent`
        ---
        aliases: [title, other title]
        ---
      `,
      options: {
        aliasArrayStyle: 'single string to single-line',
      },
    },
    {
      testName: 'Formatting aliases does nothing when disabled',
      before: dedent`
        ---
        aliases:
          - title
          - other title
        ---
      `,
      after: dedent`
        ---
        aliases:
          - title
          - other title
        ---
      `,
      options: {
        aliasArrayStyle: 'single string to single-line',
        formatAliasKey: false,
      },
    },

    // default array style

    // force single-line

    // force multi-line

    // combinations
  ],
});
