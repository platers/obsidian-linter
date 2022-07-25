import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML} from '../utils/yaml';

class FormatTagsInYamlOptions implements Options {
}

@RuleBuilder.register
export default class FormatTagsInYaml extends RuleBuilder<FormatTagsInYamlOptions> {
  get OptionsClass(): new () => FormatTagsInYamlOptions {
    return FormatTagsInYamlOptions;
  }
  get name(): string {
    return 'Format Tags in YAML';
  }
  get description(): string {
    return 'Remove Hashtags from tags in the YAML frontmatter, as they make the tags there invalid.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: FormatTagsInYamlOptions): string {
    return formatYAML(text, (text) => {
      return text.replace(
          /\ntags:(.*?)(?=\n(?:[A-Za-z-]+?:|---))/s,
          function(tagsYAML) {
            return tagsYAML.replaceAll('#', '');
          },
      );
    });
  }
  get exampleBuilders(): ExampleBuilder<FormatTagsInYamlOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Format Tags in YAML frontmatter',
        before: dedent`
          ---
          tags: #one #two #three #nested/four/five
          ---
        `,
        after: dedent`
          ---
          tags: one two three nested/four/five
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'Format tags in array',
        before: dedent`
          ---
          tags: [#one #two #three]
          ---
        `,
        after: dedent`
          ---
          tags: [one two three]
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'Format tags in list',
        before: dedent`
          ---
          tags:
          - #tag1
          - #tag2
          ---
        `,
        after: dedent`
          ---
          tags:
          - tag1
          - tag2
          ---
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<FormatTagsInYamlOptions>[] {
    return [];
  }
  get hasSpecialExecutionOrder(): boolean {
    return true;
  }
}
