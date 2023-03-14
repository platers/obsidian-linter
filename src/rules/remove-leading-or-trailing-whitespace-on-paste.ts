// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L17
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveLeadingOrTrailingWhitespaceOnPasteOptions implements Options {}

@RuleBuilder.register
export default class RemoveLeadingOrTrailingWhitespaceOnPaste extends RuleBuilder<RemoveLeadingOrTrailingWhitespaceOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-leading-or-trailing-whitespace-on-paste.name',
      descriptionKey: 'rules.remove-leading-or-trailing-whitespace-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => RemoveLeadingOrTrailingWhitespaceOnPasteOptions {
    return RemoveLeadingOrTrailingWhitespaceOnPasteOptions;
  }
  apply(text: string, options: RemoveLeadingOrTrailingWhitespaceOnPasteOptions): string {
    return text.replace(/^[\n ]+|\s+$/g, '');
  }
  get exampleBuilders(): ExampleBuilder<RemoveLeadingOrTrailingWhitespaceOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes leading spaces and newline characters',
        before: dedent`
          ${''}
          ${''}
                   This text was really indented
          ${''}
        `,
        after: dedent`
          This text was really indented
        `,
      }),
      new ExampleBuilder({
        description: 'Leaves leading tabs alone',
        before: dedent`
          ${''}
          ${''}
          \t\tThis text is really indented
          ${''}
        `,
        after: '\t\tThis text is really indented',
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveLeadingOrTrailingWhitespaceOnPasteOptions>[] {
    return [];
  }
}
