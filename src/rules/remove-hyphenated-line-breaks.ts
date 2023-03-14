import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class RemoveHyphenatedLineBreaksOptions implements Options {}

@RuleBuilder.register
export default class RemoveHyphenatedLineBreaks extends RuleBuilder<RemoveHyphenatedLineBreaksOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-hyphenated-line-breaks.name',
      descriptionKey: 'rules.remove-hyphenated-line-breaks.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => RemoveHyphenatedLineBreaksOptions {
    return RemoveHyphenatedLineBreaksOptions;
  }
  apply(text: string, options: RemoveHyphenatedLineBreaksOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      return text.replace(/\b[-‐] \b/g, '');
    });
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
