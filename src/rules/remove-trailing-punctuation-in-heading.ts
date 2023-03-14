import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex} from '../utils/regex';

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
    });
  }
  get OptionsClass(): new () => RemoveTrailingPunctuationInHeadingOptions {
    return RemoveTrailingPunctuationInHeadingOptions;
  }
  apply(text: string, options: RemoveTrailingPunctuationInHeadingOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml], text, (text) => {
      return text.replaceAll(allHeadersRegex,
          (heading: string, $1: string = '', $2: string = '', $3: string = '', $4: string = '', $5: string = '') => {
            // ignore the html entities and entries without any heading text
            // regex from https://stackoverflow.com/a/26128757/8353749
            if ($4 == '' || $4.match(/&[^\s]+;$/mi)) {
              return heading;
            }

            const lastHeadingChar = $4.charAt($4.length - 1);
            if (options.punctuationToRemove.includes(lastHeadingChar)) {
              return $1 + $2 + $3 + $4.substring(0, $4.length - 1) + $5;
            }

            return heading;
          });
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
