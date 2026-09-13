import {IgnoreTypes} from '../utils/ignore-types';
import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {multipleBlankLinesRegex} from '../utils/regex';
import {ProtectedRanges} from '../utils/protected-ranges';
import {replaceTextRanges, textReplacement} from '../utils/strings';

class ConsecutiveBlankLinesOptions implements Options {}

@RuleBuilder.register
export default class ConsecutiveBlankLines extends RuleBuilder<ConsecutiveBlankLinesOptions> {
  constructor() {
    super({
      nameKey: 'rules.consecutive-blank-lines.name',
      descriptionKey: 'rules.consecutive-blank-lines.description',
      type: RuleType.SPACING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
      usesProtectedRanges: true,
      hasSpecialExecutionOrder: true, // runs after most rules to cleanup any leftover spacing https://github.com/platers/obsidian-linter/issues/1225
    });
  }
  get OptionsClass(): new () => ConsecutiveBlankLinesOptions {
    return ConsecutiveBlankLinesOptions;
  }
  apply(text: string, options: ConsecutiveBlankLinesOptions, protectedRanges: ProtectedRanges): string {
    const projection = protectedRanges.projection();
    const replacements: textReplacement[] = [];
    for (const match of projection.text.matchAll(multipleBlankLinesRegex)) {
      const range = projection.editRangeToSource({startIndex: match.index, endIndex: match.index + match[0].length});
      if (range) {
        replacements.push({...range, value: '\n\n'});
      }
    }

    replacements.sort((a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex);
    if (replacements.some((replacement, index) => index > 0 && replacement.startIndex < replacements[index - 1].endIndex)) {
      throw new Error('Rule replacements must be ordered and non-overlapping');
    }
    return replaceTextRanges(text, replacements);
  }
  get exampleBuilders(): ExampleBuilder<ConsecutiveBlankLinesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Consecutive blank lines are removed',
        before: dedent`
          Some text
          ${''}
          ${''}
          Some more text
        `,
        after: dedent`
          Some text
          ${''}
          Some more text
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<ConsecutiveBlankLinesOptions>[] {
    return [];
  }
}
