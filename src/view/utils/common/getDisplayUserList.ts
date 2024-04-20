import { getMultipleValuesInput } from "../../../common/utils";
import { Collection } from "../../../converters/types";

export const getDisplayUserList = (
  data: Record<string, Record<string, Collection>>
) => {
  const usersToHide = getMultipleValuesInput("HIDE_USERS") || [];
  const usersToShow = getMultipleValuesInput("SHOW_USERS") || [];

  return Object.keys(data)
    .filter((key) => key !== "total")
    .sort((a, b) => a.localeCompare(b))
    .concat("total")
    .filter((key) => {
      return (
        !usersToHide.includes(key) &&
        (usersToShow.length > 0 ? usersToShow.includes(key) : true)
      );
    });
};
