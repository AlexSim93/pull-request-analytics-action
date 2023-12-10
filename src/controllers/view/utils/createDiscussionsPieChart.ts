import { createPieChart } from ".";
import { Collection } from "../../data/preparations/types";

export const createDiscussionsPieChart = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  return users
    .map((user) => ({ user, values: data[user][date]?.discussionsTypes }))
    .filter(
      (types) =>
        types.values &&
        Object.values(types.values).some((value) => value.received?.total)
    )
    .map((data) => {
      const values = Object.entries(data.values!)
        .filter(([key, value]) => value.received?.total)
        .reduce((acc, value) => {
          return {
            ...acc,
            [value[0]]: value[1].received?.total,
          };
        }, {});
      return createPieChart(`Discussion's types ${data.user} ${date}`, values);
    })
    .join("\n");
};
