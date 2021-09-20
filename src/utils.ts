import {rules} from './rules';
import {load} from 'js-yaml';

// Useful regexes

export const headerRegex = /^(\s*)(#+)(\s*)(.*)$/;
export const fencedRegexTemplate = '^XXX\.*?\n(?:((?:.|\n)*?)\n)?XXX(?=\s|$)$';
export const yamlRegex = new RegExp('^---\n(?:((?:.|\n)*?)\n)?---(?=\n|$)');
export const backtickBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '`');
export const tildeBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '~');
export const indentedBlockRegex = '^((\t|( {4})).*\n)+';
export const codeBlockRegex = new RegExp(`${backtickBlockRegexTemplate}|${tildeBlockRegexTemplate}|${indentedBlockRegex}`, 'gm');


// Helper functions

/**
 * Returns a list of ignored rules in the YAML frontmatter of the text.
 * @param {string} text The text to parse
 * @return {string[]} The list of ignored rules
 */
export function getDisabledRules(text: string): string[] {
  const yaml = text.match(yamlRegex);
  if (!yaml) {
    return [];
  }

  const yaml_text = yaml[1];
  const parsed_yaml = load(yaml_text) as {};
  if (!parsed_yaml.hasOwnProperty('disabled rules')) {
    return [];
  }

  let disabled_rules = (parsed_yaml as { 'disabled rules': string[] | string; })['disabled rules'];
  if (!disabled_rules) {
    return [];
  }

  if (typeof disabled_rules === 'string') {
    disabled_rules = [disabled_rules];
  }

  if (disabled_rules.includes('all')) {
    return rules.map((rule) => rule.alias());
  }

  return disabled_rules;
}

/**
 * Substitutes YAML and codeblocks in a text with a placeholder.
 * Then applies the given function to the text.
 * Substitutes the YAML and codeblocks back to their original form.
 * @param {string} text - The text to process
 * @param {function(string): string} func - The function to apply to the text
 * @return {string} The processed text
 */
export function ignoreCodeBlocksAndYAML(text: string, func: (text: string) => string): string {
  const codeMatches = text.match(codeBlockRegex);
  const codePlaceholder = 'PLACEHOLDER 321417';
  if (codeMatches) {
    for (const match of codeMatches) {
      text = text.replace(match, codePlaceholder);
    }
  }

  const yamlPlaceholder = '---\n---';
  const yamlMatches = text.match(yamlRegex);
  if (yamlMatches) {
    text = text.replace(yamlMatches[0], yamlPlaceholder);
  }


  text = func(text);

  if (yamlMatches) {
    text = text.replace(yamlPlaceholder, yamlMatches[0]);
  }

  if (codeMatches) {
    for (const match of codeMatches) {
      text = text.replace(codePlaceholder, match);
    }
  }

  return text;
}

export function formatYAML(text: string, func: (text: string) => string): string {
  if (!text.match(yamlRegex)) {
    return text;
  }

  let yaml = text.match(yamlRegex)[0];
  yaml = func(yaml);
  text = text.replace(yamlRegex, yaml);

  return text;
}


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

/**
 * Inserts a string at the given position in a string.
 * @param {string} str - The string to insert into
 * @param {number} index - The position to insert at
 * @param {string} value - The string to insert
 * @return {string} The string with the inserted string
 */
export function insert(str: string, index: number, value: string): string {
  return str.substr(0, index) + value + str.substr(index);
}

// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}