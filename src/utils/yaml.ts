import { getTextInLanguage } from '../lang/helpers';
import type { Position } from 'unist';
import { escapeDollarSigns, multipleBlankLinesRegex, yamlRegex } from './regex';
import { isNumeric } from './strings';
import { parse, parseDocument, Document, stringify, CST, YAMLMap, isMap, visit, Scalar } from 'yaml';
import { YamlNode } from '../typings/yaml';

export const OBSIDIAN_TAG_KEY_SINGULAR = 'tag';
export const OBSIDIAN_TAG_KEY_PLURAL = 'tags';
export const OBSIDIAN_TAG_KEYS = [OBSIDIAN_TAG_KEY_SINGULAR, OBSIDIAN_TAG_KEY_PLURAL];
export const OBSIDIAN_ALIAS_KEY_SINGULAR = 'alias';
export const OBSIDIAN_ALIAS_KEY_PLURAL = 'aliases';
export const OBSIDIAN_ALIASES_KEYS = [OBSIDIAN_ALIAS_KEY_SINGULAR, OBSIDIAN_ALIAS_KEY_PLURAL];
export const DEFAULT_LINTER_ALIASES_HELPER_KEY = 'linter-yaml-title-alias';
export const DISABLED_RULES_KEY = 'disabled rules';

/**
 * Adds an empty YAML block to the text if it doesn't already have one.
 * @param {string} text - The text to process
 * @return {string} The processed text with a YAML block
 */
export function initYAML(text: string): string {
  if (text.match(yamlRegex) === null) {
    text = '---\n---\n' + text;
  }
  return text;
}

export function getYAMLText(text: string): string | null {
  const yaml = text.match(yamlRegex);
  if (!yaml) {
    return null;
  }

  return yaml[1];
}

export function formatYAML(text: string, func: (text: string) => string): string {
  const oldYamlMatch = text.match(yamlRegex);
  if (!oldYamlMatch) {
    return text;
  }

  const oldYaml = oldYamlMatch[0];
  const newYaml = func(oldYaml);
  text = text.replace(oldYaml, escapeDollarSigns(newYaml));

  return text;
}

type YamlSourceNode = {
  value?: unknown;
  range?: [number, number, number];
  srcToken?: {
    start?: number;
    end?: number;
  };
};

type YamlPair = {
  key?: YamlSourceNode;
  value?: YamlSourceNode;
};

function parseYamlForSectionLookup(yaml: string): Document {
  /*
   * CST offsets are relative to the exact string passed to parseDocument().
   * Do not normalize tabs or otherwise modify the string here.
   */
  return parseDocument(yaml, {
    keepSourceTokens: true,
  });
}

function getYamlNodeStart(node: unknown): number | null {
  if (!node || typeof node !== 'object') {
    return null;
  }

  const yamlNode = node as YamlSourceNode;

  if (yamlNode.range && typeof yamlNode.range[0] === 'number') {
    return yamlNode.range[0];
  }

  if (yamlNode.srcToken && typeof yamlNode.srcToken.start === 'number') {
    return yamlNode.srcToken.start;
  }

  return null;
}

function getYamlNodeEnd(node: unknown): number | null {
  if (!node || typeof node !== 'object') {
    return null;
  }

  const yamlNode = node as YamlSourceNode;

  /*
   * A YAML node range is [start, end, valueEnd].
   */
  if (yamlNode.range && typeof yamlNode.range[1] === 'number') {
    return yamlNode.range[1];
  }

  if (yamlNode.srcToken && typeof yamlNode.srcToken.end === 'number') {
    return yamlNode.srcToken.end;
  }

  return null;
}

function getComparableYamlKey(rawKey: unknown): string | null {
  if (typeof rawKey !== 'string') {
    return null;
  }

  const key = rawKey.trim();

  if (key.length >= 2 &&
    ((key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith('\'') && key.endsWith('\'')))
  ) {
    return key.substring(1, key.length - 1);
  }

  return key;
}

