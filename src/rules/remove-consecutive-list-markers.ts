import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';

class RemoveConsecutiveListMarkersOptions implements Options {}

@RuleBuilder.register
export default class RemoveConsecutiveListMarkers extends RuleBuilder<RemoveConsecutiveListMarkersOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-consecutive-list-markers.name',
      descriptionKey: 'rules.remove-consecutive-list-markers.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => RemoveConsecutiveListMarkersOptions {
    return RemoveConsecutiveListMarkersOptions;
  }
  apply(text: string, options: RemoveConsecutiveListMarkersOptions): string {
    return text.replace(/^([ |\t]*)- - (\p{L})/gmu, '$1- $2');
  }
  get exampleBuilders(): ExampleBuilder<RemoveConsecutiveListMarkersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removing consecutive list markers.',
        before: dedent`
          - item 1
          - - copypasted item A
          - item 2
            - indented item
            - - copypasted item B
        `,
        after: dedent`
          - item 1
          - copypasted item A
          - item 2
            - indented item
            - copypasted item B
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveConsecutiveListMarkersOptions>[] {
    return [];
  }
}
