import FormatYamlArray from '../src/rules/format-yaml-arrays';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: FormatYamlArray,
  testCases: [
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
  ],
});
