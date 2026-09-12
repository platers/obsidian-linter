import {IgnoreType, IgnoreTypes, ignoreListOfTypes} from '../src/utils/ignore-types';
import dedent from 'ts-dedent';

const roundTripCases: {name: string, text: string, ignoreTypes: IgnoreType[]}[] = [
  {
    name: 'no matches at all',
    text: 'just some plain text with nothing to ignore',
    ignoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.image, IgnoreTypes.link],
  },
  {
    name: 'a single match',
    text: 'text with `one` inline code span',
    ignoreTypes: [IgnoreTypes.inlineCode],
  },
  {
    name: 'adjacent matches with nothing between them',
    text: 'text `a``b``c` end',
    ignoreTypes: [IgnoreTypes.inlineCode],
  },
  {
    name: 'a match at the very start and at the very end of the text',
    text: '`start` middle `end`',
    ignoreTypes: [IgnoreTypes.inlineCode],
  },
  {
    name: 'many matches',
    text: Array.from({length: 250}, (_, i) => `line ${i} with \`code ${i}\` and [a link ${i}](https://example.com/${i})`).join('\n'),
    ignoreTypes: [IgnoreTypes.inlineCode, IgnoreTypes.link],
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
  {
    name: 'nested emphasis inside strong',
    text: 'some **bold with *italics* inside** text',
    ignoreTypes: [IgnoreTypes.bold, IgnoreTypes.italics],
  },
  {
    name: 'code and math blocks inside a list',
    text: dedent`
      - an item
        \`\`\`js
        const a = 1;
        \`\`\`
      - another item
        $$
        x = 1
        $$
    `,
    ignoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.list],
  },
  {
    name: 'images, links and inline code nested within each other',
    text: 'a [link with ![an image](https://example.com/i.png) inside](https://example.com) and `code`',
    ignoreTypes: [IgnoreTypes.image, IgnoreTypes.link, IgnoreTypes.inlineCode],
  },
  {
    name: 'yaml frontmatter plus content',
    text: dedent`
      ---
      title: a title
      ---
      ${''}
      # Heading
      ${''}
      \`code\` and a #tag
    `,
    ignoreTypes: [IgnoreTypes.yaml, IgnoreTypes.inlineCode, IgnoreTypes.tag, IgnoreTypes.heading],
  },
  {
    name: 'crlf line endings',
    text: '# Heading\r\n\r\n`code`\r\n\r\n> quote\r\n',
    ignoreTypes: [IgnoreTypes.heading, IgnoreTypes.inlineCode, IgnoreTypes.blockquote],
  },
  {
    name: 'astral unicode and combining characters',
    text: 'emoji 👨‍👩‍👧‍👦 and `code with 𝔘𝔫𝔦𝔠𝔬𝔡𝔢` and e\u0301 combining',
    ignoreTypes: [IgnoreTypes.inlineCode],
  },
  {
    name: 'dollar sign replacement sequences inside ignored content',
    text: 'text `$& $\' $` $$ literal` more',
    ignoreTypes: [IgnoreTypes.inlineCode],
  },
  {
    name: 'a table',
    text: dedent`
      | a | b |
      |---|---|
      | 1 | 2 |
      ${''}
      after
    `,
    ignoreTypes: [IgnoreTypes.table],
  },
];

describe('masking round trips', () => {
  for (const testCase of roundTripCases) {
    it(`restores the original text for ${testCase.name}`, () => {
      expect(ignoreListOfTypes(testCase.ignoreTypes, testCase.text, (text) => text)).toBe(testCase.text);
    });
  }

  it('restores the original text for nested blockquotes', () => {
    const text = dedent`
      > outer quote
      > > inner quote
      > > > innermost quote
      ${''}
      after
    `;

    expect(ignoreListOfTypes([IgnoreTypes.blockquote], text, (maskedText) => maskedText)).toBe(text);
  });

  it('hides the ignored content from the rule callback', () => {
    let seenByRule = '';
    ignoreListOfTypes([IgnoreTypes.inlineCode], 'before `secret` after', (text) => {
      seenByRule = text;
      return text;
    });

    expect(seenByRule).not.toContain('secret');
    expect(seenByRule).toContain('INLINE_CODE_BLOCK_PLACEHOLDER');
  });

  it('still restores when the rule changes the case of the placeholder', () => {
    const text = 'before `secret` after';

    expect(ignoreListOfTypes([IgnoreTypes.inlineCode], text, (maskedText) => maskedText.toUpperCase())).toBe('BEFORE `secret` AFTER');
  });

  it('still restores when the rule deletes surrounding text', () => {
    expect(ignoreListOfTypes([IgnoreTypes.inlineCode], 'before `secret` after', (text) => text.replace('before ', ''))).toBe('`secret` after');
  });
});

describe('placeholder generation', () => {
  it('produces the same masked text every time the same text is masked', () => {
    const text = dedent`
      # Heading
      ${''}
      \`\`\`js
      const a = 1;
      \`\`\`
      ${''}
      Some [link](https://example.com) and \`inline\` content.
    `;

    const maskedTexts = new Set<string>();
    for (let i = 0; i < 5; i++) {
      ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.link, IgnoreTypes.inlineCode], text, (maskedText) => {
        maskedTexts.add(maskedText);
        return maskedText;
      });
    }

    expect(maskedTexts.size).toBe(1);
  });

  it('does not reuse a placeholder that already appears in the document', () => {
    const text = dedent`
      \`\`\`js
      const a = 1;
      \`\`\`
    `;

    let generatedPlaceholder = '';
    ignoreListOfTypes([IgnoreTypes.code], text, (maskedText) => {
      generatedPlaceholder = maskedText.trim();
      return maskedText;
    });

    const textContainingThePlaceholder = `${generatedPlaceholder}\n\n${text}`;

    expect(ignoreListOfTypes([IgnoreTypes.code], textContainingThePlaceholder, (maskedText) => {
      expect(maskedText.indexOf(generatedPlaceholder)).toBe(maskedText.lastIndexOf(generatedPlaceholder));
      return maskedText;
    })).toBe(textContainingThePlaceholder);
  });

  it('keeps nested ignoreListOfTypes calls from colliding with the outer placeholders', () => {
    const text = 'outer `code` and [a link](https://example.com) here';

    expect(ignoreListOfTypes([IgnoreTypes.inlineCode], text, (outerText) => {
      return ignoreListOfTypes([IgnoreTypes.link], outerText, (innerText) => innerText);
    })).toBe(text);
  });
});
