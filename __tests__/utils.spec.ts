import { buildDateTimeString } from "../src/utils";

describe("#utils", () => {
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
});
