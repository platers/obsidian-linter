// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L14
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveMultipleBlankLinesOnPasteOptions implements Options {}

@RuleBuilder.register
export default class RemoveMultipleBlankLinesOnPaste extends RuleBuilder<RemoveMultipleBlankLinesOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-multiple-blank-lines-on-paste.name',
      descriptionKey: 'rules.remove-multiple-blank-lines-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => RemoveMultipleBlankLinesOnPasteOptions {
    return RemoveMultipleBlankLinesOnPasteOptions;
  }
  apply(text: string, options: RemoveMultipleBlankLinesOnPasteOptions): string {
    return text.replace(/\n{3,}/g, '\n\n');
  }
  get exampleBuilders(): ExampleBuilder<RemoveMultipleBlankLinesOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Multiple blanks lines condensed down to one',
        before: dedent`
          Here is the first line.
          ${''}
          ${''}
          ${''}
          ${''}
          Here is some more text.
        `,
        after: dedent`
          Here is the first line.
          ${''}
          Here is some more text.
        `,
      }),
      new ExampleBuilder({
        description: 'Text with only one blank line in a row is left alone',
        before: dedent`
          First line.
          ${''}
          Last line.
        `,
        after: dedent`
          First line.
          ${''}
          Last line.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveMultipleBlankLinesOnPasteOptions>[] {
    return [];
  }
}
