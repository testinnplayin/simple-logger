import { writeFile } from "fs";

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
   * @param fileName - the temporary file name with 'my_file' as default
   * @returns a string in the format of 'my_file-YYYY-MM-DD'
   */
  buildFileName(dateTime: string, fileName: string | null): string {
    if (!fileName) {
      fileName = "my_file";
    }

    return `${fileName}-${dateTime}.json`;
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
