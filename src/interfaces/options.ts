/**
 * @module options - Options interface
 *
 * @author R.Wood
 * Date: 28/11/2020
 *
 * @requires LogLevels @see module:log-levels
 */

import { LogLevels } from "../enums/log-levels";

/**
 * @interface Options - shape that logger options should take
 *
 * @property level - optional level that logger starts writing files out to; one of INFO, DEBUG, WARNING or ERROR, by default INFO
 * @property fileNameTemplate - the template for the file name; by default 'my_file'
 * @property hasColor - if true, logs messages in pretty colors to console; by default is false
 * @property logsDirPath - the path to the directory containingn the logs; required
 */
export interface Options {
  level?: LogLevels;

  fileNameTemplate?: string;

  hasColor?: boolean;

  logsDirPath: string;
}
