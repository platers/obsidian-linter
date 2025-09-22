import {visit} from 'unist-util-visit';
import type {Position} from 'unist';
import type {Root} from 'mdast';
import {hashString53Bit, makeSureContentHasEmptyLinesAddedBeforeAndAfter, replaceTextBetweenStartAndEndWithNewValue, getStartOfLineIndex, replaceAt, getStartOfLineWhitespaceOrBlockquoteLevel} from './strings';
import {genericLinkRegex, tableRow, tableSeparator, tableStartingPipe, customIgnoreAllStartIndicator, customIgnoreAllEndIndicator, checklistBoxStartsTextRegex, footnoteDefinitionIndicatorAtStartOfLine, emptyLineMathBlockquoteRegex, startsWithBlockquote, startsWithListMarkerRegex} from './regex';
import {gfmFootnote} from 'micromark-extension-gfm-footnote';
import {gfmTaskListItem} from 'micromark-extension-gfm-task-list-item';
import {frontmatter} from 'micromark-extension-frontmatter';
import {frontmatterFromMarkdown} from 'mdast-util-frontmatter';
import {combineExtensions} from 'micromark-util-combine-extensions';
import {math} from 'micromark-extension-math';
import {mathFromMarkdown} from 'mdast-util-math';
import {fromMarkdown} from 'mdast-util-from-markdown';
import {gfmFootnoteFromMarkdown} from 'mdast-util-gfm-footnote';
import {gfmTaskListItemFromMarkdown} from 'mdast-util-gfm-task-list-item';
import QuickLRU from 'quick-lru';
import {countInstances} from './strings';
import {getTextInLanguage} from '../lang/helpers';

const LRU = new QuickLRU({maxSize: 200});

type PositionPlusEmptyIndicator = {
  position: Position,
  isEmpty: boolean,
}

type PositionPlusText = {
  position: Position,
  text: string,
}

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
  Heading = 'heading',
  Text = 'text',
  // math types
  Math = 'math',
  InlineMath = 'inlineMath',
}

