import { readFile } from "fs";

function doReadFile(testFilePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    readFile(testFilePath, { encoding: "utf8" }, (err: any, data: string) => {
      if (err) reject(err);
      return resolve(data);
    });
  });
}

export { doReadFile };
