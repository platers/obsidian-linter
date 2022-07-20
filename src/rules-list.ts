import dedent from 'ts-dedent';
import moment from 'moment';
import {
  insert,
} from './utils/strings';
import {
  formatYAML,
  initYAML,
  loadYAML,
  toYamlString,
  setYamlSection,
  getYamlSectionValue,
  removeYamlSection,
  toSingleLineArrayYamlString,
} from './utils/yaml';
import {
  BooleanOption,
  MomentFormatOption,
  TextOption,
  DropdownOption,
  DropdownRecord,
  TextAreaOption,
} from './option';
import {ignoreListOfTypes, IgnoreTypes} from './utils/ignore-types';
import {moveFootnotesToEnd, removeSpacesInLinkText} from './utils/mdast';
import {yamlRegex, ensureEmptyLinesAroundRegexMatches, escapeDollarSigns, headerRegex, removeSpacesInWikiLinkText} from './utils/regex';
import {Example, Rule, RuleType} from './rules';

const RuleTypeOrder = Object.values(RuleType);

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
  const parsed_yaml = loadYAML(yaml_text);
  if (!Object.prototype.hasOwnProperty.call(parsed_yaml, 'disabled rules')) {
    return [];
  }

  let disabled_rules = (parsed_yaml as { 'disabled rules': string[] | string })[
      'disabled rules'
  ];
  if (!disabled_rules) {
    return [];
  }

  if (typeof disabled_rules === 'string') {
    disabled_rules = [disabled_rules];
  }

  if (disabled_rules.includes('all')) {
    return _rules.map((rule) => rule.alias());
  }

  return disabled_rules;
}

