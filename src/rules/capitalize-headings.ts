import { Options, RuleType } from '../rules';
import RuleBuilder, { BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, ListItemOptionBuilder, TextOptionBuilder } from './rule-builder';
import dedent from 'ts-dedent';
import { IgnoreTypes } from '../utils/ignore-types';
import { allHeadersRegex, escapeRegExp, whitespaceSplitterRegex } from '../utils/regex';
import { ProtectedRanges } from '../utils/protected-ranges';
import { textReplacement } from '../utils/strings';
import { applyNonOverlappingReplacements } from '../utils/text-edits';
import { noWhitespace } from '../utils/validation';

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
    'inasmuch',
    'even',
    'whether',
    'whose',
    'whoever',
    'why',
    'how',
    'whatever',
    'what',
    'both',
    'and',
    'or',
    'either',
    'neither',
    'nor',
    'just',
    'rather',
    'such',
    'that',
    'yet',
    'is',
    'it',
  ];
  startingWordIgnoreCharacters?: string = '\'"(‘“-';
  endingWordIgnoreCharacters?: string = '.?!,:;\'\")”’0123456789-';
  ignoreCasedWords?: boolean = true;
}

@RuleBuilder.register
export default class CapitalizeHeadings extends RuleBuilder<CapitalizeHeadingsOptions> {
  constructor() {
    super({
      nameKey: 'rules.capitalize-headings.name',
      descriptionKey: 'rules.capitalize-headings.description',
      type: RuleType.HEADING,
      hasSpecialExecutionOrder: true,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.yaml, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => CapitalizeHeadingsOptions {
    return CapitalizeHeadingsOptions;
  }

  private isWordToken(token: string, options: CapitalizeHeadingsOptions): boolean {
    const startingCustomRegexGroup = options.startingWordIgnoreCharacters?.length == 0 ? '' : `[${escapeRegExp(options.startingWordIgnoreCharacters)}]?`;
    const endingCustomRegexGroup = options.endingWordIgnoreCharacters?.length == 0 ? '' : `[${escapeRegExp(options.endingWordIgnoreCharacters)}]*`;
    const wordRegex = new RegExp(`^${startingCustomRegexGroup}[\\p{L}’'-]{1,}${endingCustomRegexGroup}$`, 'u');
    return !!token.match(wordRegex) && token !== '-' && token !== '\'';
  }

  private capitalizeSingleWord(token: string, options: CapitalizeHeadingsOptions, isFirstWord: boolean): { value: string, used: boolean } {
    if (!this.isWordToken(token, options)) {
      return { value: token, used: false };
    }

    const capitalizeJustFirstLetter = options.style === 'First letter';
    const startingCustomRegexGroup = options.startingWordIgnoreCharacters?.length == 0 ? '' : `[${escapeRegExp(options.startingWordIgnoreCharacters)}]?`;
    const endingCustomRegexGroup = options.endingWordIgnoreCharacters?.length == 0 ? '' : `[${escapeRegExp(options.endingWordIgnoreCharacters)}]*`;
    const wordRegex = new RegExp(`^${startingCustomRegexGroup}[\\p{L}’'-]{1,}${endingCustomRegexGroup}$`, 'u');
    if (!token.match(wordRegex) || token === '-' || token === '\'') {
      return { value: token, used: false };
    }

    let indexToCapitalize = 0;
    if (options.startingWordIgnoreCharacters?.includes(token[0])) {
      indexToCapitalize = 1;
    }

    const ignoreCasedWord = options.ignoreCasedWords && token !== token.toLowerCase();
    const keepWordCasing = ignoreCasedWord || options.ignoreWords.includes(token);
    if (keepWordCasing) {
      return { value: token, used: true };
    }

    let updatedToken = token.toLowerCase();
    const ignoreWord = options.lowercaseWords.includes(updatedToken);
    if ((!ignoreWord && !capitalizeJustFirstLetter) || isFirstWord) {
      if (indexToCapitalize === 0) {
        updatedToken = updatedToken[indexToCapitalize].toUpperCase() + updatedToken.slice(indexToCapitalize + 1);
      } else {
        updatedToken = updatedToken[0] + updatedToken[indexToCapitalize].toUpperCase() + updatedToken.slice(indexToCapitalize + 1);
      }
    }

    return { value: updatedToken, used: true };
  }

  private capitalizeFragment(fragment: string, options: CapitalizeHeadingsOptions, firstWord: boolean): { value: string, firstWord: boolean } {
    if (!fragment) {
      return { value: fragment, firstWord };
    }

    if (options.style === 'ALL CAPS') {
      return { value: fragment.toUpperCase(), firstWord: false };
    }

    const parts = fragment.split(/(\s+)/g);
    let nextFirstWord = firstWord;
    let result = '';
    for (const part of parts) {
      if (part.length === 0 || /\s+/.test(part)) {
        result += part;
        continue;
      }

      const transformed = this.capitalizeSingleWord(part, options, nextFirstWord);
      result += transformed.value;
      if (transformed.used) {
        nextFirstWord = false;
      }
    }

    return { value: result, firstWord: nextFirstWord };
  }

  private capitalizeMarkdownLink(token: string, options: CapitalizeHeadingsOptions, firstWord: boolean): { value: string, firstWord: boolean } {
    if (token.startsWith('![')) {
      return { value: token, firstWord };
    }

    const match = /^\[([^\]]*)\]\(([^)]+)\)$/.exec(token);
    if (!match) {
      return { value: token, firstWord };
    }

    const textFragment = this.capitalizeFragment(match[1], options, firstWord);
    return { value: `[${textFragment.value}](${match[2]})`, firstWord: textFragment.firstWord };
  }

  private capitalizeWikiLink(token: string, options: CapitalizeHeadingsOptions, firstWord: boolean): { value: string, firstWord: boolean } {
    if (token.startsWith('!')) {
      return { value: token, firstWord };
    }

    const match = /^\[\[([^\]|]+)(\|([^\]]*))?\]\]$/.exec(token);
    if (!match) {
      return { value: token, firstWord };
    }

