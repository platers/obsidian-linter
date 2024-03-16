import {moment} from 'obsidian';
import {logDebug, logWarn, timingBegin, timingEnd} from '../utils/logger';
import {rules, wrapLintError, RuleType} from '../rules';
import BlockquotifyOnPaste from '../rules/blockquotify-on-paste';
import EscapeYamlSpecialCharacters from '../rules/escape-yaml-special-characters';
import ForceYamlEscape from '../rules/force-yaml-escape';
import FormatTagsInYaml from '../rules/format-tags-in-yaml';
import PreventDoubleChecklistIndicatorOnPaste from '../rules/prevent-double-checklist-indicator-on-paste';
import PreventDoubleListItemIndicatorOnPaste from '../rules/prevent-double-list-item-indicator-on-paste';
import ProperEllipsisOnPaste from '../rules/proper-ellipsis-on-paste';
import RemoveHyphensOnPaste from '../rules/remove-hyphens-on-paste';
import RemoveLeadingOrTrailingWhitespaceOnPaste from '../rules/remove-leading-or-trailing-whitespace-on-paste';
import RemoveLeftoverFootnotesFromQuoteOnPaste from '../rules/remove-leftover-footnotes-from-quote-on-paste';
import RemoveMultipleBlankLinesOnPaste from '../rules/remove-multiple-blank-lines-on-paste';
import {RuleBuilderBase} from '../rules/rule-builder';
import {ObsidianCommandInterface} from '../typings/obsidian-ex';
import {CustomReplace} from '../ui/linter-components/custom-replace-option';
import {LintCommand} from '../ui/linter-components/custom-command-option';
import {convertStringVersionOfEscapeCharactersToEscapeCharacters} from '../utils/strings';
import {getTextInLanguage} from '../lang/helpers';
import CapitalizeHeadings from '../rules/capitalize-headings';
import BlockquoteStyle from '../rules/blockquote-style';
import {IgnoreTypes, ignoreListOfTypes} from '../utils/ignore-types';
import MoveMathBlockIndicatorsToOwnLine from '../rules/move-math-block-indicators-to-own-line';
import {LinterSettings} from '../settings-data';
import {RunLinterRulesOptions, TFile} from '../typings/worker';
import TrailingSpaces from '../rules/trailing-spaces';

/**
 * Lints the text provided in runOptions.
 * @param {RunLinterRulesOptions} runOptions the different options provided when linting text
 * @return {string} the text after all of the updates have been made.
 */
export function lintText(runOptions: RunLinterRulesOptions): string {
  timingBegin(getTextInLanguage('logs.rule-running'));

  const preRuleText = getTextInLanguage('logs.pre-rules');
  timingBegin(preRuleText);
  let newText = runBeforeRegularRules(runOptions);
  timingEnd(preRuleText);

  const disabledRuleText = getTextInLanguage('logs.disabled-text');
  for (const rule of rules) {
    // if you are run prior to or after the regular rules or are a disabled rule, skip running the rule
    if (runOptions.disabledRules.includes(rule.alias)) {
      logDebug(rule.alias + ' ' + disabledRuleText);
      continue;
    } else if (rule.hasSpecialExecutionOrder || rule.type === RuleType.PASTE) {
      continue;
    }

    [newText] = RuleBuilderBase.applyIfEnabledBase(rule, newText, runOptions.settings, {
      fileCreatedTime: runOptions.fileInfo.createdAtFormatted,
      fileModifiedTime: runOptions.fileInfo.modifiedAtFormatted,
      fileName: runOptions.fileInfo.name,
      minimumNumberOfDollarSignsToBeAMathBlock: runOptions.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock,
      aliasArrayStyle: runOptions.settings.commonStyles.aliasArrayStyle,
      tagArrayStyle: runOptions.settings.commonStyles.tagArrayStyle,
      defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
      removeUnnecessaryEscapeCharsForMultiLineArrays: runOptions.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays,
    });
  }

  const customRegexLogText = getTextInLanguage('logs.custom-regex');
  timingBegin(customRegexLogText);
  newText = runCustomRegexReplacement(runOptions.settings.customRegexes, newText);
  timingEnd(customRegexLogText);

  return runAfterRegularRules(newText, runOptions);
}

function runBeforeRegularRules(runOptions: RunLinterRulesOptions): string {
  let newText = runOptions.oldText;
  // remove hashtags from tags before parsing yaml
  [newText] = FormatTagsInYaml.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules);

  // escape YAML where possible before parsing yaml
  [newText] = EscapeYamlSpecialCharacters.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
  });

  [newText] = MoveMathBlockIndicatorsToOwnLine.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    minimumNumberOfDollarSignsToBeAMathBlock: runOptions.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock,
  });

  return newText;
}

function runAfterRegularRules(currentText: string, runOptions: RunLinterRulesOptions): string {
  let newText = currentText;
  const postRuleLogText = getTextInLanguage('logs.post-rules');
  timingBegin(postRuleLogText);
  [newText] = CapitalizeHeadings.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules);

  [newText] = BlockquoteStyle.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules);

  [newText] = ForceYamlEscape.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
  });

  [newText] = TrailingSpaces.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules);

  timingEnd(postRuleLogText);
  timingEnd(getTextInLanguage('logs.rule-running'));
  return newText;
}

function runCustomRegexReplacement(customRegexes: CustomReplace[], oldText: string): string {
  return ignoreListOfTypes([IgnoreTypes.customIgnore], oldText, (text: string) => {
    logDebug(getTextInLanguage('logs.running-custom-regex'));

    let newText = text;
    for (const eachRegex of customRegexes) {
      const findIsEmpty = eachRegex.find === undefined || eachRegex.find == '' || eachRegex.find === null;
      const replaceIsEmpty = eachRegex.replace === undefined || eachRegex.replace === null;
      if (findIsEmpty || replaceIsEmpty) {
        continue;
      }

      const regex = new RegExp(`${eachRegex.find}`, eachRegex.flags);
      // make sure that characters are not string escaped unescape in the replace value to make sure things like \n and \t are correctly inserted
      newText = newText.replace(regex, convertStringVersionOfEscapeCharactersToEscapeCharacters(eachRegex.replace));
    }

    return newText;
  });
}

export function runCustomCommands(lintCommands: LintCommand[], commands: ObsidianCommandInterface) {
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

export function runPasteLint(currentLine: string, selectedText: string, runOptions: RunLinterRulesOptions): string {
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

export function createRunLinterRulesOptions(text: string, file: TFile = null, momentLocale: string, settings: LinterSettings): RunLinterRulesOptions {
  const createdAt = file ? moment(file.stat.ctime): moment();
  createdAt.locale(momentLocale);
  const modifiedAt = file ? moment(file.stat.mtime): moment();
  modifiedAt.locale(momentLocale);
  const modifiedAtTime = modifiedAt.format();
  const createdAtTime = createdAt.format();

  return {
    oldText: text,
    newText: '',
    momentLocale: momentLocale,
    fileInfo: {
      path: file ? file.path: '',
      name: file ? file.basename: '',
      createdAtFormatted: createdAtTime,
      modifiedAtFormatted: modifiedAtTime,
    },
    settings: settings,
    skipFile: false,
    disabledRules: [],
    logsFromRun: [],
  };
}