const _rules: Rule[] = [
  new Rule(
      'Empty Line Around Code Fences',
      'Ensures that there is an empty line around code fences unless they start or end a document.',
      RuleType.SPACING,
      (text: string) => {
        return ensureEmptyLinesAroundRegexMatches(text, /(^|(\n+)?)`{3}( ?[\S]+)?\n([\s\S]+)\n`{3}(\n+)?/gm);
      },
      [
        new Example(
            'Fenced code blocks that start a document do not get an empty line before them.',
            dedent`
            \`\`\` js
            var temp = 'text';
            // this is a code block
            \`\`\`
            Text after code block.
`,
            dedent`
            \`\`\` js
            var temp = 'text';
            // this is a code block
            \`\`\`

            Text after code block.
`,
        ),
        new Example(
            'Fenced code blocs that end a document do not get an empty line after them.',
            dedent`
      # Heading 1
      \`\`\`
      Here is a code block
      \`\`\`
`,
            dedent`
      # Heading 1

      \`\`\`
      Here is a code block
      \`\`\``,
        ),
      ],
  ),

  // YAML rules

  new Rule(
      'Format Tags in YAML',
      'Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.',
      RuleType.YAML,
      (text: string) => {
        return formatYAML(text, (text) => {
          return text.replace(
              /\ntags:(.*?)(?=\n(?:[A-Za-z-]+?:|---))/s,
              function(tagsYAML) {
                return tagsYAML.replaceAll('#', '');
              },
          );
        });
      },
      [
        new Example(
            'Format Tags in YAML frontmatter',
            dedent`
         ---
         tags: #one #two #three #nested/four/five
         ---
        `,
            dedent`
         ---
         tags: one two three nested/four/five
         ---
        `,
        ),
        new Example(
            'Format tags in array',
            dedent`
         ---
         tags: [#one #two #three]
         ---
        `,
            dedent`
         ---
         tags: [one two three]
         ---
        `,
        ),
        new Example(
            'Format tags in list',
            dedent`
          ---
          tags:
          - #tag1
          - #tag2
          ---
        `,
            dedent`
          ---
          tags:
          - tag1
          - tag2
          ---
        `,
        ),
      ],
  ),
  new Rule(
      'Insert YAML attributes',
      'Inserts the given YAML attributes into the YAML frontmatter. Put each attribute on a single line.',
      RuleType.YAML,
      (text: string, options = {}) => {
        text = initYAML(text);
        return formatYAML(text, (text) => {
          const insert_lines = String(options['Text to insert'])
              .split('\n')
              .reverse();
          const parsed_yaml = loadYAML(text.match(yamlRegex)[1]);

          for (const line of insert_lines) {
            const key = line.split(':')[0];
            if (!Object.prototype.hasOwnProperty.call(parsed_yaml, key)) {
              text = text.replace(/^---\n/, escapeDollarSigns(`---\n${line}\n`));
            }
          }

          return text;
        });
      },
      [
        new Example(
            'Insert static lines into YAML frontmatter. Text to insert: `aliases:\ntags: doc\nanimal: dog`',
            dedent`
            ---
            animal: cat
            ---
            `,
            dedent`
            ---
            aliases:
            tags: doc
            animal: cat
            ---
            `,
            {'Text to insert': 'aliases:\ntags: doc\nanimal: dog'},
        ),
      ],
      [
        new TextAreaOption(
            'Text to insert',
            'Text to insert into the YAML frontmatter',
            'aliases: \ntags: ',
        ),
      ],
  ),

  new Rule(
      'YAML Timestamp',
      'Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.',
      RuleType.YAML,
      (text: string, options = {}) => {
        let textModified = options['Already Modified'] === true;
        const newText = initYAML(text);
        textModified = textModified || newText !== text;

        return formatYAML(newText, (text) => {
          const created_match_str = `\n${options['Date Created Key']}: [^\n]+\n`;
          const created_key_match_str = `\n${options['Date Created Key']}:[ \t]*\n`;
          const created_key_match = new RegExp(created_key_match_str);
          const created_match = new RegExp(created_match_str);

          const moment = options['moment'];

          if (options['Date Created'] === true) {
            const created_date = moment(
                options['metadata: file created time'],
            );

            const formatted_date = created_date.format(options['Format']);
            const created_date_line = `\n${options['Date Created Key']}: ${formatted_date}`;

            const keyWithValueFound = created_match.test(text);
            if (!keyWithValueFound && created_key_match.test(text)) {
              text = text.replace(
                  created_key_match,
                  escapeDollarSigns(created_date_line) + '\n',
              );

              textModified = true;
            } else if (!keyWithValueFound) {
              const yaml_end = text.indexOf('\n---');
              text = insert(
                  text,
                  yaml_end,
                  `\n${options['Date Created Key']}: ${formatted_date}`,
              );

              textModified = true;
            } else if (keyWithValueFound) {
              const createdDateTime = moment(text.match(created_match)[0].replace(options['Date Created Key'] + ':', '').trim(), options['Format'], true);
              if (createdDateTime == undefined || !createdDateTime.isValid()) {
                text = text.replace(
                    created_match,
                    escapeDollarSigns(created_date_line) + '\n',
                );

                textModified = true;
              }
            }
          }

          if (options['Date Modified'] === true) {
            const modified_match_str = `\n${options['Date Modified Key']}: [^\n]+\n`;
            const modified_key_match_str = `\n${options['Date Modified Key']}:[ \t]*\n`;
            const modified_key_match = new RegExp(modified_key_match_str);
            const modified_match = new RegExp(modified_match_str);

            const modified_date = moment(
                options['metadata: file modified time'],
            );
            // using the current time helps prevent issues where the previous modified time was greater
            // than 5 seconds prior to the time the linter will finish with the file (i.e. helps prevent accidental infinite loops on updating the date modified value)
            const formatted_modified_date = options['Current Time'].format(options['Format']);
            const modified_date_line = `\n${options['Date Modified Key']}: ${formatted_modified_date}`;

            const keyWithValueFound = modified_match.test(text);
            if (keyWithValueFound) {
              const modifiedDateTime = moment(text.match(modified_match)[0].replace(options['Date Modified Key'] + ':', '').trim(), options['Format'], true);
              if (textModified || modifiedDateTime == undefined || !modifiedDateTime.isValid() ||
                  Math.abs(modifiedDateTime.diff(modified_date, 'seconds')) > 5
              ) {
                text = text.replace(
                    modified_match,
                    escapeDollarSigns(modified_date_line) + '\n',
                );
              }
            } else if (modified_key_match.test(text)) {
              text = text.replace(
                  modified_key_match,
                  escapeDollarSigns(modified_date_line) + '\n',
              );
            } else if (!keyWithValueFound) {
              const yaml_end = text.indexOf('\n---');
              text = insert(text, yaml_end, modified_date_line);
            }
          }

          return text;
        });
      },
      [
        new Example(
            'Adds a header with the date.',
            dedent`
        # H1
        `,
            dedent`
        ---
        date created: Wednesday, January 1st 2020, 12:00:00 am
        date modified: Thursday, January 2nd 2020, 12:00:05 am
        ---
        # H1
        `,
            {
              'metadata: file created time': '2020-01-01T00:00:00-00:00',
              'metadata: file modified time': '2020-01-02T00:00:00-00:00',
              'Current Time': moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
              'Already Modified': false,
              'moment': moment,
            },
        ),
        new Example(
            'dateCreated option is false',
            dedent`
        # H1
        `,
            dedent`
        ---
        date modified: Thursday, January 2nd 2020, 12:00:05 am
        ---
        # H1
        `,
            {
              'Date Created': false,
              'metadata: file created time': '2020-01-01T00:00:00-00:00',
              'metadata: file modified time': '2020-01-01T00:00:00-00:00',
              'Current Time': moment('Thursday, January 2nd 2020, 12:00:05 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
              'Already Modified': false,
              'moment': moment,
            },
        ),
        new Example(
            'Date Created Key is set',
            dedent`
        # H1
            `,
            dedent`
        ---
        created: Wednesday, January 1st 2020, 12:00:00 am
        ---
        # H1
        `,
            {
              'Date Created': true,
              'Date Modified': false,
              'Date Created Key': 'created',
              'metadata: file created time': '2020-01-01T00:00:00-00:00',
              'Current Time': moment('Thursday, January 2nd 2020, 12:00:03 am', 'dddd, MMMM Do YYYY, h:mm:ss a'),
              'Already Modified': false,
              'moment': moment,
            },
        ),
        new Example(
            'Date Modified Key is set',
            dedent`
        # H1
            `,
            dedent`
        ---
        modified: Wednesday, January 1st 2020, 4:00:00 pm
        ---
        # H1
        `,
            {
              'Date Created': false,
              'Date Modified': true,
              'Date Modified Key': 'modified',
              'metadata: file modified time': '2020-01-01T00:00:00-00:00',
              'Current Time': moment('Wednesday, January 1st 2020, 4:00:00 pm', 'dddd, MMMM Do YYYY, h:mm:ss a'),
              'Already Modified': false,
              'moment': moment,
            },
        ),
      ],
      [
        new BooleanOption(
            'Date Created',
            'Insert the file creation date',
            true,
        ),
        new TextOption(
            'Date Created Key',
            'Which YAML key to use for creation date',
            'date created',
        ),
        new BooleanOption(
            'Date Modified',
            'Insert the date the file was last modified',
            true,
        ),
        new TextOption(
            'Date Modified Key',
            'Which YAML key to use for modification date',
            'date modified',
        ),
        new MomentFormatOption(
            'Format',
            'Date format',
            'dddd, MMMM Do YYYY, h:mm:ss a',
        ),
      ],
  ),

  new Rule(
      'YAML Title',
      'Inserts the title of the file into the YAML frontmatter. Gets the title from the first H1 or filename.',
      RuleType.YAML,
      (text: string, options = {}) => {
        text = initYAML(text);
        let title = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          const result = text.match(/^#\s+(.*)/m);
          if (result) {
            return result[1];
          }
          return '';
        });
        title = title || options['metadata: file name'];

        title = toYamlString(title);

        return formatYAML(text, (text) => {
          const title_match_str = `\n${options['Title Key']}.*\n`;
          const title_match = new RegExp(title_match_str);
          if (title_match.test(text)) {
            text = text.replace(
                title_match,
                escapeDollarSigns(`\n${options['Title Key']}: ${title}\n`),
            );
          } else {
            const yaml_end = text.indexOf('\n---');
            text = insert(text, yaml_end, `\n${options['Title Key']}: ${title}`);
          }

          return text;
        });
      },
      [
        new Example(
            'Adds a header with the title from heading.',
            dedent`
        # Obsidian
        `,
            dedent`
        ---
        title: Obsidian
        ---
        # Obsidian
        `,
            {
              'metadata: file name': 'Filename',
            },
        ),
        new Example(
            'Adds a header with the title.',
            dedent`
        `,
            dedent`
        ---
        title: Filename
        ---

        `,
            {
              'metadata: file name': 'Filename',
            },
        ),
      ],
      [new TextOption('Title Key', 'Which YAML key to use for title', 'title')],
  ),

  new Rule(
      'YAML Title Alias',
      'Inserts the title of the file into the YAML frontmatter\'s aliases section. Gets the title from the first H1 or filename.',
      RuleType.YAML,
      (text: string, options = {}) => {
        const ALIASES_YAML_SECTION_NAME = 'aliases';
        const LINTER_ALIASES_HELPER_NAME = 'linter-yaml-title-alias';

        const optionsObj = {
          yamlAliasesSectionStyle: options['YAML aliases section style'] as string,
          preserveExistingAliasesSectionStyle: options['Preserve existing aliases section style'] as boolean ?? true,
          keepAliasThatMatchesTheFilename: options['Keep alias that matches the filename'] as boolean,
          fileName: options['metadata: file name'] as string,
        };

        text = initYAML(text);
        let title = ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          const result = text.match(/^#\s+(.*)/m);
          if (result) {
            return result[1];
          }
          return '';
        });
        title = title || optionsObj.fileName;

        const shouldRemoveTitleAlias = !optionsObj.keepAliasThatMatchesTheFilename && title === optionsObj.fileName;

        let yaml = text.match(yamlRegex)[1];

        let previousTitle = loadYAML(getYamlSectionValue(yaml, LINTER_ALIASES_HELPER_NAME));


        let requiresChanges = true;

        if (previousTitle === title && !shouldRemoveTitleAlias) {
          requiresChanges = false;
        }

        if (previousTitle === null && shouldRemoveTitleAlias) {
          requiresChanges = false;
        }

        if (!requiresChanges && optionsObj.preserveExistingAliasesSectionStyle) {
          return text;
        }

        let aliasesValue = getYamlSectionValue(yaml, ALIASES_YAML_SECTION_NAME);

        if (!aliasesValue) {
          if (shouldRemoveTitleAlias) {
            return text;
          }

          let emptyValue;
          switch (optionsObj.yamlAliasesSectionStyle) {
            case 'Multi-line array':
              emptyValue = '\n  - \'\'';
              break;
            case 'Single-line array':
              emptyValue = ' [\'\']';
              break;
            case 'Single string that expands to multi-line array if needed':
            case 'Single string that expands to single-line array if needed':
              emptyValue = ' \'\'';
              break;
            default:
              throw new Error(`Unsupported setting 'YAML aliases section style': ${optionsObj.yamlAliasesSectionStyle}`);
          }

          let newYaml = yaml;
          newYaml = setYamlSection(newYaml, ALIASES_YAML_SECTION_NAME, emptyValue);
          newYaml = setYamlSection(newYaml, LINTER_ALIASES_HELPER_NAME, ' \'\'');

          text = text.replace(`---\n${yaml}---`, `---\n${newYaml}---`);
          yaml = newYaml;
          aliasesValue = getYamlSectionValue(yaml, ALIASES_YAML_SECTION_NAME);
          previousTitle = '';
        }

        const isMultiline = aliasesValue.includes('\n');
        const parsedAliases = loadYAML(aliasesValue);

        const isSingleString = !isMultiline && aliasesValue.match(/^\[.*\]/) === null;

        let resultAliasesArray = isSingleString ? [parsedAliases] : [...parsedAliases];

        const previousTitleIndex = resultAliasesArray.indexOf(previousTitle);
        if (previousTitleIndex !== -1) {
          if (shouldRemoveTitleAlias) {
            resultAliasesArray.splice(previousTitleIndex, 1);
          } else {
            resultAliasesArray[previousTitleIndex] = title;
          }
        } else if (!shouldRemoveTitleAlias) {
          resultAliasesArray = [title, ...resultAliasesArray];
        }

        if (!requiresChanges) {
          switch (optionsObj.yamlAliasesSectionStyle) {
            case 'Multi-line array':
              if (isMultiline) {
                return text;
              }
              break;
            case 'Single-line array':
              if (!isMultiline && !isSingleString) {
                return text;
              }
              break;
            case 'Single string that expands to multi-line array if needed':
              if (isSingleString) {
                return text;
              }
              if (isMultiline && resultAliasesArray.length > 1) {
                return text;
              }
              break;
            case 'Single string that expands to single-line array if needed':
              if (isSingleString) {
                return text;
              }
              if (!isMultiline && resultAliasesArray.length > 1) {
                return text;
              }
              break;
          }
        }

        let resultStyle;

        if (resultAliasesArray.length === 0) {
          resultStyle = 'Remove';
        } else if (!optionsObj.preserveExistingAliasesSectionStyle) {
          switch (optionsObj.yamlAliasesSectionStyle) {
            case 'Multi-line array':
              resultStyle = 'Multi-line array';
              break;
            case 'Single-line array':
              resultStyle = 'Single-line array';
              break;
            case 'Single string that expands to multi-line array if needed':
              if (resultAliasesArray.length === 1) {
                resultStyle = 'Single string';
              } else {
                resultStyle = 'Multi-line array';
              }
              break;
            case 'Single string that expands to single-line array if needed':
              if (resultAliasesArray.length === 1) {
                resultStyle = 'Single string';
              } else {
                resultStyle = 'Single-line array';
              }
              break;
          }
        } else if (isSingleString) {
          if (resultAliasesArray.length === 1) {
            resultStyle = 'Single string';
          } else {
            switch (optionsObj.yamlAliasesSectionStyle) {
              case 'Multi-line array':
              case 'Single string that expands to multi-line array if needed':
                resultStyle = 'Multi-line array';
                break;
              case 'Single-line array':
              case 'Single string that expands to single-line array if needed':
                resultStyle = 'Single-line array';
                break;
            }
          }
        } else if (isMultiline) {
          resultStyle = 'Multi-line array';
        } else {
          resultStyle = 'Single-line array';
        }

        let newAliasesYaml;

        switch (resultStyle) {
          case 'Remove':
            break;
          case 'Multi-line array':
            newAliasesYaml = `\n${toYamlString(resultAliasesArray)}`.replace(/\n-/g, '\n  -');
            break;
          case 'Single-line array':
            newAliasesYaml = ` ${toSingleLineArrayYamlString(resultAliasesArray)}`;
            break;
          case 'Single string':
            newAliasesYaml = resultAliasesArray.length === 0 ? '' : ` ${toYamlString(resultAliasesArray[0])}`;
            break;
          default:
            throw new Error(`Unsupported resultStyle: ${resultStyle}`);
        }

        let newYaml = yaml;

        if (resultStyle === 'Remove') {
          newYaml = removeYamlSection(newYaml, ALIASES_YAML_SECTION_NAME);
        } else {
          newYaml = setYamlSection(newYaml, ALIASES_YAML_SECTION_NAME, newAliasesYaml);
        }

        if (shouldRemoveTitleAlias) {
          newYaml = removeYamlSection(newYaml, LINTER_ALIASES_HELPER_NAME);
        } else {
          newYaml = setYamlSection(newYaml, LINTER_ALIASES_HELPER_NAME, ` ${toYamlString(title)}`);
        }

        text = text.replace(yaml, newYaml);

        return text;
      },
      [
        new Example(
            'Adds a header with the title from heading.',
            dedent`
      # Obsidian
      `,
            dedent`
      ---
      aliases:
        - Obsidian
      linter-yaml-title-alias: Obsidian
      ---
      # Obsidian
      `,
            {
              'YAML aliases section style': 'Multi-line array',
            },
        ),
        new Example(
            'Adds a header with the title.',
            dedent`
      `,
            dedent`
      ---
      aliases:
        - Filename
      linter-yaml-title-alias: Filename
      ---

      `,
            {
              'metadata: file name': 'Filename',
              'YAML aliases section style': 'Multi-line array',
              'Keep alias that matches the filename': true,
            },
        ),
      ],
      [
        new DropdownOption(
            'YAML aliases section style',
            'The style of the aliases YAML section',
            'Multi-line array',
            [
              new DropdownRecord(
                  'Multi-line array',
                  '```aliases:\\n  - Title```',
              ),
              new DropdownRecord(
                  'Single-line array',
                  '```aliases: [Title]```',
              ),
              new DropdownRecord(
                  'Single string that expands to multi-line array if needed',
                  '```aliases: Title```',
              ),
              new DropdownRecord(
                  'Single string that expands to single-line array if needed',
                  '```aliases: Title```',
              ),
            ],
        ),
        new BooleanOption(
            'Preserve existing aliases section style',
            'If set, the `YAML aliases section style` setting applies only to the newly created sections',
            true,
        ),
        new BooleanOption(
            'Keep alias that matches the filename',
            'Such aliases are usually redundant',
            false,
        ),
      ],
  ),

  new Rule(
      'Escape YAML Special Characters',
      'Escapes colons with a space after them (: ), single quotes (\'), and double quotes (") in YAML.',
      RuleType.YAML,
      (text: string, options = {}) => {
        return formatYAML(text, (text) => {
          const yamlLines = text.split('\n');

          const yamlLineCount = yamlLines.length;
          if (yamlLineCount < 1) {
            return text;
          }

          const isValueEscapedAlready = function(value: string): boolean {
            return value.length > 1 && ((value.startsWith('\'') && value.endsWith('\'')) ||
              (value.startsWith('"') && value.endsWith('"')));
          };

          const escapeSubstringIfNecessary = function(fullText: string, substring: string): string {
            if (isValueEscapedAlready(substring)) {
              return fullText;
            }

            // if there is no single quote, double quote, or colon to escape, skip this substring
            const substringHasSingleQuote = substring.includes('\'');
            const substringHasDoubleQuote = substring.includes('"');
            const substringHasColonWithSpaceAfterIt = substring.includes(': ');
            if (!substringHasSingleQuote && !substringHasDoubleQuote && !substringHasColonWithSpaceAfterIt) {
              return fullText;
            }

            // if the substring already has a single quote and a double quote, there is nothing that can be done to escape the substring
            if (substringHasSingleQuote && substringHasDoubleQuote) {
              return fullText;
            }

            let newText: string;
            if (substringHasSingleQuote) {
              newText = fullText.replace(substring, `"${substring}"`);
            } else if (substringHasDoubleQuote) {
              newText = fullText.replace(substring, `'${substring}'`);
            } else { // the line must have a colon with a space
              newText = fullText.replace(substring, `${options['Default Escape Character']}${substring}${options['Default Escape Character']}`);
            }

            return newText;
          };

          for (let i = 0; i < yamlLineCount; i++) {
            const line = yamlLines[i].trim();

            const firstColonIndex = line.indexOf(':');
            const isKeyValueLineWithoutValue = firstColonIndex < 0 || firstColonIndex + 1 >= line.length;
            const startsWithDash = line.startsWith('-');
            const isArrayItemLineWithoutValue = startsWithDash && line.length < 2;
            if (isKeyValueLineWithoutValue && isArrayItemLineWithoutValue) {
              continue;
            }

            let valueStartIndex = 1;
            if (!startsWithDash) {
              valueStartIndex += firstColonIndex;
            }

            const value = line.substring(valueStartIndex).trim();
            if (value.startsWith('[')) {
              if (options['Try to Escape Single Line Arrays']) {
                if (value.length < 3) {
                  continue;
                }

                // Note: this does not account for list items that are already in single or double quotes,
                // but we can address that if we run into such a scenario
                const arrayItems = value.substring(1, value.length - 1).split(',');
                const numberOfArrayItems = arrayItems.length;
                for (let j = 0; j < numberOfArrayItems; j++) {
                  let arrayItem = arrayItems[j].trim();
                  if (arrayItem.startsWith('[')) {
                    arrayItem = arrayItem.substring(1).trimStart();
                  }

                  if (arrayItem.endsWith(']')) {
                    arrayItem = arrayItem.substring(0, arrayItem.length - 1).trimEnd();
                  }

                  arrayItems[j] = escapeSubstringIfNecessary(arrayItems[j], arrayItem);
                }

                yamlLines[i] = yamlLines[i].replace(value, '[' + arrayItems.join(',') + ']');
              }

              continue;
            }

            yamlLines[i] = escapeSubstringIfNecessary(yamlLines[i], value);
          }

          return yamlLines.join('\n');
        });
      },
      [
        new Example(
            'YAML without anything to escape',
            dedent`
       ---
       key: value
       otherKey: []
       ---
      `,
            dedent`
        ---
        key: value
        otherKey: []
        ---
      `,
        ),
        new Example(
            'YAML with unescaped values',
            dedent`
          ---
          key: value: with colon in the middle
          secondKey: value with ' a single quote present
          thirdKey: "already escaped: value"
          fourthKey: value with " a double quote present
          fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
          sixthKey: colon:between characters is fine
          otherKey: []
          ---
      `,
            dedent`
          ---
          key: "value: with colon in the middle"
          secondKey: "value with ' a single quote present"
          thirdKey: "already escaped: value"
          fourthKey: 'value with " a double quote present'
          fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
          sixthKey: colon:between characters is fine
          otherKey: []
          ---
      `,
        ),
        new Example(
            'YAML with unescaped values in an expanded list with `Default Escape Character = \'`',
            dedent`
        ---
        key:
          - value: with colon in the middle
          - value with ' a single quote present
          - 'already escaped: value'
          - value with " a double quote present
          - value with both ' " a double and single quote present is not escaped, but is invalid YAML
          - colon:between characters is fine
        ---
    `,
            dedent`
        ---
        key:
          - 'value: with colon in the middle'
          - "value with ' a single quote present"
          - 'already escaped: value'
          - 'value with " a double quote present'
          - value with both ' " a double and single quote present is not escaped, but is invalid YAML
          - colon:between characters is fine
        ---
    `,
            {
              'Default Escape Character': '\'',
            },
        ),
        new Example(
            'YAML with unescaped values with arrays',
            dedent`
        ---
        array: [value: with colon in the middle, value with ' a single quote present, "already escaped: value", value with " a double quote present, value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
        nestedArray: [[value: with colon in the middle, value with ' a single quote present], ["already escaped: value", value with " a double quote present], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
        nestedArray2: [[value: with colon in the middle], value with ' a single quote present]
        ---

        _Note that escaped commas in a YAML array will be treated as a separator._
    `,
            dedent`
        ---
        array: ["value: with colon in the middle", "value with ' a single quote present", "already escaped: value", 'value with " a double quote present', value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
        nestedArray: [["value: with colon in the middle", "value with ' a single quote present"], ["already escaped: value", 'value with " a double quote present'], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
        nestedArray2: [["value: with colon in the middle"], "value with ' a single quote present"]
        ---

        _Note that escaped commas in a YAML array will be treated as a separator._
    `,
            {
              'Try to Escape Single Line Arrays': true,
            },
        ),
      ],
      [new DropdownOption(
          'Default Escape Character',
          'The default character to use to escape YAML values when a single quote and double quote are not present.',
          '"',
          [
            new DropdownRecord(
                '"', 'Use a double quote to escape if no single or double quote is present',
            ),
            new DropdownRecord('\'', 'Use a single quote to escape if no single or double quote is present'),
          ],
      ),
      new BooleanOption(
          'Try to Escape Single Line Arrays',
          'Tries to escape array values assuming that an array starts with "[", ends with "]", and has items that are delimited by ",".',
          false,
      ),
      ],
  ),

  new Rule(
      'YAML Key Sort',
      'Sorts the YAML keys based on the order and priority specified. Note: removes blank lines as well.',
      RuleType.YAML,
      (text: string, options = {}) => {
        const yaml = text.match(yamlRegex);
        if (!yaml) {
          return text;
        }

        let yamlText = yaml[1];

        const priorityAtStartOfYaml: boolean = options['Priority Keys at Start of YAML'];
        const updateDateModifiedIfYamlChanged = function(oldYaml: string, newYaml: string): string {
          if (oldYaml == newYaml) {
            return newYaml;
          }

          return setYamlSection(newYaml, options['Date Modified Key'], ' ' + options['Current Time Formatted']);
        };
        const getTextWithNewYamlFrontmatter = function(priorityKeysSorted: string, remainingKeys: string, priorityAtStart: boolean): string {
          let newYaml = `${remainingKeys}${priorityKeysSorted}`;
          if (priorityAtStart) {
            newYaml = `${priorityKeysSorted}${remainingKeys}`;
          }

          if (options['Yaml Timestamp Date Modified Enabled']) {
            newYaml = updateDateModifiedIfYamlChanged(yaml[1], newYaml);
          }

          return text.replace(yaml[1], newYaml);
        };

        const getYAMLKeysSorted = function(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
          let specifiedYamlKeysSorted = '';
          for (const key of keys) {
            const value = getYamlSectionValue(yaml, key);

            if (value !== null) {
              if (value.includes('\n')) {
                specifiedYamlKeysSorted += `${key}:${value}\n`;
              } else {
                specifiedYamlKeysSorted += `${key}: ${value}\n`;
              }

              yaml = removeYamlSection(yaml, key);
            }
          }

          return {
            remainingYaml: yaml,
            sortedYamlKeyValues: specifiedYamlKeysSorted,
          };
        };

        const yamlKeys: string[] = options['YAML Key Priority Sort Order'].split('\n');
        const sortKeysResult = getYAMLKeysSorted(yamlText, yamlKeys);
        const priorityKeysSorted = sortKeysResult.sortedYamlKeyValues;
        yamlText = sortKeysResult.remainingYaml;

        const sortOrder = options['YAML Sort Order for Other Keys'];
        const yamlObject = loadYAML(yamlText);
        if (yamlObject == null) {
          return getTextWithNewYamlFrontmatter(priorityKeysSorted, yamlText, priorityAtStartOfYaml);
        }

        const sortAlphabeticallyDesc = function(previousKey: string, currentKey: string): number {
          previousKey = previousKey.toLowerCase();
          currentKey = currentKey.toLowerCase();

          return previousKey > currentKey ? -1 : currentKey > previousKey ? 1 : 0;
        };
        const sortAlphabeticallyAsc = function(previousKey: string, currentKey: string): number {
          previousKey = previousKey.toLowerCase();
          currentKey = currentKey.toLowerCase();

          return previousKey < currentKey ? -1 : currentKey < previousKey ? 1 : 0;
        };

        let remainingKeys = Object.keys(yamlObject);
        let sortMethod: (previousKey: string, currentKey: string) => number;
        if (sortOrder === 'Ascending Alphabetical') {
          sortMethod = sortAlphabeticallyAsc;
        } else if (sortOrder === 'Descending Alphabetical') {
          sortMethod = sortAlphabeticallyDesc;
        } else {
          return getTextWithNewYamlFrontmatter(priorityKeysSorted, yamlText, priorityAtStartOfYaml);
        }

        remainingKeys = remainingKeys.sort(sortMethod);
        const remainingKeysSortResult = getYAMLKeysSorted(yamlText, remainingKeys);

        return getTextWithNewYamlFrontmatter(priorityKeysSorted, remainingKeysSortResult.sortedYamlKeyValues, priorityAtStartOfYaml);
      },
      [
        new Example(
            'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`',
            dedent`
      ---
      language: Typescript
      type: programming
      tags: computer
      keywords: []
      status: WIP
      date: 02/15/2022
      ---
      `,
            dedent`
      ---
      date: 02/15/2022
      type: programming
      language: Typescript
      tags: computer
      keywords: []
      status: WIP
      ---
      `,
            {'YAML Key Priority Sort Order': 'date\ntype\nlanguage', 'YAML Sort Order for Other Keys': 'None', 'Priority Keys at Start of YAML': true},
        ),
        new Example(
            'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `\'YAML Sort Order for Other Keys\' = Ascending Alphabetical`',
            dedent`
      ---
      language: Typescript
      type: programming
      tags: computer
      keywords: []
      status: WIP
      date: 02/15/2022
      ---
      `,
            dedent`
      ---
      date: 02/15/2022
      type: programming
      language: Typescript
      keywords: []
      status: WIP
      tags: computer
      ---
      `,
            {'YAML Key Priority Sort Order': 'date\ntype\nlanguage', 'YAML Sort Order for Other Keys': 'Ascending Alphabetical'},
        ),
        new Example(
            'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `\'YAML Sort Order for Other Keys\' = Descending Alphabetical`',
            dedent`
      ---
      language: Typescript
      type: programming
      tags: computer
      keywords: []
      status: WIP
      date: 02/15/2022
      ---
      `,
            dedent`
      ---
      date: 02/15/2022
      type: programming
      language: Typescript
      tags: computer
      status: WIP
      keywords: []
      ---
      `,
            {'YAML Key Priority Sort Order': 'date\ntype\nlanguage', 'YAML Sort Order for Other Keys': 'Descending Alphabetical', 'Priority Keys at Start of YAML': true},
        ),
        new Example(
            'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `\'YAML Sort Order for Other Keys\' = Descending Alphabetical` and `\'Priority Keys at Start of YAML\' = false`',
            dedent`
  ---
  language: Typescript
  type: programming
  tags: computer
  keywords: []

  status: WIP
  date: 02/15/2022
  ---
  `,
            dedent`
  ---
  tags: computer
  status: WIP
  keywords: []
  date: 02/15/2022
  type: programming
  language: Typescript
  ---
  `,
            {'YAML Key Priority Sort Order': 'date\ntype\nlanguage', 'YAML Sort Order for Other Keys': 'Descending Alphabetical', 'Priority Keys at Start of YAML': false},
        ),
      ],
      [
        new TextAreaOption('YAML Key Priority Sort Order', 'The order in which to sort keys with one on each line where it sorts in the order found in the list', ''),
        new BooleanOption('Priority Keys at Start of YAML', 'YAML Key Priority Sort Order is placed at the start of the YAML frontmatter', true),
        new DropdownOption(
            'YAML Sort Order for Other Keys',
            'The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area',
            'None',
            [
              new DropdownRecord('None', 'No sorting other than what is in the YAML Key Priority Sort Order text area'),
              new DropdownRecord('Ascending Alphabetical', 'Sorts the keys based on key value from a to z'),
              new DropdownRecord('Descending Alphabetical', 'Sorts the keys based on key value from z to a'),
            ],
        ),
      ],
  ),

  new Rule(
      'Remove YAML Keys',
      'Removes the YAML keys specified',
      RuleType.YAML,
      (text: string, options = {}) => {
        const yamlKeysToRemove: string[] = options['YAML Keys to Remove'].split('\n');
        const yaml = text.match(yamlRegex);
        if (!yaml || yamlKeysToRemove.length === 0) {
          return text;
        }

        let yamlText = yaml[1];
        for (const key of yamlKeysToRemove) {
          let actualKey = key.trim();
          if (actualKey.endsWith(':')) {
            actualKey = actualKey.substring(0, actualKey.length - 1);
          }

          yamlText = removeYamlSection(yamlText, actualKey);
        }


        return text.replace(yaml[1], yamlText);
      },
      [
        new Example(
            'Removes the values specified in `YAML Keys to Remove` = "status:\nkeywords\ndate"',
            dedent`
            ---
            language: Typescript
            type: programming
            tags: computer
            keywords:
              - keyword1
              - keyword2
            status: WIP
            date: 02/15/2022
            ---

            # Header Context

            Text
            `,
            dedent`
            ---
            language: Typescript
            type: programming
            tags: computer
            ---

            # Header Context

            Text
            `,
            {'YAML Keys to Remove': 'status:\nkeywords\ndate'},
        ),
      ],
      [
        new TextAreaOption('YAML Keys to Remove', 'The yaml keys to remove from the yaml frontmatter with or without colons', ''),
      ],
  ),

  // Heading rules

  new Rule(
      'Header Increment',
      'Heading levels should only increment by one level at a time',
      RuleType.HEADING,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          const lines = text.split('\n');
          let lastLevel = 0; // level of last header processed
          let decrement = 0; // number of levels to decrement following headers
          for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(headerRegex);
            if (!match) {
              continue;
            }

            let level = match[2].length - decrement;
            if (level > lastLevel + 1) {
              decrement += level - (lastLevel + 1);
              level = lastLevel + 1;
            } else if (level < lastLevel) {
              decrement -= lastLevel + decrement - match[2].length;

              if (decrement <= 0) {
                level = match[2].length;
                decrement = 0;
              }
            }

            lines[i] = lines[i].replace(
                headerRegex,
                `$1${'#'.repeat(level)}$3$4`,
            );
            lastLevel = level;
          }
          return lines.join('\n');
        });
      },
      [
        new Example(
            '',
            dedent`
        # H1
        ### H3
        ### H3
        #### H4
        ###### H6

        We skipped a 2nd level heading
        `,
            dedent`
        # H1
        ## H3
        ## H3
        ### H4
        #### H6

        We skipped a 2nd level heading
        `,
        ),
        new Example(
            'Skipped headings in sections that would be decremented will result in those headings not having the same meaning',
            dedent`
          # H1
          ### H3

          We skip from 1 to 3

          ####### H7

          We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered

          ###### H6

          We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

          ## H2

          This resets the decrement section so the H6 below is decremented to an H3

          ###### H6
      `,
            dedent`
          # H1
          ## H3

          We skip from 1 to 3

          ### H7

          We skip from 3 to 7 leaving out 4, 5, and 6. Thus headings level 4, 5, and 6 will be treated like H3 above until another H2 or H1 is encountered

          ## H6

          We skipped 6 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

          ## H2

          This resets the decrement section so the H6 below is decremented to an H3

          ### H6
      `,
        ),
      ],
  ),
  new Rule(
      'File Name Heading',
      'Inserts the file name as a H1 heading if no H1 heading exists.',
      RuleType.HEADING,
      (text: string, options = {}) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
        // check if there is a H1 heading
          const hasH1 = text.match(/^#\s.*/m);
          if (hasH1) {
            return text;
          }

          const fileName = options['metadata: file name'];
          // insert H1 heading after front matter
          let yaml_end = text.indexOf('\n---');
          yaml_end =
          yaml_end == -1 || !text.startsWith('---\n') ? 0 : yaml_end + 5;
          return insert(text, yaml_end, `# ${fileName}\n`);
        });
      },
      [
        new Example(
            'Inserts an H1 heading',
            dedent`
              This is a line of text
            `,
            dedent`
              # File Name
              This is a line of text
            `,
            {'metadata: file name': 'File Name'},
        ),
        new Example(
            'Inserts heading after YAML front matter',
            dedent`
              ---
              title: My Title
              ---
              This is a line of text
            `,
            dedent`
              ---
              title: My Title
              ---
              # File Name
              This is a line of text
            `,
            {'metadata: file name': 'File Name'},
        ),
      ],
  ),
  new Rule(
      'Capitalize Headings',
      'Headings should be formatted with capitalization',
      RuleType.HEADING,
      (text: string, options = {}) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          const lines = text.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(headerRegex); // match only headings
            if (!match) {
              continue;
            }
            switch (options['Style']) {
              case 'Title Case': {
                const headerWords = lines[i].match(/\S+/g);
                // split by comma or whitespace
                const keepCasing = (options['Ignore Words'] as string).split(
                    /[,\s]+/,
                );
                const ignoreShortWords = (
                options['Lowercase Words'] as string
                ).split(/[,\s]+/);
                let firstWord = true;
                for (let j = 1; j < headerWords.length; j++) {
                  const isWord = headerWords[j].match(/^[A-Za-z'-]+[.?!,:;]?$/);
                  if (!isWord) {
                    continue;
                  }

                  const ignoreCasedWord =
                  options['Ignore Cased Words'] &&
                  headerWords[j] !== headerWords[j].toLowerCase();
                  const keepWordCasing =
                  ignoreCasedWord || keepCasing.includes(headerWords[j]);
                  if (!keepWordCasing) {
                    headerWords[j] = headerWords[j].toLowerCase();
                    const ignoreWord = ignoreShortWords.includes(headerWords[j]);
                    if (!ignoreWord || firstWord === true) {
                    // ignore words that are not capitalized in titles except if they are the first word
                      headerWords[j] =
                      headerWords[j][0].toUpperCase() + headerWords[j].slice(1);
                    }
                  }

                  firstWord = false;
                }

                lines[i] = lines[i].replace(
                    headerRegex,
                    escapeDollarSigns(`${headerWords.join(' ')}`),
                );
                break;
              }
              case 'ALL CAPS':
                lines[i] = lines[i].toUpperCase(); // convert full heading to uppercase
                break;
              case 'First letter':
                lines[i] = lines[i]
                    .toLowerCase()
                    .replace(/^#*\s+([^a-z])*([a-z])/, (string) => string.toUpperCase()); // capitalize first letter of heading
                break;
            }
          }
          return lines.join('\n');
        });
      },
      [
        new Example(
            'With `Title Case=true`, `Ignore Cased Words=false`',
            dedent`
        # this is a heading 1
        ## THIS IS A HEADING 2
        ### a heading 3
        `,
            dedent`
        # This is a Heading 1
        ## This is a Heading 2
        ### A Heading 3
        `,
            {'Style': 'Title Case', 'Ignore Cased Words': false},
        ),
        new Example(
            'With `Title Case=true`, `Ignore Cased Words=true`',
            dedent`
        # this is a heading 1
        ## THIS IS A HEADING 2
        ### a hEaDiNg 3
        `,
            dedent`
        # This is a Heading 1
        ## THIS IS A HEADING 2
        ### A hEaDiNg 3
        `,
            {'Style': 'Title Case', 'Ignore Cased Words': true},
        ),
        new Example(
            'With `First letter=true`',
            dedent`
        # this is a heading 1
        ## this is a heading 2
        `,
            dedent`
        # This is a heading 1
        ## This is a heading 2
        `,
            {Style: 'First letter'},
        ),
        new Example(
            'With `ALL CAPS=true`',
            dedent`
        # this is a heading 1
        ## this is a heading 2
        `,
            dedent`
        # THIS IS A HEADING 1
        ## THIS IS A HEADING 2
        `,
            {Style: 'ALL CAPS'},
        ),
      ],
      [
        new DropdownOption(
            'Style',
            'The style of capitalization to use',
            'Title Case',
            [
              new DropdownRecord('Title Case', 'Capitalize Using Title Case Rules'),
              new DropdownRecord(
                  'ALL CAPS',
                  'CAPITALIZE THE WHOLE TITLE',
              ),
              new DropdownRecord(
                  'First letter',
                  'Only capitalize the first letter',
              ),
            ],
        ),
        new BooleanOption(
            'Ignore Cased Words',
            'Only apply title case style to words that are all lowercase',
            true,
        ),
        new TextAreaOption(
            'Ignore Words',
            'A comma separated list of words to ignore when capitalizing',
            dedent`
          macOS, iOS, iPhone, iPad, JavaScript, TypeScript, AppleScript`,
        ),
        new TextAreaOption(
            'Lowercase Words',
            'A comma separated list of words to keep lowercase',
            dedent`
          via, a, an, the, and, or, but, for, nor, so, yet, at, by, in, of, on, to, up, as, is, if, it, for, to, with, without, into, onto, per`,
        ),
      ],
  ),

  // Footnote rules

  new Rule(
      'Move Footnotes to the bottom',
      'Move all footnotes to the bottom of the document.',
      RuleType.FOOTNOTE,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          return moveFootnotesToEnd(text);
        });
      },
      [
        new Example(
            'Moving footnotes to the bottom',
            dedent`
            Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

            [^1]: first footnote

            Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
            [^2]: second footnote

            Maecenas malesuada dignissim purus ac volutpat.
        `,
            dedent`
            Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

            Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
            Maecenas malesuada dignissim purus ac volutpat.

            [^1]: first footnote
            [^2]: second footnote
        `,
        ),
      ],
  ),
  new Rule(
      'Re-Index Footnotes',
      'Re-indexes footnote keys and footnote, based on the order of occurence (NOTE: This rule deliberately does *not* preserve the relation between key and footnote, to be able to re-index duplicate keys.)',
      RuleType.FOOTNOTE,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
        // re-index footnote-text
          let ft_index = 0;
          text = text.replace(/^\[\^\w+\]: /gm, function() {
            ft_index++;
            return '[^' + String(ft_index) + ']: ';
          });

          // re-index footnote-keys
          // regex uses hack to treat lookahead as lookaround https://stackoverflow.com/a/43232659
          ft_index = 0;
          text = text.replace(/(?!^)\[\^\w+\]/gm, function() {
            ft_index++;
            return '[^' + String(ft_index) + ']';
          });
          return text;
        });
      },
      [
        new Example(
            'Re-indexing footnotes after having deleted previous footnotes',
            dedent`
        Lorem ipsum at aliquet felis.[^3] Donec dictum turpis quis pellentesque,[^5] et iaculis tortor condimentum.

        [^3]: first footnote
        [^5]: second footnote
        `,
            dedent`
        Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

        [^1]: first footnote
        [^2]: second footnote
        `,
        ),
        new Example(
            'Re-indexing footnotes after inserting a footnote between',
            dedent`
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.

        [^1]: first footnote
        [^1a]: third footnote, inserted later
        [^2]: second footnotes
        `,
            dedent`
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.

        [^1]: first footnote
        [^2]: third footnote, inserted later
        [^3]: second footnotes
        `,
        ),
        new Example(
            'Re-indexing duplicate footnote keys',
            dedent`
        Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^1] et iaculis tortor condimentum.

        [^1]: first footnote
        [^1]: second footnote
        `,
            dedent`
        Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

        [^1]: first footnote
        [^2]: second footnote
        `,
        ),
      ],
  ),
  new Rule(
      'Footnote after Punctuation',
      'Ensures that footnote references are placed after punctuation, not before.',
      RuleType.FOOTNOTE,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
        // regex uses hack to treat lookahead as lookaround https://stackoverflow.com/a/43232659
        // needed to ensure that no footnote text followed by ":" is matched
          return text.replace(/(?!^)(\[\^\w+\]) ?([,.;!:?])/gm, '$2$1');
        });
      },
      [
        new Example(
            'Placing footnotes after punctuation.',
            dedent`
            Lorem[^1]. Ipsum[^2], doletes.
        `,
            dedent`
            Lorem.[^1] Ipsum,[^2] doletes.
        `,
        ),
      ],
  ),
  new Rule(
      'Space between Chinese and English or numbers',
      'Ensures that Chinese and English or numbers are separated by a single space. Follow this [guidelines](https://github.com/sparanoid/chinese-copywriting-guidelines)',
      RuleType.SPACING,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          const head = /([\u4e00-\u9fa5])( *)(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+'"([{¥$]|\*[^*])/gm;
          const tail = /(\[[^[]*\]\(.*\)|`[^`]*`|\w+|[-+;:'"°%)\]}]|[^*]\*)( *)([\u4e00-\u9fa5])/gm;
          return text.replace(head, '$1 $3').replace(tail, '$1 $3');
        });
      },
      [
        new Example(
            'Space between Chinese and English',
            dedent`
        中文字符串english中文字符串。
        `,
            dedent`
        中文字符串 english 中文字符串。
        `,
        ),
        new Example(
            'Space between Chinese and link',
            dedent`
        中文字符串[english](http://example.com)中文字符串。
        `,
            dedent`
        中文字符串 [english](http://example.com) 中文字符串。
        `,
        ),
        new Example(
            'Space between Chinese and inline code block',
            dedent`
        中文字符串\`code\`中文字符串。
        `,
            dedent`
        中文字符串 \`code\` 中文字符串。
        `,
        ),
        // accounts for https://github.com/platers/obsidian-linter/issues/234
        new Example(
            'No space between Chinese and English in tag',
            dedent`
          #标签A #标签2标签
      `,
            dedent`
          #标签A #标签2标签
      `,
        ),
      ],
  ),
  new Rule(
      'Remove Space around Fullwidth Characters',
      'Ensures that fullwidth characters are not followed by whitespace (either single spaces or a tab)',
      RuleType.SPACING,
      (text: string) => {
        return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
          return text.replace(/([ \t])+([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])/g, '$2').replace(/([\u2013\u2014\u2026\u3001\u3002\u300a\u300d-\u300f\u3014\u3015\u3008-\u3011\uff00-\uffff])([ \t])+/g, '$1');
        });
      },
      [
        new Example(
            'Remove Spaces and Tabs around Fullwidth Characrters',
            dedent`
          Full list of affected charaters: ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period\t 。 with text after it.
          This is a fullwidth comma\t，  with text after it.
          This is a fullwidth left parenthesis （ \twith text after it.
          This is a fullwidth right parenthesis ）  with text after it.
          This is a fullwidth colon ：  with text after it.
          This is a fullwidth semicolon ；  with text after it.
            Ｒemoves space at start of line
      `,
            dedent`
          Full list of affected charaters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
          This is a fullwidth period。with text after it.
          This is a fullwidth comma，with text after it.
          This is a fullwidth left parenthesis（with text after it.
          This is a fullwidth right parenthesis）with text after it.
          This is a fullwidth colon：with text after it.
          This is a fullwidth semicolon；with text after it.
          Ｒemoves space at start of line
      `,
        ),
      ],
  ),
  new Rule(
      'Remove link spacing',
      'Removes spacing around link text.',
      RuleType.SPACING,
      (text: string) => {
        text = removeSpacesInLinkText(text);
        return removeSpacesInWikiLinkText(text);
      },
      [
        new Example(
            'Space in regular markdown link text',
            dedent`
      [ here is link text1 ](link_here)
      [ here is link text2](link_here)
      [here is link text3 ](link_here)
      [here is link text4](link_here)
      [\there is link text5\t](link_here)
      [](link_here)
      **Note that image markdown syntax does not get affected even if it is transclusion:**
      ![\there is link text6 ](link_here)
      `,
            dedent`
      [here is link text1](link_here)
      [here is link text2](link_here)
      [here is link text3](link_here)
      [here is link text4](link_here)
      [here is link text5](link_here)
      [](link_here)
      **Note that image markdown syntax does not get affected even if it is transclusion:**
      ![\there is link text6 ](link_here)
      `,
        ),
        new Example(
            'Space in wiki link text',
            dedent`
      [[link_here| here is link text1 ]]
      [[link_here|here is link text2 ]]
      [[link_here| here is link text3]]
      [[link_here|here is link text4]]
      [[link_here|\there is link text5\t]]
      ![[link_here|\there is link text6\t]]
      [[link_here]]
    `,
            dedent`
      [[link_here|here is link text1]]
      [[link_here|here is link text2]]
      [[link_here|here is link text3]]
      [[link_here|here is link text4]]
      [[link_here|here is link text5]]
      ![[link_here|here is link text6]]
      [[link_here]]
    `,
        ),
      ],
  ),
].sort((a, b) => RuleTypeOrder.indexOf(a.type) - RuleTypeOrder.indexOf(b.type));

const _rulesDict = _rules.reduce(
    (dict, rule) => ((dict[rule.alias()] = rule), dict),
  {} as Record<string, Rule>,
);

export default {
  get rules() : Rule[] {
    return _rules;
  },

  get rulesDict() : Record<string, Rule> {
    return _rulesDict;
  }
};