function findYamlPair(map: YAMLMap, rawKey: unknown, allowNestedKey: boolean): YamlPair | null {
  const comparableKey = getComparableYamlKey(rawKey);

  if (comparableKey == null) {
    return null;
  }

  for (const item of map.items) {
    const pair = item as YamlPair;

    const parsedKey =
      pair.key &&
        typeof pair.key.value === 'string'
        ? pair.key.value
        : null;

    if (parsedKey === comparableKey) {
      return pair;
    }

    if (allowNestedKey && pair.value && isMap(pair.value)) {
      const nestedPair = findYamlPair(pair.value, rawKey, true);

      if (nestedPair) {
        return nestedPair;
      }
    }
  }

  return null;
}

function getYamlPair(yaml: string, rawKey: unknown, allowNestedKey: boolean): YamlPair | null {
  if (typeof rawKey !== 'string') {
    return null;
  }

  const document = parseYamlForSectionLookup(yaml);

  if (!document.contents || !isMap(document.contents)) {
    return null;
  }

  return findYamlPair(document.contents, rawKey, allowNestedKey);
}

function getLineStart(text: string, offset: number,): number {
  const newline = text.lastIndexOf('\n', offset - 1);

  return newline === -1 ? 0 : newline + 1;
}

function getLineEnd(text: string, offset: number): number {
  const newline = text.indexOf('\n', offset);

  return newline === -1 ? text.length : newline;
}

/**
 * Finds the colon separating a YAML key from its value.
 *
 * The colon inside a quoted key is ignored:
 *
 *   "key:with:colons": value
 *   'key:with:colons': value
 */
function findKeyColon(line: string, keyStartInLine: number,): number {
  let quote: '"' | '\'' | null = null;

  for (let index = keyStartInLine; index < line.length; index++) {
    const character = line[index];

    if (quote !== null) {
      if (character === quote) {
        /*
         * YAML escapes double quotes with a backslash. Single-quoted YAML
         * strings escape a quote by doubling it.
         */
        if (quote === '"' && line[index - 1] !== '\\') {
          quote = null;
        } else if (quote === '\'' && line[index + 1] === '\'') {
          index++;
        } else if (quote === '\'') {
          quote = null;
        }
      }

      continue;
    }

    if (character === '"' || character === '\'') {
      quote = character;
      continue;
    }

    if (character === ':') {
      return index;
    }
  }

  return -1;
}

function getYamlKeySourceRange(yaml: string, pair: YamlPair): { start: number; end: number; colon: number } | null {
  const keyStart = getYamlNodeStart(pair.key);

  if (keyStart == null) {
    return null;
  }

  const lineStart = getLineStart(yaml, keyStart);
  const lineEnd = getLineEnd(yaml, keyStart);
  const line = yaml.substring(lineStart, lineEnd);
  const keyStartInLine = keyStart - lineStart;
  const colonInLine = findKeyColon(line, keyStartInLine);

  if (colonInLine === -1) {
    return null;
  }

  const colon = lineStart + colonInLine;

  return {
    start: keyStart,
    end: colon,
    colon,
  };
}

function getYamlValueRange(yaml: string, pair: YamlPair): { start: number; end: number } | null {
  const keyRange = getYamlKeySourceRange(yaml, pair);

  if (!keyRange) {
    return null;
  }

  /*
   * Start immediately after the colon, omitting spaces and tabs on the same
   * line. For a block value, the newline is intentionally preserved.
   */
  let valueStart = keyRange.colon + 1;
  const keyLineEnd = getLineEnd(yaml, keyRange.colon);

  while (valueStart < keyLineEnd && (yaml[valueStart] === ' ' || yaml[valueStart] === '\t')) {
    valueStart++;
  }

  const valueNodeStart = getYamlNodeStart(pair.value);
  const valueNodeEnd = getYamlNodeEnd(pair.value);

  /*
   * Empty values such as `key:` have no value node.
   */
  if (valueNodeStart == null || valueNodeEnd == null) {
    return {
      start: valueStart,
      end: keyLineEnd,
    };
  }

  let valueEnd = valueNodeEnd;

  /*
   * A CST node does not include an inline comment. Keep an inline comment
   * attached to the returned value and to the section being replaced.
   */
  const valueLineEnd = getLineEnd(yaml, valueNodeEnd);
  const textAfterValue = yaml.substring(valueNodeEnd, valueLineEnd);

  if (/^[ \t]*#/.test(textAfterValue)) {
    valueEnd = valueLineEnd;
  }

  /*
   * The start comes from the colon rather than the value node. This retains
   * the newline and indentation before the first item of a block sequence:
   *
   *   key:
   *     - first
   *     - second
   */
  return { start: valueStart, end: valueEnd };
}

