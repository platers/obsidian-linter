import dedent from 'ts-dedent';
import moment from 'moment';
import {headerRegex, ignoreCodeBlocksAndYAML, initYAML, insert} from './utils';
import {Option, BooleanOption, MomentFormatOption} from './option';

export type Options = { [optionName: string]: any };
type ApplyFunction = (text: string, options?: Options) => string;

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
}

/** Class representing a rule */
export class Rule {
    public name: string;
    public description: string;
    public options: Array<Option>;
    public apply: ApplyFunction;

    public examples: Array<Example>;

    /**
     * Create a rule
     * @param {string} name - The name of the rule
     * @param {string} description - The description of the rule
     * @param {ApplyFunction} apply - The function to apply the rule
     * @param {Array<Example>} examples - The examples to be displayed in the documentation
     * @param {Array<Option>} [options=[]] - The options of the rule to be displayed in the documentation
     */
    constructor(
        name: string,
        description: string,
        apply: ApplyFunction,
        examples: Array<Example>,
        options: Array<Option> = []) {
      this.name = name;
      this.description = description;
      this.apply = apply;
      this.examples = examples;

      options.unshift(new BooleanOption('Enabled', '', false));
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
      const url = 'https://github.com/platers/obsidian-linter/blob/master/docs/rules.md';
      return url + '#' + this.alias();
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
    constructor(description: string, before: string, after: string, options: Options = {}) {
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
      (text: string) => {
        return text.replace(/[ \t]+$/gm, '');
      },
      [
        new Example(
            'Removes trailing spaces and tabs',
            dedent`
        # H1   
        line with trailing spaces and tabs            `, // eslint-disable-line no-tabs
            dedent`
        # H1
        line with trailing spaces and tabs`,
        ),
      ],
  ),
  new Rule(
      'Heading blank lines',
      'All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).',
      (text: string, options = {}) => {
        return ignoreCodeBlocksAndYAML(text, (text) => {
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
      [
        new BooleanOption('Bottom', 'Insert a blank line after headings', true),
      ],
  ),
  new Rule(
      'Paragraph blank lines',
      'All paragraphs should have exactly one blank line both before and after.',
      (text: string) => {
        return ignoreCodeBlocksAndYAML(text, (text) => {
          text = text.replace(/\n+([a-zA-Z].*)/g, '\n\n$1'); // trim blank lines before
          text = text.replace(/(^[a-zA-Z].*)\n+/gm, '$1\n\n'); // trim blank lines after
          text = text.replace(/^\n+([a-zA-Z].*)/, '$1'); // remove blank lines before first line
          return text;
        });
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
      (text: string) => {
        // Space after marker
        text = text.replace(/^(\s*\d+\.|[-+*])[^\S\r\n]+/gm, '$1 ');
        // Space after checkbox
        return text.replace(/^(\s*\d+\.|[-+*]\s+\[[ xX]\])[^\S\r\n]+/gm, '$1 ');
      },
      [
        new Example(
            '',
            dedent`
        1.      Item 1
        2.  Item 2

        -   [ ] Item 1
        - [x]    Item 2
        `,
            dedent`
        1. Item 1
        2. Item 2

        - [ ] Item 1
        - [x] Item 2
        `,
        ),
      ],
  ),
  new Rule(
      'YAML Timestamp',
      'Keep track of the date the file was last edited in the YAML front matter. Gets dates from file metadata.',
      (text: string, options = {}) => {
        text = initYAML(text);

        if (options['Date Created'] === true) {
          text = text.replace(/\ndate created:.*\n/, '\n');
          const yaml_end = text.indexOf('\n---');
          const formatted_date = moment(options['metadata: file created time']).format(options['Format']);
          text = insert(text, yaml_end, `\ndate created: ${formatted_date}`);
        }
        if (options['Date Modified'] === true) {
          text = text.replace(/\ndate modified:.*\n/, '\n');
          text = text.replace(/\ndate updated:.*\n/, '\n'); // for backwards compatibility
          const yaml_end = text.indexOf('\n---');
          const formatted_date = moment(options['metadata: file modified time']).format(options['Format']);
          text = insert(text, yaml_end, `\ndate modified: ${formatted_date}`);
        }
        return text;
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
        date modified: Thursday, January 2nd 2020, 12:00:00 am
        ---
        # H1
        `,
            {
              'metadata: file created time': '2020-01-01T00:00:00-00:00',
              'metadata: file modified time': '2020-01-02T00:00:00-00:00',
            },
        ),
        new Example(
            'dateCreated option is false',
            dedent`
        # H1
        `,
            dedent`
        ---
        date modified: Wednesday, January 1st 2020, 12:00:00 am
        ---
        # H1
        `,
            {
              'Date Created': false,
              'metadata: file created time': '2020-01-01T00:00:00-00:00',
              'metadata: file modified time': '2020-01-01T00:00:00-00:00',
            },
        ),
      ],
      [
        new BooleanOption('Date Created', 'Insert the file creation date', true),
        new BooleanOption('Date Modified', 'Insert the date the file was last modified', true),
        new MomentFormatOption('Format', 'Date format', 'dddd, MMMM Do YYYY, h:mm:ss a'),
      ],
  ),
  new Rule(
      'Compact YAML',
      'Removes leading and trailing blank lines in the YAML front matter.',
      (text: string) => {
        text = text.replace(/^---\n+/, '---\n');
        return text.replace(/\n+---/, '\n---');
      },
      [
        new Example(
            '',
            dedent`
        ---

        date: today

        ---
        `,
            dedent`
        ---
        date: today
        ---
        `,
        ),
      ],
  ),
  new Rule(
      'Header Increment',
      'Heading levels should only increment by one level at a time',
      (text: string) => {
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
          }

          lines[i] = lines[i].replace(headerRegex, `$1${'#'.repeat(level)}$3$4`);
          lastLevel = level;
        }
        return lines.join('\n');
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
      ],
  ),
  new Rule(
      'Consecutive blank lines',
      'There should be at most one consecutive blank line.',
      (text: string) => {
        return text.replace(/\n{2,}/g, '\n\n');
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
      'Capitalize Headings',
      'Headings should be formatted with capitalization',
      (text: string, options = {}) => {
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const match = lines[i].match(headerRegex); // match only headings
          if (!match) {
            continue;
          }
          if (options['Title Case'] == true) {
            const headerWords = lines[i].match(/\S+/g);
            const ignoreNames = ['macOS', 'iOS', 'iPhone', 'iPad', 'JavaScript', 'TypeScript', 'AppleScript'];
            const ignoreAbbreviations = ['CSS', 'HTML', 'YAML', 'PDF', 'USA', 'EU', 'NATO', 'ASCII'];
            const ignoreShortWords = ['via', 'a', 'an', 'the', 'and', 'or', 'but', 'for', 'nor', 'so', 'yet', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'is', 'if', 'it', 'for', 'to', 'with', 'without', 'into', 'onto', 'per'];
            const ignore = [...ignoreAbbreviations, ...ignoreShortWords, ...ignoreNames];
            for (let j = 1; j < headerWords.length; j++) {
              const isWord = headerWords[j].match(/^[A-Za-z'-]+[\.\?!,:;]?$/);
              if (!isWord) {
                continue;
              }

              headerWords[j] = headerWords[j].toLowerCase();
              const ignoreWord = ignore.includes(headerWords[j]);
              if (!ignoreWord || j == 1) { // ignore words that are not capitalized in titles except if they are the first word
                headerWords[j] = headerWords[j][0].toUpperCase() + headerWords[j].slice(1);
              }
            }

            lines[i] = lines[i].replace(headerRegex, `${headerWords.join(' ')}`);
          } else if (options['All Caps'] == true) {
            lines[i] = lines[i].toUpperCase(); // convert full heading to uppercase
          } else {
            lines[i] = lines[i].replace(/^#*\s([a-z])/, (string) => string.toUpperCase()); // capitalize first letter of heading
          }
        }
        return lines.join('\n');
      },
      [
        new Example(
            'The first letter of a heading should be capitalized',
            dedent`
        # this is a heading 1
        ## this is a heading 2
        `,
            dedent`
        # This is a heading 1
        ## This is a heading 2
        `,
        ),
        new Example(
            'With `Title Case=true`',
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
            {'Title Case': true},
        ),
        new Example(
            'With `All Caps=true`',
            dedent`
        # this is a heading 1
        ## this is a heading 2
        `,
            dedent`
        # THIS IS A HEADING 1
        ## THIS IS A HEADING 2
        `,
            {'All Caps': true, 'Title Case': false},
        ),
      ],
      [
        new BooleanOption('Title Case', 'Format headings with title case capitalization', true),
        new BooleanOption('All Caps', 'Format headings with all capitals', false),
      ],
  ),
  new Rule(
      'File Name Heading',
      'Inserts the file name as a H1 heading if no H1 heading exists.',
      (text: string, options = {}) => {
        // check if there is a H1 heading
        const hasH1 = text.match(/^#\s.*/m);
        if (hasH1) {
          return text;
        }

        const fileName = options['metadata: file name'];
        // insert H1 heading after front matter
        let yaml_end = text.indexOf('\n---');
        yaml_end = yaml_end == -1 || !text.startsWith('---\n') ? 0 : yaml_end + 5;
        return insert(text, yaml_end, `# ${fileName}\n`);
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
      'Format Tags in YAML',
      'Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.',
      (text: string) => {
        return text.replace(/^tags: ((?:#\w+(?: |$))+)$/im, function(tagsYAML) {
          return tagsYAML.replaceAll('#', '').replaceAll(' ', ', ').replaceAll(',,', ',').replace('tags:,', 'tags:');
        });
      },
      [
        new Example(
            'Format Tags in YAML frontmatter',
            dedent`
         ---
         tags: #one #two #three
         ---
        `,
            dedent`
         ---
         tags: one, two, three
         ---
        `,
        ),
      ],
  ),
  new Rule(
      'Move Footnotes to the bottom',
      'Move all footnotes to the bottom of the document.',
      (text: string) => {
        const footnotes = text.match(/^\[\^\w+\]: .*$/gm); // collect footnotes
        if (footnotes != null) {
          // remove footnotes that are their own paragraph
          text = text.replace(/\n\n\[\^\w+\]: .*\n\n/gm, '\n\n');

          // remove footnotes directly before/after a line of text
          text = text.replace(/\n?\n\[\^\w+\]: .*\n\n?/gm, '\n');

          // remove footnotes sourrounded by text
          text = text.replace(/\n\[\^\w+\]: .*\n/gm, '');
          text += '\n\n' + footnotes.join('\n'); // append footnotes at the very end of the note
          text = text.replace(/\n*$/, ''); // remove blank lines at the end
        }
        return text;
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
      (text: string) => {
        // re-index footnote-text
        let ft_index = 0;
        text = text.replace(/^\[\^\w+\]: /gm, function() {
          ft_index++;
          return ('[^' + String(ft_index) + ']: ');
        });

        // re-index footnote-keys
        // regex uses hack to treat lookahead as lookaround https://stackoverflow.com/a/43232659
        ft_index = 0;
        text = text.replace(/(?!^)\[\^\w+\]/gm, function() {
          ft_index++;
          return ('[^' + String(ft_index) + ']');
        });
        return text;
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
];

export const rulesDict = rules.reduce((dict, rule) => (dict[rule.alias()] = rule, dict), {} as Record<string, Rule>);
