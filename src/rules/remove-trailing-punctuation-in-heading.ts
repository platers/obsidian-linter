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
  get OptionsClass(): new () => RemoveTrailingPunctuationInHeadingOptions {
    return RemoveTrailingPunctuationInHeadingOptions;
  }
  get name(): string {
    return 'Remove Trailing Punctuation in Heading';
  }
  get description(): string {
    return 'Removes the specified punctuation from the end of headings making sure to ignore the semicolon at the end of [HTML entity references](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references).';
  }
  get type(): RuleType {
    return RuleType.HEADING;
  }
  apply(text: string, options: RemoveTrailingPunctuationInHeadingOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml], text, (text) => {
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
        name: 'Trailing Punctuation',
        description: 'The trailing punctuation to remove from the headings in the file.',
        optionsKey: 'punctuationToRemove',
      }),
    ];
  }
}
