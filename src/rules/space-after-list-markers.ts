import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';

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
  apply(text: string, options: SpaceAfterListMarkersOptions, protectedRanges: ProtectedRanges): string {
    const rangesForMatch = {
      editRange: (match: RegExpMatchArray, startIndex: number): textReplacement => ({
        startIndex: startIndex + match[1].length,
        endIndex: startIndex + match[0].length,
        value: ' ',
      }),
      // Placeholders cannot supply a list marker or a checkbox.
      guardRange: (match: RegExpMatchArray, startIndex: number) => ({startIndex, endIndex: startIndex + match[0].length}),
    };
    const replacements = collectUnprotectedRegexReplacements(
        text, /^(\s*\d+\.|\s*[-+*])[^\S\r\n]+/gm, protectedRanges, rangesForMatch,
    );
    // Ordered markers were already handled above. Omitting that redundant alternative keeps
    // the edits disjoint; normalizing marker whitespace cannot enable a new checkbox match.
    replacements.push(...collectUnprotectedRegexReplacements(
        text, /^(\s*[-+*]\s+\[[ xX]\])[^\S\r\n]+/gm, protectedRanges, rangesForMatch,
    ));
    replacements.sort((a, b) => a.startIndex - b.startIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
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
