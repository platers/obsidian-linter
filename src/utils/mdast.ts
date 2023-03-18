import {visit} from 'unist-util-visit';
import type {Position} from 'unist';
import type {Root} from 'mdast';
import {hashString53Bit, makeSureContentHasEmptyLinesAddedBeforeAndAfter, replaceTextBetweenStartAndEndWithNewValue, getStartOfLineIndex} from './strings';
import {genericLinkRegex} from './regex';
import {gfmFootnote} from 'micromark-extension-gfm-footnote';
import {gfmTaskListItem} from 'micromark-extension-gfm-task-list-item';
import {combineExtensions} from 'micromark-util-combine-extensions';
import {math} from 'micromark-extension-math';
import {mathFromMarkdown} from 'mdast-util-math';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {gfmFootnoteFromMarkdown} from 'mdast-util-gfm-footnote';
import {gfmTaskListItemFromMarkdown} from 'mdast-util-gfm-task-list-item';
import QuickLRU from 'quick-lru';
import {getTextInLanguage} from '../lang/helpers';

const LRU = new QuickLRU({maxSize: 200});

export enum MDAstTypes {
  Link = 'link',
  Footnote = 'footnoteDefinition',
  Paragraph = 'paragraph',
  Italics = 'emphasis',
  Bold = 'strong',
  ListItem = 'listItem',
  Code = 'code',
  InlineCode = 'inlineCode',
  Image = 'image',
  List = 'list',
  Blockquote = 'blockquote',
  HorizontalRule = 'thematicBreak',
  Html = 'html',
  // math types
  Math = 'math',
  InlineMath = 'inlineMath',
}

export enum OrderListItemStyles {
  Ascending = 'ascending',
  Lazy = 'lazy',
}

export enum OrderListItemEndOfIndicatorStyles {
  Period = '.',
  Parenthesis = ')',
}

export enum UnorderedListItemStyles {
  Plus = '+',
  Dash = '-',
  Asterisk = '*',
  Consistent = 'consistent',
}

function parseTextToAST(text: string): Root {
  const textHash = hashString53Bit(text);
  if (LRU.has(textHash)) {
    return LRU.get(textHash) as Root;
  }

  const ast = fromMarkdown(text, {
    extensions: [combineExtensions([gfmFootnote(), gfmTaskListItem]), math()],
    mdastExtensions: [[
      gfmFootnoteFromMarkdown(),
      gfmTaskListItemFromMarkdown,
    ],
    mathFromMarkdown(),
    ],
  });

  LRU.set(textHash, ast);

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
      throw new Error(getTextInLanguage('logs.missing-footnote-error-message').replace('{FOOTNOTE}', footnote));
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

    const endLinkTextPosition = regularLink.indexOf(']');
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

export function ensureEmptyLinesAroundMathBlock(text: string, numberOfDollarSignsForMathBlock: number): string {
  let positions: Position[] = getPositions(MDAstTypes.Math, text);
  for (const position of positions) {
    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, position.end.offset);
  }

  positions = getPositions(MDAstTypes.InlineMath, text);
  for (const position of positions) {
    if (!text.substring(position.start.offset, position.end.offset).startsWith('$'.repeat(numberOfDollarSignsForMathBlock))) {
      continue;
    }

    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, position.end.offset);
  }

  return text;
}

export function ensureEmptyLinesAroundBlockquotes(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Blockquote, text);
  for (const position of positions) {
    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, position.end.offset, true);
  }

  return text;
}

export function updateOrderedListItemIndicators(text: string, orderedListStyle: OrderListItemStyles, orderedListEndStyle: OrderListItemEndOfIndicatorStyles): string {
  const positions: Position[] = getPositions(MDAstTypes.List, text);
  if (!positions) {
    return text;
  }

  for (const position of positions) {
    let start = position.start.offset;
    while (start > 0 && text.charAt(start - 1) !== '\n') {
      start--;
    }
    let listText = text.substring(start, position.end.offset);

    const getListItemLevel = function(preListItemIndicatorContent: string): number {
      const lastBlockQuoteIndicator = preListItemIndicatorContent.lastIndexOf('> ');
      if (lastBlockQuoteIndicator !== -1) {
        preListItemIndicatorContent = preListItemIndicatorContent.substring(lastBlockQuoteIndicator + 2);
      }

      preListItemIndicatorContent = preListItemIndicatorContent.replaceAll('\t', '  ');

      return Math.floor((preListItemIndicatorContent.split(' ').length - 1) / 2) + 1;
    };

    const preListIndicatorLevelsToIndicatorNumber = new Map<number, number>();
    const removeListItemsItemIndicatorInfo = function(start: number, end: number) {
      let i = end;
      while (i > start) {
        preListIndicatorLevelsToIndicatorNumber.delete(i--);
      }
    };

    let lastItemListIndicatorLevel = -1;
    listText = listText.replace(/^(( |\t|> )*)((\d+(\.|\)))|[-*+])([^\n]*)$/gm, (listItem: string, $1: string = '', _$2: string, $3: string, _$4: string, _$5: string, $6: string) => {
      let listItemIndicatorNumber = 1;

      const listItemIndicatorLevel = getListItemLevel($1);
      // when dealing with a value that is not an int reset all values greater than or equal to the current list level
      if (!/^\d/.test($3)) {
        const highestCurretnValue = listItemIndicatorLevel > lastItemListIndicatorLevel ? listItemIndicatorLevel: lastItemListIndicatorLevel;
        removeListItemsItemIndicatorInfo(listItemIndicatorLevel, highestCurretnValue);

        return listItem; // skip to the next item if the current item is not an ordered list item
      }

      if (preListIndicatorLevelsToIndicatorNumber.has(listItemIndicatorLevel)) {
        if (orderedListStyle === OrderListItemStyles.Ascending) {
          listItemIndicatorNumber = preListIndicatorLevelsToIndicatorNumber.get(listItemIndicatorLevel) + 1;
          preListIndicatorLevelsToIndicatorNumber.set(listItemIndicatorLevel, listItemIndicatorNumber);
        }
      } else {
        preListIndicatorLevelsToIndicatorNumber.set(listItemIndicatorLevel, 1);
      }

      // if we have removed an indentation level then go ahead and remove the last set of sublist info for any levels between those two levels
      if (lastItemListIndicatorLevel > listItemIndicatorLevel) {
        removeListItemsItemIndicatorInfo(listItemIndicatorLevel, lastItemListIndicatorLevel);
      }

      lastItemListIndicatorLevel = listItemIndicatorLevel;

      return `${$1}${listItemIndicatorNumber}${orderedListEndStyle}${$6}`;
    });

    text = replaceTextBetweenStartAndEndWithNewValue(text, start, position.end.offset, listText);
  }

  return text;
}

