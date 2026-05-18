// A standalone, mdast-free, dependency-free, deterministic, O(n) sentence
// splitter. It operates on placeholder-masked logical text and must never look
// inside an atom (a placeholder, an HTML comment, or an inline HTML tag). See
// the "Sentence per line" rule docs for the heuristic's accepted limitations.

export const DEFAULT_SENTENCE_TERMINATORS = '.?!…。！？';

// The CJK / full-width sentence-final marks plus the ellipsis glyph. These are
// never intra-word or decimal, so they split without requiring trailing
// whitespace. Exported for documentation/testing; the runtime class test is
// purely "code point > 0x7F" (every non-ASCII terminator is unambiguous).
export const UNAMBIGUOUS_TERMINATORS = '。！？．！？…';

// Precision-first: entries that would suppress common real sentence ends
// (No., St., Fig., pp.) are intentionally omitted; users can add their own.
export const DEFAULT_ABBREVIATIONS: string[] = [
  'e.g.', 'i.e.', 'etc.', 'vs.', 'cf.', 'al.',
  'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Sr.', 'Jr.',
  'Inc.', 'Ltd.', 'Co.', 'U.S.', 'a.m.', 'p.m.',
];

// Priority order: placeholder, HTML comment, inline HTML tag.
const ATOM_RE = /\{[A-Z_]+[a-z0-9]+\}|#tag-placeholder[a-z0-9]+|---\n---|<!--[\s\S]*?-->|<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?>/g;

const CLOSING_CHARS = '"\'”’)]}»›';
const OPENING_CHARS = '"\'“‘([{«‹';
const BRACKET_LABEL_RE = /^\[[^\]\n]*\]/;

const UPPER_OR_OTHER_LETTER = /\p{Lu}|\p{Lo}/u;
const ANY_LETTER = /\p{L}/u;

type AtomRanges = {
  // start offset -> end offset (exclusive) for fast skip
  startToEnd: Map<number, number>,
  // set of exclusive end offsets (a position immediately after an atom)
  ends: Set<number>,
};

function tokenizeAtoms(text: string): AtomRanges {
  const startToEnd = new Map<number, number>();
  const ends = new Set<number>();
  ATOM_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATOM_RE.exec(text)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    startToEnd.set(start, end);
    ends.add(end);
    if (m[0].length === 0) {
      ATOM_RE.lastIndex++;
    }
  }
  return {startToEnd, ends};
}

function isWhitespace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || /\s/.test(ch);
}

function sanitizeTerminators(terminators: string): Set<string> {
  const set = new Set<string>();
  for (const ch of terminators) {
    const cp = ch.codePointAt(0) ?? 0;
    // drop control characters and ASCII whitespace
    if (cp < 0x20 || cp === 0x7f || ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      continue;
    }
    set.add(ch);
  }
  return set;
}

function normalizeAbbreviations(abbreviations: string[]): {list: string[], maxLen: number} {
  const list: string[] = [];
  let maxLen = 0;
  for (const raw of abbreviations) {
    const a = raw.trim().toLowerCase();
    if (a === '') {
      continue;
    }
    list.push(a);
    if (a.length > maxLen) {
      maxLen = a.length;
    }
  }
  // longest first so the longest match wins
  list.sort((x, y) => y.length - x.length);
  return {list, maxLen};
}

/**
 * Splits a single logical string (one hard-break segment, soft wraps already
 * collapsed to single spaces) into sentences. Pure, deterministic, O(n) and
 * opaque to atoms. Joining the result with '\n' is the exact inverse of the
 * split for any text this splitter produced (structural idempotency).
 * @param {string} text The logical string to split.
 * @param {string} terminators The user-configured sentence terminators.
 * @param {string[]} abbreviations The abbreviation suppression list.
 * @return {string[]} The sentences; one element means "no boundary found".
 */
