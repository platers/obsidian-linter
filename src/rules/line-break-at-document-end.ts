import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';

class LineBreakAtDocumentEndOptions implements Options {
}

export default class LineBreakAtDocumentEnd extends RuleBuilder<LineBreakAtDocumentEndOptions> {
  get OptionsClass(): new () => LineBreakAtDocumentEndOptions {
    return LineBreakAtDocumentEndOptions;
  }
  get name(): string {
    return 'Line Break at Document End';
  }
  get description(): string {
    return 'Ensures that there is exactly one line break at the end of a document.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: LineBreakAtDocumentEndOptions): string {
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

        `,
      }),
      new ExampleBuilder({
        description: 'Removing trailing line breaks to the end of the document, except one.',
        before: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.



        `,
        after: dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilder<LineBreakAtDocumentEndOptions, any>[] {
    return [];
  }
}
