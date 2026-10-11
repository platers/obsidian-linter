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

/**
 * Makes sure that an error gets converted to a LinterError and rethrown.
 * @param error The error to include in the log
 * @param identifier The identifier for where the error came from (a rule, a specific worker, etc.)
 */
export function wrapLintError(error: Error, identifier: string) {
  let errorMessage: string;
  if (error instanceof YAMLParseError) {
    errorMessage = error.toString();
    errorMessage = getTextInLanguage('logs.wrapper-yaml-error').replace('{ERROR_MESSAGE}', errorMessage.substring(errorMessage.indexOf(':') + 1));
  } else {
    errorMessage = getTextInLanguage('logs.wrapper-unknown-error').replace('{ERROR_MESSAGE}', error.message);
  }

  throw new LinterError(getTextInLanguage('logs.error-message-format').replace('{RULE_NAME}', identifier).replace('{ERROR_MESSAGE}', errorMessage), error);
}

export function ensureIsLinteError(error, identifier: string): LinterError {
  let newErr = error as LinterError;
  if (!(error instanceof LinterError)) {
    try {
      wrapLintError(error instanceof Error ? error : new Error(String(error)), identifier);
    }
    catch (err) {
      newErr = err as LinterError
    }
  }

  return newErr;
}
