import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, initYAML, loadYAML} from '../utils/yaml';
import {escapeDollarSigns, yamlRegex} from '../utils/regex';

class InsertYamlAttributesOptions implements Options {
  textToInsert: string[] = [
    'aliases: ',
    'tags: ',
  ];
}

@RuleBuilder.register
export default class InsertYamlAttributes extends RuleBuilder<InsertYamlAttributesOptions> {
  constructor() {
    super({
      nameKey: 'rules.insert-yaml-attributes.name',
      descriptionKey: 'rules.insert-yaml-attributes.description',
      type: RuleType.YAML,
    });
  }
  get OptionsClass(): new () => InsertYamlAttributesOptions {
    return InsertYamlAttributesOptions;
  }
  apply(text: string, options: InsertYamlAttributesOptions): string {
    text = initYAML(text);
    return formatYAML(text, (text) => {
      const insert_lines = options.textToInsert.reverse();
      const parsed_yaml = loadYAML(text.match(yamlRegex)[1]);

      for (const line of insert_lines) {
        const key = line.split(':')[0];
        if (!Object.prototype.hasOwnProperty.call(parsed_yaml, key)) {
          text = text.replace(/^---\n/, escapeDollarSigns(`---\n${line}\n`));
        }
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<InsertYamlAttributesOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Insert static lines into YAML frontmatter. Text to insert: `aliases:\ntags: doc\nanimal: dog`',
        before: dedent`
          ---
          animal: cat
          ---
        `,
        after: dedent`
          ---
          aliases:
          tags: doc
          animal: cat
          ---
        `,
        options: {
          textToInsert: [
            'aliases:',
            'tags: doc',
            'animal: dog',
          ],
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<InsertYamlAttributesOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: InsertYamlAttributesOptions,
        nameKey: 'rules.insert-yaml-attributes.text-to-insert.name',
        descriptionKey: 'rules.insert-yaml-attributes.text-to-insert.description',
        optionsKey: 'textToInsert',
      }),
    ];
  }
}
