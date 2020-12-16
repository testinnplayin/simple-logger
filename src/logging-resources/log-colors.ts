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