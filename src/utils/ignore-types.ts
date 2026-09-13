import {obsidianMultilineCommentRegex, tagWithLeadingWhitespaceRegex, wikiLinkRegex, yamlRegex, escapeDollarSigns, genericLinkRegex, urlRegex, anchorTagRegex, templaterCommandRegex, footnoteDefinitionIndicatorAtStartOfLine} from './regex';
import {getAllCustomIgnoreSectionsInText, getAllTablesInText, getPositions, MDAstTypes} from './mdast';
import {hashString53Bit, replaceTextBetweenStartAndEndWithNewValue} from './strings';

export type IgnoreFunction = ((text: string, placeholder: string) => [placeholderInfo[], string]);
export type IgnoreType = {replaceAction: MDAstTypes | RegExp | IgnoreFunction, placeholder: string, onlyIfMatches?: RegExp};

export const IgnoreTypes: Record<string, IgnoreType> = {
  // mdast node types
  code: {replaceAction: MDAstTypes.Code, placeholder: '{CODE_BLOCK_PLACEHOLDER}'},
  inlineCode: {replaceAction: MDAstTypes.InlineCode, placeholder: '{INLINE_CODE_BLOCK_PLACEHOLDER}'},
  image: {replaceAction: MDAstTypes.Image, placeholder: '{IMAGE_PLACEHOLDER}'},
  thematicBreak: {replaceAction: MDAstTypes.HorizontalRule, placeholder: '{HORIZONTAL_RULE_PLACEHOLDER}'},
  italics: {replaceAction: MDAstTypes.Italics, placeholder: '{ITALICS_PLACEHOLDER}'},
  bold: {replaceAction: MDAstTypes.Bold, placeholder: '{STRONG_PLACEHOLDER}'},
  list: {replaceAction: MDAstTypes.List, placeholder: '{LIST_PLACEHOLDER}'},
  blockquote: {replaceAction: MDAstTypes.Blockquote, placeholder: '{BLOCKQUOTE_PLACEHOLDER}'},
  math: {replaceAction: MDAstTypes.Math, placeholder: '{MATH_PLACEHOLDER}'},
  inlineMath: {replaceAction: MDAstTypes.InlineMath, placeholder: '{INLINE_MATH_PLACEHOLDER}'},
  html: {replaceAction: MDAstTypes.Html, placeholder: '{HTML_PLACEHOLDER}'},
  heading: {replaceAction: MDAstTypes.Heading, placeholder: '{HEADING_PLACEHOLDER}'},
  // RegExp
  yaml: {replaceAction: yamlRegex, placeholder: escapeDollarSigns('---\n---')},
  wikiLink: {replaceAction: wikiLinkRegex, placeholder: '{WIKI_LINK_PLACEHOLDER}'},
  obsidianMultiLineComments: {replaceAction: obsidianMultilineCommentRegex, placeholder: '{OBSIDIAN_COMMENT_PLACEHOLDER}'},
  footnoteAtStartOfLine: {replaceAction: footnoteDefinitionIndicatorAtStartOfLine, placeholder: '{FOOTNOTE_AT_START_OF_LINE_PLACEHOLDER}'},
  footnoteAfterATask: {replaceAction: /- \[.] (\[\^\w+\]) ?([,.;!:?])/gm, placeholder: '{FOOTNOTE_AFTER_A_TASK_PLACEHOLDER}'},
  url: {replaceAction: urlRegex, placeholder: '{URL_PLACEHOLDER}'},
  anchorTag: {replaceAction: anchorTagRegex, placeholder: '{ANCHOR_PLACEHOLDER}'},
  templaterCommand: {replaceAction: templaterCommandRegex, placeholder: '{TEMPLATER_PLACEHOLDER}'},
  // custom functions
  link: {replaceAction: MDAstTypes.Link, placeholder: '{REGULAR_LINK_PLACEHOLDER}', onlyIfMatches: genericLinkRegex},
  tag: {replaceAction: replaceTags, placeholder: '#tag-placeholder'},
  table: {replaceAction: replaceTables, placeholder: '{TABLE_PLACEHOLDER}'},
  customIgnore: {replaceAction: replaceCustomIgnore, placeholder: '{CUSTOM_IGNORE_PLACEHOLDER}'},
} as const;

type placeholderInfo = {placeholder: string, replacedValue: string}

function isMdastIgnoreType(ignoreType: IgnoreType): boolean {
  return typeof ignoreType.replaceAction === 'string';
}

