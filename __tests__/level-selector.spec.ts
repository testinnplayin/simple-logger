import { LogLevels } from "../src/enums/log-levels";
import { LevelSelector } from "../src/logging-resources/level-selector";

describe("#LevelSelector", () => {
  it("should return true if logger level is DEBUG and message level is DEBUG", () => {
    const levelSelector: LevelSelector = new LevelSelector(LogLevels.DEBUG);

    const result = levelSelector.checkLevel(LogLevels.DEBUG);

    expect(result).toBe(true);
  });

  it("should return true if logger level is DEBUG and message level is ERROR", () => {
    const levelSelector: LevelSelector = new LevelSelector(LogLevels.DEBUG);

    const result = levelSelector.checkLevel(LogLevels.ERROR);

    expect(result).toBe(true);
  });

  it("should return false if logger level is ERROR and message level is WARNING", () => {
    const levelSelector: LevelSelector = new LevelSelector(LogLevels.ERROR);

    const result = levelSelector.checkLevel(LogLevels.WARNING);

    expect(result).toBe(false);
  });

  it("should return true if logger level is ERROR and message level is ERROR", () => {
    const levelSelector: LevelSelector = new LevelSelector(LogLevels.ERROR);

    const result = levelSelector.checkLevel(LogLevels.ERROR);

    expect(result).toBe(true);
  });
});
