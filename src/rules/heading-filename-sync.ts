import {Options, RuleType} from '../rules';
import RuleBuilder, {
  ExampleBuilder,
  OptionBuilderBase,
  TextOptionBuilder,
  DropdownOptionBuilder,
  BooleanOptionBuilder,
} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {escapeMarkdownSpecialCharacters, insert} from '../utils/strings';

type SyncDirectionValues = 'filename-to-heading' | 'heading-to-filename' | 'bidirectional';

class HeadingFilenameSyncOptions implements Options {
  @RuleBuilder.noSettingControl()
    fileName: string;

  @RuleBuilder.noSettingControl()
    filePath: string;

  syncDirection?: SyncDirectionValues = 'filename-to-heading';
  filenamePrefix?: string = '';
  filenameSuffix?: string = '';
  updateYamlTitle?: boolean = false;
}

@RuleBuilder.register
export default class HeadingFilenameSync extends RuleBuilder<HeadingFilenameSyncOptions> {
  constructor() {
    super({
      nameKey: 'rules.heading-filename-sync.name',
      descriptionKey: 'rules.heading-filename-sync.description',
      type: RuleType.HEADING,
      ruleIgnoreTypes: [IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],
      hasSpecialExecutionOrder: true,
    });
  }

  get OptionsClass(): new () => HeadingFilenameSyncOptions {
    return HeadingFilenameSyncOptions;
  }

  apply(text: string, options: HeadingFilenameSyncOptions): string {
    const semanticFilename = this.extractSemanticFilename(
        options.fileName,
        options.filenamePrefix,
        options.filenameSuffix,
    );

    const existingH1Match = text.match(/^#\s+(.*)$/m);

    if (options.syncDirection === 'filename-to-heading') {
      return this.syncFilenameToHeading(text, semanticFilename, existingH1Match);
    }

    return text;
  }

  private extractSemanticFilename(
      fileName: string,
      prefixPattern: string,
      suffixPattern: string,
  ): string {
    let result = fileName;

    if (prefixPattern) {
      try {
        const prefixRegex = new RegExp(prefixPattern);
        result = result.replace(prefixRegex, '');
      } catch (e) {
        // Invalid regex, skip prefix stripping
      }
    }

    if (suffixPattern) {
      try {
        const suffixRegex = new RegExp(suffixPattern + '$');
        result = result.replace(suffixRegex, '');
      } catch (e) {
        // Invalid regex, skip suffix stripping
      }
    }

    return result;
  }

  private syncFilenameToHeading(
      text: string,
      semanticFilename: string,
      existingH1Match: RegExpMatchArray | null,
  ): string {
    const escapedFilename = escapeMarkdownSpecialCharacters(semanticFilename);
    const newHeading = `# ${escapedFilename}`;

    if (existingH1Match) {
      return text.replace(/^#\s+.*$/m, newHeading);
    }

    let yamlEnd = text.indexOf('\n---');
    yamlEnd = yamlEnd === -1 || !text.startsWith('---\n') ? 0 : yamlEnd + 5;

    let header = `${newHeading}\n`;
    if (text.length < yamlEnd) {
      header = '\n' + header;
    }

    return insert(text, yamlEnd, header);
  }

  get exampleBuilders(): ExampleBuilder<HeadingFilenameSyncOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Updates existing H1 to match filename',
        before: dedent`
          # Old Title
          Some content here.
        `,
        after: dedent`
          # My Note
          Some content here.
        `,
        options: {
          fileName: 'My Note',
          syncDirection: 'filename-to-heading',
        },
      }),
      new ExampleBuilder({
        description: 'Inserts H1 when none exists',
        before: dedent`
          Some content without a heading.
        `,
        after: dedent`
          # My Note
          Some content without a heading.
        `,
        options: {
          fileName: 'My Note',
          syncDirection: 'filename-to-heading',
        },
      }),
      new ExampleBuilder({
        description: 'Strips Zettelkasten prefix from filename',
        before: dedent`
          # Old Title
          Content here.
        `,
        after: dedent`
          # Meeting Notes
          Content here.
        `,
        options: {
          fileName: '202312151030_Meeting Notes',
          filenamePrefix: '^\\d{12}_',
          syncDirection: 'filename-to-heading',
        },
      }),
      new ExampleBuilder({
        description: 'Inserts heading after YAML frontmatter',
        before: dedent`
          ---
          tags: [note]
          ---
          Content here.
        `,
        after: dedent`
          ---
          tags: [note]
          ---
          # My Note
          Content here.
        `,
        options: {
          fileName: 'My Note',
          syncDirection: 'filename-to-heading',
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<HeadingFilenameSyncOptions>[] {
    return [
      new DropdownOptionBuilder<HeadingFilenameSyncOptions, SyncDirectionValues>({
        OptionsClass: HeadingFilenameSyncOptions,
        nameKey: 'rules.heading-filename-sync.sync-direction.name',
        descriptionKey: 'rules.heading-filename-sync.sync-direction.description',
        optionsKey: 'syncDirection',
        records: [
          {
            value: 'filename-to-heading',
            description: 'Update the H1 heading to match the filename',
          },
          {
            value: 'heading-to-filename',
            description: 'Rename the file to match the H1 heading',
          },
          {
            value: 'bidirectional',
            description: 'Keep heading and filename in sync (heading wins on conflict)',
          },
        ],
      }),
      new TextOptionBuilder({
        OptionsClass: HeadingFilenameSyncOptions,
        nameKey: 'rules.heading-filename-sync.filename-prefix.name',
        descriptionKey: 'rules.heading-filename-sync.filename-prefix.description',
        optionsKey: 'filenamePrefix',
      }),
      new TextOptionBuilder({
        OptionsClass: HeadingFilenameSyncOptions,
        nameKey: 'rules.heading-filename-sync.filename-suffix.name',
        descriptionKey: 'rules.heading-filename-sync.filename-suffix.description',
        optionsKey: 'filenameSuffix',
      }),
      new BooleanOptionBuilder({
        OptionsClass: HeadingFilenameSyncOptions,
        nameKey: 'rules.heading-filename-sync.update-yaml-title.name',
        descriptionKey: 'rules.heading-filename-sync.update-yaml-title.description',
        optionsKey: 'updateYamlTitle',
      }),
    ];
  }
}
