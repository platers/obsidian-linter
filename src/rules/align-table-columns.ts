import {getAllTablesInText} from '../utils/mdast';
import {MarkdownTableFormatter} from '../utils/tables';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
class AlignTableOptions implements Options {
}

@RuleBuilder.register
export default class AlignTable extends RuleBuilder<AlignTableOptions> {
  constructor() {
    super({
      nameKey: 'rules.align-table-columns.name',
      descriptionKey: 'rules.align-table-columns.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.yaml, IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.wikiLink, IgnoreTypes.link],
    });
  }
  get OptionsClass(): new () => AlignTableOptions {
    return AlignTableOptions;
  }
  apply(text: string, options: AlignTableOptions): string {
    const tablePositions = getAllTablesInText(text);
    let formatedTable = '';
    let fmt: MarkdownTableFormatter;

    if (tablePositions.length === 0) {
      return text;
    }

    for (const tablePosition of tablePositions) {
      const tableText = text.substring(tablePosition.startIndex, tablePosition.endIndex);
      fmt = new MarkdownTableFormatter();
      formatedTable = fmt.formatTable(tableText);
      text = text.replace(tableText, formatedTable);
    }

    return text;
  }
  get exampleBuilders(): ExampleBuilder<AlignTableOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Make sure columns are aligned properly',
        before: dedent`
          | Column 1 | Column 2 |
          |-------|-------|
          | foo1| bar1|
          | foo2 | bar2                  |
          | foo3   | bar3    |
        `,
        after: dedent`
          | Column 1 | Column 2 |
          |----------|----------|
          | foo1     | bar1     |
          | foo2     | bar2     |
          | foo3     | bar3     |
        `,
      }),
      new ExampleBuilder({
        description: 'Make sure column alignment works with CJK characters',
        before: dedent`
          | Column 1 | Column 2 |
          |-------|-------|
          | foo1| bar1|
          | CJK| 你好|
          | foo3   | bar3    |
        `,
        after: dedent`
          | Column 1 | Column 2 |
          |----------|----------|
          | foo1     | bar1     |
          | CJK      | 你好     |
          | foo3     | bar3     |
        `,
      }),
      new ExampleBuilder({
        description: 'Missing separators get added in as well',
        before: dedent`
          | Column 1 | Column 2 |
          |-------|-------
          | foo1| bar1
          | CJK| 你好|
          | foo3   | bar3    |
        `,
        after: dedent`
          | Column 1 | Column 2 |
          |----------|----------|
          | foo1     | bar1     |
          | CJK      | 你好     |
          | foo3     | bar3     |
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<AlignTableOptions>[] {
    return [];
  }
}
