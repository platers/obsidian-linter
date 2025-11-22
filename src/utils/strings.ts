import {calloutRegex, codeBlockBlockquoteRegex} from './regex';
import {getTextInLanguage} from '../lang/helpers';
import {logWarn} from './logger';
import {getAllTablesInText} from './mdast';
/**
 * Inserts a string at the given position in a string.
 * @param {string} str - The string to insert into
 * @param {number} index - The position to insert at
 * @param {string} value - The string to insert
 * @return {string} The string with the inserted string
 */
export function insert(str: string, index: number, value: string): string {
  return str.substring(0, index) + value + str.substring(index);
}

/**
 * Replaces a string by inserting it between the start and end positions provided for a string.
 * @param {string} str - The string to replace a value from
 * @param {number} start - The position to insert at
 * @param {number} end - The position to stop text replacement at
 * @param {string} value - The string to insert
 * @return {string} The string with the replacement string added over the specified start and stop
 */
export function replaceTextBetweenStartAndEndWithNewValue(str: string, start: number, end: number, value: string): string {
  return str.substring(0, start) + value + str.substring(end);
}

/**
 * Replaces \r with nothing.
 * @param {string} text - Text to strip
 * @return {string} Stripped text
 */
export function stripCr(text: string): string {
  return text.replace(/\r/g, '');
}

export function getStartOfLineWhitespaceOrBlockquoteLevel(text: string, startPosition: number): [string, number] {
  if (startPosition === 0) {
    return ['', 0];
  }

  let startOfLine = '';
  let index = startPosition;
  while (index >= 0) {
    const char = text.charAt(index);
    if (char === '\n') {
      break;
    } else if (char.trim() === '' || char === '>') {
      startOfLine = char + startOfLine;
    } else {
      startOfLine = '';
    }

    index--;
  }

  return [startOfLine, index];
}

function getEmptyLine(line: string = ''): string {
  const [lineStart] = getStartOfLineWhitespaceOrBlockquoteLevel(line, line.length);

  return '\n' + lineStart.trim();
}

function getEmptyLineForAfterBlockquote(nextLine: string = '', isCallout: boolean = false, blockquoteLevel: number = 1): string {
  const potentialEmptyLine = getEmptyLine(nextLine);
  const nextBlockquoteLevel = countInstances(potentialEmptyLine, '>');

  // avoid joining callouts together
  const dealingWithACallout = isCallout || calloutRegex.test(nextLine);
  if (dealingWithACallout && blockquoteLevel === nextBlockquoteLevel) {
    return potentialEmptyLine.substring(0, potentialEmptyLine.lastIndexOf('>'));
  }

  // if the level after you is more than you, keep the current level (i.e. 2 to a 3)
  if (blockquoteLevel < nextBlockquoteLevel) {
    return potentialEmptyLine.substring(0, potentialEmptyLine.lastIndexOf('>'));
  }

  // if the level after you is less than you, use that level (i.e. 3 to a 2)
  return potentialEmptyLine;
}

function makeSureContentHasASingleEmptyLineBeforeItUnlessItStartsAFile(text: string, startOfContent: number): string {
  if (startOfContent === 0) {
    return text;
  }

  let index = startOfContent;
  let startOfNewContent = startOfContent;
  while (index >= 0) {
    const currentChar = text.charAt(index);
    if (currentChar.trim() !== '') {
      break; // if non-whitespace is encountered, then the line has content
    } else if (currentChar === '\n') {
      startOfNewContent = index;
    }
    index--;
  }

  if (index < 0 || startOfNewContent === 0) {
    return text.substring(startOfContent + 1);
  }

  return text.substring(0, startOfNewContent) + '\n' + text.substring(startOfContent);
}

