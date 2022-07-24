import dedent from 'ts-dedent';
import {
  insert,
} from './utils/strings';
import {
  loadYAML,
  setYamlSection,
  getYamlSectionValue,
  removeYamlSection,
} from './utils/yaml';
import {
  Option,
  BooleanOption,
  DropdownOption,
  DropdownRecord,
  TextAreaOption,
} from './option';
import {ignoreListOfTypes, IgnoreTypes} from './utils/ignore-types';
import {moveFootnotesToEnd, removeSpacesInLinkText} from './utils/mdast';
import {yamlRegex, escapeDollarSigns, headerRegex, removeSpacesInWikiLinkText} from './utils/regex';

export type Options = { [optionName: string]: any };
type ApplyFunction = (text: string, options?: Options) => string;

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
  displayChanged: boolean;
  foldersToIgnore: string[];
  linterLocale: string;
  logLevel: number;
}
/* eslint-disable no-unused-vars */
export enum RuleType {
  YAML = 'YAML',
  HEADING = 'Heading',
  FOOTNOTE = 'Footnote',
  CONTENT = 'Content',
  SPACING = 'Spacing',
}
/* eslint-enable no-unused-vars */

/** Class representing a rule */
export class Rule {
  public name: string;
  public description: string;
  public type: RuleType;
  public options: Array<Option>;
  public apply: ApplyFunction;

  public examples: Array<Example>;

  /**
   * Create a rule
   * @param {string} name - The name of the rule
   * @param {string} description - The description of the rule
   * @param {RuleType} type - The type of the rule
   * @param {ApplyFunction} apply - The function to apply the rule
   * @param {Array<Example>} examples - The examples to be displayed in the documentation
   * @param {Array<Option>} [options=[]] - The options of the rule to be displayed in the documentation
   */
  constructor(
      name: string,
      description: string,
      type: RuleType,
      apply: ApplyFunction,
      examples: Array<Example>,
      options: Array<Option> = [],
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.apply = apply;
    this.examples = examples;

    options.unshift(new BooleanOption(this.description, '', false));
    for (const option of options) {
      option.ruleName = name;
    }
    this.options = options;
  }

  public alias(): string {
    return this.name.replace(/ /g, '-').toLowerCase();
  }

  public getDefaultOptions() {
    const options: { [optionName: string]: any } = {};

    for (const option of this.options) {
      options[option.name] = option.defaultValue;
    }

    return options;
  }

  public getOptions(settings: LinterSettings) {
    return settings.ruleConfigs[this.name];
  }

  public getURL(): string {
    const url =
      'https://github.com/platers/obsidian-linter/blob/master/docs/rules.md';
    return url + '#' + this.alias();
  }

  public enabledOptionName(): string {
    return this.options[0].name;
  }
}

/** Class representing an example of a rule */
export class Example {
  public description: string;
  public options: Options;

  public before: string;
  public after: string;

  /**
   * Create an example
   * @param {string} description - The description of the example
   * @param {string} before - The text before the rule is applied
   * @param {string} after - The text after the rule is applied
   * @param {object} options - The options of the example
   */
  constructor(
      description: string,
      before: string,
      after: string,
      options: Options = {},
  ) {
    this.description = description;
    this.options = options;
    this.before = before;
    this.after = after;
  }
}

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
    return rules.map((rule) => rule.alias());
  }

  return disabled_rules;
}

export const rules: Rule[] = [
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
];

export const rulesDict = rules.reduce(
    (dict, rule) => ((dict[rule.alias()] = rule), dict),
  {} as Record<string, Rule>,
);

export function registerRule(rule: Rule): void {
  rules.push(rule);
  rules.sort((a, b) => (RuleTypeOrder.indexOf(a.type) - RuleTypeOrder.indexOf(b.type)) || (a.name.localeCompare(b.name)));
  rulesDict[rule.alias()] = rule;
}
