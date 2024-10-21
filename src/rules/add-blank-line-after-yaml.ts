import {Options, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {yamlRegex} from '../utils/regex';

class AddBlankLineAfterYAMLOptions implements Options {
}

@RuleBuilder.register
export default class AddBlankLineAfterYAML extends RuleBuilder<AddBlankLineAfterYAMLOptions> {
  constructor() {
    super({
      nameKey: 'rules.add-blank-line-after-yaml.name',
      descriptionKey: 'rules.add-blank-line-after-yaml.description',
      type: RuleType.YAML,
      // needs to run before YAML timestamp if the YAML is present, but after it otherwise
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => AddBlankLineAfterYAMLOptions {
    return AddBlankLineAfterYAMLOptions;
  }
  apply(text: string, options: AddBlankLineAfterYAMLOptions): string {
    const yaml = text.match(yamlRegex);
    if (yaml === null) {
      return text;
    }

    const yamlText = yaml[0];

    const endOfYamlIndex = text.indexOf(yamlText) + yamlText.length;

    // there is nothing to add if the YAML ends the content in the file or the character after the YAML is a new line character
    if (endOfYamlIndex+1 >= text.length || text.trimEnd() === yamlText.trimEnd() || text.charAt(endOfYamlIndex+1) === '\n') {
      return text;
    }

    return text.replace(yamlText, yamlText + '\n');
  }
  get exampleBuilders(): ExampleBuilder<AddBlankLineAfterYAMLOptions>[] {
    return [
      new ExampleBuilder({
        description: 'A file with just YAML in it does not get a blank line after the YAML',
        before: dedent`
          ---
          key: value
          ---
        `,
        after: dedent`
          ---
          key: value
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'A file with YAML followed directly by content has an empty line added',
        before: dedent`
          ---
          key: value
          ---
          Here is some text
        `,
        after: dedent`
          ---
          key: value
          ---
          ${''}
          Here is some text
        `,
      }),
      new ExampleBuilder({
        description: 'A file with YAML that already has a blank line after it and before content has no empty line added',
        before: dedent`
          ---
          key: value
          ---
          ${''}
          Here is some text
        `,
        after: dedent`
          ---
          key: value
          ---
          ${''}
          Here is some text
        `,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<AddBlankLineAfterYAMLOptions>[] {
    return [];
  }
}
