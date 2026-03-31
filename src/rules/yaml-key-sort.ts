import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {parseYAML, getYAMLText, loadYAML, setYamlSection, astToString, getEmptyDocument} from '../utils/yaml';
import {Document} from 'yaml';
import {YamlCSTTokens, YamlNode} from '../typings/yaml';
import {FlowCollection} from 'yaml/dist/parse/cst';

type YamlSortOrderForOtherKeys = 'None' | 'Ascending Alphabetical' | 'Descending Alphabetical';

const OTHERS_TOKEN = '<others>';

function normalizeYamlSortToken(token: string): string {
  token = token.trim();

  if (token === OTHERS_TOKEN) {
    return token;
  }

  if (token.endsWith(':')) {
    return token.substring(0, token.length - 1).trimEnd();
  }

  return token;
}

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
    const oldYaml = getYAMLText(text);
    if (oldYaml === null) {
      return text;
    }

    const yamlText = oldYaml;
    const priorityAtStartOfYaml: boolean = options.priorityKeysAtStartOfYaml;

    const yamlKeys: string[] = (options.yamlKeyPrioritySortOrder ?? [])
        .map(normalizeYamlSortToken)
        .filter((token) => token.length > 0);

    const yamlObject = loadYAML(yamlText);
    const doc = parseYAML(yamlText);
    const startingPriorityKeys = getEmptyDocument(doc);

    if (doc.contents == null) {
      return text;
    }

    const sortOrder = options.yamlSortOrderForOtherKeys;
    if (yamlObject == null) {
      return this.getTextWithNewYamlFrontmatter(
          text,
          oldYaml,
          astToString(startingPriorityKeys),
          astToString(doc),
          priorityAtStartOfYaml,
          options.dateModifiedKey,
          options.currentTimeFormatted,
          options.yamlTimestampDateModifiedEnabled,
      );
    }

    const usedOthersToken = this.getYAMLKeysSortedWithOthers(
        yamlKeys,
        doc,
        startingPriorityKeys,
        sortOrder,
    );

    if (usedOthersToken) {
      return this.getTextWithNewYamlFrontmatter(
          text,
          oldYaml,
          astToString(startingPriorityKeys),
          '',
          true,
          options.dateModifiedKey,
          options.currentTimeFormatted,
          options.yamlTimestampDateModifiedEnabled,
      );
    }

    let remainingKeys = this.getYAMLKeysSorted(yamlKeys, doc, startingPriorityKeys);

    if (sortOrder === 'None') {
      return this.getTextWithNewYamlFrontmatter(
          text,
          oldYaml,
          astToString(startingPriorityKeys),
          astToString(doc),
          priorityAtStartOfYaml,
          options.dateModifiedKey,
          options.currentTimeFormatted,
          options.yamlTimestampDateModifiedEnabled,
      );
    }

    const remainingDocKeys = getEmptyDocument(doc);
    remainingKeys = this.sortRemainingKeys(remainingKeys, sortOrder);
    this.getYAMLKeysSorted(remainingKeys, doc, remainingDocKeys);

    return this.getTextWithNewYamlFrontmatter(
        text,
        oldYaml,
        astToString(startingPriorityKeys),
        astToString(remainingDocKeys),
        priorityAtStartOfYaml,
        options.dateModifiedKey,
        options.currentTimeFormatted,
        options.yamlTimestampDateModifiedEnabled,
    );
  }
  getYAMLKeysSorted(keys: string[], yamlObject: Document, newDocument: Document): string[] {
    const initialKeys: YamlNode[] = (yamlObject.contents as YamlNode).items as YamlNode[];
    const remainingKeys: string[] = [];

    for (const key of keys) {
      for (let i = 0; i < initialKeys.length; i++) {
        const node = initialKeys[i];
        if (node.key.value === key) {
          newDocument.add(node);
          initialKeys.splice(i, 1);
          (newDocument.contents.srcToken as YamlCSTTokens).items.push((yamlObject.contents.srcToken as FlowCollection).items[i]);
          (yamlObject.contents.srcToken as FlowCollection).items.splice(i, 1);

          break;
        }
      }
    }

    for (const node of initialKeys) {
      remainingKeys.push(node.key.value);
    }

    return remainingKeys;
  }
  getYAMLKeysSortedWithOthers(tokens: string[], yamlObject: Document, newDocument: Document, sortOrder: YamlSortOrderForOtherKeys): boolean {
    const firstOthersIndex = tokens.indexOf(OTHERS_TOKEN);

    if (firstOthersIndex === -1) {
      return false;
    }

    const initialKeys: YamlNode[] = (yamlObject.contents as YamlNode).items as YamlNode[];
    const srcTokens = (yamlObject.contents.srcToken as FlowCollection).items;
    let othersInserted = false;

    const addNodeAtIndex = (index: number) => {
      const node = initialKeys[index];
      newDocument.add(node);
      (newDocument.contents.srcToken as YamlCSTTokens).items.push(srcTokens[index]);
      initialKeys.splice(index, 1);
      srcTokens.splice(index, 1);
    };

    const addMatchingKey = (key: string) => {
      for (let i = 0; i < initialKeys.length; i++) {
        const node = initialKeys[i];
        if (node.key.value === key) {
          addNodeAtIndex(i);
          break;
        }
      }
    };

    const addRemainingKeys = () => {
      const explicitlyListedKeys = new Set(
          tokens.filter((token) => token !== OTHERS_TOKEN),
      );

      const remainingKeys = initialKeys
          .map((node) => node.key.value)
          .filter((key) => !explicitlyListedKeys.has(key));

      const sortedRemainingKeys = this.sortRemainingKeys(remainingKeys, sortOrder);

      for (const key of sortedRemainingKeys) {
        addMatchingKey(key);
      }
    };

    for (const token of tokens) {
      if (token === OTHERS_TOKEN) {
        if (!othersInserted) {
          addRemainingKeys();
          othersInserted = true;
        }
      } else {
        addMatchingKey(token);
      }
    }

    return true;
  }
  sortRemainingKeys(keys: string[], sortOrder: YamlSortOrderForOtherKeys): string[] {
    if (sortOrder === 'Ascending Alphabetical') {
      return [...keys].sort(this.sortAlphabeticallyAsc);
    }

    if (sortOrder === 'Descending Alphabetical') {
      return [...keys].sort(this.sortAlphabeticallyDesc);
    }

    return [...keys];
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
          Any blank line is attached to the line that follows it
        `,
        after: dedent`
          ---
          tags: computer
          ${''}
          status: WIP
          keywords: []
          date: 02/15/2022
          type: programming
          language: Typescript
          ---
          Any blank line is attached to the line that follows it
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
      new ExampleBuilder({
        description: 'Sorts YAML keys with `<others>` inserted between priority groups',
        before: dedent`
          ---
          tags: computer
          keywords: []
          status: WIP
          type: programming
          date: 02/15/2022
          language: Typescript
          ---
        `,
        after: dedent`
          ---
          date: 02/15/2022
          type: programming
          keywords: []
          language: Typescript
          status: WIP
          tags: computer
          ---
        `,
        options: {
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            '<others>',
            'status',
            'tags',
          ],
          yamlSortOrderForOtherKeys: 'Ascending Alphabetical',
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
