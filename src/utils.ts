import {remark} from 'remark';
import {visit} from 'unist-util-visit';
import type {Position} from 'unist';
import {load, dump} from 'js-yaml';
import remarkGfm from 'remark-gfm';

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

// Reused placeholders

const yamlPlaceholder = '---\n---';

// Helper functions

/**
 * Gets the positions of the given element type in the given text.
 * @param {string} type The element type to get positions for
 * @param {string} text The markdown text
 * @return {Position[]} The positions of the given element type in the given text
 */
function getPositions(type: string, text: string) {
  const ast = remark().use(remarkGfm).parse(text);
  const positions: Position[] = [];
  visit(ast, type, (node) => {
    positions.push(node.position);
  });

  // Sort positions by start position in reverse order
  positions.sort((a, b) => b.start.offset - a.start.offset);
  return positions;
}

/**
 * Replaces all codeblocks in the given text with a placeholder.
 * @param {string} text The text to replace codeblocks in
 * @param {string} placeholder The placeholder to use
 * @return {string} The text with codeblocks replaced
 * @return {string[]} The codeblocks replaced
 */
function replaceCodeblocks(text: string, placeholder: string): {text: string, replacedCodeBlocks: string[]} {
  const positions: Position[] = getPositions('code', text);
  const replacedCodeBlocks: string[] = [];

  for (const position of positions) {
    const codeblock = text.substring(position.start.offset, position.end.offset);
    replacedCodeBlocks.push(codeblock);
    text = text.substring(0, position.start.offset) + placeholder + text.substring(position.end.offset);
  }

  // Reverse the codeblocks so that they are in the same order as the original text
  replacedCodeBlocks.reverse();

  return {text, replacedCodeBlocks};
}

/**
 * Replaces all links in the given text with a placeholder.
 * @param {string} text The text to replace links in
 * @param {string} regularLinkPlaceholder The placeholder to use for regular markdown links
 * @param {string} wikiLinkPlaceholder The placeholder to use for wiki links
 * @return {string} The text with links replaced
 * @return {string[]} The regular markdown links replaced
 * @return {string[]} The wiki links replaced
 */
function replaceLinks(text: string, regularLinkPlaceholder: string, wikiLinkPlaceholder: string): {text: string, replacedRegularLinks: string[], replacedWikiLinks: string[]} {
  const positions: Position[] = getPositions('link', text);
  const replacedRegularLinks: string[] = [];

  for (const position of positions) {
    if (position == undefined) {
      continue;
    }

    const regularLink = text.substring(position.start.offset, position.end.offset);
    // skip links that are not are not in markdown format
    if (!regularLink.includes('[')) {
      continue;
    }

    replacedRegularLinks.push(regularLink);
    text = text.substring(0, position.start.offset) + regularLinkPlaceholder + text.substring(position.end.offset);
  }

  // Reverse the regular links so that they are in the same order as the original text
  replacedRegularLinks.reverse();

  const replacedWikiLinks: string[] = [];
  const linkMatches = text.match(wikiLinkRegex);
  text = text.replaceAll(wikiLinkRegex, wikiLinkPlaceholder);
  if (linkMatches) {
    for (const link of linkMatches) {
      replacedWikiLinks.push(link);
    }
  }

  return {text, replacedRegularLinks, replacedWikiLinks};
}

/**
 * Makes sure that the style of either strong or emphasis is consistent.
 * @param {string} text The text to style either the strong or emphasis in a consistent manner
 * @param {string} style The style to use for the emphasis indicator (i.e. underscore, asterisk, or consistent)
 * @param {string} type The type of element to make consistent and the value should be either strong or emphasis
 * @return {string} The text with either strong or emphasis styles made consistent
 */