function getYamlSectionRange(yaml: string, pair: YamlPair): { start: number; end: number } | null {
  const keyStart = getYamlNodeStart(pair.key);
  const valueRange = getYamlValueRange(yaml, pair);

  if (keyStart == null || valueRange == null) {
    return null;
  }

  const start = getLineStart(yaml, keyStart);
  let end = valueRange.end;

  /*
   * Match the previous regex behavior by consuming the newline terminating
   * the key's value.
   */
  if (yaml[end] === '\n') {
    end++;
  }

  return { start, end };
}

export function getYamlSectionValue(yaml: string, rawKey: string, allowNestedKey: boolean = true): string | null {
  const pair = getYamlPair(yaml, rawKey, allowNestedKey);

  if (!pair) {
    return null;
  }

  const valueRange = getYamlValueRange(yaml, pair);

  if (!valueRange) {
    return null;
  }

  return yaml.substring(valueRange.start, valueRange.end);
}

export function setYamlSection(yaml: string, rawKey: string, rawValue: string): string {
  const pair = getYamlPair(yaml, rawKey, true);

  if (!pair) {
    return `${yaml}${rawKey}:${rawValue}\n`;
  }

  const sectionRange = getYamlSectionRange(yaml, pair);
  const keyRange = getYamlKeySourceRange(yaml, pair);

  if (!sectionRange || !keyRange) {
    return yaml;
  }

  const lineStart = getLineStart(yaml, keyRange.start);
  const indentation = yaml.substring(lineStart, keyRange.start);

  /*
   * Use the original key source, not rawKey. This preserves:
   *
   *   "key1":
   *   'key2':
   */
  const originalKey = yaml.substring(keyRange.start, keyRange.end).trimEnd();

  const replacement = `${indentation}${originalKey}:${rawValue}\n`;

  return yaml.substring(0, sectionRange.start) + replacement + yaml.substring(sectionRange.end);
}

export function removeYamlSection(yaml: string, rawKey: string, allowNestedKey: boolean = true): string {
  const pair = getYamlPair(yaml, rawKey, allowNestedKey);

  if (!pair) {
    return yaml;
  }

  const sectionRange = getYamlSectionRange(yaml, pair);

  if (!sectionRange) {
    return yaml;
  }

  return yaml.substring(0, sectionRange.start) + yaml.substring(sectionRange.end);
}

/**
 * getBlockScalarPositions returns the postions of the actual block scalars in the YAML
 * @param yaml the YAML text without the indicators
 * @returns Positions that only have their offsets set in the actual position info
 */
function getBlockScalarPositions(yamlText: string): Position[] {
  const doc = parseDocument(yamlText, {
    keepSourceTokens: true,
  });

  const blockScalarPositions: Position[] = [];

  visit(doc, (_key, node) => {
    if (!(node instanceof Scalar)) {
      return;
    }

    if (node.type !== 'BLOCK_LITERAL' && node.type !== 'BLOCK_FOLDED') {
      return;
    }

    if (node.range == null || node.range.length < 3) {
      return;
    }

    blockScalarPositions.push({
      start: {
        line: 0,
        column: 0,
        offset: node.range[0],
      },
      end: {
        line: 0,
        column: 0,
        offset: node.range[2],
      },
    });
  });

  return blockScalarPositions;
}

