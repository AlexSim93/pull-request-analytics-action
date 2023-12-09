import * as core from "@actions/core";

export const getMultipleValuesInput = (name: string) => {
  const values = process.env[name] || core.getInput(name);
  return values
    .split(",")
    .map((el) => el.trim())
    .filter((el) => el);
};