export function makeEmphasisOrBoldConsistent(text: string, style: string, type: string): string {
  const positions: Position[] = getPositions(type, text);
  if (positions.length === 0) {
    return text;
  }

  let indicator = '';
  if (style === 'underscore') {
    indicator = '_';
  } else if (style === 'asterisk') {
    indicator = '*';
  } else {
    const firstPosition = positions[positions.length-1];
    indicator = text.substring(firstPosition.start.offset, firstPosition.start.offset+1);
  }

  // make the size two for the indicator when the type is strong
  if (type === 'strong') {
    indicator += indicator;
  }

  for (const position of positions) {
    text = text.substring(0, position.start.offset) + indicator + text.substring(position.start.offset + indicator.length, position.end.offset - indicator.length) + indicator + text.substring(position.end.offset);
  }

  return text;
}

/**
 * Makes sure that blockquotes, paragraphs, and list items have two spaces at the end of them if the following line continues its content.
 * @param {string} text The text to make sure that the two spaces are added to if there are consecutive lines of content
 * @return {string} The text with two spaces at the end of lines of paragraphs, list items, and blockquotes where there were consecutive lines of content.
 */
export function addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent(text: string): string {
  // added the placeholder for YAML in order to prevent the accidental misconstruing of the YAML as a paragraph when an array is in multiline form (i.e. it has a list for the array elements)
  const yamlMatches = text.match(yamlRegex);
  if (yamlMatches) {
    text = text.replace(yamlMatches[0], escapeDollarSigns(yamlPlaceholder));
  }

  const positions: Position[] = getPositions('paragraph', text);
  if (positions.length === 0) {
    if (yamlMatches) {
      text = text.replace(yamlPlaceholder, escapeDollarSigns(yamlMatches[0]));
    }

    return text;
  }

  for (const position of positions) {
    const paragraphLines = text.substring(position.start.offset, position.end.offset).split('\n');
    const lastLineIndex = paragraphLines.length - 1;
    // only update paragraph if there is more than 1 line present
    if (lastLineIndex < 1) {
      continue;
    }

    for (let i = 0; i < lastLineIndex; i++) {
      const paragraphLine = paragraphLines[i].trimEnd();

      // skip lines that end in <br> or <br/> as it is the same as two spaces in Markdown
      if (paragraphLine.endsWith('<br>') || paragraphLine.endsWith('<br/>')) {
        continue;
      }
      paragraphLines[i] = paragraphLine + '  ';
    }

    text = text.substring(0, position.start.offset) + paragraphLines.join('\n') + text.substring(position.end.offset);
  }

  if (yamlMatches) {
    text = text.replace(yamlPlaceholder, escapeDollarSigns(yamlMatches[0]));
  }

  return text;
}

/**
 * Makes sure that paragraphs have a single new line before and after them.
 * @param {string} text The text to make sure that paragraphs have only 1 new line before and after them
 * @return {string} The text with paragraphs with a single new line before and after them.
 */
