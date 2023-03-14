import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes, ignoreListOfTypes} from '../utils/ignore-types';
import {ensureEmptyLinesAroundTables} from '../utils/regex';

class EmptyLineAroundTablesOptions implements Options {}

@RuleBuilder.register
export default class EmptyLineAroundTables extends RuleBuilder<EmptyLineAroundTablesOptions> {
  constructor() {
    super({
      nameKey: 'rules.empty-line-around-tables.name',
      descriptionKey: 'rules.empty-line-around-tables.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => EmptyLineAroundTablesOptions {
    return EmptyLineAroundTablesOptions;
  }
  apply(text: string, options: EmptyLineAroundTablesOptions): string {
    return ignoreListOfTypes([IgnoreTypes.yaml, IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.inlineMath, IgnoreTypes.wikiLink, IgnoreTypes.link], text, (text: string) => {
      return ensureEmptyLinesAroundTables(text);
    });
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
          More text.
          # Heading
          ${''}
          **Note that text directly following a table is considered part of a table according to github markdown**
        `,
        after: dedent`
          | Column 1 | Column 2 |
          |----------|----------|
          | foo      | bar      |
          | baz      | qux      |
          | quux     | quuz     |
          ${''}
          More text.
          # Heading
          ${''}
          **Note that text directly following a table is considered part of a table according to github markdown**
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
          # Header for more content
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
          # Header for more content
          New paragraph.
        `,
      }),
      new ExampleBuilder({
        description: 'Tables in callouts or blockquotes have the appropriately formatted blank lines added',
        before: dedent`
          > Table in blockquote
          > | Column 1 | Column 2 | Column 3 |
          > |----------|----------|----------|
          > | foo      | bar      | blob     |
          > | baz      | qux      | trust    |
          > | quux     | quuz     | glob     |
          ${''}
          More content here
          ${''}
          > Table doubly nested in blockquote
          > > | Column 1 | Column 2 | Column 3 |
          > > |----------|----------|----------|
          > > | foo      | bar      | blob     |
          > > | baz      | qux      | trust    |
          > > | quux     | quuz     | glob     |
        `,
        after: dedent`
          > Table in blockquote
          >
          > | Column 1 | Column 2 | Column 3 |
          > |----------|----------|----------|
          > | foo      | bar      | blob     |
          > | baz      | qux      | trust    |
          > | quux     | quuz     | glob     |
          >
          ${''}
          More content here
          ${''}
          > Table doubly nested in blockquote
          > >
          > > | Column 1 | Column 2 | Column 3 |
          > > |----------|----------|----------|
          > > | foo      | bar      | blob     |
          > > | baz      | qux      | trust    |
          > > | quux     | quuz     | glob     |
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<EmptyLineAroundTablesOptions>[] {
    return [];
  }
}
