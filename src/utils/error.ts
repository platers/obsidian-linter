import { Notice, TFile } from "obsidian";
import { getTextInLanguage } from "../lang/helpers";
import { LinterError } from "../linter-error";
import { logError } from "./logger";
import { YAMLParseError } from "yaml";

export function handleLintError(file: TFile, error: Error, noticeTimeout: number, logErrorStringTemplate: string, useLogTemplateInNotice: boolean = true) {
  const errorMessage = logErrorStringTemplate.replace('{FILE_PATH}', file.path);
  const seeConsoleText = getTextInLanguage('logs.see-console');

  if (error instanceof LinterError) {
    if (useLogTemplateInNotice) {
      new Notice(`${errorMessage} ${error.message}.\n${seeConsoleText}`, noticeTimeout);
    } else {
      new Notice(`${error.message}.\n${seeConsoleText}`, noticeTimeout);
    }
  } else {
    new Notice(`${getTextInLanguage('logs.unknown-error')} ${seeConsoleText}`, noticeTimeout);
  }

  logError(errorMessage, error);
}

export function wrapLintError(error: Error, ruleName: string) {
  let errorMessage: string;
  if (error instanceof YAMLParseError) {
    errorMessage = error.toString();
    errorMessage = getTextInLanguage('logs.wrapper-yaml-error').replace('{ERROR_MESSAGE}', errorMessage.substring(errorMessage.indexOf(':') + 1));
  } else {
    errorMessage = getTextInLanguage('logs.wrapper-unknown-error').replace('{ERROR_MESSAGE}', error.message);
  }

  throw new LinterError(getTextInLanguage('logs.error-message-format').replace('{RULE_NAME}', ruleName).replace('{ERROR_MESSAGE}', errorMessage), error);
}

