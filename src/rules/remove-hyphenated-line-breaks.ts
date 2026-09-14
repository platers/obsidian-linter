import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class RemoveHyphenatedLineBreaksOptions implements Options {}

@RuleBuilder.register
export default class RemoveHyphenatedLineBreaks extends RuleBuilder<RemoveHyphenatedLineBreaksOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-hyphenated-line-breaks.name',
      descriptionKey: 'rules.remove-hyphenated-line-breaks.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => RemoveHyphenatedLineBreaksOptions {
    return RemoveHyphenatedLineBreaksOptions;
  }
  apply(text: string, options: RemoveHyphenatedLineBreaksOptions, protectedRanges: ProtectedRanges): string {
    const removeHyphen = (match: RegExpMatchArray, startIndex: number): textReplacement => ({
      startIndex,
      endIndex: startIndex + match[0].length,
      value: '',
    });
    return replaceTextRanges(text, collectUnprotectedRegexReplacements(
        text, /\b[-‐] \b/g, protectedRanges, {editRange: removeHyphen, guardRange: removeHyphen},
    ));
  }
  get exampleBuilders(): ExampleBuilder<RemoveHyphenatedLineBreaksOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removing hyphenated line breaks.',
        before: dedent`
          This text has a linebr‐ eak.
        `,
        after: dedent`
          This text has a linebreak.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveHyphenatedLineBreaksOptions>[] {
    return [];
  }
}
