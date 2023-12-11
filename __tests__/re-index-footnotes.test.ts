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
    { // accounts for https://github.com/platers/obsidian-linter/issues/902
      testName: 'Re-indexing footnotes does not move the footnote references',
      before: dedent`
        foo [^1]
        ${''}
        [^1]: bar
        ${''}
        foobar
      `,
      after: dedent`
        foo [^1]
        ${''}
        [^1]: bar
        ${''}
        foobar
      `,
    },
  ],
});

