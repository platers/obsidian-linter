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
    { // accounts for https://github.com/platers/obsidian-linter/issues/902
      testName: 'Re-indexing footnotes with `-` in their name should work',
      before: dedent`
        text [^numero]
        ${''}
        [^numero]: value
        ${''}
        more text [^num-1]
        [^num-1]: number 1
        more text2
      `,
      after: dedent`
        text [^1]
        ${''}
        [^1]: value
        ${''}
        more text [^2]
        [^2]: number 1
        more text2
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/902
      testName: 'Re-indexing footnotes with number and non-numbered names are properly handled',
      before: dedent`
        AAA[^1]
        ${''}
        BBB[^2]
        ${''}
        Something[^foo-bar]
        ${''}
        CCC[^hello-world]
        ${''}
        DDD[^3]
        ${''}
        [^foo-bar]: Some text.
        [^1]: A
        [^2]: B
        [^hello-world]: C
        [^3]: D
        ${''}
        More text.
      `,
      after: dedent`
        AAA[^2]
        ${''}
        BBB[^3]
        ${''}
        Something[^1]
        ${''}
        CCC[^4]
        ${''}
        DDD[^5]
        ${''}
        [^1]: Some text.
        [^2]: A
        [^3]: B
        [^4]: C
        [^5]: D
        ${''}
        More text.
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1006
      testName: 'Re-indexing footnotes with links as the referenced values should keep the references to text correlation',
      before: dedent`
        Paragraph 1. [^4]
        ${''}
        Paragraph 2. [^1]
        ${''}
        Paragraph 3. [^2]
        ${''}
        Paragraph 4. [^3]
        ${''}
        [^4]: [4444](4444)
        [^1]: [1111](111)
        [^2]: [2222](222)
        [^3]: [3333](333)
      `,
      after: dedent`
        Paragraph 1. [^1]
        ${''}
        Paragraph 2. [^2]
        ${''}
        Paragraph 3. [^3]
        ${''}
        Paragraph 4. [^4]
        ${''}
        [^1]: [4444](4444)
        [^2]: [1111](111)
        [^3]: [2222](222)
        [^4]: [3333](333)
      `,
    },
  ],
});