function overlaps(start: number, end: number, position: Position): boolean {
  const positionStart = position.start.offset ?? 0;
  const positionEnd = position.end.offset ?? 0;

  return start < positionEnd && end > positionStart;
}

export function removeBlankLinesOutsideBlockScalars(text: string): string {
  const blockScalarPositions = getBlockScalarPositions(text);

  // The match includes:
  //   - the newline before the blank line
  //   - spaces/tabs on the blank line
  //
  // The following newline is retained.
  return text.replace(multipleBlankLinesRegex, (match, offset: number) => {
    const start = offset;
    const end = offset + match.length;

    const isInsideBlockScalar = blockScalarPositions.some((position) => {
      return overlaps(start, end, position);
    });

    return isInsideBlockScalar ? match : '\n';
  });
}

export function loadYAML(yaml_text: string): null | object {
  if (yaml_text == null) {
    return null;
  }

  // replacing tabs at the beginning of new lines with 2 spaces fixes loading YAML that has tabs at the start of a line
  // https://github.com/platers/obsidian-linter/issues/157
  const parsed_yaml = parse(yaml_text.replace(/\n(\t)+/g, '\n  ')) as unknown;
  if (parsed_yaml == null) {
    return {};
  }

  return parsed_yaml;
}

export function parseYAML(yaml_text: string): null | Document {
  if (yaml_text == null) {
    return null;
  }

  // replacing tabs at the beginning of new lines with 2 spaces fixes loading YAML that has tabs at the start of a line
  // https://github.com/platers/obsidian-linter/issues/157
  const parsed_yaml = parseDocument(yaml_text.replace(/\n(\t)+/g, '\n  '), { keepSourceTokens: true });
  if (parsed_yaml == null) {
    return null;
  }

  return parsed_yaml;
}

export function getEmptyDocument(doc: Document): Document {
  const newDocument = new Document(doc.options);
  newDocument.contents = new YAMLMap();

  const originalToken = doc.contents?.srcToken as CST.FlowCollection;
  newDocument.contents.srcToken = {
    offset: originalToken.offset,
    type: originalToken.type,
    indent: originalToken.indent,
    start: originalToken.start,
    end: originalToken.end,
    items: [] as CST.CollectionItem[],
  };

  return newDocument;
}

export function astToString(ast: Document): string {
  if (!ast || !ast.contents || !ast.contents.srcToken) {
    return '';
  }

  const items = (ast.contents as YamlNode).items as YamlNode[];
  if (!items || items.length == 0) {
    return '';
  }

  return CST.stringify(ast.contents.srcToken);
}

export enum TagSpecificArrayFormats {
  SingleStringSpaceDelimited = 'single string space delimited',
  SingleLineSpaceDelimited = 'single-line space delimited',
}

export enum SpecialArrayFormats {
  SingleStringToSingleLine = 'single string to single-line',
  SingleStringToMultiLine = 'single string to multi-line',
  SingleStringCommaDelimited = 'single string comma delimited',
}

export enum NormalArrayFormats {
  SingleLine = 'single-line',
  MultiLine = 'multi-line',
}

export type QuoteCharacter = '\'' | '"';

/**
 * Formats the YAML array value passed in with the specified format.
 * @param {string | string[]} value The value(s) that will be used as the parts of the array that is assumed to already be broken down into the appropriate format to be put in the array.
 * @param {NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats} format The format that the array should be converted into.
 * @param {string} defaultEscapeCharacter The character escape to use around the value if a specific escape character is not needed.
 * @param {boolean} removeEscapeCharactersIfPossibleWhenGoingToMultiLine Whether or not to remove no longer needed escape values when converting to a multi-line format.
 * @param {boolean} escapeNumericValues Whether or not to escape any numeric values found in the array.
 * @return {string} The formatted array in the specified YAML/obsidian YAML format.
 */
