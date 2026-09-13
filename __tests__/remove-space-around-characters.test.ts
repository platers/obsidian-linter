import RemoveSpaceAroundCharacters from '../src/rules/remove-space-around-characters';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import {ignoreListOfTypes, IgnoreTypes} from '../src/utils/ignore-types';
import {updateHeaderText, updateListItemText} from '../src/utils/mdast';
import {escapeRegExp} from '../src/utils/regex';

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
  const documents = [
    'text \t Ａ \t text — more 「 text 」',
    '# Ａ title Ｂ\n\n## 「 text 」 ##',
    '# lead **bold Ａ** Ｂ tail\n\n# *only Ａ*',
    '# \\* Ａ text',
    '  Ａ title Ｂ\n  ==========\n\ntext Ｃ text',
    '> ## 「 text 」\n>\n> text Ａ text',
    '-   Ａ text\n- [ ] 「 task 」\n- [?] 「 task 」\n-   [?] 「 task 」',
    '- item Ａ text\n  - nested Ｂ text\n\n  ## 「 heading 」\n\n  paragraph Ｃ text',
    '# Ａ [link](url) Ｂ `code Ｃ` Ｄ [[wiki Ｅ]] Ｆ #tag',
    '# [link Ａ](url)\n\n# `code Ｂ`\n\n# [[wiki Ｃ]]',
    '- Ａ [link](url) Ｂ `code Ｃ` Ｄ\n\ntext Ｅ [link](url) Ｆ',
    '<!-- linter-disable -->\n# Ａ text\n- Ｂ text\n<!-- linter-enable -->\n\n# Ｃ text',
  ];

  it.each(documents)('matches legacy output for %j', (text) => {
    const builder = new RemoveSpaceAroundCharacters();
    const options = builder.buildRuleOptions();
    let symbols = '';
    if (options.includeFullwidthForms) symbols += '\uff01-\uff5e';
    if (options.includeCJKSymbolsAndPunctuation) symbols += '\u3000-\u303f';
    if (options.includeDashes) symbols += '\u2013\u2014';
    symbols += escapeRegExp(options.otherSymbols);
    const before = new RegExp(`([ \t])+([${symbols}])`, 'g');
    const after = new RegExp(`([${symbols}])([ \t])+`, 'g');
    const replace = (value: string): string => value.replace(before, '$2').replace(after, '$1');
    const expected = ignoreListOfTypes(builder.ignoreTypes, text, (value) => {
      const outsideListsAndHeadings = ignoreListOfTypes([IgnoreTypes.list, IgnoreTypes.heading], value, replace);
      return updateHeaderText(updateListItemText(outsideListsAndHeadings, replace), replace);
    });

    expect(RemoveSpaceAroundCharacters.getRule().apply(text)).toBe(expected);
  });

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
