import { writeFile } from "fs";

interface MessageTemplate {
  message: string;
}

export default {
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
