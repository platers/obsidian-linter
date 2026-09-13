import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {getListItemTextPositions} from '../utils/mdast';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {checklistBoxStartsTextRegex} from '../utils/regex';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class TrailingSpacesOptions implements Options {
  twoSpaceLineBreak: boolean = false;
}

@RuleBuilder.register
export default class TrailingSpaces extends RuleBuilder<TrailingSpacesOptions> {
  constructor() {
    super({
      nameKey: 'rules.trailing-spaces.name',
      descriptionKey: 'rules.trailing-spaces.description',
      type: RuleType.SPACING,
      hasSpecialExecutionOrder: true, // run after all other possible rules to make sure trailing spaces are properly removed
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
      usesProtectedRanges: true,
    });
  }
  get OptionsClass(): new () => TrailingSpacesOptions {
    return TrailingSpacesOptions;
  }
  apply(text: string, options: TrailingSpacesOptions, protectedRanges: ProtectedRanges): string {
    const expressions = options.twoSpaceLineBreak ? [/(\S)[ \t]$/gm, /(\S)[ \t]{3,}$/gm, /(\S)( ?\t\t? ?)$/gm] : [/[ \t]+$/gm];
    const removeSpaces = (match: RegExpMatchArray, startIndex: number): textReplacement => ({
      startIndex: startIndex + (options.twoSpaceLineBreak ? match[1].length : 0),
      endIndex: startIndex + match[0].length,
      value: '',
    });
    const replacements: textReplacement[] = [];
    const nonListRanges = protectedRanges.combinedWith([IgnoreTypes.list]);
    for (const expression of expressions) {
      replacements.push(...collectUnprotectedRegexReplacements(
          text, expression, nonListRanges, {editRange: removeSpaces, guardRange: removeSpaces},
      ));
    }

    for (const {position, isEmpty} of getListItemTextPositions(text, true)) {
      let startIndex = position.start.offset;
      // Preserve updateListItemText's empty-item, marker spacing and fallback checklist handling.
      if (isEmpty) {
        while (startIndex < position.end.offset && text.charAt(startIndex).trim() !== '') {
          startIndex++;
        }
        if (startIndex < position.end.offset) {
          startIndex++;
        }
      } else {
        while (startIndex > 0 && text.charAt(startIndex - 1).trim() === '') {
          startIndex--;
        }
        if (startIndex === 0 || text.charAt(startIndex - 1).trim() !== '') {
          startIndex++;
        }
      }
      if (checklistBoxStartsTextRegex.test(text.substring(startIndex, position.end.offset))) {
        startIndex += 4;
      }

      for (const expression of expressions) {
        replacements.push(...collectUnprotectedRegexReplacements(
            text.substring(startIndex, position.end.offset), expression,
            protectedRanges, {editRange: removeSpaces, guardRange: removeSpaces}, startIndex,
        ));
      }
    }

    // Lastly check empty lines, including those inside lists. The old tab-only $1 replacement was a no-op.
    const emptyLineExpressions = options.twoSpaceLineBreak ? [/^[ \t]$/gm, /^[ \t]{3,}$/gm] : [/^[ \t]+$/gm];
    const removeEmptyLineSpaces = (match: RegExpMatchArray, startIndex: number): textReplacement => ({
      startIndex, endIndex: startIndex + match[0].length, value: '',
    });
    for (const expression of emptyLineExpressions) {
      replacements.push(...collectUnprotectedRegexReplacements(
          text, expression, protectedRanges, {editRange: removeEmptyLineSpaces, guardRange: removeEmptyLineSpaces},
      ));
    }

    // The expressions and the empty-line pass can select the same whitespace. Merge their deletions.
    replacements.sort((a, b) => a.startIndex - b.startIndex);
    const merged: textReplacement[] = [];
    for (const replacement of replacements) {
      const previous = merged[merged.length - 1];
      if (previous && replacement.startIndex <= previous.endIndex) {
        previous.endIndex = Math.max(previous.endIndex, replacement.endIndex);
      } else {
        merged.push(replacement);
      }
    }
    return replaceTextRanges(text, merged);
  }
  get exampleBuilders(): ExampleBuilder<TrailingSpacesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes trailing spaces and tabs.',
         
        before: dedent`
          # H1
          Line with trailing spaces and tabs.	        ${''}
        `,
         
        after: dedent`
          # H1
          Line with trailing spaces and tabs.
        `,
      }),
      new ExampleBuilder({
        description: 'With `Two space linebreak = true`',
        before: dedent`
          # H1
          Line with trailing spaces and tabs.  ${''}
        `,
        after: dedent`
          # H1
          Line with trailing spaces and tabs.  ${''}
        `,
        options: {
          twoSpaceLineBreak: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<TrailingSpacesOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: TrailingSpacesOptions,
        nameKey: 'rules.trailing-spaces.two-space-line-break.name',
        descriptionKey: 'rules.trailing-spaces.two-space-line-break.description',
        optionsKey: 'twoSpaceLineBreak',
      }),
    ];
  }
}
