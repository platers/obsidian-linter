import {updateBlockquotes} from '../utils/mdast';
import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {getStartOfLineWhitespaceOrBlockquoteLevel, replaceTextBetweenStartAndEndWithNewValue} from '../utils/strings';
import {startsWithListMarkerRegex} from '../utils/regex';

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
      ruleIgnoreTypes: [IgnoreTypes.html, IgnoreTypes.code],
    });
  }
  get OptionsClass(): new () => BlockquoteStyleOptions {
    return BlockquoteStyleOptions;
  }
  apply(text: string, options: BlockquoteStyleOptions): string {
    if (options.style === 'space') {
      return updateBlockquotes(text, (blockquote: string) => {
        return this.updateBlockquoteLines(blockquote, this.addSpaceToIndicator);
      });
    }

    return updateBlockquotes(text, (blockquote: string) => {
      return this.updateBlockquoteLines(blockquote, this.removeSpaceFromIndicator);
    });
  }
  removeSpaceFromIndicator(startOfLine: string, isListItemMarkerLine: boolean): string {
    if (isListItemMarkerLine) {
      return startOfLine.replace(/>[ \t]+>/g, '>>');
    }

    return startOfLine.replace(/>[ \t]+/g, '>');
  }
  addSpaceToIndicator(startOfLine: string, isListItemMarkerLine: boolean): string {
    // first we add spaces to blockquote indicators that are not followed by a space and then to catch any that were not handled already
    // we make sure to add a space between any 2 indicators that are side by side
    const newStartOfLine = startOfLine.replace(/>([^ ]|$)/g, '> $1').replace(/>>/g, '> >');
    if (isListItemMarkerLine) {
      return newStartOfLine;
    }

    // since we are not dealing with a list item or checklist line, we can go ahead and remove multiple spaces
    return newStartOfLine.replace(/>(?:[ \t]{2,}|\t+)/g, '> ');
  }
  updateBlockquoteLines(blockquote: string, startOfLineModification: (startOfLine: string, isListMarker: boolean) => string): string {
    let currentIndex = 0;
    let nextNewLine = 0;
    let startOfLine = '';
    let updatedStartOfLine = '';
    let startOfIndex = 0;
    let newBlockquote = blockquote;
    let breakOutOfLoop = false;
    do {
      nextNewLine = newBlockquote.indexOf('\n', currentIndex);
      if (nextNewLine === -1) {
        nextNewLine = newBlockquote.length -1;
        breakOutOfLoop = true;
      }

      [startOfLine, startOfIndex] = getStartOfLineWhitespaceOrBlockquoteLevel(newBlockquote, nextNewLine-1);
      const startOfRestOfLine = startOfIndex + startOfLine.length+1;

      let endOfRestOfLine = nextNewLine;
      if (breakOutOfLoop) {
        endOfRestOfLine++;
      }

      const restOfLine = newBlockquote.substring(startOfRestOfLine, endOfRestOfLine);
      const isListItemMarker = startsWithListMarkerRegex.test(restOfLine);
      updatedStartOfLine = startOfLineModification(startOfLine, isListItemMarker);

      // since start of index refers to where the new line character is
      startOfIndex++;

      newBlockquote = replaceTextBetweenStartAndEndWithNewValue(newBlockquote, startOfIndex, startOfIndex + startOfLine.length, updatedStartOfLine);

      currentIndex = nextNewLine+ 1 + updatedStartOfLine.length - startOfLine.length;
    } while (!breakOutOfLoop);

    return newBlockquote;
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
