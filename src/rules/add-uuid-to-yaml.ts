import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {getYamlSectionValue, initYAML, setYamlSection} from '../utils/yaml';
import {yamlRegex} from '../utils/regex';

class AddUuidToYamlOptions implements Options {
  @RuleBuilder.noSettingControl()
    generateUuid?: () => string = () => crypto.randomUUID();

  uuidKey?: string = 'uuid';
}

@RuleBuilder.register
export default class AddUuidToYaml extends RuleBuilder<AddUuidToYamlOptions> {
  constructor() {
    super({
      nameKey: 'rules.add-uuid-to-yaml.name',
      descriptionKey: 'rules.add-uuid-to-yaml.description',
      type: RuleType.YAML,
    });
  }
  get OptionsClass(): new () => AddUuidToYamlOptions {
    return AddUuidToYamlOptions;
  }
  apply(text: string, options: AddUuidToYamlOptions): string {
    text = initYAML(text);

    const yaml = text.match(yamlRegex)[1];
    const value = getYamlSectionValue(yaml, options.uuidKey, false);
    if (value != null && value.trim() !== '') {
      return text;
    }

    const newYaml = setYamlSection(yaml, options.uuidKey, ` ${options.generateUuid()}`, false);

    return text.replace(`---\n${yaml}---`, () => `---\n${newYaml}---`);
  }
  get exampleBuilders(): ExampleBuilder<AddUuidToYamlOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Adds a UUID to the YAML frontmatter when the key is missing',
        before: dedent`
          ---
          title: My New Note
          date: 2024-05-20
          ---
        `,
        after: dedent`
          ---
          title: My New Note
          date: 2024-05-20
          uuid: 550e8400-e29b-41d4-a716-446655440000
          ---
        `,
        options: {
          generateUuid: () => '550e8400-e29b-41d4-a716-446655440000',
        },
      }),
      new ExampleBuilder({
        description: 'Leaves an existing UUID alone',
        before: dedent`
          ---
          title: My New Note
          uuid: 123e4567-e89b-42d3-a456-426614174000
          ---
        `,
        after: dedent`
          ---
          title: My New Note
          uuid: 123e4567-e89b-42d3-a456-426614174000
          ---
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<AddUuidToYamlOptions>[] {
    return [
      new TextOptionBuilder({
        OptionsClass: AddUuidToYamlOptions,
        nameKey: 'rules.add-uuid-to-yaml.uuid-key.name',
        descriptionKey: 'rules.add-uuid-to-yaml.uuid-key.description',
        optionsKey: 'uuidKey',
      }),
    ];
  }
}
