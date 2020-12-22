/**
 * @module test-helpers
 *
 * Contains helpers for tests
 *
 * @author R.Wood
 * Date: 23/11/2020
 *
 * @requires fs from Node.js cf. https://nodejs.org/dist/latest-v14.x/docs/api/fs.html
 * @requires join from path module of Node.js cf. https://nodejs.org/dist/latest-v14.x/docs/api/path.html
 * @requires SimpleLogger @see module:simple-logger
 */

import { existsSync, mkdirSync, readFile, rmdirSync } from "fs";
import { join } from "path";

import { BASE_TEST_FILE_NAME } from "./config";

import { SimpleLogger } from "../src/modules/simple-logger";

/** store real Date.now inside realDate for eliminating test stub */
const realDate = Date.now;

/**
 * @function cleanUpTestFiles - clean up any remaining test files nad test log directory
 * @param testLogsDir - the directory path to the test logs directory
 */
function cleanUpTestFiles(testLogsDir: string): void {
  rmdirSync(testLogsDir, { recursive: true });

  global.Date.now = realDate;
}

/**
 * @function testFilePath - reads file at given test filepath
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
 * @function setUpTestFile - set up the primary test file
 * @param logger - pass primary test logger for writing file
 * @param testLogsDir - directory path to test logs
 */
function setUpTestFile(logger: SimpleLogger, testLogsDir: string): void {
  const testFilePath = join(testLogsDir, `${BASE_TEST_FILE_NAME}-1.json`);

  if (!existsSync(testLogsDir)) {
    mkdirSync(join(__dirname, "logs"));
  }

  global.Date.now = jest.fn(() => new Date("2019-04-07T10:20:30Z").getTime());

  logger.writeOutLog(testFilePath, { message: "Hello world!" });
}

export { cleanUpTestFiles, doReadFile, setUpTestFile };
