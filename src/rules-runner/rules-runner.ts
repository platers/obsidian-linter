import { moment } from 'obsidian';
import { logDebug, logWarn, timingBegin, timingEnd } from '../utils/logger';
import { rules, RuleType, Rule, Options } from '../rules';
import { wrapLintError } from '../utils/error';
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
import { RuleBuilderBase } from '../rules/rule-builder';
import { ObsidianCommandInterface } from '../typings/obsidian-ex';
import { convertStringVersionOfEscapeCharactersToEscapeCharacters, replaceTextRanges, textReplacement } from '../utils/strings';
import { getTextInLanguage } from '../lang/helpers';
import CapitalizeHeadings from '../rules/capitalize-headings';
import BlockquoteStyle from '../rules/blockquote-style';
import { IgnoreTypes } from '../utils/ignore-types';
import MoveMathBlockIndicatorsToOwnLine from '../rules/move-math-block-indicators-to-own-line';
import { CustomAutoCorrectContent, CustomReplace, LintCommand, LinterSettings } from '../settings-data';
import { RunLinterRulesOptions, TFile } from '../typings/worker';
import TrailingSpaces from '../rules/trailing-spaces';
import AutoCorrectCommonMisspellings from '../rules/auto-correct-common-misspellings';
import YamlTitle from '../rules/yaml-title';
import YamlTitleAlias from '../rules/yaml-title-alias';
import ConsecutiveBlankLines from '../rules/consecutive-blank-lines';
import { yamlRegex } from '../utils/regex';
import AddBlankLineAfterYAML from '../rules/add-blank-line-after-yaml';
import { LintContext, replaceUnprotectedRegexMatches } from '../utils/protected-ranges';
import { addEditsIfTheyDoNotClash, getEditsBetween } from '../utils/text-edits';
import MoveInlineFieldsToYaml from '../rules/move-inline-fields-to-yaml';

const rulesThatMustSeeEarlierWork = [
  'move-footnotes-to-the-bottom',
  're-index-footnotes',
  'line-break-at-document-end',
  'file-name-heading',
  'header-increment',
];

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

  let hasCustomCorrections = false;
  for (const replacementFileInfo of (runOptions.settings.ruleConfigs['auto-correct-common-misspellings'] as { [k: string]: CustomAutoCorrectContent[] | null })['extra-auto-correct-files'] ?? [] as CustomAutoCorrectContent[]) {
    if (replacementFileInfo.filePath != '') {
      hasCustomCorrections = true;
      break;
    }
  }

  const disabledRuleText = getTextInLanguage('logs.disabled-text');
  const extraOptions = {
    fileCreatedTime: runOptions.fileInfo.createdAtFormatted,
    fileModifiedTime: runOptions.fileInfo.modifiedAtFormatted,
    fileName: runOptions.fileInfo.name,
    locale: runOptions.momentLocale,
    minimumNumberOfDollarSignsToBeAMathBlock: runOptions.settings.commonStyles.minimumNumberOfDollarSignsToBeAMathBlock,
    aliasArrayStyle: runOptions.settings.commonStyles.aliasArrayStyle,
    tagArrayStyle: runOptions.settings.commonStyles.tagArrayStyle,
    defaultArrayStyle: runOptions.settings.commonStyles.defaultArrayStyle,
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
    removeUnnecessaryEscapeCharsForMultiLineArrays: runOptions.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays,
  };

  // Rules used to be handed the text the rule before them produced. A run of rules is now given
  // the same text, what each of them changed is worked out by comparing their answer with what
  // they were given, and the changes are applied together, so they share one parse of it. A rule
  // whose changes land near another's, or one that has to see earlier work, ends the run and
  // starts the next one.
  const rulesToRun: Rule[] = [];
  for (const rule of rules) {
    // if you are run prior to or after the regular rules or are a disabled rule, skip running the rule
    if (runOptions.disabledRules.includes(rule.alias)) {
      logDebug(rule.alias + ' ' + disabledRuleText);
      continue;
    } else if (rule.hasSpecialExecutionOrder || rule.type === RuleType.PASTE) {
      continue;
    }

    if (rule.alias === 'auto-correct-common-misspellings' && hasCustomCorrections) {
      let skipRule = false;
      for (const replacementFileInfo of (runOptions.settings.ruleConfigs['auto-correct-common-misspellings'] as { [k: string]: CustomAutoCorrectContent[] | null })['extra-auto-correct-files'] ?? [] as CustomAutoCorrectContent[]) {
        if (replacementFileInfo.filePath == runOptions.fileInfo.path) {
          skipRule = true;
          break;
        }
      }

      if (skipRule) {
        logDebug(rule.alias + ' ' + disabledRuleText);
        continue;
      }
    }

    rulesToRun.push(rule);
  }

  newText = runRulesInBatches(rulesToRun, newText, runOptions.settings, extraOptions);


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

  [newText] = AutoCorrectCommonMisspellings.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    misspellingToCorrection: runOptions.defaultMisspellings,
  });

  // moves inline fields last so that the YAML rules that run after this, like YAML Key Sort, include the keys it adds
  [newText] = MoveInlineFieldsToYaml.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
    tagArrayStyle: runOptions.settings.commonStyles.tagArrayStyle,
    aliasArrayStyle: runOptions.settings.commonStyles.aliasArrayStyle,
    defaultArrayStyle: runOptions.settings.commonStyles.defaultArrayStyle,
    removeUnnecessaryEscapeCharsForMultiLineArrays: runOptions.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays,
  });

  return newText;
}

