import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {allHeadersRegex} from '../utils/regex';
import {collectUnprotectedRegexReplacements, ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges} from '../utils/strings';

class HeadingStartLineOptions implements Options {}

@RuleBuilder.register
export default class HeadingStartLine extends RuleBuilder<HeadingStartLineOptions> {
  constructor() {
    super({
      nameKey: 'rules.headings-start-line.name',
      descriptionKey: 'rules.headings-start-line.description',
      type: RuleType.HEADING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml],
    });
  }
  get OptionsClass(): new () => HeadingStartLineOptions {
    return HeadingStartLineOptions;
  }
  apply(text: string, options: HeadingStartLineOptions, protectedRanges: ProtectedRanges): string {
    const replacements = collectUnprotectedRegexReplacements(
        text, allHeadersRegex, protectedRanges, {
          editRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[1].length, value: ''}),
          // The heading marker must be visible, but its text can contain a placeholder.
          guardRange: (match, startIndex) => ({startIndex, endIndex: startIndex + match[1].length + match[2].length + match[3].length}),
        },
    );
    replacements.sort((a, b) => a.startIndex - b.startIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
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
