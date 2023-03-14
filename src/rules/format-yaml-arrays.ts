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
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: string = '"';
  @RuleBuilder.noSettingControl()
    removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class RuleTemplate extends RuleBuilder<FormatYamlArrayOptions> {
  constructor() {
    super({
      nameKey: 'rules.format-yaml-array.name',
      descriptionKey: 'rules.format-yaml-array.description',
      type: RuleType.YAML,
    });
  }
  get OptionsClass(): new () => FormatYamlArrayOptions {
    return FormatYamlArrayOptions;
  }
  apply(text: string, options: FormatYamlArrayOptions): string {
    return formatYAML(text, (text: string) => {
      const yaml = loadYAML(text.replace('---\n', '').replace('\n---', ''));
      if (!yaml) {
        return text;
      }

      for (const aliasKey of OBSIDIAN_ALIASES_KEYS) {
        if (options.formatAliasKey && Object.keys(yaml).includes(aliasKey)) {
          text = setYamlSection(text,
              aliasKey,
              formatYamlArrayValue(
                  convertAliasValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, aliasKey))),
                  options.aliasArrayStyle,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
              ),
          );

          break;
        }
      }

      for (const tagKey of OBSIDIAN_TAG_KEYS) {
        if (options.formatTagKey && Object.keys(yaml).includes(tagKey)) {
          text = setYamlSection(text,
              tagKey,
              formatYamlArrayValue(
                  convertTagValueToStringOrStringArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, tagKey))),
                  options.tagArrayStyle,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
              ),
          );

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

          text = setYamlSection(text,
              key,
              formatYamlArrayValue(
                  splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, key)),
                  options.defaultArrayStyle,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
              ),
          );
        }
      }

      for (const singleLineArrayKey of options.forceSingleLineArrayStyle) {
        if (!Object.keys(yaml).includes(singleLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text,
            singleLineArrayKey,
            formatYamlArrayValue(
                splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, singleLineArrayKey)),
                NormalArrayFormats.SingleLine,
                options.defaultEscapeCharacter,
                options.removeUnnecessaryEscapeCharsForMultiLineArrays,
            ),
        );
      }

      for (const multiLineArrayKey of options.forceMultiLineArrayStyle) {
        if (!Object.keys(yaml).includes(multiLineArrayKey)) {
          continue;
        }

        text = setYamlSection(text,
            multiLineArrayKey,
            formatYamlArrayValue(
                splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, multiLineArrayKey)),
                NormalArrayFormats.MultiLine,
                options.defaultEscapeCharacter,
                options.removeUnnecessaryEscapeCharsForMultiLineArrays,
            ),
        );
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
        nameKey: 'rules.format-yaml-array.alias-key.name',
        descriptionKey: 'rules.format-yaml-array.alias-key.description',
        optionsKey: 'formatAliasKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        nameKey: 'rules.format-yaml-array.tag-key.name',
        descriptionKey: 'rules.format-yaml-array.tag-key.description',
        optionsKey: 'formatTagKey',
      }),
      new DropdownOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        nameKey: 'rules.format-yaml-array.default-array-style.name',
        descriptionKey: 'rules.format-yaml-array.default-array-style.description',
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
        nameKey: 'rules.format-yaml-array.default-array-keys.name',
        descriptionKey: 'rules.format-yaml-array.default-array-keys.description',
        optionsKey: 'formatArrayKeys',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        nameKey: 'rules.format-yaml-array.force-single-line-array-style.name',
        descriptionKey: 'rules.format-yaml-array.force-single-line-array-style.description',
        optionsKey: 'forceSingleLineArrayStyle',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: FormatYamlArrayOptions,
        nameKey: 'rules.format-yaml-array.force-multi-line-array-style.name',
        descriptionKey: 'rules.format-yaml-array.force-multi-line-array-style.description',
        optionsKey: 'forceMultiLineArrayStyle',
      }),
    ];
  }
}
