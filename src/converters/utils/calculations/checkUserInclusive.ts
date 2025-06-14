import { getMultipleValuesInput } from "../../../common/utils";
export const checkUserInclusive = (name: string) => {
  if (
    getMultipleValuesInput("EXCLUDE_USERS").length === 0 &&
    getMultipleValuesInput("INCLUDE_USERS").length === 0
  ) {
    return true;
  }
  if (
    getMultipleValuesInput("EXCLUDE_USERS").length > 0 &&
    getMultipleValuesInput("EXCLUDE_USERS").includes(name)
  ) {
    return false;
  }
  return getMultipleValuesInput("INCLUDE_USERS").length > 0
    ? getMultipleValuesInput("INCLUDE_USERS").includes(name)
    : true;
};
