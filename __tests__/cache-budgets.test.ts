import {LRUCache} from 'lru-cache';
import {getHeaderTextPositions, getPositions, MDAstTypes} from '../src/utils/mdast';
import {LintContext} from '../src/utils/protected-ranges';
import {IgnoreTypes} from '../src/utils/ignore-types';

jest.mock('lru-cache', () => {
  const actual = jest.requireActual<typeof import('lru-cache')>('lru-cache');
  const caches: LRUCache<string, unknown>[] = [];
  return {
    ...actual,
    caches,
    LRUCache: class extends actual.LRUCache<string, unknown> {
      constructor(options: LRUCache.Options<string, unknown, unknown>) {
        super(options);
        caches.push(this);
      }
    },
  };
});

const {caches: mockCaches} = jest.requireMock<{caches: LRUCache<string, unknown>[]}>('lru-cache');

describe('retained-byte cache budgets', () => {
  let parseCache: LRUCache<string, unknown>;
  let contextCache: LRUCache<string, unknown>;

  beforeEach(() => {
    parseCache = mockCaches.find((cache) => cache.maxSize === 64 * 1024 * 1024);
    contextCache = mockCaches.find((cache) => cache.maxSize === 16 * 1024 * 1024);
    parseCache.clear();
    contextCache.clear();
    parseCache.maxEntrySize = 16 * 1024 * 1024;
    contextCache.maxEntrySize = 8 * 1024 * 1024;
  });

  it('charges positive sizes for empty documents', () => {
    expect(getPositions(MDAstTypes.Paragraph, '')).toEqual([]);
    const context = LintContext.for('');
    expect(LintContext.for('')).toBe(context);
    expect(parseCache.calculatedSize).toBeGreaterThan(0);
    expect(contextCache.calculatedSize).toBe(context.estimatedRetainedBytes);
  });

  it('evicts parsed documents by bytes and recomputes identical positions', () => {
    const text = '# First\n\n' + 'a'.repeat(900000);
    const positions = getPositions(MDAstTypes.Heading, text);
    expect(getPositions(MDAstTypes.Heading, text)[0]).toBe(positions[0]);
    for (let index = 0; index < 6; index++) {
      getPositions(MDAstTypes.Heading, `${text}\n${index}`);
      expect(parseCache.calculatedSize).toBeLessThanOrEqual(parseCache.maxSize);
    }
    expect(parseCache.peek(text)).toBeUndefined();
    const reparsed = getPositions(MDAstTypes.Heading, text);
    expect(reparsed).toEqual(positions);
    expect(reparsed[0]).not.toBe(positions[0]);
  });

  it('does not store oversized parses or evict smaller entries for them', () => {
    const small = '# Keep me';
    getPositions(MDAstTypes.Heading, small);
    const cached = parseCache.peek(small);
    const text = '# Too large\n\n' + 'a'.repeat(1024 * 1024);
    const first = getPositions(MDAstTypes.Heading, text);
    const second = getPositions(MDAstTypes.Heading, text);
    expect(second).toEqual(first);
    expect(second[0]).not.toBe(first[0]);
    expect(parseCache.peek(text)).toBeUndefined();
    expect(parseCache.peek(small)).toBe(cached);

    const dense = '*a* '.repeat(256);
    getHeaderTextPositions(dense);
    parseCache.maxEntrySize = 8192 + 16 * dense.length + 1;
    const denseFirst = getPositions(MDAstTypes.Italics, dense);
    const denseSecond = getPositions(MDAstTypes.Italics, dense);
    expect(denseSecond).toEqual(denseFirst);
    expect(denseSecond[0]).not.toBe(denseFirst[0]);
    expect(parseCache.peek(dense)).toBeUndefined();
    expect(parseCache.peek(small)).toBe(cached);
  });

  it('charges dense ASTs more than equally long plain text', () => {
    const dense = '*a* '.repeat(256);
    getHeaderTextPositions(dense);
    const cached = parseCache.peek(dense);
    const provisionalSize = parseCache.calculatedSize;
    expect(provisionalSize).toBe(8192 + 16 * dense.length);
    const positions = getPositions(MDAstTypes.Italics, dense);
    const denseSize = parseCache.calculatedSize;
    expect(denseSize).toBeGreaterThan(provisionalSize);
    expect(parseCache.peek(dense)).toBe(cached);
    expect(getPositions(MDAstTypes.Italics, dense)[0]).toBe(positions[0]);
    expect(parseCache.calculatedSize).toBe(denseSize);
    parseCache.clear();
    getPositions(MDAstTypes.Italics, 'word'.repeat(256));
    expect(denseSize).toBeGreaterThan(parseCache.calculatedSize);
  });

  it('reweighs every new range union and projection, but not cache hits', () => {
    const context = LintContext.for('before `code` after [link](url)');
    const initialSize = contextCache.calculatedSize;
    context.protectedRangesFor([IgnoreTypes.inlineCode]);
    expect(contextCache.calculatedSize).toBeGreaterThan(initialSize);
    expect(contextCache.calculatedSize).toBe(context.estimatedRetainedBytes);
    const rangeSize = contextCache.calculatedSize;
    const projection = context.projectionFor([IgnoreTypes.inlineCode]);
    expect(contextCache.calculatedSize).toBeGreaterThan(rangeSize);
    expect(contextCache.calculatedSize).toBe(context.estimatedRetainedBytes);
    const projectionSize = contextCache.calculatedSize;
    expect(context.projectionFor([IgnoreTypes.inlineCode])).toBe(projection);
    expect(contextCache.calculatedSize).toBe(projectionSize);
    context.projectionFor([IgnoreTypes.link]);
    expect(contextCache.calculatedSize).toBeGreaterThan(projectionSize);
    expect(contextCache.calculatedSize).toBe(context.estimatedRetainedBytes);
  });

  it('evicts contexts by bytes without invalidating held contexts', () => {
    const text = 'a'.repeat(900000);
    const context = LintContext.for(text);
    for (let index = 0; index < 10; index++) {
      LintContext.for(`${text}${index}`);
      expect(contextCache.calculatedSize).toBeLessThanOrEqual(contextCache.maxSize);
    }
    expect(contextCache.peek(text)).toBeUndefined();
    expect(context.projectionFor([]).text).toBe(text);
    expect(contextCache.peek(text)).toBeUndefined();
    expect(LintContext.for(text)).not.toBe(context);
  });

  it('rejects a context that grows beyond maxEntrySize without losing its projection', () => {
    const text = 'before `code` after';
    const context = LintContext.for(text);
    context.protectedRangesFor([IgnoreTypes.inlineCode]);
    contextCache.maxEntrySize = context.estimatedRetainedBytes + 1;
    const projection = context.projectionFor([IgnoreTypes.inlineCode]);
    expect(contextCache.peek(text)).toBeUndefined();
    expect(context.projectionFor([IgnoreTypes.inlineCode])).toBe(projection);
    expect(LintContext.for(text)).not.toBe(context);
  });

  it('does not store oversized sources or directly constructed contexts', () => {
    const text = 'a'.repeat(4 * 1024 * 1024);
    const context = LintContext.for(text);
    expect(contextCache.peek(text)).toBeUndefined();
    expect(LintContext.for(text)).not.toBe(context);
    expect(context.projectionFor([]).text).toBe(text);
    expect(contextCache.peek(text)).toBeUndefined();
    new LintContext('direct').projectionFor([]);
    expect(contextCache.peek('direct')).toBeUndefined();
  });
});
