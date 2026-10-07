/** Makes sure that files are linted and that they are handled appropriately in an asynchronous manner.
 * based on https://github.com/blacksmithgu/obsidian-dataview/blob/75b564bcfd23876f12fa3faf7f86184cdfcd91f1/src/data-import/web-worker/import-manager.ts
*/

import Worker from './rules-runner.worker';
import { TFile, Vault, moment } from 'obsidian';
import { createRunLinterRulesOptions } from './rules-runner';
import { LinterSettings } from '../settings-data';
import { LinterWorker, RunLinterRulesOptions } from '../typings/worker';
import YamlTimestamp from '../rules/yaml-timestamp';
import YamlKeySort from '../rules/yaml-key-sort';
import { setLogs } from '../utils/logger';
import { stripCr } from '../utils/strings';
import AddBlankLineAfterYAML from '../rules/add-blank-line-after-yaml';
import { handleLintError } from '../utils/error';
import { LinterError } from '../linter-error';


type LintQueueEntry = { file: TFile, errorNoticeTimeout: number, errorTemplateString: string, useLogTemplateInNotice: boolean };

/** Callback when a file is resolved. */
type FileCallback = (runOptions: RunLinterRulesOptions) => Promise<void>;

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
  defaultMisspellings: Map<string, string>;

  public constructor(public numWorkers: number, public momentLocale: string, private settings: LinterSettings, private vault: Vault) {
    this.workers = [];
    this.busy = [];

    this.lintQueue = [];
    this.callbacks = new Map();

    for (let index = 0; index < numWorkers; index++) {
      const worker = Worker();

      worker.onmessage = async (resp: unknown) => {
        const data = resp.data as RunLinterRulesOptions;
        if (data.error) {
          const d = data.error;
          const err = new LinterError(d.message, null, d.stack);
          err.name = d.name;

          // Notify the queue this file is available for new work.
          this.busy[index] = false;

          if (this.callbacks.has(data.fileInfo.path)) {
            this.callbacks.delete(data.fileInfo.path);
          }

          handleLintError(data.fileInfo, err, data.errorNoticeTimeout, data.errorTemplateString, data.useLogTemplateInNotice);

          // Queue a new job onto this worker.
          const job = this.lintQueue.shift();
          if (job !== undefined) {
            this.send(job, index);
          }

          return;
        }

        await this.finish(data, index);
      };

      this.workers.push(worker);
      this.busy.push(false);
    }
  }

  public setDefaultMisspellings(defaultMisspellings: Map<string, string>): void {
    this.defaultMisspellings = defaultMisspellings;
  }

  public lintFile(entry: LintQueueEntry, callback: FileCallback): void {
    // if the file is already in the list of files to process, we should skip it
    if (this.callbacks.has(entry.file.path)) {
      return;
    } else {
      this.callbacks.set(entry.file.path, callback);
    }

    // Immediately run this task if there are available workers; otherwise, add it to the queue.
    const workerId = this.nextAvailableWorker();
    if (workerId !== undefined) {
      this.send(entry, workerId);
    } else {
      this.lintQueue.push(entry);
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

    let newText = data.newText;
    if (!data.skipFile) {
      // run lint actions related to moment and other areas that cannot be run in the worker
      let currentTime = moment();
      currentTime.locale(data.momentLocale);

      // run YAML timestamp at the end to help determine if something has changed
      let isYamlTimestampEnabled: boolean;
      [newText, isYamlTimestampEnabled] = YamlTimestamp.applyIfEnabled(data.newText, data.settings, data.disabledRules, {
        fileCreatedTime: data.fileInfo.createdAtFormatted,
        fileModifiedTime: data.fileInfo.modifiedAtFormatted,
        currentTime: currentTime,
        alreadyModified: data.oldText != data.newText,
        locale: data.momentLocale,
      });

      if (data.runAddBlankAfterYamlPostTimestamp) {
        [newText] = AddBlankLineAfterYAML.applyIfEnabled(newText, data.settings, data.disabledRules);
      }

      const yamlTimestampOptions = YamlTimestamp.getRuleOptions(data.settings);
      currentTime = moment();
      currentTime.locale(data.momentLocale);
      if (yamlTimestampOptions.convertToUTC) {
        currentTime = currentTime.utc();
      }
      [newText] = YamlKeySort.applyIfEnabled(newText, data.settings, data.disabledRules, {
        currentTimeFormatted: currentTime.format(yamlTimestampOptions.format.trimEnd()),
        yamlTimestampDateModifiedEnabled: isYamlTimestampEnabled && yamlTimestampOptions.dateModified,
        dateModifiedKey: yamlTimestampOptions.dateModifiedKey,
      });
    }


    const callback = this.callbacks.get(data.fileInfo.path);
    if (callback) {
      this.callbacks.delete(data.fileInfo.path);
      data.newText = newText;

      await callback(data);
    }
  }

  /** Send a new task to the given worker ID. */
  private send(entry: LintQueueEntry, workerId: number) {
    this.busy[workerId] = true;
    void this.vault.read(entry.file).then((oldText: string) => {
      const lintRunnerSettings = createRunLinterRulesOptions(stripCr(oldText), entry.file, this.momentLocale, this.settings, this.defaultMisspellings);
      lintRunnerSettings.errorTemplateString = entry.errorTemplateString;
      lintRunnerSettings.errorNoticeTimeout = entry.errorNoticeTimeout;
      lintRunnerSettings.useLogTemplateInNotice = entry.useLogTemplateInNotice;
      this.workers[workerId].postMessage(lintRunnerSettings);
    });
  }

  /** Find the next available, non-busy worker; return undefined if all workers are busy. */
  private nextAvailableWorker(): number | undefined {
    const index = this.busy.indexOf(false);
    return index == -1 ? undefined : index;
  }
}
