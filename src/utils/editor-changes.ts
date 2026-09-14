import DiffMatchPatch from 'diff-match-patch';

export type EditorChangeSpec = {
  from: number;
  to?: number;
  insert?: string;
};

/**
 * Maps a diff to changes whose UTF-16 offsets all refer to the original text.
 * @param {DiffMatchPatch.Diff[]} diffs The diff between the original and new text
 * @return {EditorChangeSpec[]} Ordered, non-overlapping changes for one transaction
 */
export function diffToEditorChanges(diffs: DiffMatchPatch.Diff[]): EditorChangeSpec[] {
  const changes: EditorChangeSpec[] = [];
  let oldPos = 0;

  for (const [type, value] of diffs) {
    if (type === DiffMatchPatch.DIFF_EQUAL) {
      oldPos += value.length;
    } else if (type === DiffMatchPatch.DIFF_DELETE) {
      changes.push({from: oldPos, to: oldPos + value.length});
      oldPos += value.length;
    } else if (type === DiffMatchPatch.DIFF_INSERT) {
      changes.push({from: oldPos, insert: value});
    }
  }

  return changes;
}
