import RemoveHyphenatedLineBreaks from '../src/rules/remove-hyphenated-line-breaks';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveHyphenatedLineBreaks,
  testCases: [
    {
      testName: 'Leaves hyphenated text inside fenced code alone',
      before: '```\nline- break\nline‐ break\n```\nline- break',
      after: '```\nline- break\nline‐ break\n```\nlinebreak',
    },
    {
      testName: 'Leaves hyphenated text inside disabled sections alone',
      before: '<!-- linter-disable -->\nline- break\nline‐ break\n<!-- linter-enable -->\nline‐ break',
      after: '<!-- linter-disable -->\nline- break\nline‐ break\n<!-- linter-enable -->\nlinebreak',
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
  ],
});
