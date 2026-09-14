import {LRUCache} from 'lru-cache';
import {IgnoreType, TextRange} from './ignore-types';
import {inCanonicalOrder, projectionTokenFor} from './ignore-type-metadata';
import {DocumentProjection, ProjectionReplacement} from './document-projection';
import {getPositions, MDAstTypes} from './mdast';
import {textReplacement} from './strings';

/**
 * The regions of a document a rule is not allowed to change.
 *
 * Masking hides those regions by rewriting the document, which means the rule body runs on text
 * that is not the document, and every rule that masks a different set of types gets a different
 * document that has to be parsed again. This describes the same regions against the original text
 * instead, so every rule can be given the document itself.
 */
export class ProtectedRanges {
  private readonly startIndexes: number[];
  private readonly endIndexes: number[];
  private readonly context?: LintContext;
  private readonly ignoreTypes?: IgnoreType[];

  constructor(ranges: TextRange[], context?: LintContext, ignoreTypes?: IgnoreType[]) {
    const merged = mergeRanges(ranges);

    this.startIndexes = merged.map((range) => range.startIndex);
    this.endIndexes = merged.map((range) => range.endIndex);
    this.context = context;
    this.ignoreTypes = ignoreTypes;
  }

  /**
   * These regions together with those of some further ignore types.
   *
   * Several rules mask a second set of types inside their own body, on top of the ones they
   * declare. Going back through the context keeps that combination cached with all the others,
   * rather than working the ranges out again every time the rule runs.
   * @param {IgnoreType[]} ignoreTypes The further types to protect
   * @return {ProtectedRanges} The regions of both sets of types
   */
  combinedWith(ignoreTypes: IgnoreType[]): ProtectedRanges {
    if (!this.context || !this.ignoreTypes) {
      throw new Error('protected ranges that did not come from a lint context cannot be combined with more ignore types');
    }

    return this.context.protectedRangesFor([...this.ignoreTypes, ...ignoreTypes]);
  }

  /**
   * The cached decision view for these ignore types, owned by the same context as the ranges.
   * @return {DocumentProjection} The projection with maps back to source offsets
   */
  projection(): DocumentProjection {
    if (!this.context || !this.ignoreTypes) {
      throw new Error('protected ranges that did not come from a lint context cannot provide a projection');
    }

    return this.context.projectionFor(this.ignoreTypes);
  }

  get isEmpty(): boolean {
    return this.startIndexes.length === 0;
  }

  get ranges(): TextRange[] {
    return this.startIndexes.map((startIndex, index) => ({startIndex, endIndex: this.endIndexes[index]}));
  }

  /**
   * Returns only the protected regions intersecting a source window, without copying the full index.
   * @param {number} startIndex The inclusive window start
   * @param {number} endIndex The exclusive window end
   * @return {TextRange[]} Intersecting regions in source order
   */
  overlappingRanges(startIndex: number, endIndex: number): TextRange[] {
    const ranges: TextRange[] = [];
    if (endIndex <= startIndex) {
      return ranges;
    }

    let index = Math.max(0, this.lastRangeStartingAtOrBefore(startIndex));
    while (index < this.startIndexes.length && this.startIndexes[index] < endIndex) {
      if (this.endIndexes[index] > startIndex) {
        ranges.push({startIndex: this.startIndexes[index], endIndex: this.endIndexes[index]});
      }
      index++;
    }
    return ranges;
  }

  /**
   * Whether changing the given range would change a region that must not be touched.
   *
   * An empty range is an insertion, and inserting against the edge of a protected region is
   * allowed, because masking left the text either side of a placeholder writable. An insertion
   * strictly inside one is not.
   * @param {number} startIndex Where the change starts
   * @param {number} endIndex Where the change ends, the same as the start for an insertion
   * @return {boolean} Whether any protected region overlaps the change
   */
  isProtected(startIndex: number, endIndex: number): boolean {
    const candidate = this.lastRangeStartingAtOrBefore(endIndex);
    if (candidate === -1) {
      return false;
    }

    if (startIndex === endIndex) {
      for (let index = candidate; index >= 0; index--) {
        if (this.startIndexes[index] < startIndex && startIndex < this.endIndexes[index]) {
          return true;
        }

        // the ranges do not overlap each other, so once one ends at or before the insertion point
        // every earlier one does too
        if (this.endIndexes[index] <= startIndex) {
          return false;
        }
      }

      return false;
    }

    for (let index = candidate; index >= 0; index--) {
      if (this.startIndexes[index] < endIndex && startIndex < this.endIndexes[index]) {
        return true;
      }

      if (this.endIndexes[index] <= startIndex) {
        return false;
      }
    }

    return false;
  }

