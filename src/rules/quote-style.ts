import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {smartDoubleQuoteRegex, smartSingleQuoteRegex} from '../utils/regex';
import {countInstances} from '../utils/strings';
import {getTextInLanguage} from '../lang/helpers';

export enum SingleQuoteStyles {
  Straight = '\'\'',
  SmartQuote = '‘’',
}

export enum DoubleQuoteStyles {
  Straight = '""',
  SmartQuote = '“”',
}

// from https://en.wikipedia.org/wiki/Wikipedia:List_of_English_contractions with any contractions
// missing a single quote removed
const englishContractions = [
  'a\'ight',
  'ain\'t',
  'amn\'t',
  '\'n\'',
  'aren\'t',
  '\'bout',
  'boy\'s',
  'can\'t',
  'cap\'n',
  '\'cause',
  '\'cept',
  'could\'ve',
  'couldn\'t',
  'couldn\'t\'ve',
  'daren\'t',
  'daresn\'t',
  'dasn\'t',
  'didn\'t',
  'doesn\'t',
  'don\'t',
  'd\'ye',
  'd\'ya',
  'e\'en',
  'e\'er',
  '\'em',
  'everybody\'s',
  'everyone\'s',
  'everything\'s',
  'fo\'c\'sle',
  '\'gainst',
  'g\'day',
  'girl\'s',
  'giv\'n',
  'gi\'z',
  'gon\'t',
  'guy\'s',
  'hadn\'t',
  'had\'ve',
  'hasn\'t',
  'haven\'t',
  'he\'d',
  'he\'ll',
  'he\'s',
  'here\'s',
  'how\'d',
  'how\'ll',
  'how\'re',
  'how\'s',
  'I\'d',
  'I\'d\'ve',
  'I\'d\'nt',
  'I\'d\'nt\'ve',
  'If\'n',
  'I\'ll',
  'I\'m',
  'I\'m\'o',
  'I\'ve',
  'isn\'t',
  'it\'d',
  'it\'ll',
  'it\'s',
  'let\'s',
  'loven\'t',
  'ma\'am',
  'mayn\'t',
  'may\'ve',
  'mightn\'t',
  'might\'ve',
  'mine\'s',
  'mustn\'t',
  'mustn\'t\'ve',
  'must\'ve',
  '\'neath',
  'needn\'t',
  'ne\'er',
  'o\'clock',
  'o\'er',
  'ol\'',
  'ought\'ve',
  'oughtn\'t',
  'oughtn\'t\'ve',
  '\'round',
  'shalln\'t',
  'shan\'',
  'shan\'t',
  'she\'d',
  'she\'ll',
  'she\'s',
  'should\'ve',
  'shouldn\'t',
  'shouldn\'t\'ve',
  'somebody\'s',
  'someone\'s',
  'something\'s',
  'so\'re',
  'so\'s',
  'so\'ve',
  'that\'ll',
  'that\'re',
  'that\'s',
  'that\'d',
  'there\'d',
  'there\'ll',
  'there\'re',
  'there\'s',
  'these\'re',
  'these\'ve',
  'they\'d',
  'they\'d\'ve',
  'they\'ll',
  'they\'re',
  'they\'ve',
  'this\'s',
  'those\'re',
  'those\'ve',
  '\'thout',
  '\'til',
  '\'tis',
  'to\'ve',
  '\'twas',
  '\'tween',
  '\'twere',
  'w\'all',
  'w\'at',
  'wasn\'t',
  'we\'d',
  'we\'d\'ve',
  'we\'ll',
  'we\'re',
  'we\'ve',
  'weren\'t',
  'what\'d',
  'what\'ll',
  'what\'re',
  'what\'s',
  'what\'ve',
  'when\'s',
  'where\'d',
  'where\'ll',
  'where\'re',
  'where\'s',
  'where\'ve',
  'which\'d',
  'which\'ll',
  'which\'re',
  'which\'s',
  'which\'ve',
  'who\'d',
  'who\'d\'ve',
  'who\'ll',
  'who\'re',
  'who\'s',
  'who\'ve',
  'why\'d',
  'why\'re',
  'why\'s',
  'willn\'t',
  'won\'t',
  'would\'ve',
  'wouldn\'t',
  'wouldn\'t\'ve',
  'y\'ain\'t',
  'y\'all',
  'y\'all\'d\'ve',
  'y\'all\'d\'n\'t\'ve',
  'y\'all\'re',
  'y\'all\'ren\'t',
  'y\'at',
  'yes\'m',
  'y\'know',
  'you\'d',
  'you\'ll',
  'you\'re',
  'you\'ve',
  'when\'d',
  'willn\'t',
];

