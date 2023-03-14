import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent} from '../utils/mdast';

class TwoSpacesBetweenLinesWithContentOptions implements Options {}

@RuleBuilder.register
export default class TwoSpacesBetweenLinesWithContent extends RuleBuilder<TwoSpacesBetweenLinesWithContentOptions> {
  constructor() {
    super({
      nameKey: 'rules.two-spaces-between-lines-with-content.name',
      descriptionKey: 'rules.two-spaces-between-lines-with-content.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => TwoSpacesBetweenLinesWithContentOptions {
    return TwoSpacesBetweenLinesWithContentOptions;
  }
  apply(text: string, options: TwoSpacesBetweenLinesWithContentOptions): string {
    return ignoreListOfTypes([IgnoreTypes.obsidianMultiLineComments, IgnoreTypes.yaml, IgnoreTypes.table], text, addTwoSpacesAtEndOfLinesFollowedByAnotherLineOfTextContent);
  }
  get exampleBuilders(): ExampleBuilder<TwoSpacesBetweenLinesWithContentOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Make sure two spaces are added to the ends of lines that have content on it and the next line for lists, blockquotes, and paragraphs',
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
          Are left alone
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
          Paragraph lines that end in <br/>
          Or lines that end in <br>
          Are left alone  ${''}
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
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<TwoSpacesBetweenLinesWithContentOptions>[] {
    return [];
  }
}
