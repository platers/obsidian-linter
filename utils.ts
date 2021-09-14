// Useful regexes

export const headerRegex = /^(\s*)(#+)(\s*)(.*)$/;
export const fencedRegexTemplate = '^XXX\s*\n((?:.|\n)*?)\nXXX\s*?(?:\n|$)';
export const yamlRegex = new RegExp(fencedRegexTemplate.replaceAll('X', '-'));
export const backtickBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '`');
export const tildeBlockRegexTemplate = fencedRegexTemplate.replaceAll('X', '~');
export const indentedBlockRegex = '((\t|( {4})).*\n)+';
export const codeBlockRegex = new RegExp(`${backtickBlockRegexTemplate}|${tildeBlockRegexTemplate}|${indentedBlockRegex}`, 'gm');


// Helper functions

// Export parseOptions here so it can be tested
export function parseOptions(line: string) {
  // Match arguments with format: optionName=value or optionName="value" or optionName='value'
  const args = line.matchAll(/\s+(\S+)=("[^"]*"|'[^']*'|\S+)/g);
  const options: { [id: string]: string; } = {};

  for (const arg of args) {
    let [, option_name, option_value] = arg;

    if (option_value.startsWith('\'') && option_value.endsWith('\'')) {
      option_value = option_value.slice(1, -1);
    } else if (option_value.startsWith('"') && option_value.endsWith('"')) {
      option_value = option_value.slice(1, -1);
    }

    options[option_name] = option_value;
  }
  return options;
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
  const codePlaceholder = 'PLACEHOLDER FOR CODE BLOCK 1038295\n';
  const codeMatches = text.match(codeBlockRegex);

  const yamlPlaceholder = 'PLACEHOLDER FOR YAML 1038295\n';
  const yamlMatches = text.match(yamlRegex);

  text = text.replace(codeBlockRegex, codePlaceholder);
  text = text.replace(yamlRegex, yamlPlaceholder);
  text = func(text);

  if (yamlMatches) {
    for (const match of yamlMatches) {
      text = text.replace(yamlPlaceholder, match);
    }
  }

  if (codeMatches) {
    for (const match of codeMatches) {
      text = text.replace(codePlaceholder, match);
    }
  }

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
