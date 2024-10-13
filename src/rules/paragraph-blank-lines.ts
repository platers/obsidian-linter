import {IgnoreTypes} from '../utils/ignore-types';
import {makeSureThereIsOnlyOneBlankLineBeforeAndAfterParagraphs} from '../utils/mdast';
import {Options, rulesDict, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {BooleanOption} from '../option';
import {getTextInLanguage} from '../lang/helpers';
import {LinterSettings} from '../settings-data';

class ParagraphBlankLinesOptions implements Options {}

@RuleBuilder.register
export default class ParagraphBlankLines extends RuleBuilder<ParagraphBlankLinesOptions> {
  constructor() {
    super({
      nameKey: 'rules.paragraph-blank-lines.name',
      descriptionKey: 'rules.paragraph-blank-lines.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.obsidianMultiLineComments, IgnoreTypes.yaml, IgnoreTypes.table],
      disableConflictingOptions(value: boolean) {
        const enableOption = rulesDict['two-spaces-between-lines-with-content'].options[0];
        if (enableOption instanceof BooleanOption) {
          // if the current value of two spaces between lines with content is enabled, we cannot disable it
          // the logic for onLayoutReady will handle that scenario
          if (enableOption.getValue()) {
            return;
          }

          enableOption.setDisabled(value, getTextInLanguage('disabled-rule-notice').replaceAll('{NAME}', getTextInLanguage('rules.paragraph-blank-lines.name')));
        }
      },
      initiallyDisabled(settings: LinterSettings): [boolean, string] {
        if (settings.ruleConfigs['two-spaces-between-lines-with-content'] && settings.ruleConfigs['two-spaces-between-lines-with-content'].enabled &&
          (!settings.ruleConfigs['paragraph-blank-lines'] || !settings.ruleConfigs['paragraph-blank-lines'].enabled)
        ) {
          return [true, getTextInLanguage('disabled-rule-notice').replaceAll('{NAME}', getTextInLanguage('rules.two-spaces-between-lines-with-content.name'))];
        }

        return [false, ''];
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
