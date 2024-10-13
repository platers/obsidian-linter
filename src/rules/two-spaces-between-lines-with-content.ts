import {Options, rulesDict, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {LineBreakIndicators, addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent} from '../utils/mdast';
import {BooleanOption} from '../option';
import {getTextInLanguage} from '../lang/helpers';
import {LinterSettings} from '../settings-data';

class TwoSpacesBetweenLinesWithContentOptions implements Options {
  lineBreakIndicator?: LineBreakIndicators = LineBreakIndicators.TwoSpaces;
}

@RuleBuilder.register
export default class TwoSpacesBetweenLinesWithContent extends RuleBuilder<TwoSpacesBetweenLinesWithContentOptions> {
  constructor() {
    super({
      nameKey: 'rules.two-spaces-between-lines-with-content.name',
      descriptionKey: 'rules.two-spaces-between-lines-with-content.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.obsidianMultiLineComments, IgnoreTypes.yaml, IgnoreTypes.table],
      disableConflictingOptions(value: boolean) {
        const enableOption = rulesDict['paragraph-blank-lines'].options[0];
        if (enableOption instanceof BooleanOption) {
          // if the current value of paragraph blank lines with content is enabled, we cannot disable it
          // the logic for onLayoutReady will handle that scenario
          if (enableOption.getValue()) {
            return;
          }

          enableOption.setDisabled(value, getTextInLanguage('disabled-rule-notice').replaceAll('{NAME}', getTextInLanguage('rules.two-spaces-between-lines-with-content.name')));
        }
      },
      initiallyDisabled(settings: LinterSettings): [boolean, string] {
        if (settings.ruleConfigs['paragraph-blank-lines'] && settings.ruleConfigs['paragraph-blank-lines'].enabled &&
          (!settings.ruleConfigs['two-spaces-between-lines-with-content'] || !settings.ruleConfigs['two-spaces-between-lines-with-content'].enabled)
        ) {
          return [true, getTextInLanguage('disabled-rule-notice').replaceAll('{NAME}', getTextInLanguage('rules.paragraph-blank-lines.name'))];
        }

        return [false, ''];
      },
    });
  }
  get OptionsClass(): new () => TwoSpacesBetweenLinesWithContentOptions {
    return TwoSpacesBetweenLinesWithContentOptions;
  }
  apply(text: string, options: TwoSpacesBetweenLinesWithContentOptions): string {
    return addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent(text, options.lineBreakIndicator);
  }
  get exampleBuilders(): ExampleBuilder<TwoSpacesBetweenLinesWithContentOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Make sure two spaces are added to the ends of lines that have content on it and the next line for lists, blockquotes, and paragraphs when the line break indicator is `  `',
        before: dedent`
          # Heading 1
          First paragraph stays as the first paragraph
          ${''}
          - list item 1
          - list item 2
          Continuation of list item 2
          - list item 3
          ${''}
          1. Item 1
          2. Item 2
          Continuation of item 3
          3. Item 3
          ${''}
          Paragraph for with link [[other file name]].
          Continuation *of* the paragraph has \`inline code block\` __in it__.
          Even more continuation
          ${''}
          Paragraph lines that end in <br/>
          Or lines that end in <br>
          Are left swapped
          Since they mean the same thing
          ${''}
          \`\`\` text
          Code blocks are ignored
          Even with multiple lines
          \`\`\`
          Another paragraph here
          ${''}
          > Blockquotes are affected
          > More content here
          Content here
          ${''}
          <div>
          html content
          should be ignored
          </div>
          Even more content here
          ${''}
        `,
        after: dedent`
          # Heading 1
          First paragraph stays as the first paragraph
          ${''}
          - list item 1
          - list item 2  ${''}
          Continuation of list item 2
          - list item 3
          ${''}
          1. Item 1
          2. Item 2  ${''}
          Continuation of item 3
          3. Item 3
          ${''}
          Paragraph for with link [[other file name]].  ${''}
          Continuation *of* the paragraph has \`inline code block\` __in it__.  ${''}
          Even more continuation
          ${''}
          Paragraph lines that end in  ${''}
          Or lines that end in  ${''}
          Are left swapped  ${''}
          Since they mean the same thing
          ${''}
          \`\`\` text
          Code blocks are ignored
          Even with multiple lines
          \`\`\`
          Another paragraph here
          ${''}
          > Blockquotes are affected  ${''}
          > More content here  ${''}
          Content here
          ${''}
          <div>
          html content
          should be ignored
          </div>
          Even more content here
          ${''}
        `,
        options: {
          lineBreakIndicator: LineBreakIndicators.TwoSpaces,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<TwoSpacesBetweenLinesWithContentOptions>[] {
    return [
      new DropdownOptionBuilder<TwoSpacesBetweenLinesWithContentOptions, LineBreakIndicators>({
        OptionsClass: TwoSpacesBetweenLinesWithContentOptions,
        nameKey: 'rules.two-spaces-between-lines-with-content.line-break-indicator.name',
        descriptionKey: 'rules.two-spaces-between-lines-with-content.line-break-indicator.description',
        optionsKey: 'lineBreakIndicator',
        records: [
          {
            value: LineBreakIndicators.TwoSpaces,
            description: LineBreakIndicators.TwoSpaces,
          },
          {
            value: LineBreakIndicators.LineBreakHtml,
            description: LineBreakIndicators.LineBreakHtml,
          },
          {
            value: LineBreakIndicators.LineBreakHtmlNotXml,
            description: LineBreakIndicators.LineBreakHtmlNotXml,
          },
          {
            value: LineBreakIndicators.Backslash,
            description: LineBreakIndicators.Backslash,
          },
        ],
      }),
    ];
  }
}
