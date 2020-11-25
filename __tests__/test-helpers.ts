/**
 * Contains helpers for tests
 *
 * Author: R.Wood
 * 23/11/2020
 */

import { readFile } from "fs";

/**
 * reads file at given test filepath
 * @param testFilePath - the test file's filepath
 * @returns a promise
 */
function doReadFile(testFilePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(
      testFilePath,
      { encoding: "utf8" },
      (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) reject(err);
        return resolve(data);
      }
    );
  });
}

export { doReadFile };