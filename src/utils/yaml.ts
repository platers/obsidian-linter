import {load, dump} from 'js-yaml';
import {escapeDollarSigns, yamlRegex} from './regex';

/**
 * Adds an empty YAML block to the text if it doesn't already have one.
 * @param {string} text - The text to process
 * @return {string} The processed text with an YAML block
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

export function toYamlString(obj: any): string {
  return dump(obj, {lineWidth: -1}).slice(0, -1);
}

export function toSingleLineArrayYamlString<T>(arr: T[]): string {
  return dump(arr, {flowLevel: 0}).slice(0, -1);
}

function getYamlSectionRegExp(rawKey: string): RegExp {
  return new RegExp(`(?<=^|\\n)${rawKey}:[ \\t]*(\\S.*|(?:(?:\\n *- \\S.*)|((?:\\n *- *))*)*)\\n`);
}

export function setYamlSection(yaml: string, rawKey: string, rawValue: string): string {
  const yamlSectionEscaped = `${rawKey}:${rawValue}\n`;
  let isReplaced = false;
  let result = yaml.replace(getYamlSectionRegExp(rawKey), () => {
    isReplaced = true;
    return yamlSectionEscaped;
  });
  if (!isReplaced) {
    result = `${yaml}${yamlSectionEscaped}`;
  }
  return result;
}

export function getYamlSectionValue(yaml: string, rawKey: string): string | null {
  const match = yaml.match(getYamlSectionRegExp(rawKey));
  const result = match == null ? null : match[1];
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

export type TagSpecificYamlArrayFormats = 'single string space delimited' | 'single-line space delimited';

export type SpecialYamlArrayFormats = 'single string to single-line' | 'single string to multi-line' | 'single string comma delimited';

export type NormalYamlArrayFormats = 'single-line' | 'multi-line';

/**
 * Formats the yaml array value passed in with the specified format.
 * @param {string | string[]} value The value(s) that will be used as the parts of the array that is assumed to already be broken down into the appropriate format to be put in the array.
 * @param {NormalYamlArrayFormats | SpecialYamlArrayFormats | TagSpecificYamlArrayFormats} format The format that the array should be converted into.
 * @return {string} The formatted array in the specified yaml/obsidian yaml format.
 */
export function formatYamlArrayValue(value: string | string[], format: NormalYamlArrayFormats | SpecialYamlArrayFormats | TagSpecificYamlArrayFormats): string {
  if (typeof value === 'string') {
    value = [value];
  }

  switch (format) {
    case 'single-line':
      if (value == null || value.length === 0) {
        return ' []';
      }

      return ' ' + convertStringArrayToSingleLineArray(value);
    case 'multi-line':
      if (value == null || value.length === 0) {
        return '\n  - ';
      }
      return '\n  - ' + value.join('\n  - ');
    case 'single string to single-line':
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + convertStringArrayToSingleLineArray(value);
    case 'single string to multi-line':
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return '\n  - ' + value.join('\n  - ');
    case 'single string space delimited':
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' +value.join(' ');
    case 'single string comma delimited':
      if (value == null || value.length === 0) {
        return ' ';
      } else if (value.length === 1) {
        return ' ' + value[0];
      }

      return ' ' + value.join(', ');
    case 'single-line space delimited':
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

    let arrayItems = value.split(', ');

    arrayItems = arrayItems.length > 1 ? arrayItems : arrayItems[0].split(',');

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
  if (typeof value === 'string') {
    if (value.includes(',')) {
      return value.split(', ');
    }

    return value.split(' ');
  }

  return value;
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
