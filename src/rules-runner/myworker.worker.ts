// here is a worker to sent data back and forth

// export default () => {

// }

onmessage = (event) => {
  console.log(`Worker received message: ${event.data}`);
  postMessage('Hello from worker!');
};
