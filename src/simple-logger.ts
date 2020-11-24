import { writeFile } from "fs";

interface MessageTemplate {
  message: string;
}

export default class BasicLogger {
  options: any = {};

  constructor(options: any) {
    this.options = options;
  }

  buildFilePath(logsDirPath: string, fileNameTemplate: string): string {
    return `${logsDirPath}/${fileNameTemplate}`;
  }

  static triggerLogger(
    // filePath: string,
    options: any,
    messageTemplate: MessageTemplate
  ): Promise<string> {
    console.log(messageTemplate.message);
    const newLogger = new BasicLogger(options);
    const filePath = newLogger.buildFilePath(
      options.logsDirPath,
      options.fileNameTemplate
    );

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
  }
}
