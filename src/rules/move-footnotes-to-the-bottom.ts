import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {moveFootnotesToEnd} from '../utils/mdast';

class MoveFootnotesToTheBottomOptions implements Options {
}

@RuleBuilder.register
export default class MoveFootnotesToTheBottom extends RuleBuilder<MoveFootnotesToTheBottomOptions> {
  get OptionsClass(): new () => MoveFootnotesToTheBottomOptions {
    return MoveFootnotesToTheBottomOptions;
  }
  get name(): string {
    return 'Move Footnotes to the bottom';
  }
  get description(): string {
    return 'Move all footnotes to the bottom of the document.';
  }
  get type(): RuleType {
    return RuleType.FOOTNOTE;
  }
  apply(text: string, options: MoveFootnotesToTheBottomOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
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
