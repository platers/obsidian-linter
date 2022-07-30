import {obsidianMultilineCommentRegex, tagRegex, wikiLinkRegex, yamlRegex, escapeDollarSigns} from './regex';
import {getPositions, MDAstTypes} from './mdast';
import type {Position} from 'unist';
import {replaceTextBetweenStartAndEndWithNewValue} from './strings';


export type IgnoreResults = {replacedValues: string[], newText: string};
export type IgnoreFunction = ((text: string, placeholder: string) => IgnoreResults);
export type IgnoreType = {replaceAction: MDAstTypes | RegExp | IgnoreFunction, placeholder: string, replaceDollarSigns: boolean};

export const IgnoreTypes: Record<string, IgnoreType> = {
  // mdast node types
  code: {replaceAction: MDAstTypes.Code, placeholder: '{CODE_BLOCK_PLACEHOLDER}', replaceDollarSigns: true},
  image: {replaceAction: MDAstTypes.Image, placeholder: '{IMAGE_PLACEHOLDER}', replaceDollarSigns: false},
  thematicBreak: {replaceAction: MDAstTypes.HorizontalRule, placeholder: '{HORIZONTAL_RULE_PLACEHOLDER}', replaceDollarSigns: false},
  italics: {replaceAction: MDAstTypes.Italics, placeholder: '{ITALICS_PLACEHOLDER}', replaceDollarSigns: false},
  bold: {replaceAction: MDAstTypes.Bold, placeholder: '{STRONG_PLACEHOLDER}', replaceDollarSigns: false},
  list: {replaceAction: MDAstTypes.List, placeholder: '{LIST_PLACEHOLDER}', replaceDollarSigns: false},
  blockquote: {replaceAction: MDAstTypes.Blockquote, placeholder: '{BLOCKQUOTE_PLACEHOLDER}', replaceDollarSigns: false},
  table: {replaceAction: MDAstTypes.Table, placeholder: '{TABLE_PLACEHOLDER}', replaceDollarSigns: false},
  // RegExp
  yaml: {replaceAction: yamlRegex, placeholder: escapeDollarSigns('---\n---'), replaceDollarSigns: true},
  wikiLink: {replaceAction: wikiLinkRegex, placeholder: '{WIKI_LINK_PLACEHOLDER}', replaceDollarSigns: false},
  tag: {replaceAction: tagRegex, placeholder: '#tag-placeholder', replaceDollarSigns: false},
  // table: {replaceAction: tableRegex, placeholder: '{TABLE_PLACEHOLDER}', replaceDollarSigns: false},
  obsidianMultiLineComments: {replaceAction: obsidianMultilineCommentRegex, placeholder: '{OBSIDIAN_COMMENT_PLACEHOLDER}', replaceDollarSigns: false},
  // custom functions
  link: {replaceAction: replaceMarkdownLinks, placeholder: '{REGULAR_LINK_PLACEHOLDER}', replaceDollarSigns: false},
};

export function ignoreListOfTypes(ignoreTypes: IgnoreType[], text: string, func: ((text: string) => string)): string {
  let setOfPlaceholders: {placeholder: string, replacedValues: string[], replaceDollarSigns: boolean}[] = [];

  // replace ignore blocks with their placeholders
  for (const ignoreType of ignoreTypes) {
    let ignoredResult: IgnoreResults;
    if (typeof ignoreType.replaceAction === 'string') { // mdast
      ignoredResult = replaceMdastType(text, ignoreType.placeholder, ignoreType.replaceAction);
    } else if (ignoreType.replaceAction instanceof RegExp) {
      ignoredResult = replaceRegex(text, ignoreType.placeholder, ignoreType.replaceAction);
    } else if (typeof ignoreType.replaceAction === 'function') {
      const ignoreFunc: IgnoreFunction = ignoreType.replaceAction;
      ignoredResult = ignoreFunc(text, ignoreType.placeholder);
    }

    text = ignoredResult.newText;
    setOfPlaceholders.push({replacedValues: ignoredResult.replacedValues, placeholder: ignoreType.placeholder, replaceDollarSigns: ignoreType.replaceDollarSigns});
  }

  text = func(text);

  setOfPlaceholders = setOfPlaceholders.reverse();
  // add back values that were replaced with their placeholders
  if (setOfPlaceholders != null && setOfPlaceholders.length > 0) {
    setOfPlaceholders.forEach((replacedInfo: {placeholder: string, replacedValues: string[], replaceDollarSigns: boolean}) => {
      replacedInfo.replacedValues.forEach((replacedValue: string) => {
        if (replacedInfo.replaceDollarSigns == true) {
          replacedValue = escapeDollarSigns(replacedValue);
        }

        // Regex was added to fix capitalization issue  where another rule made the text not match the original place holder's case
        // see https://github.com/platers/obsidian-linter/issues/201
        text = text.replace(new RegExp(replacedInfo.placeholder, 'i'), replacedValue);
      });
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
 * @return {string[]} The mdast nodes values replaced
 */
function replaceMdastType(text: string, placeholder: string, type: MDAstTypes): IgnoreResults {
  const positions: Position[] = getPositions(type, text);
  const replacedValues: string[] = [];

  for (const position of positions) {
    const valueToReplace = text.substring(position.start.offset, position.end.offset);
    replacedValues.push(valueToReplace);
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, placeholder);
  }

  // Reverse the replaced values so that they are in the same order as the original text
  replacedValues.reverse();

  return {newText: text, replacedValues};
}

/**
 * Replaces all regex matches in the given text with a placeholder.
 * @param {string} text The text to replace the regex matches in
 * @param {string} placeholder The placeholder to use
 * @param {RegExp} regex The regex to use to find what to replace with the placeholder
 * @return {string} The text with regex matches replaced
 * @return {string[]} The regex matches replaced
 */
function replaceRegex(text: string, placeholder: string, regex: RegExp): IgnoreResults {
  const regexMatches = text.match(regex);
  const textMatches: string[] = [];
  if (regex.flags.includes('g')) {
    text = text.replaceAll(regex, placeholder);

    if (regexMatches) {
      for (const matchText of regexMatches) {
        textMatches.push(matchText);
      }
    }
  } else {
    text = text.replace(regex, placeholder);

    if (regexMatches) {
      textMatches.push(regexMatches[0]);
    }
  }

  return {newText: text, replacedValues: textMatches};
}

/**
 * Replaces all markdown links in the given text with a placeholder.
 * @param {string} text The text to replace links in
 * @param {string} regularLinkPlaceholder The placeholder to use for regular markdown links
 * @return {string} The text with links replaced
 * @return {string[]} The regular markdown links replaced
 */
function replaceMarkdownLinks(text: string, regularLinkPlaceholder: string): IgnoreResults {
  const positions: Position[] = getPositions(MDAstTypes.Link, text);
  const replacedRegularLinks: string[] = [];

  for (const position of positions) {
    if (position == undefined) {
      continue;
    }

    const regularLink = text.substring(position.start.offset, position.end.offset);
    // skip links that are not in markdown format
    if (!regularLink.includes('[')) {
      continue;
    }

    replacedRegularLinks.push(regularLink);
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, regularLinkPlaceholder);
  }

  // Reverse the regular links so that they are in the same order as the original text
  replacedRegularLinks.reverse();

  return {newText: text, replacedValues: replacedRegularLinks};
}
