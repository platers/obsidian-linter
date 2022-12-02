import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class ConsecutiveBlankLinesOptions implements Options {
}

@RuleBuilder.register
export default class ConsecutiveBlankLines extends RuleBuilder<ConsecutiveBlankLinesOptions> {
  get OptionsClass(): new () => ConsecutiveBlankLinesOptions {
    return ConsecutiveBlankLinesOptions;
  }
  get name(): string {
    return 'Consecutive blank lines';
  }
  get description(): string {
    return 'There should be at most one consecutive blank line.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: ConsecutiveBlankLinesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(/(\n([\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+)?){2,}/g, '\n\n');
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
