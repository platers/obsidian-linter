import {TextRange} from './ignore-types';

export type ProjectionReplacement = TextRange & {token: string};

/**
 * A decision-only view of a source document. Replacements must be sorted, nonempty and disjoint.
 * Four parallel arrays store the boundaries, using O(number of replacements) space rather than
 * O(document length). Offsets are UTF-16 offsets, like string slices and mdast positions.
 */
export class DocumentProjection {
  readonly text: string;
  private readonly sourceStarts: number[] = [];
  private readonly sourceEnds: number[] = [];
  private readonly projectionStarts: number[] = [];
  private readonly projectionEnds: number[] = [];

  constructor(readonly source: string, replacements: ProjectionReplacement[]) {
    const segments: string[] = [];
    let sourceCursor = 0;
    let projectionCursor = 0;
    for (const {startIndex, endIndex, token} of replacements) {
      if (!Number.isInteger(startIndex) || !Number.isInteger(endIndex) ||
          startIndex < sourceCursor || endIndex <= startIndex || endIndex > source.length || token.length === 0) {
        throw new RangeError('projection replacements must be sorted, nonempty and disjoint source ranges with nonempty tokens');
      }

      segments.push(source.substring(sourceCursor, startIndex), token);
      projectionCursor += startIndex - sourceCursor;
      this.sourceStarts.push(startIndex);
      this.sourceEnds.push(endIndex);
      this.projectionStarts.push(projectionCursor);
      projectionCursor += token.length;
      this.projectionEnds.push(projectionCursor);
      sourceCursor = endIndex;
    }

    segments.push(source.substring(sourceCursor));
    this.text = segments.join('');
  }

  /** Boundary offsets map exactly; an offset strictly inside replaced content has no image. */
  sourceToProjection(offset: number): number | undefined {
    return this.mapOffset(offset, this.source.length, this.sourceStarts, this.sourceEnds, this.projectionStarts, this.projectionEnds);
  }

  /** Boundary offsets map exactly; an offset strictly inside a token has no source image. */
  projectionToSource(offset: number): number | undefined {
    return this.mapOffset(offset, this.text.length, this.projectionStarts, this.projectionEnds, this.sourceStarts, this.sourceEnds);
  }

  /** Token membership is half-open: its first character belongs to it, its end offset does not. */
  isToken(offset: number): boolean {
    const index = lastStartingAtOrBefore(this.projectionStarts, offset);
    return Number.isInteger(offset) && index >= 0 && offset < this.projectionEnds[index];
  }

  /**
   * Maps a half-open edit only when it changes no token. As with ProtectedRanges, insertions at
   * token edges are allowed, but insertions strictly inside one and edits spanning one are not.
   */
  editRangeToSource(range: TextRange): TextRange | undefined {
    const {startIndex, endIndex} = range;
    if (endIndex < startIndex) {
      return undefined;
    }

    const sourceStart = this.projectionToSource(startIndex);
    const sourceEnd = this.projectionToSource(endIndex);
    if (sourceStart === undefined || sourceEnd === undefined) {
      return undefined;
    }

    if (startIndex < endIndex) {
      let index = lastStartingAtOrBefore(this.projectionStarts, endIndex);
      if (index >= 0 && this.projectionStarts[index] === endIndex) {
        index--;
      }
      if (index >= 0 && this.projectionEnds[index] > startIndex) {
        return undefined;
      }
    }

    return {startIndex: sourceStart, endIndex: sourceEnd};
  }

  private mapOffset(offset: number, length: number, fromStarts: number[], fromEnds: number[], toStarts: number[], toEnds: number[]): number | undefined {
    if (!Number.isInteger(offset) || offset < 0 || offset > length) {
      return undefined;
    }

    const index = lastStartingAtOrBefore(fromStarts, offset);
    if (index < 0) {
      return offset;
    }
    if (offset === fromStarts[index]) {
      return toStarts[index];
    }
    if (offset < fromEnds[index]) {
      return undefined;
    }

    return toEnds[index] + offset - fromEnds[index];
  }
}

function lastStartingAtOrBefore(starts: number[], offset: number): number {
  let low = 0;
  let high = starts.length - 1;
  let answer = -1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    if (starts[middle] <= offset) {
      answer = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return answer;
}
