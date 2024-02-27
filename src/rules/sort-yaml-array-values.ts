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
  QuoteCharacter,
  setYamlSection,
  SpecialArrayFormats,
  splitValueIfSingleOrMultilineArray,
  TagSpecificArrayFormats} from '../utils/yaml';

type YamlArraySortOrder = 'Ascending Alphabetical' | 'Descending Alphabetical'

class SortYamlArrayValuesOptions implements Options {
  @RuleBuilder.noSettingControl()
    aliasArrayStyle?: NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  sortAliasKey?: boolean = true;
  @RuleBuilder.noSettingControl()
    tagArrayStyle?: TagSpecificArrayFormats | NormalArrayFormats | SpecialArrayFormats = NormalArrayFormats.SingleLine;
  sortTagKey?: boolean = true;
  sortArrayKeys?: boolean = true;
  sortOrder?: YamlArraySortOrder = 'Ascending Alphabetical';
  ignoreSortArrayKeys?: string[] = [];
  @RuleBuilder.noSettingControl()
    defaultEscapeCharacter?: QuoteCharacter = '"';
  @RuleBuilder.noSettingControl()
    removeUnnecessaryEscapeCharsForMultiLineArrays?: boolean = false;
}

@RuleBuilder.register
export default class RuleTemplate extends RuleBuilder<SortYamlArrayValuesOptions> {
  constructor() {
    super({
      nameKey: 'rules.sort-yaml-array-values.name',
      descriptionKey: 'rules.sort-yaml-array-values.description',
      type: RuleType.YAML,
    });
  }
  get OptionsClass(): new () => SortYamlArrayValuesOptions {
    return SortYamlArrayValuesOptions;
  }
  apply(text: string, options: SortYamlArrayValuesOptions): string {
    return formatYAML(text, (text: string) => {
      const yaml = loadYAML(text.replace('---\n', '').replace('\n---', ''));
      if (!yaml) {
        return text;
      }

      for (const aliasKey of OBSIDIAN_ALIASES_KEYS) {
        if (options.sortAliasKey && Object.keys(yaml).includes(aliasKey)) {
          text = setYamlSection(text,
              aliasKey,
              formatYamlArrayValue(
                  convertAliasValueToStringOrStringArray(this.sortArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, aliasKey)), options.sortOrder)),
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
        if (options.sortTagKey && Object.keys(yaml).includes(tagKey)) {
          text = setYamlSection(text,
              tagKey,
              formatYamlArrayValue(
                  convertTagValueToStringOrStringArray(this.sortArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, tagKey)), options.sortOrder)),
                  options.tagArrayStyle,
                  options.defaultEscapeCharacter,
                  options.removeUnnecessaryEscapeCharsForMultiLineArrays,
              ),
          );

          break;
        }
      }

      if (options.sortArrayKeys) {
        const keysToIgnore = [...OBSIDIAN_ALIASES_KEYS, ...OBSIDIAN_TAG_KEYS, ...options.ignoreSortArrayKeys];

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

          const newVal = this.sortArray(splitValueIfSingleOrMultilineArray(currentYamlText), options.sortOrder);

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
  sortArray(arr: string | string[], sortType: YamlArraySortOrder): string | string[] {
    if (arr == null || typeof arr === 'string' || arr.length <= 1) {
      return arr;
    }

    // logic from https://stackoverflow.com/a/26061065/8353749
    arr.sort(function(a, b) {
      /* Storing case insensitive comparison */
      const comparison = a.toLowerCase().localeCompare(b.toLowerCase());
      /* If strings are equal in case insensitive comparison */
      if (comparison === 0) {
        /* Return case sensitive comparison instead */
        return a.localeCompare(b);
      }
      /* Otherwise return result */
      return comparison;
    });
    if (sortType === 'Ascending Alphabetical') {
      return arr;
    }

    arr.reverse();

    return arr;
  }
  get exampleBuilders(): ExampleBuilder<SortYamlArrayValuesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Sorting YAML array values alphabetically',
        before: dedent`
          ---
          tags: [computer, research, androids, Computer]
          aliases:
            - Title 1
            - Title 2
          ---
        `,
        after: dedent`
          ---
          tags: [androids, computer, Computer, research]
          aliases:
            - Title 1
            - Title 2
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      }),
      new ExampleBuilder({
        description: 'Sorting YAML array values to be alphabetically descending',
        before: dedent`
          ---
          tags: [computer, research, androids, Computer]
          aliases:
            - Title 1
            - Title 2
          ---
        `,
        after: dedent`
          ---
          tags: [research, Computer, computer, androids]
          aliases:
            - Title 2
            - Title 1
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
        },
      }),
      new ExampleBuilder({
        description: 'Sort YAML Arrays respects list of keys to not sort values of for normal arrays (keys to ignore is just `arr2` for this example)',
        before: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title 2
          arr1: [val, val2, val1]
          arr2:
            - val
            - val2
            - val1
          ---
        `,
        after: dedent`
          ---
          tags: [computer, research]
          aliases:
            - Title 1
            - Title 2
          arr1: [val, val1, val2]
          arr2:
            - val
            - val2
            - val1
          ---
        `,
        options: {
          aliasArrayStyle: NormalArrayFormats.MultiLine,
          ignoreSortArrayKeys: ['arr2'],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<SortYamlArrayValuesOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: SortYamlArrayValuesOptions,
        nameKey: 'rules.sort-yaml-array-values.sort-alias-key.name',
        descriptionKey: 'rules.sort-yaml-array-values.sort-alias-key.description',
        optionsKey: 'sortAliasKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: SortYamlArrayValuesOptions,
        nameKey: 'rules.sort-yaml-array-values.sort-tag-key.name',
        descriptionKey: 'rules.sort-yaml-array-values.sort-tag-key.description',
        optionsKey: 'sortTagKey',
      }),
      new BooleanOptionBuilder({
        OptionsClass: SortYamlArrayValuesOptions,
        nameKey: 'rules.sort-yaml-array-values.sort-array-keys.name',
        descriptionKey: 'rules.sort-yaml-array-values.sort-array-keys.description',
        optionsKey: 'sortArrayKeys',
      }),
      new TextAreaOptionBuilder({
        OptionsClass: SortYamlArrayValuesOptions,
        nameKey: 'rules.sort-yaml-array-values.ignore-keys.name',
        descriptionKey: 'rules.sort-yaml-array-values.ignore-keys.description',
        optionsKey: 'ignoreSortArrayKeys',
      }),
      new DropdownOptionBuilder<SortYamlArrayValuesOptions, YamlArraySortOrder>({
        OptionsClass: SortYamlArrayValuesOptions,
        nameKey: 'rules.sort-yaml-array-values.sort-order.name',
        descriptionKey: 'rules.sort-yaml-array-values.sort-order.description',
        optionsKey: 'sortOrder',
        records: [
          {
            value: 'Ascending Alphabetical',
            description: 'Sorts the array values from a to z',
          },
          {
            value: 'Descending Alphabetical',
            description: 'Sorts the array values from z to a',
          },
        ],
      }),
    ];
  }
}
