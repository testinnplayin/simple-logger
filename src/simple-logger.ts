import { writeFile } from "fs";

interface MessageTemplate {
  message: string;
}

export default {
  /**
   * Build a file name from a date time string and a temporary file name
   * @param {string} dateTime - a datetime string in YYYY-MM-DD format
   * @param {string | null} fileName - the temporary file name
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
   * @param {string} logsDir - the absolute path to the logs directory
   * @param {string} fileName - the name of the file
   * @returns an absolute path for the file path of the log file
   */
  buildFilePath(logsDir: string, fileName: string): string {
    return `${logsDir}/${fileName}`;
  },

  /**
   * Main function for writing a message to a file
   * @param {string} filePath - absolute path to where file will be written
   * @param {string} messageTemplate - message written in file
   * @returns a Promise containing the message
   */
  triggerLogger(
    filePath: string,
    messageTemplate: MessageTemplate
  ): Promise<string> {
    console.log(messageTemplate.message);

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
