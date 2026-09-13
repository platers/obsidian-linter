import {LintContext} from '../src/utils/protected-ranges';
import {IgnoreType, IgnoreTypes, ignoreListOfTypes} from '../src/utils/ignore-types';
import {projectionTokenFor} from '../src/utils/ignore-type-metadata';
import {DocumentProjection} from '../src/utils/document-projection';
import NoBareUrls from '../src/rules/no-bare-urls';

it('preserves the seven lines of frontmatter followed by a thematic break under no-bare-urls', () => {
  const text = '---\ntitle: a title\n---\n\n---\n\nbody\n';
  const ignoreTypes = new NoBareUrls().ignoreTypes;
  const projection = new LintContext(text).projectionFor(ignoreTypes);
  let masked = text;
  ignoreListOfTypes(ignoreTypes, text, (value) => {
    masked = value;
    return value;
  });

  expect(projection.text.split('\n')).toHaveLength(7);
  expect(projection.text.split('\n').map((line) => /^\s*$/.test(line)))
      .toEqual(masked.split('\n').map((line) => /^\s*$/.test(line)));
});

describe('projection tokens', () => {
  it.each(Object.entries(IgnoreTypes))('mirrors the generated placeholder shape for %s', (_name, ignoreType) => {
    const type = {replaceAction: /original/g, placeholder: ignoreType.placeholder};
    let masked = '';
    ignoreListOfTypes([type], 'original', (value) => {
      masked = value;
      return value;
    });

    const token = projectionTokenFor(type);
    expect(token.length).toBe(masked.length);
    expect(token.split('\n').map((line) => line.length)).toEqual(masked.split('\n').map((line) => line.length));
    expect(token.split('\n').every((line) => /\S/.test(line))).toBe(true);
  });

  it('inserts the suffix inside braces, appends it otherwise, and leaves YAML unchanged', () => {
    expect(projectionTokenFor(IgnoreTypes.code)).toBe('{CODE_BLOCK_PLACEHOLDER' + '0'.repeat(16) + '}');
    expect(projectionTokenFor(IgnoreTypes.tag)).toBe('#tag-placeholder' + '0'.repeat(16));
    expect(projectionTokenFor(IgnoreTypes.yaml)).toBe('---\n---');
  });
});

