import DiffMatchPatch from 'diff-match-patch';
import {textReplacement} from './strings';

const differ = new DiffMatchPatch();
// the diff is between a document and the same document after one rule, so it is worth letting it
// run to completion rather than falling back to a rougher answer part way through
differ.Diff_Timeout = 0;

/**
 * Works out what a rule changed by comparing the text it was given with the text it returned.
 * @param {string} before The text the rule was given
 * @param {string} after The text the rule returned
 * @return {textReplacement[]} The changes, in ascending order and not overlapping each other
 */
export function getEditsBetween(before: string, after: string): textReplacement[] {
  if (before === after) {
    return [];
  }

  const edits: textReplacement[] = [];
  let index = 0;
  let pending: textReplacement = null;

  for (const [operation, value] of differ.diff_main(before, after)) {
    if (operation === 0) {
      if (pending) {
        edits.push(pending);
        pending = null;
      }

      index += value.length;
      continue;
    }

    if (!pending) {
      pending = {startIndex: index, endIndex: index, value: ''};
    }

    if (operation === -1) {
      pending.endIndex = index + value.length;
      index += value.length;
    } else {
      pending.value += value;
    }
  }

  if (pending) {
    edits.push(pending);
  }

  return edits;
}

/**
 * Widens a change to the whole lines it sits on, and to the blank line either side of it.
 *
 * Two rules can change different characters and still disagree about what the result should be,
 * because markdown constructs run over several lines. One rule rewriting a list marker while
 * another rewrites the blank line under it produces something neither of them intended. Treating
 * changes as clashing when they are anywhere near each other is what keeps that from happening.
 * @param {string} text The text the changes were worked out against
 * @param {textReplacement} edit The change to widen
 * @return {textReplacement} The widened bounds, with no replacement value
 */
function widenToSurroundingLines(text: string, edit: textReplacement): textReplacement {
  let startIndex = text.lastIndexOf('\n', Math.max(0, edit.startIndex - 1));
  startIndex = startIndex === -1 ? 0 : text.lastIndexOf('\n', Math.max(0, startIndex - 1)) + 1;

  let endIndex = text.indexOf('\n', edit.endIndex);
  endIndex = endIndex === -1 ? text.length : text.indexOf('\n', endIndex + 1);

  return {startIndex, endIndex: endIndex === -1 ? text.length : endIndex, value: ''};
}

function overlaps(one: textReplacement, other: textReplacement): boolean {
  return one.startIndex <= other.endIndex && other.startIndex <= one.endIndex;
}

/**
 * Adds a rule's changes to the changes already collected, if none of them are near each other.
 * @param {textReplacement[]} collected The changes collected so far, ascending and not overlapping
 * @param {textReplacement[]} candidate The changes a further rule wants to make
 * @param {string} text The text both sets of changes were worked out against
 * @return {boolean} Whether the changes were added
 */
export function addEditsIfTheyDoNotClash(collected: textReplacement[], candidate: textReplacement[], text: string): boolean {
  const widenedCandidate = candidate.map((edit) => widenToSurroundingLines(text, edit));
  const widenedCollected = collected.map((edit) => widenToSurroundingLines(text, edit));

  for (const edit of widenedCandidate) {
    for (const existing of widenedCollected) {
      if (overlaps(edit, existing)) {
        return false;
      }
    }
  }

  collected.push(...candidate);
  collected.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);

  return true;
}