function makeSureContentHasASingleEmptyLineBeforeItUnlessItStartsAFileForBlockquote(text: string, startOfLine: string, startOfContent: number, isCallout: boolean = false, addingEmptyLinesAroundBlockquotes: boolean = false): string {
  if (startOfContent === 0) {
    return text;
  }

  const nestingLevel = startOfLine.split('>').length - 1;
  let index = startOfContent;
  let startOfNewContent = startOfContent;
  let lineNestingLevel = 0;
  let foundABlankLine = false;
  let previousChar = '';
  while (index >= 0) {
    const currentChar = text.charAt(index);
    if (currentChar.trim() !== '' && currentChar !== '>') {
      break; // if non-whitespace, non-gt-bracket is encountered, then the line has content
    } else if (currentChar === '>') {
      // if we go from having a blank line at any point to then having more blockquote content we know we have encountered another blockquote
      if (foundABlankLine) {
        break;
      }

      lineNestingLevel++;
    } else if (currentChar === '\n') {
      if (lineNestingLevel === 0 || lineNestingLevel === nestingLevel || (lineNestingLevel + 1) === nestingLevel) {
        startOfNewContent = index;
        lineNestingLevel = 0;

        if (previousChar === '\n') {
          foundABlankLine = true;
        }
      } else {
        break;
      }
    }
    index--;
    previousChar = currentChar;
  }

  if (index < 0 || startOfNewContent === 0) {
    return text.substring(startOfContent + 1);
  }

  const startingEmptyLines = text.substring(startOfNewContent, startOfContent);
  const startsWithEmptyLine = startingEmptyLines === '\n' || startingEmptyLines.startsWith('\n\n');
  if (startsWithEmptyLine) {
    return text.substring(0, startOfNewContent) + '\n' + text.substring(startOfContent);
  }

  const indexOfLastNewLine = text.lastIndexOf('\n', startOfNewContent - 1);
  let priorLine = '';
  if (indexOfLastNewLine === -1) {
    priorLine = text.substring(0, startOfNewContent);
  } else {
    priorLine = text.substring(indexOfLastNewLine, startOfNewContent);
  }

  let firstLineOfBlockquote: string;
  const indexOfEndOfFirstLine = text.indexOf('\n', startOfContent+1);
  if (indexOfEndOfFirstLine === -1) {
    firstLineOfBlockquote = text.substring(startOfContent);
  } else {
    firstLineOfBlockquote = text.substring(startOfContent, indexOfEndOfFirstLine);
  }

  let emptyLine: string;
  if (addingEmptyLinesAroundBlockquotes) {
    emptyLine = getEmptyLineForAfterBlockquote(priorLine, isCallout, nestingLevel);
  } else if (countInstances(priorLine, '>') != 0 && !calloutRegex.test(priorLine) && (codeBlockBlockquoteRegex.test(priorLine) || codeBlockBlockquoteRegex.test(firstLineOfBlockquote))) {
    // for now we will assume that the current empty line is correct if we are dealing with a table on the current or next line
    // we can change this to the necessary implementation when this scenario is encountered
    emptyLine = text.substring(startOfNewContent, startOfContent).trimEnd();
  } else {
    emptyLine = getEmptyLine(priorLine);
  }

  return text.substring(0, startOfNewContent) + emptyLine + text.substring(startOfContent);
}

function makeSureContentHasASingleEmptyLineAfterItUnlessItEndsAFile(text: string, endOfContent: number): string {
  if (endOfContent === (text.length - 1)) {
    return text;
  }

  let index = endOfContent;
  let endOfNewContent = endOfContent;
  let isFirstNewLine = true;
  while (index < text.length) {
    const currentChar = text.charAt(index);
    if (currentChar.trim() !== '') {
      break; // if non-whitespace is encountered, then the line has content
    } else if (currentChar === '\n') {
      if (isFirstNewLine) {
        isFirstNewLine = false;
      } else {
        endOfNewContent = index;
      }
    }
    index++;
  }

  if (index === text.length || endOfNewContent === text.length - 1) {
    return text.substring(0, endOfContent);
  }

  return text.substring(0, endOfContent) + '\n' + text.substring(endOfNewContent);
}

