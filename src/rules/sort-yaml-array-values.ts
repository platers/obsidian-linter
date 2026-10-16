import { Options, RuleType } from '../rules';
import RuleBuilder, { BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, ListItemOptionBuilder } from './rule-builder';
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
  OBSIDIAN_ALIAS_KEY,
  OBSIDIAN_TAG_KEY,
} from '../utils/yaml';
import { isValidYamlKeyOnly } from '../utils/validation';

type YamlArraySortOrder = 'Ascending Alphabetical' | 'Descending Alphabetical'

class SortYamlArrayValuesOptions implements Options {
  @RuleBuilder.noSettingControl()
  aliasArrayStyle?: ArrayFormats = ArrayFormats.SingleLine;
  sortAliasKey?: boolean = true;
  @RuleBuilder.noSettingControl()
  tagArrayStyle?: ArrayFormats = ArrayFormats.SingleLine;
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
export default class SortYamlArrayValues extends RuleBuilder<SortYamlArrayValuesOptions> {
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

      if (options.sortAliasKey && Object.keys(yaml).includes(OBSIDIAN_ALIAS_KEY)) {
        text = setYamlSection(text,
          OBSIDIAN_ALIAS_KEY,
          formatYamlArrayValue(
            convertAliasValueToStringOrStringArray(this.sortArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, OBSIDIAN_ALIAS_KEY)), options.sortOrder)),
            options.aliasArrayStyle,
            options.defaultEscapeCharacter,
            options.removeUnnecessaryEscapeCharsForMultiLineArrays,
            true, // escape numeric aliases see https://github.com/platers/obsidian-linter/issues/747
          ),
        );

      }

      if (options.sortTagKey && Object.keys(yaml).includes(OBSIDIAN_TAG_KEY)) {
        text = setYamlSection(text,
          OBSIDIAN_TAG_KEY,
          formatYamlArrayValue(
            convertTagValueToStringOrStringArray(this.sortArray(splitValueIfSingleOrMultilineArray(getYamlSectionValue(text, OBSIDIAN_TAG_KEY)), options.sortOrder)),
            options.tagArrayStyle,
            options.defaultEscapeCharacter,
            options.removeUnnecessaryEscapeCharsForMultiLineArrays,
          ),
        );
      }

      if (options.sortArrayKeys) {
        const keysToIgnore = [OBSIDIAN_ALIAS_KEY, OBSIDIAN_TAG_KEY, ...options.ignoreSortArrayKeys];

        for (const key of Object.keys(yaml)) {
          // skip non-arrays, arrays of objects, ignored keys, and already accounted for keys
          if (keysToIgnore.includes(key) || !Array.isArray((yaml as { [k: string]: object })[key]) || ((yaml as { [k: string]: object[] })[key].length !== 0 && typeof (yaml as { [k: string]: object[] })[key][0] === 'object' && (yaml as { [k: string]: object[] })[key][0] !== null)) {
            continue;
          }

          const currentYamlText = getYamlSectionValue(text, key);
          let arrayType = ArrayFormats.SingleLine;
          if (currentYamlText.includes('\n')) {
            arrayType = ArrayFormats.MultiLine;
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
    arr.sort(function (a, b) {
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
          aliasArrayStyle: ArrayFormats.MultiLine,
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
          aliasArrayStyle: ArrayFormats.MultiLine,
          sortOrder: 'Descending Alphabetical',
        },
      }),
      new ExampleBuilder({
        description: 'Sort YAML arrays respects list of keys to not sort values of for normal arrays (keys to ignore is just `arr2` for this example)',
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
          aliasArrayStyle: ArrayFormats.MultiLine,
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
      new ListItemOptionBuilder({
        OptionsClass: SortYamlArrayValuesOptions,
        nameKey: 'rules.sort-yaml-array-values.ignore-keys.name',
        descriptionKey: 'rules.sort-yaml-array-values.ignore-keys.description',
        emptyStateKey: 'rules.sort-yaml-array-values.ignore-keys.empty-state',
        fieldNamePlaceholderKey: 'rules.sort-yaml-array-values.ignore-keys.placeholder-text',
        optionsKey: 'ignoreSortArrayKeys',
        validator: isValidYamlKeyOnly,
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
