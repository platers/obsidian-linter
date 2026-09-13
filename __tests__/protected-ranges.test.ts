import dedent from 'ts-dedent';
import {ProtectedRanges, LintContext} from '../src/utils/protected-ranges';
import {IgnoreType, IgnoreTypes, ignoreListOfTypes} from '../src/utils/ignore-types';
import {escapeRegExp} from '../src/utils/regex';
import {rules} from '../src/rules';
import {setLanguage} from '../src/lang/helpers';
import '../src/rules-registry';

describe('protected ranges', () => {
  it('treats a change overlapping a range as protected', () => {
    const ranges = new ProtectedRanges([{startIndex: 10, endIndex: 20}]);

    expect(ranges.isProtected(10, 20)).toBe(true);
    expect(ranges.isProtected(5, 11)).toBe(true);
    expect(ranges.isProtected(19, 25)).toBe(true);
    expect(ranges.isProtected(12, 14)).toBe(true);
    expect(ranges.isProtected(0, 10)).toBe(false);
    expect(ranges.isProtected(20, 30)).toBe(false);
  });

  it('allows an insertion against the edge of a range but not inside it', () => {
    const ranges = new ProtectedRanges([{startIndex: 10, endIndex: 20}]);

    expect(ranges.isProtected(10, 10)).toBe(false);
    expect(ranges.isProtected(20, 20)).toBe(false);
    expect(ranges.isProtected(15, 15)).toBe(true);
  });

  it('collapses overlapping and nested ranges into the outermost one', () => {
    const ranges = new ProtectedRanges([
      {startIndex: 2, endIndex: 5},
      {startIndex: 0, endIndex: 6},
      {startIndex: 6, endIndex: 9},
      {startIndex: 20, endIndex: 25},
    ]);

    expect(ranges.ranges).toEqual([{startIndex: 0, endIndex: 9}, {startIndex: 20, endIndex: 25}]);
  });

  it('finds the ranges of an ignore type without the whitespace in front of a tag', () => {
    const text = 'a #tag and #another\n';
    const ranges = new LintContext(text).protectedRangesFor([IgnoreTypes.tag]).ranges;

    expect(ranges).toEqual([{startIndex: 2, endIndex: 6}, {startIndex: 11, endIndex: 19}]);
    expect(text.substring(ranges[0].startIndex, ranges[0].endIndex)).toBe('#tag');
    expect(text.substring(ranges[1].startIndex, ranges[1].endIndex)).toBe('#another');
  });

  it('protects only the first match of an ignore type whose expression is not global', () => {
    const text = '---\ntitle: a\n---\n\nbody\n\n---\n';
    const ranges = new LintContext(text).protectedRangesFor([IgnoreTypes.yaml]).ranges;

    expect(ranges).toEqual([{startIndex: 0, endIndex: 16}]);
  });
});

// A placeholder is its type's template with a fixed width unique suffix put just inside it, so a
// template plus that width matches every placeholder the type produced and nothing else. The two
// rules that read placeholder text out of a masked document build their expressions the same way.
const uniqueSuffixLength = 16;

function placeholderRegexFor(ignoreType: IgnoreType): string {
  const placeholder = ignoreType.placeholder;
  // the yaml placeholder is the literal `---\n---` rather than a unique string, so there is no
  // suffix to allow for
  if (placeholder.includes('---')) {
    return escapeRegExp(placeholder);
  }

  if (placeholder.endsWith('}')) {
    return escapeRegExp(placeholder.substring(0, placeholder.length - 1)) + `[\\s\\S]{${uniqueSuffixLength}}` + escapeRegExp('}');
  }

  return escapeRegExp(placeholder) + `[\\s\\S]{${uniqueSuffixLength}}`;
}

/**
 * The document with everything masking hid taken out of it.
 *
 * Masking rewrites the document, so the regions it hides are expressed against a document that no
 * longer exists and cannot be compared with ranges over the original. What can be compared is what
 * is left: taking the placeholders out of the masked document leaves exactly the text masking let
 * a rule see, and taking the protected ranges out of the original has to leave the same text.
 * @param {string} text The document before masking
 * @param {IgnoreType[]} ignoreTypes The types to mask
 * @return {string} The masked document with every placeholder removed
 */
function textMaskingLeavesVisible(text: string, ignoreTypes: IgnoreType[]): string {
  let maskedText = text;
  ignoreListOfTypes(ignoreTypes, text, (textAfterIgnore: string) => {
    maskedText = textAfterIgnore;

    return textAfterIgnore;
  });

  const placeholders = new RegExp(ignoreTypes.map((ignoreType) => `(?:${placeholderRegexFor(ignoreType)})`).join('|'), 'g');

  return maskedText.replace(placeholders, '');
}

