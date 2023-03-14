// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L16
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ellipsisRegex} from '../utils/regex';

class ProperEllipsisOnPasteOptions implements Options {}

@RuleBuilder.register
export default class ProperEllipsisOnPaste extends RuleBuilder<ProperEllipsisOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.proper-ellipsis-on-paste.name',
      descriptionKey: 'rules.proper-ellipsis-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => ProperEllipsisOnPasteOptions {
    return ProperEllipsisOnPasteOptions;
  }
  apply(text: string, options: ProperEllipsisOnPasteOptions): string {
    return text.replaceAll(ellipsisRegex, '…');
  }
  get exampleBuilders(): ExampleBuilder<ProperEllipsisOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Replacing three consecutive dots with an ellipsis even if spaces are present',
        before: dedent`
          Lorem (...) Impsum.
          Lorem (. ..) Impsum.
          Lorem (. . .) Impsum.
        `,
        after: dedent`
          Lorem (…) Impsum.
          Lorem (…) Impsum.
          Lorem (…) Impsum.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ProperEllipsisOnPasteOptions>[] {
    return [];
  }
}
