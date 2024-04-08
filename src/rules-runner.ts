import {TFile, moment} from 'obsidian';
import {logDebug, logWarn, timingBegin, timingEnd} from './utils/logger';
import {getDisabledRules, rules, wrapLintError, RuleType} from './rules';
import BlockquotifyOnPaste from './rules/blockquotify-on-paste';
import EscapeYamlSpecialCharacters from './rules/escape-yaml-special-characters';
import ForceYamlEscape from './rules/force-yaml-escape';
import FormatTagsInYaml from './rules/format-tags-in-yaml';
import PreventDoubleChecklistIndicatorOnPaste from './rules/prevent-double-checklist-indicator-on-paste';
import PreventDoubleListItemIndicatorOnPaste from './rules/prevent-double-list-item-indicator-on-paste';
import ProperEllipsisOnPaste from './rules/proper-ellipsis-on-paste';
import RemoveHyphensOnPaste from './rules/remove-hyphens-on-paste';
import RemoveLeadingOrTrailingWhitespaceOnPaste from './rules/remove-leading-or-trailing-whitespace-on-paste';
import RemoveLeftoverFootnotesFromQuoteOnPaste from './rules/remove-leftover-footnotes-from-quote-on-paste';
import RemoveMultipleBlankLinesOnPaste from './rules/remove-multiple-blank-lines-on-paste';
import {RuleBuilderBase} from './rules/rule-builder';
import YamlKeySort from './rules/yaml-key-sort';
import YamlTimestamp from './rules/yaml-timestamp';
import {ObsidianCommandInterface} from './typings/obsidian-ex';
import {CustomReplace} from './ui/linter-components/custom-replace-option';
import {LintCommand} from './ui/linter-components/custom-command-option';
import {convertStringVersionOfEscapeCharactersToEscapeCharacters} from './utils/strings';
import {getTextInLanguage} from './lang/helpers';
import CapitalizeHeadings from './rules/capitalize-headings';
import BlockquoteStyle from './rules/blockquote-style';
import {IgnoreTypes, ignoreListOfTypes} from './utils/ignore-types';
import MoveMathBlockIndicatorsToOwnLine from './rules/move-math-block-indicators-to-own-line';
import {LinterSettings} from './settings-data';
import TrailingSpaces from './rules/trailing-spaces';

export type RunLinterRulesOptions = {
  oldText: string,
  fileInfo: FileInfo,
  settings: LinterSettings,
  momentLocale: string,
  getCurrentTime: () => moment.Moment
}

type FileInfo = {
  name: string,
  createdAtFormatted: string,
  modifiedAtFormatted: string,
}

export class RulesRunner {
  private disabledRules: string[] = [];
  skipFile: boolean;

  lintText(runOptions: RunLinterRulesOptions): string {
    this.skipFile = false;
    const originalText = runOptions.oldText;
    [this.disabledRules, this.skipFile] = getDisabledRules(originalText);
    if (this.skipFile) {
      return originalText;
    }

    timingBegin(getTextInLanguage('logs.rule-running'));

    const preRuleText = getTextInLanguage('logs.pre-rules');
    timingBegin(preRuleText);
    let newText = this.runBeforeRegularRules(runOptions);
    timingEnd(preRuleText);

    const disabledRuleText = getTextInLanguage('logs.disabled-text');
    for (const rule of rules) {
      // if you are run prior to or after the regular rules or are a disabled rule, skip running the rule
      if (this.disabledRules.includes(rule.alias)) {
        logDebug(rule.alias + ' ' + disabledRuleText);
        continue;
      } else if (rule.hasSpecialExecutionOrder || rule.type === RuleType.PASTE) {
        continue;
      }

      [newText] = RuleBuilderBase.applyIfEnabledBase(rule, newText, runOptions.settings, {
        fileCreatedTime: runOptions.fileInfo.createdAtFormatted,
        fileModifiedTime: runOptions.fileInfo.modifiedAtFormatted,
        fileName: runOptions.fileInfo.name,
        locale: runOptions.momentLocale,
        minimumNumberOfDollarSignsToBeAMathBlock: runOptions.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock,
        aliasArrayStyle: runOptions.settings.commonStyles.aliasArrayStyle,
        tagArrayStyle: runOptions.settings.commonStyles.tagArrayStyle,
        defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
        removeUnnecessaryEscapeCharsForMultiLineArrays: runOptions.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays,
      });
    }

    const customRegexLogText = getTextInLanguage('logs.custom-regex');
    timingBegin(customRegexLogText);
    newText = this.runCustomRegexReplacement(runOptions.settings.customRegexes, newText);
    timingEnd(customRegexLogText);

    runOptions.oldText = newText;

    return this.runAfterRegularRules(originalText, runOptions);
  }