export enum OrderListItemStyles {
  Ascending = 'ascending',
  Lazy = 'lazy',
  Preserve = 'preserve',
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

export enum LineBreakIndicators {
  TwoSpaces = '  ',
  LineBreakHtmlNotXml = '<br>',
  LineBreakHtml = '<br/>',
  Backslash = '\\',
}

function parseTextToAST(text: string): Root {
  const textHash = hashString53Bit(text);
  if (LRU.has(textHash)) {
    return LRU.get(textHash) as Root;
  }

  // @ts-expect-error for some reason an overload is missing
  const ast = fromMarkdown(text, {
    extensions: [combineExtensions([gfmFootnote(), gfmTaskListItem(), frontmatter(['yaml'])]), math()],
    mdastExtensions: [[
      gfmFootnoteFromMarkdown(),
      gfmTaskListItemFromMarkdown,
      frontmatterFromMarkdown(['yaml']),
    ],
    mathFromMarkdown(),
    ],
  });

  LRU.set(textHash, ast);

  return ast;
}

/**
 * Gets the positions of the given element type in the given text.
 * @param {string} type - The element type to get positions for
 * @param {string} text - The markdown text
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

/**
 * Gets the positions of the list item text in the given text.
 * @param {string} text - The markdown text
 * @param {boolean} includeEmptyNodes - Whether or not empty list items should be
 * returned to be handled by the calling function
 * @return {PositionPlusEmptyIndicator[]} The positions of the list item text in the given text
 * with a status as to whether or not they are empty
 */
function getListItemTextPositions(text: string, includeEmptyNodes: boolean = false): PositionPlusEmptyIndicator[] {
  const ast = parseTextToAST(text);
  const positions: PositionPlusEmptyIndicator[] = [];
  visit(ast, MDAstTypes.ListItem as string, (node) => {
    // @ts-ignore the fact that not all nodes have a children property since I am skipping any that do not
    if (!node.children || node.children.length === 0) {
      if (includeEmptyNodes) {
        positions.push({
          position: node.position,
          isEmpty: true,
        });
      }

      return;
    }

    // @ts-ignore the fact that not all nodes have a children property since I have already exited the function if that is the case
    for (const childNode of node.children) {
      if (childNode.type === (MDAstTypes.Paragraph as string)) {
        positions.push({
          position: childNode.position,
          isEmpty: false,
        });
      }
    }
  });

  // Sort positions by start position in reverse order
  positions.sort((a, b) => b.position.start.offset - a.position.start.offset);
  return positions;
}

function getHeaderTextPositions(text: string): PositionPlusText[] {
  const ast = parseTextToAST(text);
  const positions: PositionPlusText[] = [];
  visit(ast, MDAstTypes.Heading as string, (node) => {
    // @ts-ignore the fact that not all nodes have a children property since I am skipping any that do not
    if (!node.children || node.children.length === 0) {
      return;
    }

    // @ts-ignore the fact that not all nodes have a children property since I have already exited the function if that is the case
    for (const childNode of node.children) {
      if (childNode.type === (MDAstTypes.Text as string)) {
        positions.push({
          position: childNode.position as Position,
          text: childNode.value as string,
        });
      }
    }
  });

  // Sort positions by start position in reverse order
  positions.sort((a, b) => b.position.start.offset - a.position.start.offset);
  return positions;
}

// mdast helper methods

/**
 * Moves footnote declarations to the end of the document.
 * @param {string} text The text to move footnotes in
 * @param {boolean} includeBlankLinesBetweenFootnotes Whether to have a blank line between footnotes
 * @return {string} The text with footnote declarations moved to the end
 */
export function moveFootnotesToEnd(text: string, includeBlankLinesBetweenFootnotes: boolean): string {
  const positions: Position[] = getPositions(MDAstTypes.Footnote, text);
  let footnotes: string[] = [];

  type footnoteKeyInfo = {
    key: string,
    referencePositions: number[], // last instance to first instance in file
    footnotesReferencingKey: string[], // last instance to first instance in file
  };

  const footnoteKeyToFootnoteKeyInfo = new Map<string, footnoteKeyInfo>();
  const mapOfFootnoteToFootnoteReferenceIndex = new Map<string, number>();

  const getAllReferencePositionsForFootnote = function(text: string, footnote: string, startOfFootnoteReferenceSearch: number): void {
    const footnoteReference = footnote.match(/\[\^.*?\]/)[0];

    if (footnoteKeyToFootnoteKeyInfo.has(footnoteReference)) {
      const keyInfo = footnoteKeyToFootnoteKeyInfo.get(footnoteReference);
      keyInfo.footnotesReferencingKey.push(footnote);

      footnoteKeyToFootnoteKeyInfo.set(footnoteReference, keyInfo);

      return;
    }

    let footnoteReferenceLocation: number;
    const footnoteReferenceLocations: number[] = [];
    do {
      footnoteReferenceLocation = text.lastIndexOf(footnoteReference, startOfFootnoteReferenceSearch);
      if (footnoteReferenceLocation === -1) {
        continue;
      }

      footnoteReferenceLocations.push(footnoteReferenceLocation);

      startOfFootnoteReferenceSearch = footnoteReferenceLocation - 1;
    } while (footnoteReferenceLocation > 0);

    const keyInfo: footnoteKeyInfo = {
      key: footnoteReference,
      referencePositions: footnoteReferenceLocations,
      footnotesReferencingKey: [footnote],
    };

    footnoteKeyToFootnoteKeyInfo.set(footnoteReference, keyInfo);
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

    getAllReferencePositionsForFootnote(text, footnote, position.start.offset);
  }

  for (const footnoteData of footnoteKeyToFootnoteKeyInfo) {
    const keyInfo = footnoteData[1];
    // we need to offset the index to pull from for the footnote based on the difference in the amount of keys present, but make sure it is >= 0
    let offset = keyInfo.referencePositions.length - keyInfo.footnotesReferencingKey.length;
    offset = offset >= 0 ? offset: 0; // this allows us to properly hit not found error messages
    let index = 0;
    for (const footnote of keyInfo.footnotesReferencingKey) {
      if (index + offset >= keyInfo.referencePositions.length) {
        throw new Error(getTextInLanguage('logs.missing-footnote-error-message').replace('{FOOTNOTE}', footnote));
      }

      mapOfFootnoteToFootnoteReferenceIndex.set(footnote, keyInfo.referencePositions[offset + index++]);
    }
  }

  // Sort the footnotes into the order of their references in the text
  footnotes = footnotes.sort((f1: string, f2: string) => {
    return mapOfFootnoteToFootnoteReferenceIndex.get(f1) - mapOfFootnoteToFootnoteReferenceIndex.get(f2);
  });

  // Add the footnotes to the end of the document
  if (footnotes.length > 0) {
    text = text.trimEnd();
  }
  let whitespaceBetweenFootnotes = '\n';
  if (includeBlankLinesBetweenFootnotes) {
    whitespaceBetweenFootnotes = '\n\n';
  } else {
    text += '\n';
  }

  for (const footnote of footnotes) {
    text += whitespaceBetweenFootnotes + footnote;
  }

  return text;
}

/**
 * Re-indexes the footnotes in the document making sure that they increase in number from 1 on up.
 * @param {string} text - The text to re-index the footnotes in.
 * @return {string} The text with footnotes re-indexed.
 */
export function reIndexFootnotes(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Footnote, text);
  const footnotes: string[] = [];

