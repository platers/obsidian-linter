import {TFile, moment} from 'obsidian';
import {logDebug} from './logger';
import {getDisabledRules, LinterSettings, rules, wrapLintError} from './rules';
import EscapeYamlSpecialCharacters from './rules/escape-yaml-special-characters';
import FormatTagsInYaml from './rules/format-tags-in-yaml';
import {RuleBuilderBase} from './rules/rule-builder';
import YamlKeySort from './rules/yaml-key-sort';
import YamlTimestamp from './rules/yaml-timestamp';
import {ObsidianCommandInterface} from './typings/obsidian-ex';

export type RunLinterRulesOptions = {
  oldText: string,
  fileInfo: FileInfo,
  settings: LinterSettings,
  momentLocale: string,
  commands: ObsidianCommandInterface,
  getCurrentTime: () => moment.Moment
}

type FileInfo = {
  name: string,
  createdAtFormatted: string,
  modifiedAtFormatted: string,
}

export class RulesRunner {
  private disabledRules: string[] = [];

  lintText(runOptions: RunLinterRulesOptions): string {
    const originalText = runOptions.oldText;
    this.disabledRules = getDisabledRules(originalText);

    let newText = this.runBeforeRegularRules(runOptions);

    for (const rule of rules) {
      // if you are run prior to or after the regular rules or are a disabled rule, skip running the rule
      if (this.disabledRules.includes(rule.alias())) {
        logDebug(rule.alias() + ' is disabled');
        continue;
      } else if (rule.hasSpecialExecutionOrder) {
        continue;
      }

      [newText] = RuleBuilderBase.applyIfEnabledBase(rule, newText, runOptions.settings, {
        fileCreatedTime: runOptions.fileInfo.createdAtFormatted,
        fileModifiedTime: runOptions.fileInfo.modifiedAtFormatted,
        fileName: runOptions.fileInfo.name,
        locale: runOptions.momentLocale,
      });
    }

    runOptions.oldText = newText;

    return this.runAfterRegularRules(originalText, runOptions);
  }

  private runBeforeRegularRules(runOptions: RunLinterRulesOptions): string {
    let newText = runOptions.oldText;
    // remove hashtags from tags before parsing yaml
    [newText] = FormatTagsInYaml.applyIfEnabled(newText, runOptions.settings, this.disabledRules);

    // escape YAML where possible before parsing yaml
    [newText] = EscapeYamlSpecialCharacters.applyIfEnabled(newText, runOptions.settings, this.disabledRules);

    return newText;
  }

  private runAfterRegularRules(originalText: string, runOptions: RunLinterRulesOptions): string {
    let newText = runOptions.oldText;

    // execute custom commands after regular rules, but before the timestamp rules
    logDebug(`Running Custom Lint Commands`);
    for (const commandInfo of runOptions.settings.lintCommands) {
      if (!commandInfo.id) {
        continue;
      }

      try {
        runOptions.commands.executeCommandById(commandInfo.id);
      } catch (error) {
        wrapLintError(error, `Custom Lint Command ${commandInfo.id}`);
      }
    }

    let currentTime = runOptions.getCurrentTime();
    // run yaml timestamp at the end to help determine if something has changed
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
    [newText] = YamlKeySort.applyIfEnabled(newText, runOptions.settings, this.disabledRules, {
      currentTimeFormatted: currentTime.format(yamlTimestampOptions.format),
      yamlTimestampDateModifiedEnabled: isYamlTimestampEnabled && yamlTimestampOptions.dateModified,
      dateModifiedKey: yamlTimestampOptions.dateModifiedKey,
    });

    return newText;
  }
}

export function createRunLinterRulesOptions(text: string, file: TFile, momentLocale: string, settings: LinterSettings, obsidianCommands: ObsidianCommandInterface): RunLinterRulesOptions {
  const createdAt = moment(file.stat.ctime);
  createdAt.locale(momentLocale);
  const modifiedAt = moment(file.stat.mtime);
  modifiedAt.locale(momentLocale);
  const modifiedAtTime = modifiedAt.format();
  const createdAtTime = createdAt.format();


  return {
    oldText: text,
    fileInfo: {
      name: file.basename,
      createdAtFormatted: createdAtTime,
      modifiedAtFormatted: modifiedAtTime,
    },
    settings: settings,
    momentLocale: momentLocale,
    commands: obsidianCommands,
    getCurrentTime: () => {
      const currentTime = moment();
      currentTime.locale(momentLocale);

      return currentTime;
    },
  };
}
