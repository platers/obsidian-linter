import { LinterSettings } from "../settings-data";

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

export type WorkerMessage = {
  data: {
    id: string,
    data: RunLinterRulesOptions,
  }
}

export interface LinterWorker {
  postMessage(event: WorkerMessage): void;
  onmessage: ((event: WorkerMessage) => Promise<void>) | null;
  terminate(): void;
}

export type LinterWorkerInfo = {
  id: string,
  worker: LinterWorker,
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
  defaultMisspellings: Map<string, string>,
  runAddBlankAfterYamlPostTimestamp: boolean,
  errorTemplateString: string,
  useLogTemplateInNotice: boolean,
  errorNoticeTimeout: number,
  // errors should already be of the type LinterError when they get here
  error: {
    name: string,
    message: string,
    stack: string | undefined,
  } | undefined;
}

type FileInfo = {
  path: string,
  name: string,
  createdAtFormatted: string,
  modifiedAtFormatted: string,
}

declare module '*.worker' {
  const Worker: () => LinterWorker;
  export default Worker;
}
