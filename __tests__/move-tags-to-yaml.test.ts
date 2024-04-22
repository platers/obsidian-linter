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
      testName: 'Nothing happens when the tags in the body are covered by the tags in the YAML already',
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
      testName: 'If YAML tag has space after or before the tag, it should not affect the tag comparison',
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
    { // accounts for https://github.com/platers/obsidian-linter/issues/579
      testName: 'Make sure wiki link and markdown link text is ignored for this',
      before: dedent`
        [Issue #152 on Github](some_link.md)
        [[some_link|Issue #152 on Github]]]
      `,
      after: dedent`
        [Issue #152 on Github](some_link.md)
        [[some_link|Issue #152 on Github]]]
      `,
      options: {
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/573
      testName: 'Make sure that removing a tag after the YAML frontmatter does not leave whitespace on the same line as the frontmatter',
      before: dedent`
        ---
        title: Move Tags to YAML Duplicates YAML
        date: 2023-01-13
        edit: 2023-01-231
        ---
        #tag-error${' '}
      `,
      after: dedent`
        ---
        title: Move Tags to YAML Duplicates YAML
        date: 2023-01-13
        edit: 2023-01-231
        tags: tag-error
        ---
      `,
      options: {
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
        howToHandleExistingTags: 'Remove whole tag',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/661
      testName: 'Make sure that moving tags to YAML does not affect values in the YAML beyond the tag values',
      before: dedent`
        ---
        BC-dataview-note: "#tag1 and #tag2"
        BC-dataview-note-field: parent
        ---
        ${''}
        # Title
        ${''}
        #tag-body
      `,
      after: dedent`
        ---
        BC-dataview-note: "#tag1 and #tag2"
        BC-dataview-note-field: parent
        tags: tag-body
        ---
        ${''}
        # Title
        ${''}
      `,
      options: {
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
        howToHandleExistingTags: 'Remove whole tag',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/952
      testName: 'Make sure that tags immediately followed by a wiki link only copies the tag value and not the wiki link value and removes properly',
      before: dedent`
        ---
        title: Note
        Date: 2023-10-24T23:00:00+08:00
        lastMod: 2023-11-28T17:36:29+08:00
        ---
        ${''}
        #tag![[image.png]]
      `,
      after: dedent`
        ---
        title: Note
        Date: 2023-10-24T23:00:00+08:00
        lastMod: 2023-11-28T17:36:29+08:00
        tags: tag
        ---
        ![[image.png]]
      `,
      options: {
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
        howToHandleExistingTags: 'Remove whole tag',
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/952
      testName: 'Make sure that tags immediately followed by a wiki link only copies the tag value and not the wiki link value',
      before: dedent`
        ---
        title: Note
        Date: 2023-10-24T23:00:00+08:00
        lastMod: 2023-11-28T17:36:29+08:00
        ---
        ${''}
        #tag![[image.png]]
      `,
      after: dedent`
        ---
        title: Note
        Date: 2023-10-24T23:00:00+08:00
        lastMod: 2023-11-28T17:36:29+08:00
        tags: tag
        ---
        ${''}
        #tag![[image.png]]
      `,
      options: {
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1068
      testName: 'Make sure that "`" is not valid in a tag',
      before: dedent`
        ---
        title: Note
        Date: 2023-10-24T23:00:00+08:00
        lastMod: 2023-11-28T17:36:29+08:00
        tags: [text, val2]
        ---
        ${''}
        #\`
      `,
      after: dedent`
        ---
        title: Note
        Date: 2023-10-24T23:00:00+08:00
        lastMod: 2023-11-28T17:36:29+08:00
        tags: [text, val2]
        ---
        ${''}
        #\`
      `,
      options: {
        tagArrayStyle: NormalArrayFormats.SingleLine,
      },
    },
  ],
});
