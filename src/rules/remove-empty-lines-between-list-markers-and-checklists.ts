import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {checklistBoxIndicator} from '../utils/regex';

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
  apply(text: string, options: RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions): string {
    // account for '- [.]' where the period is any character except a line break character
    const checkBoxMarkerRegexText = `(( |\\t)*- ${checklistBoxIndicator}( |\\t)+.+)`;
    text = this.replaceEmptyLinesBetweenList(text, checkBoxMarkerRegexText);

    // account for ordered list marker
    const orderedMarkerRegexText = '(( |\\t)*\\d+\\.( |\\t)+.+)';
    text = this.replaceEmptyLinesBetweenList(text, orderedMarkerRegexText);

    // account for '+' list marker
    const plusMarkerRegexText = '(( |\\t)*\\+( |\\t)+.+)';
    text = this.replaceEmptyLinesBetweenList(text, plusMarkerRegexText);

    // account for '-' list marker
    const dashMarkerRegexText = `(( |\\t)*-(?! ${checklistBoxIndicator})( |\\t)+.+)`;
    text = this.replaceEmptyLinesBetweenList(text, dashMarkerRegexText);

    // account for '*' list marker
    const splatMarkerRegexText = '(( |\\t)*\\*( |\\t)+.+)';
    return this.replaceEmptyLinesBetweenList(text, splatMarkerRegexText);
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
        description: 'Blank lines are removed between list items when the list indicator is \'-\'',
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
        description: 'Blank lines are removed between list items when the list indicator is \'+\'',
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
        description: 'Blank lines are removed between list items when the list indicator is \'*\'',
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
        description: 'Blanks lines are removed between like list types (ordered, specific list item indicators, and checklists) while blanks are left between different kinds of list item indicators',
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
