import { Options, RuleType } from '../rules';
import RuleBuilder, { BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase, ListItemOptionBuilder } from './rule-builder';
import dedent from 'ts-dedent';
import {
  convertAliasValueToStringOrStringArray,
  convertTagValueToStringOrStringArray,
  formatYAML,
  formatYamlArrayValue,
  getYamlSectionValue,
  loadYAML,
  ArrayFormats,
  QuoteCharacter,
  setYamlSection,
  splitValueIfSingleOrMultilineArray,
  OBSIDIAN_TAG_KEY,
  OBSIDIAN_ALIAS_KEY
} from '../utils/yaml';
import { isValidYamlKeyOnly } from '../utils/validation';

class DedupeYamlArrayValuesOptions implements Options {
  @RuleBuilder.noSettingControl()
  aliasArrayStyle?: ArrayFormats = ArrayFormats.SingleLine;
  dedupeAliasKey?: boolean = true;
  @RuleBuilder.noSettingControl()
  tagArrayStyle?: ArrayFormats = ArrayFormats.SingleLine;
  dedupeTagKey?: boolean = true;
  dedupeArrayKeys?: boolean = true;
  ignoreDedupeArrayKeys?: string[] = [];
  @RuleBuilder.noSettingControl()
  defaultEscapeCharacter?: QuoteCharacter = '"';
  @RuleBuilder.noSettingControl()
  removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class DedupeYamlArrayValues extends RuleBuilder<DedupeYamlArrayValuesOptions> {
  constructor() {
    super({
      nameKey: 'rules.dedupe-yaml-array-values.name',
      descriptionKey: 'rules.dedupe-yaml-array-values.description',
      type: RuleType.YAML,
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

      if (options.dedupeAliasKey && Object.keys(yaml).includes(OBSIDIAN_ALIAS_KEY)) {
        text = setYamlSection(text,
          OBSIDIAN_ALIAS_KEY,
          formatYamlArrayValue(
            convertAliasValueToStringOrStringArray(this.getUniqueArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, OBSIDIAN_ALIAS_KEY)))),
            options.aliasArrayStyle,
            options.defaultEscapeCharacter,
            options.removeUnnecessaryEscapeCharsForMultiLineArrays,
            true, // escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747
          ),
        );
      }

      if (options.dedupeTagKey && Object.keys(yaml).includes(OBSIDIAN_TAG_KEY)) {
        text = setYamlSection(text,
          OBSIDIAN_TAG_KEY,
          formatYamlArrayValue(
            convertTagValueToStringOrStringArray(this.getUniqueArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, OBSIDIAN_TAG_KEY)))),
            options.tagArrayStyle,
            options.defaultEscapeCharacter,
            options.removeUnnecessaryEscapeCharsForMultiLineArrays,
          ),
        );

      }

      if (options.dedupeArrayKeys) {
        const keysToIgnore = [OBSIDIAN_ALIAS_KEY, OBSIDIAN_TAG_KEY, ...options.ignoreDedupeArrayKeys];

        for (const key of Object.keys(yaml)) {
          // skip non-arrays, arrays of objects, ignored keys, and already accounted for keys
          if (keysToIgnore.includes(key) || !Array.isArray(yaml[key]) || ((yaml as { [k: string]: object[] })[key].length !== 0 && typeof (yaml as { [k: string]: object[] })[key][0] === 'object' && (yaml as { [k: string]: object[] })[key][0] !== null)) {
            continue;
          }

          const currentYamlText = getYamlSectionValue(text, key);
          let arrayType = ArrayFormats.SingleLine;
          if (currentYamlText.includes('\n')) {
            arrayType = ArrayFormats.MultiLine;
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
  getYamlValue(value: string): string {
    if (typeof value !== "string" || value.length < 2) {
      return value;
    }

    if (value.startsWith("'") && value.endsWith("'")) {
      return value.slice(1, -1);
    }

    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }

    return value;
  }
  getUniqueArray(arr: string | string[]): string | string[] {
    if (arr == null || typeof arr === "string" || arr.length <= 1) {
      return arr;
    }

    const uniqueValues = new Set();
    const result: string[] = [];

    for (const value of arr) {
      const normalizedValue = this.getYamlValue(value);
      if (uniqueValues.has(normalizedValue)) {
        continue;
      }

      uniqueValues.add(normalizedValue);
      result.push(value);
    }

    return result;
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
          aliasArrayStyle: ArrayFormats.MultiLine,
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
          aliasArrayStyle: ArrayFormats.MultiLine,
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
          aliasArrayStyle: ArrayFormats.MultiLine,
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
          aliasArrayStyle: ArrayFormats.MultiLine,
          ignoreDedupeArrayKeys: ['arr2'],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<DedupeYamlArrayValuesOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.dedupe-alias-key.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.dedupe-alias-key.description',
        optionsKey: 'dedupeAliasKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.dedupe-tag-key.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.dedupe-tag-key.description',
        optionsKey: 'dedupeTagKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.dedupe-array-keys.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.dedupe-array-keys.description',
        optionsKey: 'dedupeArrayKeys',
      }),
      new ListItemOptionBuilder({
        OptionsClass: DedupeYamlArrayValuesOptions,
        nameKey: 'rules.dedupe-yaml-array-values.ignore-keys.name',
        descriptionKey: 'rules.dedupe-yaml-array-values.ignore-keys.description',
        emptyStateKey: 'rules.dedupe-yaml-array-values.ignore-keys.empty-state',
        fieldNamePlaceholderKey: 'rules.dedupe-yaml-array-values.ignore-keys.placeholder-text',
        optionsKey: 'ignoreDedupeArrayKeys',
        trimItemWhitespace: true,
        validator: isValidYamlKeyOnly,
      }),
    ];
  }
}
