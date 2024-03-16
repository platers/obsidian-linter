import {LinterSettings} from 'src/settings-data';

export interface TFile {
  /**
     * @public
     */
  stat: {
    /**
     * Time of creation, represented as a unix timestamp, in milliseconds.
     * @public
     */
    ctime: number;
    /**
     * Time of last modification, represented as a unix timestamp, in milliseconds.
     * @public
     */
    mtime: number;
    /**
     * Size on disk, as bytes.
     * @public
     */
    size: number;
  };
  /**
   * @public
   */
  basename: string;
  /**
   * @public
   */
  extension: string;
  /**
   * @public
   */
  path: string;
}

export type WorkerArgs = {
  oldText: string,
  fileInfo: FileInfo,
  settings: LinterSettings,
  skipFile: boolean,
  disabledRules: string[],
}

export type WorkerMessage = {
  data: RunLinterRulesOptions,
}

export type WorkerResponse = {
  oldText: string,
  newText: string,
  fileInfo: FileInfo,
  settings: LinterSettings,
  skipFile: boolean,
  disabledRules: string[],
}

export type WorkerResponseMessage = {
  data: RunLinterRulesOptions,
}

export interface LinterWorker {
  postMessage: (data: WorkerArgs) => void;
  onmessage: (data: WorkerResponseMessage) => void;
  terminate: () => void;
}

export type RunLinterRulesOptions = {
  oldText: string,
  newText: string,
  momentLocale: string,
  fileInfo: FileInfo,
  settings: LinterSettings,
  skipFile: boolean,
  disabledRules: string[],
  logsFromRun: string[],
}

type FileInfo = {
  path: string,
  name: string,
  createdAtFormatted: string,
  modifiedAtFormatted: string,
}
