import RemoveHyphenatedLineBreaks from '../src/rules/remove-hyphenated-line-breaks';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveHyphenatedLineBreaks,
  testCases: [
    {
      testName: 'Leaves hyphenated text inside fenced code alone',
      before: '```\nline-\nbreak\nline‐\nbreak\n```\nline-\nbreak',
      after: '```\nline-\nbreak\nline‐\nbreak\n```\nlinebreak',
    },
    {
      testName: 'Leaves hyphenated text inside disabled sections alone',
      before: '<!-- linter-disable -->\nline-\nbreak\nline‐\nbreak\n<!-- linter-enable -->\nline‐\nbreak',
      after: '<!-- linter-disable -->\nline-\nbreak\nline‐\nbreak\n<!-- linter-enable -->\nlinebreak',
    },
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/241
      testName: 'Make sure text ending in a hyphen followed by a link does not trigger the hyphenated line break rule',
      before: dedent`
        # Hello world
        ${''}
        Paragraph contents are here- [link text](pathToFile/file.md)
        Paragraph contents are here- [[file]]
      `,
      after: dedent`
        # Hello world
        ${''}
        Paragraph contents are here- [link text](pathToFile/file.md)
        Paragraph contents are here- [[file]]
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1662
      testName: 'Make sure a hyphen followed by a space and no line break is left alone',
      before: dedent`
        Berg- und Wanderschuhe
        Ein- und Ausgang
      `,
      after: dedent`
        Berg- und Wanderschuhe
        Ein- und Ausgang
      `,
    },
    {
      testName: 'Removes a hyphenated line break that has trailing whitespace before the line break',
      before: 'This text has a line-  \nbreak.',
      after: 'This text has a linebreak.',
    },
    {
      testName: 'Does not join a hyphenated word across a blank line',
      before: dedent`
        This paragraph ends with a hyphen-
        ${''}
        New paragraph.
      `,
      after: dedent`
        This paragraph ends with a hyphen-
        ${''}
        New paragraph.
      `,
    },
    {
      testName: 'Does not join a heading that ends in a hyphen with the following line',
      before: dedent`
        # Heading-
        text
      `,
      after: dedent`
        # Heading-
        text
      `,
    },
  ],
});
