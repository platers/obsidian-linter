import {
  splitIntoSentences,
  DEFAULT_SENTENCE_TERMINATORS,
  DEFAULT_ABBREVIATIONS,
  UNAMBIGUOUS_TERMINATORS,
} from '../src/utils/sentence-splitting';

const T = DEFAULT_SENTENCE_TERMINATORS;
const A = DEFAULT_ABBREVIATIONS;

// A realistic regular-link placeholder (matches getNewPlaceHolder output shape).
const LINK = '{REGULAR_LINK_PLACEHOLDER' + 'lk3n9q1z' + '}';
const CODE = '{INLINE_CODE_BLOCK_PLACEHOLDER' + 'c0d3z9a1' + '}';
const TAG = '#tag-placeholder' + 'tg7h2k1p';

describe('splitIntoSentences', () => {
  describe('basic behavior', () => {
    it('splits a simple multi-sentence string', () => {
      expect(splitIntoSentences('Hello world. Goodbye now.', T, A)).toEqual([
        'Hello world.',
        'Goodbye now.',
      ]);
    });

    it('leaves a single sentence untouched', () => {
      expect(splitIntoSentences('Just one sentence.', T, A)).toEqual([
        'Just one sentence.',
      ]);
    });

    it('splits on ? and !', () => {
      expect(splitIntoSentences('Really? Yes! Done.', T, A)).toEqual([
        'Really?',
        'Yes!',
        'Done.',
      ]);
    });

    it('idempotent shape: re-splitting joined output is stable', () => {
      const once = splitIntoSentences('A first one. A second one.', T, A);
      const logical = once.join(' ');
      expect(splitIntoSentences(logical, T, A)).toEqual(once);
    });
  });

  describe('atom opacity (invariant 1 / B2 / B3 / M2)', () => {
    it('treats a sentence that starts with a link atom as a valid start', () => {
      expect(
          splitIntoSentences(`This ends. ${LINK} starts it.`, T, A),
      ).toEqual(['This ends.', `${LINK} starts it.`]);
    });

    it('B2: initial before a link atom (default options) does not split', () => {
      expect(
          splitIntoSentences(`Edited by J. ${LINK} here.`, T, A),
      ).toEqual([`Edited by J. ${LINK} here.`]);
    });

    it('B3: custom terminators that occur inside a placeholder never split it', () => {
      expect(
          splitIntoSentences(`See ${CODE} now. Done.`, '.0_', []),
      ).toEqual([`See ${CODE} now.`, 'Done.']);
    });

    it('B3: a custom "-" terminator does not split inside a tag placeholder', () => {
      expect(splitIntoSentences(`A ${TAG} Z`, '-', [])).toEqual([
        `A ${TAG} Z`,
      ]);
    });

    it('B3: regex-metachar terminators are literal and do not crash', () => {
      expect(splitIntoSentences('a [x] b', ']', [])).toEqual(['a [x] b']);
      expect(splitIntoSentences('a{b}c', '{}', [])).toEqual(['a{b}c']);
      expect(splitIntoSentences('back\\slash here', '\\', [])).toEqual([
        'back\\slash here',
      ]);
    });

    it('M2: a `.` inside an inline HTML attribute is opaque', () => {
      expect(
          splitIntoSentences(
              'Text <abbr title="e.g. foo. Bar">x</abbr>. Next.',
              T,
              A,
          ),
      ).toEqual(['Text <abbr title="e.g. foo. Bar">x</abbr>.', 'Next.']);
    });

    it('M2: a mid-line <br> is an opaque atom, not a forced split', () => {
      expect(splitIntoSentences('foo <br> bar baz', T, [])).toEqual([
        'foo <br> bar baz',
      ]);
    });

    it('M2: an HTML comment is opaque', () => {
      expect(
          splitIntoSentences('Keep <!-- e.g. a. b. --> together. Done.', T, A),
      ).toEqual(['Keep <!-- e.g. a. b. --> together.', 'Done.']);
    });

    it('an angle-bracket-wrapped URL placeholder is one opaque atom', () => {
      const AUTOLINK = `<${'{URL_PLACEHOLDER' + 'u9r1l2k3' + '}'}>`;
      expect(
          splitIntoSentences(`Before. ${AUTOLINK} starts here.`, T, A),
      ).toEqual(['Before.', `${AUTOLINK} starts here.`]);
    });

    it('a raw URL autolink is one opaque atom', () => {
      expect(
          splitIntoSentences('See this. <https://example.com> is it.', T, A),
      ).toEqual(['See this.', '<https://example.com> is it.']);
    });

    it('an email autolink is one opaque atom', () => {
      expect(
          splitIntoSentences('Email me. <foo@bar.com> works fine.', T, A),
      ).toEqual(['Email me.', '<foo@bar.com> works fine.']);
    });
  });

  describe('whitespace gate by terminator class (B4)', () => {
    it('B4: CJK terminators split with no following whitespace', () => {
      expect(splitIntoSentences('这是一句。这是另一句。', '。！？', [])).toEqual([
        '这是一句。',
        '这是另一句。',
      ]);
    });

    it('B4: half-width "." directly before CJK is not split (accepted)', () => {
      expect(splitIntoSentences('句子.句子', '.', [])).toEqual(['句子.句子']);
    });

    it('ambiguous "." with no following whitespace does not split', () => {
      expect(splitIntoSentences('3.14 is pi', '.', [])).toEqual(['3.14 is pi']);
    });

    it('UNAMBIGUOUS_TERMINATORS contains the CJK/full-width marks', () => {
      for (const ch of '。！？') {
        expect(UNAMBIGUOUS_TERMINATORS.includes(ch)).toBe(true);
      }
    });
  });

  describe('suppression guards', () => {
    it('abbreviations including multi-dot are not split internally', () => {
      expect(
          splitIntoSentences(
              'We use e.g. apples and i.e. oranges. Done.',
              T,
              A,
          ),
      ).toEqual(['We use e.g. apples and i.e. oranges.', 'Done.']);
    });

    it('a.m./p.m. and U.S. abbreviations suppress', () => {
      expect(
          splitIntoSentences('Meet at 9 a.m. in the U.S. office today.', T, A),
      ).toEqual(['Meet at 9 a.m. in the U.S. office today.']);
    });

    it('single-letter initials are not split', () => {
      expect(
          splitIntoSentences('J. R. R. Tolkien wrote books.', T, A),
      ).toEqual(['J. R. R. Tolkien wrote books.']);
    });

    it('M5: U.S.A. advances correctly and splits at the true end', () => {
      expect(
          splitIntoSentences('I love the U.S.A. It rocks.', T, A),
      ).toEqual(['I love the U.S.A.', 'It rocks.']);
    });

    it('decimals and versions are not split', () => {
      expect(
          splitIntoSentences('Pi is 3.14 and v1.2.3 is old. Yes.', T, A),
      ).toEqual(['Pi is 3.14 and v1.2.3 is old.', 'Yes.']);
    });

    it('M5: a long run of dots does not hang or crash', () => {
      expect(splitIntoSentences('....', T, [])).toEqual(['....']);
      expect(splitIntoSentences('Wait.... Done.', T, [])).toEqual([
        'Wait....',
        'Done.',
      ]);
    });
  });

  describe('trailing closers (M8)', () => {
    it('boundary lands after a closing quote', () => {
      expect(
          splitIntoSentences('He said "Go." Then left.', T, A),
      ).toEqual(['He said "Go."', 'Then left.']);
    });

    it('M8: inline footnote ref is a trailing closer', () => {
      expect(
          splitIntoSentences('See the end.[^1] Next part.', T, A),
      ).toEqual(['See the end.[^1]', 'Next part.']);
    });

    it('M8: a raw reference link splits after the bracket', () => {
      expect(
          splitIntoSentences('See [the doc][d]. Next.', T, A),
      ).toEqual(['See [the doc][d].', 'Next.']);
    });

    it('M8: "]" configured as a terminator does not split inside [x]', () => {
      expect(splitIntoSentences('a [x] b', ']', [])).toEqual(['a [x] b']);
    });
  });

  describe('ellipsis', () => {
    it('the … glyph splits before an uppercase start', () => {
      expect(splitIntoSentences('Wait… Really?', T, A)).toEqual([
        'Wait…',
        'Really?',
      ]);
    });

    it('the … glyph does not split before a lowercase word', () => {
      expect(splitIntoSentences('Hmm… and then more', T, A)).toEqual([
        'Hmm… and then more',
      ]);
    });
  });

  describe('next-start classification (accepted imprecision)', () => {
    it('a lowercase-starting next sentence is not split (accepted)', () => {
      expect(
          splitIntoSentences('Buy it now. iOS rocks here.', T, A),
      ).toEqual(['Buy it now. iOS rocks here.']);
    });

    it('M7: a lone capital genuinely ending a sentence is not split (accepted)', () => {
      expect(
          splitIntoSentences('Choose plan B. Then pay now.', T, A),
      ).toEqual(['Choose plan B. Then pay now.']);
    });

    it('an abbreviation that genuinely ends a sentence is not split (accepted)', () => {
      expect(
          splitIntoSentences('I work at Foo Inc. We are great here.', T, A),
      ).toEqual(['I work at Foo Inc. We are great here.']);
    });

    it('next start behind an opening quote is recognized', () => {
      expect(
          splitIntoSentences('He left. "Yes," she said.', T, A),
      ).toEqual(['He left.', '"Yes," she said.']);
    });
  });

  describe('option handling', () => {
    it('empty terminators makes the splitter a no-op', () => {
      expect(splitIntoSentences('A. B. C.', '', A)).toEqual(['A. B. C.']);
      expect(splitIntoSentences('A. B. C.', '   ', A)).toEqual(['A. B. C.']);
    });

    it('custom terminators replace the default set', () => {
      expect(splitIntoSentences('One; Two; Three', ';', [])).toEqual([
        'One;',
        'Two;',
        'Three',
      ]);
    });

    it('a custom abbreviation suppresses a split', () => {
      expect(
          splitIntoSentences('Send to addr. Now please.', '.', ['addr.']),
      ).toEqual(['Send to addr. Now please.']);
      expect(
          splitIntoSentences('Send to addr. Now please.', '.', []),
      ).toEqual(['Send to addr.', 'Now please.']);
    });

    it('astral (multi-code-unit) terminators are ignored, not silently broken', () => {
      // an emoji terminator never matches; the rule degrades to a no-op rather
      // than accepting-but-never-splitting on it
      expect(splitIntoSentences('A😀 B😀 C', '😀', [])).toEqual(['A😀 B😀 C']);
      // a BMP terminator alongside it still works; the emoji is plain text
      expect(
          splitIntoSentences('End😀 here. More here😀 done.', '.😀', []),
      ).toEqual(['End😀 here.', 'More here😀 done.']);
    });

    it('DEFAULT_ABBREVIATIONS is a non-empty string array', () => {
      expect(Array.isArray(DEFAULT_ABBREVIATIONS)).toBe(true);
      expect(DEFAULT_ABBREVIATIONS.length).toBeGreaterThan(0);
      expect(DEFAULT_ABBREVIATIONS).toContain('e.g.');
      expect(DEFAULT_ABBREVIATIONS).toContain('U.S.');
    });
  });
});
