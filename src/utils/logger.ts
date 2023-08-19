import log from 'loglevel';
import {getTextInLanguage} from '../lang/helpers';

const logPrefix: string = '[Obsidian Linter]';
const timingInfo = new Map<string, number>();
let collectLogs = false;

export enum LogLevels {
  Info = 'INFO',
  Trace = 'TRACE',
  Debug = 'DEBUG',
  Silent ='SILENT',
  Warn = 'WARN',
  Error = 'ERROR',
}

export let logsFromLastRun: string[] = [];

/**
 * Allows for the logging of errors
 * @param {string} labelForError The label for the error
 * @param {Error} error The error that is to be logged to the console
 */
export function logError(labelForError: string, error: Error) {
  let message = `${logPrefix} ${labelForError}:` + '\n';
  message += `${error.name} ${error.message}`;
  if (error.stack) {
    message += '\n' + error.stack;
  }

  log.error(message);

  if (collectLogs) {
    addLogInfo(message.substring(message.indexOf(']')+2), log.levels.TRACE);
  }
}

/**
 * Allows for the logging of a message as info in the console
 * @param {string} message The message to log to the console
 */
export function logInfo(message: string) {
  log.info(`${logPrefix} ${message}`);

  if (collectLogs) {
    addLogInfo(message, log.levels.INFO);
  }
}

/**
 * Allows for the logging of a message as a trace in the console
 * @param {string} message The message to log to the console
 */
export function logTrace(message: string) {
  log.trace(`${logPrefix} ${message}`);

  if (collectLogs) {
    addLogInfo(message, log.levels.TRACE);
  }
}

/**
 * Allows for the logging of a message as debug info in the console
 * @param {string} message The message to log to the console
 */
export function logDebug(message: string) {
  log.debug(`${logPrefix} ${message}`);

  if (collectLogs) {
    addLogInfo(message, log.levels.DEBUG);
  }
}

/**
 * Allows for the logging of a message as a warning in the console
 * @param {string} message The message to log to the console
 */
export function logWarn(message: string) {
  log.warn(`${logPrefix} ${message}`);

  if (collectLogs) {
    addLogInfo(message, log.levels.WARN);
  }
}

export function timingBegin(timingKey: string) {
  if (log.getLevel() > log.levels.DEBUG) {
    return;
  }

  timingInfo.set(timingKey, performance.now());
}

/**
 * Logs the amount of time that has gone by since the original use of the timing key provided.
 * @param {string} timingKey - The timing key for the start time that should end.
 */
export function timingEnd(timingKey: string) {
  if (log.getLevel() > log.levels.DEBUG) {
    return;
  } else if (!timingInfo.has(timingKey)) {
    logWarn(getTextInLanguage('logs.timing-key-not-found').replace('{TIMING_KEY}', timingKey));
  }

  const totalTimeInMilliseconds = performance.now() - timingInfo.get(timingKey);
  logDebug(`${timingKey}: ${totalTimeInMilliseconds} ` + getTextInLanguage('logs.milliseconds-abbreviation'));
}

function addLogInfo(logInfo: string, logLevel: number) {
  if (log.getLevel() <= logLevel) {
    logsFromLastRun.push(logInfo);
  }
}

export function clearLogs() {
  logsFromLastRun = [];
}

export function setCollectLogs(enabled: boolean) {
  collectLogs = enabled;
}


/**
 * Allows the user to set the minimum logging level to display messages for
 * @param {string} logLevel The minimum log level to display in the console
 */
export function setLogLevel(logLevel: string) {
  switch (logLevel) {
    case LogLevels.Info: {
      log.setLevel('info');
      break;
    }
    case LogLevels.Trace: {
      log.setLevel('trace');
      break;
    }
    case LogLevels.Debug: {
      log.setLevel('debug');
      break;
    }
    case LogLevels.Silent: {
      log.setLevel('silent');
      break;
    }
    case LogLevels.Error: {
      log.setLevel('error');
      break;
    }
    case LogLevels.Warn: {
      log.setLevel('warn');
      break;
    }
  }
}

export function convertNumberToLogLevel(logLevel: number): string {
  switch (logLevel) {
    case log.levels.INFO: {
      return LogLevels.Info;
    }
    case log.levels.TRACE: {
      return LogLevels.Trace;
    }
    case log.levels.DEBUG: {
      return LogLevels.Debug;
    }
    case log.levels.SILENT: {
      return LogLevels.Silent;
    }
    case log.levels.ERROR: {
      return LogLevels.Error;
    }
    case log.levels.WARN: {
      return LogLevels.Warn;
    }
  }
}

