import {IgnoreType, TextRange} from './ignore-types';
import {cachePositionsForTypes, getPositions, MDAstTypes} from './mdast';

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

  constructor(ranges: TextRange[]) {
    const merged = mergeRanges(ranges);

    this.startIndexes = merged.map((range) => range.startIndex);
    this.endIndexes = merged.map((range) => range.endIndex);
  }

  get isEmpty(): boolean {
    return this.startIndexes.length === 0;
  }

  get ranges(): TextRange[] {
    return this.startIndexes.map((startIndex, index) => ({startIndex, endIndex: this.endIndexes[index]}));
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

  constructor(public readonly text: string) {}

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

    const uncachedMdastTypes = ignoreTypes
        .filter((ignoreType) => isMdastIgnoreType(ignoreType) && !ignoreType.findRanges && !this.rangesByIgnoreType.has(ignoreType))
        .map((ignoreType) => ignoreType.replaceAction as MDAstTypes);
    if (uncachedMdastTypes.length > 0) {
      cachePositionsForTypes(uncachedMdastTypes, this.text);
    }

    const ranges: TextRange[] = [];
    for (const ignoreType of ignoreTypes) {
      let rangesForType = this.rangesByIgnoreType.get(ignoreType);
      if (rangesForType === undefined) {
        rangesForType = findRangesForIgnoreType(this.text, ignoreType);
        this.rangesByIgnoreType.set(ignoreType, rangesForType);
      }

      ranges.push(...rangesForType);
    }

    const protectedRanges = new ProtectedRanges(ranges);
    this.protectedRangesByKey.set(key, protectedRanges);

    return protectedRanges;
  }
}
