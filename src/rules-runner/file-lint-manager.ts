/** Makes sure that files are linted and that they are handled appropriately in an asynchronous manner.
 * based on https://github.com/blacksmithgu/obsidian-dataview/blob/75b564bcfd23876f12fa3faf7f86184cdfcd91f1/src/data-import/web-worker/import-manager.ts
*/

// @ts-ignore because this is a web worker and it does not play well with Typescript checking
import Worker from './rules-runner.worker';
import {TFile, Vault, moment} from 'obsidian';
import {createRunLinterRulesOptions} from './rules-runner';
import {LinterSettings} from '../settings-data';
import {LinterWorker, RunLinterRulesOptions} from '../typings/worker';
import YamlTimestamp from '../rules/yaml-timestamp';
import YamlKeySort from '../rules/yaml-key-sort';
import {setLogs} from '../utils/logger';
import {stripCr} from '../utils/strings';

/** Callback when a file is resolved. */
type FileCallback = (runOptions: RunLinterRulesOptions) => void;

/** Multi-threaded file linter which debounces rapid file requests automatically. */
export class FileLintManager {
  /* Background workers which do the actual file linting. */
  workers: LinterWorker[];
  /** Tracks which workers are actively linting a file, to make sure we properly delegate results. */
  busy: boolean[];

  /** List of files which have been queued to be linted */
  lintQueue: TFile[];
  /** Paths -> callback function to run once file linting has finished running rules.
   * Note: this does not mean that the logic for running custom commands has run.
  */
  callbacks: Map<string, FileCallback>;

  public constructor(public numWorkers: number, public momentLocale: string, private settings: LinterSettings, private vault: Vault) {
    this.workers = [];
    this.busy = [];

    this.lintQueue = [];
    this.callbacks = new Map();

    for (let index = 0; index < numWorkers; index++) {
      // eslint-disable-next-line new-cap
      const worker = Worker();
      worker.onmessage = async (resp: any) => {
        await this.finish(resp.data as RunLinterRulesOptions, index);
      };

      this.workers.push(worker);
      this.busy.push(false);
    }
  }

  public lintFile(file: TFile, callback: FileCallback): void {
    // if the file is already in the list of files to process, we should skip it
    if (this.callbacks.has(file.path)) {
      return;
    } else {
      this.callbacks.set(file.path, callback);
    }

    // Immediately run this task if there are available workers; otherwise, add it to the queue.
    const workerId = this.nextAvailableWorker();
    if (workerId !== undefined) {
      this.send(file, workerId);
    } else {
      this.lintQueue.push(file);
    }
  }

  public terminateWorkers(): void {
    for (const worker of this.workers) {
      worker.terminate();
    }

    this.workers = [];
  }


  // Finish the parsing of a file, potentially queueing a new file.
  private async finish(data: RunLinterRulesOptions, index: number) {
    // Notify the queue this file is available for new work.
    this.busy[index] = false;

    // Queue a new job onto this worker.
    const job = this.lintQueue.shift();
    if (job !== undefined) {
      this.send(job, index);
    }

    if (data.settings.recordLintOnSaveLogs) {
      setLogs(data.logsFromRun);
    }

    // run lint actions related to moment and other areas that cannot be run in the worker
    let currentTime = moment();
    currentTime.locale(data.momentLocale);

    // run YAML timestamp at the end to help determine if something has changed
    let isYamlTimestampEnabled: boolean;
    let newText: string;
    [newText, isYamlTimestampEnabled] = YamlTimestamp.applyIfEnabled(data.newText, data.settings, data.disabledRules, {
      fileCreatedTime: data.fileInfo.createdAtFormatted,
      fileModifiedTime: data.fileInfo.modifiedAtFormatted,
      currentTime: currentTime,
      alreadyModified: data.oldText != newText,
      locale: data.momentLocale,
    });

    const yamlTimestampOptions = YamlTimestamp.getRuleOptions(data.settings);

    currentTime = moment();
    currentTime.locale(data.momentLocale);
    [newText] = YamlKeySort.applyIfEnabled(newText, data.settings, data.disabledRules, {
      currentTimeFormatted: currentTime.format(yamlTimestampOptions.format.trimEnd()),
      yamlTimestampDateModifiedEnabled: isYamlTimestampEnabled && yamlTimestampOptions.dateModified,
      dateModifiedKey: yamlTimestampOptions.dateModifiedKey,
    });

    if (this.callbacks.has(data.fileInfo.path)) {
      const callback = this.callbacks.get(data.fileInfo.path);
      this.callbacks.delete(data.fileInfo.path);
      data.newText = newText;
      await callback(data);

      // TODO: see about hashing the file contents here if possible, but custom commands may make this not viable
      // likely needs to be called at the end of run custom commands since that waits until the cache is ready after
      // the file is updated by the regular lint
    }
  }

  // /** Send a new task to the given worker ID. */
  private send(file: TFile, workerId: number) {
    this.busy[workerId] = true;
    this.vault.read(file).then((oldText: string) => {
      const lintRunnerSettings = createRunLinterRulesOptions(stripCr(oldText), file, this.momentLocale, this.settings);
      this.workers[workerId].postMessage(lintRunnerSettings);
    });
  }

  // /** Find the next available, non-busy worker; return undefined if all workers are busy. */
  private nextAvailableWorker(): number | undefined {
    const index = this.busy.indexOf(false);
    return index == -1 ? undefined : index;
  }
}
