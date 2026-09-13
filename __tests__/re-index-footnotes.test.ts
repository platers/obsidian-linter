import ReIndexFootnotes from '../src/rules/re-index-footnotes';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import * as strings from '../src/utils/strings';

ruleTest({
  RuleBuilderClass: ReIndexFootnotes,
  testCases: [
    {
      testName: 'A footnote definition inside a fenced code block is not re-indexed',
      before: '[^hidden]\n\n```\n[^hidden]: code\n```',
      after: '[^hidden]\n\n```\n[^hidden]: code\n```',
    },
    {
      testName: 'A duplicate footnote key inside a code block does not count as a definition',
      before: '[^a]\n\n```\n[^a]: hidden\n```\n\n[^a]: visible',
      after: '[^1]\n\n```\n[^a]: hidden\n```\n\n[^1]: visible',
    },
    {
      testName: 'An identical definition inside a code block is not selected for replacement',
      before: '[^a]\n\n```\n[^a]: same\n```\n\n[^a]: same',
      after: '[^1]\n\n```\n[^a]: same\n```\n\n[^1]: same',
    },
    {
      testName: 'Backward reference discovery continues past inline code',
      before: '[^alpha] `[^alpha]`\n\n[^alpha]: first',
      after: '[^1] `[^alpha]`\n\n[^1]: first',
    },
    {
      testName: 'Renumbering different length keys leaves interspersed protected references intact',
      before: '[^alpha]\n\n[^alpha]: first\n\n```\n[^beta]\n```\n\n[^beta] `[^alpha]`\n\n[^beta]: second',
      after: '[^1]\n\n[^1]: first\n\n```\n[^beta]\n```\n\n[^2] `[^alpha]`\n\n[^2]: second',
    },
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

describe.each([
  {
    name: 'a reference inside a deleted definition',
    before: '[^a]: [^b]\n[^a]: [^b]\n[^b]: b',
    after: '[^1]: [^2]\n[^2]: b',
  },
  {
    name: 'adjacent duplicate deletions with multiple references',
    before: '[^a]: [^b] [^b]\n[^a]: [^b] [^b]\n[^a]: [^b] [^b]\n[^b]: b',
    after: '[^1]: [^2] [^2]\n[^2]: b',
  },
  {
    name: 'a reference inside a multiline duplicate definition',
    before: '[^a]: a\n    [^b]\n[^a]: a\n    [^b]\n[^b]: b',
    after: '[^1]: a\n    [^2]\n[^2]: b',
  },
  {
    name: 'protected references before and after duplicate deletions',
    before: '`[^b]`\n\n[^a]: [^b]\n[^a]: [^b]\n[^b]: b\n\n```\n[^b]\n```',
    after: '`[^b]`\n\n[^1]: [^2]\n[^2]: b\n\n```\n[^b]\n```',
  },
])('duplicate footnote definition edit ranges: $name', ({before, after}) => {
  it('does not reinsert a reference from a deleted duplicate definition', () => {
    expect(ReIndexFootnotes.getRule().apply(before)).toBe(after);
  });

  it('passes ascending, non-overlapping edits to replaceTextRanges', () => {
    const replaceTextRanges = jest.spyOn(strings, 'replaceTextRanges');
    try {
      ReIndexFootnotes.getRule().apply(before);
      expect(replaceTextRanges).toHaveBeenCalledTimes(1);
      const replacements = replaceTextRanges.mock.calls[0][1];
      for (let index = 1; index < replacements.length; index++) {
        expect(replacements[index - 1].endIndex).toBeLessThanOrEqual(replacements[index].startIndex);
      }
    } finally {
      replaceTextRanges.mockRestore();
    }
  });
});
