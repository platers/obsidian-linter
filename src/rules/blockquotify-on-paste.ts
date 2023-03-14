// based on https://github.com/chrisgrieser/obsidian-smarter-paste/blob/master/clipboardModification.ts#L20-L36
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class BlockquotifyOnPasteOptions implements Options {
  @RuleBuilder.noSettingControl()
    lineContent: string;
}

@RuleBuilder.register
export default class BlockquotifyOnPaste extends RuleBuilder<BlockquotifyOnPasteOptions> {
  constructor() {
    super({
      nameKey: 'rules.add-blockquote-indentation-on-paste.name',
      descriptionKey: 'rules.add-blockquote-indentation-on-paste.description',
      type: RuleType.PASTE,
    });
  }
  get OptionsClass(): new () => BlockquotifyOnPasteOptions {
    return BlockquotifyOnPasteOptions;
  }
  apply(text: string, options: BlockquotifyOnPasteOptions): string {
    const blockquoteRegex = /^(\s*)((> ?)+) .*/;
    const blockquoteMatch = options.lineContent.match(blockquoteRegex);
    if (!blockquoteMatch) return text;

    const indentation = blockquoteMatch[1] ?? '';
    const blockquoteLevel = blockquoteMatch[2] ?? '';

    return text.trim().replace(/\n/gm, `\n${indentation}${blockquoteLevel} `);
  }
  get exampleBuilders(): ExampleBuilder<BlockquotifyOnPasteOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Line being pasted into regular text does not get blockquotified with current line being `Part 1 of the sentence`',
        before: dedent`
          was much less likely to succeed, but they tried it anyway.
          Part 2 was much more interesting.
        `,
        after: dedent`
          was much less likely to succeed, but they tried it anyway.
          Part 2 was much more interesting.
        `,
        options: {
          lineContent: 'Part 1 of the sentence',
        },
      }),
      new ExampleBuilder({
        description: 'Line being pasted into a blockquote gets blockquotified with current line being `> > `',
        before: dedent`
          ${''}
          This content is being added to a blockquote
          Note that the second line is indented and the surrounding blank lines were trimmed
          ${''}
        `,
        after: dedent`
          This content is being added to a blockquote
          > > Note that the second line is indented and the surrounding blank lines were trimmed
        `,
        options: {
          lineContent: '> > ',
        },
      }),

    ];
  }
  get optionBuilders(): OptionBuilderBase<BlockquotifyOnPasteOptions>[] {
    return [];
  }
}