export function makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs(text: string): string {
  // added the placeholder for YAML in order to prevent the accidental misconstruing of the YAML as a paragraph when an array is in multiline form (i.e. it has a list for the array elements)
  const yamlMatches = text.match(yamlRegex);
  if (yamlMatches) {
    text = text.replace(yamlMatches[0], escapeDollarSigns(yamlPlaceholder));
  }

  const positions: Position[] = getPositions('paragraph', text);
  if (positions.length === 0) {
    if (yamlMatches) {
      text = text.replace(yamlPlaceholder, escapeDollarSigns(yamlMatches[0]));
    }

    return text;
  }

  for (const position of positions) {
    // get index of previous new line character to get actual paragraph contents rather than just a snippet
    let startIndex = position.start.offset;
    if (startIndex > 0) {
      startIndex--;
    }

    while (startIndex >= 0 && text.charAt(startIndex) != '\n') {
      startIndex--;
    }
    startIndex++;

    const paragraphLines = text.substring(startIndex, position.end.offset).split('\n');

    // exclude list items and blockquotes
    const firstLine = paragraphLines[0].trimStart();
    if (firstLine.startsWith('> ') || firstLine.startsWith('>\t') || firstLine.startsWith('- ') || firstLine.startsWith('-\t') ||
    firstLine.match(/^[0-9]+\.( |\t)+/)) {
      continue;
    }

    const lineCount = paragraphLines.length;
    const newParagraphLines: string[] = [];
    let nextLineIsSameParagraph = false;
    for (let i = 0; i < lineCount; i++) {
      const paragraphLine = paragraphLines[i];

      if (nextLineIsSameParagraph) {
        const lastParagraphLineAdded = newParagraphLines.length-1;
        newParagraphLines[lastParagraphLineAdded] += '\n' + paragraphLine;
      } else {
        newParagraphLines.push(paragraphLine);
      }

      // make sure that lines that end in <br>, <br/>, or two or more spaces are in the same paragraph
      nextLineIsSameParagraph = paragraphLine.endsWith('<br>') || paragraphLine.endsWith('<br/>') || paragraphLine.endsWith('  ');
    }

    // remove new lines prior to paragraph
    while (startIndex > 0 && text.charAt(startIndex-1) == '\n') {
      startIndex--;
    }

    // remove new lines after paragraph
    const textLength = text.length;
    let endIndex = position.end.offset;
    if (endIndex < textLength) {
      endIndex++;
    }

    while (endIndex < textLength && text.charAt(endIndex) == '\n') {
      endIndex++;
    }

    // make sure two new lines are only added between the paragraph and other content
    let startNewLines = '\n\n';
    if (startIndex == 0) {
      startNewLines = '';
    }

    let endNewLines = '\n\n';
    if (endIndex == textLength) {
      endNewLines = '';
    }

    text = text.substring(0, startIndex) + startNewLines + newParagraphLines.join('\n\n') + endNewLines + text.substring(endIndex);
  }

  if (yamlMatches) {
    text = text.replace(yamlPlaceholder, escapeDollarSigns(yamlMatches[0]));
  }

  return text;
}


/**
 * Removes spaces before and after link text
 * @param {string} text The text to make that there are no spaces around the link text of
 * @return {string} The text with spaces around link text removed
 */