  /**
   * Whether the given range touches or sits against a region that must not be touched.
   * @param {number} startIndex Where the range starts
   * @param {number} endIndex Where the range ends
   * @return {boolean} Whether a protected region overlaps the range or begins or ends at its edge
   */
  isAdjacentToOrProtected(startIndex: number, endIndex: number): boolean {
    return this.isProtected(startIndex, endIndex) || this.isProtected(Math.max(0, startIndex - 1), endIndex + 1);
  }

  private lastRangeStartingAtOrBefore(index: number): number {
    let low = 0;
    let high = this.startIndexes.length - 1;
    let answer = -1;

    while (low <= high) {
      const middle = (low + high) >> 1;
      if (this.startIndexes[middle] <= index) {
        answer = middle;
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }

    return answer;
  }
}

/**
 * Reads a source window with protected content hidden, without parsing or rewriting the document.
 *
 * The token is non-whitespace but contains no fence, dollar sign, quote marker, or callout syntax.
 * Its offsets are not source offsets: this result is for decisions, never for locating edits.
 * @param {string} text The original text
 * @param {ProtectedRanges} protectedRanges The regions to hide
 * @param {number} startIndex The inclusive source-window start
 * @param {number} endIndex The exclusive source-window end
 * @return {string} The window with each intersecting protected region replaced by a brace token
 */
export function redactProtected(text: string, protectedRanges: ProtectedRanges, startIndex: number, endIndex: number): string {
  const replacements = protectedRanges.overlappingRanges(startIndex, endIndex).map((range) => ({
    startIndex: Math.max(startIndex, range.startIndex) - startIndex,
    endIndex: Math.min(endIndex, range.endIndex) - startIndex,
    token: '{PROTECTED}',
  }));
  return new DocumentProjection(text.substring(startIndex, endIndex), replacements).text;
}

/**
 * Collects edits from regex matches using a rule-selected protection guard.
 *
 * The edit range is what gets replaced; the guard range is what masking would have had to see.
 * Specific punctuation anchors must be visible, but placeholders can satisfy non-whitespace anchors.
 * Match iteration still consumes the whole match, just like String.replace, so adjacent matches
 * cannot reuse an anchor consumed by an earlier one.
 * @param {string} text The original document or an original list paragraph slice
 * @param {RegExp} regex The global expression to match
 * @param {ProtectedRanges} protectedRanges The regions that must not overlap the guard range
 * @param {object} rangesForMatch Builds the edit and guard ranges using document-relative offsets
 * @param {number} offset The slice's starting offset in the original document
 * @return {textReplacement[]} Edits in ascending order, relative to the original document
 */
export function collectUnprotectedRegexReplacements(
    text: string,
    regex: RegExp,
    protectedRanges: ProtectedRanges,
    rangesForMatch: {
      editRange: (match: RegExpMatchArray, startIndex: number) => textReplacement,
      guardRange: (match: RegExpMatchArray, startIndex: number) => TextRange,
    },
    offset: number = 0,
): textReplacement[] {
  const replacements: textReplacement[] = [];
  for (const match of text.matchAll(regex)) {
    const startIndex = offset + match.index;
    const guardRange = rangesForMatch.guardRange(match, startIndex);
    if (!protectedRanges.isProtected(guardRange.startIndex, guardRange.endIndex)) {
      replacements.push(rangesForMatch.editRange(match, startIndex));
    }
  }

  return replacements;
}

/**
 * Replaces whole, unprotected matches while retaining native replacement-string expansion.
 * @param {string} text The original document
 * @param {RegExp} regex The user's expression, including its replacement-count and sticky flags
 * @param {string} replacement The replacement string, including any capture references
 * @param {ProtectedRanges} protectedRanges The regions matches must not overlap
 * @return {string} The document with only accepted matches replaced
 */
export function replaceUnprotectedRegexMatches(text: string, regex: RegExp, replacement: string, protectedRanges: ProtectedRanges): string {
  if (protectedRanges.isEmpty) {
    return text.replace(regex, replacement);
  }

  const guardedRegex = new RegExp(regex.source, regex.flags);
  const searchRegex = new RegExp(regex.source, regex.global ? regex.flags : regex.flags + 'g');
  // String.replace still owns capture expansion and the single/global replacement count.
  // Filtering exec results lets a rejected match leave the non-global replacement available.
  guardedRegex.exec = (source: string): RegExpExecArray | null => {
    searchRegex.lastIndex = guardedRegex.lastIndex;
    let match = searchRegex.exec(source);
    while (match && protectedRanges.isProtected(match.index, match.index + match[0].length)) {
      if (match[0].length === 0) {
        // Rejected empty matches must advance just as native replace does, including Unicode pairs.
        const unicode = searchRegex.unicode || searchRegex.flags.includes('v');
        searchRegex.lastIndex += unicode && source.codePointAt(searchRegex.lastIndex) > 0xFFFF ? 2 : 1;
      }
      match = searchRegex.exec(source);
    }
    guardedRegex.lastIndex = searchRegex.lastIndex;
    return match;
  };

  return text.replace(guardedRegex, replacement);
}

/**
 * Collapses a set of ranges into the smallest set of ranges covering the same characters.
 *
 * Nodes nest, both within a type and across types, so the ranges that come out of the detectors
 * overlap each other. Masking keeps only the outermost of an overlapping group, since replacing a
 * nested range would shift the offsets of the one around it, and the union is the same set of
 * characters.
 * @param {TextRange[]} ranges The ranges to collapse, in any order
 * @return {TextRange[]} The ranges, sorted and with none of them overlapping another
 */
function mergeRanges(ranges: TextRange[]): TextRange[] {
  if (ranges.length === 0) {
    return [];
  }

  const sorted = [...ranges].sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
  const merged: TextRange[] = [];
  let current = {startIndex: sorted[0].startIndex, endIndex: sorted[0].endIndex};

  for (let index = 1; index < sorted.length; index++) {
    const range = sorted[index];
    if (range.startIndex <= current.endIndex) {
      if (range.endIndex > current.endIndex) {
        current.endIndex = range.endIndex;
      }

      continue;
    }

    merged.push(current);
    current = {startIndex: range.startIndex, endIndex: range.endIndex};
  }

  merged.push(current);

  return merged;
}

function isMdastIgnoreType(ignoreType: IgnoreType): boolean {
  return typeof ignoreType.replaceAction === 'string';
}

function findRangesForIgnoreType(text: string, ignoreType: IgnoreType): TextRange[] {
  if (ignoreType.findRanges) {
    return ignoreType.findRanges(text);
  }

  if (isMdastIgnoreType(ignoreType)) {
    const ranges: TextRange[] = [];
    for (const position of getPositions(ignoreType.replaceAction as MDAstTypes, text)) {
      if (ignoreType.onlyIfMatches && !text.substring(position.start.offset, position.end.offset).match(ignoreType.onlyIfMatches)) {
        continue;
      }

      ranges.push({startIndex: position.start.offset, endIndex: position.end.offset});
    }

    return ranges;
  }

  const regex = ignoreType.replaceAction as RegExp;
  if (!regex.flags.includes('g')) {
    // masking a type whose expression is not global replaces only the first match, so only the
    // first match is protected
    const match = regex.exec(text);

    return match === null ? [] : [{startIndex: match.index, endIndex: match.index + match[0].length}];
  }

  const ranges: TextRange[] = [];
  for (const match of text.matchAll(regex)) {
    ranges.push({startIndex: match.index, endIndex: match.index + match[0].length});
  }

  return ranges;
}

/**
 * One document, with the regions each rule has to leave alone worked out from it on demand.
 *
 * A run of rules is given the same text, so the ranges of an ignore type are worked out once for
 * that text however many rules ask for them, and the parse they need is shared with every other
 * rule in the run.
 */
export class LintContext {
  private readonly rangesByIgnoreType = new Map<IgnoreType, TextRange[]>();
  private readonly protectedRangesByKey = new Map<string, ProtectedRanges>();
  private readonly projectionsByKey = new Map<string, DocumentProjection>();
  private cacheSize: number;

