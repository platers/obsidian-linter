import {obsidianMultilineCommentRegex, tagWithLeadingWhitespaceRegex, wikiLinkRegex, yamlRegex, genericLinkRegex, urlRegex, anchorTagRegex, templaterCommandRegex, footnoteDefinitionIndicatorAtStartOfLine} from './regex';
import {getAllCustomIgnoreSectionsInText, getAllTablesInText, MDAstTypes} from './mdast';
import {registerCanonicalIgnoreTypeOrder} from './ignore-type-metadata';

export type TextRange = {startIndex: number, endIndex: number};
// Custom range finders describe regions that are not an mdast type or a whole regex match.
export type RangeFinder = ((text: string) => TextRange[]);
export type IgnoreType = {replaceAction?: MDAstTypes | RegExp, placeholder: string, onlyIfMatches?: RegExp, findRanges?: RangeFinder};

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
  yaml: {replaceAction: yamlRegex, placeholder: '---\n---'},
  wikiLink: {replaceAction: wikiLinkRegex, placeholder: '{WIKI_LINK_PLACEHOLDER}'},
  obsidianMultiLineComments: {replaceAction: obsidianMultilineCommentRegex, placeholder: '{OBSIDIAN_COMMENT_PLACEHOLDER}'},
  footnoteAtStartOfLine: {replaceAction: footnoteDefinitionIndicatorAtStartOfLine, placeholder: '{FOOTNOTE_AT_START_OF_LINE_PLACEHOLDER}'},
  footnoteAfterATask: {replaceAction: /- \[.] (\[\^\w+\]) ?([,.;!:?])/gm, placeholder: '{FOOTNOTE_AFTER_A_TASK_PLACEHOLDER}'},
  url: {replaceAction: urlRegex, placeholder: '{URL_PLACEHOLDER}'},
  anchorTag: {replaceAction: anchorTagRegex, placeholder: '{ANCHOR_PLACEHOLDER}'},
  templaterCommand: {replaceAction: templaterCommandRegex, placeholder: '{TEMPLATER_PLACEHOLDER}'},
  // custom ranges
  link: {replaceAction: MDAstTypes.Link, placeholder: '{REGULAR_LINK_PLACEHOLDER}', onlyIfMatches: genericLinkRegex},
  tag: {placeholder: '#tag-placeholder', findRanges: findTagRanges},
  table: {placeholder: '{TABLE_PLACEHOLDER}', findRanges: getAllTablesInText},
  customIgnore: {placeholder: '{CUSTOM_IGNORE_PLACEHOLDER}', findRanges: getAllCustomIgnoreSectionsInText},
} as const;

/**
 * Finds the tags in the text, without the whitespace that has to be in front of one.
 *
 * The whitespace establishes a word boundary but stays writable by spacing rules.
 * @param {string} text The text to find the tags in
 * @return {TextRange[]} The range of each tag, not including the whitespace before it
 */
function findTagRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  for (const match of text.matchAll(tagWithLeadingWhitespaceRegex)) {
    const startIndex = match.index + match[1].length;
    ranges.push({startIndex, endIndex: startIndex + match[2].length});
  }

  return ranges;
}

// Preserve the canonical masking order for projection token precedence.
// Regions that enclose arbitrary markdown come first, then the constraints known to matter:
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

registerCanonicalIgnoreTypeOrder(canonicalIgnoreTypeOrder);
