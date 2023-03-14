import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class ConvertBulletListMarkersOptions implements Options {}

@RuleBuilder.register
export default class ConvertBulletListMarkers extends RuleBuilder<ConvertBulletListMarkersOptions> {
  constructor() {
    super({
      nameKey: 'rules.convert-bullet-list-markers.name',
      descriptionKey: 'rules.convert-bullet-list-markers.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => ConvertBulletListMarkersOptions {
    return ConvertBulletListMarkersOptions;
  }
  apply(text: string, options: ConvertBulletListMarkersOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
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
  get optionBuilders(): OptionBuilderBase<ConvertBulletListMarkersOptions>[] {
    return [];
  }
}
