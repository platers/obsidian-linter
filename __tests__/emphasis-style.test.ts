import EmphasisStyle from '../src/rules/emphasis-style';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
import StrongStyle from '../src/rules/strong-style';
import {makeEmphasisOrBoldConsistent, MDAstTypes} from '../src/utils/mdast';
import {ProtectedRanges} from '../src/utils/protected-ranges';

ruleTest({
  RuleBuilderClass: EmphasisStyle,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/380
      testName: 'Make sure inline math is unaffected',
      before: dedent`
        - $m_{pq} = \int^{\infty}_{-\infty}\int^{\infty}_{-\infty} x^p y^q f(x,y) dxdy$
      `,
      after: dedent`
        - $m_{pq} = \int^{\infty}_{-\infty}\int^{\infty}_{-\infty} x^p y^q f(x,y) dxdy$
      `,
      options: {style: 'asterisk'},
    },
  ],
});

describe.each([
  {name: 'emphasis', RuleBuilderClass: EmphasisStyle, type: MDAstTypes.Italics, marker: '*', alternate: '_'},
  {name: 'strong', RuleBuilderClass: StrongStyle, type: MDAstTypes.Bold, marker: '**', alternate: '__'},
])('$name protected-range compatibility', ({RuleBuilderClass, type, marker, alternate}) => {
  it.each([
    `[${marker}hidden${marker}](url)`,
    `[[${marker}hidden${marker}]]`,
    `$${marker}hidden${marker}$`,
    `\`\`\`\n${marker}hidden${marker}\n\`\`\``,
    `<!-- linter-disable -->\n${marker}hidden${marker}\n<!-- linter-enable -->`,
  ])('chooses consistent style from the first unprotected node after %j', (ignored) => {
    const text = `${ignored}\n\n${alternate}first${alternate} ${marker}last${marker}`;
    const expected = `${ignored}\n\n${alternate}first${alternate} ${alternate}last${alternate}`;
    expect(RuleBuilderClass.getRule().apply(text, {style: 'consistent'})).toBe(expected);
  });

  it.each(['consistent', 'asterisk', 'underscore'])('leaves an all-protected document unchanged with style %s', (style) => {
    const text = `[${marker}hidden${marker}](url) [[${alternate}hidden${alternate}]]`;
    expect(RuleBuilderClass.getRule().apply(text, {style})).toBe(text);
  });

  it('leaves a document without matching nodes unchanged', () => {
    expect(RuleBuilderClass.getRule().apply('plain text', {style: 'consistent'})).toBe('plain text');
  });

  it('still rewrites formatting that encloses a protected link', () => {
    // Enclosing a link leaves both delimiters visible; formatting enclosed by the link is ignored.
    const text = `${marker}[link](url)${marker}`;
    expect(RuleBuilderClass.getRule().apply(text, {style: 'underscore'})).toBe(`${alternate}[link](url)${alternate}`);
  });

  it('can choose consistent style from formatting that encloses a protected link', () => {
    const text = `${marker}[link](url)${marker} ${alternate}last${alternate}`;
    expect(RuleBuilderClass.getRule().apply(text, {style: 'consistent'})).toBe(`${marker}[link](url)${marker} ${marker}last${marker}`);
  });

  it.each(['opening', 'closing'])('skips a node when only part of its %s delimiter is protected', (side) => {
    const first = `${marker}first${marker}`;
    const text = `${first} ${alternate}last${alternate}`;
    const startIndex = side === 'opening' ? marker.length - 1 : first.length - 1;
    const protectedRanges = new ProtectedRanges([{startIndex, endIndex: startIndex + 1}]);
    expect(makeEmphasisOrBoldConsistent(text, 'consistent', type, protectedRanges)).toBe(text);
  });
});
