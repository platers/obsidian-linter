import {remark} from 'remark';
import {visit} from 'unist-util-visit';
import type {Position} from 'unist';
import type {Root} from 'mdast';
import remarkGfm from 'remark-gfm';
import {wikiLinkRegex} from './regex';
import {replaceWithValueBetweenStartAndEnd} from './strings';

const mdastTypes: Record<string, string> = {
  link: 'link',
  footnote: 'footnoteDefinition',
  paragraph: 'paragraph',
};

// let cachedASTRoot: Root;

function parseTextToAST(text: string): Root {
  const ast = remark().use(remarkGfm).parse(text);
  //   cachedASTRoot = ast;

  return ast;
}

/**
 * Gets the positions of the given element type in the given text.
 * @param {string} type The element type to get positions for
 * @param {string} text The markdown text
 * @return {Position[]} The positions of the given element type in the given text
 */
export function getPositions(type: string, text: string): Position[] {
//   const ast = cachedASTRoot ?? parseTextToAST(text);
  const ast = parseTextToAST(text);
  const positions: Position[] = [];
  visit(ast, type, (node) => {
    positions.push(node.position);
  });

  // Sort positions by start position in reverse order
  positions.sort((a, b) => b.start.offset - a.start.offset);
  return positions;
}

/**
 * Invalidates the cache of the ast root, so that we do not accidentally use an old ast root
 * @param {boolean} textHasChanged Whether or not the text has changed
 */
// export function textChanged(textHasChanged: boolean): void {
//   if (textHasChanged) {
//     cachedASTRoot = undefined;
//   }
// }

// mdast helper methods

/**
 * Moves footnote declarations to the end of the document.
 * @param {string} text The text to move footnotes in
 * @return {string} The text with footnote declarations moved to the end
 */
export function moveFootnotesToEnd(text: string) {
  const positions: Position[] = getPositions(mdastTypes.footnote, text);
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
    const newContent = indicator + text.substring(position.start.offset + indicator.length, position.end.offset - indicator.length) + indicator;
    text = replaceWithValueBetweenStartAndEnd(text, position.start.offset, position.end.offset, newContent);
  }

  return text;
}

/**
   * Makes sure that blockquotes, paragraphs, and list items have two spaces at the end of them if the following line continues its content.
   * @param {string} text The text to make sure that the two spaces are added to if there are consecutive lines of content
   * @return {string} The text with two spaces at the end of lines of paragraphs, list items, and blockquotes where there were consecutive lines of content.
   */
export function addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent(text: string): string {
  const positions: Position[] = getPositions(mdastTypes.paragraph, text);
  if (positions.length === 0) {
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

    text = replaceWithValueBetweenStartAndEnd(text, position.start.offset, position.end.offset, paragraphLines.join('\n'));
  }

  return text;
}

/**
   * Makes sure that paragraphs have a single new line before and after them.
   * @param {string} text The text to make sure that paragraphs have only 1 new line before and after them
   * @return {string} The text with paragraphs with a single new line before and after them.
   */
export function makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs(text: string): string {
  const positions: Position[] = getPositions(mdastTypes.paragraph, text);
  if (positions.length === 0) {
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

    text = replaceWithValueBetweenStartAndEnd(text, startIndex, endIndex, startNewLines + newParagraphLines.join('\n\n') + endNewLines);
  }

  return text;
}


/**
 * Removes spaces before and after markdown link text
 * @param {string} text The text to make that there are no spaces around the link text of
 * @return {string} The text with spaces around link text removed
 */
export function removeSpacesInLinkText(text: string): string {
  const positions: Position[] = getPositions(mdastTypes.link, text);

  for (const position of positions) {
    const regularLink = text.substring(position.start.offset, position.end.offset);
    // skip links that are not are not in markdown format
    if (!regularLink.includes('[')) {
      continue;
    }

    const endLinkTextPosition = regularLink.lastIndexOf(']');
    const newLink = regularLink.substring(0, 1) + regularLink.substring(1, endLinkTextPosition).trim() + regularLink.substring(endLinkTextPosition);
    text = replaceWithValueBetweenStartAndEnd(text, position.start.offset, position.end.offset, newLink);
  }

  return text;
}
