import { createPieChart, createTable } from "./common";
import { Collection } from "../../converters/types";
import { getValueAsIs } from "../../common/utils";

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
  if (getValueAsIs("USE_CHARTS") === "true") {
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
  }
  const headers = Object.keys(data.total[date]?.[key] || {});
  if (headers.length === 0) return "";
  const userRows = users
    .filter(
      (user) =>
        data[user][date]?.[key] &&
        Object.values(data[user][date]?.[key]!).some((value) => value)
    )
    .map((user) => {
      const total = headers.reduce(
        (acc, header) => acc + (data[user][date]?.[key]?.[header] || 0),
        0
      );
      return [
        `**${user}**`,
        ...headers.map((header) =>
          data[user][date]?.[key]?.[header]
            ? `${data[user][date]?.[key]?.[header]?.toString() || "0"}(${
                Math.round(
                  ((data[user][date]?.[key]?.[header] || 0) / total) * 1000
                ) / 10
              }%)`
            : "0"
        ),
      ];
    });
  return createTable({
    title: `${titleMap[key]} ${date}`,
    description: "",
    table: {
      headers: [
        "users",
        ...headers.map((header) => `${header.replace("-Infinity", "+")}h`),
      ],
      rows: userRows,
    },
  });
};
