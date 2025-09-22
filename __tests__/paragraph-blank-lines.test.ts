import ParagraphBlankLines from '../src/rules/paragraph-blank-lines';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: ParagraphBlankLines,
  testCases: [
    {
      testName: 'Ignores codeblocks',
      before: dedent`
        ---
        front matter
        front matter
        ---
        ${''}
        Hello
        World
        \`\`\`python
        # comment not header
        a = b
        c = d
        \`\`\`
      `,
      after: dedent`
        ---
        front matter
        front matter
        ---
        ${''}
        Hello
        ${''}
        World
        ${''}
        \`\`\`python
        # comment not header
        a = b
        c = d
        \`\`\`
      `,
    },
    {
      testName: 'Handles lists',
      before: dedent`
        Hello
        World
        - 1
        \t- 2
            - 3
      `,
      after: dedent`
        Hello
        ${''}
        World
        ${''}
        - 1
        \t- 2
            - 3
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/250
      testName: 'Paragraphs that start with numbers are spaced out',
      before: dedent`
        # Hello world
        ${''}
        ${''}
        123 foo
        123 bar
      `,
      after: dedent`
        # Hello world
        ${''}
        123 foo
        ${''}
        123 bar
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/250
      testName: 'Paragraphs that start with foreign characters are spaced out',
      before: dedent`
        # Hello world
        ${''}
        ${''}
        测试 foo
        测试 bar
      `,
      after: dedent`
        # Hello world
        ${''}
        测试 foo
        ${''}
        测试 bar
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/250
      testName: 'Paragraphs that start with whitespace characters are spaced out',
      before: dedent`
        # Hello world
        ${''}
        foo
        bar
      `,
      after: dedent`
        # Hello world
        ${''}
        foo
        ${''}
        bar
      `,
    },
    {
      testName: 'Make sure blockquotes are not affected',
      before: dedent`
        # Hello world
        ${''}
        > blockquote
        > blockquote line 2
      `,
      after: dedent`
        # Hello world
        ${''}
        > blockquote
        > blockquote line 2
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/669
      testName: 'Make sure blockquotes that have a value starting with the blockquote indicator and no whitespace after are not affected',
      before: dedent`
        # Hello world
        ${''}
        > blockquote
        >blockquote line 2
      `,
      after: dedent`
        # Hello world
        ${''}
        > blockquote
        >blockquote line 2
      `,
    },
    {
      testName: 'Make sure lists are not affected',
      before: dedent`
        # Hello world
        ${''}
        - List item 1
        - List item 2
      `,
      after: dedent`
        # Hello world
        ${''}
        - List item 1
        - List item 2
      `,
    },
    {
      testName: 'Make sure lines ending in a line break are not affected',
      before: dedent`
        # Hello world
        ${''}
        ${''}
        paragraph line 1 <br>
        paragraph line 2  ${''}
        paragraph line 3 <br/>
        paragraph line 4 \\
        paragraph final line
        ${''}
        ${''}
      `,
      after: dedent`
        # Hello world
        ${''}
        paragraph line 1 <br>
        paragraph line 2  ${''}
        paragraph line 3 <br/>
        paragraph line 4 \\
        paragraph final line
        ${''}
      `,
    },
    {
      testName: 'Make sure obsidian multiline comments are not affected',
      before: dedent`
        Here is some inline comments: %%You can't see this text%% (Can't see it)
        ${''}
        Here is a block comment:
        %%
        It can span
        multiple lines
        %%
      `,
      after: dedent`
        Here is some inline comments: %%You can't see this text%% (Can't see it)
        ${''}
        Here is a block comment:
        ${''}
        %%
        It can span
        multiple lines
        %%
      `,
    },
    {
      testName: 'Preserves trailing line break',
      before: dedent`
        Line followed by line break
        ${''}
      `,
      after: dedent`
        Line followed by line break
        ${''}
      `,
    },
    {
      testName: 'Doesn\'t add trailing line break',
      before: dedent`
        Line not followed by line break
      `,
      after: dedent`
        Line not followed by line break
      `,
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/300
      testName: 'Make sure obsidian multiline comments with single line comment prior is not affected',
      before: dedent`
        %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %% nocomment
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
      `,
      after: dedent`
        %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %%
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
        ${''}
        # A %% fold %% nocomment
        ${''}
        ## R
        ${''}
        %%
        HW:: --
        T:: 0
        %%
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/517
      testName: 'Table followed by header should only have 1 line after it',
      before: dedent`
        ### 常量
        ${''}
        |  \`[[Link]]\`         |  A link to the file named "Link"  |
        |:--------------------|:----------------------------------|
        |  \`[[Link]]\`         |  A link to the file named "Link"  |
        |  \`[1, 2, 3]\`        |  A list of numbers 1, 2, and 3    |
        |  \`[[1, 2],[3, 4]]\`  |  A list of lists                  |
        |  \`{ a: 1, b: 2 }\`   |  An object                        |
        |  \`date()\`           |                                   |
        |  \`dur()\`            |                                   |
        ${''}
        ### 表达式
      `,
      after: dedent`
        ### 常量
        ${''}
        |  \`[[Link]]\`         |  A link to the file named "Link"  |
        |:--------------------|:----------------------------------|
        |  \`[[Link]]\`         |  A link to the file named "Link"  |
        |  \`[1, 2, 3]\`        |  A list of numbers 1, 2, and 3    |
        |  \`[[1, 2],[3, 4]]\`  |  A list of lists                  |
        |  \`{ a: 1, b: 2 }\`   |  An object                        |
        |  \`date()\`           |                                   |
        |  \`dur()\`            |                                   |
        ${''}
        ### 表达式
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/704
      testName: 'Make sure that an empty list indicator does not have an extra empty line added around it',
      before: dedent`
        ## Attendees
        ${''}
        -${' '}
        ${''}
        ## Agenda
      `,
      after: dedent`
        ## Attendees
        ${''}
        -${' '}
        ${''}
        ## Agenda
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/787
      testName: 'Make sure that an empty list indicator does not have an extra empty line added around it',
      before: dedent`
        - reference to footnote 1 [^1]
        - reference to footnote 2 [^2]
        - reference to footnote 3 [^3]
        ${''}
        [^1]: [github.com](https://github.com)
        [^2]: [github.com](https://github.com)
        [^3]: [github.com](https://github.com)
      `,
      after: dedent`
        - reference to footnote 1 [^1]
        - reference to footnote 2 [^2]
        - reference to footnote 3 [^3]
        ${''}
        [^1]: [github.com](https://github.com)
        [^2]: [github.com](https://github.com)
        [^3]: [github.com](https://github.com)
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/902
      testName: 'Make sure that if a footnote definition has a dash in it it is properly treated like a footnote definition and the paragraph is ignored',
      before: dedent`
        AAA[^2]
        ${''}
        BBB[^3]
        ${''}
        Something[^test-foot]
        ${''}
        CCC[^4]
        ${''}
        DDD[^5]
        ${''}
        More text.
        ${''}
        [^test-foot]: Some text.
        [^2]: A
        [^3]: B
        [^4]: C
        [^5]: D
      `,
      after: dedent`
        AAA[^2]
        ${''}
        BBB[^3]
        ${''}
        Something[^test-foot]
        ${''}
        CCC[^4]
        ${''}
        DDD[^5]
        ${''}
        More text.
        ${''}
        [^test-foot]: Some text.
        [^2]: A
        [^3]: B
        [^4]: C
        [^5]: D
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/999
      testName: 'Make sure that tables with escaped pipes in them are ignored',
      before: dedent`
        | 1 | 2 |
        | --- | --- |
        | 3 | 4 |

        | [[2024-01-25\\|Thursday]] | [[2024-01-26\\|Friday]] |
        | --- | --- |
        | 3 | 4 |
      `,
      after: dedent`
        | 1 | 2 |
        | --- | --- |
        | 3 | 4 |

        | [[2024-01-25\\|Thursday]] | [[2024-01-26\\|Friday]] |
        | --- | --- |
        | 3 | 4 |
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1014
      testName: 'List items starting with `*` as the indicator should not be affected',
      before: dedent`
        * abc
        \tabc
        \tbb
      `,
      after: dedent`
        * abc
        \tabc
        \tbb
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1014
      testName: 'List items starting with `+` as the indicator should not be affected',
      before: dedent`
        + abc
        \tabc
        \tbb
      `,
      after: dedent`
        + abc
        \tabc
        \tbb
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1014
      testName: 'Ordered list items with an end style of `)` should not be affected',
      before: dedent`
        1) abc
        \tabc
        \tbb
      `,
      after: dedent`
        1) abc
        \tabc
        \tbb
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1014
      testName: 'Checklists should not be affected',
      before: dedent`
        - [ ] abc
        \tabc
        \tbb
        ${''}
        - [x] abc
        \tabc
        \tbb
        ${''}
        - [y] abc
        \tabc
        \tbb
        1) [ ] abc
        \tabc
        \tbb
        ${''}
        2. [x] abc
        \tabc
        \tbb
        ${''}
        3) [y] abc
        \tabc
        \tbb
      `,
      after: dedent`
        - [ ] abc
        \tabc
        \tbb
        ${''}
        - [x] abc
        \tabc
        \tbb
        ${''}
        - [y] abc
        \tabc
        \tbb
        1) [ ] abc
        \tabc
        \tbb
        ${''}
        2. [x] abc
        \tabc
        \tbb
        ${''}
        3) [y] abc
        \tabc
        \tbb
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1014
      testName: 'Indented checklists should not be affected',
      before: dedent`
        - [ ] abc
        \t- [ ] abc
        \t\tabc
        \t\tbb
        ${''}
          + [x] abc
          \tabc
          \tbb
        ${''}
        \t8) [y] abc
        \t\tabc
        \t\tbb
      `,
      after: dedent`
        - [ ] abc
        \t- [ ] abc
        \t\tabc
        \t\tbb
        ${''}
          + [x] abc
          \tabc
          \tbb
        ${''}
        \t8) [y] abc
        \t\tabc
        \t\tbb
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1014
      testName: 'Indented list items should not be affected',
      before: dedent`
        - abc
        \t- abc
        \t\tabc
        \t\tbb
        ${''}
          + abc
          \tabc
          \tbb
        ${''}
        \t* [y] abc
        \t\tabc
        \t\tbb
      `,
      after: dedent`
        - abc
        \t- abc
        \t\tabc
        \t\tbb
        ${''}
          + abc
          \tabc
          \tbb
        ${''}
        \t* [y] abc
        \t\tabc
        \t\tbb
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1395
      testName: 'A paragraph starting with an asterisk for either italics or bold should have a blank line added',
      before: dedent`
        # Header
        **emphasis** blah blah...
        *italics* more content here...
        abcabc
      `,
      after: dedent`
        # Header
        ${''}
        **emphasis** blah blah...
        ${''}
        *italics* more content here...
        ${''}
        abcabc
      `,
    },
  ],
});