  private runBeforeRegularRules(runOptions: RunLinterRulesOptions): string {
    let newText = runOptions.oldText;
    // remove hashtags from tags before parsing yaml
    [newText] = FormatTagsInYaml.applyIfEnabled(newText, runOptions.settings, this.disabledRules);

    // escape YAML where possible before parsing yaml
    [newText] = EscapeYamlSpecialCharacters.applyIfEnabled(newText, runOptions.settings, this.disabledRules, {
      defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
    });

    [newText] = MoveMathBlockIndicatorsToOwnLine.applyIfEnabled(newText, runOptions.settings, this.disabledRules, {
      minimumNumberOfDollarSignsToBeAMathBlock: runOptions.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock,
    });

    return newText;
  }

  private runAfterRegularRules(originalText: string, runOptions: RunLinterRulesOptions): string {
    let newText = runOptions.oldText;
    const postRuleLogText = getTextInLanguage('logs.post-rules');
    timingBegin(postRuleLogText);
    [newText] = CapitalizeHeadings.applyIfEnabled(newText, runOptions.settings, this.disabledRules);

    [newText] = BlockquoteStyle.applyIfEnabled(newText, runOptions.settings, this.disabledRules);

    [newText] = ForceYamlEscape.applyIfEnabled(newText, runOptions.settings, this.disabledRules, {
      defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
    });

    [newText] = TrailingSpaces.applyIfEnabled(newText, runOptions.settings, this.disabledRules);

    let currentTime = runOptions.getCurrentTime();
    // run YAML timestamp at the end to help determine if something has changed
    let isYamlTimestampEnabled;
    [newText, isYamlTimestampEnabled] = YamlTimestamp.applyIfEnabled(newText, runOptions.settings, this.disabledRules, {
      fileCreatedTime: runOptions.fileInfo.createdAtFormatted,
      fileModifiedTime: runOptions.fileInfo.modifiedAtFormatted,
      currentTime: currentTime,
      alreadyModified: originalText != newText,
      locale: runOptions.momentLocale,
    });

    const yamlTimestampOptions = YamlTimestamp.getRuleOptions(runOptions.settings);

    currentTime = runOptions.getCurrentTime();
    if (yamlTimestampOptions.convertToUTC) {
      currentTime = currentTime.utc();
    }
    [newText] = YamlKeySort.applyIfEnabled(newText, runOptions.settings, this.disabledRules, {
      currentTimeFormatted: currentTime.format(yamlTimestampOptions.format.trimEnd()),
      yamlTimestampDateModifiedEnabled: isYamlTimestampEnabled && yamlTimestampOptions.dateModified,
      dateModifiedKey: yamlTimestampOptions.dateModifiedKey,
    });
    timingEnd(postRuleLogText);
    timingEnd(getTextInLanguage('logs.rule-running'));
    return newText;
  }