function runAfterRegularRules(currentText: string, runOptions: RunLinterRulesOptions): string {
  let newText = currentText;
  const postRuleLogText = getTextInLanguage('logs.post-rules');
  timingBegin(postRuleLogText);
  [newText] = CapitalizeHeadings.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules);

  [newText] = YamlTitle.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    fileName: runOptions.fileInfo.name,
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
  });

  [newText] = YamlTitleAlias.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules, {
    fileName: runOptions.fileInfo.name,
    aliasArrayStyle: runOptions.settings.commonStyles.aliasArrayStyle,
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
    removeUnnecessaryEscapeCharsForMultiLineArrays: runOptions.settings.commonStyles.removeUnnecessaryEscapeCharsForMultiLineArrays,
  });

  const cleanupRules = [BlockquoteStyle.getRule(), ForceYamlEscape.getRule(), TrailingSpaces.getRule(), ConsecutiveBlankLines.getRule()].filter((rule) => {
    if (runOptions.disabledRules.includes(rule.alias)) {
      logDebug(rule.alias + ' ' + getTextInLanguage('logs.disabled-text'));
      return false;
    }

    return true;
  });
  // These adjacent cleanup rules can share a snapshot, including the frontmatter-only escape
  // rule. Clashes still start a fresh batch; the title and timestamp barriers stay sequential.
  newText = runBatches(cleanupRules, newText, runOptions.settings, {
    defaultEscapeCharacter: runOptions.settings.commonStyles.escapeCharacter,
  }, () => false);

  const yaml = newText.match(yamlRegex);
  if (yaml != null) {
    [newText] = AddBlankLineAfterYAML.applyIfEnabled(newText, runOptions.settings, runOptions.disabledRules);
  }

  runOptions.runAddBlankAfterYamlPostTimestamp = yaml === null;

  timingEnd(postRuleLogText);
  timingEnd(getTextInLanguage('logs.rule-running'));
  return newText;
}

function runRulesInBatches(rulesToRun: Rule[], text: string, settings: LinterSettings, extraOptions: Options): string {
  return runBatches(rulesToRun, text, settings, extraOptions,
    (rule) => rule.type === RuleType.YAML || rulesThatMustSeeEarlierWork.includes(rule.alias));
}

function runBatches(rulesToRun: Rule[], text: string, settings: LinterSettings, extraOptions: Options, mustRunOnItsOwn: (rule: Rule) => boolean): string {
  let index = 0;
  while (index < rulesToRun.length) {
    const snapshot = text;
    // Every rule in a batch is given this exact text, so the parse of it and the regions of it
    // each rule has to leave alone are worked out once and shared by all of them. The context
    // describes this snapshot and nothing else, so it is dropped as soon as the batch's changes
    // are applied and the text moves on.
    const context = LintContext.for(snapshot);
    const batchedEdits: textReplacement[] = [];

    while (index < rulesToRun.length) {
      const rule = rulesToRun[index];

      // A disabled rule will not read the snapshot, so it does not need a batch boundary.
      const optionsFromSettings = rule.getOptions(settings) as Record<string, unknown>;
      if (!optionsFromSettings[rule.enabledOptionName()]) {
        index++;
        continue;
      }

      // Some rules cannot be told apart by looking only at what they changed. The yaml rules
      // build on each other, one inserting a key and another deciding how its value is written.
      // The rules that move content about, or that look at the document as a whole, decide what
      // to do from where everything already is, so whether they need to do anything depends on
      // what ran before them. Those are given the result of the rule before them.
      const runsOnItsOwn = mustRunOnItsOwn(rule);
      if (runsOnItsOwn && batchedEdits.length > 0) {
        break;
      }

      const [ruleOutput] = RuleBuilderBase.applyIfEnabledBase(rule, snapshot, settings, extraOptions, context);
      if (ruleOutput === snapshot) {
        index++;
        continue;
      }

      if (!addEditsIfTheyDoNotClash(batchedEdits, getEditsBetween(snapshot, ruleOutput), snapshot)) {
        break;
      }

      index++;

      if (runsOnItsOwn) {
        break;
      }
    }

    // a rule that clashed has not been counted as run, so it leads the next batch and gets to
    // see what the rules before it settled on
    text = replaceTextRanges(snapshot, batchedEdits);
  }

  return text;
}

