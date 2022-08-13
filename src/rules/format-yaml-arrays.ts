import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {convertAliasValueToStringOrStringArray,
  convertTagValueToStringOrStringArray,
  formatYAML,
  formatYamlArrayValue,
  getYamlSectionValue,
  loadYAML,
  NormalYamlArrayFormats,
  setYamlSection,
  SpecialYamlArrayFormats,
  splitValueIfSingleOrMultilineArray,
  TagSpecificYamlArrayFormats} from '../utils/yaml';

class FormatYamlArrayOptions implements Options {
  aliasArrayStyle?: NormalYamlArrayFormats | SpecialYamlArrayFormats = 'single-line';
  formatAliasKey?: boolean = true;
  tagArrayStyle?: TagSpecificYamlArrayFormats | NormalYamlArrayFormats | SpecialYamlArrayFormats = 'single-line';
  formatTagKey?: boolean = true;
  defaultArrayStyle?: NormalYamlArrayFormats = 'single-line';
  formatArrayKeys?: boolean = true;
  forceSingleLineArrayStyle?: string[] = [];
  forceMultiLineArrayStyle?: string[] = [];
}

@RuleBuilder.register
export default class RuleTemplate extends RuleBuilder<FormatYamlArrayOptions> {
  get OptionsClass(): new () => FormatYamlArrayOptions {
    return FormatYamlArrayOptions;
  }
  get name(): string {
    return 'Format Yaml Array';
  }
  get description(): string {
    return 'Allows for the formatting of regular yaml arrays as either multi-line or single-line and `tags` and `aliases` are allowed to have some Obsidian specific yaml formats. Note that single string to single-line goes from a single string entry to a single-line array if more than 1 entry is present. The same is true for single string to multi-line except it becomes a multi-line array.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: FormatYamlArrayOptions): string {
    return formatYAML(text, (text: string) => {
      const obsidianTagKey = 'tags';
      const obsidianAliasKey = 'aliases';

      const yaml = loadYAML(text.replace('---\n', '').replace('\n---', ''));
      if (!yaml) {
        return text;
      }

      if (options.formatAliasKey && Object.keys(yaml).includes(obsidianAliasKey)) {
        text = setYamlSection(text, obsidianAliasKey, formatYamlArrayValue(convertAliasValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, obsidianAliasKey))), options.aliasArrayStyle));
      }

