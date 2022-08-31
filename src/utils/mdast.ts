import {visit} from 'unist-util-visit';
import type {Position} from 'unist';
import type {Root} from 'mdast';
import {replaceTextBetweenStartAndEndWithNewValue} from './strings';
import {escapeRegExp, genericLinkRegex} from './regex';
import {remark} from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

/* eslint-disable no-unused-vars */
export enum MDAstTypes {
  Link = 'link',
  Footnote = 'footnoteDefinition',
  Paragraph = 'paragraph',
  Italics = 'emphasis',
  Bold = 'strong',
  ListItem = 'listItem',
  Code = 'code',
  InlineCode = 'inlineCode',
  Table = 'table',
  Image = 'image',
  List = 'list',
  Blockquote = 'blockquote',
  HorizontalRule = 'thematicBreak',
  // math types
  Math = 'math',
  InlineMath = 'inlineMath',
}
/* eslint-enable no-unused-vars */

function parseTextToAST(text: string): Root {
  const ast = remark().use(remarkGfm).use(remarkMath).parse(text);
  return ast;
}

/**
 * Gets the positions of the given element type in the given text.
 * @param {string} type The element type to get positions for
 * @param {string} text The markdown text
 * @return {Position[]} The positions of the given element type in the given text
 */
export function getPositions(type: MDAstTypes, text: string): Position[] {
  const ast = parseTextToAST(text);
  const positions: Position[] = [];
  visit(ast, type as string, (node) => {
    positions.push(node.position);
  });

  // Sort positions by start position in reverse order
  positions.sort((a, b) => b.start.offset - a.start.offset);
  return positions;
}

// mdast helper methods

/**
 * Moves footnote declarations to the end of the document.
 * @param {string} text The text to move footnotes in
 * @return {string} The text with footnote declarations moved to the end
 */
export function moveFootnotesToEnd(text: string) {
  const positions: Position[] = getPositions(MDAstTypes.Footnote, text);
  let footnotes: string[] = [];

  const alreadyUsedReferencePositions = new Set<number>();
  const mapOfFootnoteToFootnoteReferenceIndex = new Map<string, number>();
  const referencePosition = function(footnote: string, startOfFootnoteReferenceSearch: number): number {
    const footnoteReference = footnote.match(/\[\^.*?\]/)[0];
    let footnoteReferenceLocation: number;
    do {
      footnoteReferenceLocation = text.lastIndexOf(footnoteReference, startOfFootnoteReferenceSearch);
      startOfFootnoteReferenceSearch = footnoteReferenceLocation;
    } while (alreadyUsedReferencePositions.has(footnoteReferenceLocation) && footnoteReferenceLocation !== -1 );

    if (footnoteReferenceLocation === -1) {
      throw new Error(`Footnote '${footnote}' has no corresponding footnote reference before the footnote contents and cannot be processed. Please make sure that all footnotes have a corresponding reference before the content of the footnote.`);
    }

    alreadyUsedReferencePositions.add(footnoteReferenceLocation);
    return footnoteReferenceLocation;
  };


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
    mapOfFootnoteToFootnoteReferenceIndex.set(footnote, referencePosition(footnote, position.start.offset));
  }

  // Sort the footnotes into the order of their references in the text
  footnotes = footnotes.sort((f1: string, f2: string) => {
    return mapOfFootnoteToFootnoteReferenceIndex.get(f1) - mapOfFootnoteToFootnoteReferenceIndex.get(f2);
  });

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
 * @param {MDAstTypes} type The type of element to make consistent and the value should be either strong or emphasis
 * @return {string} The text with either strong or emphasis styles made consistent
 */
export function makeEmphasisOrBoldConsistent(text: string, style: string, type: MDAstTypes): string {
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
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, newContent);
  }

  return text;
}

/**
   * Makes sure that blockquotes, paragraphs, and list items have two spaces at the end of them if the following line continues its content.
   * @param {string} text The text to make sure that the two spaces are added to if there are consecutive lines of content
   * @return {string} The text with two spaces at the end of lines of paragraphs, list items, and blockquotes where there were consecutive lines of content.
   */
export function addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Paragraph, text);
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

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, paragraphLines.join('\n'));
  }

  return text;
}

/**
   * Makes sure that paragraphs have a single new line before and after them.
   * @param {string} text The text to make sure that paragraphs have only 1 new line before and after them
   * @return {string} The text with paragraphs with a single new line before and after them.
   */
export function makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs(text: string): string {
  const hasTrailingLineBreak = text.endsWith('\n');
  const positions: Position[] = getPositions(MDAstTypes.Paragraph, text);
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

    text = replaceTextBetweenStartAndEndWithNewValue(text, startIndex, endIndex, startNewLines + newParagraphLines.join('\n\n') + endNewLines);
  }

  if (hasTrailingLineBreak && !text.endsWith('\n')) {
    text += '\n';
  }

  return text;
}


/**
 * Removes spaces before and after markdown link text
 * @param {string} text The text to make that there are no spaces around the link text of
 * @return {string} The text with spaces around link text removed
 */
export function removeSpacesInLinkText(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Link, text);

  for (const position of positions) {
    if (position == null) {
      continue;
    }

    const regularLink = text.substring(position.start.offset, position.end.offset);
    // skip links that are not are not in markdown format
    if (!regularLink.match(genericLinkRegex)) {
      continue;
    }

    const endLinkTextPosition = regularLink.lastIndexOf(']');
    const newLink = regularLink.substring(0, 1) + regularLink.substring(1, endLinkTextPosition).trim() + regularLink.substring(endLinkTextPosition);
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, newLink);
  }

  return text;
}

