import {obsidianMultilineCommentRegex, tagWithLeadingWhitespaceRegex, wikiLinkRegex, yamlRegex, escapeDollarSigns, genericLinkRegex, urlRegex, anchorTagRegex, templaterCommandRegex, footnoteDefinitionIndicatorAtStartOfLine} from './regex';
import {getAllCustomIgnoreSectionsInText, getAllTablesInText, getPositions, MDAstTypes} from './mdast';
import type {Position} from 'unist';
import {replaceTextBetweenStartAndEndWithNewValue} from './strings';

export type IgnoreFunction = ((text: string, placeholder: string) => [placeholderInfo[], string]);
export type IgnoreType = {replaceAction: MDAstTypes | RegExp | IgnoreFunction, placeholder: string};

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
  link: {replaceAction: replaceMarkdownLinks, placeholder: '{REGULAR_LINK_PLACEHOLDER}'},
  tag: {replaceAction: replaceTags, placeholder: '#tag-placeholder'},
  table: {replaceAction: replaceTables, placeholder: '{TABLE_PLACEHOLDER}'},
  customIgnore: {replaceAction: replaceCustomIgnore, placeholder: '{CUSTOM_IGNORE_PLACEHOLDER}'},
} as const;

type placeholderInfo = {placeholder: string, replacedValue: string}

