import {ProtectedRanges, LintContext} from '../src/utils/protected-ranges';
import {IgnoreTypes} from '../src/utils/ignore-types';

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