function textTheIndexLeavesWritable(text: string, ignoreTypes: IgnoreType[]): string {
  const segments: string[] = [];
  let endOfLastRange = 0;

  for (const range of new LintContext(text).protectedRangesFor(ignoreTypes).ranges) {
    segments.push(text.substring(endOfLastRange, range.startIndex));
    endOfLastRange = range.endIndex;
  }

  segments.push(text.substring(endOfLastRange));

  return segments.join('');
}

const documents: {name: string, text: string}[] = [
  {name: 'an anchor tag wrapping a bare url', text: 'See <a href="https://example.com/a">https://example.com/a</a> for more.\n'},
  {name: 'frontmatter followed by a thematic break', text: '---\ntitle: a title\n---\n\n---\n\nbody\n'},
  {name: 'a templater command containing markdown', text: 'before\n\n<% tp.file.include("[[a note]]") %>\n\nafter\n'},
  {name: 'nested emphasis reporting overlapping positions', text: '*)*g**\n'},
  {name: 'nested blockquotes with empty lines in them', text: '> > a\n> >\n> > b\n>\n> c\n\nafter\n'},
  {name: 'nested lists', text: '- one\n  - two\n    - three\n1. first\n   1. second\n\nafter\n'},
  {name: 'footnotes referenced out of order', text: 'a[^2] and b[^1].\n\n[^1]: the first note\n\n[^2]: the second note\n'},
  {name: 'a custom ignore section', text: 'before\n\n<!-- linter-disable -->\n#  a heading\n<!-- linter-enable -->\n\nafter\n'},
  {name: 'a table next to a thematic break', text: '| a | b |\n| --- | --- |\n| 1 | 2 |\n---\nafter\n'},
  {name: 'math and inline math sharing a line', text: 'text $$x = 1$$ more\n\n$$\ny = 2\n$$\n\nafter\n'},
  {name: 'code fences and inline code', text: '```js\nconst a = 1;\n```\n\nsome `inline code` here\n'},
  {name: 'wiki links and tags next to urls', text: 'A [[wiki link]] and #a-tag and https://example.com/b and [a link](https://example.com/c).\n'},
  {name: 'an obsidian multiline comment', text: 'before\n\n%%\na comment with a #tag\n%%\n\nafter\n'},
  {name: 'the empty document', text: ''},
  {
    name: 'a mix of the constructs the rules tend to fight over',
    text: dedent`
      ---
      title: a title
      ---
      ${''}
      # Heading!!
      ${''}
      > a quote
      ${''}
      - a list
        - nested
      ${''}
      \`\`\`js
      const a = 1;
      \`\`\`
      ${''}
      Some *emphasis* and **strong** and \`code\` and [a link](https://example.com) and ![an image](a.png).
    `,
  },
];

describe('the protected range index hides what masking hid', () => {
  beforeAll(() => {
    setLanguage('en');
  });

  // Every rule declares the types it must not change, and masking is what currently enforces that.
  // The index replaces masking, so for the sets of types the rules actually ask for it has to
  // protect the same characters. A difference here is the cause of a difference in the linted
  // document, and is far easier to read about at this level than as a diff of two documents.
  const ignoreTypeSets = new Map<string, IgnoreType[]>();
  for (const rule of rules) {
    if (rule.ignoreTypes.length > 0) {
      ignoreTypeSets.set(rule.alias, rule.ignoreTypes);
    }
  }

  it('for every document every rule has examples of', () => {
    const differences: string[] = [];

    for (const rule of rules) {
      let index = 0;
      for (const example of rule.examples) {
        const name = `${rule.alias} example ${index++}`;
        for (const [alias, ignoreTypes] of ignoreTypeSets) {
          const masked = textMaskingLeavesVisible(example.before, ignoreTypes);
          const indexed = textTheIndexLeavesWritable(example.before, ignoreTypes);

          if (masked !== indexed) {
            differences.push(`${name} under ${alias}\n  masking left ${JSON.stringify(masked)}\n  the index left ${JSON.stringify(indexed)}`);
          }
        }
      }
    }

    expect(differences).toEqual([]);
  });

  for (const document of documents) {
    it(document.name, () => {
      const differences: string[] = [];

      for (const [alias, ignoreTypes] of ignoreTypeSets) {
        const masked = textMaskingLeavesVisible(document.text, ignoreTypes);
        const indexed = textTheIndexLeavesWritable(document.text, ignoreTypes);

        if (masked !== indexed) {
          differences.push(`${alias}\n  masking left ${JSON.stringify(masked)}\n  the index left ${JSON.stringify(indexed)}`);
        }
      }

      expect(differences).toEqual([]);
    });
  }
});
