import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

import { TEST_LOG_DIR } from "./config";
import { doReadFile } from "./test-helpers";
import { doReadDir } from "../src/utils";

import logger from "../src/simple-logger";

describe("#BasicLogger", () => {
  const testLogsDir = join(__dirname, TEST_LOG_DIR);
  const testFilePath = join(testLogsDir, "basic-test.json");
  const realDate = Date.now;

  beforeAll(() => {
    if (!existsSync(testLogsDir)) {
      mkdirSync(join(__dirname, "logs"));
    }
    global.Date.now = jest.fn(() => new Date("2019-04-07T10:20:30Z").getTime());
    logger.triggerLogger(testFilePath, { message: "Hello world!" });
  });

  afterAll(() => {
    unlinkSync(testFilePath);
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
    logger.triggerLogger(join(testLogsDir, "another-test.json"), {
      message: "Hi again, world!",
    });

    const files = await doReadDir(join(testLogsDir));
    expect(files).toHaveLength(2);
    expect(files).toContain("another-test.json");
    expect(files).toContain("basic-test.json");

    unlinkSync(join(testLogsDir, "another-test.json"));
  });

  it("should build a file path from the logs directory and the file path name", () => {
    const expectedFilePath = `${testLogsDir}/my-test-file.json`;
    const result = logger.buildFilePath(testLogsDir, "my-test-file.json");

    expect(result).toBe(expectedFilePath);
  });

  it("should build a default file name with date, file number and extension", async () => {
    const expectedFileName = "my_file-2020-10-05-1.json";
    const result = await logger.buildFileName("2020-10-05", testLogsDir, null);

    expect(result).toBe(expectedFileName);
  });

  it("should build a json file if file name with date, file number and extension", async () => {
    const expectedFileName = "basic-test-2020-10-05-1.json";
    const result = await logger.buildFileName(
      "2020-10-05",
      testLogsDir,
      "basic-test"
    );

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
});
