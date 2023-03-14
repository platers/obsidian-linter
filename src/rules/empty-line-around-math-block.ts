import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes, ignoreListOfTypes} from '../utils/ignore-types';
import {ensureEmptyLinesAroundMathBlock} from '../utils/mdast';

class EmptyLineAroundMathBlockOptions implements Options {
  @RuleBuilder.noSettingControl()
    minimumNumberOfDollarSignsToBeAMathBlock: number = 2;
}

@RuleBuilder.register
export default class EmptyLineAroundMathBlock extends RuleBuilder<EmptyLineAroundMathBlockOptions> {
  constructor() {
    super({
      nameKey: 'rules.empty-line-around-math-blocks.name',
      descriptionKey: 'rules.empty-line-around-math-blocks.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => EmptyLineAroundMathBlockOptions {
    return EmptyLineAroundMathBlockOptions;
  }
  apply(text: string, options: EmptyLineAroundMathBlockOptions): string {
    return ignoreListOfTypes([IgnoreTypes.yaml, IgnoreTypes.code], text, (text: string) => {
      return ensureEmptyLinesAroundMathBlock(text, options.minimumNumberOfDollarSignsToBeAMathBlock);
    });
  }
  get exampleBuilders(): ExampleBuilder<EmptyLineAroundMathBlockOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Math blocks that start a document do not get an empty line before them.',
        before: dedent`
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
          some more text
        `,
        after: dedent`
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
          ${''}
          some more text
        `,
      }),
      new ExampleBuilder({
        description: 'Math blocks that are singe-line are updated based on the value of `Number of Dollar Signs to Indicate a Math Block` (in this case its value is 2)',
        before: dedent`
          $$\\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}$$
          some more text
        `,
        after: dedent`
          $$\\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}$$
          ${''}
          some more text
        `,
      }),
      new ExampleBuilder({
        description: 'Math blocks that end a document do not get an empty line after them.',
        before: dedent`
          Some text
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
        `,
        after: dedent`
          Some text
          ${''}
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
        `,
      }),
      new ExampleBuilder({
        description: 'Math blocks that are not at the start or the end of the document will have an empty line added before and after them',
        before: dedent`
          Some text
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
          some more text
        `,
        after: dedent`
          Some text
          ${''}
          $$
          \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          $$
          ${''}
          some more text
        `,
      }),
      new ExampleBuilder({
        description: 'Math blocks in callouts or blockquotes have the appropriately formatted blank lines added',
        before: dedent`
          > Math block in blockquote
          > $$
          > \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          > $$
          ${''}
          More content here
          ${''}
          > Math block doubly nested in blockquote
          > > $$
          > > \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          > > $$
        `,
        after: dedent`
          > Math block in blockquote
          >
          > $$
          > \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          > $$
          >
          ${''}
          More content here
          ${''}
          > Math block doubly nested in blockquote
          > >
          > > $$
          > > \\boldsymbol{a}=\\begin{bmatrix}a_x \\\\ a_y\\end{bmatrix}
          > > $$
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundMathBlockOptions>[] {
    return [];
  }
}
