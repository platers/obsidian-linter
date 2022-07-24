import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class FootnoteAfterPunctuationOptions implements Options {
}

@RuleBuilder.register
export default class FootnoteAfterPunctuation extends RuleBuilder<FootnoteAfterPunctuationOptions> {
  get OptionsClass(): new () => FootnoteAfterPunctuationOptions {
    return FootnoteAfterPunctuationOptions;
  }
  get name(): string {
    return 'Footnote after Punctuation';
  }
  get description(): string {
    return 'Ensures that footnote references are placed after punctuation, not before.';
  }
  get type(): RuleType {
    return RuleType.FOOTNOTE;
  }
  apply(text: string, options: FootnoteAfterPunctuationOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
    // regex uses hack to treat lookahead as lookaround https://stackoverflow.com/a/43232659
    // needed to ensure that no footnote text followed by ":" is matched
      return text.replace(/(?!^)(\[\^\w+\]) ?([,.;!:?])/gm, '$2$1');
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
    ];
  }
  get optionBuilders(): OptionBuilderBase<FootnoteAfterPunctuationOptions>[] {
    return [];
  }
}
