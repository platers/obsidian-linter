// This worker here is designed expressly for the purpose of running lint rules as possible off of the main thread.

import {clearLogs, logsFromLastRun, setCollectLogs, setLogLevel} from '../utils/logger';
import {WorkerMessage} from '../typings/worker';
import {getDisabledRules} from '../rules';
import {lintText} from './rules-runner';

onmessage = (event: WorkerMessage) => {
  setLogLevel(event.data.settings.logLevel);
  setCollectLogs(event.data.settings.recordLintOnSaveLogs);
  clearLogs();

  const originalText = event.data.oldText;
  const [disabledRules, skipFile] = getDisabledRules(originalText);
  event.data.skipFile = skipFile;
  event.data.disabledRules = disabledRules;

  if (!skipFile) {
    event.data.newText = lintText(event.data);
  }

  if (event.data.settings.recordLintOnSaveLogs) {
    event.data.logsFromRun = logsFromLastRun;
  }

  postMessage(event.data);
};