  type keyInfo = {
    key: string,
    position: number,
  }

  const footnoteToFootnoteKey = new Map<string, string>();
  const oldKeyToNewKey = new Map<string, string>();
  const footnoteReferenceLocationInfo: keyInfo[] = [];
  const footnoteKeys = new Set<string>();
  const duplicateFootnotesToReplace: string[] = [];

  const getAllFootnoteReferences = function(text: string, footnote: string, startOfFootnoteReferenceSearch: number): void {
    const footnoteReference = footnote.match(/\[\^.*?\]/)[0];
    footnoteToFootnoteKey.set(footnote, footnoteReference);

    const footnoteKeyAlreadyUsed = footnoteKeys.has(footnoteReference);
    if (footnoteKeyAlreadyUsed && footnotes.includes(footnote)) {
      duplicateFootnotesToReplace.unshift(footnote);

      return;
    } else if (footnoteKeyAlreadyUsed) {
      throw new Error(getTextInLanguage('logs.too-many-footnotes-error-message').replace('{FOOTNOTE_KEY}', footnoteReference));
    }

    let footnoteReferenceLocation: number;
    do {
      footnoteReferenceLocation = text.lastIndexOf(footnoteReference, startOfFootnoteReferenceSearch);
      if (footnoteReferenceLocation === -1) {
        continue;
      }

      if (footnoteReferenceLocation + footnote.length > text.length || text.substring(footnoteReferenceLocation, footnoteReferenceLocation + footnote.length) !== footnote) {
        footnoteReferenceLocationInfo.push({key: footnoteReference, position: footnoteReferenceLocation});
      }

      startOfFootnoteReferenceSearch = footnoteReferenceLocation - 1;
    } while (footnoteReferenceLocation > 0);

    footnoteKeys.add(footnoteReference);
  };

  for (const position of positions) {
    const footnote = text.substring(position.start.offset, position.end.offset);
    footnotes.unshift(footnote);

    getAllFootnoteReferences(text, footnote, position.start.offset);
  }

  let footnoteIndex = 1;
  const footnotesAdded = new Set<string>();
  for (const footnote of footnotes) {
    if (footnotesAdded.has(footnote)) {
      continue;
    }

    footnotesAdded.add(footnote);
    const footnoteKey = footnoteToFootnoteKey.get(footnote);
    const newFootnoteKey = `[^${footnoteIndex++}]`;
    oldKeyToNewKey.set(footnoteKey, newFootnoteKey);
  }

  footnoteReferenceLocationInfo.sort((pos1: keyInfo, pos2: keyInfo) => {
    return pos2.position - pos1.position;
  });

  // replace the values that are tied to existing positions from last to first first since replace works even if positions change
  for (const footnoteReference of footnoteReferenceLocationInfo) {
    const newFootnoteKey = oldKeyToNewKey.get(footnoteReference.key);

    text = replaceAt(text, footnoteReference.key, newFootnoteKey, footnoteReference.position);
  }

  for (const footnote of footnotesAdded) {
    const footnoteKey = footnoteToFootnoteKey.get(footnote);
    const newFootnoteKey = oldKeyToNewKey.get(footnoteKey);

    text = text.replace(footnote, footnote.replace(footnoteKey, newFootnoteKey));
  }

