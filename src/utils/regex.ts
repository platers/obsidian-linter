
import {makeSureContentHasEmptyLinesAddedBeforeAndAfter} from './strings';

// Useful regexes
export const headerRegex = /^(\s*)(#+)(\s+)(.*)$/m;
export const fencedRegexTemplate = '^XXX\\.*?\n(?:((?:.|\n)*?)\n)?XXX(?=\\s|$)$';
export const yamlRegex = /^---\n((?:(((?!---)(?:.|\n)*?)\n)?))---(?=\n|$)/;
export const backtickBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '`');
export const tildeBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '~');
export const indentedBlockRegex = '^((\t|( {4})).*\n)+';
export const codeBlockRegex = new RegExp(`${backtickBlockRegexTemplate}|${tildeBlockRegexTemplate}|${indentedBlockRegex}`, 'gm');
// based on https://stackoverflow.com/a/26010910/8353749
export const wikiLinkRegex = /(!?)\[{2}([^\][\n|]+)(\|([^\][\n|]+))?\]{2}/g;
// based on https://davidwells.io/snippets/regex-match-markdown-links
export const genericLinkRegex = /(!?)\[([^[]*)\](\(.*\))/g;
export const tagRegex = /(?:\s|^)#[^\s#;.,><?!=+]+/g;
export const obsidianMultilineCommentRegex = /^%%\n[^%]*\n%%/gm;
export const wordSplitterRegex = /[,\s]+/;
export const ellipsisRegex = /(\. ?){2}\./g;
export const lineStartingWithWhitespaceOrBlockquoteTemplate = `\\s*(>\\s*)*`;
// Note that the following regex has an issue where if the table is followed by another table with only 1 blank line between them, it considers them to be one table
// if this becomes an issue, we can address it then
export const tableRegex = /((((>[ ]?)*)|([ ]{0,3}))\[.*?\][ \t]*\n)?((((>[ ]?)*)|([ ]{0,3}))\S+.*?\|.*?\n([^\n]*?\|[^\n]*?\n)*?)?(((>[ ]?)*)|([ ]{0,3}))[|\-+:.][ \-+|:.]*?\|[ \-+|:.]*(?:\n?[^\n]*?\|([^\n]*?)*(\n)?)+/g;
export const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s`\]'"‘’“”>]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s`\]'"‘’“”>]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s`\]'"‘’“”>]{2,}|www\.[a-zA-Z0-9]+\.[^\s`\]'"‘’“”>]{2,})/gi;

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
  const tableMatches = text.match(tableRegex);
  if (tableMatches == null) {
    return text;
  }

  for (const table of tableMatches) {
    let start = text.indexOf(table);
    const end = start + table.trimEnd().length;
    if (table.trim().startsWith('>')) {
      while (text.charAt(start).trim() === '' || text.charAt(start) === '>') {
        start++;
      }
    }

    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, start, end);
  }

  return text;
}

/**
 * Converts text to no longer have any links in it.
 * @param {string} text - The text to have the regular and image links converted to their text.
 * @return {string} The text without any links in it.
 */
export function convertLinksAndImagesToDisplayText(text: string): string {
  text = text.replaceAll(wikiLinkRegex, '$2');
  text = text.replaceAll(genericLinkRegex, '$2');

  return text;
}
