import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

import { TEST_LOG_DIR } from "./config";
import { buildDateTimeString, doReadDir } from "../src/utils";

import logger from "../src/simple-logger";

describe("#utils", () => {
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

  it("should return a date string in YYYY-MM-DD format (less than 10)", () => {
    const date = new Date("October 05, 2020");
    const expectedDate = "2020-10-05";
    const result = buildDateTimeString(date);
    expect(result).toBe(expectedDate);
  });

  it("should return a date string in YYYY-MM-DD format (more than 10)", () => {
    const date = new Date("October 15, 2020");
    const expectedDate = "2020-10-15";
    const result = buildDateTimeString(date);
    expect(result).toBe(expectedDate);
  });

  it("should read a directory correctly", async () => {
    const files = await doReadDir(testLogsDir);

    expect(files).toHaveLength(1);
  });
});
