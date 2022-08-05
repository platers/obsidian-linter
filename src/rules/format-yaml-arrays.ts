import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, loadYAML, setYamlSection, toSingleLineArrayYamlString} from '../utils/yaml';

type TagSpecificYamlArrayFormats = 'single string space delimited' | 'single-line space delimited';

type SpecialYamlArrayFormats = 'single string to single-line' | 'single string to multi-line' | 'single string comma delimited';

type NormalYamlArrayFormats = 'single-line' | 'multi-line';

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
    return 'Format YAML Array';
  }
  get description(): string {
    return 'Allows for the formatting of arrays to either be multi-line or single-line arrays with `tags` and `aliases` getting more options';
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

      const formatYamlArrayValue = function(value: string | string[], format: NormalYamlArrayFormats | SpecialYamlArrayFormats | TagSpecificYamlArrayFormats): string {
        if (typeof value === 'string') {
          value = [value];
        }

        switch (format) {
          case 'single-line':
            if (value == null || value.length === 0) {
              return ' []';
            }

            return ' ' + toSingleLineArrayYamlString(value);
          case 'multi-line':
            if (value == null || value.length === 0) {
              return '\n  - ';
            }
            return '\n  - ' + value.join('\n  - ');
          case 'single string to single-line':
            if (value == null || value.length === 0) {
              return ' ';
            } else if (value.length === 1) {
              return ' ' + value[0];
            }

            return ' ' + toSingleLineArrayYamlString(value);
          case 'single string to multi-line':
            if (value == null || value.length === 0) {
              return ' ';
            } else if (value.length === 1) {
              return ' ' + value[0];
            }

            return '\n  - ' + value.join('\n  - ');
          case 'single string space delimited':
            if (value == null || value.length === 0) {
              return ' ';
            } else if (value.length === 1) {
              return ' ' + value[0];
            }

            return ' ' +value.join(' ');
          case 'single string comma delimited':
            if (value == null || value.length === 0) {
              return ' ';
            } else if (value.length === 1) {
              return ' ' + value[0];
            }

            return ' ' + value.join(', ');
          case 'single-line space delimited':
            if (value == null || value.length === 0) {
              return ' []';
            } else if (value.length === 1) {
              return ' ' + value[0];
            }

            return ' ' + toSingleLineArrayYamlString(value).replaceAll(', ', ' ');
        }
      };

      const convertTagValueToStringOrStringArray = function(value: string | string[]): string[] {
        if (typeof value === 'string') {
          if (value.includes(',')) {
            return value.split(', ');
          }

          return value.split(' ');
        }

        return value;
      };

      if (options.formatAliasKey && Object.keys(yaml).includes(obsidianAliasKey)) {
        text = setYamlSection(text, obsidianAliasKey, formatYamlArrayValue(yaml[obsidianAliasKey], options.aliasArrayStyle) );
      }

      if (options.formatTagKey && Object.keys(yaml).includes(obsidianTagKey)) {
        text = setYamlSection(text, obsidianTagKey, formatYamlArrayValue(convertTagValueToStringOrStringArray(yaml[obsidianTagKey]), options.tagArrayStyle));
      }

      if (options.formatArrayKeys) {
        const keysToIgnore = [obsidianAliasKey, obsidianTagKey, ...options.forceMultiLineArrayStyle, ...options.forceSingleLineArrayStyle];

        for (const key of Object.keys(yaml)) {
          // skip non-arrays and already accounted for keys
          if (keysToIgnore.includes(key) || !(typeof yaml[key] !== 'string' && yaml[key] as string[])) {
            continue;
          }

          text = setYamlSection(text, key, formatYamlArrayValue(yaml[key], options.defaultArrayStyle));
        }
      }

      for (const singleLineArrayKey of options.forceSingleLineArrayStyle) {
        if (!Object.keys(yaml).includes(singleLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text, singleLineArrayKey, formatYamlArrayValue(yaml[singleLineArrayKey], 'single-line'));
      }

      for (const multiLineArrayKey of options.forceMultiLineArrayStyle) {
        if (!Object.keys(yaml).includes(multiLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text, multiLineArrayKey, formatYamlArrayValue(yaml[multiLineArrayKey], 'multi-line'));
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<FormatYamlArrayOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Test example',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          ---

          # Header Context

          Text
        `,
        after: dedent`
          ---
          language: Typescript
          type: programming
          tags: [computer]
          ---

          # Header Context

          Text
        `,
      }),
      new ExampleBuilder({
        description: 'Test example2',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer, science, trajectory
          ---

          # Header Context

          Text
        `,
        after: dedent`
          ---
          language: Typescript
          type: programming
          tags: [computer, science, trajectory]
          ---

          # Header Context

          Text
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<FormatYamlArrayOptions>[] {
    return [
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Yaml aliases section style',
        description: 'The style of the aliases yaml section',
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
            description: '```aliases: Title```',
          },
          {
            value: 'single string to multi-line',
            description: '```aliases: Title```',
          },
        ],
      }),
      new BooleanOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Format yaml aliases section',
        description: 'Turns on formatting for yaml aliases section',
        optionsKey: 'formatAliasKey',
      }),
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Yaml aliases section style',
        description: 'The style of the aliases yaml section',
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
            description: '```tags: tag1```',
          },
          {
            value: 'single string to multi-line',
            description: '```tags: tag1```',
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
        description: 'The style of the aliases yaml section',
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
        description: 'Turns on formatting for yaml arrays section',
        optionsKey: 'formatArrayKeys',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Force Key Values to Be Single-Line Arrays',
        description: 'Forces the yaml array for the new line separated keys to be in single-line format',
        optionsKey: 'forceSingleLineArrayStyle',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Force Key Values to Be Multi-Line Arrays',
        description: 'Forces the yaml array for the new line separated keys to be in multi-line format',
        optionsKey: 'forceMultiLineArrayStyle',
      }),
    ];
  }
}
