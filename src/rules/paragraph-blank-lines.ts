import {IgnoreTypes} from '../utils/ignore-types';
import {makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs} from '../utils/mdast';
import {Options, rulesDict, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {BooleanOption} from '../option';
import {ConfirmRuleDisableModal} from '../ui/modals/confirm-rule-disable-modal';
import {App} from 'obsidian';

class ParagraphBlankLinesOptions implements Options {}

@RuleBuilder.register
export default class ParagraphBlankLines extends RuleBuilder<ParagraphBlankLinesOptions> {
  constructor() {
    super({
      nameKey: 'rules.paragraph-blank-lines.name',
      descriptionKey: 'rules.paragraph-blank-lines.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.obsidianMultiLineComments, IgnoreTypes.yaml, IgnoreTypes.table],
      disableConflictingOptions(value: boolean, app: App): void {
        const twoSpacesEnableOption = rulesDict['two-spaces-between-lines-with-content'].options[0] as BooleanOption;
        if (value && twoSpacesEnableOption.getValue()) {
          new ConfirmRuleDisableModal(app, 'rules.paragraph-blank-lines.name', 'rules.two-spaces-between-lines-with-content.name', () => {
            twoSpacesEnableOption.setValue(false);
          },
          () => {
            (rulesDict['paragraph-blank-lines'].options[0] as BooleanOption).setValue(false);
          }).open();
        }
      },
    });
  }
  get OptionsClass(): new () => ParagraphBlankLinesOptions {
    return ParagraphBlankLinesOptions;
  }
  apply(text: string, options: ParagraphBlankLinesOptions): string {
    return makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs(text);
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
      new ExampleBuilder({
        description: 'Paragraphs can be extended via the use of 2 or more spaces at the end of a line, a line break html or xml, or a backslash (\\)',
        before: dedent`
          # H1
          Content${'  '}
          Paragraph content continued <br>
          Paragraph content continued once more <br/>
          Paragraph content yet again\\
          Last line of paragraph
          A new paragraph
          # H2
        `,
        after: dedent`
          # H1
          ${''}
          Content${'  '}
          Paragraph content continued <br>
          Paragraph content continued once more <br/>
          Paragraph content yet again\\
          Last line of paragraph
          ${''}
          A new paragraph
          ${''}
          # H2
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ParagraphBlankLinesOptions>[] {
    return [];
  }
}
