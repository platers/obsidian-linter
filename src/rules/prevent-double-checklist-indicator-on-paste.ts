// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L50-L60
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {lineStartingWithWhitespaceOrBlockquoteTemplate} from '../utils/regex';

class PreventDoubleChecklistIndicatorOnPasteOptions implements Options {
  @RuleBuilder.noSettingControl()
    lineContent: string;
}

@RuleBuilder.register
export default class PreventDoubleChecklistIndicatorOnPaste extends RuleBuilder<PreventDoubleChecklistIndicatorOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.prevent-double-checklist-indicator-on-paste.name',
      descriptionKey: 'rules.prevent-double-checklist-indicator-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => PreventDoubleChecklistIndicatorOnPasteOptions {
    return PreventDoubleChecklistIndicatorOnPasteOptions;
  }
  apply(text: string, options: PreventDoubleChecklistIndicatorOnPasteOptions): string {
    const indentedOrBlockquoteNestedChecklistIndicatorRegex = new RegExp(`^${lineStartingWithWhitespaceOrBlockquoteTemplate}- \\[[ x]] `);
    const checklistRegex = /^\s*- \[[ x]] /;

    const isChecklistLine = indentedOrBlockquoteNestedChecklistIndicatorRegex.test(options.lineContent);
    const isChecklistClipboard = checklistRegex.test(text);
    if (!isChecklistLine || !isChecklistClipboard) {
      return text;
    }

    return text.replace(checklistRegex, '');
  }
  get exampleBuilders(): ExampleBuilder<PreventDoubleChecklistIndicatorOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Line being pasted is left alone when current line has no checklist indicator in it: `Regular text here`',
        before: dedent`
          - [ ] Checklist item being pasted
        `,
        after: dedent`
          - [ ] Checklist item being pasted
        `,
        options: {
          lineContent: 'Regular text here',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted into a blockquote without a checklist indicator is left alone when it lacks a checklist indicator: `> > `',
        before: dedent`
          - [ ] Checklist item contents here
          More content here
        `,
        after: dedent`
          - [ ] Checklist item contents here
          More content here
        `,
        options: {
          lineContent: '> > ',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted into a blockquote with a checklist indicator is has its checklist indicator removed when current line is: `> - [x] `',
        before: dedent`
          - [ ] Checklist item contents here
          More content here
        `,
        after: dedent`
          Checklist item contents here
          More content here
        `,
        options: {
          lineContent: '> - [x] ',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted with a checklist indicator is has its checklist indicator removed when current line is: `- [ ] `',
        before: dedent`
          - [x] Checklist item 1
          - [ ] Checklist item 2
        `,
        after: dedent`
          Checklist item 1
          - [ ] Checklist item 2
        `,
        options: {
          lineContent: '- [ ] ',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<PreventDoubleChecklistIndicatorOnPasteOptions>[] {
    return [];
  }
}
