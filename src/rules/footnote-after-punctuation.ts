import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class FootnoteAfterPunctuationOptions implements Options {}

@RuleBuilder.register
export default class FootnoteAfterPunctuation extends RuleBuilder<FootnoteAfterPunctuationOptions> {
  constructor() {
    super({
      nameKey: 'rules.footnote-after-punctuation.name',
      descriptionKey: 'rules.footnote-after-punctuation.description',
      type: RuleType.FOOTNOTE,
    });
  }
  get OptionsClass(): new () => FootnoteAfterPunctuationOptions {
    return FootnoteAfterPunctuationOptions;
  }
  apply(text: string, options: FootnoteAfterPunctuationOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.footnoteAtStartOfLine, IgnoreTypes.footnoteAfterATask], text, (text) => {
      return text.replace(/(\[\^\w+\]) ?([,.;!:?])/gm, '$2$1');
    });
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
