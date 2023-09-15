import {load, dump} from 'js-yaml';
import {getTextInLanguage} from '../lang/helpers';
import {escapeDollarSigns, yamlRegex} from './regex';
import {isNumeric} from './strings';


export const OBSIDIAN_TAG_KEY_SINGULAR = 'tag';
export const OBSIDIAN_TAG_KEY_PLURAL = 'tags';
export const OBSIDIAN_TAG_KEYS = [OBSIDIAN_TAG_KEY_SINGULAR, OBSIDIAN_TAG_KEY_PLURAL];
export const OBSIDIAN_ALIAS_KEY_SINGULAR = 'alias';
export const OBSIDIAN_ALIAS_KEY_PLURAL = 'aliases';
export const OBSIDIAN_ALIASES_KEYS = [OBSIDIAN_ALIAS_KEY_SINGULAR, OBSIDIAN_ALIAS_KEY_PLURAL];
export const LINTER_ALIASES_HELPER_KEY = 'linter-yaml-title-alias';
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
  if (!text.match(yamlRegex)) {
    return text;
  }

  const oldYaml = text.match(yamlRegex)[0];
  const newYaml = func(oldYaml);
  text = text.replace(oldYaml, escapeDollarSigns(newYaml));

  return text;
}

function getYamlSectionRegExp(rawKey: string): RegExp {
  return new RegExp(`^([\\t ]*)${rawKey}:[ \\t]*(\\S.*|(?:(?:\\n *- \\S.*)|((?:\\n *- *))*|(\\n([ \\t]+[^\\n]*))*)*)\\n`, 'm');
}

export function setYamlSection(yaml: string, rawKey: string, rawValue: string): string {
  const yamlSectionEscaped = `${rawKey}:${rawValue}\n`;
  let isReplaced = false;
  let result = yaml.replace(getYamlSectionRegExp(rawKey), (_, $1: string) => {
    isReplaced = true;
    return $1 + yamlSectionEscaped;
  });
  if (!isReplaced) {
    result = `${yaml}${yamlSectionEscaped}`;
  }
  return result;
}

export function getYamlSectionValue(yaml: string, rawKey: string): string | null {
  const match = yaml.match(getYamlSectionRegExp(rawKey));
  const result = match == null ? null : match[2];
  return result;
}

export function removeYamlSection(yaml: string, rawKey: string): string {
  const result = yaml.replace(getYamlSectionRegExp(rawKey), '');
  return result;
}

export function loadYAML(yaml_text: string): any {
  if (yaml_text == null) {
    return null;
  }

  // replacing tabs at the beginning of new lines with 2 spaces fixes loading YAML that has tabs at the start of a line
  // https://github.com/platers/obsidian-linter/issues/157
  const parsed_yaml = load(yaml_text.replace(/\n(\t)+/g, '\n  ')) as {};
  if (parsed_yaml == null) {
    return {};
  }

  return parsed_yaml;
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
  /* eslint-enable no-fallthrough */
}

function getDefaultYAMLArrayValue(format: NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats): string {
  /* eslint-disable no-fallthrough */
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
  /* eslint-enable no-fallthrough */
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
 * @return {string|string[]} The original value if it was not a single or multi-line array or the an array of the values from the array (multi-line arrays will have empty values removed)
 */
export function splitValueIfSingleOrMultilineArray(value: string): string | string[] {
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

    const arrayItems = convertYAMLStringToArray(value, ',');

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

    if (arrayItems == null || arrayItems.length === 0 ) {
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
  let originalTagValues: string[] = [];
  if (Array.isArray(value)) {
    originalTagValues = value;
  } else if (value.includes(',')) {
    originalTagValues = convertYAMLStringToArray(value, ',');
  } else {
    originalTagValues = convertYAMLStringToArray(value, ' ');
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
    return convertYAMLStringToArray(value, ',');
  }

  return value;
}

export function convertYAMLStringToArray(value: string, delimiter: string = ','): string[] {
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
      const endOfEscapedValue = value.indexOf(currentChar, index+1);
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
    const unescaped = load(basicEscape) as string;
    if (unescaped === value) {
      return basicEscape;
    }
  } catch {
    // invalid YAML
  }

  const escapeWithDefaultCharacter = dump(value, {
    lineWidth: -1,
    quotingType: defaultEscapeCharacter,
    forceQuotes: forceEscape,
  }).slice(0, -1);

  const escapeWithOtherCharacter = dump(value, {
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
