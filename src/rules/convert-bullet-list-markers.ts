import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class ConvertBulletListMarkersOptions implements Options {}

@RuleBuilder.register
export default class ConvertBulletListMarkers extends RuleBuilder<ConvertBulletListMarkersOptions> {
  constructor() {
    super({
      nameKey: 'rules.convert-bullet-list-markers.name',
      descriptionKey: 'rules.convert-bullet-list-markers.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
      usesProtectedRanges: true,
    });
  }
  get OptionsClass(): new () => ConvertBulletListMarkersOptions {
    return ConvertBulletListMarkersOptions;
  }
  apply(text: string, options: ConvertBulletListMarkersOptions, protectedRanges: ProtectedRanges): string {
    // Convert [•, §] to - if it's the first non space character on the line
    const replaceMarker = (match: RegExpMatchArray, startIndex: number): textReplacement => ({
      startIndex: startIndex + match[1].length,
      endIndex: startIndex + match[1].length + match[2].length,
      value: '-',
    });
    return replaceTextRanges(text, collectUnprotectedRegexReplacements(
        text, /^([^\S\n]*)([•§])([^\S\n]*)/gm, protectedRanges,
        {editRange: replaceMarker, guardRange: replaceMarker},
    ));
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
