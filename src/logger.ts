import log from 'loglevel';

const logPrefix: string = '[Obsidian Linter]';

/**
 * Allows for the logging of errors
 * @param {string} labelForError The label for the error
 * @param {Error} error The error that is to be logged to the console
 */
export function logError(labelForError: string, error: Error) {
  let message = `${logPrefix} ${labelForError}:` + '\n';
  if (error.stack) {
    message += error.stack;
  } else {
    message += `${error.name} ${error.message}`;
  }

  log.error(message);
}

/**
 * Allows for the logging of a message as info in the console
 * @param {string} message The message to log to the console
 */
export function logInfo(message: string) {
  log.info(`${logPrefix} ${message}`);
}

/**
 * Allows for the logging of a message as a trace in the console
 * @param {string} message The message to log to the console
 */
export function logTrace(message: string) {
  log.trace(`${logPrefix} ${message}`);
}

/**
 * Allows for the logging of a message as debug info in the console
 * @param {string} message The message to log to the console
 */
export function logDebug(message: string) {
  log.debug(`${logPrefix} ${message}`);
}

/**
 * Allows for the logging of a message as a warning in the console
 * @param {string} message The message to log to the console
 */
export function logWarn(message: string) {
  log.warn(`${logPrefix} ${message}`);
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