export function formatYamlArrayValue(value: string | string[], format: NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats, defaultEscapeCharacter: QuoteCharacter, removeEscapeCharactersIfPossibleWhenGoingToMultiLine: boolean, escapeNumericValues: boolean = false): string {
  if (typeof value === 'string') {
    value = [value];
  }

  // handle default values here
  if (value == null || value.length === 0) {
    return getDefaultYAMLArrayValue(format);
  }

  // handle escaping numeric values and the removal of escape characters where applicable for multiline arrays
  const shouldRemoveEscapeCharactersIfPossible = removeEscapeCharactersIfPossibleWhenGoingToMultiLine && (format == NormalArrayFormats.MultiLine || (format == SpecialArrayFormats.SingleStringToMultiLine && value.length > 1));
  if (escapeNumericValues || shouldRemoveEscapeCharactersIfPossible) {
    for (let i = 0; i < value.length; i++) {
      let currentValue = value[i];
      const valueIsEscaped = isValueEscapedAlready(currentValue);
      if (valueIsEscaped) {
        currentValue = currentValue.substring(1, currentValue.length - 1);
      }

      const shouldRequireEscapeOfCurrentValue = escapeNumericValues && isNumeric(currentValue);
      if (valueIsEscaped && shouldRequireEscapeOfCurrentValue) {
        continue; // when dealing with numbers that we need escaped, we don't want to remove that escaping for multiline arrays
      } else if (shouldRequireEscapeOfCurrentValue || (valueIsEscaped && shouldRemoveEscapeCharactersIfPossible)) {
        value[i] = escapeStringIfNecessaryAndPossible(currentValue, defaultEscapeCharacter, shouldRequireEscapeOfCurrentValue);
      }
    }
  }

  // handle the values that are present based on the format of the array
  /* eslint-disable no-fallthrough -- we are falling through here because it makes the most sense for the cases below */
  switch (format) {
    case SpecialArrayFormats.SingleStringToSingleLine:
      if (value.length === 1) {
        return ' ' + value[0];
      }
    case NormalArrayFormats.SingleLine:
      // make sure that any values with a comma get properly escaped first
      for (let i = 0; i < value.length; i++) {
        if (value[i].includes(',') && !isValueEscapedAlready(value[i])) {
          value[i] = escapeStringIfNecessaryAndPossible(value[i], defaultEscapeCharacter, true);
        }
      }

      return ' ' + convertStringArrayToSingleLineArray(value);
    case SpecialArrayFormats.SingleStringToMultiLine:
      if (value.length === 1) {
        return ' ' + value[0];
      }
    case NormalArrayFormats.MultiLine:
      return convertStringArrayToMultilineArray(value);
    case TagSpecificArrayFormats.SingleStringSpaceDelimited:
      if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + value.join(' ');
    case SpecialArrayFormats.SingleStringCommaDelimited:
      // make sure that any values with a comma get properly escaped first
      for (let i = 0; i < value.length; i++) {
        if (value[i].includes(',') && !isValueEscapedAlready(value[i])) {
          value[i] = escapeStringIfNecessaryAndPossible(value[i], defaultEscapeCharacter, true);
        }
      }

      if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + value.join(', ');
    case TagSpecificArrayFormats.SingleLineSpaceDelimited:
      if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + convertStringArrayToSingleLineArray(value).replaceAll(', ', ' ');
  }
  /* eslint-enable no-fallthrough -- needed to renable fallthrough checks disabled above */
}

function getDefaultYAMLArrayValue(format: NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats): string {

  switch (format) {
    case NormalArrayFormats.SingleLine:
    case TagSpecificArrayFormats.SingleLineSpaceDelimited:
    case NormalArrayFormats.MultiLine:
      return ' []';
    case SpecialArrayFormats.SingleStringToSingleLine:
    case SpecialArrayFormats.SingleStringToMultiLine:
    case TagSpecificArrayFormats.SingleStringSpaceDelimited:
    case SpecialArrayFormats.SingleStringCommaDelimited:
      return ' ';
  }

}

function convertStringArrayToSingleLineArray(arrayItems: string[]): string {
  if (arrayItems == null || arrayItems.length === 0) {
    return '[]';
  }

  return '[' + arrayItems.join(', ') + ']';
}

