import MoveInlineFieldsToYaml from '../src/rules/move-inline-fields-to-yaml';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {NormalArrayFormats, TagSpecificArrayFormats} from '../src/utils/yaml';

ruleTest({
  RuleBuilderClass: MoveInlineFieldsToYaml,
  testCases: [
    {
      testName: 'Nothing happens when there are no inline fields',
      before: dedent`
        # Title
        Text with a single colon: here
      `,
      after: dedent`
        # Title
        Text with a single colon: here
      `,
    },
    {
      testName: 'Keys with spaces are quoted in the YAML frontmatter and matched against quoted and unquoted existing keys',
      before: dedent`
        ---
        "Test Key": 1
        ---
        Test Key:: 1234
        Other Key:: value
      `,
      after: dedent`
        ---
        "Test Key": 1234
        "Other Key": value
        ---
      `,
      options: {howToHandleExistingKeys: 'Overwrite'},
    },
    {
      testName: 'An existing key keeps its quotes when they differ from the escape character in the settings',
      before: dedent`
        ---
        'Test Key': 1
        "Other Key": 2
        ---
        Test Key:: 1234
        Other Key:: 5678
      `,
      after: dedent`
        ---
        'Test Key': 1234
        "Other Key": 5678
        ---
      `,
      options: {howToHandleExistingKeys: 'Overwrite', defaultEscapeCharacter: '"'},
    },
    {
      testName: 'Keys use the escape character from the settings',
      before: 'Test Key:: 1234',
      after: dedent`
        ---
        'Test Key': 1234
        ---
      `,
      options: {defaultEscapeCharacter: '\''},
    },
    {
      testName: 'Values that are not plain YAML are escaped and values Dataview reads as a quoted string keep their quotes when YAML reads them the same way',
      before: dedent`
        link:: [[Some Note|alias]]
        links:: [[One]], [[Two]]
        time:: 10: 30
        heading:: #not-a-comment
        quoted:: "already quoted"
        quoted-with-escapes:: "say \\"hi\\""
        dataview-only-escape:: "a \\d"
        two-strings:: "one" and "two"
        number:: 42
        flag:: true
      `,
      after: dedent`
        ---
        link: "[[Some Note|alias]]"
        links: "[[One]], [[Two]]"
        time: "10: 30"
        heading: "#not-a-comment"
        quoted: "already quoted"
        quoted-with-escapes: "say \\"hi\\""
        dataview-only-escape: a \\d
        two-strings: '"one" and "two"'
        number: 42
        flag: true
        ---
      `,
    },
    {
      testName: 'An empty value creates a key without a value',
      before: 'empty::',
      after: dedent`
        ---
        empty:
        ---
      `,
    },
    {
      testName: 'Markdown and emoji around a full-line key are removed like Dataview does',
      before: dedent`
        > **Status**:: done
        # 🎉 Party:: yes
        __Owner__:: me
      `,
      after: dedent`
        ---
        Status: done
        Party: yes
        __Owner__: me
        ---
      `,
    },
    {
      testName: 'Full-line fields are not moved when Full-line inline fields is Leave in place',
      before: dedent`
        status:: done
        Text [owner:: me]
      `,
      after: dedent`
        ---
        owner: me
        ---
        status:: done
        Text
      `,
      options: {
        howToHandleFullLineFields: 'Leave in place',
        howToHandleBracketedFields: 'Move and remove',
      },
    },
    {
      testName: 'Bracketed fields are added to the YAML frontmatter and left in the text when Bracketed inline fields is Move and keep in text',
      before: dedent`
        status:: done
        Text [owner:: me] and (due:: tomorrow)
      `,
      after: dedent`
        ---
        status: done
        owner: me
        due: tomorrow
        ---
        Text [owner:: me] and (due:: tomorrow)
      `,
      options: {howToHandleBracketedFields: 'Move and keep in text'},
    },
    {
      testName: 'Fields kept in the text do not change the YAML frontmatter again once it has their values',
      before: dedent`
        ---
        context: [home, garden]
        ---
        context:: home
        Text [context:: garden]
      `,
      after: dedent`
        ---
        context: [home, garden]
        ---
        context:: home
        Text [context:: garden]
      `,
      options: {
        howToHandleFullLineFields: 'Move and keep in text',
        howToHandleBracketedFields: 'Move and keep in text',
        howToHandleExistingKeys: 'Merge into list',
      },
    },
    {
      testName: 'A line whose text before the separator is not a valid key is not a full-line field',
      before: dedent`
        Some.Thing:: value
        a key: with a colon:: value
      `,
      after: dedent`
        Some.Thing:: value
        a key: with a colon:: value
      `,
    },
    {
      testName: 'A line with a bracketed field is not a full-line field',
      before: dedent`
        Status:: done [owner:: me]
      `,
      after: dedent`
        Status:: done [owner:: me]
      `,
    },
    {
      testName: 'Bracketed fields respect nesting and escapes when finding the end of the value',
      before: dedent`
        See [related:: [[Note]]] and (formula:: f(x) = (x + 1)) and [escaped:: a \\] b].
      `,
      after: dedent`
        ---
        related: "[[Note]]"
        formula: f(x) = (x + 1)
        escaped: a \\] b
        ---
        See [[Note]] and f(x) = (x + 1) and a \\] b.
      `,
      options: {howToHandleBracketedFields: 'Move and keep value in text'},
    },
    {
      testName: 'Bracketed keys cannot contain brackets or parentheses',
      before: dedent`
        A [[link]] and [ke(y:: value] stay
      `,
      after: dedent`
        A [[link]] and [ke(y:: value] stay
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'A bracketed field with no closing wrapper is left alone',
      before: dedent`
        An [unclosed:: field
      `,
      after: dedent`
        An [unclosed:: field
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'Removing bracketed fields at the start and end of a line does not leave extra whitespace',
      before: dedent`
        [a:: 1] text in the middle [b:: 2]
        text [c:: 3]  more text
      `,
      after: dedent`
        ---
        a: 1
        b: 2
        c: 3
        ---
        text in the middle
        text more text
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'A line left with only whitespace is removed, including when it is the last line',
      before: dedent`
        First line
        ${''}
          [a:: 1]   (b:: 2)${'  '}
        Middle line
        [c:: 3]
      `,
      after: dedent`
        ---
        a: 1
        b: 2
        c: 3
        ---
        First line
        ${''}
        Middle line
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'Replacing a bracketed field with an empty value removes it',
      before: dedent`
        Text [empty::] here
      `,
      after: dedent`
        ---
        empty:
        ---
        Text here
      `,
      options: {howToHandleBracketedFields: 'Move and keep value in text'},
    },
    {
      testName: 'Fields on list items, tasks, and their continuation lines are always left alone',
      before: dedent`
        - item:: one
        - [ ] task [due:: 2024-01-01]
          continued:: line
        1. numbered:: item
        > - quoted:: item
      `,
      after: dedent`
        - item:: one
        - [ ] task [due:: 2024-01-01]
          continued:: line
        1. numbered:: item
        > - quoted:: item
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'Fields in code, inline code, math, HTML, tables, comments, and disabled sections are left alone',
      before: dedent`
        \`\`\`
        code:: block
        \`\`\`
        ${''}
            indented:: code
        ${''}
        \`inline:: code\`
        ${''}
        Text \`[inline:: code]\` and $[math:: inline]$
        ${''}
        $$
        math:: block
        $$
        ${''}
        <div>
        html:: block
        </div>
        ${''}
        | table:: cell |
        | ------------ |
        | row:: cell   |
        ${''}
        %%
        comment:: here
        %%
        ${''}
        <!-- linter-disable -->
        disabled:: section
        <!-- linter-enable -->
      `,
      after: dedent`
        \`\`\`
        code:: block
        \`\`\`
        ${''}
            indented:: code
        ${''}
        \`inline:: code\`
        ${''}
        Text \`[inline:: code]\` and $[math:: inline]$
        ${''}
        $$
        math:: block
        $$
        ${''}
        <div>
        html:: block
        </div>
        ${''}
        | table:: cell |
        | ------------ |
        | row:: cell   |
        ${''}
        %%
        comment:: here
        %%
        ${''}
        <!-- linter-disable -->
        disabled:: section
        <!-- linter-enable -->
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'A full-line field with inline code in it is left alone',
      before: 'command:: `npm test`',
      after: 'command:: `npm test`',
    },
    {
      testName: 'Existing keys are matched exactly and only at the top level',
      before: dedent`
        ---
        nested:
          status: draft
        Status: draft
        ---
        status:: done
      `,
      after: dedent`
        ---
        nested:
          status: draft
        Status: draft
        status: done
        ---
      `,
    },
    {
      testName: 'Skip leaves every field with an existing key in the body',
      before: dedent`
        ---
        context: work
        ---
        context:: home
        Text [context:: garden]
      `,
      after: dedent`
        ---
        context: work
        ---
        context:: home
        Text [context:: garden]
      `,
      options: {howToHandleBracketedFields: 'Move and remove'},
    },
    {
      testName: 'Several fields with the same new key become a list',
      before: dedent`
        context:: home
        context:: garden, shed
      `,
      after: dedent`
        ---
        context: [home, "garden, shed"]
        ---
      `,
    },
    {
      testName: 'Merge into list keeps the style of an existing multi-line array and does not add duplicate values',
      before: dedent`
        ---
        context:
          - work
          - home
        ---
        context:: home
        context:: garden
      `,
      after: dedent`
        ---
        context:
          - work
          - home
          - garden
        ---
      `,
      options: {howToHandleExistingKeys: 'Merge into list'},
    },
    {
      testName: 'Merge into list adds to an existing single-line array and fills an existing empty key',
      before: dedent`
        ---
        context: [work]
        empty:
        ---
        context:: home
        empty:: value
      `,
      after: dedent`
        ---
        context: [work, home]
        empty: value
        ---
      `,
      options: {howToHandleExistingKeys: 'Merge into list'},
    },
    {
      testName: 'Merge into list does not add values that are already there with or without quotes and keeps the quotes of existing values',
      before: dedent`
        ---
        context: ['home', "garden"]
        ---
        context:: home
        context:: "garden"
        context:: shed
      `,
      after: dedent`
        ---
        context: ['home', "garden", shed]
        ---
      `,
      options: {howToHandleExistingKeys: 'Merge into list'},
    },
    {
      testName: 'Merge into list leaves an existing array as it is written when it already has every value',
      before: dedent`
        ---
        context: [home]
        other:
            - a
        ---
        context:: home
        other:: "a"
      `,
      after: dedent`
        ---
        context: [home]
        other:
            - a
        ---
      `,
      options: {howToHandleExistingKeys: 'Merge into list'},
    },
    {
      testName: 'Overwrite keeps an existing single value array an array',
      before: dedent`
        ---
        context: [work]
        ---
        context:: home
      `,
      after: dedent`
        ---
        context: [home]
        ---
      `,
      options: {howToHandleExistingKeys: 'Overwrite'},
    },
    {
      testName: 'Merge into list skips keys whose existing value is a map, a block scalar, or has a comment',
      before: dedent`
        ---
        map:
          a: b
        block: |
          text
        commented: value # comment
        ---
        map:: value
        block:: value
        commented:: value
      `,
      after: dedent`
        ---
        map:
          a: b
        block: |
          text
        commented: value # comment
        ---
        map:: value
        block:: value
        commented:: value
      `,
      options: {howToHandleExistingKeys: 'Merge into list'},
    },
    {
      testName: 'Overwrite replaces an existing multi-line array with every value of the key and keeps it multi-line',
      before: dedent`
        ---
        context:
          - work
        title: Note
        ---
        context:: home
        context:: garden
      `,
      after: dedent`
        ---
        context:
          - home
          - garden
        title: Note
        ---
      `,
      options: {howToHandleExistingKeys: 'Overwrite'},
    },
    {
      testName: 'Inline keys to ignore applies to full-line and bracketed fields and is case sensitive',
      before: dedent`
        related:: [[Note]]
        Related:: [[Other]]
        Text [related:: [[Third]]]
      `,
      after: dedent`
        ---
        Related: "[[Other]]"
        ---
        related:: [[Note]]
        Text [related:: [[Third]]]
      `,
      options: {
        howToHandleBracketedFields: 'Move and remove',
        inlineKeysToIgnore: ['related'],
      },
    },
    {
      testName: 'Tags are split up, have their hashtags removed, and use the tag array style',
      before: dedent`
        tags:: #book #fiction
        tag:: to-read, #series/discworld
      `,
      after: dedent`
        ---
        tags:
          - book
          - fiction
        tag:
          - to-read
          - series/discworld
        ---
      `,
      options: {tagArrayStyle: NormalArrayFormats.MultiLine},
    },
    {
      testName: 'A single tag still uses the tag array style',
      before: 'tags:: #book',
      after: dedent`
        ---
        tags: [book]
        ---
      `,
    },
    {
      testName: 'Tags that are not valid tags are left alone',
      before: 'tags:: [[Some Note]]',
      after: 'tags:: [[Some Note]]',
    },
    {
      testName: 'Merge into list adds tags to the existing tags without duplicates',
      before: dedent`
        ---
        tags: book fiction
        ---
        tags:: #fiction #to-read
      `,
      after: dedent`
        ---
        tags: book fiction to-read
        ---
      `,
      options: {
        howToHandleExistingKeys: 'Merge into list',
        tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
      },
    },
    {
      testName: 'Aliases are split on commas, numbers are escaped, and the alias array style is used',
      before: dedent`
        aliases:: Pratchett, "Sir Terry, Author"
        aliases:: 1984
      `,
      after: dedent`
        ---
        aliases: [Pratchett, "Sir Terry, Author", "1984"]
        ---
      `,
    },
    {
      testName: 'Merge into list adds aliases to the existing aliases using the alias array style',
      before: dedent`
        ---
        aliases: [Pratchett]
        ---
        aliases:: Sir Terry
      `,
      after: dedent`
        ---
        aliases:
          - Pratchett
          - Sir Terry
        ---
      `,
      options: {
        howToHandleExistingKeys: 'Merge into list',
        aliasArrayStyle: NormalArrayFormats.MultiLine,
      },
    },
    {
      testName: 'A field right after the YAML frontmatter at the end of the file is removed along with its line ending',
      before: dedent`
        ---
        title: Note
        ---
        status:: done
      `,
      after: dedent`
        ---
        title: Note
        status: done
        ---
      `,
    },
    {
      testName: 'Removing a field before a horizontal rule does not turn the rest of the body into frontmatter',
      before: dedent`
        status:: done
        ---
        Text
        ---
      `,
      after: dedent`
        ---
        status: done
        ---
        ---
        Text
        ---
      `,
    },
  ],
});
