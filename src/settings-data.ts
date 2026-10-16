import { Options } from './rules';
import { NestedKeyOf } from './utils/nested-keyof';
import { ArrayFormats, QuoteCharacter } from './utils/yaml';

// CommonStyles are settings that are used in multiple places and thus need to be external to rules themselves to help facilitate their use
export type CommonStyles = {
  aliasArrayStyle: ArrayFormats;
  tagArrayStyle: ArrayFormats;
  defaultArrayStyle: ArrayFormats;
  minimumNumberOfDollarSignsToBeAMathBlock: number;
  escapeCharacter: QuoteCharacter;
  removeUnnecessaryEscapeCharsForMultiLineArrays: boolean;
}

export enum AfterFileChangeLintTimes {
  Never = 'never',
  After5Seconds = 'after 5 seconds',
  After10Seconds = 'after 10 seconds',
  After15Seconds = 'after 15 seconds',
  After30Seconds = 'after 30 seconds',
  After1Minute = 'after 1 minute',
}

export type CustomAutoCorrectContent = { filePath: string; customReplacements: Map<string, string>; };
export type LintCommand = { id: string; name: string; enabled: boolean; };
export type CustomReplace = { label: string; find: string; replace: string; flags: string; enabled: boolean; };
export type FileToIgnore = { label: string; match: string; flags: string; };

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
  displayChanged: boolean;
  suppressMessageWhenNoChange?: boolean;
  enableDiffPreviewView: boolean;
  suppressLintAllFilesConfirmationModal?: boolean;
  suppressLintAllFilesInFolderConfirmationModal?: boolean;
  settingsConvertedToConfigKeyValues: boolean;
  textAreaSettingsConvertedToListItemSettings: boolean;
  defaultArrayStyleMovedToCommonStyles: boolean;
  recordLintOnSaveLogs: boolean;
  lintOnFileChange: boolean;
  displayLintOnFileChangeNotice: boolean;
  additionalFileExtensions: string[];
  foldersToIgnore: string[];
  filesToIgnore: FileToIgnore[];
  linterLocale: string;
  logLevel: string;
  lintCommands: LintCommand[];
  customRegexes: CustomReplace[];
  commonStyles: CommonStyles;
}

export type LinterSettingsKeys = NestedKeyOf<LinterSettings>

export const DEFAULT_SETTINGS: Partial<LinterSettings> = {
  ruleConfigs: {},
  lintOnSave: false,
  recordLintOnSaveLogs: false,
  displayChanged: true,
  suppressMessageWhenNoChange: false,
  enableDiffPreviewView: true,
  suppressLintAllFilesConfirmationModal: false,
  suppressLintAllFilesInFolderConfirmationModal: false,
  lintOnFileChange: false,
  displayLintOnFileChangeNotice: false,
  settingsConvertedToConfigKeyValues: false,
  textAreaSettingsConvertedToListItemSettings: false,
  defaultArrayStyleMovedToCommonStyles: false,
  additionalFileExtensions: [],
  foldersToIgnore: [],
  filesToIgnore: [],
  linterLocale: 'system-default',
  logLevel: 'ERROR',
  lintCommands: [],
  customRegexes: [],
  commonStyles: {
    aliasArrayStyle: ArrayFormats.SingleLine,
    tagArrayStyle: ArrayFormats.SingleLine,
    defaultArrayStyle: ArrayFormats.SingleLine,
    minimumNumberOfDollarSignsToBeAMathBlock: 2,
    escapeCharacter: '"',
    removeUnnecessaryEscapeCharsForMultiLineArrays: false,
  },
};

/**
 * Moves the default array style from the Format YAML array rule to the common styles, since it is now used by more than one rule.
 * @param {LinterSettings} settings The settings to update
 * @return {boolean} Whether a change was made to the settings
 */
export function moveDefaultArrayStyleToCommonStyles(settings: LinterSettings): boolean {
  let updateMade = false;
  const formatYamlArraySettings = settings.ruleConfigs['format-yaml-array'] as { [key: string]: unknown } | undefined;
  if (formatYamlArraySettings != undefined && Object.hasOwn(formatYamlArraySettings, 'default-array-style')) {
    const value = formatYamlArraySettings['default-array-style'] as ArrayFormats;
    if (Object.values(ArrayFormats).includes(value)) {
      settings.commonStyles.defaultArrayStyle = value;
    }

    delete formatYamlArraySettings['default-array-style'];
    updateMade = true;
  }

  if (!Object.values(ArrayFormats).includes(settings.commonStyles.defaultArrayStyle)) {
    settings.commonStyles.defaultArrayStyle = ArrayFormats.SingleLine;
    updateMade = true;
  }

  return updateMade;
}