function convertStringArrayToMultilineArray(arrayItems: string[]): string {
  if (arrayItems == null || arrayItems.length === 0) {
    return '[]';
  }

  return '\n  - ' + arrayItems.join('\n  - ');
}

/**
 * Parses single-line and multi-line arrays into an array that can be used for formatting down the line
 * @param {string} value The value to see about parsing if it is a sing-line or multi-line array
 * @return {null|string|string[]} The original value if it was not a single or multi-line array or the an array of the values from the array (multi-line arrays will have empty values removed)
 */
export function splitValueIfSingleOrMultilineArray(value: string): null | string | string[] {
  if (value == null || value.length === 0) {
    return null;
  }

  value = value.trimEnd();
  if (value.startsWith('[')) {
    value = value.substring(1);

    if (value.endsWith(']')) {
      value = value.substring(0, value.length - 1);
    }

    // accounts for an empty single line array which can then be converted as needed later on
    if (value.length === 0) {
      return null;
    }

    const arrayItems = convertYAMLStringToArray(value, ',') ?? [];

    return arrayItems.filter((el: string) => {
      return el != '';
    });
  }

  if (value.includes('\n')) {
    let arrayItems = value.split(/[ \t]*\n[ \t]*-[ \t]*/);
    arrayItems.splice(0, 1);

    arrayItems = arrayItems.filter((el: string) => {
      return el != '';
    });

    if (arrayItems == null || arrayItems.length === 0) {
      return null;
    }

    return arrayItems;
  }

  return value;
}

/**
 * Converts the tag string to the proper split up values based on whether or not it is already an array and if it has delimiters.
 * @param {string | string[]} value The value that is already good to go or needs to be split on a comma or spaces.
 * @return {string} The converted tag key value that should account for its obsidian formats.
 */
export function convertTagValueToStringOrStringArray(value: string | string[]): string[] {
  if (value == null) {
    return [];
  }

  const tags: string[] = [];
  let originalTagValues: string[];
  if (Array.isArray(value)) {
    originalTagValues = value;
  } else if (value.includes(',')) {
    originalTagValues = convertYAMLStringToArray(value, ',') ?? [];
  } else {
    originalTagValues = convertYAMLStringToArray(value, ' ') ?? [];
  }

  for (const tagValue of originalTagValues) {
    tags.push(tagValue.trim());
  }

  return tags;
}

/**
 * Converts the alias over to the appropriate array items for formatting taking into account obsidian formats.
 * @param {string | string[]} value The value of the aliases key that may need to be split into the appropriate parts.
 * @return {string} The alias value converted to the appropriate array items for formatting.
 */
export function convertAliasValueToStringOrStringArray(value: string | string[]): string[] {
  if (typeof value === 'string') {
    return convertYAMLStringToArray(value, ',') ?? [];
  }

  return value;
}

export function convertYAMLStringToArray(value: string, delimiter: string = ','): null | string[] {
  if (value == '' || value == null) {
    return null;
  }

  if (delimiter.length > 1) {
    throw new Error(getTextInLanguage('logs.invalid-delimiter-error-message'));
  }

  const arrayItems: string[] = [];
  let currentItem = '';
  let index = 0;
  while (index < value.length) {
    const currentChar = value.charAt(index);

    if (currentChar === delimiter) {
      // case where you find a delimiter
      arrayItems.push(currentItem.trim());
      currentItem = '';
    } else if (currentChar === '"' || currentChar === '\'') {
      // if there is an escape character check to see if there is a closing escape character and if so, skip to it as the next part of the value
      const endOfEscapedValue = value.indexOf(currentChar, index + 1);
      if (endOfEscapedValue != -1) {
        currentItem += value.substring(index, endOfEscapedValue + 1);
        index = endOfEscapedValue;
      } else {
        currentItem += currentChar;
      }
    } else {
      currentItem += currentChar;
    }

    index++;
  }

  if (currentItem.trim() != '') {
    arrayItems.push(currentItem.trim());
  }

  return arrayItems;
}

