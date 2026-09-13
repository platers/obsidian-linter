import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges} from '../utils/strings';

class FootnoteAfterPunctuationOptions implements Options {}

@RuleBuilder.register
export default class FootnoteAfterPunctuation extends RuleBuilder<FootnoteAfterPunctuationOptions> {
  constructor() {
    super({
      nameKey: 'rules.footnote-after-punctuation.name',
      descriptionKey: 'rules.footnote-after-punctuation.description',
      type: RuleType.FOOTNOTE,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.footnoteAtStartOfLine, IgnoreTypes.footnoteAfterATask],
      usesProtectedRanges: true,
    });
  }
  get OptionsClass(): new () => FootnoteAfterPunctuationOptions {
    return FootnoteAfterPunctuationOptions;
  }
  apply(text: string, options: FootnoteAfterPunctuationOptions, protectedRanges: ProtectedRanges): string {
    // Matches a footnote reference containing any text except newlines and the
    // terminating ].
    const replacements = collectUnprotectedRegexReplacements(text, /(\[\^[^\]]+\]) ?([,.;!:?])/gm, protectedRanges, {
      guardRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[0].length}),
      editRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[0].length, value: match[2] + match[1]}),
    });
    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
  }
  get exampleBuilders(): ExampleBuilder<FootnoteAfterPunctuationOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Placing footnotes after punctuation.',
        before: dedent`
          Lorem[^1]. Ipsum[^2], doletes.
        `,
        after: dedent`
          Lorem.[^1] Ipsum,[^2] doletes.
        `,
      }),
      new ExampleBuilder({
        description: 'A footnote at the start of a task is not moved to after the punctuation',
        before: dedent`
          - [ ] [^1]: This is a footnote and a task.
          - [ ] This is a footnote and a task that gets swapped with the punctuation[^2]!
          [^2]: This footnote got modified
        `,
        after: dedent`
          - [ ] [^1]: This is a footnote and a task.
          - [ ] This is a footnote and a task that gets swapped with the punctuation![^2]
          [^2]: This footnote got modified
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<FootnoteAfterPunctuationOptions>[] {
    return [];
  }
}
