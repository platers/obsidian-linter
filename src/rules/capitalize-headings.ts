import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {escapeDollarSigns, headerRegex, wordSplitterRegex} from '../utils/regex';

type Style = 'Title Case' | 'ALL CAPS' | 'First letter';

class CapitalizeHeadingsOptions implements Options {
  style?: Style = 'Title Case';
  ignoreWords?: string[] = [
    'macOS',
    'iOS',
    'iPhone',
    'iPad',
    'JavaScript',
    'TypeScript',
    'AppleScript',
  ];
  lowercaseWords?: string[] = [
    'via',
    'a',
    'an',
    'the',
    'and',
    'or',
    'but',
    'for',
    'nor',
    'so',
    'yet',
    'at',
    'by',
    'in',
    'of',
    'on',
    'to',
    'up',
    'as',
    'is',
    'if',
    'it',
    'for',
    'to',
    'with',
    'without',
    'into',
    'onto',
    'per',
  ];
  ignoreCasedWords?: boolean = true;
}

@RuleBuilder.register
export default class CapitalizeHeadings extends RuleBuilder<CapitalizeHeadingsOptions> {
  get OptionsClass(): new () => CapitalizeHeadingsOptions {
    return CapitalizeHeadingsOptions;
  }
  get name(): string {
    return 'Capitalize Headings';
  }
  get description(): string {
    return 'Headings should be formatted with capitalization';
  }
  get type(): RuleType {
    return RuleType.HEADING;
  }
  apply(text: string, options: CapitalizeHeadingsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(headerRegex); // match only headings
        if (!match) {
          continue;
        }
        switch (options.style) {
          case 'Title Case': {
            const headerWords = lines[i].match(/\S+/g);
            // split by comma or whitespace
            const keepCasing = options.ignoreWords;
            const ignoreShortWords = options.lowercaseWords;
            let firstWord = true;
            for (let j = 1; j < headerWords.length; j++) {
              const isWord = headerWords[j].match(/^[\p{L}'-]+[.?!,:;]?$/u);
              if (!isWord) {
                continue;
              }

              const ignoreCasedWord =
                options.ignoreCasedWords &&
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
            // based on https://stackoverflow.com/a/62032796 "/\p{L}/u" accounts for all unicode letters across languages
            lines[i] = lines[i]
                .toLowerCase()
                .replace(/\s+([\p{L}])/u, (lowerCaseMatch: string) => {
                  return lowerCaseMatch.toUpperCase();
                }); // capitalize first letter of heading
            break;
        }
      }
      return lines.join('\n');
    });
  }
  get exampleBuilders(): ExampleBuilder<CapitalizeHeadingsOptions>[] {
    return [
      new ExampleBuilder({
        description: 'With `Title Case=true`, `Ignore Cased Words=false`',
        before: dedent`
          # this is a heading 1
          ## THIS IS A HEADING 2
          ### a heading 3
        `,
        after: dedent`
          # This is a Heading 1
          ## This is a Heading 2
          ### A Heading 3
        `,
        options: {
          style: 'Title Case',
          ignoreCasedWords: false,
        },
      }),
      new ExampleBuilder({
        description: 'With `Title Case=true`, `Ignore Cased Words=true`',
        before: dedent`
          # this is a heading 1
          ## THIS IS A HEADING 2
          ### a hEaDiNg 3
        `,
        after: dedent`
          # This is a Heading 1
          ## THIS IS A HEADING 2
          ### A hEaDiNg 3
        `,
        options: {
          style: 'Title Case',
          ignoreCasedWords: true,
        },
      }),
      new ExampleBuilder({
        description: 'With `First letter=true`',
        before: dedent`
          # this is a heading 1
          ## this is a heading 2
        `,
        after: dedent`
          # This is a heading 1
          ## This is a heading 2
        `,
        options: {
          style: 'First letter',
        },
      }),
      new ExampleBuilder({
        description: 'With `ALL CAPS=true`',
        before: dedent`
          # this is a heading 1
          ## this is a heading 2
        `,
        after: dedent`
          # THIS IS A HEADING 1
          ## THIS IS A HEADING 2
        `,
        options: {
          style: 'ALL CAPS',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<CapitalizeHeadingsOptions>[] {
    return [
      new DropdownOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        name: 'Style',
        description: 'The style of capitalization to use',
        optionsKey: 'style',
        records: [
          {
            value: 'Title Case',
            description: 'Capitalize Using Title Case Rules',
          },
          {
            value: 'ALL CAPS',
            description: 'CAPITALIZE THE WHOLE TITLE',
          },
          {
            value: 'First letter',
            description: 'Only capitalize the first letter',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        name: 'Ignore Cased Words',
        description: 'Only apply title case style to words that are all lowercase',
        optionsKey: 'ignoreCasedWords',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        name: 'Ignore Words',
        description: 'A comma separated list of words to ignore when capitalizing',
        optionsKey: 'ignoreWords',
        splitter: wordSplitterRegex,
        separator: ', ',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        name: 'Lowercase Words',
        description: 'A comma separated list of words to keep lowercase',
        optionsKey: 'lowercaseWords',
        splitter: wordSplitterRegex,
        separator: ', ',
      }),
    ];
  }
}
