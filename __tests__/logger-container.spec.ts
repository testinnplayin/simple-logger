import { join } from "path";

import { LoggerContainer } from "../src/modules/logger-container";
import { SimpleLogger } from "../src/modules/simple-logger";
import { TEST_LOG_DIR } from "./config";

describe("#LoggerContainer", () => {
  const loggers = new LoggerContainer();

  afterEach(() => {
    loggers.loggers = [];
  });

  it("should throw an error if logger container is empty and try to fetch one", () => {
    expect(() => loggers.getLogger("foo")).toThrowError(
      "Cannot find logger of name foo"
    );
  });

  it("should add a logger to the logger container", () => {
    const newLogger = new SimpleLogger("foo", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(newLogger);

    expect(loggers.loggers).toHaveLength(1);
  });

  it("should retrieve a newly added logger by logger name", () => {
    const newLogger = new SimpleLogger("foo", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(newLogger);

    const logger = loggers.getLogger("foo");

    expect(logger).toBeDefined();
    expect(logger.loggerName).toBe("foo");
  });

  it("should allow addition of more than one logger", () => {
    const newLogger = new SimpleLogger("foo", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(newLogger);

    const anotherNewLogger = new SimpleLogger("bar", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(anotherNewLogger);

    expect(loggers.loggers).toHaveLength(2);
  });

  it("should allow retrieval of new logger if more than one logger in the loggers list", () => {
    const newLogger = new SimpleLogger("foo", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(newLogger);

    const anotherNewLogger = new SimpleLogger("bar", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(anotherNewLogger);

    const newestLogger = loggers.getLogger("bar");

    expect(newestLogger).toBeDefined();
    expect(newestLogger.loggerName).toBe("bar");
  });

  it("should return an error if has several loggers but incorrect logger name", () => {
    const newLogger = new SimpleLogger("foo", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(newLogger);

    const anotherNewLogger = new SimpleLogger("bar", {
      logsDirPath: join(__dirname, TEST_LOG_DIR),
    });
    loggers.addLogger(anotherNewLogger);

    expect(() => loggers.getLogger("baz")).toThrowError(
      "Cannot find logger of name baz"
    );
  });
});