/**
 * Returns whether or not the YAML string value is already escaped
 * @param {string} value The YAML string to check if it is already escaped
 * @return {boolean} Whether or not the YAML string value is already escaped
 */
export function isValueEscapedAlready(value: string): boolean {
  return value.length > 1 && ((value.startsWith('\'') && value.endsWith('\'')) ||
    (value.startsWith('"') && value.endsWith('"')));
}

/**
 * Escapes the provided string value if it has a colon with a space after it, a single quote, or a double quote, but not a single and double quote.
 * @param {string} value The value to escape if possible
 * @param {string} defaultEscapeCharacter The character escape to use around the value if a specific escape character is not needed.
 * @param {boolean} forceEscape Whether or not to force the escaping of the value provided.
 * @param {boolean} skipValidation Whether or not to ensure that the result string could be unescaped back to the value.
 * @return {string} The escaped value if it is either necessary or forced and the provided value if it cannot be escaped, is escaped,
 * or does not need escaping and the force escape is not used.
 */
export function escapeStringIfNecessaryAndPossible(value: string, defaultEscapeCharacter: QuoteCharacter, forceEscape: boolean = false, skipValidation: boolean = false): string {
  const basicEscape = basicEscapeString(value, defaultEscapeCharacter, forceEscape);
  if (skipValidation) {
    return basicEscape;
  }

  try {
    const unescaped = parse(basicEscape, { logLevel: 'error' }) as string;
    if (unescaped === value) {
      return basicEscape;
    }
  } catch {
    // invalid YAML
  }

  const escapeWithDefaultCharacter = stringify(value, {
    lineWidth: -1,
    quotingType: defaultEscapeCharacter,
    forceQuotes: forceEscape,
  }).slice(0, -1);

  const escapeWithOtherCharacter = stringify(value, {
    lineWidth: -1,
    quotingType: defaultEscapeCharacter == '"' ? '\'' : '"',
    forceQuotes: forceEscape,
  }).slice(0, -1);

  if (escapeWithOtherCharacter === value || escapeWithOtherCharacter.length < escapeWithDefaultCharacter.length) {
    return escapeWithOtherCharacter;
  }

  return escapeWithDefaultCharacter;
}

function basicEscapeString(value: string, defaultEscapeCharacter: QuoteCharacter, forceEscape: boolean = false): string {
  if (isValueEscapedAlready(value)) {
    return value;
  }

  // if there is no single quote, double quote, or colon to escape, skip this substring
  const substringHasSingleQuote = value.includes('\'');
  const substringHasDoubleQuote = value.includes('"');
  const substringHasColonWithSpaceAfterIt = value.includes(': ');
  if (!substringHasSingleQuote && !substringHasDoubleQuote && !substringHasColonWithSpaceAfterIt && !forceEscape) {
    return value;
  }

  // if the substring already has a single quote and a double quote, there is nothing that can be done to escape the substring
  if (substringHasSingleQuote && substringHasDoubleQuote) {
    return value;
  }

  if (substringHasSingleQuote) {
    return `"${value}"`;
  } else if (substringHasDoubleQuote) {
    return `'${value}'`;
  }

  // the line must have a colon with a space
  return `${defaultEscapeCharacter}${value}${defaultEscapeCharacter}`;
}

export function getExactDisabledRuleValue(yaml_text: string): string[] {
  const disabledRulesValue = getYamlSectionValue(yaml_text, DISABLED_RULES_KEY);
  if (disabledRulesValue == null) {
    return [];
  }

  let disabledRulesKeyAndValue = disabledRulesValue.includes('\n') ? `${DISABLED_RULES_KEY}:\n` : `${DISABLED_RULES_KEY}: `;
  disabledRulesKeyAndValue += disabledRulesValue;

  const parsed_yaml = loadYAML(disabledRulesKeyAndValue);
  let disabled_rules = (parsed_yaml as { 'disabled rules': string[] | string })[
    'disabled rules'
  ];
  if (!disabled_rules) {
    return [];
  }

  if (typeof disabled_rules === 'string') {
    disabled_rules = [disabled_rules];
  }

  return disabled_rules;
}
