import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {yamlRegex} from '../utils/regex';
import {getYamlSectionValue, loadYAML, removeYamlSection, setYamlSection} from '../utils/yaml';

type YamlSortOrderForOtherKeys = 'None' | 'Ascending Alphabetical' | 'Descending Alphabetical';

class YamlKeySortOptions implements Options {
  priorityKeysAtStartOfYaml?: boolean = true;
  dateModifiedKey?: string;
  currentTimeFormatted?: string;
  yamlTimestampDateModifiedEnabled?: boolean;
  yamlKeyPrioritySortOrder?: string[] = [];
  yamlSortOrderForOtherKeys?: YamlSortOrderForOtherKeys = 'None';
}

@RuleBuilder.register
export default class YamlKeySort extends RuleBuilder<YamlKeySortOptions> {
  get OptionsClass(): new () => YamlKeySortOptions {
    return YamlKeySortOptions;
  }
  get name(): string {
    return 'YAML Key Sort';
  }
  get description(): string {
    return 'Sorts the YAML keys based on the order and priority specified. Note: removes blank lines as well.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: YamlKeySortOptions): string {
    const yaml = text.match(yamlRegex);
    if (!yaml) {
      return text;
    }

    let yamlText = yaml[1];

    const priorityAtStartOfYaml: boolean = options.priorityKeysAtStartOfYaml;
    const updateDateModifiedIfYamlChanged = function(oldYaml: string, newYaml: string): string {
      if (oldYaml == newYaml) {
        return newYaml;
      }

      return setYamlSection(newYaml, options.dateModifiedKey, ' ' + options.currentTimeFormatted);
    };
    const getTextWithNewYamlFrontmatter = function(priorityKeysSorted: string, remainingKeys: string, priorityAtStart: boolean): string {
      let newYaml = `${remainingKeys}${priorityKeysSorted}`;
      if (priorityAtStart) {
        newYaml = `${priorityKeysSorted}${remainingKeys}`;
      }

      if (options.yamlTimestampDateModifiedEnabled) {
        newYaml = updateDateModifiedIfYamlChanged(yaml[1], newYaml);
      }

      return text.replace(yaml[1], newYaml);
    };

    const getYAMLKeysSorted = function(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
      let specifiedYamlKeysSorted = '';
      for (const key of keys) {
        const value = getYamlSectionValue(yaml, key);

        if (value !== null) {
          if (value.includes('\n')) {
            specifiedYamlKeysSorted += `${key}:${value}\n`;
          } else {
            specifiedYamlKeysSorted += `${key}: ${value}\n`;
          }

          yaml = removeYamlSection(yaml, key);
        }
      }

      return {
        remainingYaml: yaml,
        sortedYamlKeyValues: specifiedYamlKeysSorted,
      };
    };

    const yamlKeys: string[] = options.yamlKeyPrioritySortOrder;
    const sortKeysResult = getYAMLKeysSorted(yamlText, yamlKeys);
    const priorityKeysSorted = sortKeysResult.sortedYamlKeyValues;
    yamlText = sortKeysResult.remainingYaml;

    const sortOrder = options.yamlSortOrderForOtherKeys;
    const yamlObject = loadYAML(yamlText);
    if (yamlObject == null) {
      return getTextWithNewYamlFrontmatter(priorityKeysSorted, yamlText, priorityAtStartOfYaml);
    }

    const sortAlphabeticallyDesc = function(previousKey: string, currentKey: string): number {
      previousKey = previousKey.toLowerCase();
      currentKey = currentKey.toLowerCase();

      return previousKey > currentKey ? -1 : currentKey > previousKey ? 1 : 0;
    };
    const sortAlphabeticallyAsc = function(previousKey: string, currentKey: string): number {
      previousKey = previousKey.toLowerCase();
      currentKey = currentKey.toLowerCase();

      return previousKey < currentKey ? -1 : currentKey < previousKey ? 1 : 0;
    };

    let remainingKeys = Object.keys(yamlObject);
    let sortMethod: (previousKey: string, currentKey: string) => number;
    if (sortOrder === 'Ascending Alphabetical') {
      sortMethod = sortAlphabeticallyAsc;
    } else if (sortOrder === 'Descending Alphabetical') {
      sortMethod = sortAlphabeticallyDesc;
    } else {
      return getTextWithNewYamlFrontmatter(priorityKeysSorted, yamlText, priorityAtStartOfYaml);
    }

    remainingKeys = remainingKeys.sort(sortMethod);
    const remainingKeysSortResult = getYAMLKeysSorted(yamlText, remainingKeys);

    return getTextWithNewYamlFrontmatter(priorityKeysSorted, remainingKeysSortResult.sortedYamlKeyValues, priorityAtStartOfYaml);
  }
  get exampleBuilders(): ExampleBuilder<YamlKeySortOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []
          status: WIP
          date: 02/15/2022
          ---
        `,
        after: dedent`
          ---
          date: 02/15/2022
          type: programming
          language: Typescript
          tags: computer
          keywords: []
          status: WIP
          ---
        `,
        options: {
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            'language',
          ],
          yamlSortOrderForOtherKeys: 'None',
          priorityKeysAtStartOfYaml: true,
        },
      }),
      new ExampleBuilder({
        description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `\'YAML Sort Order for Other Keys\' = Ascending Alphabetical`',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []
          status: WIP
          date: 02/15/2022
          ---
        `,
        after: dedent`
          ---
          date: 02/15/2022
          type: programming
          language: Typescript
          keywords: []
          status: WIP
          tags: computer
          ---
        `,
        options: {
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            'language',
          ],
          yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
        },
      }),
      new ExampleBuilder({
        description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `\'YAML Sort Order for Other Keys\' = Descending Alphabetical`',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []
          status: WIP
          date: 02/15/2022
          ---
        `,
        after: dedent`
          ---
          date: 02/15/2022
          type: programming
          language: Typescript
          tags: computer
          status: WIP
          keywords: []
          ---
        `,
        options: {
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            'language',
          ],
          yamlSortOrderForOtherKeys: 'Descending Alphabetical',
          priorityKeysAtStartOfYaml: true,
        },
      }),
      new ExampleBuilder({
        description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language` with `\'YAML Sort Order for Other Keys\' = Descending Alphabetical` and `\'Priority Keys at Start of YAML\' = false`',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []
          ${''}
          status: WIP
          date: 02/15/2022
          ---
        `,
        after: dedent`
          ---
          tags: computer
          status: WIP
          keywords: []
          date: 02/15/2022
          type: programming
          language: Typescript
          ---
        `,
        options: {
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            'language',
          ],
          yamlSortOrderForOtherKeys: 'Descending Alphabetical',
          priorityKeysAtStartOfYaml: false,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        name: 'YAML Key Priority Sort Order',
        description: 'The order in which to sort keys with one on each line where it sorts in the order found in the list',
        optionsKey: 'yamlKeyPrioritySortOrder',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        name: 'Priority Keys at Start of YAML',
        description: 'YAML Key Priority Sort Order is placed at the start of the YAML frontmatter',
        optionsKey: 'priorityKeysAtStartOfYaml',
      }),
      new DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>({
        OptionsClass: YamlKeySortOptions,
        name: 'YAML Sort Order for Other Keys',
        description: 'The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area',
        optionsKey: 'yamlSortOrderForOtherKeys',
        records: [
          {
            value: 'None',
            description: 'No sorting other than what is in the YAML Key Priority Sort Order text area',
          },
          {
            value: 'Ascending Alphabetical',
            description: 'Sorts the keys based on key value from a to z',
          },
          {
            value: 'Descending Alphabetical',
            description: 'Sorts the keys based on key value from z to a',
          },
        ],
      }),
    ];
  }
  get hasSpecialExecutionOrder(): boolean {
    return true;
  }
}
