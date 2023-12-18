import * as core from "@actions/core";

export const setTimezone = () => {
  if (process.env.TIMEZONE || core.getInput("TIMEZONE")) {
    process.env.TZ = process.env.TIMEZONE || core.getInput("TIMEZONE");
  }
};
