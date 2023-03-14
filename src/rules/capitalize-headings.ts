import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex, wordSplitterRegex} from '../utils/regex';

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
    'I',
  ];
  lowercaseWords?: string[] = [
    'a',
    'an',
    'the',
    'aboard',
    'about',
    'abt.',
    'above',
    'abreast',
    'absent',
    'across',
    'after',
    'against',
    'along',
    'aloft',
    'alongside',
    'amid',
    'amidst',
    'mid',
    'midst',
    'among',
    'amongst',
    'anti',
    'apropos',
    'around',
    'round',
    'as',
    'aslant',
    'astride',
    'at',
    'atop',
    'ontop',
    'bar',
    'barring',
    'before',
    'B4',
    'behind',
    'below',
    'beneath',
    'neath',
    'beside',
    'besides',
    'between',
    '\'tween',
    'beyond',
    'but',
    'by',
    'chez',
    'circa',
    'c.',
    'ca.',
    'come',
    'concerning',
    'contra',
    'counting',
    'cum',
    'despite',
    'spite',
    'down',
    'during',
    'effective',
    'ere',
    'except',
    'excepting',
    'excluding',
    'failing',
    'following',
    'for',
    'from',
    'in',
    'including',
    'inside',
    'into',
    'less',
    'like',
    'minus',
    'modulo',
    'mod',
    'near',
    'nearer',
    'nearest',
    'next',
    'notwithstanding',
    'of',
    'o\'',
    'off',
    'offshore',
    'on',
    'onto',
    'opposite',
    'out',
    'outside',
    'over',
    'o\'er',
    'pace',
    'past',
    'pending',
    'per',
    'plus',
    'post',
    'pre',
    'pro',
    'qua',
    're',
    'regarding',
    'respecting',
    'sans',
    'save',
    'saving',
    'short',
    'since',
    'sub',
    'than',
    'through',
    'thru',
    'throughout',
    'thruout',
    'till',
    'times',
    'to',
    't\'',
    'touching',
    'toward',
    'towards',
    'under',
    'underneath',
    'unlike',
    'until',
    'unto',
    'up',
    'upon',
    'versus',
    'vs.',
    'v.',
    'via',
    'vice',
    'vis-à-vis',
    'wanting',
    'with',
    'w/',
    'w.',
    'c̄',
    'within',
    'w/i',
    'without',
    '\'thout',
    'w/o',
    'abroad',
    'adrift',
    'aft',
    'afterward',
    'afterwards',
    'ahead',
    'apart',
    'ashore',
    'aside',
    'away',
    'back',
    'backward',
    'backwards',
    'beforehand',
    'downhill',
    'downstage',
    'downstairs',
    'downstream',
    'downward',
    'downwards',
    'downwind',
    'east',
    'eastward',
    'eastwards',
    'forth',
    'forward',
    'forwards',
    'heavenward',
    'heavenwards',
    'hence',
    'henceforth',
    'here',
    'hereby',
    'herein',
    'hereof',
    'hereto',
    'herewith',
    'home',
    'homeward',
    'homewards',
    'indoors',
    'inward',
    'inwards',
    'leftward',
    'leftwards',
    'north',
    'northeast',
    'northward',
    'northwards',
    'northwest',
    'now',
    'onward',
    'onwards',
    'outdoors',
    'outward',
    'outwards',
    'overboard',
    'overhead',
    'overland',
    'overseas',
    'rightward',
    'rightwards',
    'seaward',
    'seawards',
    'skywards',
    'skyward',
    'south',
    'southeast',
    'southwards',
    'southward',
    'southwest',
    'then',
    'thence',
    'thenceforth',
    'there',
    'thereby',
    'therein',
    'thereof',
    'thereto',
    'therewith',
    'together',
    'underfoot',
    'underground',
    'uphill',
    'upstage',
    'upstairs',
    'upstream',
    'upward',
    'upwards',
    'upwind',
    'west',
    'westward',
    'westwards',
    'when',
    'whence',
    'where',
    'whereby',
    'wherein',
    'whereto',
    'wherewith',
    'although',
    'because',
    'considering',
    'given',
    'granted',
    'if',
    'lest',
    'once',
    'provided',
    'providing',
    'seeing',
    'so',
    'supposing',
    'though',
    'unless',
    'whenever',
    'whereas',
    'wherever',
    'while',
    'whilst',
    'ago',
    'according to',
    'as regards',
    'counter to',
    'instead of',
    'owing to',
    'pertaining to',
    'at the behest of',
    'at the expense of',
    'at the hands of',
    'at risk of',
    'at the risk of',
    'at variance with',
    'by dint of',
    'by means of',
    'by virtue of',
    'by way of',
    'for the sake of',
    'for sake of',
    'for lack of',
    'for want of',
    'from want of',
    'in accordance with',
    'in addition to',
    'in case of',
    'in charge of',
    'in compliance with',
    'in conformity with',
    'in contact with',
    'in exchange for',
    'in favor of',
    'in front of',
    'in lieu of',
    'in light of',
    'in the light of',
    'in line with',
    'in place of',
    'in point of',
    'in quest of',
    'in relation to',
    'in regard to',
    'with regard to',
    'in respect to',
    'with respect to',
    'in return for',
    'in search of',
    'in step with',
    'in touch with',
    'in terms of',
    'in the name of',
    'in view of',
    'on account of',
    'on behalf of',
    'on grounds of',
    'on the grounds of',
    'on the part of',
    'on top of',
    'with a view to',
    'with the exception of',
    'à la',
    'a la',
    'as soon as',
    'as well as',
    'close to',
    'due to',
    'far from',
    'in case',
    'other than',
    'prior to',
    'pursuant to',
    'regardless of',
    'subsequent to',
    'as long as',
    'as much as',
    'as far as',
    'by the time',
    'in as much as',
    'inasmuch',
    'in order to',
    'in order that',
    'even',
    'provide that',
    'if only',
    'whether',
    'whose',
    'whoever',
    'why',
    'how',
    'or not',
    'whatever',
    'what',
    'both',
    'and',
    'or',
    'not only',
    'but also',
    'either',
    'neither',
    'nor',
    'just',
    'rather',
    'no sooner',
    'such',
    'that',
    'yet',
    'is',
    'it',
  ];
  ignoreCasedWords?: boolean = true;
}

