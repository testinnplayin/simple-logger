/**
 * @module simple-logger - The main scripts for the simple logger
 *
 * @author R.Wood
 * 17/12/2020
 *
 * @requires writeFile from Node.js file system cf. https://nodejs.org/dist/latest-v14.x/docs/api/fs.html
 * @requires buildDateTimeString @requires doReadDir @see module:utils
 * @requires LogColors @see module:log-colors
 * @requires LogLevels @see module:log-levels
 * @requires MessageTemplate @see module:message-template
 * @requires Options @see module:options
 * @requires LevelSelector @see module:log-selector
 */
import { writeFile } from "fs";

import { buildDateTimeString, doReadDir } from "./utils";

import { LogColors } from "./logging-resources/log-colors";
import { LogLevels } from "./enums/log-levels";
import { MessageTemplate } from "./interfaces/message-template";
import { Options } from "./interfaces/options";
import { LevelSelector } from "./logging-resources/level-selector";

/**
 * @class SimpleLogger
 *
 * Log events to a file
 *
 * @property loggerName - the name of the logger instance
 * @property options - the options a logger can have
 * @property levelSelector
 * @method debug
 * @method error
 * @method info
 * @method warning
 * @method buildFileName
 * @method buildFilePath
 * @method buildMessage
 * @method triggerLogger
 * @method writeOutLog
 * @static getLogger
 */
export class SimpleLogger {
  loggerName: string;
  options: Options;
  levelSelector: LevelSelector;

  constructor(
    loggerName: string,
    options: Options,
    levelSelector: LevelSelector
  ) {
    this.loggerName = loggerName;
    this.options = options;
    this.levelSelector = levelSelector;
  }

  /**
   * @method debug - Write debug level message to console and trigger logger
   * @param messageStr - the string the user enters for a message
   * @returns a Promise
   */
  async debug(messageStr: string): Promise<void> {
    this.options.hasColor
      ? console.debug(LogColors.DEBUG(messageStr))
      : console.debug(messageStr);

    await this.triggerLogger({
      message: messageStr,
      level: LogLevels.DEBUG,
    });
  }

  /**
   * @method error - Write error level message to console and trigger logger
   * @param messageStr  - the string the user enters for a message
   * @returns a Promise
   */
  async error(messageStr: string): Promise<void> {
    this.options.hasColor
      ? console.log(LogColors.ERROR(messageStr))
      : console.log(messageStr);

    await this.triggerLogger({
      message: messageStr,
      level: LogLevels.ERROR,
    });
  }

  /**
   * @method info - Write info level message to console and trigger logger
   * @param messageStr  - the string the user enters for a message
   * @returns a Promise
   */
  async info(messageStr: string): Promise<void> {
    this.options.hasColor
      ? console.info(LogColors.INFO(messageStr))
      : console.info(messageStr);

    await this.triggerLogger({
      message: messageStr,
      level: LogLevels.INFO,
    });
  }

  /**
   * @method warning - Write warning level message to console and trigger logger
   * @param messageStr  - the string the user enters for a message
   * @returns a Promise
   */
  async warning(messageStr: string): Promise<void> {
    this.options.hasColor
      ? console.warn(LogColors.WARNING(messageStr))
      : console.warn(messageStr);

    await this.triggerLogger({
      message: messageStr,
      level: LogLevels.WARNING,
    });
  }

  /**
   * @method buildFileName - Build a file name from a date time string and a temporary file name
   * @param dateTime - a datetime string in YYYY-MM-DD format
   * @param dirPath - the directory path to the log files
   * @param tempFileName - the temporary file name with 'my_file' as default
   * @returns a string in the format of 'my_file-YYYY-MM-DD-i' where i is the incrementation
   */
  async buildFileName(dateTime: string): Promise<string> {
    let fileName = "my_file";

    if (this.options.fileNameTemplate) {
      fileName = this.options.fileNameTemplate;
    }

    fileName = `${fileName}-${dateTime}`;

    const files: string[] = await doReadDir(this.options.logsDirPath);
    const filesWSameName = files.filter((file) => file.includes(fileName));

    fileName = `${fileName}-${filesWSameName.length + 1}`;

    return `${fileName}.json`;
  }

  /**
   * @method buildFilePath - Build a file path from the log directory path and the file name
   * @param logsDir - the absolute path to the logs directory
   * @param fileName - the name of the file
   * @returns an absolute path for the file path of the log file
   */
  buildFilePath(fileName: string): string {
    return `${this.options.logsDirPath}/${fileName}`;
  }

  /**
   * @method buildMessage - Build the message based on the MessageTemplate
   * @param messageTemplate - the message template as input by user
   * @returns the message template with timestamp and level
   */
  buildMessage(messageTemplate: MessageTemplate): MessageTemplate {
    const timestamp: Date = new Date(Date.now());

    if (!messageTemplate.level) {
      messageTemplate.level = LogLevels.INFO;
    }

    messageTemplate.timestamp = timestamp.toISOString();

    return messageTemplate;
  }

  /**
   * @method triggerLogger - Trigger building of template and writing to file
   * @param messageTemplate - a message template object containing level of message and the message text
   * @returns a Promise
   */
  async triggerLogger(messageTemplate: MessageTemplate): Promise<void> {
    const now = new Date(Date.now());
    const dateTime = buildDateTimeString(now);
    const newFileName = await this.buildFileName(dateTime);
    const newFilePath = this.buildFilePath(newFileName);

    return await this.writeOutLog(newFilePath, messageTemplate);
  }

  /**
   * @method writeOutLog - Main function for writing a message to a file
   * @param filePath - absolute path to where file will be written
   * @param messageTemplate - message written in file
   * @returns a Promise
   */
  writeOutLog(
    filePath: string,
    messageTemplate: MessageTemplate
  ): Promise<void> | undefined {
    const shouldWriteToFile = this.levelSelector.checkLevel(
      messageTemplate.level
    );
    if (shouldWriteToFile) {
      messageTemplate = this.buildMessage(messageTemplate);
      return new Promise((resolve, reject) => {
        writeFile(filePath, JSON.stringify(messageTemplate), (err): void => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  }

  /**
   * @static getLogger - Get a logger by its name - this is a temporary version of this function before things are handled in a tidy export file
   * @param loggerName - the name of the logger
   * @param options - the options for the logger
   */
  static getLogger(loggerName: string, options: Options): SimpleLogger {
    if (!options.level) {
      options.level = LogLevels.INFO;
    }

    if (!options.hasColor) {
      options.hasColor = false;
    }

    const levelSelector = new LevelSelector(options.level);
    const newLogger = new SimpleLogger(loggerName, options, levelSelector);

    return newLogger;
  }
}
