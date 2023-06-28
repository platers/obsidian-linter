import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class SpaceAfterListMarkersOptions implements Options {}

@RuleBuilder.register
export default class SpaceAfterListMarkers extends RuleBuilder<SpaceAfterListMarkersOptions> {
  constructor() {
    super({
      nameKey: 'rules.space-after-list-markers.name',
      descriptionKey: 'rules.space-after-list-markers.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => SpaceAfterListMarkersOptions {
    return SpaceAfterListMarkersOptions;
  }
  apply(text: string, options: SpaceAfterListMarkersOptions): string {
    // Space after marker
    text = text.replace(/^(\s*\d+\.|\s*[-+*])[^\S\r\n]+/gm, '$1 ');
    // Space after checkbox
    return text.replace(
        /^(\s*\d+\.|\s*[-+*]\s+\[[ xX]\])[^\S\r\n]+/gm,
        '$1 ',
    );
  }
  get exampleBuilders(): ExampleBuilder<SpaceAfterListMarkersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'A single space is left between the list marker and the text of the list item',
        before: dedent`
          1.   Item 1
          2.  Item 2
          ${''}
          -   [ ] Item 1
          - [x]    Item 2
          \t-  [ ] Item 3
        `,
        after: dedent`
          1. Item 1
          2. Item 2
          ${''}
          - [ ] Item 1
          - [x] Item 2
          \t- [ ] Item 3
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<SpaceAfterListMarkersOptions>[] {
    return [];
  }
}
