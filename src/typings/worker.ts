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
}

export type WorkerArgs = {
  oldText: string,
  fileInfo: {
    name: string,
    createdAtFormatted: string,
    modifiedAtFormatted: string,
  },
  settings: LinterSettings,
}

export type WorkerMessage = {
  data: WorkerArgs;
}

export type WorkerResponse = {
  newText: string,
}

export type WorkerResponseMessage = {
  data: WorkerResponse
}

export interface LinterWorker {
  postMessage: (data: WorkerArgs) => void;
  onmessage: (data: WorkerResponseMessage) => void;
}
