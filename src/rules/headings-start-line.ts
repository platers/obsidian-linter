import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {ignoreListOfTypes, IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex} from '../utils/regex';

class HeadingStartLineOptions implements Options {}

@RuleBuilder.register
export default class HeadingStartLine extends RuleBuilder<HeadingStartLineOptions> {
  constructor() {
    super({
      nameKey: 'rules.headings-start-line.name',
      descriptionKey: 'rules.headings-start-line.description',
      type: RuleType.HEADING,
    });
  }
  get OptionsClass(): new () => HeadingStartLineOptions {
    return HeadingStartLineOptions;
  }
  apply(text: string, options: HeadingStartLineOptions): string {
    return ignoreListOfTypes([IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml], text, (text) => {
      return text.replaceAll(allHeadersRegex, (heading: string) => {
        return heading.trimStart();
      });
    });
  }
  get exampleBuilders(): ExampleBuilder<HeadingStartLineOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes spaces prior to a heading',
        before: dedent`
          ${''}   ## Other heading preceded by 2 spaces ##
          _Note that if the spacing is enough for the header to be considered to be part of a codeblock it will not be affected by this rule._
        `,
        after: dedent`
          ## Other heading preceded by 2 spaces ##
          _Note that if the spacing is enough for the header to be considered to be part of a codeblock it will not be affected by this rule._
        `,
      }),
      new ExampleBuilder({
        description: 'Tags are not affected by this',
        before: dedent`
          ${''}  #test
          ${''}  # Heading &amp;
        `,
        after: dedent`
          ${''}  #test
          # Heading &amp;
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<HeadingStartLineOptions>[] {
    return [];
  }
}