// Rules each declare the ignore types they need, and masking used to follow that declaration
// order, which meant the same two types could be masked in either order depending on the rule.
// Masking them in one canonical order instead lets every mdast type be masked from a single parse
// of the document, which is the bulk of the cost of linting a large file.
//
// The order is not arbitrary. Regions that enclose arbitrary markdown are masked first, then the
// constraints that are known to matter:
//   - anchorTag before html, because an anchor is an opening and a closing html node that do not
//     cover the url between them, so masking html first leaves that url exposed
//   - anchorTag, link and wikiLink before url, because each of them encloses a url
//   - yaml before thematicBreak, because frontmatter delimiters are also a valid thematic break
const canonicalIgnoreTypeOrder: IgnoreType[] = [
  IgnoreTypes.customIgnore,
  IgnoreTypes.obsidianMultiLineComments,
  IgnoreTypes.templaterCommand,
  IgnoreTypes.yaml,
  IgnoreTypes.anchorTag,
  IgnoreTypes.table,
  IgnoreTypes.code,
  IgnoreTypes.inlineCode,
  IgnoreTypes.math,
  IgnoreTypes.inlineMath,
  IgnoreTypes.html,
  IgnoreTypes.heading,
  IgnoreTypes.blockquote,
  IgnoreTypes.list,
  IgnoreTypes.thematicBreak,
  IgnoreTypes.bold,
  IgnoreTypes.italics,
  IgnoreTypes.image,
  IgnoreTypes.link,
  IgnoreTypes.wikiLink,
  IgnoreTypes.tag,
  IgnoreTypes.url,
  IgnoreTypes.footnoteAtStartOfLine,
  IgnoreTypes.footnoteAfterATask,
];

const canonicalRank = new Map<IgnoreType, number>(canonicalIgnoreTypeOrder.map((ignoreType, index) => [ignoreType, index]));

function inCanonicalOrder(ignoreTypes: IgnoreType[]): IgnoreType[] {
  return [...ignoreTypes].sort((a, b) => (canonicalRank.get(a) ?? Number.MAX_SAFE_INTEGER) - (canonicalRank.get(b) ?? Number.MAX_SAFE_INTEGER));
}

export function ignoreListOfTypes(ignoreTypes: IgnoreType[], text: string, func: ((text: string) => string)): string {
  let placeholders: placeholderInfo[] = [];

  // replace ignore blocks with their placeholders
  let tempPlaceholders: placeholderInfo[] = [];

  const orderedIgnoreTypes = inCanonicalOrder(ignoreTypes);
  for (let i = 0; i < orderedIgnoreTypes.length; i++) {
    const ignoreType = orderedIgnoreTypes[i];

    if (isMdastIgnoreType(ignoreType)) {
      // Each mdast ignore type needs the document parsed, and parsing dominates the cost of
      // linting. Masking a run of them from a single view of the text lets them share one parse
      // instead of reparsing the text the previous type just rewrote.
      const run: IgnoreType[] = [];
      while (i < orderedIgnoreTypes.length && isMdastIgnoreType(orderedIgnoreTypes[i])) {
        run.push(orderedIgnoreTypes[i++]);
      }
      i--;

      [tempPlaceholders, text] = replaceMdastTypes(text, run);
    } else if (ignoreType.replaceAction instanceof RegExp) {
      [tempPlaceholders, text] = replaceRegex(text, ignoreType.placeholder, ignoreType.replaceAction);
    } else if (typeof ignoreType.replaceAction === 'function') {
      const ignoreFunc: IgnoreFunction = ignoreType.replaceAction;
      [tempPlaceholders, text] = ignoreFunc(text, ignoreType.placeholder);
    }

    placeholders.push(...tempPlaceholders);
  }

  text = func(text);

  placeholders = placeholders.reverse();
  // add back values that were replaced with their placeholders
  if (placeholders != null && placeholders.length > 0) {
    placeholders.forEach((replacedInfo: placeholderInfo) => {
      // Regex was added to fix capitalization issue  where another rule made the text not match the original place holder's case
      // see https://github.com/platers/obsidian-linter/issues/201
      text = text.replace(new RegExp(replacedInfo.placeholder, 'i'), escapeDollarSigns(replacedInfo.replacedValue));
    });
  }

  return text;
}

/**
 * Replaces all mdast type instances in the given text with a placeholder.
 * @param {string} text The text to replace the given mdast node type in
 * @param {string} placeholder The placeholder to use
 * @param {MDAstTypes} type The type of node to ignore by replacing with the specified placeholder
 * @return {string} The text with mdast nodes types specified replaced
 * @return {placeholderInfo[]} The mdast nodes values replaced and generated placeholder
 */
