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
    {
      testName: 'Convert multi-line to single-line for regular yaml arrays',
      before: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      after: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      options: {
        defaultArrayStyle: 'single-line',
      },
    },
    {
      testName: 'Convert single-line to multi-line for regular yaml arrays',
      before: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      after: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
      },
    },
    {
      testName: 'Regular yaml array formatting does nothing when disabled',
      before: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      after: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
        formatArrayKeys: false,
      },
    },
    {
      testName: 'Regular yaml array formatting does nothing when key is present in list for forcing to be single-line',
      before: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      after: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
        forceSingleLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Regular yaml array formatting does nothing when key is present in list for forcing to be multi-line',
      before: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      after: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      options: {
        defaultArrayStyle: 'single-line',
        forceMultiLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Regular yaml array formatting does nothing to tags and aliases',
      before: dedent`
        ---
        aliases: [title1, other title]
        tags: [tag1, tag2, tag3]
        ---
      `,
      after: dedent`
        ---
        aliases: [title1, other title]
        tags: [tag1, tag2, tag3]
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
      },
    },

    // force single-line
    {
      testName: 'Forcing single-line on a multi-line array results in a single-line array',
      before: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      after: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
        forceSingleLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Forcing single-line on a key that is not present just ignores the value',
      before: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      after: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
        forceSingleLineArrayStyle: ['key1'],
      },
    },
    {
      testName: 'Forcing single-line on a value that is a single string will result in a single-line',
      before: dedent`
        ---
        key: text here
        ---
      `,
      after: dedent`
        ---
        key: [text here]
        ---
      `,
      options: {
        defaultArrayStyle: 'multi-line',
        forceSingleLineArrayStyle: ['key'],
      },
    },

    // force multi-line
    {
      testName: 'Forcing multi-line on a single-line array results in a multi-line array',
      before: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      after: dedent`
        ---
        key:
          - val1
          - other val
        ---
      `,
      options: {
        defaultArrayStyle: 'single-line',
        forceMultiLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Forcing multi-line on a key that does not exist results in it being ignored',
      before: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      after: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      options: {
        defaultArrayStyle: 'single-line',
        forceMultiLineArrayStyle: ['key1'],
      },
    },
    {
      testName: 'Forcing multi-line on a key that does not exist results in it being ignored',
      before: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      after: dedent`
        ---
        key: [val1, other val]
        ---
      `,
      options: {
        defaultArrayStyle: 'single-line',
        forceMultiLineArrayStyle: ['key1'],
      },
    },
    {
      testName: 'Forcing multi-line on a key that has a single string will result in a multi-line',
      before: dedent`
        ---
        key: here is some text
        ---
      `,
      after: dedent`
        ---
        key:
          - here is some text
        ---
      `,
      options: {
        defaultArrayStyle: 'single-line',
        forceMultiLineArrayStyle: ['key'],
      },
    },

    // edge cases
    {
      testName: 'Forcing multi-line on a key that has no value will result in an empty multi-line array',
      before: dedent`
        ---
        key: 
        ---
      `,
      after: dedent`
        ---
        key:
          - 
        ---
      `,
      options: {
        forceMultiLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Forcing single-line on a key that has no value will result in an empty single-line array',
      before: dedent`
        ---
        key: 
        ---
      `,
      after: dedent`
        ---
        key: []
        ---
      `,
      options: {
        forceSingleLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Trying to format tags to a single string when it is has an empty single-line will result in an empty single string',
      before: dedent`
        ---
        tags: []
        ---
      `,
      after: dedent`
        ---
        tags: 
        ---
      `,
      options: {
        tagArrayStyle: 'single string to single-line',
      },
    },
    {
      testName: 'Trying to format tags to a multi-line when it is has an empty single-line will result in an empty multi-line',
      before: dedent`
        ---
        tags: []
        ---
      `,
      after: dedent`
        ---
        tags:
          - 
        ---
      `,
      options: {
        tagArrayStyle: 'multi-line',
      },
    },
    {
      testName: 'Trying to format tags to a single string separated by commas when it is has an empty single-line will result in an empty string',
      before: dedent`
        ---
        tags: []
        ---
      `,
      after: dedent`
        ---
        tags: 
        ---
      `,
      options: {
        tagArrayStyle: 'single string comma delimited',
      },
    },
    {
      testName: 'Trying to format tags to a single string separated by spaces when it is has an empty single-line will result in an empty string',
      before: dedent`
        ---
        tags: []
        ---
      `,
      after: dedent`
        ---
        tags: 
        ---
      `,
      options: {
        tagArrayStyle: 'single string space delimited',
      },
    },
    {
      testName: 'Trying to format tags to a single-line separated by spaces when it is has an empty single-line will result in an empty single-line',
      before: dedent`
        ---
        tags: []
        ---
      `,
      after: dedent`
        ---
        tags: []
        ---
      `,
      options: {
        tagArrayStyle: 'single-line space delimited',
      },
    },
    {
      testName: 'Trying to format aliases to a single-line when it is has an empty string will result in an empty single-line',
      before: dedent`
        ---
        aliases: 
        ---
      `,
      after: dedent`
        ---
        aliases: []
        ---
      `,
      options: {
        aliasArrayStyle: 'single-line',
      },
    },
    {
      testName: 'Un-indented array items are associated with array',
      before: dedent`
        ---
        aliases:
        - title 1
        - title 2
        ---
      `,
      after: dedent`
        ---
        aliases: [title 1, title 2]
        ---
      `,
    },
  ],
});
