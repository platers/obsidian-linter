import { parse } from 'yaml';
import { loadYAML } from './yaml';


export function isValidYamlKey(key: string): [boolean, string] {
  let trimmedKey = key.trim();
  if (trimmedKey.endsWith(':')) {
    trimmedKey = trimmedKey.slice(0, -1);
  }

  if (trimmedKey.includes(':')) {
    return [false, `"${key}" should not have non-whitespace content after the colon`];
  }

  try {
    parse(trimmedKey);
  }
  catch (e) {
    return [false, `"${key}" is not a valid YAML key: ${e}`];
  }

  return [true, ""];
}/**
 * Takes in an arbitraty string and determines if it is valid to place in YAML as it currently is
 * @param text The text to validate
 * @returns a boolean and string where the boolean indicates whether the YAML is valid and the string is the validation message
 */

export function isValidYaml(text: string): [boolean, string] {
  try {
    // the reason for the odd key there is to make sure that whatever text is actually getting inserted will be validated as if
    // it is present with other keys. If it is not, then it will create a problem
    loadYAML(`${text}\ntest-valid-linter-yaml-key-value-test: true`);
  }
  catch {
    return [false, `"${text}" is not valid YAML`];
  }

  return [true, ""];
}

export function noWhitespace(text: string): [boolean, string] {
  const hasWhitespace = /\s/.test(text);
  if (hasWhitespace) {
    return [false, `"$text" cannot have any whitespace`];
  }
}

