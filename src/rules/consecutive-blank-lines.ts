import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {multipleBlankLinesRegex} from '../utils/regex';

class ConsecutiveBlankLinesOptions implements Options {}

@RuleBuilder.register
export default class ConsecutiveBlankLines extends RuleBuilder<ConsecutiveBlankLinesOptions> {
  constructor() {
    super({
      nameKey: 'rules.consecutive-blank-lines.name',
      descriptionKey: 'rules.consecutive-blank-lines.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
      hasSpecialExecutionOrder: true, // runs after most rules to cleanup any leftover spacing https://github.com/platers/obsidian-linter/issues/1225
    });
  }
  get OptionsClass(): new () => ConsecutiveBlankLinesOptions {
    return ConsecutiveBlankLinesOptions;
  }
  apply(text: string, options: ConsecutiveBlankLinesOptions): string {
    return text.replace(multipleBlankLinesRegex, '\n\n');
  }
  get exampleBuilders(): ExampleBuilder<ConsecutiveBlankLinesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Consecutive blank lines are removed',
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