export function updateUnorderedListItemIndicators(text: string, unorderedListStyle: UnorderedListItemStyles): string {
  const positions: Position[] = getPositions(MDAstTypes.ListItem, text);
  if (!positions) {
    return text;
  }

  const orderedListAndCheckboxIndicatorRegex = /^((\d+[.)])|(- \[[ x]\]))/m;

  let unorderedStyle: string = unorderedListStyle;
  if (unorderedListStyle == UnorderedListItemStyles.Consistent) {
    let i = positions.length - 1;
    while (i >= 0) {
      const listText = text.substring(positions[i].start.offset, positions[i].end.offset);
      i--;
      if (listText.match(orderedListAndCheckboxIndicatorRegex)) {
        continue;
      }

      unorderedStyle = listText.charAt(0);
      break;
    }

    if (i == -1) {
      return text;
    }
  }

  for (const position of positions) {
    let listText = text.substring(position.start.offset, position.end.offset);

    if (listText.match(orderedListAndCheckboxIndicatorRegex)) {
      continue;
    }

    listText = unorderedStyle + listText.substring(1);

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, listText);
  }

  return text;
}

export function makeSureMathBlockIndicatorsAreOnTheirOwnLines(text: string, numberOfDollarSignsForMathBlock: number): string {
  let positions: Position[] = getPositions(MDAstTypes.Math, text);
  const mathOpeningIndicatorRegex = new RegExp('^(\\${' + numberOfDollarSignsForMathBlock + ',})(\\n*)');
  const mathEndingIndicatorRegex = new RegExp('(\\n*)(\\${' + numberOfDollarSignsForMathBlock + ',})([^\\$]*)$');
  for (const position of positions) {
    text = addBlankLinesAroundStartAndStopMathIndicators(text, position.start.offset, position.end.offset, mathOpeningIndicatorRegex, mathEndingIndicatorRegex);
  }

  positions = getPositions(MDAstTypes.InlineMath, text);
  for (const position of positions) {
    if (!text.substring(position.start.offset, position.end.offset).startsWith('$'.repeat(numberOfDollarSignsForMathBlock))) {
      continue;
    }

    text = addBlankLinesAroundStartAndStopMathIndicators(text, position.start.offset, position.end.offset, mathOpeningIndicatorRegex, mathEndingIndicatorRegex);
  }

  return text;
}

function addBlankLinesAroundStartAndStopMathIndicators(text: string, mathBlockStartIndex: number, mathBlockEndIndex: number, mathOpeningIndicatorRegex: RegExp, mathEndingIndicatorRegex: RegExp): string {
  const startOfLine = text.substring(getStartOfLineIndex(text, mathBlockStartIndex), mathBlockStartIndex) ?? '';
  let mathBlock = text.substring(mathBlockStartIndex, mathBlockEndIndex);
  mathBlock = mathBlock.replace(mathOpeningIndicatorRegex, (_: string, $1: string, $2: string = '') => {
    // a new line is being added
    if ($2 === '') {
      return $1 + '\n' + startOfLine;
    }

    return $1 + '\n';
  });
  mathBlock= mathBlock.replace(mathEndingIndicatorRegex, (_: string, $1: string = '', $2: string, $3: string) => {
    // a new line is being added
    if ($1 === '') {
      return '\n' + startOfLine + $2 + $3;
    }

    return '\n' + $2 + $3;
  });

  return replaceTextBetweenStartAndEndWithNewValue(text, mathBlockStartIndex, mathBlockEndIndex, mathBlock);
}
