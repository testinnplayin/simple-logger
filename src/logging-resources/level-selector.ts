/**
 * LevelSelector class module, handles everything related to levels
 *
 * @author R.Wood
 * Date: 11/12/2020
 */

import { LogLevels } from "../enums/log-levels";

/**
 * @class LevelSelector
 *
 * Determines whether level of message entails writing it to a file
 *
 * @property level - DEBUG, INFO, WARNING, or ERROR
 * @property levelOrder (static and private) - an array showing priority of writing to file based on level (DEBUG is most permissive, ERROR is most restrictive)
 */
export class LevelSelector {
  level: LogLevels;
  private static levelOrder: LogLevels[] = [
    LogLevels.DEBUG,
    LogLevels.INFO,
    LogLevels.WARNING,
    LogLevels.ERROR,
  ];

  constructor(level: LogLevels) {
    this.level = level;
  }

  /**
   * Check level in message against level in logger
   * @param levelToCheck - the level of the message
   * @returns true if the logger should write to file, false if not
   */
  checkLevel(levelToCheck: LogLevels | undefined): boolean {
    if (!levelToCheck) {
      levelToCheck = LogLevels.INFO;
    }
    return LevelSelector.levelOrder.indexOf(levelToCheck) >=
      LevelSelector.levelOrder.indexOf(this.level)
      ? true
      : false;
  }
}
