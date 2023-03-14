import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {lineStartingWithWhitespaceOrBlockquoteTemplate} from '../utils/regex';

class RemoveEmptyListMarkersOptions implements Options {}

@RuleBuilder.register
export default class RemoveEmptyListMarkers extends RuleBuilder<RemoveEmptyListMarkersOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-empty-list-markers.name',
      descriptionKey: 'rules.remove-empty-list-markers.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => RemoveEmptyListMarkersOptions {
    return RemoveEmptyListMarkersOptions;
  }
  apply(text: string, options: RemoveEmptyListMarkersOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag], text, (text) => {
      const emptyListMarkerRegex = new RegExp(`^${lineStartingWithWhitespaceOrBlockquoteTemplate}(-|\\*|\\+|\\d+[.)]|- (\\[( |x)\\]))\\s*?$`, 'gm');
      // remove all empty list markers followed by a new line
      text = text.replace(new RegExp(emptyListMarkerRegex.source + '\\n', 'gm'), '');
      // remove all empty list markers proceeded by a new line
      text = text.replace(new RegExp('\\n' + emptyListMarkerRegex.source, 'gm'), '');
      // remove all empty list markers where they are the only line in the file
      return text.replace(emptyListMarkerRegex, '');
    });
  }
  get exampleBuilders(): ExampleBuilder<RemoveEmptyListMarkersOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes empty list markers.',
        before: dedent`
          - item 1
          -
          - item 2
          ${''}
          * list 2 item 1
              *
          * list 2 item 2
          ${''}
          + list 3 item 1
          +
          + list 3 item 2
        `,
        after: dedent`
          - item 1
          - item 2
          ${''}
          * list 2 item 1
          * list 2 item 2
          ${''}
          + list 3 item 1
          + list 3 item 2
        `,
      }),
      new ExampleBuilder({
        description: 'Removes empty ordered list markers.',
        before: dedent`
          1. item 1
          2.
          3. item 2
          ${''}
          1. list 2 item 1
          2. list 2 item 2
          3. ${''}
          ${''}
          _Note that this rule does not make sure that the ordered list is sequential after removal_
        `,
        after: dedent`
          1. item 1
          3. item 2
          ${''}
          1. list 2 item 1
          2. list 2 item 2
          ${''}
          _Note that this rule does not make sure that the ordered list is sequential after removal_
        `,
      }),
      new ExampleBuilder({
        description: 'Removes empty checklist markers.',
        before: dedent`
          - [ ]  item 1
          - [x]
          - [ ] item 2
          - [ ]   ${''}
          ${''}
          _Note that this will affect checked and uncheck checked list items_
        `,
        after: dedent`
          - [ ]  item 1
          - [ ] item 2
          ${''}
          _Note that this will affect checked and uncheck checked list items_
        `,
      }),
      new ExampleBuilder({
        description: 'Removes empty list, checklist, and ordered list markers in callouts/blockquotes',
        before: dedent`
          > Checklist in blockquote
          > - [ ]  item 1
          > - [x]
          > - [ ] item 2
          > - [ ]   ${''}
          ${''}
          > Ordered List in blockquote
          > > 1. item 1
          > > 2.
          > > 3. item 2
          > > 4.  ${''}
          ${''}
          > Regular lists in blockquote
          >
          > - item 1
          > -
          > - item 2
          >
          > List 2
          >
          > * item 1
          >     *
          > * list 2 item 2
          >
          > List 3
          >
          > + item 1
          > + 
          > + item 2
        `,
        after: dedent`
          > Checklist in blockquote
          > - [ ]  item 1
          > - [ ] item 2
          ${''}
          > Ordered List in blockquote
          > > 1. item 1
          > > 3. item 2
          ${''}
          > Regular lists in blockquote
          >
          > - item 1
          > - item 2
          >
          > List 2
          >
          > * item 1
          > * list 2 item 2
          >
          > List 3
          >
          > + item 1
          > + item 2
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveEmptyListMarkersOptions>[] {
    return [];
  }
}
