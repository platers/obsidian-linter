import {IgnoreType, IgnoreTypes, ignoreListOfTypes} from '../src/utils/ignore-types';
import SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers from '../src/rules/space-between-chinese-japanese-or-korean-and-english-or-numbers';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

const roundTripCases: {name: string, text: string, ignoreTypes: IgnoreType[]}[] = [
  { // accounts for emphasis positions that overlap each other
    name: 'overlapping emphasis',
    text: '*)*g**',
    ignoreTypes: [IgnoreTypes.italics, IgnoreTypes.bold],
  },
  {
    name: 'emphasis nested in emphasis',
    text: 'an *outer *inner* emphasis* here',
    ignoreTypes: [IgnoreTypes.italics],
  },
  {
    name: 'strong and emphasis sharing delimiters',
    text: 'some ***bold italics*** here',
    ignoreTypes: [IgnoreTypes.italics, IgnoreTypes.bold],
  },
  {
    name: 'strong nested in strong',
    text: '**a **b** c**',
    ignoreTypes: [IgnoreTypes.bold],
  },
  {
    name: 'nested blockquotes',
    text: dedent`
      > outer quote
      > > inner quote
      > > > innermost quote
      ${''}
      after
    `,
    ignoreTypes: [IgnoreTypes.blockquote],
  },
  {
    name: 'nested lists',
    text: dedent`
      - level one
        - level two
          - level three
      ${''}
      after
    `,
    ignoreTypes: [IgnoreTypes.list],
  },
  { // mdast types are masked together, so a node of one type nested in another must still restore
    name: 'inline code nested inside emphasis',
    text: 'an *emphasis with `code` inside* it',
    ignoreTypes: [IgnoreTypes.italics, IgnoreTypes.inlineCode],
  },
  {
    name: 'the same types declared in the opposite order',
    text: 'an *emphasis with `code` inside* it',
    ignoreTypes: [IgnoreTypes.inlineCode, IgnoreTypes.italics],
  },
  {
    name: 'a link nested inside emphasis alongside a heading',
    text: '# A heading\n\n*emphasis with [a link](https://example.com) inside*\n',
    ignoreTypes: [IgnoreTypes.heading, IgnoreTypes.italics, IgnoreTypes.link],
  },
  {
    name: 'a code block inside a list inside a blockquote',
    text: '> - an item\n>   ```js\n>   const a = 1;\n>   ```\n',
    ignoreTypes: [IgnoreTypes.blockquote, IgnoreTypes.list, IgnoreTypes.code],
  },
  {
    name: 'the emphasis that was corrupted in a real document',
    text: 'maps hardware devices from your host system*(the physical computer you are installing this program onto)* into the container',
    ignoreTypes: [IgnoreTypes.italics, IgnoreTypes.bold],
  },
];

describe('ignore types are masked in a canonical order', () => {
  // An anchor tag is two separate html nodes, an opening and a closing one, which do not cover the
  // url between them. The anchor has to be masked before html or the url is left exposed, and this
  // has to hold however the rule happened to declare the two types.
  const anchor = '<a href="https://www.google.com" target="_blank">https://www.google.com</a>';

  it('masks anchor tags before html when declared in that order', () => {
    expect(ignoreListOfTypes([IgnoreTypes.anchorTag, IgnoreTypes.html], anchor, (text) => {
      expect(text).not.toContain('https://www.google.com');
      return text;
    })).toBe(anchor);
  });

  it('masks anchor tags before html even when declared the other way round', () => {
    expect(ignoreListOfTypes([IgnoreTypes.html, IgnoreTypes.anchorTag], anchor, (text) => {
      expect(text).not.toContain('https://www.google.com');
      return text;
    })).toBe(anchor);
  });

  it('masks yaml before thematic breaks so frontmatter is not treated as a horizontal rule', () => {
    const text = '---\ntitle: a\n---\n\n---\n\nbody\n';

    expect(ignoreListOfTypes([IgnoreTypes.thematicBreak, IgnoreTypes.yaml], text, (masked) => {
      expect(masked).toContain('---\n---');
      return masked;
    })).toBe(text);
  });
});

describe('masking restores text containing overlapping positions', () => {
  for (const testCase of roundTripCases) {
    it(testCase.name, () => {
      expect(ignoreListOfTypes(testCase.ignoreTypes, testCase.text, (text) => text)).toBe(testCase.text);
    });
  }

  it('never leaves a placeholder behind in the restored text', () => {
    for (const testCase of roundTripCases) {
      expect(ignoreListOfTypes(testCase.ignoreTypes, testCase.text, (text) => text)).not.toContain('PLACEHOLDER');
    }
  });
});

ruleTest({
  RuleBuilderClass: SpaceBetweenChineseJapaneseOrKoreanAndEnglishOrNumbers,
  testCases: [
    { // accounts for the text duplication reported when emphasis positions overlap
      testName: 'overlapping emphasis is left alone instead of being duplicated',
      before: '*)*g**',
      after: '*)*g**',
    },
    {
      testName: 'emphasis containing parentheses is not duplicated',
      before: 'maps hardware devices from your host system*(the physical computer you are installing this program onto)* into the container',
      after: 'maps hardware devices from your host system*(the physical computer you are installing this program onto)* into the container',
    },
    {
      testName: 'spacing is still added between CJK and english',
      before: '中文English',
      after: '中文 English',
    },
    {
      testName: 'spacing is still added inside emphasis',
      before: '*中文English*',
      after: '*中文 English*',
    },
    {
      testName: 'spacing is still added inside strong',
      before: '**中文English**',
      after: '**中文 English**',
    },
  ],
});
