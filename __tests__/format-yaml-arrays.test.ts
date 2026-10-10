import FormatYamlArray from '../src/rules/format-yaml-arrays';
import dedent from 'ts-dedent';
import { ruleTest } from './common';
import { ArrayFormats } from '../src/utils/yaml';

ruleTest({
  RuleBuilderClass: FormatYamlArray,
  testCases: [
    // tags
    {
      testName: 'Convert tags from single-line to multi-line array',
      before: dedent`
        ---
        tags: [tag1, tag2, tag3, tag4]
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
        tagArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Formatting YAML tags does nothing when disabled',
      before: dedent`
        ---
        tags: [tag1, tag2, tag3, tag4]
        ---
      `,
      after: dedent`
        ---
        tags: [tag1, tag2, tag3, tag4]
        ---
      `,
      options: {
        tagArrayStyle: ArrayFormats.MultiLine,
        formatTagKey: false,
      },
    },
    {
      testName: 'Convert tags from single-line array to multi-line array with no changes removes unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = true`',
      before: dedent`
        ---
        tags: ["tag1", tag2, tag3, tag4]
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
        tagArrayStyle: ArrayFormats.MultiLine,
        removeUnnecessaryEscapeCharsForMultiLineArrays: true,
      },
    },
    {
      testName: 'Convert tags from single-line array to multi-line array with no changes doesn\'t remove unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = false`',
      before: dedent`
        ---
        tags: ["tag1", tag2, tag3, tag4]
        ---
      `,
      after: dedent`
        ---
        tags:
          - "tag1"
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: ArrayFormats.MultiLine,
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
        aliasArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Convert multi-line to single-line',
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
        aliasArrayStyle: ArrayFormats.SingleLine,
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
        aliasArrayStyle: ArrayFormats.SingleLine,
        formatAliasKey: false,
      },
    },
    {
      testName: 'Convert aliases from single-line array to multi-line array with no changes removes unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = true`',
      before: dedent`
        ---
        aliases: ["alias1", alias2, alias3, alias4]
        ---
      `,
      after: dedent`
        ---
        aliases:
          - alias1
          - alias2
          - alias3
          - alias4
        ---
      `,
      options: {
        aliasArrayStyle: ArrayFormats.MultiLine,
        removeUnnecessaryEscapeCharsForMultiLineArrays: true,
      },
    },
    {
      testName: 'Convert aliases from single-line array to multi-line array with no changes doesn\'t remove unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = false`',
      before: dedent`
        ---
        aliases: ["alias1", alias2, alias3, alias4]
        ---
      `,
      after: dedent`
        ---
        aliases:
          - "alias1"
          - alias2
          - alias3
          - alias4
        ---
      `,
      options: {
        aliasArrayStyle: ArrayFormats.MultiLine,
      },
    },

    // default array style
    {
      testName: 'Convert multi-line to single-line for regular YAML arrays',
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
        defaultArrayStyle: ArrayFormats.SingleLine,
      },
    },
    {
      testName: 'Convert single-line to multi-line for regular YAML arrays',
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
        defaultArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Regular YAML array formatting does nothing when disabled',
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
        defaultArrayStyle: ArrayFormats.MultiLine,
        formatArrayKeys: false,
      },
    },
    {
      testName: 'Regular YAML array formatting does nothing when key is present in list for forcing to be single-line',
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
        defaultArrayStyle: ArrayFormats.MultiLine,
        forceSingleLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Regular YAML array formatting does nothing when key is present in list for forcing to be multi-line',
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
        defaultArrayStyle: ArrayFormats.SingleLine,
        forceMultiLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Regular YAML array formatting does nothing to tags and aliases',
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
        defaultArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Convert single-line to multi-line for regular YAML arrays doesn\'t remove unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = false`',
      before: dedent`
        ---
        key: [val1, "other val"]
        ---
      `,
      after: dedent`
        ---
        key:
          - val1
          - "other val"
        ---
      `,
      options: {
        defaultArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Convert single-line to multi-line for regular YAML arrays removes unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = true`',
      before: dedent`
        ---
        key: [val1, "other val"]
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
        defaultArrayStyle: ArrayFormats.MultiLine,
        removeUnnecessaryEscapeCharsForMultiLineArrays: true,
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
        defaultArrayStyle: ArrayFormats.MultiLine,
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
        defaultArrayStyle: ArrayFormats.MultiLine,
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
        defaultArrayStyle: ArrayFormats.MultiLine,
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
        defaultArrayStyle: ArrayFormats.SingleLine,
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
        defaultArrayStyle: ArrayFormats.SingleLine,
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
        defaultArrayStyle: ArrayFormats.SingleLine,
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
        defaultArrayStyle: ArrayFormats.SingleLine,
        forceMultiLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Forcing multi-line on a single-line array results in a multi-line array with existing unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = false`',
      before: dedent`
        ---
        key: [val1, "other val"]
        ---
      `,
      after: dedent`
        ---
        key:
          - val1
          - "other val"
        ---
      `,
      options: {
        defaultArrayStyle: ArrayFormats.SingleLine,
        forceMultiLineArrayStyle: ['key'],
      },
    },
    {
      testName: 'Forcing multi-line on a single-line array results in a multi-line array without existing unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = true`',
      before: dedent`
        ---
        key: [val1, "other val"]
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
        defaultArrayStyle: ArrayFormats.SingleLine,
        forceMultiLineArrayStyle: ['key'],
        removeUnnecessaryEscapeCharsForMultiLineArrays: true,
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
        key: []
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
      testName: 'Trying to format tags to a multi-line when it is has an empty single-line will leave it as is',
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
        tagArrayStyle: ArrayFormats.MultiLine,
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
        aliasArrayStyle: ArrayFormats.SingleLine,
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
    {
      testName: 'An empty multi-line array does not get modified when linted and it is supposed to be a multi-line array',
      before: dedent`
        ---
        speakers: []
        ---
      `,
      after: dedent`
        ---
        speakers: []
        ---
      `,
      options: {
        forceMultiLineArrayStyle: ['speakers'],
      },
    },
    {
      testName: 'A multi-line array with mixed empty and non-empty values should have empty values removed',
      before: dedent`
        ---
        speakers:
          - 
          - speaker1
          - 
        ---
      `,
      after: dedent`
        ---
        speakers:
          - speaker1
        ---
      `,
      options: {
        forceMultiLineArrayStyle: ['speakers'],
      },
    },
    {
      testName: 'A single-line array with an empty value at the end should have the empty value removed',
      before: dedent`
        ---
        speakers: [speaker1, ]
        ---
      `,
      after: dedent`
        ---
        speakers: [speaker1]
        ---
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/352
      testName: 'Date stays the same',
      before: dedent`
        ---
        date: 2022-08-14
        tags: []
        ---
      `,
      after: dedent`
        ---
        date: 2022-08-14
        tags: []
        ---
      `,
    },
    {
      testName: 'Nested objects are preserved',
      before: dedent`
        ---
        key1:
          key2: value2
          key3:
            - item1
            - item2
        ---
      `,
      after: dedent`
        ---
        key1:
          key2: value2
          key3:
            - item1
            - item2
        ---
      `,
      options: {
        defaultArrayStyle: ArrayFormats.MultiLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/525
      testName: 'Converting a single-line array to a multi-line array should respect escaped entries',
      before: dedent`
        ---
        aliases: [Scott, "Scott, Jr."]
        ---
      `,
      after: dedent`
        ---
        aliases:
          - Scott
          - "Scott, Jr."
        ---
      `,
      options: {
        aliasArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Numeric aliases are escaped when aliases are converted from one type to another',
      before: dedent`
        ---
        aliases: 1234, alias1
        ---
      `,
      after: dedent`
        ---
        aliases:
          - "1234"
          - alias1
        ---
      `,
      options: {
        aliasArrayStyle: ArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Numeric aliases are escaped when aliases are otherwise unchanged',
      before: dedent`
        ---
        aliases: [1234, alias1]
        ---
      `,
      after: dedent`
        ---
        aliases: ["1234", alias1]
        ---
      `,
      options: {
        aliasArrayStyle: ArrayFormats.SingleLine,
      },
    },
    { // fixes https://github.com/platers/obsidian-linter/issues/1434
      testName: 'Converting from a multi-line array to a single line array should result in strings with commas in them being escaped',
      before: dedent`
        ---
        aliases:
          - Denver, Co
        ---
      `,
      after: dedent`
        ---
        aliases: ["Denver, Co"]
        ---
      `,
      options: {
        aliasArrayStyle: ArrayFormats.SingleLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1384
      testName: 'A double quoted YAML key needing no change should not have its value duplicated at the end of the YAML content ',
      before: dedent`
        ---
        "key1":${' '}
          - value
        ---
      `,
      after: dedent`
        ---
        "key1":
          - value
        ---
      `,
      options: {
        defaultArrayStyle: ArrayFormats.MultiLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1384
      testName: 'A single quoted YAML key needing no change should not have its value duplicated at the end of the YAML content ',
      before: dedent`
        ---
        'key1':${' '}
          - value
        ---
      `,
      after: dedent`
        ---
        'key1':
          - value
        ---
      `,
      options: {
        defaultArrayStyle: ArrayFormats.MultiLine,
      },
    },
  ],
});