  for (const duplicateFootnoteDefinition of duplicateFootnotesToReplace) {
    let newText = text.replace(`\n${duplicateFootnoteDefinition}\n`, '\n');
    if (text === newText) {
      newText = text.replace(duplicateFootnoteDefinition, '');
    }

    text = newText;
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
   * @param {LineBreakIndicators} indicator The indicator to use for the lines that do not already use a blank line indicator
   * @return {string} The text with two spaces at the end of lines of paragraphs, list items, and blockquotes where there were consecutive lines of content.
   */
export function addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent(text: string, indicator: LineBreakIndicators): string {
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
      const paragraphLine = paragraphLines[i];

      if (lineEndsInLineBreak(paragraphLine, indicator)) {
        continue;
      }
      paragraphLines[i] = addOrReplaceLineEnding(paragraphLine, indicator);
    }

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, position.end.offset, paragraphLines.join('\n'));
  }

  return text;
}

function lineEndsInLineBreak(paragraphLine: string, indicator: LineBreakIndicators): boolean {
  if (paragraphLine.endsWith('<br>') && indicator == LineBreakIndicators.LineBreakHtmlNotXml) {
    return true;
  }

  if (paragraphLine.endsWith('<br/>') && indicator == LineBreakIndicators.LineBreakHtml) {
    return true;
  }

  if (paragraphLine.endsWith('  ') && indicator == LineBreakIndicators.TwoSpaces) {
    return true;
  }

  if (!paragraphLine.endsWith('\\\\') && paragraphLine.endsWith('\\') && indicator == LineBreakIndicators.Backslash) {
    return true;
  }

  return false;
}