export function updateItalicsText(text: string, func:(text: string) => string): string {
  const positions: Position[] = getPositions(MDAstTypes.Italics, text);

  for (const position of positions) {
    let italicText = text.substring(position.start.offset+1, position.end.offset-1);

    italicText = func(italicText);

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset+1, position.end.offset-1, italicText);
  }

  return text;
}

export function updateBoldText(text: string, func:(text: string) => string): string {
  const positions: Position[] = getPositions(MDAstTypes.Bold, text);

  for (const position of positions) {
    let boldText = text.substring(position.start.offset+2, position.end.offset-2);

    boldText = func(boldText);

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset+2, position.end.offset-2, boldText);
  }

  return text;
}

export function updateListItemText(text: string, func:(text: string) => string): string {
  const positions: Position[] = getPositions(MDAstTypes.ListItem, text);

  for (const position of positions) {
    let listText = text.substring(position.start.offset+2, position.end.offset);
    // This helps account for a weird scenario where list items is pulling back multiple list items in one go sometimes
    const listIndicatorRegex = /\n(( |\t)*>?)*(\*|-|\+|- \[( | x)\]|\d+\.) /g;
    const matches = listText.match(listIndicatorRegex);
    if (matches) {
      // capturing groups get added back to the results of split so we need the capturing groups to be converted to non-capturing groups
      // https://stackoverflow.com/questions/37838532/javascript-split-string-with-matchregex
      const listItems = listText.split(new RegExp(listIndicatorRegex.source.replaceAll('(', '(?:')));
      let newListText: string = '';
      let index = 0;
      // eslint-disable-next-line guard-for-in
      for (const listItem of listItems) {
        if (index > 0) {
          newListText += matches[index - 1];
        }

        newListText += func(listItem);
        index++;
      }

      listText = newListText;
    } else {
      listText = func(listText);
    }

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset+2, position.end.offset, listText);
  }

  return text;
}

function textMatches(expectedText: string, actualText: string, requireSameTrailingWhitespace: boolean): boolean {
  if (requireSameTrailingWhitespace) {
    return expectedText == actualText;
  }

  return actualText.match(new RegExp('^' + escapeRegExp(expectedText) + '( |\\t)*$', 'm')) != null;
}

function makeSureContentHasEmptyLinesAddedBeforeAndAfter(text: string, start: number, end: number): string {
  const content = text.substring(start, end);
  let startOfLine = '';
  let requireSameTrailingWhitespace = true;
  let contentPriorToContent = text.substring(0, start);
  if (contentPriorToContent.length > 0) {
    const contentLinesPriorToContent = contentPriorToContent.split('\n');
    startOfLine = contentLinesPriorToContent[contentLinesPriorToContent.length - 1] ?? '';
    requireSameTrailingWhitespace = startOfLine.trim() == '';
    if (!requireSameTrailingWhitespace) {
      startOfLine = startOfLine.trimEnd();
    }

    let numberOfIndexesToRemove = 0;
    while (contentLinesPriorToContent.length - (2 + numberOfIndexesToRemove) >= 0) {
      if (!textMatches(startOfLine, contentLinesPriorToContent[contentLinesPriorToContent.length - (2 + numberOfIndexesToRemove)], requireSameTrailingWhitespace)) {
        break;
      }

      numberOfIndexesToRemove++;
    }

    contentLinesPriorToContent.splice(contentLinesPriorToContent.length - (1 + numberOfIndexesToRemove), numberOfIndexesToRemove);

    if (contentLinesPriorToContent.length > 1 && !textMatches(startOfLine, contentLinesPriorToContent[contentLinesPriorToContent.length - 2], requireSameTrailingWhitespace)) {
      contentLinesPriorToContent.splice(contentLinesPriorToContent.length - 1, 0, startOfLine);
    }

    contentPriorToContent = contentLinesPriorToContent.join('\n');
  }

  let contentAfterContent = text.substring(end);
  if (contentAfterContent.length > 0) {
    const contentLinesAfterBlock = contentAfterContent.split('\n');
    let numberOfIndexesToRemove = 0;
    while (numberOfIndexesToRemove + 1 < contentLinesAfterBlock.length) {
      if (!textMatches(startOfLine, contentLinesAfterBlock[1+numberOfIndexesToRemove], requireSameTrailingWhitespace)) {
        break;
      }

      numberOfIndexesToRemove++;
    }

    contentLinesAfterBlock.splice(1, numberOfIndexesToRemove);

    if (contentLinesAfterBlock.length > 1 && !textMatches(startOfLine, contentLinesAfterBlock[1], requireSameTrailingWhitespace)) {
      contentLinesAfterBlock.splice(1, 0, startOfLine);
    }

    contentAfterContent = contentLinesAfterBlock.join('\n');
  }


  return contentPriorToContent + content + contentAfterContent;
}

export function ensureEmptyLinesAroundFencedCodeBlocks(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Code, text);

  for (const position of positions) {
    const codeBlock = text.substring(position.start.offset, position.end.offset);
    if (!codeBlock.startsWith('```')) {
      continue;
    }

    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, position.end.offset);
  }

  return text;
}

export function ensureEmptyLinesAroundTables(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Table, text);
  for (const position of positions) {
    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, position.end.offset);
  }

  return text;
}
