import {load} from 'js-yaml';
import {escapeDollarSigns, yamlRegex} from './regex';


export const OBSIDIAN_TAG_KEY_SINGULAR = 'tag';
export const OBSIDIAN_TAG_KEY_PLURAL = 'tags';
export const OBSIDIAN_TAG_KEYS = [OBSIDIAN_TAG_KEY_SINGULAR, OBSIDIAN_TAG_KEY_PLURAL];
export const OBSIDIAN_ALIAS_KEY_SINGULAR = 'alias';
export const OBSIDIAN_ALIAS_KEY_PLURAL = 'aliases';
export const OBSIDIAN_ALIASES_KEYS = [OBSIDIAN_ALIAS_KEY_SINGULAR, OBSIDIAN_ALIAS_KEY_PLURAL];
export const LINTER_ALIASES_HELPER_KEY = 'linter-yaml-title-alias';

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

  // replacing tabs at the beginning of new lines with 2 spaces fixes loading yaml that has tabs at the start of a line
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

/**
 * Formats the yaml array value passed in with the specified format.
 * @param {string | string[]} value The value(s) that will be used as the parts of the array that is assumed to already be broken down into the appropriate format to be put in the array.
 * @param {NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats} format The format that the array should be converted into.
 * @return {string} The formatted array in the specified yaml/obsidian yaml format.
 */
export function formatYamlArrayValue(value: string | string[], format: NormalArrayFormats | SpecialArrayFormats | TagSpecificArrayFormats): string {
  if (typeof value === 'string') {
    value = [value];
  }

  switch (format) {
    case NormalArrayFormats.SingleLine:
      if (value == null || value.length === 0) {
        return ' []';
      }

      return ' ' + convertStringArrayToSingleLineArray(value);
    case NormalArrayFormats.MultiLine:
      if (value == null || value.length === 0) {
        return '\n  - ';
      }
      return '\n  - ' + value.join('\n  - ');
    case SpecialArrayFormats.SingleStringToSingleLine:
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + convertStringArrayToSingleLineArray(value);
    case SpecialArrayFormats.SingleStringToMultiLine:
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return '\n  - ' + value.join('\n  - ');
    case TagSpecificArrayFormats.SingleStringSpaceDelimited:
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' +value.join(' ');
    case SpecialArrayFormats.SingleStringCommaDelimited:
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + value.join(', ');
    case TagSpecificArrayFormats.SingleLineSpaceDelimited:
      if (value == null || value.length === 0) {
        return ' []';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + convertStringArrayToSingleLineArray(value).replaceAll(', ', ' ');
  }
}

function convertStringArrayToSingleLineArray(arrayItems: string[]): string {
  if (arrayItems == null || arrayItems.length === 0) {
    return '[]';
  }

  return '[' + arrayItems.join(', ') + ']';
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

    const arrayItems = value.split(',').map((val: string) => val.trim());

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
    originalTagValues = value.split(', ');
  } else {
    originalTagValues = value.split(' ');
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
    return value.split(', ');
  }

  return value;
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
 * @return {string} The escaped value if it is either necessary or forced and the provided value if it cannot be escaped, is escaped,
 * or does not need escaping and the force escape is not used.
 */
export function escapeStringIfNecessaryAndPossible(value: string, defaultEscapeCharacter: string, forceEscape: boolean = false): string {
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
