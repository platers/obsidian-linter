import {escapeRegExp} from './regex';

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

function getStartOfLineWhitespaceOrBlockquoteLevel(text: string, startPosition: number): [string, number] {
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

function getEmptyLine(startOfLine: string, priorLine: string = ''): string {
  const [priorLineStart] = getStartOfLineWhitespaceOrBlockquoteLevel(priorLine, priorLine.length);

  return '\n' + priorLineStart.trim();
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

function makeSureContentHasASingleEmptyLineBeforeItUnlessItStartsAFileForBlockquote(text: string, startOfLine: string, startOfContent: number): string {
  if (startOfContent === 0) {
    return text;
  }

  const nestingLevel = startOfLine.split('>').length - 1;
  let index = startOfContent;
  let startOfNewContent = startOfContent;
  let lineNestingLevel = 0;
  while (index >= 0) {
    const currentChar = text.charAt(index);
    if (currentChar.trim() !== '' && currentChar !== '>') {
      break; // if non-whitespace, non-gt-bracket is encountered, then the line has content
    } else if (currentChar === '>') {
      lineNestingLevel++;
    } else if (currentChar === '\n') {
      if (lineNestingLevel === 0 || lineNestingLevel === nestingLevel || (lineNestingLevel + 1) === nestingLevel) {
        startOfNewContent = index;
        lineNestingLevel = 0;
      } else {
        break;
      }
    }
    index--;
  }

  if (index < 0 || startOfNewContent === 0) {
    return text.substring(startOfContent + 1);
  }

  const indexOfLastNewLine = text.lastIndexOf('\n', startOfNewContent - 1);
  let priorLine = '';
  if (indexOfLastNewLine === -1) {
    priorLine = text.substring(0, startOfNewContent);
  } else {
    priorLine = text.substring(indexOfLastNewLine, startOfNewContent);
  }

  return text.substring(0, startOfNewContent) + getEmptyLine(startOfLine, priorLine) + text.substring(startOfContent);
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

function makeSureContentHasASingleEmptyLineAfterItUnlessItEndsAFileForBlockquote(text: string, startOfLine: string, endOfContent: number): string {
  if (endOfContent === (text.length - 1)) {
    return text;
  }

  const nestingLevel = startOfLine.split('>').length - 1;
  let index = endOfContent;
  let endOfNewContent = endOfContent;
  let isFirstNewLine = true;
  let lineNestingLevel = 0;
  while (index < text.length) {
    const currentChar = text.charAt(index);
    if (currentChar.trim() !== '' && currentChar !== '>') {
      break; // if non-whitespace is encountered, then the line has content
    } else if (currentChar === '>') {
      lineNestingLevel++;
    } else if (currentChar === '\n') {
      if (lineNestingLevel === 0 || lineNestingLevel === nestingLevel || (lineNestingLevel + 1) === nestingLevel) {
        lineNestingLevel = 0;
        if (isFirstNewLine) {
          isFirstNewLine = false;
        } else {
          endOfNewContent = index;
        }
      } else {
        break;
      }
    }
    index++;
  }

  if (index === text.length || endOfNewContent === text.length - 1) {
    return text.substring(0, endOfContent);
  }

  const indexOfSecondNewLineAfterContent = text.indexOf('\n', endOfNewContent + 1);
  let nextLine = '';
  if (indexOfSecondNewLineAfterContent === -1) {
    nextLine = text.substring(endOfNewContent);
  } else {
    nextLine = text.substring(endOfNewContent + 1, indexOfSecondNewLineAfterContent);
  }

  return text.substring(0, endOfContent) + getEmptyLine(startOfLine, nextLine) + text.substring(endOfNewContent);
}

/**
 * Makes sure that the specified content has an empty line around it so long as it does not start or end a file.
 * @param {string} text - The entire file's contents
 * @param {number} start - The starting index of the content to escape
 * @param {number} end - The ending index of the content to escape
 * @return {string} The new file contents after the empty lines have been added
 */
export function makeSureContentHasEmptyLinesAddedBeforeAndAfter(text: string, start: number, end: number): string {
  const [startOfLine, startOfLineIndex] = getStartOfLineWhitespaceOrBlockquoteLevel(text, start);
  if (startOfLine.trim() !== '') {
    const newText = makeSureContentHasASingleEmptyLineAfterItUnlessItEndsAFileForBlockquote(text, startOfLine, end);

    return makeSureContentHasASingleEmptyLineBeforeItUnlessItStartsAFileForBlockquote(newText, startOfLine, startOfLineIndex);
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
 * Takes a string and converts string that have the string escaped form of escape characters such as new line, backspace,
 * form feed, carriage return, horizontal tab, and vertical tab and makes sure they are their escaped character values.
 * @param {string} val - The string to make sure has the escape characters as escape characters rather than a stringified form.
 * @return {string} The string with the escape characters converted to their escape character form.
 */
export function convertStringVersionOfEscapeCharactersToEscapeCharacters(val: string): string {
  // replace string version of backspace character with the actual backspace character
  val = val.replaceAll('\\b', '\b');
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

  return val;
}

export function getStartOfLineIndex(text: string, indexToStartFrom: number): number {
  if (indexToStartFrom < 2) {
    return indexToStartFrom;
  }

  let startOfLineIndex = indexToStartFrom;
  while (startOfLineIndex > 0 && text.charAt(startOfLineIndex - 1) !== '\n') {
    startOfLineIndex--;
  }

  return startOfLineIndex;
}
