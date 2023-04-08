import ReIndexFootnotes from '../src/rules/re-index-footnotes';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: ReIndexFootnotes,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/641
      testName: 'Inline code should not be affected by re-indexing footnotes',
      before: dedent`
        \`h[^ae]llo\`
      `,
      after: dedent`
        \`h[^ae]llo\`
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/359
      testName: 'Out of order references are sorted into their proper our based on the order in which they first appear in the file',
      before: dedent`
        aaaaaa[^1]
        cccccc[^3]
        ddddd[^4]
        bbbbb[^2]
        fffffff[^5]
        ${''}
        [^1]: a-footnote
        [^2]: b-footnote
        [^3]: c-footnote
        [^4]: d-footnote
        [^5]: f-footnote
      `,
      after: dedent`
        aaaaaa[^1]
        cccccc[^2]
        ddddd[^3]
        bbbbb[^4]
        fffffff[^5]
        ${''}
        [^1]: a-footnote
        [^2]: c-footnote
        [^3]: d-footnote
        [^4]: b-footnote
        [^5]: f-footnote
      `,
    },
  ],
});