describe('projection offset maps', () => {
  const projection = new DocumentProjection('ab12345cdEfg', [
    {startIndex: 2, endIndex: 7, token: 'X'},
    {startIndex: 9, endIndex: 10, token: 'TOKEN'},
  ]);

  it('builds visible text through both contracting and expanding replacements', () => {
    expect(projection.source).toBe('ab12345cdEfg');
    expect(projection.text).toBe('abXcdTOKENfg');
  });

  it.each([[0, 0], [1, 1], [2, 2], [7, 3], [8, 4], [9, 5], [10, 10], [11, 11], [12, 12]])(
      'round-trips source offset %i through projection offset %i', (source, projected) => {
        expect(projection.sourceToProjection(source)).toBe(projected);
        expect(projection.projectionToSource(projected)).toBe(source);
      });

  it('does not invent a corresponding offset inside replacements', () => {
    for (const offset of [3, 4, 5, 6]) {
      expect(projection.sourceToProjection(offset)).toBeUndefined();
    }
    for (const offset of [6, 7, 8, 9]) {
      expect(projection.projectionToSource(offset)).toBeUndefined();
    }
  });

  it('recognizes token characters with half-open boundaries', () => {
    expect(Array.from({length: projection.text.length + 1}, (_, offset) => projection.isToken(offset)))
        .toEqual([false, false, true, false, false, true, true, true, true, true, false, false, false]);
  });

  it.each([-1, 13, 1.5, NaN, Infinity])('rejects invalid offset %s', (offset) => {
    expect(projection.sourceToProjection(offset)).toBeUndefined();
    expect(projection.projectionToSource(offset)).toBeUndefined();
    expect(projection.isToken(offset)).toBe(false);
  });

  it('maps edits beside tokens and rejects edits overlapping or spanning tokens', () => {
    expect(projection.editRangeToSource({startIndex: 0, endIndex: 2})).toEqual({startIndex: 0, endIndex: 2});
    expect(projection.editRangeToSource({startIndex: 3, endIndex: 5})).toEqual({startIndex: 7, endIndex: 9});
    expect(projection.editRangeToSource({startIndex: 10, endIndex: 12})).toEqual({startIndex: 10, endIndex: 12});
    for (const [startIndex, endIndex] of [[2, 3], [5, 10], [1, 11], [4, 11], [4, 6], [9, 11], [6, 8]]) {
      expect(projection.editRangeToSource({startIndex, endIndex})).toBeUndefined();
    }
  });

  it('allows insertions at token edges but not inside tokens', () => {
    for (const offset of [2, 3, 5, 10, 12]) {
      const sourceOffset = projection.projectionToSource(offset);
      expect(projection.editRangeToSource({startIndex: offset, endIndex: offset}))
          .toEqual({startIndex: sourceOffset, endIndex: sourceOffset});
    }
    expect(projection.editRangeToSource({startIndex: 7, endIndex: 7})).toBeUndefined();
    expect(projection.editRangeToSource({startIndex: 4, endIndex: 3})).toBeUndefined();
    expect(projection.editRangeToSource({startIndex: -1, endIndex: 0})).toBeUndefined();
    expect(projection.editRangeToSource({startIndex: 12, endIndex: 13})).toBeUndefined();
  });

  it('maps a shared boundary between adjacent tokens without conflating the tokens', () => {
    const adjacent = new DocumentProjection('abc', [
      {startIndex: 0, endIndex: 1, token: 'TOKEN'},
      {startIndex: 1, endIndex: 3, token: 'X'},
    ]);
    expect(adjacent.text).toBe('TOKENX');
    expect(adjacent.sourceToProjection(1)).toBe(5);
    expect(adjacent.projectionToSource(5)).toBe(1);
    expect(adjacent.isToken(5)).toBe(true);
    expect(adjacent.editRangeToSource({startIndex: 5, endIndex: 5})).toEqual({startIndex: 1, endIndex: 1});
    expect(adjacent.editRangeToSource({startIndex: 0, endIndex: 5})).toBeUndefined();
  });

  it.each(['', 'plain\ntext\n', '😀\r\ntext'])('is an identity map without replacements: %j', (source) => {
    const identity = new DocumentProjection(source, []);
    expect(identity.text).toBe(source);
    for (let offset = 0; offset <= source.length; offset++) {
      expect(identity.sourceToProjection(offset)).toBe(offset);
      expect(identity.projectionToSource(offset)).toBe(offset);
      expect(identity.isToken(offset)).toBe(false);
    }
  });

  it('uses UTF-16 offsets and maps around a multiline token', () => {
    const unicode = new DocumentProjection('😀abcdef\r\nend', [{startIndex: 2, endIndex: 8, token: '---\n---'}]);
    expect(unicode.text).toBe('😀---\n---\r\nend');
    expect(unicode.sourceToProjection(1)).toBe(1);
    expect(unicode.sourceToProjection(8)).toBe(9);
    expect(unicode.projectionToSource(9)).toBe(8);
    expect(unicode.isToken(5)).toBe(true);
    expect(unicode.editRangeToSource({startIndex: 5, endIndex: 6})).toBeUndefined();
  });

  it('does not confuse literal source text with a token of the same content', () => {
    const collision = new DocumentProjection('TOKEN x', [{startIndex: 6, endIndex: 7, token: 'TOKEN'}]);
    expect(collision.text).toBe('TOKEN TOKEN');
    expect(collision.isToken(0)).toBe(false);
    expect(collision.isToken(6)).toBe(true);
    expect(collision.editRangeToSource({startIndex: 0, endIndex: 5})).toEqual({startIndex: 0, endIndex: 5});
  });

  it('rejects malformed replacements rather than creating ambiguous maps', () => {
    for (const [startIndex, endIndex] of [[-1, 1], [0, 0], [2, 1], [0, 4], [0.5, 1], [0, NaN]]) {
      expect(() => new DocumentProjection('abc', [{startIndex, endIndex, token: 'X'}])).toThrow(RangeError);
    }
    expect(() => new DocumentProjection('abc', [{startIndex: 0, endIndex: 1, token: ''}])).toThrow(RangeError);
    expect(() => new DocumentProjection('abc', [
      {startIndex: 0, endIndex: 2, token: 'X'},
      {startIndex: 1, endIndex: 3, token: 'Y'},
    ])).toThrow(RangeError);
  });
});

describe('cached typed projections', () => {
  it('shares one projection for reordered and repeated ignore types', () => {
    const context = new LintContext('some `code` and #tag');
    const projection = context.projectionFor([IgnoreTypes.tag, IgnoreTypes.inlineCode]);
    expect(context.projectionFor([IgnoreTypes.inlineCode, IgnoreTypes.tag])).toBe(projection);
    expect(context.projectionFor([IgnoreTypes.tag, IgnoreTypes.inlineCode, IgnoreTypes.tag])).toBe(projection);
    expect(context.projectionFor([IgnoreTypes.tag])).not.toBe(projection);
    expect(context.projectionFor([]).text).toBe(context.text);
  });

  it('shares range-finder results with the range cache and across projection sets', () => {
    const findRanges = jest.fn(() => [{startIndex: 0, endIndex: 1}]);
    const type: IgnoreType = {replaceAction: /x/g, placeholder: '{TEST}', findRanges};
    const context = new LintContext('x');
    context.protectedRangesFor([type]);
    context.projectionFor([type]);
    context.projectionFor([type, IgnoreTypes.code]);
    expect(findRanges).toHaveBeenCalledTimes(1);
  });

  it('preserves enclosing type provenance and adjacent tokens even though the union merges them', () => {
    const outer: IgnoreType = {replaceAction: /abc/g, placeholder: '{OUTER}'};
    const inner: IgnoreType = {replaceAction: /b/g, placeholder: '{INNER}'};
    const adjacent: IgnoreType = {replaceAction: /def/g, placeholder: '#adjacent'};
    const context = new LintContext('abcdef');
    const types = [inner, outer, adjacent];
    const projection = context.projectionFor(types);
    expect(projection.text).toBe(projectionTokenFor(outer) + projectionTokenFor(adjacent));
    expect(context.protectedRangesFor(types).ranges).toEqual([{startIndex: 0, endIndex: 6}]);
    expect(projection.sourceToProjection(3)).toBe(projectionTokenFor(outer).length);
    expect(projection.editRangeToSource({startIndex: 0, endIndex: projection.text.length})).toBeUndefined();
  });
});
