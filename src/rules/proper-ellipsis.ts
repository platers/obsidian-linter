import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {ellipsisRegex} from '../utils/regex';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class ProperEllipsisOptions implements Options {}

@RuleBuilder.register
export default class ProperEllipsis extends RuleBuilder<ProperEllipsisOptions> {
  constructor() {
    super({
      nameKey: 'rules.proper-ellipsis.name',
      descriptionKey: 'rules.proper-ellipsis.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.image],
      usesProtectedRanges: true,
    });
  }
  get OptionsClass(): new () => ProperEllipsisOptions {
    return ProperEllipsisOptions;
  }
  apply(text: string, options: ProperEllipsisOptions, protectedRanges: ProtectedRanges): string {
    // Each match consumes three dots and the optional spaces between them, not the whole dot run.
    const replaceEllipsis = (match: RegExpMatchArray, startIndex: number): textReplacement => ({
      startIndex,
      endIndex: startIndex + match[0].length,
      value: '…',
    });
    return replaceTextRanges(text, collectUnprotectedRegexReplacements(
        text, ellipsisRegex, protectedRanges, {editRange: replaceEllipsis, guardRange: replaceEllipsis},
    ));
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