  runCustomCommands(lintCommands: LintCommand[], commands: ObsidianCommandInterface) {
    if (this.skipFile) {
      return;
    }

    logDebug(getTextInLanguage('logs.running-custom-lint-command'));
    const commandsRun = new Set<string>();
    for (const commandInfo of lintCommands) {
      if (!commandInfo.id) {
        continue;
      } else if (commandsRun.has(commandInfo.id)) {
        logWarn(getTextInLanguage('logs.custom-lint-duplicate-warning').replace('{COMMAND_NAME}', commandInfo.name));
        continue;
      }

      try {
        commandsRun.add(commandInfo.id);
        commands.executeCommandById(commandInfo.id);
      } catch (error) {
        wrapLintError(error, `${getTextInLanguage('logs.custom-lint-error-message')} ${commandInfo.id}`);
      }
    }
  }

  runCustomRegexReplacement(customRegexes: CustomReplace[], oldText: string): string {
    return ignoreListOfTypes([IgnoreTypes.customIgnore], oldText, (text: string) => {
      logDebug(getTextInLanguage('logs.running-custom-regex'));

      let newText = text;
      let initialText = text;
      for (const eachRegex of customRegexes) {
        const findIsEmpty = eachRegex.find === undefined || eachRegex.find == '' || eachRegex.find === null;
        const replaceIsEmpty = eachRegex.replace === undefined || eachRegex.replace === null;
        if (findIsEmpty || replaceIsEmpty) {
          continue;
        }

        let debugMsg = eachRegex.label;
        if (debugMsg && debugMsg.trim() != '') {
          debugMsg += ':\n';
        }
        debugMsg +=`/${eachRegex.find}/${eachRegex.flags}/${eachRegex.replace}/`;

        logDebug(debugMsg);
        const regex = new RegExp(`${eachRegex.find}`, eachRegex.flags);
        // make sure that characters are not string escaped unescape in the replace value to make sure things like \n and \t are correctly inserted
        newText = newText.replace(regex, convertStringVersionOfEscapeCharactersToEscapeCharacters(eachRegex.replace));

        if (initialText != newText) {
          logDebug(newText);
        }

        initialText = newText;
      }

      return newText;
    });
  }

  runPasteLint(currentLine: string, selectedText: string, runOptions: RunLinterRulesOptions): string {
    let newText = runOptions.oldText;

    [newText] = RemoveHyphensOnPaste.applyIfEnabled(newText, runOptions.settings, []);

    [newText] = RemoveMultipleBlankLinesOnPaste.applyIfEnabled(newText, runOptions.settings, []);

    [newText] = RemoveLeftoverFootnotesFromQuoteOnPaste.applyIfEnabled(newText, runOptions.settings, []);

    [newText] = ProperEllipsisOnPaste.applyIfEnabled(newText, runOptions.settings, []);

    [newText] = RemoveLeadingOrTrailingWhitespaceOnPaste.applyIfEnabled(newText, runOptions.settings, []);

    [newText] = PreventDoubleChecklistIndicatorOnPaste.applyIfEnabled(newText, runOptions.settings, [], {lineContent: currentLine, selectedText: selectedText});

    [newText] = PreventDoubleListItemIndicatorOnPaste.applyIfEnabled(newText, runOptions.settings, [], {lineContent: currentLine, selectedText: selectedText});

    [newText] = BlockquotifyOnPaste.applyIfEnabled(newText, runOptions.settings, [], {lineContent: currentLine});

    return newText;
  }
}

export function createRunLinterRulesOptions(text: string, file: TFile = null, momentLocale: string, settings: LinterSettings): RunLinterRulesOptions {
  const createdAt = file ? moment(file.stat.ctime): moment();
  createdAt.locale(momentLocale);
  const modifiedAt = file ? moment(file.stat.mtime): moment();
  modifiedAt.locale(momentLocale);
  const modifiedAtTime = modifiedAt.format();
  const createdAtTime = createdAt.format();

  return {
    oldText: text,
    fileInfo: {
      name: file ? file.basename: '',
      createdAtFormatted: createdAtTime,
      modifiedAtFormatted: modifiedAtTime,
    },
    settings: settings,
    momentLocale: momentLocale,
    getCurrentTime: () => {
      const currentTime = moment();
      currentTime.locale(momentLocale);

      return currentTime;
    },
  };
}
