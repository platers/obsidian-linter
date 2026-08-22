import {Options, rulesDict, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {reflowParagraphsOneSentencePerLine} from '../utils/mdast';
import {DEFAULT_ABBREVIATIONS, DEFAULT_SENTENCE_TERMINATORS} from '../utils/sentence-splitting';
import {BooleanOption} from '../option';
import {ConfirmRuleDisableModal} from '../ui/modals/confirm-rule-disable-modal';
import {App} from 'obsidian';

class SentencePerLineOptions implements Options {
  sentenceTerminators?: string = DEFAULT_SENTENCE_TERMINATORS;
  abbreviationList?: string[] = [...DEFAULT_ABBREVIATIONS];
}

@RuleBuilder.register
export default class SentencePerLine extends RuleBuilder<SentencePerLineOptions> {
  constructor() {
    super({
      nameKey: 'rules.sentence-per-line.name',
      descriptionKey: 'rules.sentence-per-line.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.inlineCode, IgnoreTypes.inlineMath, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.image, IgnoreTypes.url, IgnoreTypes.anchorTag, IgnoreTypes.tag, IgnoreTypes.yaml, IgnoreTypes.table, IgnoreTypes.obsidianMultiLineComments],
      disableConflictingOptions(value: boolean, app: App): void {
        const twoSpacesEnableOption = rulesDict['two-spaces-between-lines-with-content'].options[0] as BooleanOption;
        if (value && twoSpacesEnableOption.getValue()) {
          new ConfirmRuleDisableModal(app, 'rules.two-spaces-between-lines-with-content.name', 'rules.sentence-per-line.name', () => {
            twoSpacesEnableOption.setValue(false);
          },
          () => {
            (rulesDict['sentence-per-line'].options[0] as BooleanOption).setValue(false);
          }).open();
        }
      },
    });
  }
  get OptionsClass(): new () => SentencePerLineOptions {
    return SentencePerLineOptions;
  }
  apply(text: string, options: SentencePerLineOptions): string {
    const terminators = options.sentenceTerminators ?? '';
    // an empty/blank terminator set makes the rule a no-op (never collapse soft
    // wraps, never throw, never match-everything)
    if (terminators.trim() === '') {
      return text;
    }

    return reflowParagraphsOneSentencePerLine(text, terminators, options.abbreviationList ?? []);
  }
  get exampleBuilders(): ExampleBuilder<SentencePerLineOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Each sentence in a paragraph is put on its own line',
        before: dedent`
          This is a sentence. This is another sentence.
        `,
        after: dedent`
          This is a sentence.
          This is another sentence.
        `,
      }),
      new ExampleBuilder({
        description: 'Abbreviations, decimals, and initials are not treated as the end of a sentence',
        before: dedent`
          The value is 3.14 according to Dr. Smith. It is e.g. quite useful.
        `,
        after: dedent`
          The value is 3.14 according to Dr. Smith.
          It is e.g. quite useful.
        `,
      }),
      new ExampleBuilder({
        description: 'A sentence that starts with a link is still split correctly',
        before: dedent`
          See the start. [The docs](https://example.com) explain it.
        `,
        after: dedent`
          See the start.
          [The docs](https://example.com) explain it.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<SentencePerLineOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: SentencePerLineOptions,
        nameKey: 'rules.sentence-per-line.sentence-terminators.name',
        descriptionKey: 'rules.sentence-per-line.sentence-terminators.description',
        optionsKey: 'sentenceTerminators',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: SentencePerLineOptions,
        nameKey: 'rules.sentence-per-line.abbreviations.name',
        descriptionKey: 'rules.sentence-per-line.abbreviations.description',
        optionsKey: 'abbreviationList',
      }),
    ];
  }
}
