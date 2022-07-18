import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class RemoveMultipleSpacesOptions implements Options {
}

export default class RemoveMultipleSpaces extends RuleBuilder<RemoveMultipleSpacesOptions> {
  get OptionsClass(): new () => RemoveMultipleSpacesOptions {
    return RemoveMultipleSpacesOptions;
  }
  get name(): string {
    return 'Remove Multiple Spaces';
  }
  get description(): string {
    return 'Removes two or more consecutive spaces. Ignores spaces at the beginning and ending of the line. ';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: RemoveMultipleSpacesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.table, IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(/(?!^>)([^\s])( ){2,}([^\s])/gm, '$1 $3');
    });
  }
  get exampleBuilders(): ExampleBuilder<RemoveMultipleSpacesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removing double and triple space.',
        before: dedent`
          Lorem ipsum   dolor  sit amet.
        `,
        after: dedent`
          Lorem ipsum dolor sit amet.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilder<RemoveMultipleSpacesOptions, any>[] {
    return [];
  }
}
