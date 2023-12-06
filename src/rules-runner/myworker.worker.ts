// here is a worker to sent data back and forth

import {moment} from 'obsidian';

// export default () => {

// }

onmessage = (event) => {
  console.log(`${moment().format('MM/DD/YYYY')}Worker received message: ${event.data}`);
  postMessage('Hello from worker!');
};
