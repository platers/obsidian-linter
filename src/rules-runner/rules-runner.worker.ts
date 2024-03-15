// here is a worker to sent data back and forth

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
  console.log(event.data.oldText);
  event.data.newText = rulesRunner.lintText(event.data);
  postMessage(event.data);
};
