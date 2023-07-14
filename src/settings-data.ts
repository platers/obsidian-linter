import {CommonStyles, Options} from './rules';
import {LintCommand} from './ui/linter-components/custom-command-option';
import {CustomReplace} from './ui/linter-components/custom-replace-option';
import {NormalArrayFormats} from './utils/yaml';
import log from 'loglevel';

export interface LinterSettings {
  ruleConfigs: {
    [ruleName: string]: Options;
  };
  lintOnSave: boolean;
  displayChanged: boolean;
  settingsConvertedToConfigKeyValues: boolean;
  recordLintOnSaveLogs: boolean;
  lintOnFileChange: boolean,
  displayLintOnFileChangeNotice: boolean,
  foldersToIgnore: string[];
  linterLocale: string;
  logLevel: number;
  lintCommands: LintCommand[];
  customRegexes: CustomReplace[];
  commonStyles: CommonStyles;
}

export const DEFAULT_SETTINGS: Partial<LinterSettings> = {
  ruleConfigs: {},
  lintOnSave: false,
  recordLintOnSaveLogs: false,
  displayChanged: true,
  lintOnFileChange: false,
  displayLintOnFileChangeNotice: false,
  settingsConvertedToConfigKeyValues: false,
  foldersToIgnore: [],
  linterLocale: 'system-default',
  logLevel: log.levels.ERROR,
  lintCommands: [],
  customRegexes: [],
  commonStyles: {
    aliasArrayStyle: NormalArrayFormats.SingleLine,
    tagArrayStyle: NormalArrayFormats.SingleLine,
    minimumNumberOfDollarSignsToBeAMathBlock: 2,
    escapeCharacter: '"',
    removeUnnecessaryEscapeCharsForMultiLineArrays: false,
  },
};
