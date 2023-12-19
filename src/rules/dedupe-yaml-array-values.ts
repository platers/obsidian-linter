import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
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
  QuoteCharacter,
  setYamlSection,
  SpecialArrayFormats,
  splitValueIfSingleOrMultilineArray,
  TagSpecificArrayFormats} from '../utils/yaml';

class DedupeYamlArrayValuesOptions implements Options {
  @RuleBuilder.noSettingControl()
    aliasArrayStyle?: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  dedupeAliasKey?: boolean = true;
  @RuleBuilder.noSettingControl()
    tagArrayStyle?: TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  dedupeTagKey?: boolean = true;
  dedupeArrayKeys?: boolean = true;
  ignoreDedupeArrayKeys?: string[] = [];
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';
  @RuleBuilder.noSettingControl()
    removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class RuleTemplate extends RuleBuilder<DedupeYamlArrayValuesOptions> {
  constructor() {
    super({
      nameKey: 'rules.dedupe-yaml-array-values.name',
      descriptionKey: 'rules.dedupe-yaml-array-values.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => DedupeYamlArrayValuesOptions {
    return DedupeYamlArrayValuesOptions;
  }
  apply(text: string, options: DedupeYamlArrayValuesOptions): string {
    return formatYAML(text, (text: string) => {
      const yaml = loadYAML(text.replace('---\n', '').replace('\n---', ''));
      if (!yaml) {
        return text;
      }

      for (const aliasKey of OBSIDIAN_ALIASES_KEYS) {
        if (options.dedupeAliasKey && Object.keys(yaml).includes(aliasKey)) {
          text = setYamlSection(text,
              aliasKey,
              formatYamlArrayValue(
                  convertAliasValueToStringOrStringArray(this.getUniqueArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, aliasKey)))),
                  options.aliasArrayStyle,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
                  true, // escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747
              ),
          );

          break;
        }
      }

      for (const tagKey of OBSIDIAN_TAG_KEYS) {
        if (options.dedupeTagKey && Object.keys(yaml).includes(tagKey)) {
          text = setYamlSection(text,
              tagKey,
              formatYamlArrayValue(
                  convertTagValueToStringOrStringArray(this.getUniqueArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, tagKey)))),
                  options.tagArrayStyle,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
              ),
          );

          break;
        }
      }

      if (options.dedupeArrayKeys) {
        const keysToIgnore = [...OBSIDIAN_ALIASES_KEYS, ...OBSIDIAN_TAG_KEYS, ...options.ignoreDedupeArrayKeys];

        for (const key of Object.keys(yaml)) {
          // skip non-arrays, arrays of objects, ignored keys, and already accounted for keys
          if (keysToIgnore.includes(key) || !Array.isArray(yaml[key]) || (yaml[key].length !== 0 && typeof yaml[key][0] === 'object' && yaml[key][0] !== null)) {
            continue;
          }

          const currentYamlText = getYamlSectionValue(text, key);
          let arrayType = NormalArrayFormats.SingleLine;
          if (currentYamlText.includes('\n')) {
            arrayType = NormalArrayFormats.MultiLine;
          }

          const newVal = this.getUniqueArray(splitValueIfSingleOrMultilineArray(currentYamlText));

          text = setYamlSection(text,
              key,
              formatYamlArrayValue(
                  newVal,
                  arrayType,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
              ),
          );
        }
      }

      return text;
    });
  }
  getUniqueArray(arr: string | string[]): string | string[] {
    if (arr == null || typeof arr === 'string' || arr.length <= 1) {
      return arr;
    }

    return [...new Set(arr)];
  }

  get exampleBuilders(): ExampleBuilder<DedupeYamlArrayValuesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Dedupe YAML tags is case sensitive and will use your default format for tags.',
        before: dedent`
          ---
          tags: [computer, research, computer, Computer]
          aliases:
            - Title 1
            - Title2
          ---
        `,
        after: dedent`
          ---
          tags: [computer, research, Computer]
          aliases:
            - Title 1
            - Title2
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      }),
      new ExampleBuilder({
        description: 'Dedupe YAML aliases is case sensitive and will use your default format for aliases.',
        before: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
            - Title 1
            - Title2
            - Title 3
          ---
        `,
        after: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
            - Title 3
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      }),
      new ExampleBuilder({
        description: 'Dedupe YAML array keys is case sensitive and will try to preserve the original array format.',
        before: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
          arr1: [val, val1, val, val2, Val]
          arr2:
            - Val
            - Val
            - val
            - val2
            - Val2
          ---
        `,
        after: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
          arr1: [val, val1, val2, Val]
          arr2:
            - Val
            - val
            - val2
            - Val2
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      }),
      new ExampleBuilder({
        description: 'Dedupe YAML respects list of keys to not remove duplicates of for normal arrays (keys to ignore is just `arr2` for this example)',
        before: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
          arr1: [val, val1, val, val2, Val]
          arr2:
            - Val
            - Val
            - val
            - val2
            - Val2
          ---
        `,
        after: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title2
          arr1: [val, val1, val2, Val]
          arr2:
            - Val
            - Val
            - val
            - val2
            - Val2
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
          ignoreDedupeArrayKeys: ['arr2'],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<DedupeYamlArrayValuesOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.alias-key.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.alias-key.description',
        optionsKey: 'dedupeAliasKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.tag-key.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.tag-key.description',
        optionsKey: 'dedupeTagKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.default-array-keys.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.default-array-keys.description',
        optionsKey: 'dedupeArrayKeys',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.ignore-keys.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.ignore-keys.description',
        optionsKey: 'ignoreDedupeArrayKeys',
      }),
    ];
  }
}
