// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L38-L48
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {lineStartingWithWhitespaceOrBlockquoteTemplate} from '../utils/regex';

class PreventDoubleListItemIndicatorOnPasteOptions implements Options {
  @RuleBuilder.noSettingControl()
    lineContent: string;
}

@RuleBuilder.register
export default class PreventDoubleListItemIndicatorOnPaste extends RuleBuilder<PreventDoubleListItemIndicatorOnPasteOptions> {
  get OptionsClass(): new () => PreventDoubleListItemIndicatorOnPasteOptions {
    return PreventDoubleListItemIndicatorOnPasteOptions;
  }
  get name(): string {
    return 'Prevent Double List Item Indicator on Paste';
  }
  get description(): string {
    return 'Removes starting list indicator from the text to paste if the line the cursor is on in the file has a list indicator';
  }
  get type(): RuleType {
    return RuleType.PASTE;
  }
  apply(text: string, options: PreventDoubleListItemIndicatorOnPasteOptions): string {
    const indentedOrBlockquoteNestedListIndicatorRegex = new RegExp(`^${lineStartingWithWhitespaceOrBlockquoteTemplate}[*+-] `);
    const listRegex = /^\s*[*+-] /;

    const isListLine = indentedOrBlockquoteNestedListIndicatorRegex.test(options.lineContent);
    const isListClipboard = listRegex.test(text);
    if (!isListLine || !isListClipboard) {
      return text;
    }

    return text.replace(listRegex, '');
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
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<PreventDoubleListItemIndicatorOnPasteOptions>[] {
    return [];
  }
}
