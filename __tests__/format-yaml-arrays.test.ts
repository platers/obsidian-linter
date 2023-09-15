import FormatYamlArray from '../src/rules/format-yaml-arrays';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from '../src/utils/yaml';

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
        tagArrayStyle: NormalArrayFormats.MultiLine,
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
        tagArrayStyle: NormalArrayFormats.SingleLine,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringCommaDelimited,
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
        tagArrayStyle: TagSpecificArrayFormats.SingleLineSpaceDelimited,
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
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
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
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    {
      testName: 'Formatting YAML tags does nothing when disabled',
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
        tagArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
        formatTagKey: false,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/441
      testName: 'Convert tags from single-line string to single-line string when there is only 1 element and the style is single string to multi-line and existing key is `tag`',
      before: dedent`
        ---
        tag: tag1, tag2, tag3, tag4
        ---
      `,
      after: dedent`
        ---
        tag:
          - tag1
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/509
      testName: 'Convert tags from single-line array to multi-line array when there is no space after one of the commas and the key for tags is `tag`',
      before: dedent`
        ---
        tag: [tag1,tag2, tag3, tag4]
        ---
      `,
      after: dedent`
        ---
        tag:
          - tag1
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Convert tags from single-line array to multi-line array with no changes removes unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = true`',
      before: dedent`
        ---
        tag: ["tag1", tag2, tag3, tag4]
        ---
      `,
      after: dedent`
        ---
        tag:
          - tag1
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: NormalArrayFormats.MultiLine,
        removeUnnecessaryEscapeCharsForMultiLineArrays: true,
      },
    },
    {
      testName: 'Convert tags from single-line array to multi-line array with no changes doesn\'t remove unnecessary escape values when `removeUnnecessaryEscapeCharsForMultiLineArrays = false`',
      before: dedent`
        ---
        tag: ["tag1", tag2, tag3, tag4]
        ---
      `,
      after: dedent`
        ---
        tag:
          - "tag1"
          - tag2
          - tag3
          - tag4
        ---
      `,
      options: {
        tagArrayStyle: NormalArrayFormats.MultiLine,
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
        aliasArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/441
      testName: 'Convert aliases from single-line to multi-line array when exisiting key is `alias`',
      before: dedent`
        ---
        alias: [title1, title2, title3]
        ---
      `,
      after: dedent`
        ---
        alias:
          - title1
          - title2
          - title3
        ---
      `,
      options: {
        aliasArrayStyle: NormalArrayFormats.MultiLine,
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
        aliasArrayStyle: SpecialArrayFormats.SingleStringCommaDelimited,
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
        aliasArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
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
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
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
        aliasArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
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
        aliasArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
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
        aliasArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
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
        aliasArrayStyle: NormalArrayFormats.MultiLine,
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
        aliasArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.SingleLine,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
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
        tagArrayStyle: NormalArrayFormats.MultiLine,
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
        tagArrayStyle: SpecialArrayFormats.SingleStringCommaDelimited,
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
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
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
        tagArrayStyle: TagSpecificArrayFormats.SingleLineSpaceDelimited,
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
        aliasArrayStyle: NormalArrayFormats.SingleLine,
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
        defaultArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/525
      testName: 'Converting a single string comma separated array to a multi-line array should respect escaped entries',
      before: dedent`
        ---
        aliases: Scott, "Scott, Jr."
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
        aliasArrayStyle: NormalArrayFormats.MultiLine,
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
        aliasArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Numeric aliases are escaped when aliases are otherwise unchanged',
      before: dedent`
        ---
        aliases: 1234, alias1
        ---
      `,
      after: dedent`
        ---
        aliases: "1234", alias1
        ---
      `,
      options: {
        aliasArrayStyle: SpecialArrayFormats.SingleStringCommaDelimited,
      },
    },
  ],
});
