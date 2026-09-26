import { getAllTablesInText } from '../utils/mdast';
import { MarkdownTableFormatter } from '../utils/tables';
import { Options, RuleType } from '../rules';
import RuleBuilder, { ExampleBuilder, OptionBuilderBase } from './rule-builder';
import dedent from 'ts-dedent';
import { IgnoreTypes } from '../utils/ignore-types';
import { ProtectedRanges } from '../utils/protected-ranges';
import { getStartOfLineIndex, textReplacement } from '../utils/strings';
import { applyNonOverlappingReplacements, getEditsBetween } from '../utils/text-edits';
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
  apply(text: string, options: AlignTableOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    const tablePositions = getAllTablesInText(projection.text);
    let formatedTable: string;
    let fmt: MarkdownTableFormatter;

    if (tablePositions.length === 0) {
      return text;
    }

    let projectedText = projection.text;
    for (const tablePosition of tablePositions) {
      const tableText = projectedText.substring(tablePosition.startIndex, tablePosition.endIndex);
      const startOfLine = projectedText.substring(getStartOfLineIndex(projectedText, tablePosition.startIndex), tablePosition.startIndex);

      fmt = new MarkdownTableFormatter();
      formatedTable = fmt.formatTable(tableText, startOfLine);
      projectedText = projectedText.replace(tableText, formatedTable);
    }

    const replacements: textReplacement[] = [];
    for (const edit of getEditsBetween(projection.text, projectedText)) {
      const range = projection.editRangeToSource(edit);
      if (range) {
        replacements.push({ ...range, value: edit.value });
      }
    }

    return applyNonOverlappingReplacements(text, replacements);
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
        description: 'Missing separators get added to the table if they are missing',
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
