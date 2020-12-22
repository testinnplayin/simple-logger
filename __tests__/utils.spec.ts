import { join } from "path";

import { TEST_LOG_DIR } from "./config";

import { cleanUpTestFiles, setUpTestFile } from "./test-helpers";
import { buildDateTimeString, doReadDir } from "../src/utils";

import { SimpleLogger } from "../src/modules/simple-logger";

const testLogsDir = join(__dirname, TEST_LOG_DIR);
const logger = new SimpleLogger("my-logger", {
  logsDirPath: testLogsDir,
  fileNameTemplate: "basic-test",
});

describe("#utils", () => {
  beforeAll(() => {
    setUpTestFile(logger, testLogsDir);
  });

  afterAll(() => {
    cleanUpTestFiles(testLogsDir);
  });

  it("should return a date string in YYYY-MM-DD format (day less than 10, month more than 10)", () => {
    const date = new Date("October 05, 2020");
    const expectedDate = "2020-10-05";
    const result = buildDateTimeString(date);
    expect(result).toBe(expectedDate);
  });

  it("should return a date string in YYYY-MM-DD format (day more than 10, month more than 10)", () => {
    const date = new Date("October 15, 2020");
    const expectedDate = "2020-10-15";
    const result = buildDateTimeString(date);
    expect(result).toBe(expectedDate);
  });

  it("should return a date string in YYYY-MM-DD format (day more than 10, month less than 10)", () => {
    const date = new Date("May 15, 2020");
    const expectedDate = "2020-05-15";
    const result = buildDateTimeString(date);
    expect(result).toBe(expectedDate);
  });

  it("should return a date string in YYYY-MM-DD format (day less than 10, month less than 10)", () => {
    const date = new Date("May 5, 2020");
    const expectedDate = "2020-05-05";
    const result = buildDateTimeString(date);
    expect(result).toBe(expectedDate);
  });

  it("should read a directory correctly", async () => {
    const files = await doReadDir(testLogsDir);

    expect(files).toHaveLength(1);
  });
});