export function removeSpacesInLinkText(text: string): string {
  const positions: Position[] = getPositions('link', text);

  for (const position of positions) {
    if (position == undefined) {
      continue;
    }

    const regularLink = text.substring(position.start.offset, position.end.offset);
    // skip links that are not are not in markdown format
    if (!regularLink.includes('[')) {
      continue;
    }

    const endLinkTextPosition = regularLink.lastIndexOf(']');
    const newLink = regularLink.substring(0, 1) + regularLink.substring(1, endLinkTextPosition).trim() + regularLink.substring(endLinkTextPosition);
    text = text.substring(0, position.start.offset) + newLink + text.substring(position.end.offset);
  }

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
 * Moves footnote declarations to the end of the document.
 * @param {string} text The text to move footnotes in
 * @return {string} The text with footnote declarations moved to the end
 */
export function moveFootnotesToEnd(text: string) {
  const positions: Position[] = getPositions('footnoteDefinition', text);
  const footnotes: string[] = [];

  for (const position of positions) {
    const footnote = text.substring(position.start.offset, position.end.offset);
    footnotes.push(footnote);
    // Remove the newline after the footnote if it exists
    if (position.end.offset < text.length && text[position.end.offset] === '\n') {
      text = text.substring(0, position.end.offset) + text.substring(position.end.offset + 1);
    }
    // Remove the newline after the footnote if it exists
    if (position.end.offset < text.length && text[position.end.offset] === '\n') {
      text = text.substring(0, position.end.offset) + text.substring(position.end.offset + 1);
    }
    text = text.substring(0, position.start.offset) + text.substring(position.end.offset);
  }

  // Reverse the footnotes so that they are in the same order as the original text
  footnotes.reverse();

  // Add the footnotes to the end of the document
  if (footnotes.length > 0) {
    text = text.trimEnd() + '\n';
  }
  for (const footnote of footnotes) {
    text += '\n' + footnote;
  }

  return text;
}

/**
 * Substitutes YAML, links, tags, and codeblocks in a text with a placeholder.
 * Then applies the given function to the text.
 * Substitutes the YAML, links, tags, and codeblocks back to their original form.
 * @param {string} text - The text to process
 * @param {function(string): string} func - The function to apply to the text
 * @return {string} The processed text
 */
export function ignoreCodeBlocksYAMLTagsAndLinks(text: string, func: (text: string) => string): string {
  const codePlaceholder = '{PLACEHOLDER 321417}';
  const ret = replaceCodeblocks(text, codePlaceholder);
  text = ret.text;
  const replacedCodeBlocks = ret.replacedCodeBlocks;

  const yamlMatches = text.match(yamlRegex);
  if (yamlMatches) {
    text = text.replace(yamlMatches[0], escapeDollarSigns(yamlPlaceholder));
  }

  const regularLinkPlaceHolder = '{PLACEHOLDER_REGULAR_LINK}';
  const wikiLinkPlaceHolder = '{PLACEHOLDER_WIKI_LINK}';
  const linkResults = replaceLinks(text, regularLinkPlaceHolder, wikiLinkPlaceHolder);
  text = linkResults.text;

  const tagMatches = text.match(tagRegex);
  const tagPlaceholder = '#tag-placeholder';
  text = text.replaceAll(tagRegex, tagPlaceholder);

  text = func(text);

  if (tagMatches) {
    for (const tag of tagMatches) {
      text = text.replace(tagPlaceholder, tag);
    }
  }

  for (const regularLink of linkResults.replacedRegularLinks) {
    // Regex was added to fix capitalization issue  where another rule made the text not match the original place holder's case
    // see https://github.com/platers/obsidian-linter/issues/201
    text = text.replace(new RegExp(regularLinkPlaceHolder, 'i'), regularLink);
  }

  for (const wikiLink of linkResults.replacedWikiLinks) {
    // Regex was added to fix capitalization issue  where another rule made the text not match the original place holder's case
    // see https://github.com/platers/obsidian-linter/issues/201
    text = text.replace(new RegExp(wikiLinkPlaceHolder, 'i'), wikiLink);
  }

  if (yamlMatches) {
    text = text.replace(yamlPlaceholder, escapeDollarSigns(yamlMatches[0]));
  }

  for (const codeblock of replacedCodeBlocks) {
    text = text.replace(codePlaceholder, escapeDollarSigns(codeblock));
  }

  return text;
}

export function formatYAML(text: string, func: (text: string) => string): string {
  if (!text.match(yamlRegex)) {
    return text;
  }

  const oldYaml = text.match(yamlRegex)[0];
  const newYaml = func(oldYaml);
  text = text.replace(oldYaml, escapeDollarSigns(newYaml));

  return text;
}


/**
 * Adds an empty YAML block to the text if it doesn't already have one.
 * @param {string} text - The text to process
 * @return {string} The processed text with an YAML block
 */
export function initYAML(text: string): string {
  if (text.match(yamlRegex) === null) {
    text = '---\n---\n' + text;
  }
  return text;
}

/**
 * Inserts a string at the given position in a string.
 * @param {string} str - The string to insert into
 * @param {number} index - The position to insert at
 * @param {string} value - The string to insert
 * @return {string} The string with the inserted string
 */
export function insert(str: string, index: number, value: string): string {
  return str.substr(0, index) + value + str.substr(index);
}

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
 * Replaces \r with nothing.
 * @param {string} text - Text to strip
 * @return {string} Stripped text
 */
export function stripCr(text: string): string {
  return text.replace(/\r/g, '');
}

export function loadYAML(yaml_text: string): any {
  // replacing tabs at the beginning of new lines with 2 spaces fixes loading yaml that has tabs at the start of a line
  // https://github.com/platers/obsidian-linter/issues/157
  const parsed_yaml = load(yaml_text.replace(/\n(\t)+/g, '\n  ')) as {};
  if (!parsed_yaml) {
    return {};
  }

  return parsed_yaml;
}

export function toYamlString(obj: any): string {
  return dump(obj, {lineWidth: -1}).slice(0, -1);
}
