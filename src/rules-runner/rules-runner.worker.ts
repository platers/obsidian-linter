// here is a worker to sent data back and forth

import {WorkerMessage as WorkerStartMessage} from '../typings/worker';

onmessage = (event: WorkerStartMessage) => {
  console.log(`Worker received message: ${event.data.oldText}`);
  postMessage('Hello from worker!');
};
