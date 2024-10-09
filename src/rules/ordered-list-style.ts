import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {OrderListItemEndOfIndicatorStyles, OrderListItemStyles, updateOrderedListItemIndicators} from '../utils/mdast';

class OrderedListStyleOptions implements Options {
  numberStyle?: OrderListItemStyles = OrderListItemStyles.Ascending;
  listEndStyle?: OrderListItemEndOfIndicatorStyles = OrderListItemEndOfIndicatorStyles.Period;
  preserveStart?: boolean;
}

@RuleBuilder.register
export default class OrderedListStyle extends RuleBuilder<OrderedListStyleOptions> {
  constructor() {
    super({
      nameKey: 'rules.ordered-list-style.name',
      descriptionKey: 'rules.ordered-list-style.description',
      type: RuleType.CONTENT,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.tag],
    });
  }
  get OptionsClass(): new () => OrderedListStyleOptions {
    return OrderedListStyleOptions;
  }
  apply(text: string, options: OrderedListStyleOptions): string {
    return updateOrderedListItemIndicators(text, options.numberStyle, options.listEndStyle, options.preserveStart);
  }
  get exampleBuilders(): ExampleBuilder<OrderedListStyleOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Ordered lists have list items set to ascending numerical order when Number Style is `ascending`.',
        before: dedent`
          1. Item 1
          2. Item 2
          4. Item 3
          ${''}
          Some text here
          ${''}
          1. Item 1
          1. Item 2
          1. Item 3
        `,
        after: dedent`
          1. Item 1
          2. Item 2
          3. Item 3
          ${''}
          Some text here
          ${''}
          1. Item 1
          2. Item 2
          3. Item 3
        `,
      }),
      new ExampleBuilder({
        description: 'Nested ordered lists have list items set to ascending numerical order when Number Style is `ascending`.',
        before: dedent`
          1. Item 1
          2. Item 2
            1. Subitem 1
            5. Subitem 2
            2. Subitem 3
          4. Item 3
        `,
        after: dedent`
          1. Item 1
          2. Item 2
            1. Subitem 1
            2. Subitem 2
            3. Subitem 3
          3. Item 3
        `,
      }),
      new ExampleBuilder({
        description: 'Ordered list in blockquote has list items set to \'1.\' when Number Style is `lazy`.',
        before: dedent`
          > 1. Item 1
          > 4. Item 2
          > > 1. Subitem 1
          > > 5. Subitem 2
          > > 2. Subitem 3
        `,
        after: dedent`
          > 1. Item 1
          > 1. Item 2
          > > 1. Subitem 1
          > > 1. Subitem 2
          > > 1. Subitem 3
        `,
        options: {
          numberStyle: OrderListItemStyles.Lazy,
        },
      }),
      new ExampleBuilder({
        description: 'Ordered list in blockquote has list items set to ascending numerical order when Number Style is `ascending`.',
        before: dedent`
          > 1. Item 1
          > 4. Item 2
          > > 1. Subitem 1
          > > 5. Subitem 2
          > > 2. Subitem 3
        `,
        after: dedent`
          > 1. Item 1
          > 2. Item 2
          > > 1. Subitem 1
          > > 2. Subitem 2
          > > 3. Subitem 3
        `,
      }),
      new ExampleBuilder({
        description: 'Nested ordered list has list items set to \'1)\' when Number Style is `lazy` and Ordered List Indicator End Style is `)`.',
        before: dedent`
          1. Item 1
          2. Item 2
            1. Subitem 1
            5. Subitem 2
            2. Subitem 3
          4. Item 3
        `,
        after: dedent`
          1) Item 1
          1) Item 2
            1) Subitem 1
            1) Subitem 2
            1) Subitem 3
          1) Item 3
        `,
        options: {
          listEndStyle: OrderListItemEndOfIndicatorStyles.Parenthesis,
          numberStyle: OrderListItemStyles.Lazy,
        },
      }),
      new ExampleBuilder({
        description: 'Ordered lists have list items set to ascending numerical order using initial indicator number when Number Style is `ascending` and `preserveStart` is enabled',
        before: dedent`
          1. Item 1
          2. Item 2
          4. Item 3
          ${''}
          Some text here
          ${''}
          4. Item 4
          5. Item 5
          7. Item 6
        `,
        after: dedent`
          1. Item 1
          2. Item 2
          3. Item 3
          ${''}
          Some text here
          ${''}
          4. Item 4
          5. Item 5
          6. Item 6
        `,
        options: {
          numberStyle: OrderListItemStyles.Ascending,
          preserveStart: true,
        },
      }),
      new ExampleBuilder({
        description: 'Nested ordered lists have list items set to ascending numerical order using initial indicator number when Number Style is `ascending` and `preserveStart` is enabled',
        before: dedent`
          4. Item 4
          2. Item 5
            2. Subitem 2
            5. Subitem 3
            2. Subitem 4
          4. Item 6
        `,
        after: dedent`
          4. Item 4
          5. Item 5
            2. Subitem 2
            3. Subitem 3
            4. Subitem 4
          6. Item 6
        `,
        options: {
          preserveStart: true,
        },
      }),
      new ExampleBuilder({
        description: 'Ordered lists have list items set to initial indicator number when Number Style is `lazy` and `preserveStart` is enabled',
        before: dedent`
          2. Item 2
          5. Item 3
          4. Item 4
        `,
        after: dedent`
          2. Item 2
          2. Item 3
          2. Item 4
        `,
        options: {
          numberStyle: OrderListItemStyles.Lazy,
          preserveStart: true,
        },
      }),
      new ExampleBuilder({
        description: 'Nested ordered lists have list items set to initial indicator number when Number Style is `lazy` and `preserveStart` is enabled',
        before: dedent`
          4. Item 4
          2. Item 5
            2. Subitem 2
            5. Subitem 3
            2. Subitem 4
          4. Item 6
        `,
        after: dedent`
          4. Item 4
          4. Item 5
            2. Subitem 2
            2. Subitem 3
            2. Subitem 4
          4. Item 6
        `,
        options: {
          numberStyle: OrderListItemStyles.Lazy,
          preserveStart: true,
        },
      }),
      new ExampleBuilder({
        description: 'Ordered lists items are not modified when Number Style is `preserve`',
        before: dedent`
          4. Item 4
          2. Item 5
            2. Subitem 2
            5. Subitem 3
            2. Subitem 4
          4. Item 6
        `,
        after: dedent`
          4. Item 4
          2. Item 5
            2. Subitem 2
            5. Subitem 3
            2. Subitem 4
          4. Item 6
        `,
        options: {
          numberStyle: OrderListItemStyles.Preserve,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<OrderedListStyleOptions>[] {
    return [
      new DropdownOptionBuilder<OrderedListStyleOptions, OrderListItemStyles>({
        OptionsClass: OrderedListStyleOptions,
        nameKey: 'rules.ordered-list-style.number-style.name',
        descriptionKey: 'rules.ordered-list-style.number-style.description',
        optionsKey: 'numberStyle',
        records: [
          {
            value: OrderListItemStyles.Ascending,
            description: 'Makes sure ordered list items are ascending (i.e. 1, 2, 3, etc.)',
          },
          {
            value: OrderListItemStyles.Lazy,
            description: 'Makes sure ordered list item indicators all are the same',
          },
          {
            value: OrderListItemStyles.Preserve,
            description: 'Preserves ordered list item indicators as they are',
          },
        ],
      }),
      new DropdownOptionBuilder<OrderedListStyleOptions, OrderListItemEndOfIndicatorStyles>({
        OptionsClass: OrderedListStyleOptions,
        nameKey: 'rules.ordered-list-style.list-end-style.name',
        descriptionKey: 'rules.ordered-list-style.list-end-style.description',
        optionsKey: 'listEndStyle',
        records: [
          {
            value: OrderListItemEndOfIndicatorStyles.Period,
            description: 'Makes sure ordered list items indicators end in \'.\' (i.e `1.`)',
          },
          {
            value: OrderListItemEndOfIndicatorStyles.Parenthesis,
            description: 'Makes sure ordered list item indicators end in \')\' (i.e. `1)`)',
          },
        ],
      }),
      new BooleanOptionBuilder<OrderedListStyleOptions>({
        OptionsClass: OrderedListStyleOptions,
        nameKey: 'rules.ordered-list-style.preserve-start.name',
        descriptionKey: 'rules.ordered-list-style.preserve-start.description',
        optionsKey: 'preserveStart',
      }),
    ];
  }
}
