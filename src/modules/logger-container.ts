/**
 * @module logger-container - Container for all the loggers
 *
 * @author R.Wood
 * Date: 22/12/2020
 * @requires SimpleLogger @see module:simple-logger
 */

import { SimpleLogger } from "./simple-logger";

/**
 * @class LoggerContainer - contains all the SimpleLoggers
 *
 * @property loggers - where the loggers are stored
 *
 * @method addLogger - add a SimpleLogger to the loggers list
 * @method getLogger - gets a SimpleLogger in loggers list by name
 */
export class LoggerContainer {
  loggers: SimpleLogger[] = [];

  /**
   * @method addLogger - add a SimpleLogger to the loggers list
   * @param logger - the SimpleLogger you want to add
   */
  addLogger(logger: SimpleLogger): void {
    this.loggers.push(logger);
  }

  /**
   * @method getLogger - get a SimpleLogger from the loggers list based on its name
   * @param loggerName - the name of the logger that should be fetched
   * @returns the logger to find
   */
  getLogger(loggerName: string): SimpleLogger {
    const logger = this.loggers.find((lgr) => lgr.loggerName === loggerName);

    if (!logger) {
      // TODO: improve this error
      throw new Error(`Cannot find logger of name ${loggerName}`);
    }

    return logger;
  }
}
