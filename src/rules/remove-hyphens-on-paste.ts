// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L13
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveHyphensOnPasteOptions implements Options {}

@RuleBuilder.register
export default class RemoveHyphensOnPaste extends RuleBuilder<RemoveHyphensOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-hyphens-on-paste.name',
      descriptionKey: 'rules.remove-hyphens-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => RemoveHyphensOnPasteOptions {
    return RemoveHyphensOnPasteOptions;
  }
  apply(text: string, options: RemoveHyphensOnPasteOptions): string {
    return text.replace(/(\S)[-‐]\s+\n?(?=\w)/g, '$1');
  }
  get exampleBuilders(): ExampleBuilder<RemoveHyphensOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Remove hyphen in content to paste',
        before: dedent`
          Text that was cool but hyper-
          tension made it uncool.
        `,
        after: dedent`
          Text that was cool but hypertension made it uncool.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveHyphensOnPasteOptions>[] {
    return [];
  }
}
