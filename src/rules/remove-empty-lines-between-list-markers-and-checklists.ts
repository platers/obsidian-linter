import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions implements Options {}

@RuleBuilder.register
export default class RemoveEmptyLinesBetweenListMarkersAndChecklists extends RuleBuilder<RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-empty-lines-between-list-markers-and-checklists.name',
      descriptionKey: 'rules.remove-empty-lines-between-list-markers-and-checklists.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions {
    return RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions;
  }
  apply(text: string, options: RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.thematicBreak], text, (text) => {
      const replaceEmptyLinesBetweenList = function(text: string, listIndicatorRegexText: string, replaceWith: string): string {
        const listRegex = new RegExp(`^${listIndicatorRegexText}\n{2,}${listIndicatorRegexText}$`, 'gm');
        let match;
        let newText = text;

        do {
          match = newText.match(listRegex);
          newText = newText.replaceAll(listRegex, replaceWith);
        } while (match);

        return newText;
      };

      /* eslint-disable no-useless-escape */
      // account for '- [x]' and  '- [ ]' checkbox markers
      const checkBoxMarkerRegexText = '(( |\\t)*- \\[( |x)\\]( |\\t)+.+)';
      text = replaceEmptyLinesBetweenList(text, checkBoxMarkerRegexText, '$1\n$5');

      // account for ordered list marker
      const orderedMarkerRegexText = '(( |\\t)*\\d+\\.( |\\t)+.+)';
      text = replaceEmptyLinesBetweenList(text, orderedMarkerRegexText, '$1\n$4');

      // account for '+' list marker
      const plusMarkerRegexText = '(( |\\t)*\\+( |\\t)+.+)';
      text = replaceEmptyLinesBetweenList(text, plusMarkerRegexText, '$1\n$4');

      // account for '-' list marker
      const dashMarkerRegexText = '(( |\\t)*-(?! \\[( |x)\\])( |\\t)+.+)';
      text = replaceEmptyLinesBetweenList(text, dashMarkerRegexText, '$1\n$5');

      // account for '*' list marker
      const splatMarkerRegexText = '(( |\\t)*\\*( |\\t)+.+)';
      return replaceEmptyLinesBetweenList(text, splatMarkerRegexText, '$1\n$4');
      /* eslint-enable no-useless-escape */
    });
  }
  get exampleBuilders(): ExampleBuilder<RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions>[] {
    return [
      new ExampleBuilder({
        description: '',
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
          \t- [ ] Subitem 1
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
          \t- [ ] Subitem 1
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
