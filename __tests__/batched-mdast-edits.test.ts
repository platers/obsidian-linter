import {removeSpacesInLinkText, UnorderedListItemStyles, updateUnorderedListItemIndicators} from '../src/utils/mdast';
import {ProtectedRanges} from '../src/utils/protected-ranges';
import * as strings from '../src/utils/strings';

describe('batched mdast edits', () => {
  it.each([
    {
      before: '- outer\n  + inner\n    - deepest\n- sibling',
      after: '* outer\n  * inner\n    * deepest\n* sibling',
      style: UnorderedListItemStyles.Asterisk,
    },
    {
      before: '- - nested on the same line\n- [ ] checkbox\n  + child\n\n1. ordered',
      after: '+ + nested on the same line\n- [ ] checkbox\n  + child\n\n1. ordered',
      style: UnorderedListItemStyles.Plus,
    },
    {
      before: '+ first\n  - nested\n* last',
      after: '+ first\n  + nested\n+ last',
      style: UnorderedListItemStyles.Consistent,
    },
  ])('batches disjoint bullets in %j', ({before, after, style}) => {
    const replaceTextRanges = jest.spyOn(strings, 'replaceTextRanges');
    try {
      expect(updateUnorderedListItemIndicators(before, style, new ProtectedRanges([]))).toBe(after);
      expect(replaceTextRanges).toHaveBeenCalledTimes(1);
      const replacements = replaceTextRanges.mock.calls[0][1];
      for (const replacement of replacements) {
        expect(replacement.endIndex).toBe(replacement.startIndex + 1);
      }
      for (let index = 1; index < replacements.length; index++) {
        expect(replacements[index - 1].startIndex).toBeLessThan(replacements[index].startIndex);
        expect(replacements[index - 1].endIndex).toBeLessThanOrEqual(replacements[index].startIndex);
      }
    } finally {
      replaceTextRanges.mockRestore();
    }
  });

  it('keeps protected bullets out of the batch and consistent-style selection', () => {
    const text = '- hidden\n+ first\n* last';
    const protectedRanges = new ProtectedRanges([{startIndex: 0, endIndex: 1}]);
    expect(updateUnorderedListItemIndicators(text, UnorderedListItemStyles.Consistent, protectedRanges)).toBe('- hidden\n+ first\n+ last');
  });

  it('batches links with different amounts of whitespace in ascending, non-overlapping order', () => {
    const text = '[ first ](one) [   second   ](two) [third](three)';
    const replaceTextRanges = jest.spyOn(strings, 'replaceTextRanges');
    try {
      expect(removeSpacesInLinkText(text, new ProtectedRanges([]))).toBe('[first](one) [second](two) [third](three)');
      expect(replaceTextRanges).toHaveBeenCalledTimes(1);
      const replacements = replaceTextRanges.mock.calls[0][1];
      expect(replacements).toHaveLength(3);
      for (let index = 1; index < replacements.length; index++) {
        expect(replacements[index - 1].startIndex).toBeLessThan(replacements[index].startIndex);
        expect(replacements[index - 1].endIndex).toBeLessThanOrEqual(replacements[index].startIndex);
      }
    } finally {
      replaceTextRanges.mockRestore();
    }
  });

  it('leaves protected links and autolinks unchanged', () => {
    const text = '[ hidden ](one) [ visible ](two) <https://example.com>';
    const protectedRanges = new ProtectedRanges([{startIndex: 0, endIndex: 15}]);
    expect(removeSpacesInLinkText(text, protectedRanges)).toBe('[ hidden ](one) [visible](two) <https://example.com>');
  });
});