type rangeToMask = {startIndex: number, endIndex: number, placeholder: string}

/**
 * Swaps each of the provided ranges out for its placeholder.
 *
 * Replacing the ranges one at a time rebuilds the entire document on every range, which is
 * quadratic in the size of the document. When the ranges are in descending order and do not
 * overlap, the same result can be assembled in a single pass. Overlapping ranges fall back to the
 * original behaviour, because there the offsets of a later range refer to text that an earlier
 * replacement has already shifted.
 * @param {string} text The text to mask the ranges in
 * @param {rangeToMask[]} ranges The ranges to mask, in the order they should be replaced
 * @return {string} The text with each range replaced by its placeholder
 */
function maskRanges(text: string, ranges: rangeToMask[]): string {
  let previousStartIndex = text.length;
  let isDescendingAndDisjoint = true;
  for (const range of ranges) {
    if (range.endIndex > previousStartIndex || range.startIndex > range.endIndex) {
      isDescendingAndDisjoint = false;
      break;
    }

    previousStartIndex = range.startIndex;
  }

  if (!isDescendingAndDisjoint) {
    for (const range of ranges) {
      text = replaceTextBetweenStartAndEndWithNewValue(text, range.startIndex, range.endIndex, range.placeholder);
    }

    return text;
  }

  const segments: string[] = [];
  let endOfNextSegment = text.length;
  for (const range of ranges) {
    segments.push(text.substring(range.endIndex, endOfNextSegment));
    segments.push(range.placeholder);
    endOfNextSegment = range.startIndex;
  }
  segments.push(text.substring(0, endOfNextSegment));

  return segments.reverse().join('');
}

function replaceMdastTypes(text: string, ignoreTypes: IgnoreType[]): [placeholderInfo[], string] {
  const candidates: {startIndex: number, endIndex: number, ignoreType: IgnoreType}[] = [];
  for (const ignoreType of ignoreTypes) {
    for (const position of getPositions(ignoreType.replaceAction as MDAstTypes, text)) {
      if (ignoreType.onlyIfMatches && !text.substring(position.start.offset, position.end.offset).match(ignoreType.onlyIfMatches)) {
        continue;
      }

      candidates.push({startIndex: position.start.offset, endIndex: position.end.offset, ignoreType});
    }
  }

  // Nodes nest, both within a type and across types, and every range is expressed against the text
  // as it is now. Replacing a nested range would shift the offsets of the range around it, so only
  // the outermost range of any overlapping group is masked. That still hides everything inside it.
  const priority = new Map<IgnoreType, number>(ignoreTypes.map((ignoreType, index) => [ignoreType, index]));
  candidates.sort((a, b) => a.startIndex - b.startIndex || b.endIndex - a.endIndex || priority.get(a.ignoreType) - priority.get(b.ignoreType));

  const generators = new Map<IgnoreType, () => string>(ignoreTypes.map((ignoreType) => [ignoreType, createPlaceholderGenerator(text, ignoreType.placeholder)]));
  const replacedValues: placeholderInfo[] = [];
  const ranges: rangeToMask[] = [];
  let endOfLastMaskedRange = -1;
  for (const candidate of candidates) {
    if (candidate.startIndex < endOfLastMaskedRange) {
      continue;
    }

    const newPlaceholder = generators.get(candidate.ignoreType)();
    replacedValues.push({placeholder: newPlaceholder, replacedValue: text.substring(candidate.startIndex, candidate.endIndex)});
    ranges.push({startIndex: candidate.startIndex, endIndex: candidate.endIndex, placeholder: newPlaceholder});
    endOfLastMaskedRange = candidate.endIndex;
  }

  text = maskRanges(text, ranges.reverse());

  return [replacedValues, text];
}

/**
 * Replaces all regex matches in the given text with a placeholder.
 * @param {string} text The text to replace the regex matches in
 * @param {string} placeholder The placeholder to use
 * @param {RegExp} regex The regex to use to find what to replace with the placeholder
 * @return {string} The text with regex matches replaced
 * @return {placeholderInfo[]} The regex matches replaced and generated placeholder
 */
