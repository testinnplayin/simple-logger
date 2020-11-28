/**
 * Contains utility functions
 *
 * Author: R.Wood
 * 25/11/2020
 */

import { readdir } from "fs";

function buildDateTimeString(date: Date): string {
  const today = new Date(date);

  // we have to add a 0 in our string for the day/month if day/month is less than 10
  let day: number | string = today.getDate();
  let month: number | string = today.getMonth() + 1;
  if (day < 10) {
    day = `0${day}`;
  }

  if (month < 10) {
    month = `0${month}`;
  }

  return `${today.getFullYear()}-${month}-${day}`;
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

export { buildDateTimeString, doReadDir };
