import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class ProperEllipsisOptions implements Options {
}

@RuleBuilder.register
export default class ProperEllipsis extends RuleBuilder<ProperEllipsisOptions> {
  get OptionsClass(): new () => ProperEllipsisOptions {
    return ProperEllipsisOptions;
  }
  get name(): string {
    return 'Proper Ellipsis';
  }
  get description(): string {
    return 'Replaces three consecutive dots with an ellipsis.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: ProperEllipsisOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replaceAll('...', '…');
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
