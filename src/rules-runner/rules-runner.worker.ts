// This worker here is designed expressly for the purpose of running lint rules as possible off of the main thread.

import { clearLogs, logsFromLastRun, setCollectLogs, setLogLevel } from '../utils/logger';
import { WorkerMessage } from '../typings/worker';
import { getDisabledRules } from '../rules';
import { lintText } from './rules-runner';
import '../rules-registry';
import { wrapLintError } from '../utils/error';
import { LinterError } from '../linter-error';

onmessage = (event: WorkerMessage) => {
  try {
    setLogLevel(event.data.settings.logLevel);
    setCollectLogs(event.data.settings.recordLintOnSaveLogs);
    clearLogs();

    const originalText = event.data.oldText;
    const [disabledRules, skipFile] = getDisabledRules(originalText);
    event.data.skipFile = skipFile;
    event.data.disabledRules = disabledRules;

    event.data.newText = event.data.oldText;
    if (!skipFile) {
      event.data.newText = lintText(event.data);
    }

    if (event.data.settings.recordLintOnSaveLogs) {
      event.data.logsFromRun = logsFromLastRun;
    }

    postMessage(event.data);
    clearLogs();
  } catch (error) {
    let newErr = error as LinterError;
    if (!(error instanceof LinterError)) {
      try {
        // TODO: may want to add unknown for the rule name
        wrapLintError(error instanceof Error ? error : new Error(String(error), ''));
      }
      catch (err) {
        newErr = err as LinterError;
      }
    }
    const err = newErr;
    postMessage({
      ...event.data,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

onerror = function () {
  // TODO: add a log for something went pretty wrong and the worker is not able to recover...
  return true;
}; 
