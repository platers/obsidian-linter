import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {moveFootnotesToEnd} from '../utils/mdast';

class MoveFootnotesToTheBottomOptions implements Options {
  includeBlankLineBetweenFootnotes?: boolean = false;
}

@RuleBuilder.register
export default class MoveFootnotesToTheBottom extends RuleBuilder<MoveFootnotesToTheBottomOptions> {
  constructor() {
    super({
      nameKey: 'rules.move-footnotes-to-the-bottom.name',
      descriptionKey: 'rules.move-footnotes-to-the-bottom.description',
      type: RuleType.FOOTNOTE,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.yaml],
    });
  }
  get OptionsClass(): new () => MoveFootnotesToTheBottomOptions {
    return MoveFootnotesToTheBottomOptions;
  }
  apply(text: string, options: MoveFootnotesToTheBottomOptions): string {
    return moveFootnotesToEnd(text, options.includeBlankLineBetweenFootnotes);
  }
  get exampleBuilders(): ExampleBuilder<MoveFootnotesToTheBottomOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Moving footnotes to the bottom',
        before: dedent`
          Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.
          ${''}
          [^1]: first footnote
          ${''}
          Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
          [^2]: second footnote
          ${''}
          Maecenas malesuada dignissim purus ac volutpat.
        `,
        after: dedent`
          Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.
          ${''}
          Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
          Maecenas malesuada dignissim purus ac volutpat.
          ${''}
          [^1]: first footnote
          [^2]: second footnote
        `,
      }),
      new ExampleBuilder({
        description: 'Moving footnotes to the bottom with including a blank line between footnotes',
        before: dedent`
          Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.
          ${''}
          [^1]: first footnote
          ${''}
          Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
          [^2]: second footnote
          ${''}
          Maecenas malesuada dignissim purus ac volutpat.
        `,
        after: dedent`
          Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.
          ${''}
          Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
          Maecenas malesuada dignissim purus ac volutpat.
          ${''}
          [^1]: first footnote
          ${''}
          [^2]: second footnote
        `,
        options: {
          includeBlankLineBetweenFootnotes: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<MoveFootnotesToTheBottomOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: MoveFootnotesToTheBottomOptions,
        nameKey: 'rules.move-footnotes-to-the-bottom.include-blank-line-between-footnotes.name',
        descriptionKey: 'rules.move-footnotes-to-the-bottom.include-blank-line-between-footnotes.description',
        optionsKey: 'includeBlankLineBetweenFootnotes',
      }),
    ];
  }
}
