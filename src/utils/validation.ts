import { parse, YAMLParseError } from 'yaml';
import { loadYAML } from './yaml';
import { getTextInLanguage } from '../lang/helpers';

export function isValidYamlKey(key: string): [boolean, string] {
  let trimmedKey = key.trim();
  if (trimmedKey.endsWith(':')) {
    trimmedKey = trimmedKey.slice(0, -1);
  }

  if (trimmedKey.includes(':')) {
    return [false, getTextInLanguage('validation.yaml-key-only').replace('{KEY}', key)];
  }

  try {
    parse(trimmedKey);
  }
  catch (error: Error) {
    let errorMessage: string;
    if (error instanceof YAMLParseError) {
      errorMessage = error.toString();
      errorMessage = errorMessage.substring(errorMessage.indexOf(':') + 1);
    } else {
      errorMessage = (error as Error).message;
    }

    return [false, getTextInLanguage('validation.yaml-key-only').replace('{KEY}', key).replace('{ERROR_MESSAGE}', errorMessage)];
  }

  return [true, ""];
}

/**
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
    return [false, getTextInLanguage('validation.invalid-yaml').replace('{YAML', text)];
  }

  return [true, ""];
}

export function noWhitespace(text: string): [boolean, string] {
  const hasWhitespace = /\s/.test(text);
  if (hasWhitespace) {
    return [false, getTextInLanguage('validation.no-whitespace').replace('{TEXT}', text)];
  }

  return [true, ""];
}

