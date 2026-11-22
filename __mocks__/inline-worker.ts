import type {LinterWorker} from '../src/typings/worker';

// In the build, esbuild-plugin-inline-worker turns an `import Worker from './x.worker'` into a factory that starts a Web Worker.
// Jest has no such plugin, so it would run the worker's own code in the test environment, where its bare `onmessage = ...`
// assignment throws on Node 26. jest.config.ts maps every `.worker` import here, so tests get an inert worker instead.
export default function createWorker(): LinterWorker {
  return {
    onmessage: null,
    postMessage() {},
    terminate() {},
  };
}
