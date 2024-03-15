// here is a worker to sent data back and forth

import {clearLogs, logsFromLastRun, setCollectLogs, setLogLevel} from '../utils/logger';
import {RulesRunner, WorkerMessage} from '../typings/worker';


let rulesRunner: RulesRunner = null;
import('./rules-runner').then((mod: any) => {
  rulesRunner = new mod.RulesRunner();
});

// import {RulesRunner} from './rules-runner';


self.document = {
  // @ts-ignore this is meant for preventing an error on run, but it is not really needed beyond that
  createElement: () => {},
};

onmessage = (event: WorkerMessage) => {
  const oldText = event.data.oldText;

  setLogLevel(event.data.settings.logLevel);
  setCollectLogs(event.data.settings.recordLintOnSaveLogs);
  clearLogs();

  event.data.newText = rulesRunner.lintText(event.data);
  event.data.oldText = oldText;

  if (event.data.settings.recordLintOnSaveLogs) {
    event.data.logsFromRun = logsFromLastRun;
  }

  postMessage(event.data);
};