export function ignoreListOfTypes(ignoreTypes: IgnoreType[], text: string, func: ((text: string) => string)): string {
  let setOfPlaceholders: placeholderInfo[] = [];

  // replace ignore blocks with their placeholders
  let placeholders: placeholderInfo[] = [];
  for (const ignoreType of ignoreTypes) {
    if (typeof ignoreType.replaceAction === 'string') { // mdast
      [placeholders, text] = replaceMdastType(text, ignoreType.placeholder, ignoreType.replaceAction);
    } else if (ignoreType.replaceAction instanceof RegExp) {
      [placeholders, text] = replaceRegex(text, ignoreType.placeholder, ignoreType.replaceAction);
    } else if (typeof ignoreType.replaceAction === 'function') {
      const ignoreFunc: IgnoreFunction = ignoreType.replaceAction;
      [placeholders, text] = ignoreFunc(text, ignoreType.placeholder);
    }

    setOfPlaceholders.push(...placeholders);
  }

  text = func(text);

  setOfPlaceholders = setOfPlaceholders.reverse();
  // add back values that were replaced with their placeholders
  if (setOfPlaceholders != null && setOfPlaceholders.length > 0) {
    setOfPlaceholders.forEach((replacedInfo: placeholderInfo) => {
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
function replaceMdastType(text: string, placeholder: string, type: MDAstTypes): [placeholderInfo[], string] {
  let positions: Position[] = getPositions(type, text);
  const replacedValues: placeholderInfo[] = [];

  if (type === MDAstTypes.List) {
    positions = removeOverlappingPositions(positions);
  }

  for (const position of positions) {
    const valueToReplace = text.substring(position.start.offset, position.end.offset);
    replacedValues.push({placeholder: getNewPlaceHolder(placeholder), replacedValue: valueToReplace});
  }

  let i = 0;
  for (const position of positions) {
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, replacedValues[i++].placeholder);
  }

  // Reverse the replaced values so that they are in the same order as the original text
  replacedValues.reverse();

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

  if (regex.flags.includes('g')) {
    text = text.replaceAll(regex, (match: string) => {
      const id = getNewPlaceHolder(placeholder);
      textMatches.push({placeholder: id, replacedValue: match});

      return id;
    });
  } else {
    text = text.replace(regex, (match: string) => {
      const id = getNewPlaceHolder(placeholder);
      textMatches.push({placeholder: id, replacedValue: match});

      return id;
    });
  }

  return [textMatches, text];
}

/**
 * Replaces all markdown links in the given text with a placeholder.
 * @param {string} text The text to replace links in
 * @param {string} regularLinkPlaceholder The placeholder to use for regular markdown links
 * @return {string} The text with links replaced
 * @return {placeholderInfo[]} The regular markdown links replaced and generated placeholder
 */
function replaceMarkdownLinks(text: string, regularLinkPlaceholder: string): [placeholderInfo[], string] {
  const positions: Position[] = getPositions(MDAstTypes.Link, text);
  const replacedRegularLinks: placeholderInfo[] = [];


  const positionsToReplace: Position [] = [];
  for (const position of positions) {
    if (position == undefined) {
      continue;
    }

    const regularLink = text.substring(position.start.offset, position.end.offset);
    // skip links that are not in markdown format
    if (!regularLink.match(genericLinkRegex)) {
      continue;
    }

    positionsToReplace.push(position);
    replacedRegularLinks.push({placeholder: getNewPlaceHolder(regularLinkPlaceholder), replacedValue: regularLink});
  }

  let i = 0;
  for (const position of positionsToReplace) {
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, replacedRegularLinks[i++].placeholder);
  }

  // Reverse the regular links so that they are in the same order as the original text
  replacedRegularLinks.reverse();

  return [replacedRegularLinks, text];
}

function replaceTags(text: string, placeholder: string): [placeholderInfo[], string] {
  const replacedValues: placeholderInfo[] = [];

  text = text.replace(tagWithLeadingWhitespaceRegex, (_, whitespace, tag) => {
    const id = getNewPlaceHolder(placeholder);

    replacedValues.push({placeholder: id, replacedValue: tag});
    return whitespace + id;
  });

  return [replacedValues, text];
}

function replaceTables(text: string, tablePlaceholder: string): [placeholderInfo[], string] {
  const tablePositions = getAllTablesInText(text);

  const replacedTables: placeholderInfo[] = new Array(tablePositions.length);
  let index = 0;
  const length = replacedTables.length;
  for (const tablePosition of tablePositions) {
    replacedTables[length - 1 - index++] = {placeholder: getNewPlaceHolder(tablePlaceholder), replacedValue: text.substring(tablePosition.startIndex, tablePosition.endIndex)};
  }

  let i = length -1;
  for (const tablePosition of tablePositions) {
    text = replaceTextBetweenStartAndEndWithNewValue(text, tablePosition.startIndex, tablePosition.endIndex, replacedTables[i--].placeholder);
  }

  return [replacedTables, text];
}


function replaceCustomIgnore(text: string, customIgnorePlaceholder: string): [placeholderInfo[], string] {
  const customIgnorePositions = getAllCustomIgnoreSectionsInText(text);

  const replacedSections: placeholderInfo[] = new Array(customIgnorePositions.length);
  let index = 0;
  const length = replacedSections.length;
  for (const customIgnorePosition of customIgnorePositions) {
    replacedSections[length - 1 - index++] = {placeholder: getNewPlaceHolder(customIgnorePlaceholder), replacedValue: text.substring(customIgnorePosition.startIndex, customIgnorePosition.endIndex)};
  }

  let i = length - 1;
  for (const customIgnorePosition of customIgnorePositions) {
    text = replaceTextBetweenStartAndEndWithNewValue(text, customIgnorePosition.startIndex, customIgnorePosition.endIndex, replacedSections[i--].placeholder);
  }

  return [replacedSections, text];
}

function removeOverlappingPositions(positions: Position[]): Position[] {
  if (positions.length < 2) {
    return positions;
  }

  let lastPosition: Position = positions.pop();
  let currentPosition: Position = null;
  const result: Position[] = [lastPosition];
  while (positions.length > 0) {
    currentPosition = positions.pop();
    if (lastPosition.start.offset >= currentPosition.end.offset || currentPosition.start.offset >= lastPosition.end.offset) {
      result.unshift(currentPosition);
      lastPosition = currentPosition;
    }
  }

  return result;
}

function getNewPlaceHolder(placeholder: string): string {
  if (placeholder.includes('---')) {
    return placeholder;
  }

  // This is not a true uuid, but it gets the job done, so I will use this and avoid trying to figure out
  // how to use crypto with this logic here
  const uuid = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  if (placeholder.endsWith('}')) {
    return placeholder.replace('}', uuid + '}');
  }

  return placeholder + uuid;
}