function makeSureContentHasASingleEmptyLineAfterItUnlessItEndsAFileForBlockquote(text: string, startOfLine: string, endOfContent: number, isCallout: boolean = false, addingEmptyLinesAroundBlockquotes: boolean = false): string {
  if (endOfContent === (text.length - 1)) {
    return text;
  }

  const nestingLevel = startOfLine.split('>').length - 1;
  let index = endOfContent;
  let endOfNewContent = endOfContent;
  let isFirstNewLine = true;
  let lineNestingLevel = 0;
  let foundABlankLine = false;
  let previousChar = '';
  let firstChar = true;
  // for some reason I am getting the ending new line character for the blockquote and other times it is
  // the new line character after the ending new line character that is the end of the blockquote. So
  // check the character before the starting end of content to see if we need to prematurely exit
  // if it is a newline character.
  // see https://github.com/platers/obsidian-linter/issues/910
  const preEndingChar = text.charAt(index - 1);
  while (index < text.length) {
    const currentChar = text.charAt(index);
    if (currentChar.trim() !== '' && currentChar !== '>') {
      break; // if non-whitespace is encountered, then the line has content
    } else if (currentChar === '>') {
      // if we go from having a blank line at any point to then having more blockquote content we know we have encountered another blockquote
      if (foundABlankLine) {
        break;
      }

      lineNestingLevel++;
    } else if (currentChar === '\n') {
      if (lineNestingLevel === 0 || lineNestingLevel === nestingLevel || (lineNestingLevel + 1) === nestingLevel) {
        lineNestingLevel = 0;
        if (isFirstNewLine) {
          isFirstNewLine = false;
        } else {
          endOfNewContent = index;
        }

        if (previousChar === '\n') {
          foundABlankLine = true;
        }
      } else {
        break;
      }
    }
    index++;

    previousChar = currentChar;
    // the first character being a new line character means we have two new line characters back to back
    if (firstChar && currentChar === '\n' && addingEmptyLinesAroundBlockquotes && preEndingChar === '\n') {
      endOfNewContent = index;
      break;
    }
    firstChar = false;
  }

  if (index === text.length || endOfNewContent === text.length - 1) {
    return text.substring(0, endOfContent);
  }

  const endingEmptyLines = text.substring(endOfContent, endOfNewContent);
  const endsInEmptyLine = endingEmptyLines === '\n' || endingEmptyLines.endsWith('\n\n');
  if (endsInEmptyLine) {
    return text.substring(0, endOfContent) + '\n' + text.substring(endOfNewContent);
  }

  const indexOfSecondNewLineAfterContent = text.indexOf('\n', endOfNewContent + 1);
  let nextLine = '';
  if (indexOfSecondNewLineAfterContent === -1) {
    nextLine = text.substring(endOfNewContent);
  } else {
    nextLine = text.substring(endOfNewContent + 1, indexOfSecondNewLineAfterContent);
  }

  let lastLineOfBlockquote: string;
  const indexOfEndOfLastLine = text.lastIndexOf('\n', endOfContent-1);
  if (indexOfEndOfLastLine === -1) {
    lastLineOfBlockquote = text.substring(0, endOfNewContent);
  } else {
    lastLineOfBlockquote = text.substring(indexOfEndOfLastLine+1, endOfContent);
  }

  let emptyLine: string;
  if (addingEmptyLinesAroundBlockquotes) {
    emptyLine = getEmptyLineForAfterBlockquote(nextLine, isCallout, nestingLevel);
  } else if (codeBlockBlockquoteRegex.test(nextLine) || codeBlockBlockquoteRegex.test(lastLineOfBlockquote)) {
    // for now we will assume that the current empty line is correct if we are dealing with a table on the current or next line
    // we can change this to the necessary implementation when this scenario is encountered
    emptyLine = text.substring(endOfContent, endOfNewContent).trimEnd();
  } else {
    emptyLine = getEmptyLine(nextLine);
  }


  return text.substring(0, endOfContent) + emptyLine + text.substring(endOfNewContent);
}

/**
 * Makes sure that the specified content has an empty line around it so long as it does not start or end a file.
 * @param {string} text - The entire file's contents
 * @param {number} start - The starting index of the content to escape
 * @param {number} end - The ending index of the content to escape
 * @param {boolean} addingEmptyLinesAroundBlockquotes - Whether or not the logic is meant to add empty lines around blockquotes. This is something meant to better help with spacing around blockquotes.
 * @return {string} The new file contents after the empty lines have been added
 */