  constructor(public readonly text: string) {
    this.cacheSize = 4096 + 2 * text.length;
  }

  /** Estimated retained bytes, including source, lazy ranges and full projection strings. */
  get estimatedRetainedBytes(): number {
    return this.cacheSize;
  }

  private updateCacheSize(): void {
    // Do not reinsert an evicted context, or cache one constructed directly by a caller.
    if (contextCache.peek(this.text) === this) {
      // lru-cache does not update an entry's size when set() receives the same object.
      // Delete before setting it again so lazy growth is charged and maxEntrySize is
      // enforced. A rejected context remains usable by the batch holding it explicitly.
      contextCache.delete(this.text);
      contextCache.set(this.text, this);
    }
  }

  /**
   * The context for this text, reusing the one built for it before where there is one.
   *
   * A rule is run again when its changes clashed with another rule's and it has to lead the next
   * run, and the runs either side of a rule that changed nothing are over the same text. Working
   * out the ranges again each time costs about as much as parsing the document, so the answers are
   * kept for the last few documents seen, exactly as the parsed markdown is.
   * @param {string} text The document to describe
   * @return {LintContext} The context for that document
   */
  static for(text: string): LintContext {
    const cached = contextCache.get(text);
    if (cached) {
      return cached;
    }

    const context = new LintContext(text);
    contextCache.set(text, context);

    return context;
  }

