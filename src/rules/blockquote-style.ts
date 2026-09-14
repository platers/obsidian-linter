import {updateBlockquotes} from '../utils/mdast';
import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {getStartOfLineWhitespaceOrBlockquoteLevel, replaceTextBetweenStartAndEndWithNewValue} from '../utils/strings';
import {startsWithListMarkerRegex} from '../utils/regex';
import {LintContext, ProtectedRanges, redactProtected} from '../utils/protected-ranges';

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
      ruleIgnoreTypes: [IgnoreTypes.html, IgnoreTypes.code, IgnoreTypes.math],
    });
  }
  get OptionsClass(): new () => BlockquoteStyleOptions {
    return BlockquoteStyleOptions;
  }
  apply(text: string, options: BlockquoteStyleOptions, protectedRanges: ProtectedRanges): string {
    const codeAndMath = LintContext.for(text).protectedRangesFor([IgnoreTypes.code, IgnoreTypes.math]);
    return updateBlockquotes(text, (blockquote: string, offset: number) => {
      const protectedLines: boolean[] = [];
      const listItemMarkerLines: boolean[] = [];
      const linesWithContent: boolean[] = [];
      let currentIndex = 0;
      let done = false;
      do {
        let nextNewLine = blockquote.indexOf('\n', currentIndex);
        if (nextNewLine === -1) {
          nextNewLine = blockquote.length - 1;
          done = true;
        }
        const [startOfLine, startOfIndex] = getStartOfLineWhitespaceOrBlockquoteLevel(blockquote, nextNewLine - 1);
        const lineStart = offset + startOfIndex + 1;
        const contentStart = lineStart + startOfLine.length;
        const lineEnd = offset + nextNewLine + (done ? 1 : 0);
        protectedLines.push(codeAndMath.isProtected(lineStart, lineEnd) || protectedRanges.isProtected(lineStart, contentStart));
        const restOfLine = redactProtected(text, protectedRanges, contentStart, lineEnd);
        listItemMarkerLines.push(startsWithListMarkerRegex.test(restOfLine));
        linesWithContent.push(restOfLine.trim() !== '');
        currentIndex = nextNewLine + 1;
      } while (!done);

      return (currentBlockquote: string) => this.updateBlockquoteLines(currentBlockquote, options.style === 'space' ? this.addSpaceToIndicator : this.removeSpaceFromIndicator, protectedLines, listItemMarkerLines, linesWithContent);
    });
  }
  removeSpaceFromIndicator(this:void, startOfLine: string, isListItemMarkerLine: boolean): string {
    if (isListItemMarkerLine) {
      return startOfLine.replace(/>[ \t]+>/g, '>>');
    }

    return startOfLine.replace(/>[ \t]+/g, '>');
  }
  addSpaceToIndicator(this:void, startOfLine: string, isListItemMarkerLine: boolean, lineHasContent: boolean = true): string {
    // A blockquote line with nothing on it gets no space after its indicator. Adding one leaves
    // trailing whitespace that "trailing spaces" then removes, so with both rules on the two would
    // undo each other forever and the file would never settle.
    if (!lineHasContent) {
      return startOfLine.replace(/>([^ >])/g, '> $1').replace(/>>/g, '> >').replace(/[ \t]+$/, '');
    }

    // first we add spaces to blockquote indicators that are not followed by a space and then to catch any that were not handled already
    // we make sure to add a space between any 2 indicators that are side by side
    const newStartOfLine = startOfLine.replace(/>([^ ]|$)/g, '> $1').replace(/>>/g, '> >');
    if (isListItemMarkerLine) {
      return newStartOfLine;
    }

    // since we are not dealing with a list item or checklist line, we can go ahead and remove multiple spaces
    return newStartOfLine.replace(/>(?:[ \t]{2,}|\t+)/g, '> ');
  }
  updateBlockquoteLines(blockquote: string, startOfLineModification: (startOfLine: string, isListMarker: boolean, lineHasContent: boolean) => string, protectedLines: boolean[], listItemMarkerLines: boolean[], linesWithContent: boolean[]): string {
    let currentIndex = 0;
    let nextNewLine: number;
    let startOfLine: string;
    let updatedStartOfLine: string;
    let startOfIndex: number;
    let newBlockquote = blockquote;
    let breakOutOfLoop = false;
    let lineIndex = 0;

    do {
      nextNewLine = newBlockquote.indexOf('\n', currentIndex);
      if (nextNewLine === -1) {
        nextNewLine = newBlockquote.length -1;
        breakOutOfLoop = true;
      }

      [startOfLine, startOfIndex] = getStartOfLineWhitespaceOrBlockquoteLevel(newBlockquote, nextNewLine-1);

      // we need to ignore code and math blocks to prevent changing values in the display
      const currentLine = lineIndex++;
      if (protectedLines[currentLine]) {
        currentIndex = nextNewLine + 1;
        continue;
      }

      updatedStartOfLine = startOfLineModification(startOfLine, listItemMarkerLines[currentLine], linesWithContent[currentLine]);


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
