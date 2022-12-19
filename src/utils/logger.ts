import log from 'loglevel';

const logPrefix: string = '[Obsidian Linter]';
const timingInfo = new Map<string, number>();
let collectLogs = false;

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
  if (log.getLevel() <= log.levels.DEBUG) {
    return;
  }

  timingInfo.set(timingKey, performance.now());
}

/**
 * Logs the amount of time that has gone by since the original use of the timing key provided.
 * @param {string} timingKey - The timing key for the start time that should end.
 */
export function timingEnd(timingKey: string) {
  if (log.getLevel() <= log.levels.DEBUG) {
    return;
  } else if (!timingInfo.has(timingKey)) {
    logWarn(`timing key '${timingKey}' does not exist in the timing info list, so it was ignored`);
  }

  const totalTimeInMilliseconds = performance.now() - timingInfo.get(timingKey);
  logDebug(`${timingKey}: ${totalTimeInMilliseconds} ms`);
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
 * @param {number} logLevel The minimum log level to display in the console
 */
export function setLogLevel(logLevel: number) {
  switch (logLevel) {
    case log.levels.INFO: {
      log.setLevel('info');
      break;
    }
    case log.levels.TRACE: {
      log.setLevel('trace');
      break;
    }
    case log.levels.DEBUG: {
      log.setLevel('debug');
      break;
    }
    case log.levels.SILENT: {
      log.setLevel('silent');
      break;
    }
    case log.levels.ERROR: {
      log.setLevel('error');
      break;
    }
    case log.levels.WARN: {
      log.setLevel('warn');
      break;
    }
  }
}