    const target = match[1];
    const alias = match[3] ?? match[1];
    const textFragment = this.capitalizeFragment(alias, options, firstWord);
    if (match[3] !== undefined) {
      return { value: `[[${target}|${textFragment.value}]]`, firstWord: textFragment.firstWord };
    }

    return { value: `[[${textFragment.value}]]`, firstWord: textFragment.firstWord };
  }

  capitalizeHeading(text: string, options: CapitalizeHeadingsOptions): string {
    return text.replace(allHeadersRegex, (headerText: string) => {
      if (options.style === 'ALL CAPS') {
        return headerText.replace(/(\[[^\]]*\]\([^)]*\)|\[\[[^\]]+\]\]|\[\[[^\]]+\|[^\]]+\]\]|\S+)/g, (segment: string) => {
          if (segment.startsWith('![') || segment.startsWith('![')) {
            return segment;
          }

          if (segment.startsWith('[[')) {
            const wiki = this.capitalizeWikiLink(segment, options, true);
            return wiki.value;
          }

          if (segment.startsWith('[') && segment.includes('](')) {
            const markdown = this.capitalizeMarkdownLink(segment, options, true);
            return markdown.value;
          }

          return segment.toUpperCase();
        });
      }

      let firstWord = true;
      return headerText.replace(/(\s+|!\[\[[^\]]+\]\]|!\[[^\]]*\]\([^)]*\)|\[\[[^\]]+\]\]|\[\[[^\]]+\|[^\]]+\]\]|\[[^\]]*\]\([^)]*\)|\S+)/g, (segment: string) => {
        if (/^\s+$/.test(segment)) {
          return segment;
        }

        if (segment.startsWith('![') || segment.startsWith('![[') || segment.startsWith('[[') && segment.startsWith('!')) {
          return segment;
        }

        if (segment.startsWith('[[')) {
          const wiki = this.capitalizeWikiLink(segment, options, firstWord);
          firstWord = wiki.firstWord;
          return wiki.value;
        }

        if (segment.startsWith('[') && segment.includes('](')) {
          const markdown = this.capitalizeMarkdownLink(segment, options, firstWord);
          firstWord = markdown.firstWord;
          return markdown.value;
        }

        const transformed = this.capitalizeFragment(segment, options, firstWord);
        firstWord = transformed.firstWord;
        return transformed.value;
      });
    });
  }

  apply(text: string, options: CapitalizeHeadingsOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    const replacements: textReplacement[] = [];
    for (const match of projection.text.matchAll(allHeadersRegex)) {
      if (!match[4] || match[4].trim() == '') {
        continue;
      }

      const addReplacement = (startIndex: number, endIndex: number, value: string) => {
        const range = projection.editRangeToSource({ startIndex: match.index + startIndex, endIndex: match.index + endIndex });
        if (range && text.substring(range.startIndex, range.endIndex) !== value) {
          replacements.push({ ...range, value });
        }
      };

      const transformedHeader = this.capitalizeHeading(match[0], options);
      const sourceHeader = match[0];
      if (sourceHeader !== transformedHeader) {
        const range = projection.editRangeToSource({ startIndex: match.index, endIndex: match.index + sourceHeader.length });
        if (range) {
          replacements.push({ ...range, value: transformedHeader });
        }
      }

      if (options.style === 'ALL CAPS') {
        let offset = 0;
        for (const character of match[0]) {
          addReplacement(offset, offset + character.length, character.toUpperCase());
          offset += character.length;
        }
      }
    }

    return applyNonOverlappingReplacements(text, replacements);
  }

  get exampleBuilders(): ExampleBuilder<CapitalizeHeadingsOptions>[] {
    return [
      new ExampleBuilder({
        description: 'With `Title case=true`, `Ignore cased words=false`',
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
        description: 'With `Title Case=true`, `Ignore cased words=true`',
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
      new ListItemOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        nameKey: 'rules.capitalize-headings.ignore-words.name',
        descriptionKey: 'rules.capitalize-headings.ignore-words.description',
        emptyStateKey: 'rules.capitalize-headings.ignore-words.empty-state',
        fieldNamePlaceholderKey: 'rules.capitalize-headings.ignore-words.placeholder-text',
        optionsKey: 'ignoreWords',
        validator: noWhitespace,
      }),
      new ListItemOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        nameKey: 'rules.capitalize-headings.lowercase-words.name',
        descriptionKey: 'rules.capitalize-headings.lowercase-words.description',
        emptyStateKey: 'rules.capitalize-headings.lowercase-words.empty-state',
        fieldNamePlaceholderKey: 'rules.capitalize-headings.lowercase-words.placeholder-text',
        optionsKey: 'lowercaseWords',
        validator: noWhitespace,
      }),
      new TextOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        nameKey: 'rules.capitalize-headings.starting-word-ignore-characters.name',
        descriptionKey: 'rules.capitalize-headings.starting-word-ignore-characters.description',
        optionsKey: 'startingWordIgnoreCharacters',
      }),
      new TextOptionBuilder({
        OptionsClass: CapitalizeHeadingsOptions,
        nameKey: 'rules.capitalize-headings.ending-word-ignore-characters.name',
        descriptionKey: 'rules.capitalize-headings.ending-word-ignore-characters.description',
        optionsKey: 'endingWordIgnoreCharacters',
      }),
    ];
  }
}
