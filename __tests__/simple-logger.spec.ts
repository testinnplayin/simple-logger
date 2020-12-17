import { existsSync, mkdirSync, rmdirSync } from "fs";
import { join } from "path";

import { TEST_LOG_DIR } from "./config";
import { doReadFile } from "./test-helpers";
import { doReadDir } from "../src/utils";

import { LogLevels } from "../src/enums/log-levels";

import { SimpleLogger } from "../src/simple-logger";
import { LogColors } from "../src/logging-resources/log-colors";

const testLogsDir = join(__dirname, TEST_LOG_DIR);

const logger = SimpleLogger.getLogger("test-logger", {
  fileNameTemplate: "basic-test",
  hasColor: true,
  logsDirPath: testLogsDir,
});

const noColorsLogger = SimpleLogger.getLogger("another-logger", {
  fileNameTemplate: "no-colors-test",
  logsDirPath: testLogsDir
});

describe("#BasicLogger", () => {
  const testFilePath = join(testLogsDir, "basic-test-2019-04-07-1.json");
  const realDate = Date.now;

  beforeAll(() => {
    if (!existsSync(testLogsDir)) {
      mkdirSync(join(__dirname, "logs"));
    }
    global.Date.now = jest.fn(() => new Date("2019-04-07T10:20:30Z").getTime());
    logger.writeOutLog(testFilePath, { message: "Hello world!" });
  });

  afterAll(() => {
    rmdirSync(testLogsDir, { recursive: true });

    global.Date.now = realDate;
  });

  it("should open a new JSON file when called", async () => {
    const data = await doReadFile(testFilePath);

    expect(data).toBeDefined();
  });

  it("should contain an expected JSON in file", async () => {
    const data = await doReadFile(testFilePath);
    const result = JSON.parse(data);

    const expectedResult = {
      message: "Hello world!",
      timestamp: "2019-04-07T10:20:30.000Z",
      level: "INFO",
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it("should open two files if logger triggered twice", async () => {
    logger.writeOutLog(join(testLogsDir, "basic-test-2019-04-07-2.json"), {
      message: "Hi again, world!",
    });

    const files = await doReadDir(join(testLogsDir));
    expect(files).toHaveLength(2);
    expect(files).toContain("basic-test-2019-04-07-2.json");
    expect(files).toContain("basic-test-2019-04-07-1.json");
  });

  it("should build a file path from the logs directory and the file path name", () => {
    const expectedFilePath = `${testLogsDir}/my-test-file.json`;
    const result = logger.buildFilePath("my-test-file.json");

    expect(result).toBe(expectedFilePath);
  });

  it("should build a default file name with date, file number and extension", async () => {
    const logger2 = SimpleLogger.getLogger("logger2", {
      logsDirPath: testLogsDir,
    });
    const expectedFileName = "my_file-2020-10-05-1.json";
    const result = await logger2.buildFileName("2020-10-05");

    expect(result).toBe(expectedFileName);
  });

  it("should build a json file if file name with date, file number and extension", async () => {
    const expectedFileName = "basic-test-2020-10-05-1.json";
    const result = await logger.buildFileName("2020-10-05");

    expect(result).toBe(expectedFileName);
  });

  it("should build a message with timestamp, log level and message", () => {
    const result = logger.buildMessage({ message: "Oops" });
    const expectedResult = {
      message: "Oops",
      timestamp: "2019-04-07T10:20:30.000Z",
      level: "INFO",
    };

    expect(result).toStrictEqual(expectedResult);
  });

  it("should trigger writeOutLog if triggerLogger is called", async () => {
    const buildFileNameSpy = jest.spyOn(logger, "buildFileName");
    const buildFilePathSpy = jest.spyOn(logger, "buildFilePath");
    const writeOutLogSpy = jest.spyOn(logger, "writeOutLog");

    await logger.triggerLogger({
      message: "Hi there!",
      level: LogLevels.INFO,
    });

    expect(buildFileNameSpy).toBeCalledTimes(1);
    expect(buildFilePathSpy).toBeCalledTimes(1);
    expect(writeOutLogSpy).toBeCalledTimes(1);
  });

  it("should not log DEBUG level messages if logger is set to log INFO", async () => {
    await logger.triggerLogger({
      message: "Aloha there!",
      level: LogLevels.DEBUG,
    });
    const expectedFileName = "my_file-2019-04-07-1.json";

    const files = await doReadDir(testLogsDir);

    expect(files).not.toContain(expectedFileName);
  });

  it("should log ERROR level messages if logger is set to log INFO", async () => {
    await logger.triggerLogger({
      message: "Bonjour!",
      level: LogLevels.ERROR,
    });
    const expectedFileName = "basic-test-2019-04-07-4.json";
    const expectedResult = {
      message: "Bonjour!",
      timestamp: "2019-04-07T10:20:30.000Z",
      level: "ERROR",
    };

    const files = await doReadDir(testLogsDir);
    const data = await doReadFile(join(testLogsDir, expectedFileName));

    expect(files).toContain(expectedFileName);
    expect(JSON.parse(data)).toStrictEqual(expectedResult);
  });

  it("should log something in green if 'INFO' method used and if options set to colorized", async () => {
    const infoSpy = jest.spyOn(LogColors, "INFO");
    const triggerSpy = jest.spyOn(logger, 'triggerLogger');

    const testMsg = "Hai there!";

    await logger.info(testMsg);

    expect(infoSpy).toBeCalledWith(testMsg);
    expect(triggerSpy).toBeCalledWith({
      message: testMsg,
      level: LogLevels.INFO,
      timestamp: "2019-04-07T10:20:30.000Z",
    });
  });

  it("should log something in default color if 'INFO' method used and if options set to not colorized", async () => {
    const infoSpy = jest.spyOn(LogColors, "INFO");

    const testMsg = "Hello world!";

    await noColorsLogger.info(testMsg);

    expect(infoSpy).not.toBeCalled();
  });

  it("should log something in blue if 'DEBUG' method used and if options set to colorized", () => {
    const debugSpy = jest.spyOn(LogColors, "DEBUG");
    const triggerSpy = jest.spyOn(logger, "triggerLogger");

    const testMsg = "Hai there!";

    logger.debug(testMsg);

    expect(debugSpy).toBeCalledWith("Hai there!");
    expect(triggerSpy).toBeCalledWith({
      message: testMsg,
      level: LogLevels.DEBUG
    });
  });

  it("should log something in default color if 'DEBUG' method used and if options set to not colorized", async () => {
    const debugSpy = jest.spyOn(LogColors, "DEBUG");

    const testMsg = "Hello world!";

    await noColorsLogger.debug(testMsg);

    expect(debugSpy).not.toBeCalled();
  });

  it("should log something in red if 'ERROR' method used and if options set to colorized", async () => {
    const errorSpy = jest.spyOn(LogColors, "ERROR");
    const triggerSpy = jest.spyOn(logger, "triggerLogger");

    const testMsg = "Hai there!";

    await logger.error(testMsg);

    expect(errorSpy).toBeCalledWith(testMsg);
    expect(triggerSpy).toBeCalledWith({
      message: testMsg,
      level: LogLevels.ERROR,
      timestamp: "2019-04-07T10:20:30.000Z"
    });
  });

  it("should log something in default color if 'ERROR' method used and if options set to not colorized", async () => {
    const errorSpy = jest.spyOn(LogColors, "ERROR");

    const testMsg = "Hello world!";

    await noColorsLogger.error(testMsg);

    expect(errorSpy).not.toBeCalled();
  });

  it("should log something in orange if 'WARNING' method used and if options set to colorized", async () => {
    const warnSpy = jest.spyOn(LogColors, "WARNING");
    const triggerSpy = jest.spyOn(logger, "triggerLogger");

    const testMsg = "Hai there!";

    await logger.warning(testMsg);

    expect(warnSpy).toBeCalledWith(testMsg);
    expect(triggerSpy).toBeCalledWith({
      message: testMsg,
      level: LogLevels.WARNING,
      timestamp: "2019-04-07T10:20:30.000Z",
    });
  });

  it("should log something in default color if 'WARNING' method used and if options set to not colorized", async () => {
    const warningSpy = jest.spyOn(LogColors, "WARNING");

    const testMsg = "Hello world!";

    await noColorsLogger.warning(testMsg);

    expect(warningSpy).not.toBeCalled();
  });
});
