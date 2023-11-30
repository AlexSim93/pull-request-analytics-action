import * as core from "@actions/core";

export const startOfWorkingTime =
  process.env.START_CORE_HOURS || core.getInput("START_CORE_HOURS");
export const endOfWorkingTime =
  process.env.END_CORE_HOURS || core.getInput("END_CORE_HOURS");
export const extremumValuesPercent = 10;
