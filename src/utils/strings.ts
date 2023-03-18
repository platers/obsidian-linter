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

/**
 * Checks whether the expected text and actual text are the same allowing for requiring an exact match versus a close match on whitespace
 * @param {string} expectedText - The expected text
 * @param {string} actualText - The actual text
 * @param {boolean} requireSameTrailingWhitespace - Whether or not to do an exact comparison or allow whitespace to differ
 * @return {boolean} Whether or not the text matched the expected value
 */
function textMatches(expectedText: string, actualText: string, requireSameTrailingWhitespace: boolean = false): boolean {
  if (requireSameTrailingWhitespace) {
    return expectedText == actualText;
  }

  return actualText.match(new RegExp('^' + escapeRegExp(expectedText) + '( |\\t)*$', 'm')) != null;
}

/**
 * Makes sure that the specified content has an empty line around it so long as it does not start or end a file.
 * @param {string} text - The entire file's contents
 * @param {number} start - The starting index of the content to escape
 * @param {number} end - The ending index of the content to escape
 * @param {boolean} isForBlockquotes - Whether or not to apply logic to allow a blank line or one less nesting of blockquotes to be the empty line
 * @return {string} The new file contents after the empty lines have been added
 */
export function makeSureContentHasEmptyLinesAddedBeforeAndAfter(text: string, start: number, end: number, isForBlockquotes: boolean = false): string {
  const content = text.substring(start, end);
  let startOfLine = '';
  let contentPriorToContent = text.substring(0, start);
  if (contentPriorToContent.length > 0) {
    const contentLinesPriorToContent = contentPriorToContent.split('\n');
    startOfLine = contentLinesPriorToContent[contentLinesPriorToContent.length - 1] ?? '';
    startOfLine = startOfLine.trimEnd();


    let numberOfIndexesToRemove = 0;
    while (contentLinesPriorToContent.length - (2 + numberOfIndexesToRemove) >= 0) {
      const lineContent = contentLinesPriorToContent[contentLinesPriorToContent.length - (2 + numberOfIndexesToRemove)];
      if (!textMatches(startOfLine, lineContent) && (!isForBlockquotes || !textMatches('', lineContent, true))) {
        break;
      }

      numberOfIndexesToRemove++;
    }

    contentLinesPriorToContent.splice(contentLinesPriorToContent.length - (1 + numberOfIndexesToRemove), numberOfIndexesToRemove);

    if (contentLinesPriorToContent.length > 1) {
      if ((isForBlockquotes && contentLinesPriorToContent[contentLinesPriorToContent.length - 2].match(/^> ?.*$/m)) ||
      (!isForBlockquotes && !textMatches(startOfLine, contentLinesPriorToContent[contentLinesPriorToContent.length - 2]))) {
        contentLinesPriorToContent.splice(contentLinesPriorToContent.length - 1, 0, startOfLine);
      } else if (!textMatches('', contentLinesPriorToContent[contentLinesPriorToContent.length - 2], true)) {
        contentLinesPriorToContent.splice(contentLinesPriorToContent.length - 1, 0, '');
      }
    }

    contentPriorToContent = contentLinesPriorToContent.join('\n');
  }

  let contentAfterContent = text.substring(end);
  if (contentAfterContent.length > 0) {
    const contentLinesAfterBlock = contentAfterContent.split('\n');
    let numberOfIndexesToRemove = 0;
    while (numberOfIndexesToRemove + 1 < contentLinesAfterBlock.length) {
      const lineContent = contentLinesAfterBlock[1+numberOfIndexesToRemove];
      if (!textMatches(startOfLine, lineContent) && (!isForBlockquotes || !textMatches('', lineContent, true))) {
        break;
      }

      numberOfIndexesToRemove++;
    }

    contentLinesAfterBlock.splice(1, numberOfIndexesToRemove);

    if (contentLinesAfterBlock.length > 1) {
      if ((isForBlockquotes && contentLinesAfterBlock[1].match(/^> ?.*$/m)) ||
      (!isForBlockquotes && !textMatches(startOfLine, contentLinesAfterBlock[1]))) {
        contentLinesAfterBlock.splice(1, 0, startOfLine);
      } else if (isForBlockquotes && !textMatches('', contentLinesAfterBlock[1])) {
        contentLinesAfterBlock.splice(1, 0, '');
      }
    }

    contentAfterContent = contentLinesAfterBlock.join('\n');
  }

  return contentPriorToContent + content + contentAfterContent;
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
