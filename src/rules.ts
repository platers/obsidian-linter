import dedent from 'ts-dedent';
import moment from 'moment';
import {
  escapeDollarSigns,
  formatYAML,
  headerRegex,
  ignoreCodeBlocksYAMLTagsAndLinks,
  initYAML,
  insert,
  loadYAML,
  moveFootnotesToEnd,
  yamlRegex,
  escapeYamlString,
  makeEmphasisOrBoldConsistent,
  addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent,
  makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs,
  removeSpacesInLinkText,
} from './utils';
import {
  Option,
  BooleanOption,
  MomentFormatOption,
  TextOption,
  DropdownOption,
  DropdownRecord,
  TextAreaOption,
} from './option';

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
enum RuleType {
  YAML = 'YAML',
  HEADING = 'Heading',
  FOOTNOTE = 'Footnote',
  CONTENT = 'Content',
  SPACING = 'Spacing',
}
/* eslint-enable no-unused-vars */

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

export const rules: Rule[] = [
  new Rule(
      'Trailing spaces',
      'Removes extra spaces after every line.',
      RuleType.SPACING,
      (text: string, options = {}) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          if (options['Two Space Linebreak'] === false) {
            return text.replace(/[ \t]+$/gm, '');
          } else {
            text = text.replace(/(\S)[ \t]$/gm, '$1'); // one whitespace
            text = text.replace(/(\S)[ \t]{3,}$/gm, '$1'); // three or more whitespaces
            text = text.replace(/(\S)( ?\t\t? ?)$/gm, '$1'); // two whitespaces with at least one tab
            return text;
          }
        });
      },
      [
        new Example(
            'Removes trailing spaces and tabs.',
            dedent`
        # H1   
        Line with trailing spaces and tabs.	        `, // eslint-disable-line no-tabs
            dedent`
        # H1
        Line with trailing spaces and tabs.`,
        ),
        new Example(
            'With `Two Space Linebreak = true`',
            dedent`
        # H1
        Line with trailing spaces and tabs.  `,
            dedent`
        # H1
        Line with trailing spaces and tabs.  `,
            {'Two Space Linebreak': true},
        ),
      ],
      [
        new BooleanOption(
            'Two Space Linebreak',
            'Ignore two spaces followed by a line break ("Two Space Rule").',
            false,
        ),
      ],
  ),
  new Rule(
      'Heading blank lines',
      'All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).',
      RuleType.SPACING,
      (text: string, options = {}) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          if (options['Bottom'] === false) {
            text = text.replace(/(^#+\s.*)\n+/gm, '$1\n'); // trim blank lines after headings
            text = text.replace(/\n+(#+\s.*)/g, '\n\n$1'); // trim blank lines before headings
          } else {
            text = text.replace(/^(#+\s.*)/gm, '\n\n$1\n\n'); // add blank line before and after headings
            text = text.replace(/\n+(#+\s.*)/g, '\n\n$1'); // trim blank lines before headings
            text = text.replace(/(^#+\s.*)\n+/gm, '$1\n\n'); // trim blank lines after headings
          }
          text = text.replace(/^\n+(#+\s.*)/, '$1'); // remove blank lines before first heading
          text = text.replace(/(#+\s.*)\n+$/, '$1'); // remove blank lines after last heading
          return text;
        });
      },
      [
        new Example(
            'Headings should be surrounded by blank lines',
            dedent`
        # H1
        ## H2


        # H1
        line
        ## H2

        `,
            dedent`
        # H1

        ## H2

        # H1

        line

        ## H2
        `,
        ),
        new Example(
            'With `Bottom=false`',
            dedent`
        # H1
        line
        ## H2
        # H1
        line
        `,
            dedent`
        # H1
        line

        ## H2

        # H1
        line
        `,
            {Bottom: false},
        ),
      ],
      [new BooleanOption('Bottom', 'Insert a blank line after headings', true)],
  ),
  new Rule(
      'Paragraph blank lines',
      'All paragraphs should have exactly one blank line both before and after.',
      RuleType.SPACING,
      (text: string) => {
        return makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs(text);
      },
      [
        new Example(
            'Paragraphs should be surrounded by blank lines',
            dedent`
      # H1
      Newlines are inserted.
      A paragraph is a line that starts with a letter.
      `,
            dedent`
      # H1

      Newlines are inserted.

      A paragraph is a line that starts with a letter.
      `,
        ),
      ],
  ),
  new Rule(
      `Space after list markers`,
      'There should be a single space after list markers and checkboxes.',
      RuleType.SPACING,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
        // Space after marker
          text = text.replace(/^(\s*\d+\.|\s*[-+*])[^\S\r\n]+/gm, '$1 ');
          // Space after checkbox
          return text.replace(
              /^(\s*\d+\.|\s*[-+*]\s+\[[ xX]\])[^\S\r\n]+/gm,
              '$1 ',
          );
        });
      },
      [
        new Example(
            '',
            dedent`
        1.   Item 1
        2.  Item 2

        -   [ ] Item 1
        - [x]    Item 2
        \t-  [ ] Item 3
        `,
            dedent`
        1. Item 1
        2. Item 2

        - [ ] Item 1
        - [x] Item 2
        \t- [ ] Item 3
        `,
        ),
      ],
  ),
  new Rule(
      `Remove Empty Lines Between List Markers and Checklists`,
      'There should not be any empty lines between list markers and checklists.',
      RuleType.SPACING,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          const replaceEmptyLinesBetweenList = function(text: string, listRegex: RegExp, replaceWith: string): string {
            let match;
            let newText = text;

            do {
              match = newText.match(listRegex);
              newText = newText.replaceAll(listRegex, replaceWith);
            } while (match);

            return newText;
          };

          /* eslint-disable no-useless-escape */
          // account for '- [x]' and  '- [ ]' checkbox markers
          const checkboxMarker = new RegExp(/^(( |\t)*- \[( |x)\].+)\n{2,}(( |\t)*- \[( |x)\].+)$/gm);
          text = replaceEmptyLinesBetweenList(text, checkboxMarker, '$1\n$4');

          // account for ordered list marker
          const orderedMarker = new RegExp(/^(( |\t)*\d+\..+)\n{2,}(( |\t)*\d+\..+)$/gm);
          text = replaceEmptyLinesBetweenList(text, orderedMarker, '$1\n$3');

          // account for '+' list marker
          const plusMarker = new RegExp(/^(( |\t)*\+.+)\n{2,}(( |\t)*\+.+)$/gm);
          text = replaceEmptyLinesBetweenList(text, plusMarker, '$1\n$3');

          // account for '-' list marker
          const dashMarker = new RegExp(/^(( |\t)*-(?! \[( |x)\]).+)\n{2,}(( |\t)*-(?! \[( |x)\]).+)$/gm);
          text = replaceEmptyLinesBetweenList(text, dashMarker, '$1\n$4');

          // account for '*' list marker
          const splatMarker = new RegExp(/^(( |\t)*\*.+)\n{2,}(( |\t)*\*.+)$/gm);
          return replaceEmptyLinesBetweenList(text, splatMarker, '$1\n$3');
          /* eslint-enable no-useless-escape */
        });
      },
      [
        new Example(
            '',
            dedent`
      1. Item 1

      2. Item 2

      - Item 1

      \t- Subitem 1

      - Item 2

      - [x] Item 1

      \t- [ ] Subitem 1

      - [ ] Item 2

      + Item 1
      
      \t+ Subitem 1

      + Item 2

      * Item 1

      \t* Subitem 1

      * Item 2
      `,
            dedent`
      1. Item 1
      2. Item 2

      - Item 1
      \t- Subitem 1
      - Item 2

      - [x] Item 1
      \t- [ ] Subitem 1
      - [ ] Item 2

      + Item 1
      \t+ Subitem 1
      + Item 2

      * Item 1
      \t* Subitem 1
      * Item 2
      `,
        ),
      ],
  ),
  new Rule(
      'Compact YAML',
      'Removes leading and trailing blank lines in the YAML front matter.',
      RuleType.SPACING,
      (text: string, options = {}) => {
        return formatYAML(text, (text) => {
          text = text.replace(/^---\n+/, '---\n');
          text = text.replace(/\n+---/, '\n---');
          if (options['Inner New Lines']) {
            text = text.replaceAll(/\n{2,}/g, '\n');
          }

          return text;
        });
      },
      [
        new Example(
            'Remove blank lines at the start and end of the YAML',
            dedent`
        ---

        date: today

        title: unchanged without inner new lines turned on

        ---
        `,
            dedent`
        ---
        date: today

        title: unchanged without inner new lines turned on
        ---
        `,
        ),
        new Example(
            'Remove blank lines anywhere in YAML with inner new lines set to true',
            dedent`
      ---

      date: today


      title: remove inner new lines

      ---

      # Header 1


      Body content here.
      `,
            dedent`
      ---
      date: today
      title: remove inner new lines
      ---

      # Header 1


      Body content here.
      `,
            {'Inner New Lines': true},
        ),
      ],
      [
        new BooleanOption(
            'Inner New Lines',
            'Remove new lines that are not at the start or the end of the YAML',
            false,
        ),
      ],
  ),
  new Rule(
      'Consecutive blank lines',
      'There should be at most one consecutive blank line.',
      RuleType.SPACING,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return text.replace(/\n{2,}/g, '\n\n');
        });
      },
      [
        new Example(
            '',
            dedent`
        Some text


        Some more text
        `,
            dedent`
        Some text

        Some more text
        `,
        ),
      ],
  ),
  new Rule(
      'Convert Spaces to Tabs',
      'Converts leading spaces to tabs.',
      RuleType.SPACING,
      (text: string, options = {}) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          const tabsize = String(options['Tabsize']);
          const tabsize_regex = new RegExp(
              '^(\t*) {' + String(tabsize) + '}',
              'gm',
          );

          while (text.match(tabsize_regex) != null) {
            text = text.replace(tabsize_regex, '$1\t');
          }
          return text;
        });
      },
      /* eslint-disable no-mixed-spaces-and-tabs, no-tabs */
      [
        new Example(
            'Converting spaces to tabs with `tabsize = 3`',
            dedent`
          - text with no indention
             - text indented with 3 spaces
          - text with no indention
                - text indented with 6 spaces
      `,
            dedent`
          - text with no indention
          \t- text indented with 3 spaces
          - text with no indention
          \t\t- text indented with 6 spaces
      `,
            {Tabsize: '3'},
        ),
      ],
      /* eslint-enable no-mixed-spaces-and-tabs, no-tabs */
      [
        new TextOption(
            'Tabsize',
            'Number of spaces that will be converted to a tab',
            '4',
        ),
      ],
  ),
  new Rule(
      'Line Break at Document End',
      'Ensures that there is exactly one line break at the end of a document.',
      RuleType.SPACING,
      (text: string) => {
        text = text.replace(/\n+$/g, '');
        text += '\n';
        return text;
      },
      [
        new Example(
            'Appending a line break to the end of the document.',
            dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      `,
            dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      `,
        ),
        new Example(
            'Removing trailing line breaks to the end of the document, except one.',
            dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.


          
      `,
            dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

      `,
        ),
      ],
  ),

  // Content rules

  new Rule(
      'Remove Multiple Spaces',
      'Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. ',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return text.replace(/([^\s])( ){2,}([^\s])/g, '$1 $3');
        });
      },
      [
        new Example(
            'Removing double and triple space.',
            dedent`
          Lorem ipsum   dolor  sit amet.
      `,
            dedent`
          Lorem ipsum dolor sit amet.
      `,
        ),
      ],
  ),
  new Rule(
      'Remove Hyphenated Line Breaks',
      'Removes hyphenated line breaks. Useful when pasting text from textbooks.',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return text.replace(/\b[-‐] \b/g, '');
        });
      },
      [
        new Example(
            'Removing hyphenated line breaks.',
            dedent`
            This text has a linebr‐ eak.
            `,
            dedent`
            This text has a linebreak.
            `,
        ),
      ],
  ),
  new Rule(
      'Remove Consecutive List Markers',
      'Removes consecutive list markers. Useful when copy-pasting list items.',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return text.replace(/^([ |\t]*)- - \b/gm, '$1- ');
        });
      },
      [
        new Example(
            'Removing consecutive list markers.',
            dedent`
            - item 1
            - - copypasted item A
            - item 2
              - indented item
              - - copypasted item B
            `,
            dedent`
            - item 1
            - copypasted item A
            - item 2
              - indented item
              - copypasted item B
            `,
        ),
      ],
  ),
  new Rule(
      'Remove Empty List Markers',
      'Removes empty list markers, i.e. list items without content.',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return text.replace(/^\s*-\s*\n/gm, '');
        });
      },
      [
        new Example(
            'Removes empty list markers.',
            dedent`
            - item 1
            -
            - item 2
            `,
            dedent`
            - item 1
            - item 2
            `,
        ),
      ],
  ),
  new Rule(
      'Convert Bullet List Markers',
      'Converts common bullet list marker symbols to markdown list markers.',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
        // Convert [•, §] to - if it's the first non space character on the line
          return text.replace(/^([^\S\n]*)([•§])([^\S\n]*)/gm, '$1-$3');
        });
      },
      [
        new Example(
            'Converts •',
            dedent`
            • item 1
            • item 2
            `,
            dedent`
            - item 1
            - item 2
            `,
        ),
        new Example(
            'Converts §',
            dedent`
            • item 1
              § item 2
              § item 3
              `,
            dedent`
            - item 1
              - item 2
              - item 3
              `,
        ),
      ],
  ),
  new Rule(
      'Proper Ellipsis',
      'Replaces three consecutive dots with an ellipsis.',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return text.replaceAll('...', '…');
        });
      },
      [
        new Example(
            'Replacing three consecutive dots with an ellipsis.',
            dedent`
            Lorem (...) Impsum.
            `,
            dedent`
            Lorem (…) Impsum.
            `,
        ),
      ],
  ),
  new Rule(
      'Emphasis Style',
      'Makes sure the emphasis style is consistent.',
      RuleType.CONTENT,
      (text: string, options = {}) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return makeEmphasisOrBoldConsistent(text, options['Style'], 'emphasis');
        });
      },
      [
        new Example(
            'Emphasis indicators should use underscores when style is set to \'underscore\'',
            dedent`
          # Emphasis Cases
          
          *Test emphasis*
          * Test not emphasized *
          This is *emphasized* mid sentence
          This is *emphasized* mid sentence with a second *emphasis* on the same line
          This is ***bold and emphasized***
          This is ***nested bold** and ending emphasized*
          This is ***nested emphasis* and ending bold**
          
          **Test bold**

          * List Item1 with *emphasized text*
          * List Item2
    `,
            dedent`
          # Emphasis Cases
          
          _Test emphasis_
          * Test not emphasized *
          This is _emphasized_ mid sentence
          This is _emphasized_ mid sentence with a second _emphasis_ on the same line
          This is _**bold and emphasized**_
          This is _**nested bold** and ending emphasized_
          This is **_nested emphasis_ and ending bold**
          
          **Test bold**

          * List Item1 with _emphasized text_
          * List Item2
    `,
            {'Style': 'underscore'},
        ),
        new Example(
            'Emphasis indicators should use asterisks when style is set to \'asterisk\'',
            dedent`
          # Emphasis Cases
          
          _Test emphasis_
          _ Test not emphasized _
          This is _emphasized_ mid sentence
          This is _emphasized_ mid sentence with a second _emphasis_ on the same line
          This is ___bold and emphasized___
          This is ___nested bold__ and ending emphasized_
          This is ___nested emphasis_ and ending bold__
          
          __Test bold__
  `,
            dedent`
          # Emphasis Cases

          *Test emphasis*
          _ Test not emphasized _
          This is *emphasized* mid sentence
          This is *emphasized* mid sentence with a second *emphasis* on the same line
          This is *__bold and emphasized__*
          This is *__nested bold__ and ending emphasized*
          This is __*nested emphasis* and ending bold__
          
          __Test bold__
  `,
            {'Style': 'asterisk'},
        ),
        new Example(
            'Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to \'consistent\'',
            dedent`
        # Emphasis First Emphasis Is an Asterisk

        *First emphasis*
        This is _emphasized_ mid sentence
        This is *emphasized* mid sentence with a second _emphasis_ on the same line
        This is *__bold and emphasized__*
        This is *__nested bold__ and ending emphasized*
        This is **_nested emphasis_ and ending bold**
        
        __Test bold__
`,
            dedent`
        # Emphasis First Emphasis Is an Asterisk

        *First emphasis*
        This is *emphasized* mid sentence
        This is *emphasized* mid sentence with a second *emphasis* on the same line
        This is *__bold and emphasized__*
        This is *__nested bold__ and ending emphasized*
        This is ***nested emphasis* and ending bold**
        
        __Test bold__
`,
            {'Style': 'consistent'},
        ),
        new Example(
            'Emphasis indicators should use consistent style based on first emphasis indicator in a file when style is set to \'consistent\'',
            dedent`
      # Emphasis First Emphasis Is an Underscore

      **_First emphasis_**
      This is _emphasized_ mid sentence
      This is *emphasized* mid sentence with a second _emphasis_ on the same line
      This is *__bold and emphasized__*
      This is _**nested bold** and ending emphasized_
      This is __*nested emphasis* and ending bold__
      
      __Test bold__
`,
            dedent`
      # Emphasis First Emphasis Is an Underscore

      **_First emphasis_**
      This is _emphasized_ mid sentence
      This is _emphasized_ mid sentence with a second _emphasis_ on the same line
      This is ___bold and emphasized___
      This is _**nested bold** and ending emphasized_
      This is ___nested emphasis_ and ending bold__
      
      __Test bold__
`,
            {'Style': 'consistent'},
        ),
      ],
      [
        new DropdownOption(
            'Style',
            'The style used to denote emphasized content',
            'consistent',
            [
              new DropdownRecord(
                  'consistent',
                  'Makes sure the first instance of emphasis is the style that will be used throughout the document',
              ),
              new DropdownRecord(
                  'asterisk',
                  'Makes sure * is the emphasis indicator',
              ),
              new DropdownRecord(
                  'underscore',
                  'Makes sure _ is the emphasis indicator',
              ),
            ],
        ),
      ],
  ),
  new Rule(
      'Strong Style',
      'Makes sure the strong style is consistent.',
      RuleType.CONTENT,
      (text: string, options = {}) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          return makeEmphasisOrBoldConsistent(text, options['Style'], 'strong');
        });
      },
      [
        new Example(
            'Strong indicators should use underscores when style is set to \'underscore\'',
            dedent`
          # Strong/Bold Cases
          
          **Test bold**
          ** Test not bold **
          This is **bold** mid sentence
          This is **bold** mid sentence with a second **bold** on the same line
          This is ***bold and emphasized***
          This is ***nested bold** and ending emphasized*
          This is ***nested emphasis* and ending bold**
          
          *Test emphasis*

          * List Item1 with **bold text**
          * List Item2
          `,
            dedent`
          # Strong/Bold Cases
          
          __Test bold__
          ** Test not bold **
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second __bold__ on the same line
          This is *__bold and emphasized__*
          This is *__nested bold__ and ending emphasized*
          This is __*nested emphasis* and ending bold__
          
          *Test emphasis*

          * List Item1 with __bold text__
          * List Item2
          `,
            {'Style': 'underscore'},
        ),
        new Example(
            'Strong indicators should use asterisks when style is set to \'asterisk\'',
            dedent`
          # Strong/Bold Cases
          
          __Test bold__
          __ Test not bold __
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second __bold__ on the same line
          This is ___bold and emphasized___
          This is ___nested bold__ and ending emphasized_
          This is ___nested emphasis_ and ending bold__
          
          _Test emphasis_
          `,
            dedent`
          # Strong/Bold Cases
          
          **Test bold**
          __ Test not bold __
          This is **bold** mid sentence
          This is **bold** mid sentence with a second **bold** on the same line
          This is _**bold and emphasized**_
          This is _**nested bold** and ending emphasized_
          This is **_nested emphasis_ and ending bold**

          _Test emphasis_
          `,
            {'Style': 'asterisk'},
        ),
        new Example(
            'Strong indicators should use consistent style based on first strong indicator in a file when style is set to \'consistent\'',
            dedent`
          # Strong First Strong Is an Asterisk

          **First bold**
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second **bold** on the same line
          This is ___bold and emphasized___
          This is *__nested bold__ and ending emphasized*
          This is **_nested emphasis_ and ending bold**

          __Test bold__
          `,
            dedent`
          # Strong First Strong Is an Asterisk

          **First bold**
          This is **bold** mid sentence
          This is **bold** mid sentence with a second **bold** on the same line
          This is _**bold and emphasized**_
          This is ***nested bold** and ending emphasized*
          This is **_nested emphasis_ and ending bold**

          **Test bold**
          `,
            {'Style': 'consistent'},
        ),
        new Example(
            'Strong indicators should use consistent style based on first strong indicator in a file when style is set to \'consistent\'',
            dedent`
          # Strong First Strong Is an Underscore

          __First bold__
          This is **bold** mid sentence
          This is **bold** mid sentence with a second __bold__ on the same line
          This is **_bold and emphasized_**
          This is ***nested bold** and ending emphasized*
          This is ___nested emphasis_ and ending bold__

          **Test bold**
          `,
            dedent`
          # Strong First Strong Is an Underscore

          __First bold__
          This is __bold__ mid sentence
          This is __bold__ mid sentence with a second __bold__ on the same line
          This is ___bold and emphasized___
          This is *__nested bold__ and ending emphasized*
          This is ___nested emphasis_ and ending bold__

          __Test bold__
            `,
            {'Style': 'consistent'},
        ),
      ],
      [
        new DropdownOption(
            'Style',
            'The style used to denote strong/bolded content',
            'consistent',
            [
              new DropdownRecord(
                  'consistent',
                  'Makes sure the first instance of strong is the style that will be used throughout the document',
              ),
              new DropdownRecord(
                  'asterisk',
                  'Makes sure ** is the strong indicator',
              ),
              new DropdownRecord(
                  'underscore',
                  'Makes sure __ is the strong indicator',
              ),
            ],
        ),
      ],
  ),
  new Rule(
      'No Bare URLs',
      'Encloses bare URLs with angle brackets except when enclosed in back ticks, square braces, or single or double quotes.',
      RuleType.CONTENT,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          const URLMatches = text.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s`\]'">]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s`\]'">]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s`\]'">]{2,}|www\.[a-zA-Z0-9]+\.[^\s`\]'">]{2,})/gi);

          if (!URLMatches) {
            return text;
          }

          // make sure you do not match on the same thing more than once by keeping track of the last position you checked up to
          let startSearch = 0;
          const numMatches = URLMatches.length;
          for (let i = 0; i < numMatches; i++) {
            const urlMatch = URLMatches[i];
            const urlStart = text.indexOf(urlMatch, startSearch);
            const urlEnd = urlStart + urlMatch.length;

            const previousChar = urlStart === 0 ? undefined : text.charAt(urlStart - 1);
            const nextChar = urlEnd >= text.length ? undefined : text.charAt(urlEnd);
            if (previousChar != undefined && (previousChar === '`' || previousChar === '"' || previousChar === '\'' || previousChar === '[' || previousChar === '<') &&
              nextChar != undefined && (nextChar === '`' || nextChar === '"' || nextChar === '\'' || nextChar === ']' || nextChar === '>')) {
              startSearch = urlStart + urlMatch.length;
              continue;
            }

            text = text.substring(0, urlStart) + '<' + urlMatch + '>' + text.substring(urlStart + urlMatch.length);
            startSearch = urlStart + urlMatch.length + 2;
          }

          return text;
        });
      },
      [
        new Example(
            'Make sure that links are inside of angle brackets when not in single quotes(\'), double quotes("), or backticks(`)',
            dedent`
          https://github.com
          braces around url should stay the same: [https://github.com]
          backticks around url should stay the same: \`https://github.com\`
          Links mid-sentence should be updated like https://google.com will be.
          'https://github.com'
          "https://github.com"
          <https://github.com>
          links should stay the same: [](https://github.com)
          https://gitlab.com
          `,
            dedent`
          <https://github.com>
          braces around url should stay the same: [https://github.com]
          backticks around url should stay the same: \`https://github.com\`
          Links mid-sentence should be updated like <https://google.com> will be.
          'https://github.com'
          "https://github.com"
          <https://github.com>
          links should stay the same: [](https://github.com)
          <https://gitlab.com>
          `,
        ),
        new Example(
            'Angle brackets are added if the url is not the only text in the single quotes(\'), double quotes("), or backticks(`)',
            dedent`
        [https://github.com some text here]
        backticks around a url should stay the same, but only if the only contents of the backticks: \`https://github.com some text here\`
        single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
        double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
        `,
            dedent`
          [<https://github.com> some text here]
          backticks around a url should stay the same, but only if the only contents of the backticks: \`<https://github.com> some text here\`
          single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
          double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
        `,
        ),
      ],
  ),
  new Rule(
      'Two Spaces Between Lines with Content',
      'Makes sure that two spaces are added to the ends of lines with content continued on the next line for paragraphs, blockquotes, and list items',
      RuleType.CONTENT,
      (text: string) => {
        return addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent(text);
      },
      [
        new Example(
            'Make sure two spaces are added to the ends of lines that have content on it and the next line for lists, blockquotes, and paragraphs',
            dedent`
            # Heading 1
            First paragraph stays as the first paragraph

            - list item 1
            - list item 2
            Continuation of list item 2
            - list item 3

            1. Item 1
            2. Item 2
            Continuation of item 3
            3. Item 3

            Paragraph for with link [[other file name]].
            Continuation *of* the paragraph has \`inline code block\` __in it__.
            Even more continuation

            Paragraph lines that end in <br/>
            Or lines that end in <br>
            Are left alone
            Since they mean the same thing

            \`\`\` text
            Code blocks are ignored
            Even with multiple lines
            \`\`\`
            Another paragraph here

            > Blockquotes are affected
            > More content here
            Content here

            <div>
            html content
            should be ignored
            </div>
            Even more content here

        `,
            dedent`
            # Heading 1
            First paragraph stays as the first paragraph

            - list item 1
            - list item 2  
            Continuation of list item 2
            - list item 3

            1. Item 1
            2. Item 2  
            Continuation of item 3
            3. Item 3

            Paragraph for with link [[other file name]].  
            Continuation *of* the paragraph has \`inline code block\` __in it__.  
            Even more continuation

            Paragraph lines that end in <br/>
            Or lines that end in <br>
            Are left alone  
            Since they mean the same thing

            \`\`\` text
            Code blocks are ignored
            Even with multiple lines
            \`\`\`
            Another paragraph here

            > Blockquotes are affected  
            > More content here  
            Content here

            <div>
            html content
            should be ignored
            </div>
            Even more content here

        `,
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
        let title = ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
          const result = text.match(/^#\s+(.*)/m);
          if (result) {
            return result[1];
          }
          return '';
        });
        title = title || options['metadata: file name'];

        title = escapeYamlString(title);

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

  // Heading rules

  new Rule(
      'Header Increment',
      'Heading levels should only increment by one level at a time',
      RuleType.HEADING,
      (text: string) => {
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
        return ignoreCodeBlocksYAMLTagsAndLinks(text, (text) => {
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
      'Remove link spacing',
      'Removes spacing around link text.',
      RuleType.SPACING,
      (text: string) => {
        return removeSpacesInLinkText(text);
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

export const rulesDict = rules.reduce(
    (dict, rule) => ((dict[rule.alias()] = rule), dict),
  {} as Record<string, Rule>,
);
