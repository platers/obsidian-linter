
// Useful regexes

export const headerRegex = /^(\s*)(#+)(\s+)(.*)$/;
export const fencedRegexTemplate = '^XXX\\.*?\n(?:((?:.|\n)*?)\n)?XXX(?=\\s|$)$';
export const yamlRegex = /^---\n((?:(((?!---)(?:.|\n)*?)\n)?))---(?=\n|$)/;
export const backtickBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '`');
export const tildeBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '~');
export const indentedBlockRegex = '^((\t|( {4})).*\n)+';
export const codeBlockRegex = new RegExp(`${backtickBlockRegexTemplate}|${tildeBlockRegexTemplate}|${indentedBlockRegex}`, 'gm');
export const wikiLinkRegex = /(!?)(\[{2}[^[\n\]]*\]{2})/g;
export const tagRegex = /#[^\s#]{1,}/g;
export const obsidianMultilineCommentRegex = /%%\n[^%]*\n%%/g;
export const tableRegex = /([ ]{0,3}\[.*?\][ \t]*\n)?([ ]{0,3}\S+.*?\|.*?\n([^\n]*?\|[^\n]*?\n)*?)?[ ]{0,3}[|\-+:.][ \-+|:.]*?\|[ \-+|:.]*(?:\n?[^\n]*?\|([^\n]*?)*(\n)?)+/g;

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
 * Makes sure to add a blank line before and after the regex matches except before a match that is on the first line of the text or at the end of the file.
 * @param {string} text The text to make sure it has an empty line before and after the regex matches
 * @param {RegExp} regex The regex with a global flag enabled which will have blank lines around it
 * @return {string} The text with an empty line before and after regex matches unless the match starts off or ends the file
 */
export function ensureEmptyLinesAroundRegexMatches(text: string, regex: RegExp): string {
  if (!regex.flags.includes('g')) {
    throw Error('ensureEmptyLinesAroundRegexMatches requires the regex to have the global flag enabled');
  }

  const matches = text.match(regex);
  if (matches == null) {
    return text;
  }

  for (const match of matches) {
    const start = text.indexOf(match);
    const end = start + match.length;

    let newMatchContents = match.trim();
    if (start !== 0) {
      newMatchContents = '\n\n' + newMatchContents;
    }

    if (end < text.length) {
      newMatchContents += '\n\n';
    }

    text = text.replace(match, newMatchContents);
  }

  return text;
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
