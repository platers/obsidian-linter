import {formatYAML} from '../utils/yaml';
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';

class CompactYamlOptions implements Options {
  innerNewLines: boolean = false;
}

@RuleBuilder.register
export default class CompactYaml extends RuleBuilder<CompactYamlOptions> {
  constructor() {
    super({
      nameKey: 'rules.compact-yaml.name',
      descriptionKey: 'rules.compact-yaml.description',
      type: RuleType.SPACING,
    });
  }
  get OptionsClass(): new () => CompactYamlOptions {
    return CompactYamlOptions;
  }
  apply(text: string, options: CompactYamlOptions): string {
    return formatYAML(text, (text) => {
      text = text.replace(/^---\n+/, '---\n');
      text = text.replace(/\n+---/, '\n---');
      if (options.innerNewLines) {
        text = text.replaceAll(/\n{2,}/g, '\n');
      }

      return text;
    });
  }
  get exampleBuilders(): ExampleBuilder<CompactYamlOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Remove blank lines at the start and end of the YAML',
        before: dedent`
          ---
          ${''}
          date: today
          ${''}
          title: unchanged without inner new lines turned on
          ${''}
          ---
        `,
        after: dedent`
          ---
          date: today
          ${''}
          title: unchanged without inner new lines turned on
          ---
        `,
      }),
      new ExampleBuilder({
        description: 'Remove blank lines anywhere in YAML with inner new lines set to true',
        before: dedent`
          ---
          ${''}
          date: today
          ${''}
          ${''}
          title: remove inner new lines
          ${''}
          ---
          ${''}
          # Header 1
          ${''}
          ${''}
          Body content here.
        `,
        after: dedent`
          ---
          date: today
          title: remove inner new lines
          ---
          ${''}
          # Header 1
          ${''}
          ${''}
          Body content here.
        `,
        options: {
          innerNewLines: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<CompactYamlOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: CompactYamlOptions,
        nameKey: 'rules.compact-yaml.inner-new-lines.name',
        descriptionKey: 'rules.compact-yaml.inner-new-lines.description',
        optionsKey: 'innerNewLines',
      }),
    ];
  }
}
