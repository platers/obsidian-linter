// This worker here is designed expressly for the purpose of running lint rules as possible off of the main thread.

import { clearLogs, logInfo, logsFromLastRun, setCollectLogs, setLogLevel } from '../utils/logger';
import { RunLinterRulesOptions, WorkerMessage } from '../typings/worker';
import { getDisabledRules } from '../rules';
import { lintText } from './rules-runner';
import '../rules-registry';
import { ensureIsLinteError } from '../utils/error';
import { getTextInLanguage } from '../lang/helpers';

let currentRunOptions: RunLinterRulesOptions | null = null;
let workerId: string | null = null;

onmessage = (event: WorkerMessage) => {
  try {
    currentRunOptions = event.data.data;
    workerId = event.data.id;
    const data = event.data.data;
    setLogLevel(data.settings.logLevel);
    setCollectLogs(data.settings.recordLintOnSaveLogs);
    clearLogs();

    const originalText = data.oldText;
    const [disabledRules, skipFile] = getDisabledRules(originalText);
    data.skipFile = skipFile;
    data.disabledRules = disabledRules;

    data.newText = data.oldText;
    if (!skipFile) {
      data.newText = lintText(data);
    } else {
      logInfo(getTextInLanguage('logs.file-skipped').replace('{FILE_NAME}', data.fileInfo.path));
    }

    if (data.settings.recordLintOnSaveLogs) {
      data.logsFromRun = logsFromLastRun;
    }

    postMessage(data);
    clearLogs();
  } catch (error) {
    const err = ensureIsLinteError(error, event.data.id);
    postMessage({
      ...event.data.data,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

onerror = function (message: string, _1, _2, _3, error: Error) {
  const identifier = workerId ?? getTextInLanguage('logs.worker-identifier').replace(' {NUM}', '');
  const err = ensureIsLinteError(error, identifier);
  postMessage({
    fileInfo: { path: '' }, // this should make it so that things don't error out on the main thread
    ...currentRunOptions,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
  });

  return true;
}; 
