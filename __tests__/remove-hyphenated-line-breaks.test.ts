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
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/1662
      testName: 'Make sure a hyphen followed by a space but no line break is left alone',
      before: dedent`
        Berg- und Wanderschuhe
        Berg‐ und Wanderschuhe
        This text has a hyphen- ${''}
        ${''}
        next paragraph
      `,
      after: dedent`
        Berg- und Wanderschuhe
        Berg‐ und Wanderschuhe
        This text has a hyphen- ${''}
        ${''}
        next paragraph
      `,
    },
    {
      testName: 'Removes a hyphenated line break with trailing whitespace',
      before: dedent`
        This text has a linebr- ${''}
        eak.
      `,
      after: dedent`
        This text has a linebreak.
      `,
    },
  ],
});
