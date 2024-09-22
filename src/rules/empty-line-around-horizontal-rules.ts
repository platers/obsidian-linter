import dedent from 'ts-dedent';
import {Options, RuleType} from '../rules';
import {ensureEmptyLinesAroundHorizontalRule} from '../utils/mdast';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';

class EmptyLineAroundHorizontalRulesOptions implements Options {}

@RuleBuilder.register
export default class EmptyLineAroundHorizontalRules extends RuleBuilder<EmptyLineAroundHorizontalRulesOptions> {
  constructor() {
    super({
      nameKey: 'rules.empty-line-around-horizontal-rules.name',
      descriptionKey: 'rules.empty-line-around-horizontal-rules.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => EmptyLineAroundHorizontalRulesOptions {
    return EmptyLineAroundHorizontalRulesOptions;
  }
  apply(text: string, options: EmptyLineAroundHorizontalRulesOptions): string {
    return ensureEmptyLinesAroundHorizontalRule(text);
  }
  get exampleBuilders(): ExampleBuilder<EmptyLineAroundHorizontalRulesOptions>[] {
    return [
      new ExampleBuilder({
        description:
          'Horizontal rules that start a document do not get an empty line before them.',
        before: dedent`
          ***
          ${''}
          ${''}
          asdf
          ___
          qwer
        `,
        after: dedent`
          ***
          ${''}
          asdf
          ${''}
          ___
          ${''}
          qwer
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundHorizontalRulesOptions>[] {
    return [];
  }
}