  /**
   * The regions protected by the given ignore types, taken together.
   * @param {IgnoreType[]} ignoreTypes The types whose regions must not be changed
   * @return {ProtectedRanges} The union of their regions, ready to be asked about a change
   */
  protectedRangesFor(ignoreTypes: IgnoreType[]): ProtectedRanges {
    const key = ignoreTypes.map((ignoreType) => ignoreType.placeholder).sort().join('\u0000');
    const cached = this.protectedRangesByKey.get(key);
    if (cached) {
      return cached;
    }

    const ranges: TextRange[] = [];
    for (const ignoreType of ignoreTypes) {
      let rangesForType = this.rangesByIgnoreType.get(ignoreType);
      if (rangesForType === undefined) {
        rangesForType = findRangesForIgnoreType(this.text, ignoreType);
        this.rangesByIgnoreType.set(ignoreType, rangesForType);
        this.cacheSize += 256 + 64 * rangesForType.length;
      }

      ranges.push(...rangesForType);
    }

    const protectedRanges = new ProtectedRanges(ranges, this, ignoreTypes);
    this.protectedRangesByKey.set(key, protectedRanges);
    // The unmerged count is a conservative bound for the two merged index arrays.
    this.cacheSize += 256 + 2 * key.length + 16 * ignoreTypes.length + 32 * ranges.length;
    this.updateCacheSize();

    return protectedRanges;
  }

  /**
   * The document with typed placeholders for decisions, sharing the original parse and per-type
   * ranges. The union is still used for protection; it cannot supply tokens because it lost types.
   * @param {IgnoreType[]} ignoreTypes The types to hide in the decision view
   * @return {DocumentProjection} The cached projection and its source-offset maps
   */
  projectionFor(ignoreTypes: IgnoreType[]): DocumentProjection {
    const types = inCanonicalOrder([...new Set(ignoreTypes)]);
    const key = types.map((ignoreType) => ignoreType.placeholder).sort().join('\u0000');
    const cached = this.projectionsByKey.get(key);
    if (cached) {
      return cached;
    }

    // Populate the per-type cache in one pass before consulting it below.
    this.protectedRangesFor(types);
    const candidates: ProjectionReplacement[] = [];
    for (const ignoreType of types) {
      const token = projectionTokenFor(ignoreType);
      for (const range of this.rangesByIgnoreType.get(ignoreType)) {
        candidates.push({...range, token});
      }
    }

    // Keep the enclosing type's token. Stable sorting breaks equal-range ties in masking order.
    // Adjacent ranges stay separate: each has its own placeholder length.
    candidates.sort((a, b) => a.startIndex - b.startIndex || b.endIndex - a.endIndex);
    const replacements: ProjectionReplacement[] = [];
    for (const candidate of candidates) {
      const previous = replacements[replacements.length - 1];
      if (previous && candidate.startIndex < previous.endIndex) {
        previous.endIndex = Math.max(previous.endIndex, candidate.endIndex);
      } else {
        replacements.push({...candidate});
      }
    }

    const projection = new DocumentProjection(this.text, replacements);
    this.projectionsByKey.set(key, projection);
    this.cacheSize += 512 + 2 * key.length + 2 * projection.text.length + 64 * replacements.length;
    this.updateCacheSize();
    return projection;
  }
}

// Measured independently with parsed inputs pinned, Node 24 --expose-gc (five GCs):
// 1KiB/50KiB/859,811-character inputs retained 6.2KB/37.7KB/659.5KB for all ignore
// types and one range union. With four projection keys those grew to 12.6KB/442.8KB/
// 7.05MB. Large projections added 1.46-1.85MB each: charge their actual UTF-16 length,
// not a single source multiplier. Range objects cost about 64 bytes in the dense
// sample (847KB/12,800 ranges, including the union); reserve 64 per range plus 32
// per union member and 64 per projection member for overallocated number arrays.
// Map/key/object overhead is charged separately, and every lazy insertion reweighs
// the context. The source is charged even when also retained by the parse cache.
// 16MiB keeps several active large contexts, rather than all historical snapshots;
// the separate 64MiB parse budget keeps the full fixture at 15 parses.
const contextCache = new LRUCache<string, LintContext>({
  maxSize: 16 * 1024 * 1024,
  maxEntrySize: 8 * 1024 * 1024,
  sizeCalculation: (context) => context.estimatedRetainedBytes,
});
