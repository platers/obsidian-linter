import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {yamlRegex} from '../utils/regex';
import {getYamlSectionValue, loadYAML, removeYamlSection, setYamlSection} from '../utils/yaml';

type YamlSortOrderForOtherKeys = 'None' | 'Ascending Alphabetical' | 'Descending Alphabetical';

class YamlKeySortOptions implements Options {
  priorityKeysAtStartOfYaml?: boolean = true;

  @RuleBuilder.noSettingControl()
    dateModifiedKey?: string;

  @RuleBuilder.noSettingControl()
    currentTimeFormatted?: string;

  @RuleBuilder.noSettingControl()
    yamlTimestampDateModifiedEnabled?: boolean;

  yamlKeyPrioritySortOrder?: string[] = [];
  yamlSortOrderForOtherKeys?: YamlSortOrderForOtherKeys = 'None';
}

@RuleBuilder.register
export default class YamlKeySort extends RuleBuilder<YamlKeySortOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-key-sort.name',
      descriptionKey: 'rules.yaml-key-sort.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => YamlKeySortOptions {
    return YamlKeySortOptions;
  }
  apply(text: string, options: YamlKeySortOptions): string {
    const yaml = text.match(yamlRegex);
    if (!yaml) {
      return text;
    }

    const oldYaml = yaml[1];
    let yamlText = oldYaml;

    const priorityAtStartOfYaml: boolean = options.priorityKeysAtStartOfYaml;

    const yamlKeys: string[] = options.yamlKeyPrioritySortOrder;
    const sortKeysResult = this.getYAMLKeysSorted(yamlText, yamlKeys);
    const priorityKeysSorted = sortKeysResult.sortedYamlKeyValues;
    yamlText = sortKeysResult.remainingYaml;

    const sortOrder = options.yamlSortOrderForOtherKeys;
    const yamlObject = loadYAML(yamlText);
    if (yamlObject == null) {
      return this.getTextWithNewYamlFrontmatter(text, oldYaml, priorityKeysSorted, yamlText, priorityAtStartOfYaml, options.dateModifiedKey, options.currentTimeFormatted, options.yamlTimestampDateModifiedEnabled);
    }

    let remainingKeys = Object.keys(yamlObject);
    let sortMethod: (previousKey: string, currentKey: string) => number;
    if (sortOrder === 'Ascending Alphabetical') {
      sortMethod = this.sortAlphabeticallyAsc;
    } else if (sortOrder === 'Descending Alphabetical') {
      sortMethod = this.sortAlphabeticallyDesc;
    } else {
      return this.getTextWithNewYamlFrontmatter(text, oldYaml, priorityKeysSorted, yamlText, priorityAtStartOfYaml, options.dateModifiedKey, options.currentTimeFormatted, options.yamlTimestampDateModifiedEnabled);
    }

    remainingKeys = remainingKeys.sort(sortMethod);
    const remainingKeysSortResult = this.getYAMLKeysSorted(yamlText, remainingKeys);

    return this.getTextWithNewYamlFrontmatter(text, oldYaml, priorityKeysSorted, remainingKeysSortResult.sortedYamlKeyValues, priorityAtStartOfYaml, options.dateModifiedKey, options.currentTimeFormatted, options.yamlTimestampDateModifiedEnabled);
  }
  getYAMLKeysSorted(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
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
  }
  updateDateModifiedIfYamlChanged(oldYaml: string, newYaml: string, dateModifiedKey: string, currentTimeFormatted: string): string {
    if (oldYaml == newYaml) {
      return newYaml;
    }

    return setYamlSection(newYaml, dateModifiedKey, ' ' + currentTimeFormatted);
  }
  getTextWithNewYamlFrontmatter(text: string, oldYaml: string, priorityKeysSorted: string, remainingKeys: string, priorityAtStart: boolean, dateModifiedKey: string, currentTimeFormatted: string, yamlTimestampDateModifiedEnabled: boolean): string {
    let newYaml = `${remainingKeys}${priorityKeysSorted}`;
    if (priorityAtStart) {
      newYaml = `${priorityKeysSorted}${remainingKeys}`;
    }

    if (yamlTimestampDateModifiedEnabled) {
      newYaml = this.updateDateModifiedIfYamlChanged(oldYaml, newYaml, dateModifiedKey, currentTimeFormatted);
    }

    return text.replace(oldYaml, newYaml);
  }
  sortAlphabeticallyAsc(previousKey: string, currentKey: string): number {
    previousKey = previousKey.toLowerCase();
    currentKey = currentKey.toLowerCase();

    return previousKey < currentKey ? -1 : currentKey < previousKey ? 1 : 0;
  }
  sortAlphabeticallyDesc(previousKey: string, currentKey: string): number {
    previousKey = previousKey.toLowerCase();
    currentKey = currentKey.toLowerCase();

    return previousKey > currentKey ? -1 : currentKey > previousKey ? 1 : 0;
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
        nameKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.name',
        descriptionKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.description',
        optionsKey: 'yamlKeyPrioritySortOrder',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.name',
        descriptionKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.description',
        optionsKey: 'priorityKeysAtStartOfYaml',
      }),
      new DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.name',
        descriptionKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.description',
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
}