@RuleBuilder.register
export default class CapitalizeHeadings extends RuleBuilder<CapitalizeHeadingsOptions> {
  constructor() {
    super({
      nameKey: 'rules.capitalize-headings.name',
      descriptionKey: 'rules.capitalize-headings.description',
      type: RuleType.HEADING,
    });
  }
  get OptionsClass(): new () => CapitalizeHeadingsOptions {
    return CapitalizeHeadingsOptions;
  }
  apply(text: string, options: CapitalizeHeadingsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(allHeadersRegex, (headerText: string) => {
        if (options.style === 'ALL CAPS') {
          return headerText.toUpperCase(); // convert full heading to uppercase
        }

        const capitalizeJustFirstLetter = options.style === 'First letter';
        // split by whitespace
        const headerWords = headerText.match(/\S+/g);
        const keepCasing = options.ignoreWords;
        const ignoreShortWords = options.lowercaseWords;
        let firstWord = true;
        for (let j = 1; j < headerWords.length; j++) {
          // based on https://stackoverflow.com/a/62032796 "/\p{L}/u" accounts for all unicode letters across languages
          const isWord = headerWords[j].match(/^[\p{L}'-]{1,}[.?!,:;\d]*$/u);
          if (!isWord) {
            continue;
          }

          const ignoreCasedWord = options.ignoreCasedWords && headerWords[j] !== headerWords[j].toLowerCase();
          const keepWordCasing = ignoreCasedWord || keepCasing.includes(headerWords[j]);
          if (!keepWordCasing) {
            headerWords[j] = headerWords[j].toLowerCase();
            const ignoreWord = ignoreShortWords.includes(headerWords[j]);
            if ((!ignoreWord && !capitalizeJustFirstLetter) || firstWord === true) {
              headerWords[j] = headerWords[j][0].toUpperCase() + headerWords[j].slice(1);
            }
          }

          firstWord = false;

          // if the user wants to keep casing and capitalize just the first letter then there is no need to lowercase any other word after the first word
          if (options.ignoreCasedWords && capitalizeJustFirstLetter) {
            break;
          }
        }

        return headerWords.join(' ');
      });
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
        nameKey: 'rules.capitalize-headings.style.name',
        descriptionKey: 'rules.capitalize-headings.style.description',
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
        nameKey: 'rules.capitalize-headings.ignore-case-words.name',
        descriptionKey: 'rules.capitalize-headings.ignore-case-words.description',
        optionsKey: 'ignoreCasedWords',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        nameKey: 'rules.capitalize-headings.ignore-words.name',
        descriptionKey: 'rules.capitalize-headings.ignore-words.description',
        optionsKey: 'ignoreWords',
        splitter: wordSplitterRegex,
        separator: ', ',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        nameKey: 'rules.capitalize-headings.lowercase-words.name',
        descriptionKey: 'rules.capitalize-headings.lowercase-words.description',
        optionsKey: 'lowercaseWords',
        splitter: wordSplitterRegex,
        separator: ', ',
      }),
    ];
  }
}
