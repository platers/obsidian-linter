import {moment} from 'obsidian';
import YamlTimestamp from '../rules/yaml-timestamp';
import {RunLinterRulesOptions} from '../typings/worker';
import {getDisabledRules} from '../rules';

export function runYAMLTimestampByItself(runOptions: RunLinterRulesOptions): string {
  let newText = runOptions.oldText;

  const currentTime = moment();
  currentTime.locale(runOptions.momentLocale);

  const [disabledRules, skipFile] = getDisabledRules(runOptions.oldText);
  if (skipFile) {
    return newText;
  }

  [newText] = YamlTimestamp.applyIfEnabled(newText, runOptions.settings, disabledRules, {
    fileCreatedTime: runOptions.fileInfo.createdAtFormatted,
    fileModifiedTime: runOptions.fileInfo.modifiedAtFormatted,
    currentTime: currentTime,
    alreadyModified: true,
    locale: runOptions.momentLocale,
  });

  return newText;
}