class QuoteStyleOptions implements Options {
  singleQuoteStyleEnabled?: boolean = true;
  singleQuoteStyle?: SingleQuoteStyles = SingleQuoteStyles.Straight;
  doubleQuoteStyleEnabled?: boolean = true;
  doubleQuoteStyle?: DoubleQuoteStyles = DoubleQuoteStyles.Straight;
}

@RuleBuilder.register
export default class QuoteStyle extends RuleBuilder<QuoteStyleOptions> {
  constructor() {
    super({
      nameKey: 'rules.quote-style.name',
      descriptionKey: 'rules.quote-style.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.html],
    });
  }
  get OptionsClass(): new () => QuoteStyleOptions {
    return QuoteStyleOptions;
  }
  apply(text: string, options: QuoteStyleOptions): string {
    let newText = text;
    if (options.doubleQuoteStyleEnabled) {
      if (options.doubleQuoteStyle === DoubleQuoteStyles.Straight) {
        newText = this.convertSmartDoubleQuotesToStraightQuotes(newText);
      } else {
        newText = this.convertStraightDoubleQuotesToDoubleSmartQuotes(newText);
      }
    }

    if (options.singleQuoteStyleEnabled) {
      if (options.singleQuoteStyle === SingleQuoteStyles.Straight) {
        newText = this.convertSmartSingleQuotesToStraightQuotes(newText);
      } else {
        newText = this.convertStraightSingleQuotesToSingleSmartQuotes(newText);
      }
    }

    return newText;
  }
  convertSmartSingleQuotesToStraightQuotes(text: string): string {
    return text.replace(smartSingleQuoteRegex, '\'');
  }
  convertSmartDoubleQuotesToStraightQuotes(text: string): string {
    return text.replace(smartDoubleQuoteRegex, '"');
  }
  // based on https://inkplant.com/tools/smart-quotes-converter
  convertStraightDoubleQuotesToDoubleSmartQuotes(text: string): string {
    this.throwErrorIfNotEqualNumberOfQuotes(text, '"');
    const openingDoubleQuote = DoubleQuoteStyles.SmartQuote[0];
    const endingDoubleQuote = DoubleQuoteStyles.SmartQuote[1];

    let numReplacementsMade = 0;
    text = text.replaceAll('"', () => {
      let doubleQuote = openingDoubleQuote;
      if (numReplacementsMade % 2 === 1) {
        doubleQuote = endingDoubleQuote;
      }

      numReplacementsMade++;

      return doubleQuote;
    });

    return text;
  }
  // based on https://inkplant.com/tools/smart-quotes-converter
  convertStraightSingleQuotesToSingleSmartQuotes(text: string): string {
    const openingSingleQuote = SingleQuoteStyles.SmartQuote[0];
    const endingSingleQuote = SingleQuoteStyles.SmartQuote[1];

    text = this.convertContractionStraightQuotesToSmartQuotes(text, openingSingleQuote, endingSingleQuote);

    text = this.convertPossessiveStraightQuotesToSmartQuotes(text, endingSingleQuote);

    this.throwErrorIfNotEqualNumberOfQuotes(text, '\'');

    let numReplacementsMade = 0;
    text = text.replaceAll('\'', () => {
      let singleQuote = openingSingleQuote;
      if (numReplacementsMade % 2 === 1) {
        singleQuote = endingSingleQuote;
      }

      numReplacementsMade++;

      return singleQuote;
    });

    return text;
  }
  convertContractionStraightQuotesToSmartQuotes(text: string, openingSmartQuote: string, closingSmartQuote: string): string {
    const replaceMatchQuotes = function(match: string) {
      if (match[0] === '\'') {
        match = openingSmartQuote + match.substring(1);
      }

      return match.replaceAll('\'', closingSmartQuote);
    };

    for (const contraction of englishContractions) {
      text = text.replace(new RegExp(contraction, 'gi'), replaceMatchQuotes);
    }

    return text;
  }
  convertPossessiveStraightQuotesToSmartQuotes(text: string, smartQuote: string): string {
    return text.replace(/([a-zA-Z0-9]'s|s')/g, (match: string) => {
      return match.replace('\'', smartQuote);
    });
  }
  throwErrorIfNotEqualNumberOfQuotes(text: string, quote: string) {
    const numInstances = countInstances(text, quote);

    if (numInstances % 2 !== 0) {
      throw new Error(getTextInLanguage('logs.uneven-amount-of-quotes').replace('{QUOTE}', quote));
    }
  }
  get exampleBuilders(): ExampleBuilder<QuoteStyleOptions>[] {
    return [
      new ExampleBuilder<QuoteStyleOptions>({
        description: 'Smart quotes used in file are converted to straight quotes when styles are set to `Straight`',
        before: dedent`
          # Double Quote Cases
          “There are a bunch of different kinds of smart quote indicators”
          „More than you would think”
          «Including this one for Spanish»
          # Single Quote Cases
          ‘Simple smart quotes get replaced’
          ‚Another single style smart quote also gets replaced’
          ‹Even this style of single smart quotes is replaced›
        `,
        after: dedent`
          # Double Quote Cases
          "There are a bunch of different kinds of smart quote indicators"
          "More than you would think"
          "Including this one for Spanish"
          # Single Quote Cases
          'Simple smart quotes get replaced'
          'Another single style smart quote also gets replaced'
          'Even this style of single smart quotes is replaced'
        `,
      }),
      new ExampleBuilder<QuoteStyleOptions>({
        description: 'Straight quotes used in file are converted to smart quotes when styles are set to `Smart`',
        before: dedent`
          "As you can see, these double quotes will be converted to smart quotes"
          "Common contractions are handled as well. For example can't is updated to smart quotes."
          "Nesting a quote in a quote like so: 'here I am' is handled correctly"
          'Single quotes by themselves are handled correctly'
          Possessives are handled correctly: Pam's dog is really cool!
          ${''}
          Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
          once possessives and common contractions have been dealt with. If not, it will throw an error.
        `,
        after: dedent`
          “As you can see, these double quotes will be converted to smart quotes”
          “Common contractions are handled as well. For example can’t is updated to smart quotes.”
          “Nesting a quote in a quote like so: ‘here I am’ is handled correctly”
          ‘Single quotes by themselves are handled correctly’
          Possessives are handled correctly: Pam’s dog is really cool!
          ${''}
          Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
          once possessives and common contractions have been dealt with. If not, it will throw an error.
        `,
        options: {
          singleQuoteStyle: SingleQuoteStyles.SmartQuote,
          doubleQuoteStyle: DoubleQuoteStyles.SmartQuote,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<QuoteStyleOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: QuoteStyleOptions,
        nameKey: 'rules.quote-style.single-quote-enabled.name',
        descriptionKey: 'rules.quote-style.single-quote-enabled.description',
        optionsKey: 'singleQuoteStyleEnabled',
      }),
      new DropdownOptionBuilder<QuoteStyleOptions, SingleQuoteStyles>({
        OptionsClass: QuoteStyleOptions,
        nameKey: 'rules.quote-style.single-quote-style.name',
        descriptionKey: 'rules.quote-style.single-quote-style.description',
        optionsKey: 'singleQuoteStyle',
        records: [
          {
            value: SingleQuoteStyles.Straight,
            description: 'Uses "\'" instead of smart single quotes',
          },
          {
            value: SingleQuoteStyles.SmartQuote,
            description: 'Uses "‘" and "’" instead of straight single quotes',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: QuoteStyleOptions,
        nameKey: 'rules.quote-style.double-quote-enabled.name',
        descriptionKey: 'rules.quote-style.double-quote-enabled.description',
        optionsKey: 'doubleQuoteStyleEnabled',
      }),
      new DropdownOptionBuilder<QuoteStyleOptions, DoubleQuoteStyles>({
        OptionsClass: QuoteStyleOptions,
        nameKey: 'rules.quote-style.double-quote-style.name',
        descriptionKey: 'rules.quote-style.double-quote-style.description',
        optionsKey: 'doubleQuoteStyle',
        records: [
          {
            value: DoubleQuoteStyles.Straight,
            description: 'Uses \'"\' instead of smart double quotes',
          },
          {
            value: DoubleQuoteStyles.SmartQuote,
            description: 'Uses \'“\' and \'”\' instead of straight double quotes',
          },
        ],
      }),
    ];
  }
}
