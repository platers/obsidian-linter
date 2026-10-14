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

  private getSegmentRegex(): RegExp {
    return /(\s+|!\[\[[^\]]+\]\]|!\[[^\]]*\]\([^)]*\)|\[\[[^\]]+\]\]|\[\[[^\]]+\|[^\]]+\]\]|\[[^\]]+\]\([^)]*\)|[^\s]+)/g;
  }

  private isWordToken(token: string, options: CapitalizeHeadingsOptions): boolean {
    const startingCustomRegexGroup = options.startingWordIgnoreCharacters?.length == 0 ? '' : `[${escapeRegExp(options.startingWordIgnoreCharacters)}]?`;
    const endingCustomRegexGroup = options.endingWordIgnoreCharacters?.length == 0 ? '' : `[${escapeRegExp(options.endingWordIgnoreCharacters)}]*`;
    const wordRegex = new RegExp(`^${startingCustomRegexGroup}[\\p{L}’'-]{1,}${endingCustomRegexGroup}$`, 'u');
    return !!token.match(wordRegex) && token !== '-' && token !== '\'';
  }

  private capitalizeWordToken(token: string, options: CapitalizeHeadingsOptions, isFirstWord: boolean): { value: string, consumed: boolean } {
    if (!this.isWordToken(token, options)) {
      return { value: token, consumed: false };
    }

    const lower = token.toLowerCase();
    const leadingIgnoredCharacters = options.startingWordIgnoreCharacters ?? '';
    const leadingIgnoredCount = token.split('').findIndex((char) => !leadingIgnoredCharacters.includes(char));
    const capitalizeIndex = leadingIgnoredCount >= 0 ? leadingIgnoredCount : 0;

    if (options.style === 'ALL CAPS') {
      return { value: lower.toUpperCase(), consumed: true };
    }

    if (options.ignoreCasedWords && token !== lower) {
      return { value: token, consumed: true };
    }

    if (options.ignoreWords.includes(token)) {
      return { value: token, consumed: true };
    }

    if (options.style === 'First letter') {
      if (!isFirstWord) {
        return { value: lower, consumed: true };
      }

      const capitalized = lower.slice(0, capitalizeIndex) + lower.charAt(capitalizeIndex).toUpperCase() + lower.slice(capitalizeIndex + 1);
      return { value: capitalized, consumed: true };
    }

    if (options.lowercaseWords.includes(lower) && !isFirstWord) {
      return { value: lower, consumed: true };
    }

    const capitalized = lower.slice(0, capitalizeIndex) + lower.charAt(capitalizeIndex).toUpperCase() + lower.slice(capitalizeIndex + 1);
    return { value: capitalized, consumed: true };
  }

  private capitalizeTextFragment(fragment: string, options: CapitalizeHeadingsOptions, firstWord: boolean): { value: string, firstWord: boolean } {
    if (!fragment) {
      return { value: fragment, firstWord };
    }

    let nextFirstWord = firstWord;
    const pieces = fragment.split(/(\s+)/g);
    const result: string[] = [];

    for (const piece of pieces) {
      if (!piece) {
        continue;
      }
      if (/\s+/.test(piece)) {
        result.push(piece);
        continue;
      }

      const transformed = this.capitalizeWordToken(piece, options, nextFirstWord);
      result.push(transformed.value);
      if (transformed.consumed) {
        nextFirstWord = false;
      }
    }

    return { value: result.join(''), firstWord: nextFirstWord };
  }

  private capitalizeMarkdownLink(token: string, options: CapitalizeHeadingsOptions, firstWord: boolean): { value: string, firstWord: boolean } {
    if (token.startsWith('![') || token.startsWith('![[') || !token.includes('](')) {
      return { value: token, firstWord };
    }

    const match = /^\[([^\]]*)\]\(([^)]+)\)$/.exec(token);
    if (!match) {
      return { value: token, firstWord };
    }

    const updated = this.capitalizeTextFragment(match[1], options, firstWord);
    return { value: `[${updated.value}](${match[2]})`, firstWord: updated.firstWord };
  }

  private capitalizeWikiLink(token: string, options: CapitalizeHeadingsOptions, firstWord: boolean): { value: string, firstWord: boolean } {
    if (token.startsWith('!') || !token.startsWith('[[') || !token.endsWith(']]')) {
      return { value: token, firstWord };
    }

    const match = /^\[\[([^\]|]+)(\|([^\]]*))?\]\]$/.exec(token);
    if (!match) {
      return { value: token, firstWord };
    }

    const target = match[1];
    const aliasText = match[3] ?? target;
    const updated = this.capitalizeTextFragment(aliasText, options, firstWord);
    if (match[3] != null) {
      return { value: `[[${target}|${updated.value}]]`, firstWord: updated.firstWord };
    }

    return { value: `[[${updated.value}]]`, firstWord: updated.firstWord };
  }

  apply(text: string, options: CapitalizeHeadingsOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    const replacements: textReplacement[] = [];

    for (const match of projection.text.matchAll(allHeadersRegex)) {
      if (!match[4] || match[4].trim() === '') {
        continue;
      }

      const headerText = match[0];
      const transformed = this.capitalizeHeading(headerText, options);
      const range = projection.editRangeToSource({ startIndex: match.index, endIndex: match.index + headerText.length });
      if (range && text.substring(range.startIndex, range.endIndex) !== transformed) {
        replacements.push({ ...range, value: transformed });
      }
    }

    return applyNonOverlappingReplacements(text, replacements);
  }

  capitalizeHeading(text: string, options: CapitalizeHeadingsOptions): string {
    return text.replace(allHeadersRegex, (headerText: string) => {
      let firstWord = true;
      let result = '';
      const segments = headerText.match(this.getSegmentRegex()) ?? [];

      for (const segment of segments) {
        if (/^\s+$/.test(segment)) {
          result += segment;
          continue;
        }

        if (segment.startsWith('![') || segment.startsWith('![[') || segment.startsWith('[[') && segment.startsWith('!')) {
          result += segment;
          continue;
        }

        if (segment.startsWith('[[')) {
          const transformed = this.capitalizeWikiLink(segment, options, firstWord);
          firstWord = transformed.firstWord;
          result += transformed.value;
          continue;
        }

        if (segment.startsWith('[') && segment.includes('](')) {
          const transformed = this.capitalizeMarkdownLink(segment, options, firstWord);
          firstWord = transformed.firstWord;
          result += transformed.value;
          continue;
        }

        const transformed = this.capitalizeTextFragment(segment, options, firstWord);
        firstWord = transformed.firstWord;
        result += transformed.value;
      }

      return result;
    });
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
