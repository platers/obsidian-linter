/** Makes sure that files are linted and that they are handled appropriately in an asynchronous manner. */

// @ts-ignore because this is a web worker and it does not play well with Typescript checking
import Worker from './rules-runner.worker';
import {TFile, Vault} from 'obsidian';
import {createRunLinterRulesOptions} from './rules-runner';
import {LinterSettings} from '../settings-data';
import {LinterWorker} from 'src/typings/worker';

/** Callback when a file is resolved. */
// type FileCallback = (p: any) => void;

/** Multi-threaded file linter which debounces rapid file requests automatically. */
export class FileLintManager {
  /* Background workers which do the actual file parsing. */
  workers: LinterWorker[];
  /** Tracks which workers are actively parsing a file, to make sure we properly delegate results. */
  busy: boolean[];

  /** List of files which have been queued for to be linted */
  lintQueue: TFile[];
  /** Fast-access set which holds the list of files queued to be linted; used for debouncing. */
  reloadSet: Set<string>;
  /** Paths -> promises for file reloads which have not yet been queued. */
  // callbacks: Map<string, [FileCallback, FileCallback][]>;

  public constructor(public numWorkers: number, public momentLocale: string, private settings: LinterSettings, private vault: Vault) {
    this.workers = [];
    this.busy = [];

    this.lintQueue = [];
    this.reloadSet = new Set();
    // this.callbacks = new Map();

    for (let index = 0; index < numWorkers; index++) {
      // eslint-disable-next-line new-cap
      const worker = Worker();
      worker.onmessage = (data: string) => {
        console.log(data);
        this.busy[index] = false;
      };
      // worker.postMessage('first message');
      this.workers.push(worker);
      // this.register(() => worker.terminate());
      this.busy.push(false);
    }
  }

  public lintFile(file: TFile): void {
    // const promise: Promise<string> = new Promise((resolve, reject) => {
    //   if (this.callbacks.has(file.path)) this.callbacks.get(file.path)?.push([resolve, reject]);
    //   else this.callbacks.set(file.path, [[resolve, reject]]);
    // });

    // Immediately run this task if there are available workers; otherwise, add it to the queue.
    const workerId = this.nextAvailableWorker();
    if (workerId !== undefined) {
      this.send(file, workerId);
    } else {
      this.lintQueue.push(file);
    }

    // return promise;
  }

  /**
     * Queue the given file for reloading. Multiple reload requests for the same file in a short time period will be de-bounced
     * and all be resolved by a single actual file reload.
     */
  // public reload<T>(file: TFile): Promise<T> {
  //   const promise: Promise<T> = new Promise((resolve, reject) => {
  //     if (this.callbacks.has(file.path)) this.callbacks.get(file.path)?.push([resolve, reject]);
  //     else this.callbacks.set(file.path, [[resolve, reject]]);
  //   });

  //   // De-bounce repeated requests for the same file.
  //   if (this.reloadSet.has(file.path)) return promise;
  //   this.reloadSet.add(file.path);

  //   // Immediately run this task if there are available workers; otherwise, add it to the queue.
  //   const workerId = this.nextAvailableWorker();
  //   if (workerId !== undefined) {
  //     this.send(file, workerId);
  //   } else {
  //     this.reloadQueue.push(file);
  //   }

  //   return promise;
  // }

  /** Finish the parsing of a file, potentially queueing a new file. */
  // private finish(path: string, data: any, index: number) {
  //   // Cache the callbacks before we do book-keeping.
  //   const calls = ([] as [FileCallback, FileCallback][]).concat(this.callbacks.get(path) ?? []);

  //   // Book-keeping to clear metadata & allow the file to be re-loaded again.
  //   this.reloadSet.delete(path);
  //   this.callbacks.delete(path);

  //   // Notify the queue this file is available for new work.
  //   this.busy[index] = false;

  //   // Queue a new job onto this worker.
  //   const job = this.reloadQueue.shift();
  //   if (job !== undefined) this.send(job, index);

  //   // Resolve promises to let users know this file has finished.
  //   if ('$error' in data) {
  //     for (const [_, reject] of calls) reject(data['$error']);
  //   } else {
  //     for (const [callback, _] of calls) callback(data);
  //   }
  // }

  // /** Send a new task to the given worker ID. */
  private send(file: TFile, workerId: number) {
    this.busy[workerId] = true;
    this.vault.cachedRead(file).then((oldText: string) => {
      const lintRunnerSettings = createRunLinterRulesOptions(oldText, file, this.momentLocale, this.settings);
      this.workers[workerId].postMessage(lintRunnerSettings);
    });
  }

  // /** Find the next available, non-busy worker; return undefined if all workers are busy. */
  private nextAvailableWorker(): number | undefined {
    const index = this.busy.indexOf(false);
    return index == -1 ? undefined : index;
  }
}
