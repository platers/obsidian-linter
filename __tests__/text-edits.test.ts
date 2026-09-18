import {applyNonOverlappingReplacements} from '../src/utils/text-edits';

describe('applyNonOverlappingReplacements', () => {
  it('leaves the text unchanged when there are no replacements', () => {
    const text = 'unchanged 😀\r\n';
    expect(applyNonOverlappingReplacements(text, [])).toBe(text);
  });

  it('sorts disjoint replacements before applying original UTF-16 offsets', () => {
    const replacements = [
      {startIndex: 6, endIndex: 7, value: '!'},
      {startIndex: 2, endIndex: 3, value: 'long'},
    ];
    expect(applyNonOverlappingReplacements('😀a\r\nbc', replacements)).toBe('😀long\r\nb!');
  });

  it('allows adjacent replacements and deletions', () => {
    const replacements = [
      {startIndex: 2, endIndex: 4, value: ''},
      {startIndex: 0, endIndex: 2, value: 'A'},
    ];
    expect(applyNonOverlappingReplacements('abcdef', replacements)).toBe('Aef');
  });

  it('sorts insertions before replacements at the same start and preserves insertion order', () => {
    const replacements = [
      {startIndex: 1, endIndex: 2, value: 'B'},
      {startIndex: 1, endIndex: 1, value: 'first'},
      {startIndex: 1, endIndex: 1, value: 'second'},
      {startIndex: 2, endIndex: 2, value: 'last'},
    ];
    expect(applyNonOverlappingReplacements('abc', replacements)).toBe('afirstsecondBlastc');
  });

  it.each([
    [{startIndex: 2, endIndex: 4, value: ''}, {startIndex: 1, endIndex: 3, value: ''}],
    [{startIndex: 1, endIndex: 4, value: ''}, {startIndex: 2, endIndex: 3, value: ''}],
    [{startIndex: 1, endIndex: 3, value: ''}, {startIndex: 1, endIndex: 3, value: ''}],
    [{startIndex: 1, endIndex: 4, value: ''}, {startIndex: 2, endIndex: 2, value: 'insert'}],
  ])('rejects overlapping replacements %j and %j', (first, second) => {
    expect(() => applyNonOverlappingReplacements('abcde', [first, second]))
        .toThrow('Rule replacements must be ordered and non-overlapping');
  });
});
