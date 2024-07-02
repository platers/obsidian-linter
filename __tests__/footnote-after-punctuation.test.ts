import dedent from 'ts-dedent';
import FootnoteAfterPunctuation from '../src/rules/footnote-after-punctuation';
import { ruleTest } from './common';

ruleTest({
  RuleBuilderClass: FootnoteAfterPunctuation,
  testCases: [
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
