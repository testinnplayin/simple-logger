/**
 * Contains helpers for tests
 *
 * Author: R.Wood
 * 23/11/2020
 */

import { readdir, readFile } from "fs";

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

/**
 * reads contents of given directory
 * @param dirPath - the test directory path
 * @returns a promise
 */
function doReadDir(dirPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(dirPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
      if (err) reject(err);
      return resolve(files);
    });
  });
}

export { doReadFile, doReadDir };
