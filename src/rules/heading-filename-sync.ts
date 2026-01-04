import {App} from 'obsidian';
import {Options, rulesDict, RuleType} from '../rules';
import RuleBuilder, {ExampleBuilder, OptionBuilderBase, TextOptionBuilder, TextAreaOptionBuilder, DropdownOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {IgnoreTypes} from '../utils/ignore-types';
import {escapeMarkdownSpecialCharacters, unescapeMarkdownSpecialCharacters, insert} from '../utils/strings';
import {PendingRename} from '../rules-runner';
import {BooleanOption} from '../option';
import {ConfirmRuleDisableModal} from '../ui/modals/confirm-rule-disable-modal';

type SyncDirectionValues = 'filename-to-heading' | 'heading-to-filename' | 'bidirectional';

class HeadingFilenameSyncOptions implements Options {
  @RuleBuilder.noSettingControl()
    fileName: string;

  @RuleBuilder.noSettingControl()
    filePath: string;

  @RuleBuilder.noSettingControl()
    setPendingRename: (rename: PendingRename) => void;

  syncDirection?: SyncDirectionValues = 'heading-to-filename';
  filenamePrefix?: string = '';
  filenameSuffix?: string = '';
  ignoreRenameFiles?: string[] = [];
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
      disableConflictingOptions(value: boolean, app: App): void {
        // Check for conflict with file-name-heading rule
        const fileNameHeadingOptions = rulesDict['file-name-heading'];
        if (!fileNameHeadingOptions) return;

        const fileNameHeadingEnableOption = fileNameHeadingOptions.options[0] as BooleanOption;
        if (value && fileNameHeadingEnableOption.getValue()) {
          new ConfirmRuleDisableModal(app, 'rules.heading-filename-sync.name', 'rules.file-name-heading.name', () => {
            fileNameHeadingEnableOption.setValue(false);
          },
          () => {
            (rulesDict['heading-filename-sync'].options[0] as BooleanOption).setValue(false);
          }).open();
        }
      },
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
    const existingH1Text = existingH1Match ? existingH1Match[1].trim() : null;
    // Unescape markdown characters to get the actual heading text for comparison
    const existingH1Unescaped = existingH1Text ? unescapeMarkdownSpecialCharacters(existingH1Text) : null;

    if (options.syncDirection === 'filename-to-heading') {
      return this.syncFilenameToHeading(text, semanticFilename, existingH1Match);
    } else if (options.syncDirection === 'heading-to-filename') {
      return this.syncHeadingToFilename(text, options, existingH1Unescaped, semanticFilename);
    } else if (options.syncDirection === 'bidirectional') {
      return this.syncBidirectional(text, options, existingH1Match, existingH1Unescaped, semanticFilename);
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

  private extractFilenamePrefix(
      fileName: string,
      prefixPattern: string,
  ): string {
    if (!prefixPattern) {
      return '';
    }

    try {
      const prefixRegex = new RegExp(prefixPattern);
      const match = fileName.match(prefixRegex);
      return match ? match[0] : '';
    } catch (e) {
      return '';
    }
  }

  private extractFilenameSuffix(
      fileName: string,
      suffixPattern: string,
  ): string {
    if (!suffixPattern) {
      return '';
    }

    try {
      const suffixRegex = new RegExp(suffixPattern + '$');
      const match = fileName.match(suffixRegex);
      return match ? match[0] : '';
    } catch (e) {
      return '';
    }
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

    let yaml_end = text.indexOf('\n---');
    yaml_end = yaml_end === -1 || !text.startsWith('---\n') ? 0 : yaml_end + 5;

    let header = `${newHeading}\n`;
    if (text.length < yaml_end) {
      header = '\n' + header;
    }

    return insert(text, yaml_end, header);
  }

  private syncHeadingToFilename(
      text: string,
      options: HeadingFilenameSyncOptions,
      existingH1Unescaped: string | null,
      semanticFilename: string,
  ): string {
    // If there's no H1, nothing to sync from
    if (!existingH1Unescaped) {
      return text;
    }

    // If the heading matches the semantic filename, no rename needed
    if (existingH1Unescaped === semanticFilename) {
      return text;
    }

    // Build the new filename with preserved prefix/suffix
    const prefix = this.extractFilenamePrefix(options.fileName, options.filenamePrefix);
    const suffix = this.extractFilenameSuffix(options.fileName, options.filenameSuffix);
    const sanitizedHeading = this.sanitizeFilename(existingH1Unescaped);
    const newBasename = `${prefix}${sanitizedHeading}${suffix}`;

    // Signal the rename if we have the callback and path, unless file is ignored
    if (options.setPendingRename && options.filePath) {
      // Check if this file should be ignored for rename
      if (this.shouldIgnoreFileForRename(options.filePath, options.ignoreRenameFiles)) {
        return text;
      }

      const lastSlashIndex = options.filePath.lastIndexOf('/');
      const directory = lastSlashIndex > 0 ? options.filePath.substring(0, lastSlashIndex) : '';
      // Obsidian uses forward slashes internally on all platforms
      const newPath = directory ? `${directory}/${newBasename}.md` : `${newBasename}.md`;

      if (newPath !== options.filePath) {
        options.setPendingRename({
          oldPath: options.filePath,
          newPath: newPath,
        });
      }
    }

    // Text content remains unchanged for heading-to-filename
    return text;
  }

  private syncBidirectional(
      text: string,
      options: HeadingFilenameSyncOptions,
      existingH1Match: RegExpMatchArray | null,
      existingH1Unescaped: string | null,
      semanticFilename: string,
  ): string {
    // If there's no H1, sync filename to heading (insert new heading)
    if (!existingH1Unescaped) {
      return this.syncFilenameToHeading(text, semanticFilename, existingH1Match);
    }

    // If H1 differs from filename, heading wins - rename file
    if (existingH1Unescaped !== semanticFilename) {
      return this.syncHeadingToFilename(text, options, existingH1Unescaped, semanticFilename);
    }

    // Already in sync, nothing to do
    return text;
  }

  private sanitizeFilename(heading: string): string {
    // Remove/replace characters that are invalid in filenames
    // Invalid chars: / \ : * ? " < > |
    return heading
        .replace(/[/\\:*?"<>|]/g, '-')
        .replace(/-+/g, '-') // Collapse consecutive dashes
        .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
        .replace(/\s+/g, ' ')
        .trim();
  }

  private shouldIgnoreFileForRename(
      filePath: string,
      ignorePatterns: string[],
  ): boolean {
    if (!ignorePatterns || ignorePatterns.length === 0) {
      return false;
    }

    for (const pattern of ignorePatterns) {
      if (!pattern || pattern.trim() === '') {
        continue;
      }

      try {
        const regex = new RegExp(pattern);
        if (regex.test(filePath)) {
          return true;
        }
      } catch (e) {
        // Invalid regex, skip this pattern
      }
    }

    return false;
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
            value: 'heading-to-filename',
            description: 'Rename the file to match the H1 heading',
          },
          {
            value: 'filename-to-heading',
            description: 'Update the H1 heading to match the filename',
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
      new TextAreaOptionBuilder({
        OptionsClass: HeadingFilenameSyncOptions,
        nameKey: 'rules.heading-filename-sync.ignore-rename-files.name',
        descriptionKey: 'rules.heading-filename-sync.ignore-rename-files.description',
        optionsKey: 'ignoreRenameFiles',
      }),
    ];
  }
}
