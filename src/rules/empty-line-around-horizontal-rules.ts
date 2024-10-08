import dedent from 'ts-dedent';
import {Options, RuleType} from '../rules';
import {ensureEmptyLinesAroundHorizontalRule} from '../utils/mdast';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';

class EmptyLineAroundHorizontalRulesOptions implements Options {}

@RuleBuilder.register
export default class EmptyLineAroundHorizontalRules extends RuleBuilder<EmptyLineAroundHorizontalRulesOptions> {
  constructor() {
    super({
      nameKey: 'rules.empty-line-around-horizontal-rules.name',
      descriptionKey: 'rules.empty-line-around-horizontal-rules.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => EmptyLineAroundHorizontalRulesOptions {
    return EmptyLineAroundHorizontalRulesOptions;
  }
  apply(text: string, options: EmptyLineAroundHorizontalRulesOptions): string {
    return ensureEmptyLinesAroundHorizontalRule(text);
  }
  get exampleBuilders(): ExampleBuilder<EmptyLineAroundHorizontalRulesOptions>[] {
    return [
      new ExampleBuilder({
        description:
          'Horizontal rules that start a document do not get an empty line before them.',
        before: dedent`
          ***
          ${''}
          ${''}
          Content
        `,
        after: dedent`
          ***
          ${''}
          Content
        `,
      }),
      new ExampleBuilder({
        description: 'Horizontal rules that end a document do not get an empty line after them.',
        before: dedent`
          ***
          Content
          ***
        `,
        after: dedent`
          ***
          ${''}
          Content
          ${''}
          ***
        `,
      }),
      new ExampleBuilder({
        description: 'All types of horizontal rules are affected by this rule',
        before: dedent`
          - Content 1
          ***
          - Content 2
          ---
          - Content 3
          ___
          - Content 4
        `,
        after: dedent`
          - Content 1
          ${''}
          ***
          ${''}
          - Content 2
          ${''}
          ---
          ${''}
          - Content 3
          ${''}
          ___
          ${''}
          - Content 4
        `,
      }),
      new ExampleBuilder({
        description: 'YAML frontmatter is not affected by this rule',
        before: dedent`
          ---
          prop: value
          ---
          ${''}
          Content
        `,
        after: dedent`
          ---
          prop: value
          ---
          ${''}
          Content
        `,
      }),
      new ExampleBuilder({
        description: 'Paragraphs above `---` are treated as a heading and not spaced apart',
        before: dedent`
          Content
          ---
        `,
        after: dedent`
          Content
          ---
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundHorizontalRulesOptions>[] {
    return [];
  }
}
