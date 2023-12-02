import * as core from "@actions/core";

export const startOfWorkingTime =
  process.env.CORE_HOURS_START || core.getInput("CORE_HOURS_START");
export const endOfWorkingTime =
  process.env.CORE_HOURS_END || core.getInput("CORE_HOURS_END");
export const extremumValuesPercent = 10;
