import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class LineBreakAtDocumentEndOptions implements Options {}

@RuleBuilder.register
export default class LineBreakAtDocumentEnd extends RuleBuilder<LineBreakAtDocumentEndOptions> {
  constructor() {
    super({
      nameKey: 'rules.line-break-at-document-end.name',
      descriptionKey: 'rules.line-break-at-document-end.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => LineBreakAtDocumentEndOptions {
    return LineBreakAtDocumentEndOptions;
  }
  apply(text: string, options: LineBreakAtDocumentEndOptions): string {
    if (text.length === 0) {
      return text;
    }

    text = text.replace(/\n+$/g, '');
    text += '\n';
    return text;
  }
  get exampleBuilders(): ExampleBuilder<LineBreakAtDocumentEndOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Appending a line break to the end of the document.',
        before: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        `,
        after: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          ${''}
        `,
      }),
      new ExampleBuilder({
        description: 'Removing trailing line breaks to the end of the document, except one.',
        before: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          ${''}
          ${''}
          ${''}
        `,
        after: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          ${''}
        `,
      }),
      new ExampleBuilder({ // https://github.com/platers/obsidian-linter/issues/1228
        description: 'Empty files will not have a blank line added',
        before: dedent``,
        after: dedent``,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<LineBreakAtDocumentEndOptions>[] {
    return [];
  }
}
