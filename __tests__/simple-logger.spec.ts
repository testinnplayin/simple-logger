import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

import { TEST_LOG_DIR } from "./config";
import { doReadFile } from "./test-helpers";

import logger from "../src/simple-logger";

describe("#BasicLogger", () => {
  const testLogsDir = join(__dirname, TEST_LOG_DIR);
  const testFilePath = join(testLogsDir, "basic-test.json");

  beforeAll(() => {
    if (!existsSync(testLogsDir)) {
      mkdirSync(join(__dirname, "logs"));
    }
    logger.triggerLogger(testFilePath, { message: "Hello world!" });
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
});
