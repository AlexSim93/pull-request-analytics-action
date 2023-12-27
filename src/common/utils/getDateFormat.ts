import { getValueAsIs } from "./getValueAsIs";
import { dateFormats } from "../constants";

export const getDateFormat = () => {
  const input = getValueAsIs("PERIOD_SPLIT_UNIT") as keyof typeof dateFormats;
  return dateFormats[input];
};
