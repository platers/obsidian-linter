import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {UnorderedListItemStyles, updateUnorderedListItemIndicators} from '../utils/mdast';

class UnorderedListStyleOptions implements Options {
  listStyle?: UnorderedListItemStyles = UnorderedListItemStyles.Consistent;
}

@RuleBuilder.register
export default class UnorderedListStyle extends RuleBuilder<UnorderedListStyleOptions> {
  constructor() {
    super({
      nameKey: 'rules.unordered-list-style.name',
      descriptionKey: 'rules.unordered-list-style.description',
      type: RuleType.CONTENT,
    });
  }
  get OptionsClass(): new () => UnorderedListStyleOptions {
    return UnorderedListStyleOptions;
  }
  apply(text: string, options: UnorderedListStyleOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.tag], text, (text) => {
      return updateUnorderedListItemIndicators(text, options.listStyle);
    });
  }
  get exampleBuilders(): ExampleBuilder<UnorderedListStyleOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Unordered lists have their indicator updated to `*` when `List item style = \'consistent\'` and `*` is the first unordered list indicator',
        before: dedent`
          1. ordered item 1
          2. ordered item 2
          ${''}
          Checklists should be ignored
          - [ ] Checklist item 1
          - [x] completed item
          ${''}
          * Item 1
            - Sublist 1 item 1
            - Sublist 1 item 2
          - Item 2
            + Sublist 2 item 1
            + Sublist 2 item 2
          + Item 3
            * Sublist 3 item 1
            * Sublist 3 item 2
          ${''}
        `,
        after: dedent`
          1. ordered item 1
          2. ordered item 2
          ${''}
          Checklists should be ignored
          - [ ] Checklist item 1
          - [x] completed item
          ${''}
          * Item 1
            * Sublist 1 item 1
            * Sublist 1 item 2
          * Item 2
            * Sublist 2 item 1
            * Sublist 2 item 2
          * Item 3
            * Sublist 3 item 1
            * Sublist 3 item 2
          ${''}
        `,
      }),
      new ExampleBuilder({
        description: 'Unordered lists have their indicator updated to `-` when `List item style = \'-\'`',
        before: dedent`
          - Item 1
            * Sublist 1 item 1
            * Sublist 1 item 2
          * Item 2
            + Sublist 2 item 1
            + Sublist 2 item 2
          + Item 3
            - Sublist 3 item 1
            - Sublist 3 item 2
          ${''}
          See that the ordered list is ignored, but its sublist is not
          ${''}
          1. Item 1
            - Sub item 1
          1. Item 2
            * Sub item 2
          1. Item 3
            + Sub item 3
        `,
        after: dedent`
          - Item 1
            - Sublist 1 item 1
            - Sublist 1 item 2
          - Item 2
            - Sublist 2 item 1
            - Sublist 2 item 2
          - Item 3
            - Sublist 3 item 1
            - Sublist 3 item 2
          ${''}
          See that the ordered list is ignored, but its sublist is not
          ${''}
          1. Item 1
            - Sub item 1
          1. Item 2
            - Sub item 2
          1. Item 3
            - Sub item 3
        `,
        options: {
          listStyle: UnorderedListItemStyles.Dash,
        },
      }),
      new ExampleBuilder({
        description: 'Unordered lists have their indicator updated to `*` when `List item style = \'*\'`',
        before: dedent`
          - Item 1
            * Sublist 1 item 1
            * Sublist 1 item 2
          * Item 2
            + Sublist 2 item 1
            + Sublist 2 item 2
          + Item 3
            - Sublist 3 item 1
            - Sublist 3 item 2
          ${''}
        `,
        after: dedent`
          * Item 1
            * Sublist 1 item 1
            * Sublist 1 item 2
          * Item 2
            * Sublist 2 item 1
            * Sublist 2 item 2
          * Item 3
            * Sublist 3 item 1
            * Sublist 3 item 2
          ${''}
        `,
        options: {
          listStyle: UnorderedListItemStyles.Asterisk,
        },
      }),
      new ExampleBuilder({
        description: 'Unordered list in blockquote has list item indicators set to `+` when `List item style = \'-\'`',
        before: dedent`
          > - Item 1
          > + Item 2
          > > * Subitem 1
          > > + Subitem 2
          > >   - Sub sub item 1
          > > - Subitem 3
        `,
        after: dedent`
          > + Item 1
          > + Item 2
          > > + Subitem 1
          > > + Subitem 2
          > >   + Sub sub item 1
          > > + Subitem 3
        `,
        options: {
          listStyle: UnorderedListItemStyles.Plus,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<UnorderedListStyleOptions>[] {
    return [
      new DropdownOptionBuilder<UnorderedListStyleOptions, UnorderedListItemStyles>({
        OptionsClass: UnorderedListStyleOptions,
        nameKey: 'rules.unordered-list-style.list-style.name',
        descriptionKey: 'rules.unordered-list-style.list-style.description',
        optionsKey: 'listStyle',
        records: [
          {
            value: UnorderedListItemStyles.Consistent,
            description: 'Makes sure unordered list items use a consistent list item indicator in the file which will be based on the first list item found',
          },
          {
            value: UnorderedListItemStyles.Dash,
            description: 'Makes sure unordered list items use `-` as their indicator',
          },
          {
            value: UnorderedListItemStyles.Asterisk,
            description: 'Makes sure unordered list items use `*` as their indicator',
          },
          {
            value: UnorderedListItemStyles.Plus,
            description: 'Makes sure unordered list items use `+` as their indicator',
          },
        ],
      }),
    ];
  }
}
