import TrailingSpaces from '../src/rules/trailing-spaces';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: TrailingSpaces,
  testCases: [
    {
      testName: 'Trailing whitespace inside a fenced code block is preserved',
      before: '```\ncode \t \n   \n```',
      after: '```\ncode \t \n   \n```',
    },
    {
      testName: 'Trailing whitespace immediately after a fenced code block is removed',
      before: '```\ncode\n```\nafter \t ',
      after: '```\ncode\n```\nafter',
    },
    {
      testName: 'An empty list item preserves one marker space',
      before: '-   ',
      after: '- ',
    },
    {
      testName: 'Trailing whitespace inside a disabled section is preserved',
      before: '<!-- linter-disable -->\nignored \t \n   \n<!-- linter-enable -->\nafter \t ',
      after: '<!-- linter-disable -->\nignored \t \n   \n<!-- linter-enable -->\nafter',
    },
    {
      testName: 'One trailing space removed',
      before: dedent`
        # H1 ${''}
        line with one trailing spaces ${''}
      `,
      after: dedent`
        # H1
        line with one trailing spaces
      `,
    },
    {
      testName: 'Three trailing whitespaces removed',
      before: dedent`
        # H1   ${''}
        line with three trailing spaces   ${''}
      `,
      after: dedent`
        # H1
        line with three trailing spaces
      `,
    },
    {
      testName: 'Tab-Space-Linebreak removed',
      before: dedent`
        # H1
        line with trailing tab and spaces    ${''}
        ${''}
      `,
      after: dedent`
        # H1
        line with trailing tab and spaces
        ${''}
      `,
      options: {
        twoSpaceLineBreak: true,
      },
    },
    {
      testName: 'Two Space Linebreak not removed',
      before: dedent`
        # H1
        line with one trailing spaces  ${''}
        ${''}
      `,
      after: dedent`
        # H1
        line with one trailing spaces  ${''}
        ${''}
      `,
      options: {
        twoSpaceLineBreak: true,
      },
    },
    {
      testName: 'Regular link with spaces stays the same',
      before: dedent`
        # Hello world
        ${''}
        [This has  spaces in it](File with  spaces.md)
      `,
      after: dedent`
        # Hello world
        ${''}
        [This has  spaces in it](File with  spaces.md)
      `,
    },
    {
      testName: 'Image link with spaces stays the same',
      before: dedent`
        # Hello world
        ${''}
        ![This has  spaces in it](File with  spaces.png)
      `,
      after: dedent`
        # Hello world
        ${''}
        ![This has  spaces in it](File with  spaces.png)
      `,
    },
    {
      testName: 'Wiki link with spaces stays the same',
      before: dedent`
        # Hello world
        ${''}
        [[File with  spaces]]
      `,
      after: dedent`
        # Hello world
        ${''}
        [[File with  spaces]]
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/868
      testName: 'A list item with no content should not have the space indicating it is a list item removed',
      before: dedent`
        - List item 1
        -${' '}
        -${'   '}
      `,
      after: dedent`
        - List item 1
        -${' '}
        -${' '}
      `,
    },
    { // relates to for https://github.com/platers/obsidian-linter/issues/868
      testName: 'Make sure that checklists are properly handled with trailing spaces',
      before: dedent`
        - [ ] List item 1
        - [ ]${' '}
        - [ ] ${'   '}
      `,
      after: dedent`
        - [ ] List item 1
        - [ ]${' '}
        - [ ]${' '}
      `,
    },
    { // relates to for https://github.com/platers/obsidian-linter/issues/868
      testName: 'Make sure that indented lists are properly handled with trailing spaces',
      before: dedent`
        Text here
        - List item 1
          -${' '}
          -${'   '}
      `,
      after: dedent`
        Text here
        - List item 1
          -${' '}
          -${' '}
      `,
    },
    { // relates to for https://github.com/platers/obsidian-linter/issues/868
      testName: 'Make sure that ordered lists are properly handled with trailing spaces',
      before: dedent`
        Text here
        1. List item 1
        2.${' '}
        3.${'   '}
      `,
      after: dedent`
        Text here
        1. List item 1
        2.${' '}
        3.${' '}
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1329
      testName: 'Make sure that we properly handle an empty list item when it is empty and has no spaces in it',
      before: dedent`
        Some text
        ${''}
        -
        ${''}
      `,
      after: dedent`
        Some text
        ${''}
        -
        ${''}
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1505
      testName: 'Make sure that whitespace only lines inside of lists are properly trimmed',
      before: dedent`
        Some text
         ${''}
        - List item 1
         ${''}
        1. List item 2
         ${''}
        > Blockquote
         ${''}
      `,
      after: dedent`
        Some text
        ${''}
        - List item 1
        ${''}
        1. List item 2
        ${''}
        > Blockquote
        ${''}
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1542
      testName: 'Whitespace only lines are emptied instead of being replaced with a literal "$1" when two space line break is enabled',
      before: dedent`
        Some text
        ${' '}
        More text
        ${'   '}
        Even more text
        ${'\t'}
        The end
      `,
      after: dedent`
        Some text
        ${''}
        More text
        ${''}
        Even more text
        ${''}
        The end
      `,
      options: {
        twoSpaceLineBreak: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1542
      testName: 'A whitespace only line of exactly two spaces is still preserved when two space line break is enabled',
      before: dedent`
        Some text
        ${'  '}
        More text
      `,
      after: dedent`
        Some text
        ${'  '}
        More text
      `,
      options: {
        twoSpaceLineBreak: true,
      },
    },
  ],
});

describe('protected-range compatibility', () => {
  it.each([
    {twoSpaceLineBreak: false, expected: '- a\n\n  b'},
    {twoSpaceLineBreak: true, expected: '- a  \n\n  b'},
  ])('does not corrupt paragraph-boundary whitespace with twoSpaceLineBreak = $twoSpaceLineBreak', ({twoSpaceLineBreak, expected}) => {
    // The old code left one trailing space when false and doubled two spaces to four when true:
    // Its list-text helper overlapped replacement ranges by walking backward across a blank line.
    expect(TrailingSpaces.getRule().apply('- a  \n\n  b', {twoSpaceLineBreak})).toBe(expected);
  });

  it.each([false, true])('handles whitespace runs across a list paragraph boundary with twoSpaceLineBreak = %j', (twoSpaceLineBreak) => {
    for (const whitespace of [' ', '  ', '   ', '\t', ' \t', '\t ', '\t\t', ' \t ', ' \t\t ']) {
      const trailingWhitespace = twoSpaceLineBreak && whitespace === '  ' ? whitespace : '';
      const emptyLineWhitespace = twoSpaceLineBreak && whitespace.length === 2 ? whitespace : '';
      const text = `- first${whitespace}\n${whitespace}\n  second${whitespace}`;
      const expected = `- first${trailingWhitespace}\n${emptyLineWhitespace}\n  second${trailingWhitespace}`;
      expect({text, output: TrailingSpaces.getRule().apply(text, {twoSpaceLineBreak})}).toEqual({text, output: expected});
    }
  });
});
