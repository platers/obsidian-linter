import {Options, rulesDict, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {escapeMarkdownSpecialCharacters, insert} from '../utils/strings';
import {App} from 'obsidian';
import {BooleanOption} from '../option';
import {ConfirmRuleDisableModal} from '../ui/modals/confirm-rule-disable-modal';

class FileNameHeadingOptions implements Options {
  @RuleBuilder.noSettingControl()
    fileName: string;
}

@RuleBuilder.register
export default class FileNameHeading extends RuleBuilder<FileNameHeadingOptions> {
  constructor() {
    super({
      nameKey: 'rules.file-name-heading.name',
      descriptionKey: 'rules.file-name-heading.description',
      type: RuleType.HEADING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
      disableConflictingOptions(value: boolean, app: App): void {
        const headerIncrementOptions = rulesDict['header-increment'];
        const headerIncrementEnableOption = headerIncrementOptions.options[0] as BooleanOption;
        const headerIncrementStartAtH2Option = headerIncrementOptions.options[1] as BooleanOption;
        if (value && headerIncrementEnableOption.getValue()) {
          new ConfirmRuleDisableModal(app, 'rules.file-name-heading.name', 'rules.header-increment.start-at-h2.name', () => {
            headerIncrementStartAtH2Option.setValue(false);
          },
          () => {
            (rulesDict['file-name-heading'].options[0] as BooleanOption).setValue(false);
          }).open();
        }
      },
    });
  }
  get OptionsClass(): new () => FileNameHeadingOptions {
    return FileNameHeadingOptions;
  }
  apply(text: string, options: FileNameHeadingOptions): string {
    // check if there is a H1 heading
    const hasH1 = text.match(/^#\s.*/m);
    if (hasH1) {
      return text;
    }

    const fileName = options.fileName;
    // insert H1 heading after front matter
    let yaml_end = text.indexOf('\n---');
    yaml_end =
        yaml_end == -1 || !text.startsWith('---\n') ? 0 : yaml_end + 5;

    let header = `# ${escapeMarkdownSpecialCharacters(fileName)}\n`;
    if (text.length < yaml_end) {
      header = '\n' + header;
    }

    return insert(text, yaml_end, header);
  }
  get exampleBuilders(): ExampleBuilder<FileNameHeadingOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Inserts an H1 heading',
        before: dedent`
          This is a line of text
        `,
        after: dedent`
          # File Name
          This is a line of text
        `,
        options: {
          fileName: 'File Name',
        },
      }),
      new ExampleBuilder({
        description: 'Inserts heading after YAML front matter',
        before: dedent`
          ---
          title: My Title
          ---
          This is a line of text
        `,
        after: dedent`
          ---
          title: My Title
          ---
          # File Name
          This is a line of text
        `,
        options: {
          fileName: 'File Name',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<FileNameHeadingOptions>[] {
    return [];
  }
}
