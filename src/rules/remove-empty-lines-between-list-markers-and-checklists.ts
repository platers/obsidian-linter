import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions implements Options {
}

@RuleBuilder.register
export default class RemoveEmptyLinesBetweenListMarkersAndChecklists extends RuleBuilder<RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions> {
  get OptionsClass(): new () => RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions {
    return RemoveEmptyLinesBetweenListMarkersAndChecklists;
  }
  get name(): string {
    return 'Remove Empty Lines Between List Markers and Checklists';
  }
  get description(): string {
    return 'There should not be any empty lines between list markers and checklists.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: RemoveEmptyLinesBetweenListMarkersAndChecklistsOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag, IgnoreTypes.thematicBreak], text, (text) => {
      const replaceEmptyLinesBetweenList = function(text: string, listRegex: RegExp, replaceWith: string): string {
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
      const checkboxMarker = new RegExp(/^(( |\t)*- \[( |x)\]( |\t)+.+)\n{2,}(( |\t)*- \[( |x)\]( |\t)+.+)$/gm);
      text = replaceEmptyLinesBetweenList(text, checkboxMarker, '$1\n$5');

      // account for ordered list marker
      const orderedMarker = new RegExp(/^(( |\t)*\d+\.( |\t)+.+)\n{2,}(( |\t)*\d+\.( |\t)+.+)$/gm);
      text = replaceEmptyLinesBetweenList(text, orderedMarker, '$1\n$4');

      // account for '+' list marker
      const plusMarker = new RegExp(/^(( |\t)*\+( |\t)+.+)\n{2,}(( |\t)*\+( |\t)+.+)$/gm);
      text = replaceEmptyLinesBetweenList(text, plusMarker, '$1\n$4');

      // account for '-' list marker
      const dashMarker = new RegExp(/^(( |\t)*-(?! \[( |x)\])( |\t)+.+)\n{2,}(( |\t)*-(?! \[( |x)\])( |\t)+.+)$/gm);
      text = replaceEmptyLinesBetweenList(text, dashMarker, '$1\n$5');

      // account for '*' list marker
      const splatMarker = new RegExp(/^(( |\t)*\*( |\t)+.+)\n{2,}(( |\t)*\*( |\t)+.+)$/gm);
      return replaceEmptyLinesBetweenList(text, splatMarker, '$1\n$4');
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
