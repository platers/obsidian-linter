import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {moveFootnotesToEnd} from '../utils/mdast';

class MoveFootnotesToTheBottomOptions implements Options {}

@RuleBuilder.register
export default class MoveFootnotesToTheBottom extends RuleBuilder<MoveFootnotesToTheBottomOptions> {
  constructor() {
    super({
      nameKey: 'rules.move-footnotes-to-the-bottom.name',
      descriptionKey: 'rules.move-footnotes-to-the-bottom.description',
      type: RuleType.FOOTNOTE,
    });
  }
  get OptionsClass(): new () => MoveFootnotesToTheBottomOptions {
    return MoveFootnotesToTheBottomOptions;
  }
  apply(text: string, options: MoveFootnotesToTheBottomOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.inlineCode, IgnoreTypes.math, IgnoreTypes.yaml], text, (text) => {
      return moveFootnotesToEnd(text);
    });
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
    ];
  }
  get optionBuilders(): OptionBuilderBase<MoveFootnotesToTheBottomOptions>[] {
    return [];
  }
}
