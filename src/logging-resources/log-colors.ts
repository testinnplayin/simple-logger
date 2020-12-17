/**
 * @module log-colors - contains color associations for log levels
 *
 * @author R.Wood
 * Date: 16/12/2020
 *
 * @requires chalk, cf. https://www.npmjs.com/package/chalk
 */

import chalk from "chalk";

/**
 * @namespace LogColors
 * Contains color to log level associations to put colors in the console
 * @property DEBUG - blue
 * @property ERROR - red
 * @property INFO - green
 * @property WARNING - orange
 */
export const LogColors = {
  DEBUG: chalk.keyword("blue"),
  ERROR: chalk.keyword("red"),
  INFO: chalk.keyword("green"),
  WARNING: chalk.keyword("orange"),
};
