import {getAllTablesInText} from './mdast';
import {makeSureContentHasEmptyLinesAddedBeforeAndAfter, unescapeMarkdownSpecialCharacters} from './strings';

// Useful regexes
export const allHeadersRegex = /^([ \t]*)(#+)([ \t]+)([^\n\r]*?)([ \t]+#+)?$/gm;
export const fencedRegexTemplate = '^XXX\\.*?\n(?:((?:.|\n)*?)\n)?XXX(?=\\s|$)$';
export const yamlRegex = /^---\n((?:(((?!---)(?:.|\n)*?)\n)?))---(?=\n|$)/;
export const backtickBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '`');
export const tildeBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '~');
export const indentedBlockRegex = '^((\t|( {4})).*\n)+';
export const codeBlockRegex = new RegExp(`${backtickBlockRegexTemplate}|${tildeBlockRegexTemplate}|${indentedBlockRegex}`, 'gm');
// based on https://stackoverflow.com/a/26010910/8353749
export const wikiLinkRegex = /(!?)\[{2}([^\][\n|]+)(\|([^\][\n|]+))?(\|([^\][\n|]+))?\]{2}/g;
// based on https://davidwells.io/snippets/regex-match-markdown-links
export const genericLinkRegex = /(!?)\[([^[]*)\](\(.*\))/g;
// based on https://help.obsidian.md/Editing+and+formatting/Tags#Tag+format
export const tagWithLeadingWhitespaceRegex = /(\s|^)(#[\p{L}\-_\d/\p{Emoji_Presentation}]+)/gu;
export const obsidianMultilineCommentRegex = /^%%\n[^%]*\n%%/gm;
export const wordSplitterRegex = /[,\s]+/;
export const ellipsisRegex = /(\. ?){2}\./g;
export const lineStartingWithWhitespaceOrBlockquoteTemplate = `\\s*(>\\s*)*`;
export const emptyLineMathBlockquoteRegex = /^(>( |\t)*)+\$*?$/m;
export const startsWithBlockquote = /^\s*(>\s*)+/m;
export const tableSeparator = /(\|? *:?-{1,}:? *\|?)(\| *:?-{1,}:? *\|?)*( |\t)*$/gm;
export const tableStartingPipe = /^(((>[ ]?)*)|([ ]{0,3}))\|/m;
export const tableRow = /[^\n]*?\|[^\n]*?(\n|$)/m;
// based on https://gist.github.com/skeller88/5eb73dc0090d4ff1249a
export const simpleURIRegex = /(([a-z\-0-9]+:)\/{2,3})([^\s/?#]*[^\s")'.?!/]|[/])?(([/?#][^\s")']*[^\s")'.?!])|[/])?/gi;
// generated from https://github.com/spamscanner/url-regex-safe using strict: true, returnString: true, and re2: false as options
export const urlRegex = /(?:(?:(?:[a-z]+:)?\/\/)|www\.)(?:localhost|(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?|(?:(?:[a-z0-9][-_]*)*[a-z0-9]+)(?:\.(?:[a-z0-9]-*)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})))(?::\d{2,5})?(?:(?:[/?#][a-z0-9-_%/&=?$.+~!*‘(,#@]*[a-z0-9-%_/$+~!*‘(,])|[/])?/gi;
export const pasteUrlRegex = new RegExp('^' + urlRegex.source + '$', 'si');
export const anchorTagRegex = /<a[\s]+([^>]+)>((?:.(?!<\/a>))*.)<\/a>/g;
export const wordRegex = /[\p{L}\p{N}\p{Pc}\p{M}\-'’`]+/gu;
// regex from https://stackoverflow.com/a/26128757/8353749
export const htmlEntitiesRegex = /&[^\s]+;$/mi;

export const customIgnoreAllStartIndicator = generateHTMLLinterCommentWithSpecificTextAndWhitespaceRegexMatch(true);
export const customIgnoreAllEndIndicator = generateHTMLLinterCommentWithSpecificTextAndWhitespaceRegexMatch(false);

export const smartDoubleQuoteRegex = /[“”„«»]/g;
export const smartSingleQuoteRegex = /[‘’‚‹›]/g;

export const templaterCommandRegex = /<%[^]*?%>/g;
// checklist regex
export const checklistBoxIndicator = '\\[.\\]';
export const checklistBoxStartsTextRegex = new RegExp(`^${checklistBoxIndicator}`);
export const indentedOrBlockquoteNestedChecklistIndicatorRegex = new RegExp(`^${lineStartingWithWhitespaceOrBlockquoteTemplate}- ${checklistBoxIndicator} `);
export const nonBlockquoteChecklistRegex = new RegExp(`^\\s*- ${checklistBoxIndicator} `);

export const startsWithListMarkerRegex = new RegExp(`^\\s*(- |\\* |\\+ |\\d+[.)] |- (${checklistBoxIndicator}) )`, 'm');

export const footnoteDefinitionIndicatorAtStartOfLine = /^(\[\^[^\]]*\]) ?([,.;!:?])/gm;
export const calloutRegex = /^(>\s*)+\[![^\s]*\]/m;
export const codeBlockBlockquoteRegex = /^\n?(>\s*)+((```)|(~~~))/m;

export const unicodeLetterRegex = RegExp(/\p{L}/, 'u');

// https://stackoverflow.com/questions/38866071/javascript-replace-method-dollar-signs
// Important to use this for any regex replacements where the replacement string
// could have user constructed dollar signs in it
export function escapeDollarSigns(str: string): string {
  return str.replace(/\$/g, '$$$$');
}

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Removes spaces from around the wiki link text
 * @param {string} text The text to remove the space from around wiki link text
 * @return {string} The text without space around wiki link link text
 */
export function removeSpacesInWikiLinkText(text: string): string {
  const linkMatches = text.match(wikiLinkRegex);
  if (linkMatches) {
    for (const link of linkMatches) {
      // wiki link with link text
      if (link.includes('|')) {
        const startLinkTextPosition = link.indexOf('|');
        const newLink = link.substring(0, startLinkTextPosition+1) + link.substring(startLinkTextPosition+1, link.length - 2).trim() + ']]';
        text = text.replace(link, newLink);
      }
    }
  }

  return text;
}

/**
 * Makes sure to add a blank line before and after tables except before a table that is on the first line of the text.
 * @param {string} text The text to make sure it has an empty line before and after tables
 * @return {string} The text with an empty line before and after tables unless the table starts off the file
 */
export function ensureEmptyLinesAroundTables(text: string): string {
  const tablePositions = getAllTablesInText(text);
  if (tablePositions.length === 0) {
    return text;
  }

  for (const tablePosition of tablePositions) {
    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, tablePosition.startIndex, tablePosition.endIndex);
  }

  return text;
}

/**
 * Gets the first header one's text from the string provided making sure to convert any links to their display text.
 * @param {string} text - The text to have get the first header one's text from.
 * @return {string} The text for the first header one if present or an empty string.
 */
export function getFirstHeaderOneText(text: string): string {
  const result = text.match(/^#\s+(.*)/m);
  if (result && result[1]) {
    let headerText = result[1];
    headerText = headerText.replaceAll(wikiLinkRegex, (_, _2, $2: string, $3: string) => {
      if ($3 != null) {
        return $3.replace('|', '');
      }

      return $2;
    });

    headerText = headerText.replaceAll(genericLinkRegex, '$2');
    return unescapeMarkdownSpecialCharacters(headerText);
  }

  return '';
}

export function matchTagRegex(text: string): string[] {
  return [...text.matchAll(tagWithLeadingWhitespaceRegex)].map((match) => match[2]);
}

export function generateHTMLLinterCommentWithSpecificTextAndWhitespaceRegexMatch(isStart: boolean): RegExp {
  const regexTemplate = '(?:<!-{2,}|%%) *linter-{ENDING_TEXT} *(?:-{2,}>|%%)';
  let endingText = '';

  if (isStart) {
    endingText += 'disable';
  } else {
    endingText += 'enable';
  }

  return new RegExp(regexTemplate.replace('{ENDING_TEXT}', endingText), 'g');
}
