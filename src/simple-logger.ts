import { writeFile } from "fs";

interface MessageTemplate {
  message: string;
}

export default {
  triggerLogger(
    filePath: string,
    messageTemplate: MessageTemplate
  ): Promise<any> {
    console.log(messageTemplate.message);

    return new Promise((resolve, reject) => {
      writeFile(
        filePath,
        JSON.stringify(messageTemplate),
        () => (err: any, data: any) => {
          if (err) reject(err);

          resolve(data);
        }
      );
    });
  },
};