      if (options.formatTagKey && Object.keys(yaml).includes(obsidianTagKey)) {
        text = setYamlSection(text, obsidianTagKey, formatYamlArrayValue(convertTagValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, obsidianTagKey))), options.tagArrayStyle));
      }

      if (options.formatArrayKeys) {
        const keysToIgnore = [obsidianAliasKey, obsidianTagKey, ...options.forceMultiLineArrayStyle, ...options.forceSingleLineArrayStyle];

        for (const key of Object.keys(yaml)) {
          // skip non-arrays and already accounted for keys
          if (keysToIgnore.includes(key) || !(typeof yaml[key] === 'object' && yaml[key] as string[])) {
            continue;
          }

          text = setYamlSection(text, key, formatYamlArrayValue(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, key)), options.defaultArrayStyle));
        }
      }

      for (const singleLineArrayKey of options.forceSingleLineArrayStyle) {
        if (!Object.keys(yaml).includes(singleLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text, singleLineArrayKey, formatYamlArrayValue(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, singleLineArrayKey)), 'single-line'));
      }

      for (const multiLineArrayKey of options.forceMultiLineArrayStyle) {
        if (!Object.keys(yaml).includes(multiLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text, multiLineArrayKey, formatYamlArrayValue(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, multiLineArrayKey)), 'multi-line'));
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<FormatYamlArrayOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Format tags as a single-line array delimited by spaces and aliases as a multi-line array and format the key `test` to be a single-line array',
        before: dedent`
          ---
          tags:
            - computer
            - research
          aliases: Title 1, Title2
          test: this is a value
          ---
          ${''}
          # Note
          ${''}
          Nesting yaml arrays may result in unexpected results.
        `,
        after: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
          test: [this is a value]
          ---
          ${''}
          # Note
          ${''}
          Nesting yaml arrays may result in unexpected results.
        `,
        options: {
          aliasArrayStyle: 'multi-line',
          forceSingleLineArrayStyle: ['test'],
        },
      }),
      new ExampleBuilder({
        description: 'Format tags as a single string with space delimiters, ignore aliases, and format regular yaml arrays as single-line arrays',
        before: dedent`
          ---
          aliases: Typescript
          types:
            - thought provoking
            - peer reviewed
          tags: [computer, science, trajectory]
          ---
        `,
        after: dedent`
          ---
          aliases: Typescript
          types: [thought provoking, peer reviewed]
          tags: computer science trajectory
          ---
        `,
        options: {
          formatAliasKey: false,
          tagArrayStyle: 'single string space delimited',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<FormatYamlArrayOptions>[] {
    return [
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Yaml aliases section style',
        description: 'The style of the yaml aliases section',
        optionsKey: 'aliasArrayStyle',
        records: [
          {
            value: 'multi-line',
            description: '```aliases:\\n  - Title```',
          },
          {
            value: 'single-line',
            description: '```aliases: [Title]```',
          },
          {
            value: 'single string comma delimited',
            description: '```aliases: Title, Other Title```',
          },
          {
            value: 'single string to single-line',
            description: 'Aliases will be formatted as a string if there is 1 or fewer elements like so ```aliases: Title```. If there is more than 1 element, it will be formatted like a single-line array.',
          },
          {
            value: 'single string to multi-line',
            description: 'Aliases will be formatted as a string if there is 1 or fewer elements like so ```aliases: Title```. If there is more than 1 element, it will be formatted like a multi-line array.',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Format yaml aliases section',
        description: 'Turns on formatting for the yaml aliases section',
        optionsKey: 'formatAliasKey',
      }),
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Yaml tags section style',
        description: 'The style of the yaml tags section',
        optionsKey: 'tagArrayStyle',
        records: [
          {
            value: 'multi-line',
            description: '```tags:\\n  - tag1```',
          },
          {
            value: 'single-line',
            description: '```tags: [tag1]```',
          },
          {
            value: 'single string to single-line',
            description: 'Tags will be formatted as a string if there is 1 or fewer elements like so ```tags: tag1```. If there is more than 1 element, it will be formatted like a single-line array.',
          },
          {
            value: 'single string to multi-line',
            description: 'Aliases will be formatted as a string if there is 1 or fewer elements like so ```tags: tag1```. If there is more than 1 element, it will be formatted like a multi-line array.',
          },
          {
            value: 'single-line space delimited',
            description: '```tags: [tag1 tag2]```',
          },
          {
            value: 'single string space delimited',
            description: '```tags: tag1 tag2```',
          },
          {
            value: 'single string comma delimited',
            description: '```tags: tag1, tag2```',
          },
        ],
      }),
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Default yaml array section style',
        description: 'The style of other yaml arrays that are not `tags`, `aliases` or  in `Force key values to be single-line arrays` and `Force key values to be multi-line arrays`',
        optionsKey: 'defaultArrayStyle',
        records: [
          {
            value: 'multi-line',
            description: '```key:\\n  - value```',
          },
          {
            value: 'single-line',
            description: '```key: [value]```',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Format yaml array sections',
        description: 'Turns on formatting for regular yaml arrays',
        optionsKey: 'formatArrayKeys',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Force key values to be single-line arrays',
        description: 'Forces the yaml array for the new line separated keys to be in single-line format (leave empty to disable this option)',
        optionsKey: 'forceSingleLineArrayStyle',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Force key values to be multi-line arrays',
        description: 'Forces the yaml array for the new line separated keys to be in multi-line format (leave empty to disable this option)',
        optionsKey: 'forceMultiLineArrayStyle',
      }),
    ];
  }
}
