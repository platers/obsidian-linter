import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveEmptyListMarkersOptions implements Options {
}

export default class RemoveEmptyListMarkers extends RuleBuilder<RemoveEmptyListMarkersOptions> {
  get OptionsClass(): new () => RemoveEmptyListMarkersOptions {
    return RemoveEmptyListMarkersOptions;
  }
  get name(): string {
    return 'Remove Empty List Markers';
  }
  get description(): string {
    return 'Removes empty list markers, i.e. list items without content.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: RemoveEmptyListMarkersOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(/^\s*-\s*\n/gm, '');
    });
  }
  get exampleBuilders(): ExampleBuilder<RemoveEmptyListMarkersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes empty list markers.',
        before: dedent`
          - item 1
          -
          - item 2
        `,
        after: dedent`
          - item 1
          - item 2
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilder<RemoveEmptyListMarkersOptions, any>[] {
    return [];
  }
}