function addOrReplaceLineEnding(paragraphLine: string, indicator: LineBreakIndicators): string {
  paragraphLine = paragraphLine.trimEnd();
  let numCharsToRemove = 0;
  if (paragraphLine.endsWith('<br>')) {
    numCharsToRemove = 4;
  }

  if (paragraphLine.endsWith('<br/>')) {
    numCharsToRemove = 5;
  }

  if (!paragraphLine.endsWith('\\\\') && paragraphLine.endsWith('\\')) {
    numCharsToRemove = 1;
  }

  if (numCharsToRemove) {
    paragraphLine = paragraphLine.substring(0, paragraphLine.length - numCharsToRemove);
  }

  return paragraphLine.trimEnd() + indicator;
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

    // exclude list items, footnote definitions, and blockquotes
    const firstLine = paragraphLines[0].trimStart();
    if (firstLine.startsWith('>') || firstLine.match(startsWithListMarkerRegex) || firstLine.match(footnoteDefinitionIndicatorAtStartOfLine)) {
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

      // make sure that lines that end in \, <br>, <br/>, or two or more spaces are in the same paragraph
      nextLineIsSameParagraph = paragraphLine.endsWith(LineBreakIndicators.LineBreakHtmlNotXml) || paragraphLine.endsWith(LineBreakIndicators.LineBreakHtml) || paragraphLine.endsWith(LineBreakIndicators.TwoSpaces) || (!paragraphLine.endsWith('\\\\') && paragraphLine.endsWith(LineBreakIndicators.Backslash));
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

export function updateListItemText(text: string, func:(text: string) => string, includeEmptyNodes: boolean = false): string {
  const positions: PositionPlusEmptyIndicator[] = getListItemTextPositions(text, includeEmptyNodes);

  for (const position of positions) {
    let startIndex = position.position.start.offset;
    if (position.isEmpty) {
      // get the actual start of the list item leaving only 1 whitespace between the indicator and the text
      while (startIndex < position.position.end.offset && text.charAt(startIndex).trim() !== '') {
        startIndex++;
      }

      if (startIndex < position.position.end.offset) {
        startIndex++;
      }
    } else {
      // get the actual start of the list item leaving only 1 whitespace between the indicator and the text
      while (startIndex > 0 && text.charAt(startIndex - 1).trim() === '') {
        startIndex--;
      }

      // keep a single space for the indicator
      if (startIndex === 0 || text.charAt(startIndex - 1).trim() != '') {
        startIndex++;
      }
    }

    let listText = text.substring(startIndex, position.position.end.offset);
    // for some reason some checklists are not getting treated as such and this causes the task indicator to be included in the text
    if (checklistBoxStartsTextRegex.test(listText)) {
      startIndex += 4;
      listText = listText.substring(4);
    }

    listText = func(listText);

    text = replaceTextBetweenStartAndEndWithNewValue(text, startIndex, position.position.end.offset, listText);
  }

  return text;
}

export function ensureEmptyLinesAroundFencedCodeBlocks(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Code, text);

  for (const position of positions) {
    const codeBlock = text.substring(position.start.offset, position.end.offset);
    if (!codeBlock.startsWith('```') && ! codeBlock.startsWith(`~~~`)) {
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
    // make sure to shift end to the next new line character just in case blockquotes are nested which can cause changes to move content out of the original position expected
    let endIndex = position.end.offset;
    while (endIndex < text.length - 1 && text.charAt(endIndex) !== '\n') {
      endIndex++;
    }

    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, endIndex, true);
  }

  return text;
}

export function ensureEmptyLinesAroundHorizontalRule(text: string): string {
  const positions: Position[] = getPositions(MDAstTypes.HorizontalRule, text);
  for (const position of positions) {
    text = makeSureContentHasEmptyLinesAddedBeforeAndAfter(text, position.start.offset, position.end.offset);
  }
  return text;
}

export function updateOrderedListItemIndicators(text: string, orderedListStyle: OrderListItemStyles, orderedListEndStyle: OrderListItemEndOfIndicatorStyles, preserveStart: boolean): string {
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
      let listItemIndicatorNumber = (orderedListStyle === OrderListItemStyles.Preserve || preserveStart) ? Number(_$4) : 1;
      const listItemIndicatorLevel = getListItemLevel($1);
      // when dealing with a value that is not an int reset all values greater than or equal to the current list level
      if (!/^\d/.test($3)) {
        const highestCurrentValue = listItemIndicatorLevel > lastItemListIndicatorLevel ? listItemIndicatorLevel: lastItemListIndicatorLevel;
        removeListItemsItemIndicatorInfo(listItemIndicatorLevel, highestCurrentValue);

        return listItem; // skip to the next item if the current item is not an ordered list item
      }

      if (preListIndicatorLevelsToIndicatorNumber.has(listItemIndicatorLevel)) {
        if (orderedListStyle === OrderListItemStyles.Ascending) {
          listItemIndicatorNumber = preListIndicatorLevelsToIndicatorNumber.get(listItemIndicatorLevel) + 1;
          preListIndicatorLevelsToIndicatorNumber.set(listItemIndicatorLevel, listItemIndicatorNumber);
        } else if (preserveStart) {
          listItemIndicatorNumber = preListIndicatorLevelsToIndicatorNumber.get(listItemIndicatorLevel);
        }
      } else {
        preListIndicatorLevelsToIndicatorNumber.set(listItemIndicatorLevel, listItemIndicatorNumber);
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

/**
* Updates all blockquotes in the provided text based on the function provided.
* @param {string} text - The text to update the blockquotes in.
* @param {function(text: string): string} func - The operation to run on each blockquote to update them.
* @return {string} The text with the blockquotes updated based on the provided function.
*/
export function updateBlockquotes(text: string, func: (text: string) => string): string {
  const positions: Position[] = getPositions(MDAstTypes.Blockquote, text);
  for (const position of positions) {
    // make sure to shift end to the next new line character just in case blockquotes are nested which can cause changes to move content out of the original position expected
    let endIndex = position.end.offset;
    while (endIndex < text.length - 1 && text.charAt(endIndex) !== '\n') {
      endIndex++;
    }

    let blockquoteContents = text.substring(position.start.offset, endIndex);
    blockquoteContents = func(blockquoteContents);

    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset, endIndex, blockquoteContents);
  }

  return text;
}


export function makeSureMathBlockIndicatorsAreOnTheirOwnLines(text: string, numberOfDollarSignsForMathBlock: number): string {
  let positions: Position[] = getPositions(MDAstTypes.Math, text);
  const mathOpeningIndicatorRegex = new RegExp('^(\\${' + numberOfDollarSignsForMathBlock + ',})(\\n*)');
  const mathEndingIndicatorRegex = new RegExp('(\\n*)(\\${' + numberOfDollarSignsForMathBlock + ',})([^\\$]*)$');
  for (const position of positions) {
    const mathBlock = text.substring(position.start.offset, position.end.offset);
    const mathBlockIndexes = breakMathBlockIntoMultipleBlocksIfNeedBe(mathBlock, numberOfDollarSignsForMathBlock, position.start.offset);

    for (const blockIndexes of mathBlockIndexes) {
      text = addBlankLinesAroundStartAndStopMathIndicators(text, blockIndexes.startIndex, blockIndexes.endIndex, mathOpeningIndicatorRegex, mathEndingIndicatorRegex);
    }
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

function breakMathBlockIntoMultipleBlocksIfNeedBe(mathBlock: string, numberOfDollarSignsForMathBlock: number, startIndexOfMathBlock: number): {startIndex: number, endIndex: number}[] {
  let mathBlockIndicator = '$'.repeat(numberOfDollarSignsForMathBlock);
  let endOfOpeningIndicator = numberOfDollarSignsForMathBlock;
  while (mathBlock.charAt(endOfOpeningIndicator) === '$') {
    mathBlockIndicator += '$';
    endOfOpeningIndicator++;
  }

  const mathBlockIndexes = [] as {startIndex: number, endIndex: number}[];

  let matchCount = countInstances(mathBlock, mathBlockIndicator);
  if (matchCount <= 1) {
    return [];
  } else if (matchCount === 2) {
    mathBlockIndexes.unshift({
      startIndex: startIndexOfMathBlock,
      endIndex: startIndexOfMathBlock + mathBlock.length,
    });

    return mathBlockIndexes;
  } else if (matchCount === 3) {
    mathBlockIndexes.unshift({
      startIndex: startIndexOfMathBlock,
      endIndex: startIndexOfMathBlock + mathBlock.indexOf(mathBlockIndicator, mathBlockIndicator.length) + mathBlockIndicator.length,
    });
  }

  // if there is an odd amount of matches, remove one from the list so it is even
  if (matchCount % 2 === 1) {
    matchCount--;
  }

  // pair the earliest matches together until there are no more pairs
  let startIndex = startIndexOfMathBlock;
  let startSearch = mathBlockIndicator.length;
  while (matchCount > 2) {
    const endOfIndex = mathBlock.indexOf(mathBlockIndicator, startSearch) + mathBlockIndicator.length;
    mathBlockIndexes.unshift({
      startIndex: startIndex,
      endIndex: startIndexOfMathBlock + endOfIndex,
    });

    startIndex = startIndexOfMathBlock + endOfIndex + 1;
    startSearch = endOfIndex + 1;
    matchCount -= 2;
  }

  mathBlockIndexes.unshift({
    startIndex: startIndexOfMathBlock + mathBlock.indexOf(mathBlockIndicator, startSearch),
    endIndex: startIndexOfMathBlock + mathBlock.length,
  });

  return mathBlockIndexes;
}

function addBlankLinesAroundStartAndStopMathIndicators(text: string, mathBlockStartIndex: number, mathBlockEndIndex: number, mathOpeningIndicatorRegex: RegExp, mathEndingIndicatorRegex: RegExp): string {
  const startOfLine = text.substring(getStartOfLineIndex(text, mathBlockStartIndex), mathBlockStartIndex) ?? '';
  const [lineStart] = getStartOfLineWhitespaceOrBlockquoteLevel(startOfLine, startOfLine.length);
  const startOfEndingLine = text.substring(getStartOfLineIndex(text, mathBlockEndIndex), mathBlockEndIndex) ?? '';
  let mathBlock = text.substring(mathBlockStartIndex, mathBlockEndIndex);
  const isBlockquote = startsWithBlockquote.test(startOfLine.trim());
  let startingNewLineAdded = false;

  mathBlock = mathBlock.replace(mathOpeningIndicatorRegex, (_: string, $1: string, $2: string = '') => {
    let newOpening = '';
    if (!isBlockquote && startOfLine.trim() != '') {
      newOpening += '\n';
      startingNewLineAdded = true;
    } else if (isBlockquote && !emptyLineMathBlockquoteRegex.test(startOfLine)) {
      newOpening += '\n' + lineStart;
      startingNewLineAdded = true;
    }

    newOpening += $1 + '\n';

    // a new line is being added
    if ($2 === '' && isBlockquote) {
      newOpening += lineStart;
    }

    return newOpening;
  });
  mathBlock = mathBlock.replace(mathEndingIndicatorRegex, (match: string, $1: string = '', $2: string, $3: string) => {
    const groupOneIsEmpty = $1 === '';

    // make sure that a blank blockquote line is checked for in order to determine if a change needs to happen just for blockquotes
    if (groupOneIsEmpty && isBlockquote && emptyLineMathBlockquoteRegex.test(startOfEndingLine.trim())) {
      return match;
    } else if (groupOneIsEmpty && isBlockquote) { // a new line is being added
      return '\n' + lineStart + $2 + $3;
    }

    return '\n' + $2 + $3;
  });

  // try to cleanup whitespace that may get left behind by this logic when moving the opening
  // math block indicators to its own line
  // eslint-disable-next-line no-unmodified-loop-condition
  while (startingNewLineAdded && mathBlockStartIndex > 0) {
    const previousChar = text[mathBlockStartIndex-1];
    if (previousChar !== ' ' && previousChar !== '\t') {
      break;
    }

    mathBlockStartIndex--;
  }

  return replaceTextBetweenStartAndEndWithNewValue(text, mathBlockStartIndex, mathBlockEndIndex, mathBlock);
}

/**
 * Gets a list of all tables in the provided text and returns a list of starting and ending positions from the
 * last to first found based on index.
 * @param {string} text - The text to get the list of table locations from.
 * @return {{startIndex: number, endIndex: number}[]} An array of start and end indexes of each table found from last to earliest.
 */
export function getAllTablesInText(text: string): {startIndex: number, endIndex: number}[] {
  const regexMatches = [...text.matchAll(tableSeparator)];
  const positions: {startIndex: number, endIndex: number}[] = [];
  for (const match of regexMatches) {
    const startOfCurrentLine = getStartOfLineIndex(text, match.index);
    if (startOfCurrentLine === 0) {
      continue;
    }

    const startOfPreviousLine = getStartOfLineIndex(text, startOfCurrentLine - 1);

    const separatorRowMatch = match[0];
    const tableRowSeparator = text.substring(startOfCurrentLine, match.index + separatorRowMatch.length);
    if (isInvalidTableSeparatorRow(tableRowSeparator, separatorRowMatch)) {
      continue;
    }

    let start = startOfPreviousLine;
    let firstLine = text.substring(startOfPreviousLine, startOfCurrentLine - 1);
    // a table must have a pipe in either the header or the separator row
    if (!separatorRowMatch.includes('|') && !firstLine.includes('|')) {
      continue;
    }

    firstLine = firstLine.replace(tableStartingPipe, (match: string)=> {
      // do nothing if the table only has whitespace or a pipe before it
      const trimmedMatch = match.trim();
      if (trimmedMatch === '' || trimmedMatch === '|') {
        return '';
      }

      start += match.length - 1;

      return '';
    });
    let delimiterLine = separatorRowMatch.replace(tableStartingPipe, '');
    if (firstLine.endsWith('|')) {
      firstLine = firstLine.slice(0, -1);
    }

    if (delimiterLine.endsWith('|')) {
      delimiterLine = delimiterLine.slice(0, -1);
    }

    // if the delimiter row and the first row do not have the same amount of cells,
    // we are not dealing with a table
    if (countTableDelimiters(firstLine) !== countTableDelimiters(delimiterLine)) {
      continue;
    }

    // need to check that two lines before the separator line does not start and end with a pipe
    if (startOfPreviousLine !== 0) {
      const startOfTwoLinesPrior = getStartOfLineIndex(text, startOfPreviousLine - 1);
      const twoLinesPrior = text.substring(startOfTwoLinesPrior, startOfPreviousLine - 1);
      if (twoLinesPrior.startsWith('|') || twoLinesPrior.endsWith('|')) {
        // the match is at best a row in a table
        continue;
      }
    }


    let end = match.index + match[0].length;

    if (end >= text.length - 1) {
      positions.push({
        startIndex: start,
        endIndex: text.length,
      });

      continue;
    }

    const remainingLines = text.substring(end + 1).split('\n');
    let index = 0;
    // grab rows as part of the table until empty line or it no longer matches row content
    while (index < remainingLines.length && tableRow.test(remainingLines[index])) {
      end += remainingLines[index].length + 1;
      index++;
    }

    positions.push({
      startIndex: start,
      endIndex: end,
    });
  }

  return positions.reverse();
}

function isInvalidTableSeparatorRow(fullRow: string, separatorMatch: string): boolean {
  if (fullRow.trim() === '') {
    return true;
  }

  // The regex for the separator allows for two back to back pipes in the middle of the row, so we need to filter those results out
  // since they are not valid
  if (separatorMatch.includes('||')) {
    return true;
  }

  // handle a scenario where the regex fails to work as intended and matches the ending of an invalid table separator
  // it could contain text or an invalid table cell for the separator
  const nonSeparatorContent = fullRow.replace(separatorMatch, '');
  return /[^\s>]/.test(nonSeparatorContent);
}

function countTableDelimiters(line: string): number {
  let previousCharIsEscapeChar = false;
  let numEscapeCharsInARow = 0;
  let numDelimiters = 0;
  let currentChar = '';
  for (let i = 0; i < line.length; i++) {
    currentChar = line[i];
    if (currentChar === '\\') {
      numEscapeCharsInARow++;
      previousCharIsEscapeChar = numEscapeCharsInARow % 2 == 1;
    } else {
      numEscapeCharsInARow = 0;
      if (currentChar === '|' && !previousCharIsEscapeChar) {
        numDelimiters++;
      }

      previousCharIsEscapeChar = false;
    }
  }

  return numDelimiters;
}

export function getAllCustomIgnoreSectionsInText(text: string): {startIndex: number, endIndex: number}[] {
  let iteratorIndex = 0;

  const positions: {startIndex: number, endIndex: number}[] = [];
  const startMatches = [...text.matchAll(customIgnoreAllStartIndicator)];
  if (!startMatches || startMatches.length === 0) {
    return positions;
  }

  const endMatches = [...text.matchAll(customIgnoreAllEndIndicator)];

  startMatches.forEach((startMatch) => {
    iteratorIndex = startMatch.index;

    let foundEndingIndicator = false;
    let endingPosition = text.length - 1;
    // eslint-disable-next-line no-unmodified-loop-condition -- endMatches does not need to be modified with regards to being undefined or null
    while (endMatches && endMatches.length !== 0 && !foundEndingIndicator) {
      if (endMatches[0].index <= iteratorIndex) {
        endMatches.shift();
      } else {
        foundEndingIndicator = true;

        const endingIndicator = endMatches[0];
        endingPosition = endingIndicator.index + endingIndicator[0].length;
      }
    }

    positions.push({
      startIndex: iteratorIndex,
      endIndex: endingPosition,
    });

    if (!endMatches || endMatches.length === 0) {
      return;
    }
  });

  return positions.reverse();
}

export function ensureFencedCodeBlocksHasLanguage(text: string, defaultLanguage: string): string {
  const positions: Position[] = getPositions(MDAstTypes.Code, text);

  for (const position of positions) {
    const codeBlock = text.substring(position.start.offset, position.end.offset);
    if (!codeBlock.startsWith('```')) {
      continue;
    }

    const language = codeBlock.substring(3, codeBlock.indexOf('\n')).trim();
    if (language !== '') {
      continue;
    }
    text = replaceTextBetweenStartAndEndWithNewValue(text, position.start.offset + 3, position.start.offset + 3, defaultLanguage);
  }

  return text;
}

export function updateHeaderText(text: string, func:(text: string) => string): string {
  const positions = getHeaderTextPositions(text);

  // for the best performance, we want to grab all places that need updating and then
  // at the end we want to update the text in one go because otherwise we get a lot of
  // instances of the file text in memory
  const updateLocations: {startIndex: number, endIndex: number, newText: string}[] = [];
  for (const position of positions) {
    const updatedText = func(position.text);
    if (updatedText !== position.text) {
      const headerText = text.substring(position.position.start.offset, position.position.end.offset);
      const startIndex = position.position.start.offset+ headerText.indexOf(position.text);
      updateLocations.push({
        startIndex: startIndex,
        endIndex: startIndex + position.text.length,
        newText: updatedText,
      });
    }
  }

  for (const headerUpdate of updateLocations) {
    text = replaceTextBetweenStartAndEndWithNewValue(text, headerUpdate.startIndex, headerUpdate.endIndex, headerUpdate.newText);
  }

  return text;
}
