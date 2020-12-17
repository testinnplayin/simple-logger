/**
 * @module message-template - Message template interface for the logger
 *
 * @author R.Wood
 * Date: 28/11/2020
 * 
 * @requires LogLevels @see module:log-levels
 */

import { LogLevels } from "../enums/log-levels";

/**
 * @interface MessageTemplate - template for a SimpleLogger message
 *
 * @property timestamp - timestamp in UTC ISODate format
 * @property level - log level, by default 'INFO'
 * @property message - actual text message
 */
export interface MessageTemplate {
  timestamp?: string;

  level?: LogLevels;

  message: string;
}
