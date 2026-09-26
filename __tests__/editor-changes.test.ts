import DiffMatchPatch from 'diff-match-patch';
import {diffToEditorChanges, EditorChangeSpec} from '../src/utils/editor-changes';

function applyChanges(text: string, changes: EditorChangeSpec[]): string {
  let delta = 0;
  for (const {from, to = from, insert = ''} of changes) {
    text = text.slice(0, from + delta) + insert + text.slice(to + delta);
    delta += insert.length - (to - from);
  }
  return text;
}

function expectOrderedChanges(oldText: string, changes: EditorChangeSpec[]) {
  let previousEnd = 0;
  for (const {from, to = from} of changes) {
    expect(from).toBeGreaterThanOrEqual(previousEnd);
    expect(to).toBeGreaterThanOrEqual(from);
    expect(to).toBeLessThanOrEqual(oldText.length);
    previousEnd = to;
  }
}

describe('diffToEditorChanges', () => {
  const differ = new DiffMatchPatch();
  const cases = [
    {name: 'pure insertion', oldText: 'ac', newText: 'abc'},
    {name: 'pure deletion', oldText: 'abc', newText: 'ac'},
    {name: 'replacement', oldText: 'abc', newText: 'aXYZc'},
    {name: 'insertion at zero', oldText: 'body', newText: 'intro body'},
    {name: 'deletion at zero', oldText: 'intro body', newText: 'body'},
    {name: 'replacement at zero', oldText: 'old body', newText: 'new body'},
    {name: 'insertion at the end', oldText: 'body', newText: 'body end'},
    {name: 'deletion at the end', oldText: 'body end', newText: 'body'},
    {name: 'replacement at the end', oldText: 'body old', newText: 'body new'},
    {name: 'empty original', oldText: '', newText: '😀\r\nnew'},
    {name: 'empty result', oldText: '😀\r\nold', newText: ''},
    {name: 'identical inputs', oldText: 'same 😀\r\ntext', newText: 'same 😀\r\ntext'},
    {name: 'both empty', oldText: '', newText: ''},
    {name: 'multiple replacements', oldText: 'abc-def-ghi', newText: 'XYZ-12-3456'},
    {name: 'UTF-16 offsets', oldText: 'é漢😀x👩‍💻e\u0301', newText: 'é字😁long👩‍💻é!'},
    {name: 'CRLF lines', oldText: 'first\r\nold\r\nlast\r\n', newText: 'FIRST\r\nnew line\r\nlast\r\n!'},
    {name: 'CR deletion at a boundary', oldText: 'a\r\nb\r\n', newText: 'a\nb\n'},
    {name: 'CR insertion at a boundary', oldText: 'a\nb\n', newText: 'a\r\nb\r\n'},
    {name: 'insertion between CR and LF', oldText: 'a\r\nb', newText: 'a\rX\nb'},
    {name: 'deletion between CR and LF', oldText: 'a\rX\nb', newText: 'a\r\nb'},
  ];

  it.each(cases)('reconstructs $name', ({oldText, newText}) => {
    const changes = diffToEditorChanges(differ.diff_main(oldText, newText));
    expectOrderedChanges(oldText, changes);
    expect(applyChanges(oldText, changes)).toBe(newText);
    if (oldText === newText) {
      expect(changes).toEqual([]);
    }
  });

  it('places adjacent delete-then-insert pairs at original-document boundaries without mutating the diff', () => {
    const diffs: DiffMatchPatch.Diff[] = [
      [DiffMatchPatch.DIFF_DELETE, 'ab'],
      [DiffMatchPatch.DIFF_INSERT, 'XYZ'],
      [DiffMatchPatch.DIFF_DELETE, 'cd'],
      [DiffMatchPatch.DIFF_INSERT, '!'],
      [DiffMatchPatch.DIFF_EQUAL, 'ef'],
    ];
    const originalDiffs = diffs.map(([type, value]) => [type, value]);
    const changes = diffToEditorChanges(diffs);
    expect(changes).toEqual([
      {from: 0, to: 2},
      {from: 2, insert: 'XYZ'},
      {from: 2, to: 4},
      {from: 4, insert: '!'},
    ]);
    expectOrderedChanges('abcdef', changes);
    expect(applyChanges('abcdef', changes)).toBe('XYZ!ef');
    expect(diffs).toEqual(originalDiffs);
  });

  it('keeps consecutive insertions at the same original offset in order', () => {
    const changes = diffToEditorChanges([
      [DiffMatchPatch.DIFF_INSERT, 'a'],
      [DiffMatchPatch.DIFF_INSERT, 'b'],
      [DiffMatchPatch.DIFF_EQUAL, 'c'],
    ]);
    expect(changes).toEqual([{from: 0, insert: 'a'}, {from: 0, insert: 'b'}]);
    expect(applyChanges('c', changes)).toBe('abc');
  });

  it('counts emoji as two UTF-16 code units and CRLF as two source units', () => {
    expect(diffToEditorChanges([
      [DiffMatchPatch.DIFF_EQUAL, '😀\r\n'],
      [DiffMatchPatch.DIFF_DELETE, '漢'],
      [DiffMatchPatch.DIFF_INSERT, 'é'],
    ])).toEqual([{from: 4, to: 5}, {from: 5, insert: 'é'}]);
  });

  it('reconstructs 1,000 deterministic random pairs (seed 0x0ce04bd)', () => {
    let seed = 0x0ce04bd;
    const random = (limit: number) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % limit;
    };
    const alphabet = ['a', 'b', ' ', '\t', '\n', '\r', '\r\n', 'é', '漢', '😀', '😁', '👩‍💻', 'e\u0301'];
    const randomText = () => Array.from({length: random(80)}, () => alphabet[random(alphabet.length)]).join('');
    for (let pair = 0; pair < 1000; pair++) {
      const oldText = randomText();
      const newText = randomText();
      const changes = diffToEditorChanges(differ.diff_main(oldText, newText));
      expectOrderedChanges(oldText, changes);
      expect({pair, oldText, actual: applyChanges(oldText, changes)}).toEqual({pair, oldText, actual: newText});
    }
  });
});