export function makeSureContentHasEmptyLinesAddedBeforeAndAfter(text: string, start: number, end: number, addingEmptyLinesAroundBlockquotes: boolean = false): string {
  let [startOfLine, startOfLineIndex] = getStartOfLineWhitespaceOrBlockquoteLevel(text, start);
  if (startOfLine.trim() !== '') {
    const isCallout = calloutRegex.test(text.substring(start, end));
    const blockquoteLevel = countInstances(startOfLine, '>');

    // make sure we get the end of the last non-empty line to make sure blockquotes ending
    // in a blank blockquote are properly handled/removes
    const newEnd = getIndexOfEndOfLastNonEmptyLine(text, end, blockquoteLevel);
    const newText = makeSureContentHasASingleEmptyLineAfterItUnlessItEndsAFileForBlockquote(text, startOfLine, newEnd, isCallout, addingEmptyLinesAroundBlockquotes);

    // make sure we get the first non-empty line as the start of the blockquote if possible to avoid issues
    // where the blockquote starts with a blank line which causes things to not properly get recognized as an empty line to remove
    startOfLineIndex = getIndexOfStartOfFirstNonEmptyLine(newText, startOfLineIndex, blockquoteLevel);

    return makeSureContentHasASingleEmptyLineBeforeItUnlessItStartsAFileForBlockquote(newText, startOfLine, startOfLineIndex, isCallout, addingEmptyLinesAroundBlockquotes);
  }

  const newText = makeSureContentHasASingleEmptyLineAfterItUnlessItEndsAFile(text, end);

  return makeSureContentHasASingleEmptyLineBeforeItUnlessItStartsAFile(newText, startOfLineIndex);
}

