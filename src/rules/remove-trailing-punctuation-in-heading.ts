import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex, htmlEntitiesRegex} from '../utils/regex';

class RemoveTrailingPunctuationInHeadingOptions implements Options {
  punctuationToRemove?: string = '.,;:!。，；：！';
}

@RuleBuilder.register
export default class RemoveTrailingPunctuationInHeading extends RuleBuilder<RemoveTrailingPunctuationInHeadingOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-trailing-punctuation-in-heading.name',
      descriptionKey: 'rules.remove-trailing-punctuation-in-heading.description',
      type: RuleType.HEADING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml],
    });
  }
  get OptionsClass(): new () => RemoveTrailingPunctuationInHeadingOptions {
    return RemoveTrailingPunctuationInHeadingOptions;
  }
  apply(text: string, options: RemoveTrailingPunctuationInHeadingOptions): string {
    return text.replaceAll(allHeadersRegex,
        (heading: string, $1: string = '', $2: string = '', $3: string = '', $4: string = '', $5: string = '') => {
          // ignore the html entities and entries without any heading text
          if ($4 == '' || $4.match(htmlEntitiesRegex)) {
            return heading;
          }

          const trimmedHeaderText = $4.trimEnd();
          // all of the trailing punctuation goes in one pass. Removing only the last character
          // meant a heading ending in several of them needed a lint per character, so the file
          // kept changing every time it was linted and lost a character each time.
          let endOfHeadingText = trimmedHeaderText.length;
          while (endOfHeadingText > 0 && options.punctuationToRemove.includes(trimmedHeaderText.charAt(endOfHeadingText - 1))) {
            endOfHeadingText--;
          }

          if (endOfHeadingText !== trimmedHeaderText.length) {
            return $1 + $2 + $3 + $4.substring(0, endOfHeadingText) + $4.substring(trimmedHeaderText.length) + $5;
          }

          return heading;
        });
  }

  get exampleBuilders(): ExampleBuilder<RemoveTrailingPunctuationInHeadingOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes punctuation from the end of a heading',
        before: dedent`
          # Heading ends in a period.
          ## Other heading ends in an exclamation mark! ##
        `,
        after: dedent`
          # Heading ends in a period
          ## Other heading ends in an exclamation mark ##
        `,
      }),
      new ExampleBuilder({
        description: 'HTML Entities at the end of a heading is ignored',
        before: dedent`
          # Heading 1
          ## Heading &amp;
        `,
        after: dedent`
          # Heading 1
          ## Heading &amp;
        `,
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/851
        description: 'Removes punctuation from the end of a heading when followed by whitespace',
        before: dedent`
          # Heading 1!${'  '}
          ## Heading 2.\t
        `,
        after: dedent`
          # Heading 1${'  '}
          ## Heading 2\t
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveTrailingPunctuationInHeadingOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: RemoveTrailingPunctuationInHeadingOptions,
        nameKey: 'rules.remove-trailing-punctuation-in-heading.punctuation-to-remove.name',
        descriptionKey: 'rules.remove-trailing-punctuation-in-heading.punctuation-to-remove.description',
        optionsKey: 'punctuationToRemove',
      }),
    ];
  }
}