function replaceRegex(text: string, placeholder: string, regex: RegExp): [placeholderInfo[], string] {
  const textMatches: placeholderInfo[] = [];
  const nextPlaceholder = createPlaceholderGenerator(text, placeholder);

  if (regex.flags.includes('g')) {
    text = text.replaceAll(regex, (match: string) => {
      const id = nextPlaceholder();
      textMatches.push({placeholder: id, replacedValue: match});

      return id;
    });
  } else {
    text = text.replace(regex, (match: string) => {
      const id = nextPlaceholder();
      textMatches.push({placeholder: id, replacedValue: match});

      return id;
    });
  }

  return [textMatches, text];
}

function replaceTags(text: string, placeholder: string): [placeholderInfo[], string] {
  const replacedValues: placeholderInfo[] = [];
  const nextPlaceholder = createPlaceholderGenerator(text, placeholder);

  text = text.replace(tagWithLeadingWhitespaceRegex, (_, whitespace, tag: string) => {
    const id = nextPlaceholder();

    replacedValues.push({placeholder: id, replacedValue: tag});
    return whitespace + id;
  });

  return [replacedValues, text];
}

function replaceTables(text: string, tablePlaceholder: string): [placeholderInfo[], string] {
  const tablePositions = getAllTablesInText(text);

  const replacedTables: placeholderInfo[] = new Array<placeholderInfo>(tablePositions.length);
  const nextPlaceholder = createPlaceholderGenerator(text, tablePlaceholder);
  let index = 0;
  const length = replacedTables.length;
  for (const tablePosition of tablePositions) {
    replacedTables[length - 1 - index++] = {placeholder: nextPlaceholder(), replacedValue: text.substring(tablePosition.startIndex, tablePosition.endIndex)};
  }

  let i = length -1;
  text = maskRanges(text, tablePositions.map((tablePosition) => ({
    startIndex: tablePosition.startIndex,
    endIndex: tablePosition.endIndex,
    placeholder: replacedTables[i--].placeholder,
  })));

  return [replacedTables, text];
}


function replaceCustomIgnore(text: string, customIgnorePlaceholder: string): [placeholderInfo[], string] {
  const customIgnorePositions = getAllCustomIgnoreSectionsInText(text);

  const replacedSections: placeholderInfo[] = new Array<placeholderInfo>(customIgnorePositions.length);
  const nextPlaceholder = createPlaceholderGenerator(text, customIgnorePlaceholder);
  let index = 0;
  const length = replacedSections.length;
  for (const customIgnorePosition of customIgnorePositions) {
    replacedSections[length - 1 - index++] = {placeholder: nextPlaceholder(), replacedValue: text.substring(customIgnorePosition.startIndex, customIgnorePosition.endIndex)};
  }

  let i = length - 1;
  text = maskRanges(text, customIgnorePositions.map((customIgnorePosition) => ({
    startIndex: customIgnorePosition.startIndex,
    endIndex: customIgnorePosition.endIndex,
    placeholder: replacedSections[i--].placeholder,
  })));

  return [replacedSections, text];
}

/**
 * Creates the function that hands out the placeholders for masking a single ignore type.
 *
 * The suffix is derived from the text being masked instead of being random so that masking the
 * same text twice produces the exact same output. Rules are run one after another over a document
 * and most of them leave it untouched, so reproducible masking lets the parsed markdown cache be
 * reused instead of reparsing the whole document for every rule.
 *
 * The seed is probed against the text first, which guarantees the generated placeholders cannot
 * collide with content that is already in the document, nor with the placeholders of an enclosing
 * `ignoreListOfTypes` call, since those are part of the text being masked here.
 * @param {string} text The text that is about to be masked
 * @param {string} placeholder The placeholder template for the ignore type being masked
 * @return {function(): string} A function returning a new unique placeholder on each call
 */
function createPlaceholderGenerator(text: string, placeholder: string): () => string {
  // a 53 bit hash is at most 11 base 36 digits, so seed and counter together keep the suffix the
  // same length as the random one it replaces, which keeps the masked text the same shape as before
  let attempt = 0;
  let seed = hashString53Bit(text, attempt).toString(36).padStart(11, '0');
  while (text.includes(seed)) {
    seed = hashString53Bit(text, ++attempt).toString(36).padStart(11, '0');
  }

  let count = 0;

  return (): string => {
    if (placeholder.includes('---')) {
      return placeholder;
    }

    const uniqueSuffix = seed + (count++).toString(36).padStart(5, '0');
    if (placeholder.endsWith('}')) {
      return placeholder.replace('}', uniqueSuffix + '}');
    }

    return placeholder + uniqueSuffix;
  };
}
