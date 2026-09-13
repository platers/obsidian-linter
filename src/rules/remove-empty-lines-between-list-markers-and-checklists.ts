import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {checklistBoxIndicator} from '../utils/regex';
import {ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';
import {getEditsBetween} from '../utils/text-edits';

class RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions implements Options {}

@RuleBuilder.register
export default class RemoveEmptyLinesBetweenListMarkersAndChecklists extends RuleBuilder<RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-empty-lines-between-list-markers-and-checklists.name',
      descriptionKey: 'rules.remove-empty-lines-between-list-markers-and-checklists.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.thematicBreak],
    });
  }
  get OptionsClass(): new () => RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions {
    return RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions;
  }
  apply(text: string, options: RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    // Keep the repeated, ordered passes on the decision view, never on the source.
    let projectedText = projection.text;
    // account for '- [.]' where the period is any character except a line break character
    const checkBoxMarkerRegexText = `(( |\\t)*- ${checklistBoxIndicator}( |\\t)+.+)`;
    projectedText = this.replaceEmptyLinesBetweenList(projectedText, checkBoxMarkerRegexText);

    // account for ordered list marker
    const orderedMarkerRegexText = '(( |\\t)*\\d+\\.( |\\t)+.+)';
    projectedText = this.replaceEmptyLinesBetweenList(projectedText, orderedMarkerRegexText);

    // account for '+' list marker
    const plusMarkerRegexText = '(( |\\t)*\\+( |\\t)+.+)';
    projectedText = this.replaceEmptyLinesBetweenList(projectedText, plusMarkerRegexText);

    // account for '-' list marker
    const dashMarkerRegexText = `(( |\\t)*-(?! ${checklistBoxIndicator})( |\\t)+.+)`;
    projectedText = this.replaceEmptyLinesBetweenList(projectedText, dashMarkerRegexText);

    // account for '*' list marker
    const splatMarkerRegexText = '(( |\\t)*\\*( |\\t)+.+)';
    projectedText = this.replaceEmptyLinesBetweenList(projectedText, splatMarkerRegexText);

    const replacements: textReplacement[] = [];
    for (const edit of getEditsBetween(projection.text, projectedText)) {
      const range = projection.editRangeToSource(edit);
      if (range) {
        replacements.push({...range, value: edit.value});
      }
    }

    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
  }
  replaceEmptyLinesBetweenList = function(text: string, listIndicatorRegexText: string): string {
    const listRegex = new RegExp(`^${listIndicatorRegexText}\n(?:(?:[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+)?\n){1,}${listIndicatorRegexText}$`, 'gm');
    let match;
    let newText = text;

    do {
      match = newText.match(listRegex);
      newText = newText.replaceAll(listRegex, '$1\n$4');
    } while (match);

    return newText;
  };
  get exampleBuilders(): ExampleBuilder<RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Blank lines are removed between ordered list items',
        before: dedent`
          1. Item 1
          ${''}
          2. Item 2
        `,
        after: dedent`
          1. Item 1
          2. Item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Blank lines are removed between list items when the list marker is \'-\'',
        before: dedent`
          - Item 1
          ${''}
          \t- Subitem 1
          ${''}
          - Item 2
        `,
        after: dedent`
          - Item 1
          \t- Subitem 1
          - Item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Blank lines are removed between checklist items',
        before: dedent`
          - [x] Item 1
          ${''}
          \t- [!] Subitem 1
          ${''}
          - [ ] Item 2
        `,
        after: dedent`
          - [x] Item 1
          \t- [!] Subitem 1
          - [ ] Item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Blank lines are removed between list items when the list marker is \'+\'',
        before: dedent`
          + Item 1
          ${''}
          \t+ Subitem 1
          ${''}
          + Item 2
        `,
        after: dedent`
          + Item 1
          \t+ Subitem 1
          + Item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Blank lines are removed between list items when the list marker is \'*\'',
        before: dedent`
          * Item 1
          ${''}
          \t* Subitem 1
          ${''}
          * Item 2
        `,
        after: dedent`
          * Item 1
          \t* Subitem 1
          * Item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Blanks lines are removed between like list types (ordered, specific list item markers, and checklists) while blanks are left between different kinds of list item markers',
        before: dedent`
          1. Item 1
          ${''}
          2. Item 2
          ${''}
          - Item 1
          ${''}
          \t- Subitem 1
          ${''}
          - Item 2
          ${''}
          - [x] Item 1
          ${''}
          \t- [f] Subitem 1
          ${''}
          - [ ] Item 2
          ${''}
          + Item 1
          ${''}
          \t+ Subitem 1
          ${''}
          + Item 2
          ${''}
          * Item 1
          ${''}
          \t* Subitem 1
          ${''}
          * Item 2
        `,
        after: dedent`
          1. Item 1
          2. Item 2
          ${''}
          - Item 1
          \t- Subitem 1
          - Item 2
          ${''}
          - [x] Item 1
          \t- [f] Subitem 1
          - [ ] Item 2
          ${''}
          + Item 1
          \t+ Subitem 1
          + Item 2
          ${''}
          * Item 1
          \t* Subitem 1
          * Item 2
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions>[] {
    return [];
  }
}
