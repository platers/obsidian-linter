import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ensureEmptyLinesAroundRegexMatches, tableRegex} from '../utils/regex';

class EmptyLineAroundTablesOptions implements Options {
}

@RuleBuilder.register
export default class EmptyLineAroundTables extends RuleBuilder<EmptyLineAroundTablesOptions> {
  get OptionsClass(): new () => EmptyLineAroundTablesOptions {
    return EmptyLineAroundTablesOptions;
  }
  get name(): string {
    return 'Empty Line Around Tables';
  }
  get description(): string {
    return 'Ensures that there is an empty line around tables unless they start or end a document.';
  }
  get type(): RuleType {
    return RuleType.SPACING;
  }
  apply(text: string, options: EmptyLineAroundTablesOptions): string {
    return ensureEmptyLinesAroundRegexMatches(text, new RegExp(`(\n)*${tableRegex.source}(\n)*`, 'g'));
  }
  get exampleBuilders(): ExampleBuilder<EmptyLineAroundTablesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Tables that start a document do not get an empty line before them.',
        before: dedent`
          | Column 1 | Column 2 |
          |----------|----------|
          | foo      | bar      |
          | baz      | qux      |
          | quux     | quuz     |
          New paragraph.
        `,
        after: dedent`
          | Column 1 | Column 2 |
          |----------|----------|
          | foo      | bar      |
          | baz      | qux      |
          | quux     | quuz     |
          ${''}
          New paragraph.
        `,
      }),
      new ExampleBuilder({
        description: 'Tables that end a document do not get an empty line after them.',
        before: dedent`
          # Heading 1
          | Column 1 | Column 2 |
          |----------|----------|
          | foo      | bar      |
          | baz      | qux      |
          | quux     | quuz     |
        `,
        after: dedent`
          # Heading 1
          ${''}
          | Column 1 | Column 2 |
          |----------|----------|
          | foo      | bar      |
          | baz      | qux      |
          | quux     | quuz     |
        `,
      }),
      new ExampleBuilder({
        description: 'Tables that are not at the start or the end of the document will have an empty line added before and after them',
        before: dedent`
          # Table 1
          | Column 1 | Column 2 | Column 3 |
          |----------|----------|----------|
          | foo      | bar      | blob     |
          | baz      | qux      | trust    |
          | quux     | quuz     | glob     |
          # Table 2 without Pipe at Start and End
          | Column 1 | Column 2 |
          :-: | -----------:
          bar | baz
          foo | bar
          New paragraph.
        `,
        after: dedent`
          # Table 1
          ${''}
          | Column 1 | Column 2 | Column 3 |
          |----------|----------|----------|
          | foo      | bar      | blob     |
          | baz      | qux      | trust    |
          | quux     | quuz     | glob     |
          ${''}
          # Table 2 without Pipe at Start and End
          ${''}
          | Column 1 | Column 2 |
          :-: | -----------:
          bar | baz
          foo | bar
          ${''}
          New paragraph.
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundTablesOptions>[] {
    return [];
  }
}
