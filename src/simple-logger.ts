import { writeFile } from "fs";
import { doReadDir } from "./utils";

/**
 * @enum LogLevel - the log levels for determining what gets logged
 * contains INFO
 */
enum LogLevel {
  INFO = "INFO",
}

/**
 * @interface MessageTemplate - template for a SimpleLogger message
 */
interface MessageTemplate {
  /** timestamp in UTC ISODate format */
  timestamp?: string;
  /** log level, by default 'INFO' */
  level?: LogLevel;
  /** actual text message */
  message: string;
}

export default {
  /**
   * Build a file name from a date time string and a temporary file name
   * @param dateTime - a datetime string in YYYY-MM-DD format
   * @param dirPath - the directory path to the log files
   * @param tempFileName - the temporary file name with 'my_file' as default
   * @returns a string in the format of 'my_file-YYYY-MM-DD-i' where i is the incrementation
   */
  async buildFileName(
    dateTime: string,
    dirPath: string,
    tempFileName: string | null
  ): Promise<string> {
    let fileName = "my_file";

    if (tempFileName) {
      fileName = tempFileName;
    }

    fileName = `${fileName}-${dateTime}`;

    const files: string[] = await doReadDir(dirPath);
    const filesWSameName = files.filter((file) => file.includes(fileName));

    fileName = `${fileName}-${filesWSameName.length + 1}`;

    return `${fileName}.json`;
  },

  /**
   * Build a file path from the log directory path and the file name
   * @param logsDir - the absolute path to the logs directory
   * @param fileName - the name of the file
   * @returns an absolute path for the file path of the log file
   */
  buildFilePath(logsDir: string, fileName: string): string {
    return `${logsDir}/${fileName}`;
  },

  buildMessage(messageTemplate: MessageTemplate): MessageTemplate {
    const timestamp: Date = new Date(Date.now());

    messageTemplate.timestamp = timestamp.toISOString();
    messageTemplate.level = LogLevel.INFO;

    return messageTemplate;
  },

  /**
   * Build the message based on the MessageTemplate
   * @param messageTemplate - the message template as input by user
   * @returns the message template with timestamp and level
   */
  buildMessage(messageTemplate: MessageTemplate): MessageTemplate {
    const timestamp: Date = new Date(Date.now());

    messageTemplate.timestamp = timestamp.toISOString();
    messageTemplate.level = LogLevel.INFO;

    return messageTemplate;
  },

  /**
   * Main function for writing a message to a file
   * @param filePath - absolute path to where file will be written
   * @param messageTemplate - message written in file
   * @returns a Promise containing the message
   */
  triggerLogger(
    filePath: string,
    messageTemplate: MessageTemplate
  ): Promise<string> {
    console.log(messageTemplate.message);
    messageTemplate = this.buildMessage(messageTemplate);

    return new Promise((resolve, reject) => {
      writeFile(
        filePath,
        JSON.stringify(messageTemplate),
        () => (err: NodeJS.ErrnoException | null, data: string) => {
          if (err) reject(err);

          resolve(data);
        }
      );
    });
  },
};
