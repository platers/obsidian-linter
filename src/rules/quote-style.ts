import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {smartDoubleQuoteRegex, smartSingleQuoteRegex, unicodeLetterRegex} from '../utils/regex';
import {replaceTextRanges, textReplacement} from '../utils/strings';
import {collectUnprotectedRegexReplacements, ProtectedRanges, redactProtected} from '../utils/protected-ranges';

export enum SingleQuoteStyles {
  Straight = '\'\'',
  SmartQuote = '‘’',
}

export enum DoubleQuoteStyles {
  Straight = '""',
  SmartQuote = '“”',
}

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
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.inlineMath, IgnoreTypes.html, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.templaterCommand, IgnoreTypes.image],
      usesProtectedRanges: true,
    });
  }
  get OptionsClass(): new () => QuoteStyleOptions {
    return QuoteStyleOptions;
  }
  apply(text: string, options: QuoteStyleOptions, protectedRanges: ProtectedRanges): string {
    const replacements: textReplacement[] = [];
    if (options.doubleQuoteStyleEnabled) {
      if (options.doubleQuoteStyle === DoubleQuoteStyles.Straight) {
        replacements.push(...this.collectSmartQuotesToStraightQuotes(text, smartDoubleQuoteRegex, '"', protectedRanges));
      } else {
        replacements.push(...this.collectStraightQuoteToSmartQuoteReplacements(text, '"', DoubleQuoteStyles.SmartQuote[0], DoubleQuoteStyles.SmartQuote[1], false, protectedRanges));
      }
    }

    if (options.singleQuoteStyleEnabled) {
      if (options.singleQuoteStyle === SingleQuoteStyles.Straight) {
        replacements.push(...this.collectSmartQuotesToStraightQuotes(text, smartSingleQuoteRegex, '\'', protectedRanges));
      } else {
        replacements.push(...this.collectStraightQuoteToSmartQuoteReplacements(text, '\'', SingleQuoteStyles.SmartQuote[0], SingleQuoteStyles.SmartQuote[1], true, protectedRanges));
      }
    }

    // The two quote families are disjoint, and converting either one does not change the
    // letter/whitespace classification used by the other, so both read the original text.
    replacements.sort((a, b) => a.startIndex - b.startIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
  }
  collectSmartQuotesToStraightQuotes(text: string, regex: RegExp, straightQuote: string, protectedRanges: ProtectedRanges): textReplacement[] {
    const replacement = (match: RegExpMatchArray, startIndex: number): textReplacement => ({startIndex, endIndex: startIndex + match[0].length, value: straightQuote});
    return collectUnprotectedRegexReplacements(text, regex, protectedRanges, {editRange: replacement, guardRange: replacement});
  }
  collectStraightQuoteToSmartQuoteReplacements(text: string, straightQuote: string, openingSmartQuote: string, closingSmartQuote: string, isForSingleQuotes: boolean, protectedRanges: ProtectedRanges): textReplacement[] {
    let quoteReplacement: string;
    let previousChar: string;
    let nextChar: string;
    let previousCharIsALetter: boolean;
    let nextCharIsALetter: boolean;
    let previousCharIsWhitespace: boolean;
    let nextCharIsWhitespace: boolean;
    let isContraction: boolean;
    let previousQuote = '';
    return collectUnprotectedRegexReplacements(text, new RegExp(straightQuote, 'g'), protectedRanges, {
      // A placeholder contains no quotes, so protected quotes must not update previousQuote.
      guardRange: (match, index) => ({startIndex: index, endIndex: index + match[0].length}),
      editRange: (match, index) => {
        previousChar = redactProtected(text, protectedRanges, Math.max(0, index - 1), index).slice(-1);
        nextChar = redactProtected(text, protectedRanges, index + 1, Math.min(text.length, index + 2)).charAt(0);
        previousCharIsALetter = unicodeLetterRegex.test(previousChar);
        nextCharIsALetter = unicodeLetterRegex.test(nextChar);
        isContraction = previousCharIsALetter && nextCharIsALetter;
        previousCharIsWhitespace = previousChar != '' && previousChar.trim() === '';
        nextCharIsWhitespace = nextChar != '' && nextChar.trim() === '';
        if (isContraction && isForSingleQuotes) {
          quoteReplacement = closingSmartQuote;
        } else if (nextCharIsWhitespace && !previousCharIsWhitespace) {
          quoteReplacement = closingSmartQuote;
          previousQuote = quoteReplacement;
        } else if (previousCharIsWhitespace && !nextCharIsWhitespace) {
          quoteReplacement = openingSmartQuote;
          previousQuote = quoteReplacement;
        } else { // this case is meant for languages that do not have a concept of letters like Japanese or Chinese or in the case that we have a scenario where no non-whitespace surrounding the quote
          if (previousQuote === '' || previousQuote === closingSmartQuote) {
            quoteReplacement = openingSmartQuote;
          } else {
            quoteReplacement = closingSmartQuote;
          }

          previousQuote = quoteReplacement;
        }

        return {startIndex: index, endIndex: index + 1, value: quoteReplacement};
      },
    });
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
          Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>
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
          Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>
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
