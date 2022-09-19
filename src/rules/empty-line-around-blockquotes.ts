import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ensureEmptyLinesAroundBlockquotes} from '../utils/mdast';

class EmptyLineAroundBlockquotesOptions implements Options {
}

@RuleBuilder.register
export default class EmptyLineAroundBlockquotes extends RuleBuilder<EmptyLineAroundBlockquotesOptions> {
  get OptionsClass(): new () => EmptyLineAroundBlockquotesOptions {
    return EmptyLineAroundBlockquotesOptions;
  }
  get name(): string {
    return 'Empty Line Around Code Fences';
  }
  get description(): string {
    return 'Ensures that there is an empty line around code fences unless they start or end a document.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: EmptyLineAroundBlockquotesOptions): string {
    return ensureEmptyLinesAroundBlockquotes(text);
  }
  get exampleBuilders(): ExampleBuilder<EmptyLineAroundBlockquotesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Blockquotes that start a document do not get an empty line before them.',
        before: dedent`
          > Quote content here
          > quote content continued
          # Title here
        `,
        after: dedent`
          > Quote content here
          > quote content continued
          ${''}
          # Title here
        `,
      }),
      new ExampleBuilder({
        description: 'Blockquotes that end a document do not get an empty line after them.',
        before: dedent`
          # Heading 1
          > Quote content here
          > quote content continued
        `,
        after: dedent`
          # Heading 1
          ${''}
          > Quote content here
          > quote content continued
        `,
      }),
      new ExampleBuilder({
        description: 'Blockquotes that are nested the proper empty line added',
        before: dedent`
          # Make sure that nested blockquotes are accounted for correctly
          > Quote content here
          > quote content continued
          > > Nested Blockquote
          > > content continued
          ${''}
          **Note that the empty line is either one less blockquote indicator if followed/proceeded by more blockquote content or it is an empty line**
          ${''}
          # Doubly nested code block
          ${''}
          > > Quote content here
          > > quote content continued
        `,
        after: dedent`
          # Make sure that nested blockquotes are accounted for correctly
          ${''}
          > Quote content here
          > quote content continued
          >
          > > Nested Blockquote
          > > content continued
          ${''}
          **Note that the empty line is either one less blockquote indicator if followed/proceeded by more blockquote content or it is an empty line**
          ${''}
          # Doubly nested code block
          ${''}
          > > Quote content here
          > > quote content continued
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundBlockquotesOptions>[] {
    return [];
  }
}
