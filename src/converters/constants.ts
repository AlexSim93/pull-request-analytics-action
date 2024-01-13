import { getValueAsIs } from "../common/utils";

export const startOfWorkingTime = getValueAsIs("CORE_HOURS_START");
export const endOfWorkingTime = getValueAsIs("CORE_HOURS_END");
export const percentile = parseInt(getValueAsIs("PERCENTILE"));
export const invalidUserLogin = "Invalid-User-PRAA";
