import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';

class RemoveHyphenatedLineBreaksOptions implements Options {
}

@RuleBuilder.register
export default class RemoveHyphenatedLineBreaks extends RuleBuilder<RemoveHyphenatedLineBreaksOptions> {
  get OptionsClass(): new () => RemoveHyphenatedLineBreaksOptions {
    return RemoveHyphenatedLineBreaksOptions;
  }
  get name(): string {
    return 'Remove Hyphenated Line Breaks';
  }
  get description(): string {
    return 'Removes hyphenated line breaks. Useful when pasting text from textbooks.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: RemoveHyphenatedLineBreaksOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
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
  get optionBuilders(): OptionBuilder<RemoveHyphenatedLineBreaksOptions, any>[] {
    return [];
  }
}
