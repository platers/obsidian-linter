import YamlTitle from '../src/rules/yaml-title';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: YamlTitle,
  testCases: [
    {
      testName: 'Keeps unescaped title if possible',
      before: dedent`
        # Hello world
      `,
      after: dedent`
        ---
        title: Hello world
        ---
        # Hello world
      `,
    },
    {
      testName: 'Escapes title if it contains colon followed by space',
      before: dedent`
        # Hello: world
      `,
      after: dedent`
        ---
        title: "Hello: world"
        ---
        # Hello: world
      `,
    },
    {
      testName: 'Escapes title if it starts with single quote',
      before: dedent`
        # 'Hello world
      `,
      after: dedent`
        ---
        title: "'Hello world"
        ---
        # 'Hello world
      `,
    },
    {
      testName: 'Escapes title if it starts with double quote',
      before: dedent`
        # "Hello world
      `,
      after: dedent`
        ---
        title: '"Hello world'
        ---
        # "Hello world
      `,
    },
    {
      testName: 'Does not insert line breaks for long title',
      before: dedent`
        # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      `,
      after: dedent`
        ---
        title: Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
        ---
        # Very long title 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
      `,
    },
    { // similar to https://github.com/platers/obsidian-linter/issues/449
      testName: 'Make sure that links in headings are properly copied to the YAML when there is a link prior to the first H1',
      before: dedent`
        [[Link1]]

        # [[Heading]]
      `,
      after: dedent`
        ---
        title: Heading
        ---
        [[Link1]]

        # [[Heading]]
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/470
      testName: 'Make sure that markdown links in title get converted to text',
      before: dedent`
        ---
        title: This is a [Heading](test heading.md)
        ---
        # This is a [Heading](test heading.md)
      `,
      after: dedent`
        ---
        title: This is a Heading
        ---
        # This is a [Heading](test heading.md)
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/470
      testName: 'Make sure that wiki links in title get converted to text',
      before: dedent`
        ---
        title: This is a [[Heading]]
        ---
        # This is a [[Heading]]
      `,
      after: dedent`
        ---
        title: This is a Heading
        ---
        # This is a [[Heading]]
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/519
      testName: 'Make sure that the first header is captured even if another header precedes it.',
      before: dedent`
        ### not the title

        # Title
      `,
      after: dedent`
        ---
        title: Title
        ---
        ### not the title

        # Title
      `,
    },
    {
      testName: 'Tag after first header is not considered as a part of the title',
      before: dedent`
        # title
        #tag
      `,
      after: dedent`
        ---
        title: title
        ---
        # title
        #tag
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/604
      testName: 'Make sure that aliased wiki links are properly converted to just the alias in the YAML',
      before: dedent`
        # [[Broken Linter|Broken]] Linter
      `,
      after: dedent`
        ---
        title: Broken Linter
        ---
        # [[Broken Linter|Broken]] Linter
      `,
    },
    {
      testName: 'Escapes title if it starts with exclamation mark',
      before: dedent`
        # !title
      `,
      after: dedent`
        ---
        title: "!title"
        ---
        # !title
      `,
    },
    {
      testName: 'Escapes title if it starts with at sign',
      before: dedent`
        # @title
      `,
      after: dedent`
        ---
        title: "@title"
        ---
        # @title
      `,
    },
    {
      testName: 'Escapes title if it contains hash',
      before: dedent`
        # prefix #title
      `,
      after: dedent`
        ---
        title: "prefix #title"
        ---
        # prefix #title
      `,
    },
    {
      testName: 'Escapes title if it starts with percent',
      before: dedent`
        # %title
      `,
      after: dedent`
        ---
        title: "%title"
        ---
        # %title
      `,
    },
    {
      testName: 'Escapes title if it starts with ampersand',
      before: dedent`
        # &title
      `,
      after: dedent`
        ---
        title: "&title"
        ---
        # &title
      `,
    },
    {
      testName: 'Escapes title if it starts with asterisk',
      before: dedent`
        # *title
      `,
      after: dedent`
        ---
        title: "*title"
        ---
        # *title
      `,
    },
    {
      testName: 'Escapes title if it starts with hyphen followed by space',
      before: dedent`
        # - title
      `,
      after: dedent`
        ---
        title: "- title"
        ---
        # - title
      `,
    },
    {
      testName: 'Escapes title if it starts with left square bracket',
      before: dedent`
        # [title
      `,
      after: dedent`
        ---
        title: "[title"
        ---
        # [title
      `,
    },
    {
      testName: 'Escapes title if it starts with right square bracket',
      before: dedent`
        # ]title
      `,
      after: dedent`
        ---
        title: "]title"
        ---
        # ]title
      `,
    },
    {
      testName: 'Escapes title if it starts with left curly bracket',
      before: dedent`
        # {title
      `,
      after: dedent`
        ---
        title: "{title"
        ---
        # {title
      `,
    },
    {
      testName: 'Escapes title if it starts with right curly bracket',
      before: dedent`
        # }title
      `,
      after: dedent`
        ---
        title: "}title"
        ---
        # }title
      `,
    },
    {
      testName: 'Escapes title if it starts with vertical bar',
      before: dedent`
        # |title
      `,
      after: dedent`
        ---
        title: "|title"
        ---
        # |title
      `,
    },
    {
      testName: 'Escapes title if it starts with greater-than sign',
      before: dedent`
        # >title
      `,
      after: dedent`
        ---
        title: ">title"
        ---
        # >title
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/941
      testName: 'Escapes title if it has a hashtag in it that is not escaped and make sure that the link is properly parsed when it has a hashtag in it',
      before: dedent`
        # [test #1](github.com/platers/obsidian-linter)
      `,
      after: dedent`
        ---
        title: "test #1"
        ---
        # [test #1](github.com/platers/obsidian-linter)
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/941
      testName: 'Escapes title if it has a hashtag in it that is not escaped',
      before: dedent`
        # test #2
      `,
      after: dedent`
        ---
        title: "test #2"
        ---
        # test #2
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/941
      testName: 'Properly gets simple link text out and put in the title',
      before: dedent`
        # [test 3](github.com/platers/obsidian-linter)
      `,
      after: dedent`
        ---
        title: test 3
        ---
        # [test 3](github.com/platers/obsidian-linter)
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/941
      testName: 'Make sure that pulling out an escaped hashtag in link text works properly',
      before: dedent`
        # [test \#4](github.com/platers/obsidian-linter)
      `,
      after: dedent`
        ---
        title: "test \#4"
        ---
        # [test \#4](github.com/platers/obsidian-linter)
      `,
    },
    {
      testName: 'Only matches and replaces the correct title key, not similar keys',
      before: dedent`
        ---
        title2: ShouldNotChange
        title: ShouldChange
        ---
        # Hello world
      `,
      after: dedent`
        ---
        title2: ShouldNotChange
        title: Hello world
        ---
        # Hello world
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1428
      testName: 'Unescapes H1 markdown special characters',
      before: dedent`
        # Escape \\[\\_\\]
      `,
      after: dedent`
        ---
        title: Escape [_]
        ---
        # Escape \\[\\_\\]
      `,
    },
  ],
});
