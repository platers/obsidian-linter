import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, OBSIDIAN_TAG_KEY_SINGULAR, OBSIDIAN_TAG_KEY_PLURAL} from '../utils/yaml';

class FormatTagsInYamlOptions implements Options {}

@RuleBuilder.register
export default class FormatTagsInYaml extends RuleBuilder<FormatTagsInYamlOptions> {
  constructor() {
    super({
      nameKey: 'rules.format-tags-in-yaml.name',
      descriptionKey: 'rules.format-tags-in-yaml.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => FormatTagsInYamlOptions {
    return FormatTagsInYamlOptions;
  }
  apply(text: string, options: FormatTagsInYamlOptions): string {
    return formatYAML(text, (text) => {
      return text.replace(
          new RegExp(`\\n(${OBSIDIAN_TAG_KEY_PLURAL}|${OBSIDIAN_TAG_KEY_SINGULAR}):(.*?)(?=\\n(?:[A-Za-z-]+?:|---))`, 's'),
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
      new ExampleBuilder({ // relates to https://github.com/platers/obsidian-linter/issues/441
        description: 'Format tags in array with `tag` as the tags key',
        before: dedent`
          ---
          tag: [#one #two #three]
          ---
        `,
        after: dedent`
          ---
          tag: [one two three]
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
}
