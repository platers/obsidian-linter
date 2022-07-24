import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {formatYAML, initYAML, loadYAML} from '../utils/yaml';
import {escapeDollarSigns, yamlRegex} from '../utils/regex';

class InsertYamlAttributesOptions implements Options {
  textToInsert: string = 'aliases: \ntags: ';
}

@RuleBuilder.register
export default class InsertYamlAttributes extends RuleBuilder<InsertYamlAttributesOptions> {
  get OptionsClass(): new () => InsertYamlAttributesOptions {
    return InsertYamlAttributesOptions;
  }
  get name(): string {
    return 'Insert YAML attributes';
  }
  get description(): string {
    return 'Inserts the given YAML attributes into the YAML frontmatter. Put each attribute on a single line.';
  }
  get type(): RuleType {
    return RuleType.YAML;
  }
  apply(text: string, options: InsertYamlAttributesOptions): string {
    text = initYAML(text);
    return formatYAML(text, (text) => {
      const insert_lines = String(options.textToInsert)
          .split('\n')
          .reverse();
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
          textToInsert: 'aliases:\ntags: doc\nanimal: dog',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<InsertYamlAttributesOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: InsertYamlAttributesOptions,
        name: 'Text to insert',
        description: 'Text to insert into the YAML frontmatter',
        optionsKey: 'textToInsert',
      }),
    ];
  }
}
