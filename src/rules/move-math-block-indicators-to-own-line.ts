import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {makeSureMathBlockIndicatorsAreOnTheirOwnLines} from '../utils/mdast';

class MoveMathBlockIndicatorsToOwnLineOptions implements Options {
  @RuleBuilder.noSettingControl()
    minimumNumberOfDollarSignsToBeAMathBlock: number = 2;
}

@RuleBuilder.register
export default class MoveMathBlockIndicatorsToOwnLine extends RuleBuilder<MoveMathBlockIndicatorsToOwnLineOptions> {
  constructor() {
    super({
      nameKey: 'rules.move-math-block-indicators-to-their-own-line.name',
      descriptionKey: 'rules.move-math-block-indicators-to-their-own-line.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => MoveMathBlockIndicatorsToOwnLineOptions {
    return MoveMathBlockIndicatorsToOwnLineOptions;
  }
  apply(text: string, options: MoveMathBlockIndicatorsToOwnLineOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.inlineCode], text, (text) => {
      return makeSureMathBlockIndicatorsAreOnTheirOwnLines(text, options.minimumNumberOfDollarSignsToBeAMathBlock);
    });
  }
  get exampleBuilders(): ExampleBuilder<MoveMathBlockIndicatorsToOwnLineOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2',
        before: dedent`
          This is left alone:
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
          The following is updated:
          $$L = \\frac{1}{2} \\rho v^2 S C_L$$
        `,
        after: dedent`
          This is left alone:
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
          The following is updated:
          $$
          L = \\frac{1}{2} \\rho v^2 S C_L
          $$
        `,
      }),
      new ExampleBuilder({
        description: 'Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 3 and opening indicator is on the same line as the start of the content',
        before: dedent`
          $$$\\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$$
        `,
        after: dedent`
          $$$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$$
        `,
      }),
      new ExampleBuilder({
        description: 'Moving math block indicator to its own line when `Number of Dollar Signs to Indicate a Math Block` = 2 and ending indicator is on the same line as the ending line of the content',
        before: dedent`
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}$$
        `,
        after: dedent`
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<MoveMathBlockIndicatorsToOwnLineOptions>[] {
    return [];
  }
}
