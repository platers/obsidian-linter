import {ProtectedRanges, redactProtected} from '../src/utils/protected-ranges';

describe('protected context windows', () => {
  const text = '> ```\n> code\n> ```\n> $$';
  const ranges = new ProtectedRanges([{startIndex: 2, endIndex: text.indexOf('\n> $$')}]);

  it('hides a multiline fence while retaining its unprotected quote prefix', () => {
    expect(redactProtected(text, ranges, 0, text.indexOf('\n> $$'))).toBe('> {PROTECTED}');
  });

  it('clips redaction to a partially overlapping window', () => {
    expect(redactProtected(text, ranges, 4, 9)).toBe('{PROTECTED}');
  });

  it('does not redact a region merely touching the window', () => {
    expect(redactProtected(text, ranges, 0, 2)).toBe('> ');
    const start = text.indexOf('\n> $$');
    expect(redactProtected(text, ranges, start, text.length)).toBe('\n> $$');
  });

  it('leaves an empty window empty even inside protection', () => {
    expect(redactProtected(text, ranges, 4, 4)).toBe('');
  });

  it('redacts multiple regions without removing visible separators', () => {
    const protectedRanges = new ProtectedRanges([{startIndex: 0, endIndex: 3}, {startIndex: 4, endIndex: 7}]);
    expect(redactProtected('one two three', protectedRanges, 0, 13)).toBe('{PROTECTED} {PROTECTED} three');
  });
});
