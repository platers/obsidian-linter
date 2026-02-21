// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L38-L48
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {lineStartingWithWhitespaceOrBlockquoteTemplate} from '../utils/regex';

class PreventDoubleListItemIndicatorOnPasteOptions implements Options {
  @RuleBuilder.noSettingControl()
    lineContent: string;
  @RuleBuilder.noSettingControl()
    selectedText: string;
}

@RuleBuilder.register
export default class PreventDoubleListItemIndicatorOnPaste extends RuleBuilder<PreventDoubleListItemIndicatorOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.prevent-double-list-item-indicator-on-paste.name',
      descriptionKey: 'rules.prevent-double-list-item-indicator-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => PreventDoubleListItemIndicatorOnPasteOptions {
    return PreventDoubleListItemIndicatorOnPasteOptions;
  }
  apply(text: string, options: PreventDoubleListItemIndicatorOnPasteOptions): string {
    const indentedOrBlockquoteNestedListIndicatorRegex = new RegExp(`^${lineStartingWithWhitespaceOrBlockquoteTemplate}[*+-] `);
    const listRegex = /^\s*[*+-] /;

    const isListLine = indentedOrBlockquoteNestedListIndicatorRegex.test(options.lineContent);
    const selectedTextStartsWithListItem = indentedOrBlockquoteNestedListIndicatorRegex.test(options.selectedText);
    const isListClipboard = listRegex.test(text);
    if (!isListLine || !isListClipboard || selectedTextStartsWithListItem) {
      return text;
    }

    const listContentMatch = options.lineContent.match(/^(\s*(>\s*)*[*+-]\s*)(.*)$/);
    const hasContent = listContentMatch && listContentMatch[3].trim().length > 0;

    if (!hasContent) {
      return text.replace(listRegex, '');
    } else {
      const cleanContent = text.replace(listRegex, '');
      return '\n- ' + cleanContent.trim();
    }
  }
  get exampleBuilders(): ExampleBuilder<PreventDoubleListItemIndicatorOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Line being pasted is left alone when current line has no list indicator in it: `Regular text here`',
        before: dedent`
          - List item being pasted
        `,
        after: dedent`
          - List item being pasted
        `,
        options: {
          lineContent: 'Regular text here',
          selectedText: '',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted into a blockquote without a list indicator is left alone when it lacks a list indicator: `> > `',
        before: dedent`
          * List item contents here
          More content here
        `,
        after: dedent`
          * List item contents here
          More content here
        `,
        options: {
          lineContent: '> > ',
          selectedText: '',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted into a blockquote with a list indicator is has its list indicator removed when current line is: `> * `',
        before: dedent`
          + List item contents here
          More content here
        `,
        after: dedent`
          List item contents here
          More content here
        `,
        options: {
          lineContent: '> * ',
          selectedText: '',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted with a list indicator is has its list indicator removed when current line is: `+ `',
        before: dedent`
          - List item 1
          - List item 2
        `,
        after: dedent`
          List item 1
          - List item 2
        `,
        options: {
          lineContent: '+ ',
          selectedText: '',
        },
      }),
      new ExampleBuilder({ // accounts for https://github.com/platers/obsidian-linter/issues/801
        description: 'When pasting a list item and the selected text starts with a list item indicator, the text to paste should still start with a list item indicator',
        before: dedent`
          - List item 1
          - List item 2
        `,
        after: dedent`
          - List item 1
          - List item 2
        `,
        options: {
          lineContent: '+ ',
          selectedText: '+ ',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<PreventDoubleListItemIndicatorOnPasteOptions>[] {
    return [];
  }
}