// from https://stackoverflow.com/a/52171480/8353749
export function hashString53Bit(str: string, seed: number = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * Takes a string and converts string that have the string escaped form of escape characters such as new line,
 * form feed, carriage return, horizontal tab, and vertical tab and makes sure they are their escaped character values.
 * @param {string} val - The string to make sure has the escape characters as escape characters rather than a stringified form.
 * @return {string} The string with the escape characters converted to their escape character form.
 */
export function convertStringVersionOfEscapeCharactersToEscapeCharacters(val: string): string {
  // replace string version of form feed character with the actual form feed character
  val = val.replaceAll('\\f', '\f');
  // replace string version of new line character with the actual new line character
  val = val.replaceAll('\\n', '\n');
  // replace string version of carriage return character with the actual carriage return character
  val = val.replaceAll('\\r', '\r');
  // replace string version of horizontal tab character with the actual horizontal tab character
  val = val.replaceAll('\\t', '\t');
  // replace string version of vertical tab character with the actual vertical tab character
  val = val.replaceAll('\\v', '\v');
  // replace string version of escaped \ with the single instance of \
  val = val.replaceAll('\\\\', '\\');

  return val;
}

export function getStartOfLineIndex(text: string, indexToStartFrom: number): number {
  if (indexToStartFrom == 0) {
    return indexToStartFrom;
  }

  let startOfLineIndex = indexToStartFrom;
  while (startOfLineIndex > 0 && text.charAt(startOfLineIndex - 1) !== '\n') {
    startOfLineIndex--;
  }

  return startOfLineIndex;
}

/**
 * Replace the first instance of the matching search string in the text after the provided starting position.
 * @param {string} text - The text in which to do the find and replace given the starting position.
 * @param {string} search - The text to search for and replace in the provided string.
 * @param {string} replace - The text to replace the search text with in the provided string.
 * @param {number} start - The position to start the replace search at.
 * @return {string} The new string after replacing the value if found.
 */
export function replaceAt(text: string, search: string, replace: string, start: number): string {
  if (start > text.length - 1) {
    return text;
  }

  return text.slice(0, start) +
      text.slice(start, text.length).replace(search, replace);
}

// based on https://stackoverflow.com/a/21730166/8353749
export function countInstances(text: string, instancesOf: string): number {
  let counter = 0;

  for (let i = 0, input_length = text.length; i < input_length; i++) {
    const index_of_sub = text.indexOf(instancesOf, i);

    if (index_of_sub > -1) {
      counter++;
      i = index_of_sub;
    }
  }

  return counter;
}

// based on https://stackoverflow.com/a/175787/8353749
export function isNumeric(str: string) {
  const type = typeof str;
  if (type != 'string') return type === 'number'; // we only process strings so if the value is not already a number the result is false
  return !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export function getSubstringIndex(substring: string, text: string): number[] {
  const indexes = [];
  let i = -1;
  while ((i = text.indexOf(substring, i + 1)) >= 0) {
    indexes.push(i);
  }

  return indexes;
}

function getIndexOfStartOfFirstNonEmptyLine(text: string, currentStartOfBlockquote: number, blockquoteLevel: number): number {
  let actualStartOfBlockquote = currentStartOfBlockquote;
  let blockquoteIndex = currentStartOfBlockquote+1;
  let currentChar = '';
  let foundNewStart = false;
  let level = 0;
  while (blockquoteIndex < text.length) {
    currentChar = text.charAt(blockquoteIndex);
    if (currentChar.trim() !== '' && currentChar !== '>') {
      foundNewStart = true;
      break;
    } else if (currentChar === '\n') {
      if (level !== blockquoteLevel) {
        break;
      }

      level = 0;
      actualStartOfBlockquote = blockquoteIndex;
    } else if (currentChar === '>') {
      level++;
    }

    blockquoteIndex++;
  }

  if (foundNewStart) {
    return actualStartOfBlockquote;
  }

  return currentStartOfBlockquote;
}

function getIndexOfEndOfLastNonEmptyLine(text: string, currentEndOfBlockquote: number, blockquoteLevel: number): number {
  let actualEndOfBlockquote = currentEndOfBlockquote;
  let blockquoteIndex = currentEndOfBlockquote-1;
  let currentChar = '';
  let foundNewEnd = false;
  let level = 0;
  while (blockquoteIndex >= 0) {
    currentChar = text.charAt(blockquoteIndex);
    if (currentChar.trim() !== '' && currentChar !== '>') {
      foundNewEnd = true;
      break;
    } else if (currentChar === '\n') {
      if (level !== blockquoteLevel) {
        break;
      }

      level = 0;
      actualEndOfBlockquote = blockquoteIndex;
    } else if (currentChar === '>') {
      level++;
    }

    blockquoteIndex--;
  }

  if (foundNewEnd) {
    return actualEndOfBlockquote;
  }

  return currentEndOfBlockquote;
}

export function parseCustomReplacements(text: string): Map<string, string> {
  const tableInfo = getAllTablesInText(text);
  const customReplacements = new Map<string, string>();

  let tableContent = '';
  let tableRows = [] as string[];
  let rowParts = [] as string[];
  for (const table of tableInfo) {
    tableContent = text.substring(table.startIndex, table.endIndex);
    tableRows = tableContent.split('\n');
    tableRows.splice(0, 2); // skip header and divider rows

    for (const row of tableRows) {
      rowParts = row.split('|');

      if (rowParts.length !== 4) {
        logWarn(getTextInLanguage('options.custom-auto-correct.custom-row-parse-warning').replace('{ROW}', row));
        continue;
      }

      customReplacements.set(rowParts[1].trim().toLowerCase(), rowParts[2].trim());
    }
  }

  return customReplacements;
}

/**
 * Escapes the markdown special characters in the provided text.
 *
 * @param {string} text The text to escape the markdown special characters in.
 * @return {string} The text with the markdown special characters escaped.
 *
 * @example
 * ```ts
 * escapeMarkdownSpecialCharacters('Escape [_]'); // Escape \[\_\]
 * ```
 */
export function escapeMarkdownSpecialCharacters(text: string): string {
  return text.replace(/[\\[\]<>_*~=`$]/g, '\\$&');
}

/**
 * Unescapes the markdown special characters in the provided text.
 *
 * @param {string} text - The text to unescape the markdown special characters in.
 * @return {string} The text with the markdown special characters unescaped.
 *
 * @example
 * ```ts
 * unescapeMarkdownSpecialCharacters('Escape \\[\\_\\]'); // Escape [_]
 * ```
 */
export function unescapeMarkdownSpecialCharacters(text: string): string {
  return text.replace(/(\\+)([!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/g, (_, backslashes, specialChar) => {
    const backslashCount = backslashes.length;
    const keepCount = Math.floor(backslashCount / 2);
    return '\\'.repeat(keepCount) + specialChar;
  });
}
