import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {getListItemTextPositions} from '../utils/mdast';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {checklistBoxStartsTextRegex, escapeRegExp} from '../utils/regex';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class RemoveSpaceBeforeOrAfterCharactersOptions implements Options {
  charactersToRemoveSpacesBefore: string = ',!?;:).’”]';
  charactersToRemoveSpacesAfter: string = '¿¡‘“([';
}

@RuleBuilder.register
export default class RemoveSpaceBeforeOrAfterCharacters extends RuleBuilder<RemoveSpaceBeforeOrAfterCharactersOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-space-before-or-after-characters.name',
      descriptionKey: 'rules.remove-space-before-or-after-characters.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => RemoveSpaceBeforeOrAfterCharactersOptions {
    return RemoveSpaceBeforeOrAfterCharactersOptions;
  }
  apply(text: string, options: RemoveSpaceBeforeOrAfterCharactersOptions, protectedRanges: ProtectedRanges): string {
    const symbolsBefore = escapeRegExp(options.charactersToRemoveSpacesBefore);
    const symbolsAfter = escapeRegExp(options.charactersToRemoveSpacesAfter);


    if (!symbolsBefore && !symbolsAfter) {
      return text;
    }

    const removeWhitespaceBeforeCharacters = new RegExp(`([ \t])+([${symbolsBefore}])`, 'g');
    const removeWhitespaceAfterCharacters = new RegExp(`([${symbolsAfter}])([ \t])+`, 'g');
    const replacements: textReplacement[] = [];
    const collectReplacements = function(value: string, offset: number, ignored: ProtectedRanges): void {
      replacements.push(...collectUnprotectedRegexReplacements(value, removeWhitespaceBeforeCharacters, ignored, {
        editRange: (match, startIndex) => ({
          startIndex,
          endIndex: startIndex + match[0].length - match[2].length,
          value: '',
        }),
        guardRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[0].length}),
      }, offset));
      replacements.push(...collectUnprotectedRegexReplacements(value, removeWhitespaceAfterCharacters, ignored, {
        editRange: (match, startIndex) => ({
          startIndex: startIndex + match[1].length,
          endIndex: startIndex + match[0].length,
          value: '',
        }),
        guardRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[0].length}),
      }, offset));
    };

    collectReplacements(text, 0, protectedRanges.combinedWith([IgnoreTypes.list, IgnoreTypes.html]));

    for (const {position} of getListItemTextPositions(text)) {
      let startIndex = position.start.offset;
      // Preserve one whitespace character after the marker, including
      // the task marker when mdast recognises it, but leave any additional whitespace editable.
      while (startIndex > 0 && text.charAt(startIndex - 1).trim() === '') {
        startIndex--;
      }
      if (startIndex === 0 || text.charAt(startIndex - 1).trim() !== '') {
        startIndex++;
      }

      if (checklistBoxStartsTextRegex.test(text.substring(startIndex, position.end.offset))) {
        startIndex += 4;
      }
      collectReplacements(text.substring(startIndex, position.end.offset), startIndex, protectedRanges);
    }

    // Both expressions can remove the same whitespace (for example "( )"). Union the deletions
    // before applying them so replaceTextRanges receives ascending, non-overlapping edits.
    const deletions = new ProtectedRanges(replacements).ranges.map((range) => ({...range, value: ''}));
    return replaceTextRanges(text, deletions);
  }
  get exampleBuilders(): ExampleBuilder<RemoveSpaceBeforeOrAfterCharactersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Remove spaces and tabs before and after default symbol set',
        before: dedent`
          In the end , the space gets removed\t .
          The space before the question mark was removed right ?
          The space before the exclamation point gets removed !
          A semicolon ; and colon : have spaces removed before them
          ‘ Text in single quotes ’
          “ Text in double quotes ”
          [ Text in square braces ]
          ( Text in parenthesis )
        `,
        after: dedent`
          In the end, the space gets removed.
          The space before the question mark was removed right?
          The space before the exclamation point gets removed!
          A semicolon; and colon: have spaces removed before them
          ‘Text in single quotes’
          “Text in double quotes”
          [Text in square braces]
          (Text in parenthesis)
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveSpaceBeforeOrAfterCharactersOptions>[] {
    return [
      new TextOptionBuilder({
        nameKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-before.name',
        descriptionKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-before.description',
        OptionsClass: RemoveSpaceBeforeOrAfterCharactersOptions,
        optionsKey: 'charactersToRemoveSpacesBefore',
      }),
      new TextOptionBuilder({
        nameKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-after.name',
        descriptionKey: 'rules.remove-space-before-or-after-characters.characters-to-remove-space-after.description',
        OptionsClass: RemoveSpaceBeforeOrAfterCharactersOptions,
        optionsKey: 'charactersToRemoveSpacesAfter',
      }),
    ];
  }
}
