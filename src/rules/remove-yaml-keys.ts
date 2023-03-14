import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {yamlRegex} from '../utils/regex';
import {removeYamlSection} from '../utils/yaml';

class RemoveYamlKeysOptions implements Options {
  yamlKeysToRemove: string[] = [];
}

@RuleBuilder.register
export default class RemoveYamlKeys extends RuleBuilder<RemoveYamlKeysOptions> {
  constructor() {
    super({
      nameKey: 'rules.remove-yaml-keys.name',
      descriptionKey: 'rules.remove-yaml-keys.description',
      type: RuleType.YAML,
    });
  }
  get OptionsClass(): new () => RemoveYamlKeysOptions {
    return RemoveYamlKeysOptions;
  }
  apply(text: string, options: RemoveYamlKeysOptions): string {
    const yamlKeysToRemove: string[] = options.yamlKeysToRemove;
    const yaml = text.match(yamlRegex);
    if (!yaml || yamlKeysToRemove.length === 0) {
      return text;
    }

    let yamlText = yaml[1];
    for (const key of yamlKeysToRemove) {
      let actualKey = key.trim();
      if (actualKey.endsWith(':')) {
        actualKey = actualKey.substring(0, actualKey.length - 1);
      }

      yamlText = removeYamlSection(yamlText, actualKey);
    }
    return text.replace(yaml[1], yamlText);
  }
  get exampleBuilders(): ExampleBuilder<RemoveYamlKeysOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Removes the values specified in `YAML Keys to Remove` = "status:\nkeywords\ndate"',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords:
            - keyword1
            - keyword2
          status: WIP
          date: 02/15/2022
          ---
          ${''}
          # Header Context
          ${''}
          Text
        `,
        after: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          ---
          ${''}
          # Header Context
          ${''}
          Text
        `,
        options: {
          yamlKeysToRemove: [
            'status:',
            'keywords',
            'date',
          ],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<RemoveYamlKeysOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: RemoveYamlKeysOptions,
        nameKey: 'rules.remove-yaml-keys.yaml-keys-to-remove.name',
        descriptionKey: 'rules.remove-yaml-keys.yaml-keys-to-remove.description',
        optionsKey: 'yamlKeysToRemove',
      }),
    ];
  }
}
