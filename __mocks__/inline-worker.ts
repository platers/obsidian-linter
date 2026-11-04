// Stands in for any `*.worker` module in jest unit tests.
//
// esbuild-plugin-inline-worker turns `import Worker from './x.worker'` into a factory that spins up a
// web worker, but jest loads the worker source itself, whose top-level `onmessage = ...` throws in
// Node. Importing a module that pulls the worker in (for example `src/main.ts`) then fails before any
// test runs, so the worker is replaced by a factory that only fails if a test actually calls it.
export default function createWorker(): never {
  throw new Error('Web workers are not available in jest unit tests');
}
