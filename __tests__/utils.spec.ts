import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

import { TEST_LOG_DIR } from "./config";
import { buildDateTimeString, doReadDir } from "../src/utils";

import { SimpleLogger } from "../src/simple-logger";

const testLogsDir = join(__dirname, TEST_LOG_DIR);
const logger = SimpleLogger.getLogger("my-logger", {
  logsDirPath: testLogsDir,
  fileNameTemplate: "basic-test",
});

describe("#utils", () => {
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
    unlinkSync(testFilePath);
    global.Date.now = realDate;
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
