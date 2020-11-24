import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

import { TEST_LOG_DIR } from "./config";
import { doReadFile, doReadDir } from "./test-helpers";

import BasicLogger from "../src/simple-logger";

describe("#BasicBasicLogger", () => {
  const testLogsDir = join(__dirname, TEST_LOG_DIR);
  const testFilePath = join(testLogsDir, "basic-test.json");

  beforeAll(() => {
    if (!existsSync(testLogsDir)) {
      mkdirSync(join(__dirname, "logs"));
    }
    const options = {
      logsDirPath: testLogsDir,
      fileNameTemplate: "basic-test.json",
    };
    BasicLogger.triggerLogger(options, { message: "Hello world!" });
  });

  afterAll(() => {
    unlinkSync(testFilePath);
  });

  it("should open a new JSON file when called", async (done) => {
    const data = await doReadFile(testFilePath);

    expect(data).toBeDefined();
    done();
  });

  it("should contain an expected JSON in file", async (done) => {
    const data = await doReadFile(testFilePath);
    const expectedResult = JSON.stringify({
      message: "Hello world!",
    });

    expect(data).toBe(expectedResult);
    done();
  });

  it("should open two files if BasicLogger triggered twice", async () => {
    const options = {
      logsDirPath: testLogsDir,
      fileNameTemplate: "another-test.json",
    };
    BasicLogger.triggerLogger(options, {
      message: "Hi again, world!",
    });

    const files = await doReadDir(join(testLogsDir));
    expect(files).toHaveLength(2);
    expect(files).toContain("another-test.json");
    expect(files).toContain("basic-test.json");

    unlinkSync(join(testLogsDir, "another-test.json"));
  });

  it("should overwrite file if it already exists", async () => {
    const options = {
      logsDirPath: testLogsDir,
      fileNameTemplate: "basic-test.json",
    };
    BasicLogger.triggerLogger(options, { message: "Holà!!!!" });

    const data = await doReadFile(testFilePath);
    const expectedResult = JSON.stringify({
      message: "Holà!!!!",
    });

    expect(data).toBe(expectedResult);
  });
});
