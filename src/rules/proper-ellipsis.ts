import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {ellipsisRegex} from '../utils/regex';

class ProperEllipsisOptions implements Options {}

@RuleBuilder.register
export default class ProperEllipsis extends RuleBuilder<ProperEllipsisOptions> {
  constructor() {
    super({
      nameKey: 'rules.proper-ellipsis.name',
      descriptionKey: 'rules.proper-ellipsis.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => ProperEllipsisOptions {
    return ProperEllipsisOptions;
  }
  apply(text: string, options: ProperEllipsisOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image], text, (text) => {
      return text.replaceAll(ellipsisRegex, '…');
    });
  }
  get exampleBuilders(): ExampleBuilder<ProperEllipsisOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Replacing three consecutive dots with an ellipsis.',
        before: dedent`
          Lorem (...) Impsum.
        `,
        after: dedent`
          Lorem (…) Impsum.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ProperEllipsisOptions>[] {
    return [];
  }
}
