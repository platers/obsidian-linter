import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class ConsecutiveBlankLinesOptions implements Options {}

@RuleBuilder.register
export default class ConsecutiveBlankLines extends RuleBuilder<ConsecutiveBlankLinesOptions> {
  constructor() {
    super({
      nameKey: 'rules.consecutive-blank-lines.name',
      descriptionKey: 'rules.consecutive-blank-lines.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => ConsecutiveBlankLinesOptions {
    return ConsecutiveBlankLinesOptions;
  }
  apply(text: string, options: ConsecutiveBlankLinesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      // make sure to account for lines that are purely whitespace as well https://stackoverflow.com/a/3873354/8353749
      // make sure that the match ends in a newline
      return text.replace(/(\n([\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+)?){2,}\n/g, '\n\n');
    });
  }
  get exampleBuilders(): ExampleBuilder<ConsecutiveBlankLinesOptions>[] {
    return [
      new ExampleBuilder({
        description: '',
        before: dedent`
          Some text
          ${''}
          ${''}
          Some more text
        `,
        after: dedent`
          Some text
          ${''}
          Some more text
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ConsecutiveBlankLinesOptions>[] {
    return [];
  }
}
