import MoveTagsToYaml from '../src/rules/move-tags-to-yaml';
import {NormalArrayFormats, SpecialArrayFormats, TagSpecificArrayFormats} from '../src/utils/yaml';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: MoveTagsToYaml,
  testCases: [
    {
      testName: 'Nothing happens when there is no tag in the content of the text',
      before: dedent`
        # Title
      `,
      after: dedent`
        # Title
      `,
    },
    {
      testName: 'Creates multi-line array tag when missing',
      before: dedent`
        #test
      `,
      after: dedent`
        ---
        tags:
          - test
        ---
        #test
      `,
      options: {
        tagArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Creates single-line array tags when missing',
      before: dedent`
        #test
      `,
      after: dedent`
        ---
        tags: [test]
        ---
        #test
      `,
    },
    {
      testName: 'Creates single string tag when missing',
      before: dedent`
        #test
      `,
      after: dedent`
        ---
        tags: test
        ---
        #test
      `,
      options: {
        tagArrayStyle: SpecialArrayFormats.SingleStringToMultiLine,
      },
    },
    {
      testName: 'Creates multi-line array tags when empty',
      before: dedent`
        ---
        tags: ${''}
        ---
        #test
      `,
      after: dedent`
        ---
        tags:
          - test
        ---
        #test
      `,
      options: {
        tagArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    {
      testName: 'Creates single-line array tags when empty',
      before: dedent`
        ---
        tags: ${''}
        ---
        #test
      `,
      after: dedent`
        ---
        tags: [test]
        ---
        #test
      `,
    },
    {
      testName: 'Nothing happens when the tags in the body are covered by the tags in the yaml already',
      before: dedent`
        ---
        tags: test
        ---
        #test
      `,
      after: dedent`
        ---
        tags: test
        ---
        #test
      `,
      options: {
        tagArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/472
      testName: 'If yaml tag has space after or before the tag, it should not affect the tag comparison',
      before: dedent`
        ---
        tags: [ space-before-tag, space-after-tag ]
        ---
        #space-before-tag
        #space-after-tag
        #test
      `,
      after: dedent`
        ---
        tags: [space-before-tag, space-after-tag, test]
        ---
        #space-before-tag
        #space-after-tag
        #test
      `,
      options: {
        tagArrayStyle: SpecialArrayFormats.SingleStringToSingleLine,
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/441
      testName: 'Creates single-line array tags when empty and the existing tags key is `tag`',
      before: dedent`
        ---
        tag: ${''}
        ---
        #test
      `,
      after: dedent`
        ---
        tag: [test]
        ---
        #test
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/489
      testName: 'CSS styles are not included in tags',
      before: dedent`
        ---
        tag: ${''}
        ---
        <mark style="background: #FFB8EBA6;">some text</mark>
      `,
      after: dedent`
        ---
        tag: ${''}
        ---
        <mark style="background: #FFB8EBA6;">some text</mark>
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/521
      testName: 'Make sure that removing tags respects ignore list',
      before: dedent`
        #tag1
        #tag2
        #ignored-tag test data
        #ignored-tag/nested-tag more tested data
      `,
      after: dedent`
        ---
        tags: tag1 tag2
        ---
        #ignored-tag test data
        #ignored-tag/nested-tag more tested data
      `,
      options: {
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
        howToHandleExistingTags: 'Remove whole tag',
        tagsToIgnore: ['ignored-tag', 'ignored-tag/nested-tag'],
      },
    },
  ],
});
