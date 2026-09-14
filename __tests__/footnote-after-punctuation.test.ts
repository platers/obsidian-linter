import dedent from 'ts-dedent';
import FootnoteAfterPunctuation from '../src/rules/footnote-after-punctuation';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: FootnoteAfterPunctuation,
  testCases: [
    {
      testName: 'Leaves footnotes inside fenced code unchanged',
      before: '```\nText[^1].\n```\n\nText[^2].',
      after: '```\nText[^1].\n```\n\nText.[^2]',
    },
    {
      testName: 'Leaves footnotes inside a disabled section unchanged',
      before: '<!-- linter-disable -->\nText[^1].\n<!-- linter-enable -->\n\nText[^2].',
      after: '<!-- linter-disable -->\nText[^1].\n<!-- linter-enable -->\n\nText.[^2]',
    },
    { // fixes https://github.com/platers/obsidian-linter/issues/1112
      testName: 'Simple case',
      before: dedent`
        Some text[^test-me].
        Some text[^test.me].
        Some text[^test].
      `,
      after: dedent`
        Some text.[^test-me]
        Some text.[^test.me]
        Some text.[^test]
      `,
    },
  ],
});
