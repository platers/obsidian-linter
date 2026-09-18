import RemoveSpaceAroundCharacters from '../src/rules/remove-space-around-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: RemoveSpaceAroundCharacters,
  testCases: [
    { // accounts for https://github.com/platers/obsidian-linter/issues/344
      testName: 'Make sure that lists with a dollar sign in them actually get escaped correctly',
      before: dedent`
        # Title
        ${''}
        - lorem \`$\` ipsum
        ${''}
      `,
      after: dedent`
        # Title
        ${''}
        - lorem \`$\` ipsum
        ${''}
      `,
    },
    {
      testName: 'Fullwidth characters can be excluded',
      before: dedent`
        Spaces around fullwidth Ａ are preserved
      `,
      after: dedent`
        Spaces around fullwidth Ａ are preserved
      `,
      options: {
        includeFullwidthForms: false,
      },
    },
    {
      testName: 'CJK symbols and punctuations can be excluded',
      before: dedent`
        Spaces around 《 are preserved
      `,
      after: dedent`
        Spaces around 《 are preserved
      `,
      options: {
        includeCJKSymbolsAndPunctuation: false,
      },
    },
    {
      testName: 'Dashes can be excluded',
      before: dedent`
        Spaces around en dash – and em dash — are preserved
      `,
      after: dedent`
        Spaces around en dash – and em dash — are preserved
      `,
      options: {
        includeDashes: false,
      },
    },
    {
      testName: 'Custom symbols can be added',
      before: dedent`
        Spaces around custom symbols : are ; removed
      `,
      after: dedent`
        Spaces around custom symbols:are;removed
      `,
      options: {
        otherSymbols: ':;',
      },
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/826
      testName: 'Make sure that inline code is left alone',
      before: dedent`
        \`Spaces around custom symbols : are ; left alone\`
      `,
      after: dedent`
        \`Spaces around custom symbols : are ; left alone\`
      `,
      options: {
        otherSymbols: ':;',
      },
    },
    { // accounts for to https://github.com/platers/obsidian-linter/issues/1127
      testName: 'Make sure that a header does not get spaces removed in some situations with CJK',
      before: dedent`
        ## テスト
      `,
      after: dedent`
        ## テスト
      `,
      options: {
        includeCJKSymbolsAndPunctuation: true,
      },
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/1280
      testName: 'Make sure that heading text is handled properly and keeps the heading as valid',
      before: dedent`
        ## 「example here」 More text here
      `,
      after: dedent`
        ## 「example here」More text here
      `,
      options: {
        includeCJKSymbolsAndPunctuation: true,
      },
    },
  ],
});

describe('protected-range compatibility', () => {
  it.each(['', '- ', '# '])('does not use protected punctuation as an anchor with prefix %j', (prefix) => {
    const text = prefix + 'text [link](url) text';
    expect(RemoveSpaceAroundCharacters.getRule().apply(text, {otherSymbols: '[]()'})).toBe(text);
  });

  it('removes spaces beside heading links without editing their contents', () => {
    expect(RemoveSpaceAroundCharacters.getRule().apply('# Ａ [link Ｂ](url) Ｃ')).toBe('# Ａ[link Ｂ](url)Ｃ');
  });
});

describe('headings with decoded values absent from the source', () => {
  it.each([
    '# A &amp; Ｂ text',
    '# A &amp; Ｂ [link](url)',
    '# A &amp; Ｂ `code`',
    '# &#65; Ｂ text',
    '# A \\* Ｂ text',
  ])('leaves %j unchanged instead of corrupting the document', (text) => {
    // The old helper used indexOf === -1 as an offset and wrote a corrupted document.
    expect(RemoveSpaceAroundCharacters.getRule().apply(text)).toBe(text);
  });

  it('still processes other headings and body text', () => {
    const text = '# A &amp; Ｂ [link](url)\n\ntext Ｃ text\n\n## Ｄ heading';
    expect(RemoveSpaceAroundCharacters.getRule().apply(text)).toBe('# A &amp; Ｂ [link](url)\n\ntextＣtext\n\n## Ｄheading');
  });
});
