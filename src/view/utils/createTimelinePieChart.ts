import { createPieChart } from "./common";
import { Collection } from "../../converters/types";

const titleMap = {
  reviewTimeIntervals: "Review time",
  approvalTimeIntervals: "Approval time",
  mergeTimeIntervals: "Merge time",
};

export const createTimelinePieChart = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string,
  key: "reviewTimeIntervals" | "approvalTimeIntervals" | "mergeTimeIntervals"
) => {
  return users
    .map((user) => ({
      user,
      values: data[user][date]?.[key],
    }))
    .filter(
      (types) =>
        types.values && Object.values(types.values).some((value) => value)
    )
    .map((data) => {
      const values = Object.entries(data.values!)
        .filter(([key, value]) => value)
        .reduce((acc, value) => {
          return {
            ...acc,
            [`${value[0].replace("-Infinity", "+")} hours`]: value[1],
          };
        }, {});
      return createPieChart(`${titleMap[key]} ${data.user} ${date}`, values);
    })
    .join("\n");
};