function runCustomRegexReplacement(customRegexes: CustomReplace[], oldText: string): string {
  logDebug(getTextInLanguage('logs.running-custom-regex'));

  let newText = oldText;
  let initialText = oldText;
  for (const eachRegex of customRegexes) {
    const findIsEmpty = eachRegex.find === undefined || eachRegex.find == '' || eachRegex.find === null;
    const replaceIsEmpty = eachRegex.replace === undefined || eachRegex.replace === null;
    if (findIsEmpty || replaceIsEmpty || !eachRegex.enabled) {
      continue;
    }

    let debugMsg = eachRegex.label;
    if (debugMsg && debugMsg.trim() != '') {
      debugMsg += ':\n';
    }
    debugMsg += `/${eachRegex.find}/${eachRegex.flags}/${eachRegex.replace}/`;

    logDebug(debugMsg);
    const regex = new RegExp(`${eachRegex.find}`, eachRegex.flags);
    const protectedRanges = LintContext.for(newText).protectedRangesFor([IgnoreTypes.customIgnore]);
    // make sure that characters are not string escaped unescape in the replace value to make sure things like \n and \t are correctly inserted
    newText = replaceUnprotectedRegexMatches(newText, regex, convertStringVersionOfEscapeCharactersToEscapeCharacters(eachRegex.replace), protectedRanges);

    if (initialText != newText) {
      logDebug(newText);
    }

    initialText = newText;
  }

  return newText;
}

export function runCustomCommands(lintCommands: LintCommand[], commands: ObsidianCommandInterface) {
  logDebug(getTextInLanguage('logs.running-custom-lint-command'));
  const commandsRun = new Set<string>();
  for (const commandInfo of lintCommands) {
    if (!commandInfo.id || !commandInfo.enabled) {
      continue;
    } else if (commandsRun.has(commandInfo.id)) {
      logWarn(getTextInLanguage('logs.custom-lint-duplicate-warning').replace('{COMMAND_NAME}', commandInfo.name));
      continue;
    }

    try {
      commandsRun.add(commandInfo.id);
      commands.executeCommandById(commandInfo.id);
    } catch (error) {
      wrapLintError(error instanceof Error ? error : new Error(String(error)), `${getTextInLanguage('logs.custom-lint-error-message')} ${commandInfo.id}`);
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

  [newText] = PreventDoubleChecklistIndicatorOnPaste.applyIfEnabled(newText, runOptions.settings, [], { lineContent: currentLine, selectedText: selectedText });

  [newText] = PreventDoubleListItemIndicatorOnPaste.applyIfEnabled(newText, runOptions.settings, [], { lineContent: currentLine, selectedText: selectedText });

  [newText] = BlockquotifyOnPaste.applyIfEnabled(newText, runOptions.settings, [], { lineContent: currentLine });

  return newText;
}

export function createRunLinterRulesOptions(text: string, file: TFile = null, momentLocale: string, settings: LinterSettings, defaultMisspellings: Map<string, string>): RunLinterRulesOptions {
  const createdAt = file ? moment(file.stat.ctime) : moment();
  createdAt.locale(momentLocale);
  const modifiedAt = file ? moment(file.stat.mtime) : moment();
  modifiedAt.locale(momentLocale);
  const modifiedAtTime = modifiedAt.format();
  const createdAtTime = createdAt.format();

  return {
    oldText: text,
    newText: '',
    momentLocale: momentLocale,
    fileInfo: {
      path: file ? file.path : '',
      name: file ? file.basename : '',
      createdAtFormatted: createdAtTime,
      modifiedAtFormatted: modifiedAtTime,
    },
    settings: settings,
    skipFile: false,
    disabledRules: [],
    logsFromRun: [],
    defaultMisspellings: defaultMisspellings,
  };
}
