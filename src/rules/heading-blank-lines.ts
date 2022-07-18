import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';

class HeadingBlankLinesOptions implements Options {
  bottom: boolean = true;
}

export default class HeadingBlankLines extends RuleBuilder<HeadingBlankLinesOptions> {
  get OptionsClass(): new () => HeadingBlankLinesOptions {
    return HeadingBlankLinesOptions;
  }
  get name(): string {
    return 'Heading blank lines';
  }
  get description(): string {
    return 'All headings have a blank line both before and after (except where the heading is at the beginning or end of the document).';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: HeadingBlankLinesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      if (!options.bottom) {
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
  }
  get exampleBuilders(): ExampleBuilder<HeadingBlankLinesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Headings should be surrounded by blank lines',
        before: dedent`
          # H1
          ## H2


          # H1
          line
          ## H2

        `,
        after: dedent`
          # H1

          ## H2

          # H1

          line

          ## H2
        `,
      }),
      new ExampleBuilder({
        description: 'With `Bottom=false`',
        before: dedent`
          # H1
          line
          ## H2
          # H1
          line
        `,
        after: dedent`
          # H1
          line

          ## H2

          # H1
          line
        `,
        options: {
          bottom: false,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilder<HeadingBlankLinesOptions, any>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: HeadingBlankLinesOptions,
        name: 'Bottom',
        description: 'Insert a blank line after headings',
        optionsKey: 'bottom',
      }),
    ];
  }
}
