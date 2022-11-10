import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs} from '../utils/mdast';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class ParagraphBlankLinesOptions implements Options {
}

@RuleBuilder.register
export default class ParagraphBlankLines extends RuleBuilder<ParagraphBlankLinesOptions> {
  get OptionsClass(): new () => ParagraphBlankLinesOptions {
    return ParagraphBlankLinesOptions;
  }
  get name(): string {
    return 'Paragraph blank lines';
  }
  get description(): string {
    return 'All paragraphs should have exactly one blank line both before and after.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: ParagraphBlankLinesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.obsidianMultiLineComments, IgnoreTypes.yaml, IgnoreTypes.table], text, makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs);
  }
  get exampleBuilders(): ExampleBuilder<ParagraphBlankLinesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Paragraphs should be surrounded by blank lines',
        before: dedent`
          # H1
          Newlines are inserted.
          A paragraph is a line that starts with a letter.
        `,
        after: dedent`
          # H1
          ${''}
          Newlines are inserted.
          ${''}
          A paragraph is a line that starts with a letter.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ParagraphBlankLinesOptions>[] {
    return [];
  }
}
