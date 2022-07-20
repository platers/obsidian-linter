import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class RemoveConsecutiveListMarkersOptions implements Options {
}

@RuleBuilder.register
export default class RemoveConsecutiveListMarkers extends RuleBuilder<RemoveConsecutiveListMarkersOptions> {
  get OptionsClass(): new () => RemoveConsecutiveListMarkersOptions {
    return RemoveConsecutiveListMarkersOptions;
  }
  get name(): string {
    return 'Remove Consecutive List Markers';
  }
  get description(): string {
    return 'Removes consecutive list markers. Useful when copy-pasting list items.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: RemoveConsecutiveListMarkersOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(/^([ |\t]*)- - \b/gm, '$1- ');
    });
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
  get optionBuilders(): OptionBuilder<RemoveConsecutiveListMarkersOptions, any>[] {
    return [];
  }
}
