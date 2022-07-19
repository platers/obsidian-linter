import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';

class ConvertBulletListMarkersOptions implements Options {
}

export default class ConvertBulletListMarkers extends RuleBuilder<ConvertBulletListMarkersOptions> {
  get OptionsClass(): new () => ConvertBulletListMarkersOptions {
    return ConvertBulletListMarkersOptions;
  }
  get name(): string {
    return 'Convert Bullet List Markers';
  }
  get description(): string {
    return 'Converts common bullet list marker symbols to markdown list markers.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: ConvertBulletListMarkersOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      // Convert [•, §] to - if it's the first non space character on the line
      return text.replace(/^([^\S\n]*)([•§])([^\S\n]*)/gm, '$1-$3');
    });
  }
  get exampleBuilders(): ExampleBuilder<ConvertBulletListMarkersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Converts •',
        before: dedent`
          • item 1
          • item 2
        `,
        after: dedent`
          - item 1
          - item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Converts §',
        before: dedent`
          • item 1
            § item 2
            § item 3
        `,
        after: dedent`
          - item 1
            - item 2
            - item 3
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilder<ConvertBulletListMarkersOptions, any>[] {
    return [];
  }
}
