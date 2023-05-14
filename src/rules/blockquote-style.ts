import {updateBlockquotes} from '../utils/mdast';
import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes, ignoreListOfTypes} from '../utils/ignore-types';

type BlockquoteStyleValues = 'no space' | 'space';

class BlockquoteStyleOptions implements Options {
  style: BlockquoteStyleValues = 'space';
}

@RuleBuilder.register
export default class BlockquoteStyle extends RuleBuilder<BlockquoteStyleOptions> {
  constructor() {
    super({
      nameKey: 'rules.blockquote-style.name',
      descriptionKey: 'rules.blockquote-style.description',
      type: RuleType.CONTENT,
      hasSpecialExecutionOrder: true, // to make sure we run after the other rules to make sure all blockquotes are affected and follow the same style
    });
  }
  get OptionsClass(): new () => BlockquoteStyleOptions {
    return BlockquoteStyleOptions;
  }
  apply(text: string, options: BlockquoteStyleOptions): string {
    return ignoreListOfTypes([IgnoreTypes.html], text, (text) => {
      if (options.style === 'space') {
        return updateBlockquotes(text, this.addSpaceToIndicator);
      }

      return updateBlockquotes(text, this.removeSpaceFromIndicator);
    });
  }
  removeSpaceFromIndicator(blockquote: string): string {
    return blockquote.replace(/>( |\t)+/g, '>');
  }
  addSpaceToIndicator(blockquote: string): string {
    // first we add spaces to blockquote indicators that are not followed by a space and then to catch any that were not handled already
    // we make sure to add a space between any 2 indicators that are side by side
    return blockquote.replace(/>([^ ])/g, '> $1').replace(/>>/g, '> >');
  }
  get exampleBuilders(): ExampleBuilder<BlockquoteStyleOptions>[] {
    return [
      new ExampleBuilder({
        description: 'When style = `space`, a space is added to blockquotes missing a space after the indicator',
        before: dedent`
          >Blockquotes will have a space added if one is not present
          > Will be left as is.
          ${''}
          > Nested blockquotes are also updated
          >>Nesting levels are handled correctly
          >> Even when only partially needing updates
          > >Updated as well
          >>>>>>> Is handled too
          > > >>> As well
          ${''}
          > <strong>Note that html is not affected in blockquotes</strong>
        `,
        after: dedent`
          > Blockquotes will have a space added if one is not present
          > Will be left as is.
          ${''}
          > Nested blockquotes are also updated
          > > Nesting levels are handled correctly
          > > Even when only partially needing updates
          > > Updated as well
          > > > > > > > Is handled too
          > > > > > As well
          ${''}
          > <strong>Note that html is not affected in blockquotes</strong>
        `,
      }),
      new ExampleBuilder({
        description: 'When style = `no space`, spaces are removed after a blockquote indicator',
        before: dedent`
          >    Multiple spaces are removed
          > > Nesting is handled
          > > > > >  Especially when multiple levels are involved
          > >>> > Even when partially correct already, it is handled
        `,
        after: dedent`
          >Multiple spaces are removed
          >>Nesting is handled
          >>>>>Especially when multiple levels are involved
          >>>>>Even when partially correct already, it is handled
        `,
        options: {
          style: 'no space',
        },
      }),

    ];
  }
  get optionBuilders(): OptionBuilderBase<BlockquoteStyleOptions>[] {
    return [
      new DropdownOptionBuilder<BlockquoteStyleOptions, BlockquoteStyleValues>({
        OptionsClass: BlockquoteStyleOptions,
        nameKey: 'rules.blockquote-style.style.name',
        descriptionKey: 'rules.blockquote-style.style.description',
        optionsKey: 'style',
        records: [
          {
            value: 'space',
            description: '> indicator is followed by a space',
          },
          {
            value: 'no space',
            description: '>indicator is not followed by a space',
          },
        ],
      }),

    ];
  }
}