export function splitIntoSentences(text: string, terminators: string, abbreviations: string[]): string[] {
  const termSet = sanitizeTerminators(terminators);
  if (termSet.size === 0 || text === '') {
    return [text];
  }

  const {startToEnd: atomStart, ends: atomEnds} = tokenizeAtoms(text);
  const {list: abbrevs, maxLen: maxAbbrevLen} = normalizeAbbreviations(abbreviations);
  const S = text;
  const n = S.length;

  const isUnambiguous = (ch: string): boolean => (ch.codePointAt(0) ?? 0) > 0x7f;

  const boundaryBefore = (pos: number): boolean => {
    if (pos <= 0) {
      return true;
    }
    if (atomEnds.has(pos)) {
      return true;
    }
    const prev = S[pos - 1];
    return isWhitespace(prev) || OPENING_CHARS.includes(prev);
  };

  const nextNonWs = (start: number): number => {
    let j = start;
    while (j < n && !atomStart.has(j) && isWhitespace(S[j])) {
      j++;
    }
    return j;
  };

  const consumeClosers = (start: number): number => {
    let j = start;
    while (j < n) {
      if (atomStart.has(j)) {
        break;
      }
      const c = S[j];
      if (CLOSING_CHARS.includes(c) || termSet.has(c) || c === '…') {
        j++;
        continue;
      }
      const label = BRACKET_LABEL_RE.exec(S.slice(j));
      if (label) {
        j += label[0].length;
        continue;
      }
      break;
    }
    return j;
  };

  const startsNewSentence = (pos: number): boolean => {
    if (pos >= n) {
      return false;
    }
    if (atomStart.has(pos)) {
      return true;
    }
    let q = pos;
    if (OPENING_CHARS.includes(S[q])) {
      q++;
    }
    if (q >= n || atomStart.has(q)) {
      return atomStart.has(q);
    }
    const cp = S.codePointAt(q);
    if (cp === undefined) {
      return false;
    }
    return UPPER_OR_OTHER_LETTER.test(String.fromCodePoint(cp));
  };

  const nextIsInitialOrLetterStart = (pos: number): boolean => {
    if (pos >= n) {
      return false;
    }
    if (atomStart.has(pos)) {
      return true;
    }
    let q = pos;
    if (OPENING_CHARS.includes(S[q])) {
      q++;
    }
    if (q >= n) {
      return false;
    }
    if (atomStart.has(q)) {
      return true;
    }
    const cp = S.codePointAt(q);
    if (cp === undefined) {
      return false;
    }
    const ch = String.fromCodePoint(cp);
    if (UPPER_OR_OTHER_LETTER.test(ch)) {
      return true;
    }
    // another single-letter initial: a lone letter immediately followed by a
    // terminator (e.g. the "m" in "a.m.", the "g" in "e.g.")
    return ANY_LETTER.test(ch) && q + 1 < n && termSet.has(S[q + 1]);
  };

  const abbreviationSuppressed = (termIdx: number): boolean => {
    if (abbrevs.length === 0) {
      return false;
    }
    let lbStart = Math.max(0, termIdx - maxAbbrevLen);
    // never look back across an atom boundary
    for (let k = termIdx; k > lbStart; k--) {
      if (atomEnds.has(k)) {
        lbStart = k;
        break;
      }
    }
    const suffix = S.slice(lbStart, termIdx + 1).toLowerCase();
    for (const abbr of abbrevs) {
      if (suffix.endsWith(abbr)) {
        const matchStart = termIdx + 1 - abbr.length;
        if (boundaryBefore(matchStart)) {
          return true;
        }
      }
    }
    return false;
  };

  const initialSuppressed = (termIdx: number, closerEnd: number): boolean => {
    const p = termIdx - 1;
    if (p < 0 || !ANY_LETTER.test(S[p])) {
      return false;
    }
    if (!boundaryBefore(p)) {
      return false;
    }
    const ns = nextNonWs(closerEnd);
    return nextIsInitialOrLetterStart(ns);
  };

  const numberSuppressed = (termIdx: number): boolean => {
    const prev = S[termIdx - 1];
    const next = S[termIdx + 1];
    return prev !== undefined && next !== undefined && /\d/.test(prev) && /\d/.test(next);
  };

  const sentences: string[] = [];
  let sentenceStart = 0;
  let i = 0;
  while (i < n) {
    const atomEnd = atomStart.get(i);
    if (atomEnd !== undefined) {
      i = atomEnd;
      continue;
    }
    const ch = S[i];
    if (!termSet.has(ch)) {
      i++;
      continue;
    }

    const cEnd = consumeClosers(i + 1);

    if (
      abbreviationSuppressed(i) ||
      initialSuppressed(i, cEnd) ||
      numberSuppressed(i)
    ) {
      i++;
      continue;
    }

    const atEnd = cEnd >= n;
    if (!isUnambiguous(ch) && !atEnd && !isWhitespace(S[cEnd])) {
      // ambiguous class requires whitespace or end-of-segment after closers
      i++;
      continue;
    }

    if (atEnd) {
      sentences.push(S.slice(sentenceStart, cEnd));
      sentenceStart = cEnd;
      i = cEnd;
      continue;
    }

    const ns = nextNonWs(cEnd);
    if (ns >= n) {
      sentences.push(S.slice(sentenceStart, cEnd));
      sentenceStart = n;
      i = n;
      break;
    }

    if (startsNewSentence(ns)) {
      sentences.push(S.slice(sentenceStart, cEnd));
      sentenceStart = ns;
      i = ns;
      continue;
    }

    i++;
  }

  if (sentenceStart < n) {
    sentences.push(S.slice(sentenceStart));
  }
  if (sentences.length === 0) {
    return [S];
  }
  return sentences;
}
