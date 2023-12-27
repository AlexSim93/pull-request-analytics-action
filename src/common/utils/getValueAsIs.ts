import * as core from "@actions/core";

export const getValueAsIs = (name: string) => {
  return process.env[name]?.trim() || core.getInput(name)?.trim();
};
