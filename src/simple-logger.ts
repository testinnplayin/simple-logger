/**
 * The main scripts for the simple logger
 *
 * @author R.Wood
 */
import { writeFile } from "fs";

import { buildDateTimeString, doReadDir } from "./utils";

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
   * Build a file name from a date time string and a temporary file name
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
   * Build a file path from the log directory path and the file name
   * @param logsDir - the absolute path to the logs directory
   * @param fileName - the name of the file
   * @returns an absolute path for the file path of the log file
   */
  buildFilePath(fileName: string): string {
    return `${this.options.logsDirPath}/${fileName}`;
  }

  /**
   * Build the message based on the MessageTemplate
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

  async triggerLogger(messageTemplate: MessageTemplate): Promise<void> {
    const now = new Date(Date.now());
    const dateTime = buildDateTimeString(now);
    const newFileName = await this.buildFileName(dateTime);
    const newFilePath = this.buildFilePath(newFileName);

    return await this.writeOutLog(newFilePath, messageTemplate);
  }

  /**
   * Main function for writing a message to a file
   * @param filePath - absolute path to where file will be written
   * @param messageTemplate - message written in file
   * @returns a Promise
   */
  writeOutLog(
    filePath: string,
    messageTemplate: MessageTemplate
  ): Promise<void> | undefined {
    console.log(messageTemplate.message);

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
   * Get a logger by its name - this is a temporary version of this function before things are handled in a tidy export file
   * @param loggerName - the name of the logger
   * @param options - the options for the logger
   */
  static getLogger(loggerName: string, options: Options): SimpleLogger {
    if (!options.level) {
      options.level = LogLevels.INFO;
    }
    const levelSelector = new LevelSelector(options.level);
    const newLogger = new SimpleLogger(loggerName, options, levelSelector);

    return newLogger;
  }
}
