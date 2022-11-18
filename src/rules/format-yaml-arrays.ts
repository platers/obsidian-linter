import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {convertAliasValueToStringOrStringArray,
  convertTagValueToStringOrStringArray,
  formatYAML,
  formatYamlArrayValue,
  getYamlSectionValue,
  loadYAML,
  NormalArrayFormats,
  OBSIDIAN_ALIASES_KEYS,
  OBSIDIAN_TAG_KEYS,
  setYamlSection,
  SpecialArrayFormats,
  splitValueIfSingleOrMultilineArray,
  TagSpecificArrayFormats} from '../utils/yaml';

class FormatYamlArrayOptions implements Options {
  @RuleBuilder.noSettingControl()
    aliasArrayStyle?: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  formatAliasKey?: boolean = true;
  @RuleBuilder.noSettingControl()
    tagArrayStyle?: TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  formatTagKey?: boolean = true;
  defaultArrayStyle?: NormalArrayFormats = NormalArrayFormats.SingleLine;
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
      const yaml = loadYAML(text.replace('---\n', '').replace('\n---', ''));
      if (!yaml) {
        return text;
      }

      for (const aliasKey of OBSIDIAN_ALIASES_KEYS) {
        if (options.formatAliasKey && Object.keys(yaml).includes(aliasKey)) {
          text = setYamlSection(text, aliasKey, formatYamlArrayValue(convertAliasValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, aliasKey))), options.aliasArrayStyle));

          break;
        }
      }

      for (const tagKey of OBSIDIAN_TAG_KEYS) {
        if (options.formatTagKey && Object.keys(yaml).includes(tagKey)) {
          text = setYamlSection(text, tagKey, formatYamlArrayValue(convertTagValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, tagKey))), options.tagArrayStyle));

          break;
        }
      }

      if (options.formatArrayKeys) {
        const keysToIgnore = [...OBSIDIAN_ALIASES_KEYS, ...OBSIDIAN_TAG_KEYS, ...options.forceMultiLineArrayStyle, ...options.forceSingleLineArrayStyle];

        for (const key of Object.keys(yaml)) {
          // skip non-arrays, arrays of objects, ignored keys, and already accounted for keys
          if (keysToIgnore.includes(key) || !Array.isArray(yaml[key]) || (yaml[key].length !== 0 && typeof yaml[key][0] === 'object' && yaml[key][0] !== null)) {
            continue;
          }

          text = setYamlSection(text, key, formatYamlArrayValue(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, key)), options.defaultArrayStyle));
        }
      }

      for (const singleLineArrayKey of options.forceSingleLineArrayStyle) {
        if (!Object.keys(yaml).includes(singleLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text, singleLineArrayKey, formatYamlArrayValue(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, singleLineArrayKey)), NormalArrayFormats.SingleLine));
      }

      for (const multiLineArrayKey of options.forceMultiLineArrayStyle) {
        if (!Object.keys(yaml).includes(multiLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text, multiLineArrayKey, formatYamlArrayValue(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, multiLineArrayKey)), NormalArrayFormats.MultiLine));
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
          # Notes:
          ${''}
          Nesting yaml arrays may result in unexpected results.
          ${''}
          Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid yaml unless it comes as the last entry in the array.
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
          # Notes:
          ${''}
          Nesting yaml arrays may result in unexpected results.
          ${''}
          Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid yaml unless it comes as the last entry in the array.
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
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
          tagArrayStyle: TagSpecificArrayFormats.SingleStringSpaceDelimited,
        },
      }),
      new ExampleBuilder({
        description: 'Arrays with dictionaries in them are ignored',
        before: dedent`
          ---
          gists:
            - id: test123
              url: 'some_url'
              filename: file.md
              isPublic: true
          ---
        `,
        after: dedent`
          ---
          gists:
            - id: test123
              url: 'some_url'
              filename: file.md
              isPublic: true
          ---
        `,
        options: {
          formatArrayKeys: true,
          defaultArrayStyle: NormalArrayFormats.SingleLine,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<FormatYamlArrayOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Format yaml aliases section',
        description: 'Turns on formatting for the yaml aliases section. You should not enable this option alongside the rule `YAML Title Alias` as they may not work well together or they may have different format styles selected causing unexpected results.',
        optionsKey: 'formatAliasKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Format yaml tags section',
        description: 'Turns on formatting for the yaml tags section.',
        optionsKey: 'formatTagKey',
      }),
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        name: 'Default yaml array section style',
        description: 'The style of other yaml arrays that are not `tags`, `aliases` or  in `Force key values to be single-line arrays` and `Force key values to be multi-line arrays`',
        optionsKey: 'defaultArrayStyle',
        records: [
          {
            value: NormalArrayFormats.MultiLine as NormalArrayFormats,
            description: '```key:\\n  - value```',
          },
          {
            value: NormalArrayFormats.SingleLine,
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
